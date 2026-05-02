import os
import numpy as np
import torch
import torch.nn as nn

from utils.emotion_labels import normalize_emotion

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

EMOTION_NAMES = [
    "Neutral", "Happy", "Sad",
    "Anger", "Fear", "Disgust", "Surprise"
]

# Skeleton input shape constants
EXPECTED_SKELETON_FRAMES = 20
MIN_SKELETON_FRAMES      = 4   # must survive 2× temporal max-pool of stride 2


# =============================================================================
# Model architecture
# =============================================================================
class Graph:
    def __init__(self):
        self.edge = [(i, i) for i in range(33)] + [
            (0,1),(1,2),(2,3),(3,7),(0,4),(4,5),(5,6),(6,8),
            (9,10),(11,12),(11,13),(13,15),(15,17),(15,19),
            (15,21),(17,19),(12,14),(14,16),(16,18),(16,20),
            (16,22),(18,20),(11,23),(12,24),(23,24),(23,25),
            (25,27),(27,29),(29,31),(27,31),(24,26),(26,28),
            (28,30),(30,32),(28,32)
        ]
        self.A = self.get_adjacency()

    def get_adjacency(self):
        adj = np.zeros((33, 33))
        for i, j in self.edge:
            adj[i, j] = adj[j, i] = 1
        Dl = np.sum(adj, 0)
        Dn = np.zeros((33, 33))
        for i in range(33):
            if Dl[i] > 0:
                Dn[i, i] = Dl[i] ** (-1)
        return np.dot(adj, Dn)


class AdaptiveGraphConv(nn.Module):
    def __init__(self, in_c, out_c, A):
        super().__init__()
        self.PA    = nn.Parameter(torch.from_numpy(A.astype(np.float32)))
        self.alpha = nn.Parameter(torch.zeros(A.shape))
        self.conv  = nn.Conv2d(in_c, out_c, 1)
        self.bn    = nn.BatchNorm2d(out_c)
        self.relu  = nn.ReLU()

    def forward(self, x):
        A = self.PA + self.alpha
        z = self.conv(x)
        z = torch.einsum("nctv,vw->nctw", (z, A))
        return self.relu(self.bn(z))


class AGCN_Branch(nn.Module):
    def __init__(self, num_class=7, in_channels=9):
        super().__init__()
        A = Graph().A
        self.data_bn = nn.BatchNorm1d(in_channels * 33)
        self.l1 = AdaptiveGraphConv(in_channels, 64,  A)
        self.l2 = AdaptiveGraphConv(64,          64,  A)
        self.l3 = AdaptiveGraphConv(64,          128, A)
        self.l4 = AdaptiveGraphConv(128,         128, A)
        self.l5 = AdaptiveGraphConv(128,         256, A)
        self.fc   = nn.Linear(256, num_class)
        self.drop = nn.Dropout(0.5)

    def forward(self, x):
        N, C, T, V = x.size()
        x = x.permute(0, 3, 1, 2).contiguous().view(N, V * C, T)
        x = self.data_bn(x)
        x = x.view(N, V, C, T).permute(0, 2, 3, 1).contiguous()
        x = self.l1(x);  x = self.l2(x)
        x = torch.max_pool2d(x, (2, 1))
        x = self.l3(x);  x = self.l4(x)
        x = torch.max_pool2d(x, (2, 1))
        x = self.l5(x)
        x = torch.mean(x, (2, 3))
        x = self.drop(x)
        return self.fc(x)


class FusionNetwork(nn.Module):
    def __init__(self, num_class=7):
        super().__init__()
        self.skeleton_net   = AGCN_Branch(num_class)
        self.face_fc        = nn.Sequential(
            nn.Linear(7, 32), nn.ReLU(), nn.Linear(32, 7)
        )
        self.fusion_weight  = nn.Parameter(torch.tensor(0.5))

    def forward(self, skel, face):
        body_logits = self.skeleton_net(skel)
        face_logits = self.face_fc(face)
        w = torch.sigmoid(self.fusion_weight)
        return (w * body_logits) + ((1 - w) * face_logits)


class UltimateEnsemble(nn.Module):
    def __init__(self):
        super().__init__()
        self.model1 = FusionNetwork(num_class=7)
        self.model2 = FusionNetwork(num_class=7)
        self.model3 = FusionNetwork(num_class=7)

    def forward(self, skel, face):
        out1 = self.model1(skel, face)
        out2 = self.model2(skel, face)
        out3 = self.model3(skel, face)
        return (out1 + out2 + out3) / 3.0


# =============================================================================
# Model loading
# =============================================================================

def load_model(path: str) -> UltimateEnsemble:
    model = UltimateEnsemble()
    try:
        single_state = torch.load(path, map_location=DEVICE)
        new_state = {}
        for key, val in single_state.items():
            for m in ["model1", "model2", "model3"]:
                new_state[f"{m}.{key}"] = val
        model.load_state_dict(new_state, strict=False)
        print(f"Loaded ensemble model from {path}")
    except Exception as e:
        print(f"ERROR loading ensemble model: {e}")
    model.to(DEVICE)
    model.eval()
    return model


BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "ensemble_FER_gesture.pth")
model      = load_model(MODEL_PATH)


# =============================================================================
# Skeleton input validation and padding
# =============================================================================

def _validate_and_pad_skeleton(skeleton_input: np.ndarray) -> np.ndarray:
    """
    Ensure skeleton_input has a safe number of frames for the GCN.

    Expected input shape: (9, T, 33) — channels, time, joints.

    Rules:
      - If T < MIN_SKELETON_FRAMES: tile/repeat to reach MIN_SKELETON_FRAMES.
        Using np.tile is faithful to how extract_skeleton.py fills missing
        frames with zeros — consistent zero-padding.
      - If T > EXPECTED_SKELETON_FRAMES: truncate to EXPECTED_SKELETON_FRAMES.
        This prevents BatchNorm from seeing unusual sequence statistics at
        inference time vs. training time.
      - If T == EXPECTED_SKELETON_FRAMES: pass through unchanged.

    Args:
        skeleton_input: numpy array of shape (9, T, 33)

    Returns:
        numpy array of shape (9, T_safe, 33) where T_safe is in
        [MIN_SKELETON_FRAMES, EXPECTED_SKELETON_FRAMES].
    """
    channels, T, joints = skeleton_input.shape

    if T < MIN_SKELETON_FRAMES:
        # Tile along the time axis until we have enough frames, then truncate
        repeats = (MIN_SKELETON_FRAMES // T) + 1
        skeleton_input = np.tile(skeleton_input, (1, repeats, 1))
        skeleton_input = skeleton_input[:, :MIN_SKELETON_FRAMES, :]
        print(f"[WARN] Skeleton had only {T} frames — padded to {MIN_SKELETON_FRAMES}")

    elif T > EXPECTED_SKELETON_FRAMES:
        skeleton_input = skeleton_input[:, :EXPECTED_SKELETON_FRAMES, :]
        print(f"[WARN] Skeleton had {T} frames — truncated to {EXPECTED_SKELETON_FRAMES}")

    return skeleton_input


# =============================================================================
# Prediction function
# =============================================================================

def predict_face_gesture(
        face_input:     np.ndarray,
        skeleton_input: np.ndarray,
        face_probs:     np.ndarray
) -> dict:
    """
    Run the GCN + face probability ensemble and return a result dict.

    Args:
        face_input:     Face image numpy array (unused directly — kept for API compat).
        skeleton_input: Skeleton sequence of shape (9, T, 33).
        face_probs:     Face emotion probabilities array of shape (7,).

    Returns:
        dict with keys: "emotion", "confidence", "probabilities"
    """
    # Bug 7 fix: validate skeleton before tensor conversion
    skeleton_input = _validate_and_pad_skeleton(skeleton_input)

    skel = torch.tensor(skeleton_input, dtype=torch.float32).unsqueeze(0).to(DEVICE)
    face = torch.tensor(face_probs,     dtype=torch.float32).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        output = model(skel, face)
        prob   = torch.softmax(output, dim=1)
        pred   = torch.argmax(prob, dim=1).item()

    probs_array   = prob[0].cpu().numpy()
    raw_emotion   = EMOTION_NAMES[pred].lower()

    emotion       = normalize_emotion(raw_emotion)
    confidence    = float(probs_array[pred])

    # Build probability dict with canonical labels (Bug 1+5 fix applied here too)
    emotion_probs = {
        normalize_emotion(EMOTION_NAMES[i].lower()): float(probs_array[i])
        for i in range(len(EMOTION_NAMES))
    }

    return {
        "emotion":       emotion,
        "confidence":    confidence,
        "probabilities": emotion_probs,
    }
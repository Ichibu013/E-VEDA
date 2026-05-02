import torch
import torch.nn as nn
import numpy as np

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

EMOTION_NAMES = [
    "Neutral","Happy","Sad",
    "Anger","Fear","Disgust","Surprise"
]


# ==============================
# Graph Definition
# ==============================
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
        adj = np.zeros((33,33))
        for i,j in self.edge:
            adj[i,j] = adj[j,i] = 1

        Dl = np.sum(adj,0)
        Dn = np.zeros((33,33))

        for i in range(33):
            if Dl[i] > 0:
                Dn[i,i] = Dl[i]**(-1)

        return np.dot(adj, Dn)


# ==============================
# Graph Conv Layer
# ==============================
class AdaptiveGraphConv(nn.Module):

    def __init__(self, in_c, out_c, A):
        super().__init__()

        self.PA = nn.Parameter(torch.from_numpy(A.astype(np.float32)))
        self.alpha = nn.Parameter(torch.zeros(A.shape))

        self.conv = nn.Conv2d(in_c,out_c,1)
        self.bn = nn.BatchNorm2d(out_c)
        self.relu = nn.ReLU()

    def forward(self,x):

        A = self.PA + self.alpha
        z = self.conv(x)

        z = torch.einsum('nctv,vw->nctw',(z,A))

        return self.relu(self.bn(z))


# ==============================
# Skeleton Network
# ==============================
class AGCN_Branch(nn.Module):

    def __init__(self,num_class=7,in_channels=9):

        super().__init__()

        A = Graph().A

        self.data_bn = nn.BatchNorm1d(in_channels*33)

        self.l1 = AdaptiveGraphConv(in_channels,64,A)
        self.l2 = AdaptiveGraphConv(64,64,A)

        self.l3 = AdaptiveGraphConv(64,128,A)
        self.l4 = AdaptiveGraphConv(128,128,A)

        self.l5 = AdaptiveGraphConv(128,256,A)

        self.fc = nn.Linear(256,num_class)
        self.drop = nn.Dropout(0.5)

    def forward(self,x):

        N,C,T,V = x.size()

        x = x.permute(0,3,1,2).contiguous().view(N,V*C,T)

        x = self.data_bn(x)

        x = x.view(N,V,C,T).permute(0,2,3,1).contiguous()

        x = self.l1(x)
        x = self.l2(x)

        x = torch.max_pool2d(x,(2,1))

        x = self.l3(x)
        x = self.l4(x)

        x = torch.max_pool2d(x,(2,1))

        x = self.l5(x)

        x = torch.mean(x,(2,3))

        x = self.drop(x)

        return self.fc(x)


# ==============================
# Fusion Network
# ==============================
class FusionNetwork(nn.Module):
    def __init__(self, num_class=7):
        super().__init__()
        self.skeleton_net = AGCN_Branch(num_class)
        
        #  the Sequential block with 32 nodes 
        self.face_fc = nn.Sequential(
            nn.Linear(7, 32), 
            nn.ReLU(), 
            nn.Linear(32, 7)
        )
        
        self.fusion_weight = nn.Parameter(torch.tensor(0.5))

    def forward(self, skel, face):
        body_logits = self.skeleton_net(skel)
        face_logits = self.face_fc(face) # uses the 3-layer MLP
        w = torch.sigmoid(self.fusion_weight)
        return (w * body_logits) + ((1 - w) * face_logits)


# ==============================
# Master Ensemble Wrapper
# ==============================
class UltimateEnsemble(nn.Module):
    def __init__(self):
        super().__init__()
        # Initialize all 3 models internally so the parameter keys match exactly
        self.model1 = FusionNetwork(num_class=7)
        self.model2 = FusionNetwork(num_class=7)
        self.model3 = FusionNetwork(num_class=7)

    def forward(self, skel, face):
        # Soft voting: Average the logits from all 3 models
        out1 = self.model1(skel, face)
        out2 = self.model2(skel, face)
        out3 = self.model3(skel, face)
        return (out1 + out2 + out3) / 3.0


# ==============================
# Load Model
# ==============================
def load_model(path):
    model = UltimateEnsemble()
    try:
        single_state = torch.load(path, map_location=DEVICE)
        new_state = {}
        for key, val in single_state.items():
            for m in ['model1', 'model2', 'model3']:
                new_state[f"{m}.{key}"] = val
        model.load_state_dict(new_state, strict=False)
        print(f"Successfully loaded model from {path}")
    except Exception as e:
        print(f"ERROR loading Ensemble model: {e}")
    model.to(DEVICE)
    model.eval()
    return model

# Load model once when file starts
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "ensemble_FER_gesture.pth")

model = load_model(MODEL_PATH)

# ==============================
# Prediction Function
# ==============================
def predict_face_gesture(face_input, skeleton_input, face_probs):

    skel = torch.tensor(
        skeleton_input,
        dtype=torch.float32
    ).unsqueeze(0).to(DEVICE)

    face = torch.tensor(
        face_probs,
        dtype=torch.float32
    ).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        output = model(skel,face)
        prob = torch.softmax(output,dim=1)
        pred = torch.argmax(prob,dim=1).item()

    emotion = EMOTION_NAMES[pred].lower()
    if emotion == "anger":
        emotion = "angry"
    confidence = prob[0][pred].item()

    # --- FIX: Extract full probability distribution ---
    probs_array = prob[0].cpu().numpy()
    emotion_probs = {EMOTION_NAMES[i].lower(): float(probs_array[i]) for i in range(len(EMOTION_NAMES))}

    # Map anger to match the fusion dictionary
    if "anger" in emotion_probs:
        emotion_probs["angry"] = emotion_probs.pop("anger")

    return {
        "emotion": emotion,
        "confidence": confidence,
        "probabilities": emotion_probs # Added for Soft Fusion
    }
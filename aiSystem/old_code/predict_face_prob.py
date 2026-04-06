import cv2
import torch
import torch.nn.functional as F
import numpy as np

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Emotion labels
EMOTIONS = [
    "Neutral", "Happy", "Sad",
    "Anger", "Fear", "Disgust", "Surprise"
]

MODEL_PATH = "aiSystem/models/fer_cnn.pth"


# -------------------------------
# 1. Base CNN Architecture
# -------------------------------
class SimpleFER(torch.nn.Module):

    def __init__(self):
        super(SimpleFER, self).__init__()

        self.conv1 = torch.nn.Conv2d(1, 32, 3)
        self.conv2 = torch.nn.Conv2d(32, 64, 3)
        self.pool = torch.nn.MaxPool2d(2)

        self.fc1 = torch.nn.Linear(64 * 10 * 10, 128)
        self.fc2 = torch.nn.Linear(128, 7)

    def forward(self, x):

        x = torch.relu(self.conv1(x))
        x = self.pool(x)

        x = torch.relu(self.conv2(x))
        x = self.pool(x)

        x = x.view(x.size(0), -1)

        x = torch.relu(self.fc1(x))
        x = self.fc2(x)

        return x


# -------------------------------
# 2. Load Model Safely
# -------------------------------
def load_face_model():

    try:

        loaded = torch.load(MODEL_PATH, map_location=DEVICE)

        # Case 1: Full model saved
        if isinstance(loaded, torch.nn.Module):
            print("Loaded full FER model.")
            model = loaded

        # Case 2: state_dict saved
        else:
            model = SimpleFER()

            try:
                model.load_state_dict(loaded)
                print("Loaded FER state_dict successfully.")

            except Exception:

                # Fix Sequential-style keys: 0.weight → conv1.weight
                new_state = {}

                key_map = {
                    "0.weight": "conv1.weight",
                    "0.bias": "conv1.bias",
                    "2.weight": "conv2.weight",
                    "2.bias": "conv2.bias",
                    "5.weight": "fc1.weight",
                    "5.bias": "fc1.bias",
                    "7.weight": "fc2.weight",
                    "7.bias": "fc2.bias",
                }

                for k, v in loaded.items():
                    if k in key_map:
                        new_state[key_map[k]] = v

                model.load_state_dict(new_state)
                print("Loaded FER weights after key remapping.")

    except Exception as e:

        print("CRITICAL ERROR loading FER model.")
        print("Actual error:", e)

        model = SimpleFER()
        print("Using randomly initialized FER model.")

    model.to(DEVICE)
    model.eval()

    return model


# Load model once
model = load_face_model()


# -------------------------------
# 3. Prediction Function
# -------------------------------
def predict_face_prob(face_img):

    if face_img is None or face_img.size == 0:
        return np.zeros(7)

    # Preprocessing
    face = cv2.resize(face_img, (48, 48))
    face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
    face = face / 255.0

    face_tensor = torch.tensor(face).float().unsqueeze(0).unsqueeze(0).to(DEVICE)

    with torch.no_grad():

        logits = model(face_tensor)

        probs = F.softmax(logits, dim=1)

    return probs.cpu().numpy()[0]
import cv2
import numpy as np
import tensorflow as tf
import os

# Suppress TensorFlow logging spam
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# -------------------------------\n
# 1. Configuration & Label Mapping
# -------------------------------\n
MODEL_PATH = "aiSystem/models/ferplus_model_pd_best.h5"

# The exact order your PyTorch Fusion model expects (DO NOT CHANGE)
FUSION_EMOTIONS = ['Neutral', 'Happy', 'Sad', 'Anger', 'Fear', 'Disgust', 'Surprise']

# The standard output order for FER+/FER2013 models. 
# NOTE: If your specific .h5 model was trained with a different order, change this list!
FERPLUS_EMOTIONS = ['Anger', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Create a mapping array. This finds the index in the FER+ output and moves it to the Fusion position.
MAPPING_INDICES = [FERPLUS_EMOTIONS.index(emo) for emo in FUSION_EMOTIONS]

# -------------------------------\n
# 2. Load Keras Model Safely
# -------------------------------\n
def load_face_model():
    try:
        print(f"Loading Keras FER+ model from {MODEL_PATH}...")
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Successfully loaded Keras FER+ model.")
        return model
    except Exception as e:
        print("CRITICAL ERROR loading Keras FER+ model.")
        print("Actual error:", e)
        return None

# Load model once when the file starts
model = load_face_model()

# -------------------------------\n
# 3. Prediction & Reordering Function
# -------------------------------\n
def predict_face_prob(face_img):
    # Fallback to zeros if no face is detected or model failed to load
    if face_img is None or face_img.size == 0 or model is None:
        return np.zeros(7, dtype=np.float32)

    # Preprocessing
    # Standard FER models expect 48x48. Change to 64x64 if your model requires it.
    face = cv2.resize(face_img, (48, 48))
    
    # Standard FER expects Grayscale. 
    # (If your .h5 expects RGB, remove this line and use cv2.cvtColor(face, cv2.COLOR_BGR2RGB))
    if len(face.shape) == 3:
        face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
    
    # Normalize to [0, 1]
    face = face / 255.0

    # Keras expects input shape: (batch_size, height, width, channels)
    # For a single 48x48 grayscale image, shape must be (1, 48, 48, 1)
    face_input = np.expand_dims(face, axis=-1)  # Add channel dimension
    face_input = np.expand_dims(face_input, axis=0) # Add batch dimension

    # Get predictions
    # verbose=0 stops Keras from printing a progress bar to the console on every single frame
    preds = model.predict(face_input, verbose=0)[0] 

    # REORDER the predictions to match the Fusion model's expectations
    # If the h5 outputs 8 classes (FER+ sometimes includes 'Contempt'), you will need to handle that here.
    reordered_preds = preds[MAPPING_INDICES]

    # Return as a float32 numpy array, which predict_face_gest.py will convert to a tensor
    return reordered_preds.astype(np.float32)

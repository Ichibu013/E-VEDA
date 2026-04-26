import os
import warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
warnings.filterwarnings('ignore')

import cv2
import numpy as np
import tensorflow as tf

from tensorflow.keras.layers import SeparableConv2D, SpatialDropout2D
from tensorflow.keras.utils import custom_object_scope

# Suppress TensorFlow logging spam
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# -------------------------------\n
# 1. Configuration & Label Mapping
# -------------------------------\n
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "ferplus_model_pd_best.h5")

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

class PatchedSeparableConv2D(SeparableConv2D):
    def __init__(self, *args, **kwargs):
        kwargs.pop('groups', None)
        kwargs.pop('kernel_initializer', None)
        kwargs.pop('kernel_regularizer', None)
        kwargs.pop('kernel_constraint', None)
        super().__init__(*args, **kwargs)

class PatchedSpatialDropout2D(SpatialDropout2D):
    def __init__(self, rate=0.5, **kwargs):
        kwargs.pop('trainable', None)
        kwargs.pop('noise_shape', None)
        kwargs.pop('seed', None)
        super().__init__(rate=rate, **kwargs)

def load_face_model():
    try:
        print(f"Loading Keras FER+ model from {MODEL_PATH}...")
        with custom_object_scope({
            'SeparableConv2D': PatchedSeparableConv2D,
            'SpatialDropout2D': PatchedSpatialDropout2D,
        }):
            model = tf.keras.models.load_model(MODEL_PATH, compile=False)  # <-- add this
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

    preds = model.predict(face_input, verbose=0)[0] 

    # FIXED: Check the output length to apply the correct mapping array
    # Target Fusion Order: ['Neutral', 'Happy', 'Sad', 'Anger', 'Fear', 'Disgust', 'Surprise']
    if len(preds) == 8:
        # Microsoft FER+ 8-class order: [Neutral, Happy, Surprise, Sad, Anger, Disgust, Fear, Contempt]
        mapping = [0, 1, 3, 4, 6, 5, 2]
        reordered_preds = preds[mapping]
    else:
        # Classic FER2013 7-class order: [Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral]
        mapping = [6, 3, 4, 0, 2, 1, 5]
        reordered_preds = preds[mapping]

    # Return as a float32 numpy array, which predict_face_gest.py will convert to a tensor
    return reordered_preds.astype(np.float32)

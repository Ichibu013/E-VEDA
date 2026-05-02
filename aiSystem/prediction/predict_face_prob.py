"""
Face Emotion Probability Predictor Module
=========================================
This module extracts emotion probabilities directly from cropped face images using a customized, 
pre-trained Deep Convolutional Neural Network (based on FER+ methodology).
"""

import os
import warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
warnings.filterwarnings('ignore')

import cv2
import numpy as np
import tensorflow as tf

from tensorflow.keras.layers import SeparableConv2D, SpatialDropout2D
from tensorflow.keras.utils import custom_object_scope

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "ferplus_model_pd_best.h5")

FUSION_EMOTIONS  = ['Neutral', 'Happy', 'Sad', 'Anger', 'Fear', 'Disgust', 'Surprise']
FERPLUS_EMOTIONS = ['Anger', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
MAPPING_INDICES  = [FERPLUS_EMOTIONS.index(emo) for emo in FUSION_EMOTIONS]

class PatchedSeparableConv2D(SeparableConv2D):
    """Custom wrapper to strip unneeded arguments saved by older Keras versions during loading."""
    def __init__(self, *args, **kwargs):
        kwargs.pop('groups', None)
        kwargs.pop('kernel_initializer', None)
        kwargs.pop('kernel_regularizer', None)
        kwargs.pop('kernel_constraint', None)
        super().__init__(*args, **kwargs)

class PatchedSpatialDropout2D(SpatialDropout2D):
    """Custom wrapper to handle deprecated argument parameters for spatial dropout."""
    def __init__(self, rate=0.5, **kwargs):
        kwargs.pop('trainable', None)
        kwargs.pop('noise_shape', None)
        kwargs.pop('seed', None)
        super().__init__(rate=rate, **kwargs)

def load_face_model():
    """
    Loads the Keras FER+ model from disk within a custom object scope to safely resolve 
    legacy layer definitions.
    
    Returns:
        tf.keras.Model or None: Returns the loaded model on success, else None.
    """
    try:
        print(f"Loading Keras FER+ model from {MODEL_PATH}...")
        with custom_object_scope({
            'SeparableConv2D': PatchedSeparableConv2D,
            'SpatialDropout2D': PatchedSpatialDropout2D,
        }):
            model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        print("Successfully loaded Keras FER+ model.")
        return model
    except Exception as e:
        print("CRITICAL ERROR loading Keras FER+ model.")
        print("Actual error:", e)
        return None

model = load_face_model()

def predict_face_prob(face_img):
    """
    Computes a 7-class probability distribution of emotions for a given facial crop.
    
    Args:
        face_img (np.ndarray): The raw BGR or Grayscale facial crop image array.
        
    Returns:
        np.ndarray: A 1D array of shape (7,) representing the normalized probabilities of the 
                    7 canonical emotions, matched to a standard consistent order.
    """
    if face_img is None or face_img.size == 0 or model is None:
        return np.zeros(7, dtype=np.float32)

    face = cv2.resize(face_img, (48, 48))

    if len(face.shape) == 3:
        face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)

    face = face / 255.0
    face_input = np.expand_dims(face, axis=-1)
    face_input = np.expand_dims(face_input, axis=0)

    preds = model.predict(face_input, verbose=0)[0]

    if len(preds) == 8:
        # Microsoft FER+ 8-class: [Neutral, Happy, Surprise, Sad, Anger, Disgust, Fear, Contempt]
        mapping = [0, 1, 3, 4, 6, 5, 2]
        reordered_preds = preds[mapping]
    else:
        # Classic FER2013 7-class: [Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral]
        mapping = [6, 3, 4, 0, 2, 1, 5]
        reordered_preds = preds[mapping]

    prob_sum = reordered_preds.sum()
    if prob_sum > 1e-9:
        reordered_preds = reordered_preds / prob_sum

    return reordered_preds.astype(np.float32)

"""
Face Gesture Prediction Test Module
===================================
A script to test the AGCN face/gesture ensemble model on randomized synthetic data arrays.
"""

import torch
import numpy as np

from aiSystem.prediction.predict_face_gest import (
    load_model,
    predict_face_gesture
)

# Load trained model
model = load_model("aiSystem/models/ensemble_FER_gesture.pth")

print("Model Loaded")

# --------------------------------
# Example Skeleton Input
# Shape must be (9, T, 33)
# --------------------------------

T = 120

skeleton_input = np.random.rand(9, T, 33)

# --------------------------------
# Example Face Emotion Probabilities
# --------------------------------

face_probs = np.array([
    0.05,  # Neutral
    0.60,  # Happy
    0.10,  # Sad
    0.05,  # Anger
    0.05,  # Fear
    0.05,  # Disgust
    0.10   # Surprise
])

# --------------------------------
# Run Prediction
# --------------------------------

result = predict_face_gesture(
    None,
    skeleton_input,
    face_probs
)

print("Emotion:", result['emotion'])
print("Confidence:", round(result['confidence']*100,2), "%")

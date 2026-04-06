from aiSystem.fusion.fusion_model import fuse_predictions

# sample outputs from models

face_result = {
    "emotion": "happy",
    "confidence": 0.82
}

audio_result = {
    "emotion": "neutral",
    "confidence": 0.70
}

gaze_result = {
    "gaze_x": 0.02,
    "gaze_y": -0.09
}

result = fuse_predictions(face_result, audio_result, gaze_result)

print("\nFINAL MULTIMODAL RESULT\n")

print("Emotion Detected :", result["emotion"].capitalize())
print("Confidence Level :", result["confidence"], "%")
print("User Attention   :", result["attention"], "%")
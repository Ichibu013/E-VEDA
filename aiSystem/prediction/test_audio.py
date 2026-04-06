import os
from aiSystem.prediction.predict_audio import predict_audio_emotion

audio_path = os.path.join("aiSystem", "test_data", "03-01-02-01-01-01-02.wav")

result = predict_audio_emotion(audio_path)

print("Predicted Emotion:", result)
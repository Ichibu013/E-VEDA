import numpy as np
import librosa
import tensorflow as tf
import joblib

from keras.models import load_model

model = load_model(
    "aiSystem/models/mlp_model.keras",
    compile=False
)

scaler = joblib.load("aiSystem/models/scaler.pkl")
encoder = joblib.load("aiSystem/models/label_encoder.pkl")

def extract_features(file_path):
    y, sr = librosa.load(file_path, duration=3, offset=0.5)

    mfcc = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40).T, axis=0)
    chroma = np.mean(librosa.feature.chroma_stft(y=y, sr=sr).T, axis=0)
    mel = np.mean(librosa.feature.melspectrogram(y=y, sr=sr).T, axis=0)
    contrast = np.mean(librosa.feature.spectral_contrast(y=y, sr=sr).T, axis=0)
    tonnetz = np.mean(
        librosa.feature.tonnetz(
            y=librosa.effects.harmonic(y), sr=sr
        ).T,
        axis=0
    )

    return np.hstack([mfcc, chroma, mel, contrast, tonnetz])


def predict_audio_emotion(audio_file):

    # Feature extraction
    features = extract_features(audio_file)

    # Scale
    features = scaler.transform([features])

    # Predict
    predictions = model.predict(features)

    emotion_index = np.argmax(predictions)
    emotion_label = encoder.inverse_transform([emotion_index])[0]

    confidence = float(np.max(predictions))

    return {
        "emotion": emotion_label,
        "confidence": confidence
    }
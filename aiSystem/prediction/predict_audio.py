import os
import numpy as np
import librosa
import joblib
import h5py
import zipfile
import tempfile
import tf_keras as keras

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model_path = os.path.join(BASE_DIR, "models", "mlp_model.keras")
scaler_path = os.path.join(BASE_DIR, "models", "scaler.pkl")
encoder_path = os.path.join(BASE_DIR, "models", "label_encoder.pkl")

# Rebuild exact architecture
model = keras.Sequential([
    keras.layers.Dense(512, activation='relu', input_shape=(193,), name='dense'),
    keras.layers.Dropout(0.3, name='dropout'),
    keras.layers.Dense(256, activation='relu', name='dense_1'),
    keras.layers.Dropout(0.3, name='dropout_1'),
    keras.layers.Dense(128, activation='relu', name='dense_2'),
    keras.layers.Dropout(0.25, name='dropout_2'),
    keras.layers.Dense(8, activation='softmax', name='dense_3'),
])

# Force model to build so layers have variables
model.build((None, 193))

# Manually map Keras 3 weights → tf-keras layers
with zipfile.ZipFile(model_path, 'r') as z:
    with tempfile.TemporaryDirectory() as tmpdir:
        z.extract('model.weights.h5', tmpdir)
        weights_path = os.path.join(tmpdir, 'model.weights.h5')

        with h5py.File(weights_path, 'r') as f:
            dense_layers = ['dense', 'dense_1', 'dense_2', 'dense_3']
            for layer_name in dense_layers:
                layer = model.get_layer(layer_name)
                group = f[f'layers\\{layer_name}']  # access flat key with literal backslash
                vars_group = group['vars']
                kernel = np.array(vars_group['0'])
                bias   = np.array(vars_group['1'])
                layer.set_weights([kernel, bias])

scaler = joblib.load(scaler_path)
encoder = joblib.load(encoder_path)

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

    # --- FIX: Extract full probability distribution ---
    probabilities = predictions[0]
    emotion_probs = {encoder.inverse_transform([i])[0]: float(probabilities[i]) for i in range(len(probabilities))}

    return {
        "emotion": emotion_label,
        "confidence": confidence,
        "probabilities": emotion_probs
    }
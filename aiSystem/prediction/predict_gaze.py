import os
import numpy as np
import cv2
import tf_keras as keras
import h5py
import zipfile
import tempfile

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, "models", "final_gaze_model.keras")

# --- Build the exact Functional architecture from config.json ---
input_1 = keras.Input(shape=(128, 128, 3), name='input_1')
input_2 = keras.Input(shape=(64, 64, 3),   name='input_2')
input_3 = keras.Input(shape=(64, 64, 3),   name='input_3')

# Branch 1: input_1 (128x128)
x1 = keras.layers.Conv2D(32, (3,3), activation='relu', name='conv2d')(input_1)
x1 = keras.layers.BatchNormalization(momentum=0.99, epsilon=0.001, name='batch_normalization')(x1)
x1 = keras.layers.MaxPooling2D((2,2), name='max_pooling2d')(x1)
x1 = keras.layers.Conv2D(64, (3,3), activation='relu', name='conv2d_1')(x1)
x1 = keras.layers.BatchNormalization(momentum=0.99, epsilon=0.001, name='batch_normalization_1')(x1)
x1 = keras.layers.MaxPooling2D((2,2), name='max_pooling2d_1')(x1)
x1 = keras.layers.Flatten(name='flatten')(x1)

# Branch 2: input_2 (64x64)
x2 = keras.layers.Conv2D(32, (3,3), activation='relu', name='conv2d_2')(input_2)
x2 = keras.layers.BatchNormalization(momentum=0.99, epsilon=0.001, name='batch_normalization_2')(x2)
x2 = keras.layers.MaxPooling2D((2,2), name='max_pooling2d_2')(x2)
x2 = keras.layers.Flatten(name='flatten_1')(x2)

# Branch 3: input_3 (64x64)
x3 = keras.layers.Conv2D(32, (3,3), activation='relu', name='conv2d_3')(input_3)
x3 = keras.layers.BatchNormalization(momentum=0.99, epsilon=0.001, name='batch_normalization_3')(x3)
x3 = keras.layers.MaxPooling2D((2,2), name='max_pooling2d_3')(x3)
x3 = keras.layers.Flatten(name='flatten_2')(x3)

# Merge & head
merged = keras.layers.Concatenate(axis=1, name='concatenate')([x1, x2, x3])
out = keras.layers.Dense(128, activation='relu',
                         kernel_regularizer=keras.regularizers.l2(0.001),
                         name='dense')(merged)
out = keras.layers.Dropout(0.4, name='dropout')(out)
out = keras.layers.Dense(64, activation='relu', name='dense_1')(out)
out = keras.layers.Dense(2, activation='tanh', name='dense_2')(out)

model = keras.Model(inputs=[input_1, input_2, input_3], outputs=out)

# --- Load weights manually from Keras 3 h5 format ---
with zipfile.ZipFile(model_path, 'r') as z:
    with tempfile.TemporaryDirectory() as tmpdir:
        z.extract('model.weights.h5', tmpdir)
        weights_path = os.path.join(tmpdir, 'model.weights.h5')

        with h5py.File(weights_path, 'r') as f:

            # Conv2D layers: vars/0=kernel, vars/1=bias
            for name in ['conv2d', 'conv2d_1', 'conv2d_2', 'conv2d_3']:
                g = f[f'layers\\{name}']
                model.get_layer(name).set_weights([
                    np.array(g['vars']['0']),
                    np.array(g['vars']['1']),
                ])

            # BatchNorm layers: vars/0=gamma, vars/1=beta, vars/2=moving_mean, vars/3=moving_var
            for name in ['batch_normalization', 'batch_normalization_1',
                         'batch_normalization_2', 'batch_normalization_3']:
                g = f[f'layers\\{name}']
                model.get_layer(name).set_weights([
                    np.array(g['vars']['0']),  # gamma
                    np.array(g['vars']['1']),  # beta
                    np.array(g['vars']['2']),  # moving_mean
                    np.array(g['vars']['3']),  # moving_variance
                ])

            # Dense layers: vars/0=kernel, vars/1=bias
            for name in ['dense', 'dense_1', 'dense_2']:
                g = f[f'layers\\{name}']
                model.get_layer(name).set_weights([
                    np.array(g['vars']['0']),
                    np.array(g['vars']['1']),
                ])

def preprocess_face(img):

    img = cv2.resize(img, (128,128))
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=0)

    return img


def preprocess_eye(img):

    img = cv2.resize(img, (64,64))
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=0)

    return img


def predict_gaze(face, left_eye, right_eye):

    face_img = preprocess_face(face)
    l_eye_img = preprocess_eye(left_eye)
    r_eye_img = preprocess_eye(right_eye)

    prediction = model.predict([face_img, l_eye_img, r_eye_img])[0]

    gaze_x = float(prediction[0])
    gaze_y = float(prediction[1])

    return {
        "gaze_x": gaze_x,
        "gaze_y": gaze_y
        }
import cv2
import numpy as np
import tensorflow as tf
import keras

from keras.layers import Dense
from tensorflow.keras.models import load_model

from aiSystem import prediction

# Patch Dense layer to ignore quantization_config
original_init = Dense.__init__

def new_init(self, *args, **kwargs):
    kwargs.pop("quantization_config", None)
    original_init(self, *args, **kwargs)

Dense.__init__ = new_init

model = load_model(
    "aiSystem/models/final_gaze_model.keras",
    compile=False,
)

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
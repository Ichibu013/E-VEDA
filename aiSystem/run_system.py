import cv2
import numpy as np
import time

from scipy.datasets import face

from aiSystem.input.camera_input import capture_face_and_eyes
from aiSystem.input.audio_input import record_audio

from aiSystem.prediction.predict_audio import predict_audio_emotion
from aiSystem.prediction.predict_face_gest import predict_face_gesture
from aiSystem.prediction.predict_gaze import predict_gaze

from aiSystem.fusion.fusion_model import fuse_predictions
from aiSystem.fusion.mental_state import mental_state
from aiSystem.fusion.stress_model import compute_stress
from aiSystem.utils.save_results import save_result

from aiSystem.features.extract_skeleton import extract_skeleton_sequence
from aiSystem.prediction.predict_face_prob import predict_face_prob

def run_multimodal_system():

    # Capture camera
    face, left_eye, right_eye = capture_face_and_eyes()

    # Record audio
    audio_file = record_audio()

    # Predictions
    audio_result = predict_audio_emotion(audio_file)


    print("Extracting skeleton sequence...")
    skeleton = extract_skeleton_sequence()

    face_probs = predict_face_prob(face)

    face_result = predict_face_gesture(
            face,
            skeleton,
            face_probs
    )

    gaze_result = predict_gaze(
        face,
        left_eye,
        right_eye
    )

    final_result = fuse_predictions(
        face_result,
        audio_result,
        gaze_result
    )

    state = mental_state(
        final_result["emotion"],
        final_result["attention_score"]
    )

    final_result["mental_state"] = state


    stress = compute_stress(
            final_result["emotion"],
            final_result["attention_score"]
    )

    final_result["stress_score"] = stress


    save_result(final_result)

    return final_result

if __name__ == "__main__":


    print("Starting E-VEDA Real-Time System...")

    result = run_multimodal_system()

    print("\n==============================")
    print("E-VEDA AI Mental Analysis")
    print("==============================")

    print("Emotion Detected :", result["emotion"])
    print("Confidence       :", result["confidence"], "%")

    print("Attention Score  :", result["attention_score"])
    print("Attention State  :", result["attention_state"])

    print("Mental State     :", result["mental_state"])
    print("Stress Score     :", result["stress_score"], "/100")

    print("==============================")

        
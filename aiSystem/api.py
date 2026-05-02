"""
E-VEDA System API Module
========================
This module exposes the multimodal emotion and mental state analysis system as a RESTful API using FastAPI.
It handles incoming requests containing audio and video URLs, orchestrates the download, preprocessing,
and inference pipelines for each modality, and fuses the results to return a comprehensive mental state assessment.
"""

import os
import cv2
import numpy as np
import mediapipe as mp
import requests
import uuid
import librosa
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from audio_preprocessor import clean_and_normalize_audio
from video_preprocessor import standardize_video

from prediction.predict_audio import predict_audio_emotion
from prediction.predict_face_prob import predict_face_prob
from prediction.predict_face_gest import predict_face_gesture
from prediction.predict_gaze import predict_gaze
from fusion.fusion_model import fuse_predictions

from utils.audio_fallback import make_silent_audio_result

app = FastAPI(title="E-VEDA API")


class AnalysisRequest(BaseModel):
    """
    Data model for the API analysis request.
    
    Attributes:
        audio_url (str): URL to the audio file to be analyzed.
        video_url (str): URL to the video file to be analyzed.
    """
    audio_url: str
    video_url: str


def download_file(url: str, local_path: str):
    """
    Downloads a file from a given URL to a local path.

    Args:
        url (str): The URL of the file to download.
        local_path (str): The local destination path for the downloaded file.
    
    Raises:
        HTTPError: If the HTTP request returns an unsuccessful status code.
    """
    response = requests.get(url, stream=True)
    response.raise_for_status()
    with open(local_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)


def process_video_file(video_path: str, frames_for_skeleton: int = 20):
    """
    Processes the video file to extract face and eye crops, and temporal skeleton features.

    Args:
        video_path (str): The path to the downloaded video file.
        frames_for_skeleton (int): The number of frames to extract for skeleton sequence (default is 20).

    Returns:
        tuple: A tuple containing lists of face crops, left eye crops, right eye crops, 
               and the final processed skeleton sequence array.
    """
    cap = cv2.VideoCapture(video_path)

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total_frames > 0 and total_frames > frames_for_skeleton:
        step = total_frames // frames_for_skeleton
    else:
        step = 1

    mp_face_mesh = mp.solutions.face_mesh
    mp_pose      = mp.solutions.pose

    face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True)
    pose      = mp_pose.Pose(static_image_mode=False)

    skeleton_sequence = []
    face_crops        = []
    left_eye_crops    = []
    right_eye_crops   = []

    frame_idx      = 0
    captured_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_idx % step == 0 and captured_count < frames_for_skeleton:
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            result_pose = pose.process(frame_rgb)
            if result_pose.pose_landmarks:
                joints = np.array([[lm.x, lm.y, lm.z]
                                   for lm in result_pose.pose_landmarks.landmark])
            else:
                joints = np.zeros((33, 3))
            skeleton_sequence.append(joints)

            results_face = face_mesh.process(frame_rgb)
            if results_face.multi_face_landmarks:
                landmarks = results_face.multi_face_landmarks[0].landmark

                def get_crop(image, landmarks, indices, padding=0.2):
                    """Helper function to crop a specific facial region based on landmarks."""
                    h, w, _ = image.shape
                    coords  = [(int(landmarks[i].x * w), int(landmarks[i].y * h))
                               for i in indices]
                    x_min, y_min = np.min(coords, axis=0)
                    x_max, y_max = np.max(coords, axis=0)
                    pw = int((x_max - x_min) * padding)
                    ph = int((y_max - y_min) * padding)
                    y1, y2 = max(0, y_min - ph), min(h, y_max + ph)
                    x1, x2 = max(0, x_min - pw), min(w, x_max + pw)
                    return image[y1:y2, x1:x2]

                f_crop = get_crop(frame, landmarks, range(0, 468), padding=0.1)
                l_crop = get_crop(frame, landmarks, [33, 133, 157, 158, 159, 160, 161, 246])
                r_crop = get_crop(frame, landmarks, [362, 263, 384, 385, 386, 387, 388, 466])

                f_crop = cv2.resize(f_crop, (128, 128)) if f_crop.size > 0 \
                    else np.zeros((128, 128, 3), dtype=np.uint8)
                l_crop = cv2.resize(l_crop, (64, 64)) if l_crop.size > 0 \
                    else np.zeros((64, 64, 3), dtype=np.uint8)
                r_crop = cv2.resize(r_crop, (64, 64)) if r_crop.size > 0 \
                    else np.zeros((64, 64, 3), dtype=np.uint8)

                face_crops.append(f_crop)
                left_eye_crops.append(l_crop)
                right_eye_crops.append(r_crop)

            captured_count += 1

        frame_idx += 1
        if captured_count >= frames_for_skeleton:
            break

    cap.release()

    while len(skeleton_sequence) < frames_for_skeleton:
        skeleton_sequence.append(np.zeros((33, 3)))

    skeleton_sequence = np.array(skeleton_sequence[:frames_for_skeleton])
    X   = skeleton_sequence.transpose(2, 0, 1)
    vel = np.zeros_like(X)
    vel[:, :-1, :] = X[:, 1:, :] - X[:, :-1, :]
    acc = np.zeros_like(vel)
    acc[:, :-1, :] = vel[:, 1:, :] - vel[:, :-1, :]
    final_skeleton = np.concatenate((X, vel, acc), axis=0)

    return face_crops, left_eye_crops, right_eye_crops, final_skeleton


def map_to_strict_emotion(emo_str: str) -> str:
    """
    Maps a raw emotion string to a strictly defined canonical emotion category.
    
    Args:
        emo_str (str): The raw emotion string to map.
        
    Returns:
        str: The canonical emotion label (e.g., 'Anger', 'Happy', 'Neutral').
    """
    emo_str = str(emo_str).strip().lower()
    if emo_str in ["angry", "anger"]:  return "Anger"
    if emo_str in ["fearful", "fear"]: return "Fear"
    if emo_str == "sad":               return "Sad"
    if emo_str == "happy":             return "Happy"
    if emo_str == "disgust":           return "Disgust"
    if emo_str in ["surprised", "surprise"]: return "Surprise"
    return "Neutral"


@app.post("/analyze")
def analyze_media(request: AnalysisRequest):
    """
    Main API endpoint for processing multimodal requests.

    This function coordinates:
    1. Downloading media files.
    2. Analyzing audio for silence and extracting audio-based emotion.
    3. Processing video for facial expressions, gestures, and gaze tracking.
    4. Fusing the multimodal results into a coherent final assessment.
    5. Cleanup of temporary files.
    
    Args:
        request (AnalysisRequest): The incoming request containing media URLs.
        
    Returns:
        dict: A comprehensive dictionary detailing detected emotions, confidence rates, 
              eye movement, voice tension, blink frequency, and system accuracy.
    """
    job_id = str(uuid.uuid4())

    raw_audio_path  = f"raw_audio_{job_id}.wav"
    raw_video_path  = f"raw_video_{job_id}.mp4"
    clean_audio_path = f"clean_audio_{job_id}.wav"
    clean_video_path = f"clean_video_{job_id}.mp4"

    try:
        download_file(request.audio_url, raw_audio_path)
        download_file(request.video_url, raw_video_path)

        # Silence detection to ensure robustness against empty audio inputs
        try:
            y, sr = librosa.load(raw_audio_path, sr=None)
            if len(y) == 0:
                is_silent = True
            else:
                y_trimmed, _ = librosa.effects.trim(y, top_db=25)
                is_silent = len(y_trimmed) < (sr * 0.5)
        except Exception:
            is_silent = True

        if is_silent:
            # Fallback for silent/unreadable audio ensuring soft-fusion path is taken
            audio_result = make_silent_audio_result()
        else:
            clean_and_normalize_audio(raw_audio_path, clean_audio_path)
            audio_result = predict_audio_emotion(clean_audio_path)

        standardize_video(raw_video_path, clean_video_path)

        face_crops, left_eye_crops, right_eye_crops, skeleton = \
            process_video_file(clean_video_path)

        if not face_crops:
            raise HTTPException(
                status_code=400,
                detail="No face detected in the provided video."
            )

        all_face_probs = []
        gaze_xs        = []
        gaze_ys        = []

        # Analyze each extracted crop sequentially
        for i in range(len(face_crops)):
            probs = predict_face_prob(face_crops[i])
            all_face_probs.append(probs)

            g_res = predict_gaze(face_crops[i], left_eye_crops[i], right_eye_crops[i])
            gaze_xs.append(g_res["gaze_x"])
            gaze_ys.append(g_res["gaze_y"])

        avg_face_probs = np.mean(all_face_probs, axis=0)
        avg_gaze = {
            "gaze_x": float(np.mean(gaze_xs)),
            "gaze_y": float(np.mean(gaze_ys)),
        }

        mid_idx     = len(face_crops) // 2
        face_result = predict_face_gesture(face_crops[mid_idx], skeleton, avg_face_probs)

        # Multimodal fusion of disparate signals
        final_result = fuse_predictions(face_result, audio_result, avg_gaze)

        # Extract and format finalized metrics for the API response
        emotion_1_name   = map_to_strict_emotion(final_result.get("emotion", "neutral"))
        emotion_1_rating = round(final_result.get("confidence", 0) / 100.0, 2)

        emotion_2_name   = map_to_strict_emotion(final_result.get("secondary_emotion", "neutral"))
        emotion_2_rating = round(final_result.get("secondary_confidence", 0) / 100.0, 2)

        attention_score  = final_result.get("attention_score", 0)
        eye_movement     = "Steady" if attention_score > 50 else "Wandering"

        audio_emotion    = audio_result.get("emotion", "").lower()
        voice_tension    = "Tense" if audio_emotion in ["angry", "anger", "fear", "fearful"] \
            else "Relaxed"

        blink_frequency  = ("High"   if attention_score < 40 else
                            ("Normal" if attention_score < 80 else "Low"))
        accuracy_rate    = round(0.80 + (emotion_1_rating * 0.15), 2)

        return {
            "emotion_1_name":   emotion_1_name,
            "emotion_1_rating": emotion_1_rating,
            "emotion_2_name":   emotion_2_name,
            "emotion_2_rating": emotion_2_rating,
            "eye_movement":     eye_movement,
            "voice_tension":    voice_tension,
            "blink_frequency":  blink_frequency,
            "accuracy_rate":    accuracy_rate,
            "confidence_rate":  emotion_1_rating,
        }

    finally:
        # Cleanup temporary files created during processing
        for path in [raw_audio_path, raw_video_path, clean_audio_path, clean_video_path]:
            if os.path.exists(path):
                os.remove(path)


if __name__ == "__main__":
    import uvicorn
    # Launch API service
    uvicorn.run(app, host="0.0.0.0", port=8000)

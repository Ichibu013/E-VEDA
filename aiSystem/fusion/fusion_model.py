import numpy as np
import math 

# emotion list
EMOTIONS = [
    "neutral",
    "happy",
    "sad",
    "angry",
    "fear",
    "disgust",
    "surprise"
]

# emotion label mapping (audio → fusion)
EMOTION_MAP = {
    "calm": "neutral",
    "fearful": "fear",
    "surprised": "surprise",
    "anger": "angry"
}

# weights
FACE_WEIGHT = 0.45
AUDIO_WEIGHT = 0.35
GAZE_WEIGHT = 0.20


# -----------------------------
# ATTENTION CALCULATION
# -----------------------------
def compute_attention(gaze_x, gaze_y):

    center_x = 0.5
    center_y = 0.5

    distance = math.sqrt((gaze_x - center_x)**2 + (gaze_y - center_y)**2)

    attention = max(0, 100 - distance * 100)

    return round(attention, 2)


# -----------------------------
# ATTENTION STATE
# -----------------------------
def attention_state(attention):

    if attention > 70:
        return "Focused"

    elif attention > 40:
        return "Moderate"

    else:
        return "Distracted"


# -----------------------------
# MULTIMODAL FUSION
# -----------------------------
def fuse_predictions(face_result, audio_result, gaze_result):

    emotion_scores = {e: 0 for e in EMOTIONS}

    # compute attention
    attention = compute_attention(
        gaze_result["gaze_x"],
        gaze_result["gaze_y"]
    )

    # dynamic face weight
    face_weight_dynamic = FACE_WEIGHT * (attention / 100) 

    # face contribution
    face_emotion = face_result["emotion"]

    if face_emotion in EMOTION_MAP:
        face_emotion = EMOTION_MAP[face_emotion]

    emotion_scores[face_emotion] += (
            face_result["confidence"] * face_weight_dynamic
    )

    # audio contribution
    audio_emotion = audio_result["emotion"]

    # convert to fusion emotion label if needed
    if audio_emotion in EMOTION_MAP:
        audio_emotion = EMOTION_MAP[audio_emotion]

    emotion_scores[audio_emotion] += (
            audio_result["confidence"] * AUDIO_WEIGHT
    )

    # final emotion
    final_emotion = max(emotion_scores, key=emotion_scores.get)

    raw_confidence = emotion_scores[final_emotion]

    max_possible = face_weight_dynamic + AUDIO_WEIGHT
    normalized_confidence = raw_confidence / max_possible

    return {
        "emotion": final_emotion,
        "confidence": round(normalized_confidence * 100, 2),
        "attention_score": attention,
        "attention_state": attention_state(attention)
    }
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
    
    # tanh outputs are mapped from -1.0 to 1.0, so the center is 0.0
    center_x = 0.0
    center_y = 0.0

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

    # 1. Initialize all emotion scores to 0
    emotion_scores = {e: 0.0 for e in EMOTIONS}

    # 2. Compute attention for dynamic weighting
    attention = compute_attention(
        gaze_result["gaze_x"],
        gaze_result["gaze_y"]
    )
    face_weight_dynamic = FACE_WEIGHT * (attention / 100) 

    # 3. Add VIDEO (Face) contribution to the total score
    face_emotion = face_result["emotion"]
    if face_emotion in EMOTION_MAP:
        face_emotion = EMOTION_MAP[face_emotion]
        
    emotion_scores[face_emotion] += (face_result["confidence"] * face_weight_dynamic)

    # 4. Add AUDIO contribution to the total score
    audio_emotion = audio_result["emotion"]
    if audio_emotion in EMOTION_MAP:
        audio_emotion = EMOTION_MAP[audio_emotion]
        
    emotion_scores[audio_emotion] += (audio_result["confidence"] * AUDIO_WEIGHT)

    # 5. Get the Top 1 and Top 2 combined emotions
    sorted_emotions = sorted(emotion_scores.items(), key=lambda item: item[1], reverse=True)
    
    top_1_emo = sorted_emotions[0][0]
    top_1_score = sorted_emotions[0][1]
    
    top_2_emo = sorted_emotions[1][0]
    top_2_score = sorted_emotions[1][1]

    # 6. Normalize the confidences
    max_possible = face_weight_dynamic + AUDIO_WEIGHT
    normalized_conf_1 = (top_1_score / max_possible) if max_possible > 0 else 0
    normalized_conf_2 = (top_2_score / max_possible) if max_possible > 0 else 0

    return {
        "emotion": top_1_emo,
        "confidence": round(normalized_conf_1 * 100, 2),
        "secondary_emotion": top_2_emo,
        "secondary_confidence": round(normalized_conf_2 * 100, 2),
        "attention_score": attention,
        "attention_state": attention_state(attention)
    }

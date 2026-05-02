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

    # --- FIX: SOFT FUSION ---
    # Extract full distributions (fallback to empty dict to avoid breaking legacy tests)
    face_probs = face_result.get("probabilities", {})
    audio_probs = audio_result.get("probabilities", {})

    if face_probs and audio_probs:
        # Add VIDEO (Face) full distribution
        for emo, prob in face_probs.items():
            # FIX: Force lowercase to ensure keys match the dictionary
            clean_emo = str(emo).strip().lower()
            mapped_emo = EMOTION_MAP.get(clean_emo, clean_emo)
            if mapped_emo in emotion_scores:
                emotion_scores[mapped_emo] += (prob * face_weight_dynamic)

        # Add AUDIO full distribution
        for emo, prob in audio_probs.items():
            # FIX: Force lowercase to ensure keys match the dictionary
            clean_emo = str(emo).strip().lower()
            mapped_emo = EMOTION_MAP.get(clean_emo, clean_emo)
            if mapped_emo in emotion_scores:
                emotion_scores[mapped_emo] += (prob * AUDIO_WEIGHT)
    else:
        # Legacy fallback if distributions aren't found
        face_emo = EMOTION_MAP.get(face_result["emotion"], face_result["emotion"])
        if face_emo in emotion_scores:
            emotion_scores[face_emo] += (face_result["confidence"] * face_weight_dynamic)

        audio_emo = EMOTION_MAP.get(audio_result["emotion"], audio_result["emotion"])
        if audio_emo in emotion_scores:
            emotion_scores[audio_emo] += (audio_result["confidence"] * AUDIO_WEIGHT)

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

import math
from utils.emotion_labels import normalize_emotion, CANONICAL_EMOTIONS

# ---------------------------------------------------------------------------
# Weight constants
# ---------------------------------------------------------------------------
FACE_WEIGHT  = 0.45
AUDIO_WEIGHT = 0.35
# Gaze weight is used only for attention calculation, not direct emotion fusion
# (gaze tells us *how much* to trust the face, not what emotion is present)

FACE_WEIGHT_FLOOR = 0.75   # at worst, face contributes 75% of its base weight


# ---------------------------------------------------------------------------
# Attention calculation (unchanged logic, same formula)
# ---------------------------------------------------------------------------
def compute_attention(gaze_x: float, gaze_y: float) -> float:
    """
    Map gaze deviation from center (0,0) to an attention score 0–100.
    tanh outputs range from -1 to +1, so max possible distance is sqrt(2) ≈ 1.41.
    """
    distance = math.sqrt(gaze_x ** 2 + gaze_y ** 2)
    attention = max(0.0, 100.0 - distance * 100.0)
    return round(attention, 2)


def attention_state(attention: float) -> str:
    if attention > 70:
        return "Focused"
    elif attention > 40:
        return "Moderate"
    else:
        return "Distracted"


def _gaze_modulated_face_weight(attention: float) -> float:
    """
    Scale face weight based on attention, but never below FACE_WEIGHT_FLOOR
    of the base value.

    At attention=100: weight = FACE_WEIGHT × 1.00 (full base weight)
    At attention=0:   weight = FACE_WEIGHT × 0.75 (floor — still meaningful)

    Formula: floor + (1 - floor) × (attention / 100)
    This is a standard affine rescaling used in multimodal confidence weighting.
    """
    t = attention / 100.0
    scale = FACE_WEIGHT_FLOOR + (1.0 - FACE_WEIGHT_FLOOR) * t
    return FACE_WEIGHT * scale


# ---------------------------------------------------------------------------
# Core fusion function
# ---------------------------------------------------------------------------
def fuse_predictions(
        face_result: dict,
        audio_result: dict,
        gaze_result: dict
) -> dict:
    """
    Soft multimodal fusion of face, audio, and gaze predictions.

    Args:
        face_result:  dict with keys "emotion", "confidence", "probabilities"
        audio_result: dict with keys "emotion", "confidence", "probabilities"
        gaze_result:  dict with keys "gaze_x", "gaze_y"

    Returns:
        dict with fused emotion, confidence, secondary emotion, attention info.
    """

    # 1. Compute attention score from gaze
    attention = compute_attention(
        gaze_result["gaze_x"],
        gaze_result["gaze_y"]
    )

    # 2. Bug 3 fix: use soft-floor weighted face contribution
    face_weight_dynamic = _gaze_modulated_face_weight(attention)

    # 3. Initialize score accumulator for all canonical emotions
    emotion_scores: dict[str, float] = {e: 0.0 for e in CANONICAL_EMOTIONS}

    # 4. Extract full probability distributions
    face_probs  = face_result.get("probabilities", {})
    audio_probs = audio_result.get("probabilities", {})

    if face_probs and audio_probs:
        # ---- SOFT FUSION path (preferred) ----
        # Add face model full distribution
        for raw_label, prob in face_probs.items():
            # Bug 5 fix: normalize_emotion handles ALL label variants centrally
            canonical = normalize_emotion(raw_label)
            if canonical in emotion_scores:
                emotion_scores[canonical] += float(prob) * face_weight_dynamic

        # Add audio model full distribution
        for raw_label, prob in audio_probs.items():
            canonical = normalize_emotion(raw_label)
            if canonical in emotion_scores:
                emotion_scores[canonical] += float(prob) * AUDIO_WEIGHT

    else:
        # ---- LEGACY HARD-LABEL fallback (only if probs are missing) ----
        face_emo = normalize_emotion(face_result.get("emotion", "neutral"))
        if face_emo in emotion_scores:
            emotion_scores[face_emo] += face_result.get("confidence", 0.0) * face_weight_dynamic

        audio_emo = normalize_emotion(audio_result.get("emotion", "neutral"))
        if audio_emo in emotion_scores:
            emotion_scores[audio_emo] += audio_result.get("confidence", 0.0) * AUDIO_WEIGHT

    # 5. Rank emotions by accumulated score
    sorted_emotions = sorted(
        emotion_scores.items(),
        key=lambda item: item[1],
        reverse=True
    )

    top_1_emo,   top_1_score = sorted_emotions[0]
    top_2_emo,   top_2_score = sorted_emotions[1]

    total_score = sum(emotion_scores.values())

    if total_score > 1e-9:
        normalized_conf_1 = top_1_score / total_score
        normalized_conf_2 = top_2_score / total_score
    else:
        normalized_conf_1 = 0.0
        normalized_conf_2 = 0.0

    return {
        "emotion":              top_1_emo,
        "confidence":           round(normalized_conf_1 * 100, 2),
        "secondary_emotion":    top_2_emo,
        "secondary_confidence": round(normalized_conf_2 * 100, 2),
        "attention_score":      attention,
        "attention_state":      attention_state(attention),
    }
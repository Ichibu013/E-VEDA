import math
from utils.emotion_labels import normalize_emotion, CANONICAL_EMOTIONS

# ---------------------------------------------------------------------------
# Weight constants
# Face weight interpolates between MIN (distracted) and MAX (focused).
# Audio weight is always the complement → face_w + audio_w = 1.0 always.
# ---------------------------------------------------------------------------
FACE_WEIGHT_MAX = 0.65   # face weight when attention = 100
FACE_WEIGHT_MIN = 0.45   # face weight when attention = 0

# Power sharpening exponent.
# alpha=1 → no sharpening (original behavior)
# alpha=2 → squared scores, safe default (roughly doubles the top/second ratio)
# alpha=3 → aggressive, use only if models are well-calibrated
SHARPEN_ALPHA = 2.0


# ---------------------------------------------------------------------------
# Attention calculation
# ---------------------------------------------------------------------------
def compute_attention(gaze_x: float, gaze_y: float) -> float:
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


def _compute_weight_pair(attention: float):
    """
    Return (face_weight, audio_weight) that always sum to 1.0.
    Linear interpolation: high attention → trust face more.
    """
    t = attention / 100.0
    face_w  = FACE_WEIGHT_MIN + (FACE_WEIGHT_MAX - FACE_WEIGHT_MIN) * t
    audio_w = 1.0 - face_w
    return face_w, audio_w


def _sharpen_scores(scores: dict, alpha: float = 2.0) -> dict:
    """
    Power-sharpen a dict of probability scores.

    WHY NOT temperature softmax:
      Temperature softmax (score / T then exp) requires logit-scale inputs
      (range roughly -5 to +5). Our weighted probability scores are in the
      range [0.001, 0.10]. Dividing by T=0.5 only doubles tiny numbers:
      exp(0.14) vs exp(0.06) are nearly identical, so softmax collapses
      toward uniform distribution, REDUCING confidence (0.56 -> 0.33).

    WHY POWER SCALING WORKS:
      Raising small probabilities to alpha>1 amplifies relative differences.
      0.072^2 = 0.00518 vs 0.028^2 = 0.00078 -> ratio 2.6x becomes 6.6x.
      After renormalization the top score is meaningfully higher.

    Args:
        scores: dict of {emotion: raw_weighted_score}
        alpha:  exponent > 1 sharpens; 1.0 = no change; 2.0 is the safe default

    Returns:
        dict of {emotion: sharpened_normalized_score} summing to 1.0
    """
    if alpha <= 0:
        alpha = 1.0

    powered = {k: (v ** alpha) for k, v in scores.items()}
    total = sum(powered.values())

    if total < 1e-12:
        n = len(scores)
        return {k: 1.0 / n for k in scores}

    return {k: v / total for k, v in powered.items()}


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

    # 1. Attention from gaze
    attention = compute_attention(
        gaze_result["gaze_x"],
        gaze_result["gaze_y"]
    )

    # 2. Complementary weights that always sum to 1.0
    face_w, audio_w = _compute_weight_pair(attention)

    # 3. Score accumulator
    emotion_scores: dict[str, float] = {e: 0.0 for e in CANONICAL_EMOTIONS}

    # 4. Soft fusion from full probability distributions
    face_probs  = face_result.get("probabilities", {})
    audio_probs = audio_result.get("probabilities", {})

    if face_probs and audio_probs:
        for raw_label, prob in face_probs.items():
            canonical = normalize_emotion(raw_label)
            if canonical in emotion_scores:
                emotion_scores[canonical] += float(prob) * face_w

        for raw_label, prob in audio_probs.items():
            canonical = normalize_emotion(raw_label)
            if canonical in emotion_scores:
                emotion_scores[canonical] += float(prob) * audio_w

    else:
        # Hard-label fallback if probabilities are missing
        face_emo = normalize_emotion(face_result.get("emotion", "neutral"))
        if face_emo in emotion_scores:
            emotion_scores[face_emo] += face_result.get("confidence", 0.0) * face_w

        audio_emo = normalize_emotion(audio_result.get("emotion", "neutral"))
        if audio_emo in emotion_scores:
            emotion_scores[audio_emo] += audio_result.get("confidence", 0.0) * audio_w

    # 5. Power-sharpen to produce meaningful confidence values.
    #    Operates correctly on probability-scale inputs unlike temperature softmax.
    sharpened = _sharpen_scores(emotion_scores, alpha=SHARPEN_ALPHA)

    # 6. Rank and return
    sorted_emotions = sorted(
        sharpened.items(),
        key=lambda item: item[1],
        reverse=True
    )

    top_1_emo, top_1_conf = sorted_emotions[0]
    top_2_emo, top_2_conf = sorted_emotions[1]

    return {
        "emotion":              top_1_emo,
        "confidence":           round(top_1_conf * 100, 2),
        "secondary_emotion":    top_2_emo,
        "secondary_confidence": round(top_2_conf * 100, 2),
        "attention_score":      attention,
        "attention_state":      attention_state(attention),
    }
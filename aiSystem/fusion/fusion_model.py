"""
Multimodal Fusion Model Module
==============================
This module implements the soft late-fusion algorithms, combining the discrete predictions 
from the audio, video/facial, and gaze models into a cohesive prediction of mental state.
"""

import math
from utils.emotion_labels import normalize_emotion, CANONICAL_EMOTIONS

# ---------------------------------------------------------------------------
# Weight constants
# ---------------------------------------------------------------------------
FACE_WEIGHT_MAX = 0.65   # face weight when attention = 100
FACE_WEIGHT_MIN = 0.45   # face weight when attention = 0

# Power sharpening exponent — operates on probability space (0.001–0.10).
# alpha=2 is the validated default. Do NOT replace with temperature softmax
# (that requires logit-scale inputs and collapses confidence when applied here).
SHARPEN_ALPHA = 2.0

# Reliability gating thresholds.
# If face confidence is HIGH and audio disagrees on valence, penalise audio.
FACE_HIGH_CONF_THRESHOLD  = 0.60   # face must be this confident to trigger gating
AUDIO_RELIABILITY_PENALTY = 0.50   # multiply audio_w by this when gating fires
# 0.50 = halve audio contribution

# Valence groups for cross-modal contradiction detection
_POSITIVE_EMOTIONS = {"happy"}
_NEGATIVE_EMOTIONS = {"angry", "fear", "disgust", "sad"}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def compute_attention(gaze_x: float, gaze_y: float) -> float:
    """
    Computes an attention score based on normalized gaze coordinates.
    
    Args:
        gaze_x (float): Normalized horizontal gaze component.
        gaze_y (float): Normalized vertical gaze component.
        
    Returns:
        float: Computed attention score out of 100.
    """
    distance = math.sqrt(gaze_x ** 2 + gaze_y ** 2)
    return round(max(0.0, 100.0 - distance * 100.0), 2)


def attention_state(attention: float) -> str:
    """
    Discretizes the continuous attention score into categorical states.
    
    Args:
        attention (float): The continuous attention score (0-100).
        
    Returns:
        str: Categorical label describing attention.
    """
    if attention > 70:   return "Focused"
    elif attention > 40: return "Moderate"
    else:                return "Distracted"


def _compute_weight_pair(attention: float) -> tuple:
    """Complementary face/audio weights that always sum to 1.0."""
    t      = attention / 100.0
    face_w = FACE_WEIGHT_MIN + (FACE_WEIGHT_MAX - FACE_WEIGHT_MIN) * t
    return face_w, 1.0 - face_w


def _audio_is_reliable(face_result: dict, audio_result: dict) -> bool:
    """
    Return False when face is highly confident AND audio valence contradicts it.

    Logic:
      - Gate only fires when face top-class prob >= FACE_HIGH_CONF_THRESHOLD.
        Below that, face isn't certain enough to override audio.
      - Contradiction = one modality is positive (happy), other is negative
        (angry/fear/disgust/sad). Same-group disagreements (e.g. sad vs angry)
        are NOT contradictions — they're legitimate ambiguity.

    Examples:
      face=Happy@82%, audio=fearful  -> gate fires (positive vs negative)
      face=Happy@40%, audio=fearful  -> no gate (face confidence too low)
      face=Sad@75%,   audio=angry    -> no gate (both negative, legitimate)
      face=Happy@80%, audio=neutral  -> no gate (neutral is not negative)
    """
    face_probs    = face_result.get("probabilities", {})
    face_top_prob = max(face_probs.values(), default=0.0) if face_probs else \
        face_result.get("confidence", 0.0)

    if face_top_prob < FACE_HIGH_CONF_THRESHOLD:
        return True

    face_emo  = normalize_emotion(face_result.get("emotion", "neutral"))
    audio_emo = normalize_emotion(audio_result.get("emotion", "neutral"))

    face_pos  = face_emo  in _POSITIVE_EMOTIONS
    face_neg  = face_emo  in _NEGATIVE_EMOTIONS
    audio_pos = audio_emo in _POSITIVE_EMOTIONS
    audio_neg = audio_emo in _NEGATIVE_EMOTIONS

    contradiction = (face_pos and audio_neg) or (face_neg and audio_pos)
    return not contradiction


def _sharpen_scores(scores: dict, alpha: float = 2.0) -> dict:
    """
    Power-sharpen probability scores. alpha>1 increases top-class separation.

    Correct for probability-space inputs (0.001–0.10).
    Do NOT substitute temperature softmax — it requires logit-scale inputs
    and produces near-uniform output on small floats, dropping confidence.
    """
    if alpha <= 0:
        alpha = 1.0
    powered = {k: v ** alpha for k, v in scores.items()}
    total   = sum(powered.values())
    if total < 1e-12:
        n = len(scores)
        return {k: 1.0 / n for k in scores}
    return {k: v / total for k, v in powered.items()}


# ---------------------------------------------------------------------------
# Core fusion function — api.py response format UNCHANGED
# ---------------------------------------------------------------------------
def fuse_predictions(
        face_result:  dict,
        audio_result: dict,
        gaze_result:  dict
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

    # 1. Attention
    attention = compute_attention(gaze_result["gaze_x"], gaze_result["gaze_y"])

    # 2. Complementary weights (always sum to 1.0)
    face_w, audio_w = _compute_weight_pair(attention)

    # 3. Reliability gate — reduce audio weight if it contradicts a confident face
    if not _audio_is_reliable(face_result, audio_result):
        audio_w *= AUDIO_RELIABILITY_PENALTY
        face_w   = 1.0 - audio_w   # rebalance to maintain budget = 1.0

    # 4. Accumulate weighted probability scores
    emotion_scores: dict[str, float] = {e: 0.0 for e in CANONICAL_EMOTIONS}

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
        # Hard-label fallback (only when probability dicts are absent)
        face_emo = normalize_emotion(face_result.get("emotion", "neutral"))
        if face_emo in emotion_scores:
            emotion_scores[face_emo] += face_result.get("confidence", 0.0) * face_w

        audio_emo = normalize_emotion(audio_result.get("emotion", "neutral"))
        if audio_emo in emotion_scores:
            emotion_scores[audio_emo] += audio_result.get("confidence", 0.0) * audio_w

    # 5. Power-sharpen and rank
    sharpened       = _sharpen_scores(emotion_scores, alpha=SHARPEN_ALPHA)
    sorted_emotions = sorted(sharpened.items(), key=lambda x: x[1], reverse=True)

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

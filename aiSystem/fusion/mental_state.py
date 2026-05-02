"""
Mental State Classifier Module
==============================
This module maps fused low-level multimodal features (e.g., emotion and attention)
into high-level cognitive/mental state categories.
"""

from utils.emotion_labels import normalize_emotion

def mental_state(emotion: str, attention: float) -> str:
    """
    Derive a coarse mental state label from the fused emotion and attention score.

    Args:
        emotion:   Raw or canonical emotion string (normalized internally).
        attention: Attention score 0–100 from gaze model.

    Returns:
        str: One of: "High Stress", "Possible Depression", "Normal",
             "Positive State", "Mild Stress"
    """
    emo = normalize_emotion(emotion)

    if emo == "angry" and attention < 50:
        return "High Stress"

    elif emo == "sad" and attention < 40:
        return "Possible Depression"

    elif emo == "neutral" and attention > 70:
        return "Normal"

    elif emo == "happy":
        return "Positive State"

    else:
        return "Mild Stress"

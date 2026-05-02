"""
Stress Modeling Module
======================
This module estimates physiological and psychological stress levels
using fused emotion labels and attention metrics as inputs.
"""

from utils.emotion_labels import normalize_emotion

def compute_stress(emotion: str, attention: float) -> int:
    """
    Compute a stress score 0–100 from fused emotion and attention.

    Args:
        emotion:   Raw or canonical emotion string (normalized internally).
        attention: Attention score 0–100 from gaze model.

    Returns:
        int: Integer stress score clamped to [0, 100], where higher values
             indicate higher perceived stress.
    """
    emo = normalize_emotion(emotion)

    stress = 0

    if emo in ["angry", "fear"]:
        stress += 60

    elif emo == "sad":
        stress += 40

    if attention < 40:
        stress += 30

    elif attention < 60:
        stress += 15

    return min(stress, 100)

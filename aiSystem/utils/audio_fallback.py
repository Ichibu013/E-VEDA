"""
Audio Fallback Module
=====================
Provides resilient mechanisms to handle silent or absent audio input gracefully,
ensuring the multi-modality fusion system doesn't crash when audio modalities are missing.
"""

SILENT_AUDIO_PRIOR: dict[str, float] = {
    "neutral":  0.70,
    "happy":    0.06,
    "sad":      0.06,
    "angry":    0.05,
    "fear":     0.05,
    "disgust":  0.04,
    "surprise": 0.04,
}

# Confidence for the silent case — intentionally moderate, not 1.0,
# so it doesn't overwhelm the face/gaze signal.
SILENT_AUDIO_CONFIDENCE: float = 0.70


def make_silent_audio_result() -> dict:
    """
    Returns a well-formed audio_result dict for silent/absent audio.
    Drop-in replacement for the raw {'emotion': 'neutral', 'confidence': 0.8}
    fallback previously used in api.py.

    The returned dict is structurally identical to what predict_audio_emotion()
    returns, so fuse_predictions() always takes the soft-fusion path.

    Usage (in api.py):
        from aiSystem.utils.audio_fallback import make_silent_audio_result
        ...
        if is_silent:
            audio_result = make_silent_audio_result()
        else:
            audio_result = predict_audio_emotion(clean_audio_path)
            
    Returns:
        dict: The dummy prediction schema mapping to an ambiguous 'neutral' output.
    """
    return {
        "emotion":       "neutral",
        "confidence":    SILENT_AUDIO_CONFIDENCE,
        "probabilities": dict(SILENT_AUDIO_PRIOR),  # return a copy, not the module-level dict
    }

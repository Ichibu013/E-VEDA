_CANONICAL_MAP: dict[str, str] = {
    # Face model outputs (FER+ / FER2013)
    "anger":     "angry",
    "angry":     "angry",
    "disgust":   "disgust",
    "fear":      "fear",
    "happy":     "happy",
    "neutral":   "neutral",
    "sad":       "sad",
    "surprise":  "surprise",

    # Audio model outputs (RAVDESS labels)
    "calm":      "neutral",
    "fearful":   "fear",       # Bug 5 fix — was missing
    "surprised": "surprise",   # Bug 5 fix — was missing
    # "angry", "disgust", "happy", "neutral", "sad" already covered above

    # Legacy / alternate spellings
    "happiness": "happy",
    "sadness":   "sad",
    "angriness": "angry",
    "contempt":  "disgust",   # FER+ 8-class contempt → nearest canonical
}

# The canonical set — must match EMOTIONS list in fusion_model.py exactly
CANONICAL_EMOTIONS: list[str] = [
    "neutral", "happy", "sad", "angry", "fear", "disgust", "surprise"
]


def normalize_emotion(label: str) -> str:
    """
    Convert any raw model output label to its canonical fusion label.

    Returns the canonical label string, or the lowercased input unchanged
    if no mapping exists (allows graceful handling of future model outputs
    without crashing the pipeline).

    Usage:
        from aiSystem.utils.emotion_labels import normalize_emotion
        canonical = normalize_emotion(raw_label)  # e.g. "fearful" → "fear"
    """
    cleaned = str(label).strip().lower()
    return _CANONICAL_MAP.get(cleaned, cleaned)


def is_valid_emotion(label: str) -> bool:
    """Returns True if label (after normalization) is a known canonical emotion."""
    return normalize_emotion(label) in CANONICAL_EMOTIONS
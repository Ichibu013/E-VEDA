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
    "fearful":   "fear",
    "surprised": "surprise",

    # Legacy / alternate spellings
    "happiness": "happy",
    "sadness":   "sad",
    "angriness": "angry",
    "contempt":  "disgust",

    # additional RAVDESS variants that appear in some label_encoder.pkl builds
    "fear":      "fear",     # explicit identity to prevent any miss
    "disgust":   "disgust",
    "ps":        "surprise", # RAVDESS code used by some encoders
    "su":        "surprise",
    "sa":        "sad",
    "ha":        "happy",
    "ne":        "neutral",
    "an":        "angry",
    "di":        "disgust",
    "fe":        "fear",
}

CANONICAL_EMOTIONS: list[str] = [
    "neutral", "happy", "sad", "angry", "fear", "disgust", "surprise"
]


def normalize_emotion(label: str) -> str:
    """
    Convert any raw model output label to its canonical fusion label.

    Returns the canonical label string, or the lowercased input unchanged
    if no mapping exists (allows graceful handling of future model outputs).
    """
    cleaned = str(label).strip().lower()
    return _CANONICAL_MAP.get(cleaned, cleaned)


def is_valid_emotion(label: str) -> bool:
    """Returns True if label (after normalization) is a known canonical emotion."""
    return normalize_emotion(label) in CANONICAL_EMOTIONS


def normalize_probs_dict(probs: dict) -> dict:
    """
    FIX: Normalize a {raw_label: prob} dict so canonical labels are used
    and probabilities are aggregated and re-normalized.

    This is the safe way to consume any model's probability output in fusion.
    Call this on face_probs and audio_probs before passing to fuse_predictions().

    Example:
        raw = {"fearful": 0.3, "neutral": 0.5, "happy": 0.2}
        normalize_probs_dict(raw)
        → {"fear": 0.3, "neutral": 0.5, "happy": 0.2}
    """
    canonical: dict[str, float] = {e: 0.0 for e in CANONICAL_EMOTIONS}
    for raw_label, prob in probs.items():
        key = normalize_emotion(raw_label)
        if key in canonical:
            canonical[key] += float(prob)

    # Re-normalize so output sums to 1.0
    total = sum(canonical.values())
    if total > 1e-9:
        canonical = {k: v / total for k, v in canonical.items()}

    return canonical
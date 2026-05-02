CANONICAL = {
    "anger": "angry", "fearful": "fear",
    "surprised": "surprise", "calm": "neutral",
    "disgust": "disgust", "happy": "happy",
    "sad": "sad", "neutral": "neutral",
}

def normalize_emotion(label: str) -> str:
    return CANONICAL.get(str(label).strip().lower(), str(label).strip().lower())
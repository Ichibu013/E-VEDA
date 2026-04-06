def compute_stress(emotion, attention):

    stress = 0

    if emotion in ["angry", "fear"]:
        stress += 60

    elif emotion == "sad":
        stress += 40

    if attention < 40:
        stress += 30

    elif attention < 60:
        stress += 15

    return min(stress, 100)
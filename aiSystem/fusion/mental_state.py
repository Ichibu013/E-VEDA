def mental_state(emotion, attention):

    if emotion == "angry" and attention < 50:
        return "High Stress"

    elif emotion == "sad" and attention < 40:
        return "Possible Depression"

    elif emotion == "neutral" and attention > 70:
        return "Normal"

    elif emotion == "happy":
        return "Positive State"

    else:
        return "Mild Stress"
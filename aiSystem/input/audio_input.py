"""
Live Audio Input Module
=======================
Handles real-time microphone capture for direct, live inferences 
without needing pre-recorded files.
"""

import sounddevice as sd
import soundfile as sf


def record_audio(duration=8, filename="temp_audio.wav"):
    """
    Records audio directly from the default system microphone for a set duration.

    Args:
        duration (int): Duration of recording in seconds. Default is 8.
        filename (str): The desired path for the generated temporary audio file.

    Returns:
        str: Path to the recorded wav file.
    """
    samplerate = 22050

    print("Recording audio...")

    audio = sd.rec(
        int(duration * samplerate),
        samplerate=samplerate,
        channels=1
    )

    sd.wait()

    sf.write(filename, audio, samplerate)

    print("Recording complete")

    return filename

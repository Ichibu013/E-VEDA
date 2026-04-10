import sounddevice as sd
import soundfile as sf


def record_audio(duration=8, filename="temp_audio.wav"):

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
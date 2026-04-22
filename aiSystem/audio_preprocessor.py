import librosa
import soundfile as sf
import numpy as np
import os

def clean_and_normalize_audio(input_path: str, output_path: str, target_sr: int = 16000) -> str:
    """
    Cleans audio by resampling, trimming silence, and normalizing volume.
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Audio file not found: {input_path}")

    # 1. Load and resample to standard target sample rate
    y, sr = librosa.load(input_path, sr=target_sr)
    
    # 2. Trim leading and trailing silence (top_db is the threshold)
    y_trimmed, _ = librosa.effects.trim(y, top_db=20)
    
    # 3. Peak normalization (scales the audio so the highest peak is exactly 1.0)
    y_normalized = librosa.util.normalize(y_trimmed)
    
    # 4. Save the cleaned audio to the new path
    sf.write(output_path, y_normalized, target_sr)
    
    return output_path

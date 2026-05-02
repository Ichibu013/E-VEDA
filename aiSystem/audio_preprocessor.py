"""
Audio Preprocessing Module
==========================
This module provides utilities to clean and normalize raw audio data prior to inference,
ensuring consistent sample rates, removing silent segments, and scaling amplitude.
"""

import librosa
import soundfile as sf
import numpy as np
import os

def clean_and_normalize_audio(input_path: str, output_path: str, target_sr: int = 16000) -> str:
    """
    Cleans audio by resampling to a standard sample rate, trimming silence, 
    and normalizing its volume peak.

    Args:
        input_path (str): Absolute or relative path to the input audio file.
        output_path (str): The desired path for the cleaned audio output.
        target_sr (int): Target sampling rate for the output audio. Default is 16000 Hz.

    Returns:
        str: The path to the successfully cleaned and saved audio file.
        
    Raises:
        FileNotFoundError: If the input audio file does not exist.
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Audio file not found: {input_path}")

    # 1. Load and resample to standard target sample rate
    y, sr = librosa.load(input_path, sr=target_sr)
    
    # 2. Trim leading and trailing silence (top_db is the threshold for what is considered silence)
    y_trimmed, _ = librosa.effects.trim(y, top_db=20)
    
    # 3. Peak normalization (scales the audio so the highest peak is exactly 1.0)
    y_normalized = librosa.util.normalize(y_trimmed)
    
    # 4. Save the cleaned audio to the new path
    sf.write(output_path, y_normalized, target_sr)
    
    return output_path

"""
Video Preprocessing Module
==========================
Offers standard utilities to sanitize and normalize uploaded MP4 clips, targeting 
a unified resolution and framerate to ensure MediaPipe algorithms operate reliably.
"""

import cv2
import os

def standardize_video(input_path: str, output_path: str, target_fps: int = 30, target_resolution: tuple = (1280, 720)) -> str:
    """
    Cleans video by standardizing resolution and framerate to ensure consistent Mediapipe tracking.

    Args:
        input_path (str): The absolute or relative path to the source raw video file.
        output_path (str): The desired save path for the normalized video file.
        target_fps (int): Standard target frames-per-second (default 30).
        target_resolution (tuple): The target width and height to resize all frames (default 1280x720).

    Returns:
        str: Absolute path pointing to the clean standard video file.

    Raises:
        FileNotFoundError: If the source file cannot be located.
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Video file not found: {input_path}")

    cap = cv2.VideoCapture(input_path)
    
    # Set up the video writer with standard MP4 codec
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, target_fps, target_resolution)

    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        # 1. Standardize Resolution
        resized_frame = cv2.resize(frame, target_resolution)
        
        # 2. Optional: Apply slight Gaussian Blur to reduce heavy pixel noise
        # smoothed_frame = cv2.GaussianBlur(resized_frame, (3, 3), 0)
        
        out.write(resized_frame)

    cap.release()
    out.release()
    
    return output_path

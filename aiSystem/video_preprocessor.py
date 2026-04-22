import cv2
import os

def standardize_video(input_path: str, output_path: str, target_fps: int = 30, target_resolution: tuple = (1280, 720)) -> str:
    """
    Cleans video by standardizing resolution and framerate to ensure consistent Mediapipe tracking.
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

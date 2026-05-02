"""
Live Camera Input Module
========================
Provides functionalities to open local webcams, track facial features using MediaPipe, 
and automatically extract region-specific crops (e.g., full face, left/right eyes) 
necessary for real-time model inference.
"""

import cv2
import mediapipe as mp
import numpy as np
import time

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5
)

# Model input size constants — single source of truth
FACE_SIZE     = (128, 128)
EYE_SIZE      = (64, 64)
CAPTURE_DELAY = 5   # seconds before snapshot


def get_crop(image: np.ndarray, landmarks, indices, padding: float = 0.2) -> np.ndarray:
    """Crop a region from image based on landmark indices with padding."""
    h, w, _ = image.shape
    coords = [(int(landmarks[i].x * w), int(landmarks[i].y * h)) for i in indices]

    x_min, y_min = np.min(coords, axis=0)
    x_max, y_max = np.max(coords, axis=0)

    pw = int((x_max - x_min) * padding)
    ph = int((y_max - y_min) * padding)

    crop = image[
        max(0, y_min - ph): min(h, y_max + ph),
        max(0, x_min - pw): min(w, x_max + pw)
    ]
    return crop


def capture_face_and_eyes() -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Open the webcam, wait for a stable face detection, capture one frame,
    and return pre-resized crops ready for model inference.

    Returns:
        (face_crop, left_eye_crop, right_eye_crop) — numpy arrays with
        guaranteed shapes (128,128,3), (64,64,3), (64,64,3).

    Raises:
        RuntimeError: if camera cannot be opened or no face detected.
    """
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        raise RuntimeError("Camera not accessible. Check device permissions.")

    print(f"Camera open — align your face. Capturing in {CAPTURE_DELAY} seconds.")
    start_time = time.time()
    result_crops = None

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        display_frame = cv2.flip(frame, 1)
        rgb_frame     = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results       = face_mesh.process(rgb_frame)

        elapsed   = time.time() - start_time
        countdown = max(0, int(CAPTURE_DELAY - elapsed))

        cv2.putText(display_frame, f"Capturing in: {countdown}",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        if results.multi_face_landmarks:
            cv2.putText(display_frame, "Face Detected",
                        (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            landmarks = results.multi_face_landmarks[0].landmark

            if elapsed >= CAPTURE_DELAY:
                face_crop      = get_crop(frame, landmarks, range(0, 468), padding=0.1)
                left_eye_crop  = get_crop(frame, landmarks,
                                          [33, 133, 157, 158, 159, 160, 161, 246])
                right_eye_crop = get_crop(frame, landmarks,
                                          [362, 263, 384, 385, 386, 387, 388, 466])

                # Bug 6 fix: resize immediately and return resized arrays directly.
                # Do NOT store in a tuple first — that was the original bug.
                face_crop      = cv2.resize(face_crop,      FACE_SIZE)
                left_eye_crop  = cv2.resize(left_eye_crop,  EYE_SIZE)
                right_eye_crop = cv2.resize(right_eye_crop, EYE_SIZE)

                result_crops = (face_crop, left_eye_crop, right_eye_crop)
                break

        cv2.imshow("EVEDA Camera — Please look at the screen", display_frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()

    if result_crops is None:
        raise RuntimeError(
            "Failed to detect a face during the capture window. "
            "Ensure good lighting and that your face is fully visible."
        )

    # Post-condition assertion — enforces the shape contract for callers
    face_out, left_out, right_out = result_crops
    assert face_out.shape[:2]     == FACE_SIZE, \
        f"Face crop shape mismatch: expected {FACE_SIZE}, got {face_out.shape[:2]}"
    assert left_out.shape[:2]     == EYE_SIZE, \
        f"Left eye crop shape mismatch: expected {EYE_SIZE}, got {left_out.shape[:2]}"
    assert right_out.shape[:2]    == EYE_SIZE, \
        f"Right eye crop shape mismatch: expected {EYE_SIZE}, got {right_out.shape[:2]}"

    return face_out, left_out, right_out

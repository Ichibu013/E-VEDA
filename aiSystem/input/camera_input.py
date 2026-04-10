import cv2
import mediapipe as mp
import numpy as np
import time

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True, # This gives detailed iris/eye landmarks
    min_detection_confidence=0.5
)

def get_crop(image, landmarks, indices, padding=0.2):
    """Utility to crop an area based on landmark indices with optional padding."""
    h, w, _ = image.shape
    coords = [(int(landmarks[i].x * w), int(landmarks[i].y * h)) for i in indices]
    
    x_min, y_min = np.min(coords, axis=0)
    x_max, y_max = np.max(coords, axis=0)
    
    # Add padding
    pw, ph = int((x_max - x_min) * padding), int((y_max - y_min) * padding)
    
    # Ensure coordinates stay within image boundaries
    crop = image[max(0, y_min-ph):min(h, y_max+ph), max(0, x_min-pw):min(w, x_max+pw)]
    return crop

def capture_face_and_eyes():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        raise Exception("Camera not accessible")

    print("Opening camera... Align your face. Capturing in 5 seconds.")
    start_time = time.time()
    captured_data = None

    while True:
        ret, frame = cap.read()
        if not ret: break
        
        # Flip for a natural "mirror" view
        display_frame = cv2.flip(frame, 1) 
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb_frame)

        # UI Overlay
        elapsed = time.time() - start_time
        countdown = max(0, int(5 - elapsed))
        cv2.putText(display_frame, f"Capturing in: {countdown}", (50, 50), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        if results.multi_face_landmarks:
            cv2.putText(display_frame, "Face Detected", (50, 100), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            landmarks = results.multi_face_landmarks[0].landmark
            
            # MediaPipe Indices: 
            # Left Eye: 33, 133, 157, 158, 159, 160, 161, 246
            # Right Eye: 362, 263, 384, 385, 386, 387, 388, 466
            # Face: 1, 10, 234, 454 (Simplified boundary)
            
            if elapsed >= 5:
                # Capture standard non-flipped frame for the model
                face_crop = get_crop(frame, landmarks, range(0, 468), padding=0.1)
                left_eye_crop = get_crop(frame, landmarks, [33, 133, 157, 158, 159, 160, 161, 246])
                right_eye_crop = get_crop(frame, landmarks, [362, 263, 384, 385, 386, 387, 388, 466])
                
                captured_data = (face_crop, left_eye_crop, right_eye_crop)
                break

        cv2.imshow("EVEDA Camera - Please Look at the Screen", display_frame)
        if cv2.waitKey(1) & 0xFF == ord('q'): break

    cap.release()
    cv2.destroyAllWindows()

    if captured_data is None:
        raise Exception("Failed to detect face during capture")

    # resize
    face_crop = cv2.resize(face_crop, (128, 128))
    left_eye_crop = cv2.resize(left_eye_crop, (64, 64))
    right_eye_crop = cv2.resize(right_eye_crop, (64, 64))
    return captured_data
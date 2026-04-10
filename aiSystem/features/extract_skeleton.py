import cv2
import mediapipe as mp
import numpy as np

mp_pose = mp.solutions.pose

def extract_skeleton_sequence(frames=20):
    cap = cv2.VideoCapture(0)
    pose = mp_pose.Pose()
    skeleton_sequence = []

    print(f"Extracting {frames} frames for skeleton sequence...")

    for _ in range(frames):
        ret, frame = cap.read()
        if not ret:
            # If a frame fails, append zeros to keep the sequence length consistent
            skeleton_sequence.append(np.zeros((33, 3)))
            continue

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = pose.process(frame_rgb)

        if result.pose_landmarks:
            landmarks = result.pose_landmarks.landmark
            joints = np.array([[lm.x, lm.y, lm.z] for lm in landmarks])
        else:
            joints = np.zeros((33, 3))

        skeleton_sequence.append(joints)

    cap.release()

    # Convert to numpy array: (Frames, Joints, Coords) -> (20, 33, 3)
    skeleton_sequence = np.array(skeleton_sequence)

    # 1. Transform to (Channels, Frames, Joints) -> (3, 20, 33)
    # This represents the raw Position (X, Y, Z)
    X = skeleton_sequence.transpose(2, 0, 1)

    # 2. Calculate Velocity: Difference between consecutive frames
    # shape will be (3, 20, 33)
    vel = np.zeros_like(X)
    # Velocity at time t = Position at (t+1) - Position at t
    vel[:, :-1, :] = X[:, 1:, :] - X[:, :-1, :]

    # 3. Calculate Acceleration: Difference between consecutive velocities
    # shape will be (3, 20, 33)
    acc = np.zeros_like(vel)
    # Acceleration at time t = Velocity at (t+1) - Velocity at t
    acc[:, :-1, :] = vel[:, 1:, :] - vel[:, :-1, :]

    # 4. Concatenate to get 9 channels (3 Position + 3 Velocity + 3 Acceleration)
    # Final shape: (9, 20, 33)
    final_skeleton = np.concatenate((X, vel, acc), axis=0)

    return final_skeleton
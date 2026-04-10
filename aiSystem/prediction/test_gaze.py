import cv2
from aiSystem.prediction.predict_gaze import predict_gaze

face = cv2.imread("aiSystem/test_data/face.jpeg")
left_eye = cv2.imread("aiSystem/test_data/left_eye.jpeg")
right_eye = cv2.imread("aiSystem/test_data/right_eye.jpeg")

result = predict_gaze(face, left_eye, right_eye)

print("Predicted Gaze:", result)
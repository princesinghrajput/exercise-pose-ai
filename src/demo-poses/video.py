import tensorflow as tf
import numpy as np
import cv2

# Load PoseNet model
model = tf.saved_model.load("https://tfhub.dev/google/tfjs-model/posenet/resnet50/float/1")

def get_angle(p1, p2, p3):
    """Calculate the angle between three points."""
    a = np.array(p1)
    b = np.array(p2)
    c = np.array(p3)
    
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(np.degrees(radians))
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle

# Capture video
cap = cv2.VideoCapture('/chair-sitting-exercise//chair-situps.mp4')

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    # Preprocess the frame for PoseNet
    input_image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    input_image = tf.image.resize(input_image, (257, 257))
    input_image = tf.expand_dims(input_image, axis=0)
    
    # Perform pose detection
    outputs = model.signatures["serving_default"](input_image)
    keypoints = outputs['output_0'].numpy()[0]

    # Extract keypoints
    left_shoulder = keypoints[5][:2]
    right_shoulder = keypoints[6][:2]
    left_elbow = keypoints[7][:2]
    right_elbow = keypoints[8][:2]
    left_wrist = keypoints[9][:2]
    right_wrist = keypoints[10][:2]
    left_hip = keypoints[11][:2]
    right_hip = keypoints[12][:2]
    left_knee = keypoints[13][:2]
    right_knee = keypoints[14][:2]
    left_ankle = keypoints[15][:2]
    right_ankle = keypoints[16][:2]
    
    # Calculate angles
    left_elbow_angle = get_angle(left_shoulder, left_elbow, left_wrist)
    right_elbow_angle = get_angle(right_shoulder, right_elbow, right_wrist)
    left_knee_angle = get_angle(left_hip, left_knee, left_ankle)
    right_knee_angle = get_angle(right_hip, right_knee, right_ankle)

    # Draw the skeleton on the frame
    for i in range(0, 17):
        position = keypoints[i][:2].astype(int)
        cv2.circle(frame, tuple(position), 5, (0, 255, 0), -1)
    
    cv2.line(frame, tuple(left_shoulder), tuple(left_elbow), (255, 0, 0), 2)
    cv2.line(frame, tuple(left_elbow), tuple(left_wrist), (255, 0, 0), 2)
    cv2.line(frame, tuple(right_shoulder), tuple(right_elbow), (255, 0, 0), 2)
    cv2.line(frame, tuple(right_elbow), tuple(right_wrist), (255, 0, 0), 2)
    cv2.line(frame, tuple(left_hip), tuple(left_knee), (255, 0, 0), 2)
    cv2.line(frame, tuple(left_knee), tuple(left_ankle), (255, 0, 0), 2)
    cv2.line(frame, tuple(right_hip), tuple(right_knee), (255, 0, 0), 2)
    cv2.line(frame, tuple(right_knee), tuple(right_ankle), (255, 0, 0), 2)

    # Show the angles
    cv2.putText(frame, f"Left Elbow: {left_elbow_angle:.2f}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
    cv2.putText(frame, f"Right Elbow: {right_elbow_angle:.2f}", (50, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
    cv2.putText(frame, f"Left Knee: {left_knee_angle:.2f}", (50, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
    cv2.putText(frame, f"Right Knee: {right_knee_angle:.2f}", (50, 110), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
    
    # Display the frame with the skeleton
    cv2.imshow('Pose Estimation', frame)

    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

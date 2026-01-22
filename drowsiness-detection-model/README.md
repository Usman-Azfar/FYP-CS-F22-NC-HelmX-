 HelmX - Driver Drowsiness Detection Model

 Project Overview

HelmX Driver Drowsiness Detection is an AI-powered real-time system designed to monitor driver/rider alertness and detect signs of drowsiness. The system uses computer vision and deep learning to analyze eye states through live video feed, providing immediate alerts when drowsiness is detected.

The system is part of the comprehensive HelmX ecosystem, which includes:
- Android Mobile App (user interface and control)
- Web Application (companion web platform)
- Crash Detection Model (AI-based anomaly detection system)
- Drowsiness Detection Model (this component)

HelmX combines artificial intelligence, computer vision, and real-time processing to create a fully integrated safety ecosystem, making every motorcycle ride smarter, safer, and more connected.

 Problem Statement

Driver drowsiness is a critical safety issue that leads to:
- High accident rates: Drowsy driving is responsible for a significant percentage of road accidents
- Delayed reaction times: Drowsiness impairs cognitive function and reaction speed
- Microsleep episodes: Brief moments of unconsciousness can be fatal on the road
- Lack of awareness: Drivers often don't realize they're becoming drowsy until it's too late
- No real-time monitoring: Existing solutions are either expensive or not integrated with helmet systems

HelmX Drowsiness Detection addresses these challenges by providing:
- Real-time eye state monitoring using computer vision
- Dual-metric detection (CNN model predictions + Eye Aspect Ratio)
- Immediate audio-visual alerts when drowsiness is detected
- Prediction smoothing to reduce false positives
- Lightweight implementation suitable for edge deployment
- Integration with the HelmX smart helmet ecosystem

 Technologies Used

 Core Technologies
- Python 3.x: Primary programming language
- OpenCV (cv2): Computer vision library for video processing and image manipulation
- TensorFlow/Keras: Deep learning framework for model inference
- MediaPipe: Google's framework for face mesh detection and landmark extraction
- NumPy: Numerical computing for array operations

 Machine Learning
- CNN Model: Pre-trained eye state classification model (`eye_state_model.h5`)
- Transfer Learning: Utilizes pre-trained models for efficient inference
- Real-time Inference: Optimized for low-latency predictions

 Computer Vision Techniques
- Face Mesh Detection: 468 facial landmarks for precise eye region extraction
- Eye Aspect Ratio (EAR): Geometric metric for eye closure detection
- Image Enhancement: CLAHE (Contrast Limited Adaptive Histogram Equalization) for better detection
- Gaussian Blur: Noise reduction in eye images

 Audio/Visual Feedback
- Audio Alarms: Windows sound system for alert notifications
- Visual Overlays: Real-time status display on video feed
- Color-coded Indicators: Visual feedback for eye state (green=open, red=closed)

 Installation Steps

 Prerequisites

Before you begin, ensure you have the following installed:

1. Python 3.7 or higher
   - Download from: https://www.python.org/downloads/
   - Verify installation: `python --version`

2. Webcam/Camera
   - Built-in webcam or USB camera
   - Camera must be accessible by OpenCV

3. Operating System
   - Windows (for winsound alarm support)
   - Linux/macOS (with alternative audio libraries)

 Setup Instructions

1. Clone the Repository
   ```bash
   git clone <repository-url>
   cd drowsiness-detection-model
   ```

2. Create Virtual Environment (Recommended)
   ```bash
   python -m venv venv
   
    On Windows
   venv\Scripts\activate
   
    On Linux/macOS
   source venv/bin/activate
   ```

3. Install Dependencies
   ```bash
   pip install opencv-python
   pip install tensorflow
   pip install mediapipe
   pip install numpy
   ```

   Or install all at once:
   ```bash
   pip install opencv-python tensorflow mediapipe numpy
   ```

4. Verify Model File
   - Ensure `eye_state_model.h5` is present in the directory
   - This is the pre-trained CNN model for eye state classification

5. Verify Alarm File (Optional)
   - Ensure `alarm.wav` is present for audio alerts
   - If missing, the system will still work but won't play audio alarms

 How to Run the Project

 Running the Detection System

1. Activate Virtual Environment (if using one)
   ```bash
    Windows
   venv\Scripts\activate
   
    Linux/macOS
   source venv/bin/activate
   ```

2. Run the Detection Script
   ```bash
   python eye_detection.py
   ```

3. Using the Application
   - The application will open your default camera
   - Position yourself so your face is clearly visible
   - The system will display:
     - Eye state (Open/Closed) with prediction confidence
     - Eye Aspect Ratio (EAR) value
     - Closed time duration (if eyes are closed)
     - Alert message when drowsiness is detected
   - Press `q` to quit the application

 Configuration Options

You can modify the following parameters in `eye_detection.py`:

```python
 Detection thresholds
EYE_STATE_THRESHOLD = 0.5         CNN prediction threshold (0-1)
EAR_THRESHOLD = 0.15               Eye Aspect Ratio threshold
CLOSED_FRAMES_THRESHOLD_SECONDS = 0.5   Time before alert (seconds)

 Smoothing
PREDICTION_HISTORY_SIZE = 5       Number of frames for prediction smoothing

 Alarm settings
ALARM_COOLDOWN_SECONDS = 2.0      Minimum time between alarms (seconds)

 Model settings
EYE_IMG_SIZE = (64, 64)           Input size for CNN model
```

 Project Structure

```
drowsiness-detection-model/
├── eye_detection.py               Main detection script
├── eye_state_model.h5            Pre-trained CNN model
├── alarm.wav                      Alarm sound file
├── README.md                      This file
└── requirements.md                Requirements documentation
```

 Key Features

 Real-Time Eye State Detection
- Continuous monitoring of eye state (open/closed)
- Dual detection methods:
  - CNN Model: Deep learning-based eye state classification
  - EAR Metric: Geometric Eye Aspect Ratio calculation
- Prediction smoothing to reduce false positives

 Face Detection and Tracking
- MediaPipe Face Mesh for robust face detection
- 468 facial landmarks for precise eye region extraction
- Handles head movement and rotation

 Image Processing
- CLAHE enhancement for better detection in varying lighting
- Gaussian blur for noise reduction
- Automatic eye region extraction with padding
- Image normalization for model input

 Alert System
- Visual alerts on video feed
- Audio alarm when drowsiness detected
- Configurable alert thresholds
- Alarm cooldown to prevent excessive alerts

 Performance Optimizations
- Efficient frame processing
- Prediction history smoothing
- Frame-based threshold calculation
- Real-time processing at 30 FPS

 System Architecture

```
Webcam/Camera
    ↓
OpenCV Video Capture
    ↓
MediaPipe Face Mesh Detection
    ↓
Eye Region Extraction
    ↓
┌─────────────────────┐
│  Image Preprocessing │
│  - CLAHE Enhancement │
│  - Gaussian Blur     │
│  - Resize to 64x64   │
└─────────────────────┘
    ↓
┌─────────────────────┐     ┌──────────────────┐
│  CNN Model Inference │     │  EAR Calculation │
│  (eye_state_model.h5)│     │  (Geometric)     │
└─────────────────────┘     └──────────────────┘
    ↓                              ↓
┌─────────────────────────────────────┐
│     Prediction Smoothing             │
│     (5-frame history)                │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│     Drowsiness Decision Logic        │
│     (Threshold-based)                │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│     Alert System                     │
│     - Visual Overlay                 │
│     - Audio Alarm                    │
└─────────────────────────────────────┘
```

 Detection Methodology

 1. Face Detection
- Uses MediaPipe Face Mesh to detect facial landmarks
- Tracks 468 facial points including eye regions
- Handles single face detection (max_num_faces=1)

 2. Eye Region Extraction
- Extracts left and right eye regions using landmark indices
- Adds 30% padding around eye regions for better context
- Handles edge cases (boundary checking)

 3. Image Preprocessing
- Converts to grayscale
- Applies CLAHE for contrast enhancement
- Applies Gaussian blur for noise reduction
- Resizes to 64x64 pixels for model input
- Normalizes pixel values to [0, 1]

 4. Eye State Classification
- CNN Model: Predicts eye state (open/closed) probability
- EAR Calculation: Geometric metric based on eye landmark distances
- Combines both predictions for robust detection

 5. Prediction Smoothing
- Maintains history of last 5 predictions
- Calculates moving average to reduce noise
- Prevents false positives from brief blinks

 6. Drowsiness Detection
- Monitors continuous eye closure duration
- Triggers alert if eyes closed for > 0.5 seconds
- Uses frame-based threshold calculation

 Development Status

Current Phase: Phase-I Completed

 Completed Features
- ✅ Real-time face detection using MediaPipe
- ✅ Eye region extraction and preprocessing
- ✅ CNN-based eye state classification
- ✅ Eye Aspect Ratio (EAR) calculation
- ✅ Dual-metric drowsiness detection
- ✅ Prediction smoothing
- ✅ Visual feedback on video feed
- ✅ Audio alarm system
- ✅ Configurable thresholds

 Planned Features
- 🔄 Integration with Android app
- 🔄 Cloud synchronization of drowsiness events
- 🔄 Head pose estimation for additional metrics
- 🔄 Yawning detection
- 🔄 Multi-face support
- 🔄 Cross-platform audio support (Linux/macOS)
- 🔄 Performance metrics and logging
- 🔄 Model retraining pipeline
- 🔄 Edge device optimization (Raspberry Pi)

 Troubleshooting

 Camera Issues

Camera Not Opening
- Check if camera is being used by another application
- Verify camera permissions
- Try changing camera index: `cv2.VideoCapture(1)` instead of `cv2.VideoCapture(0)`

Poor Face Detection
- Ensure adequate lighting
- Position face directly in front of camera
- Remove obstructions (glasses, masks) if possible
- Check camera resolution and focus

 Model Issues

Model Not Loading
- Verify `eye_state_model.h5` exists in the directory
- Check file permissions
- Ensure TensorFlow is properly installed

Poor Detection Accuracy
- Adjust `EYE_STATE_THRESHOLD` and `EAR_THRESHOLD` values
- Improve lighting conditions
- Ensure face is clearly visible
- Check camera quality and resolution

 Performance Issues

Low Frame Rate
- Reduce camera resolution
- Close other applications using camera
- Use a more powerful CPU/GPU
- Consider model optimization (quantization)

High CPU Usage
- Reduce `PREDICTION_HISTORY_SIZE`
- Lower camera FPS
- Optimize image preprocessing steps

 Audio Issues

Alarm Not Playing (Windows)
- Verify `alarm.wav` file exists
- Check audio system is working
- Try alternative audio library (pygame, pydub)

Alarm Not Playing (Linux/macOS)
- `winsound` is Windows-specific
- Use alternative: `pygame.mixer` or `pydub`
- Modify `play_alarm()` function for cross-platform support

 Configuration Guide

 Adjusting Sensitivity

More Sensitive (More Alerts)
```python
EYE_STATE_THRESHOLD = 0.6         Higher threshold
EAR_THRESHOLD = 0.20               Higher EAR threshold
CLOSED_FRAMES_THRESHOLD_SECONDS = 0.3   Shorter time
```

Less Sensitive (Fewer Alerts)
```python
EYE_STATE_THRESHOLD = 0.4         Lower threshold
EAR_THRESHOLD = 0.10               Lower EAR threshold
CLOSED_FRAMES_THRESHOLD_SECONDS = 1.0   Longer time
```

 Performance Tuning

Faster Processing
```python
PREDICTION_HISTORY_SIZE = 3       Smaller history
 Reduce camera resolution in code
```

More Accurate Detection
```python
PREDICTION_HISTORY_SIZE = 10       Larger history
 Increase camera resolution
```

 Contributing

This is a Final Year Project. For contributions or questions, please contact the project maintainers.

 License

[Specify your license here]

 Contact

For support or inquiries about the HelmX Drowsiness Detection system, please contact the development team.

---

Note: This component is part of the HelmX ecosystem. For information about other components (Android app, web app, crash detection model), refer to their respective documentation.

 HelmX Driver Drowsiness Detection - Requirements Documentation

This document outlines all functional and non-functional requirements for the HelmX Driver Drowsiness Detection system.

---

 Functional Requirements

 FR1: Face Detection

 FR1.1: Real-Time Face Detection
- Description: System must detect faces in real-time video feed
- Priority: High
- Details:
  - System must use MediaPipe Face Mesh for face detection
  - System must detect at least one face in the video frame
  - System must handle face rotation and movement
  - System must work in various lighting conditions
  - Detection confidence must be configurable (min_detection_confidence, min_tracking_confidence)

 FR1.2: Facial Landmark Extraction
- Description: System must extract facial landmarks for eye region identification
- Priority: High
- Details:
  - System must extract 468 facial landmarks
  - System must identify left and right eye landmark indices
  - System must handle cases where landmarks are partially occluded
  - Landmark extraction must be accurate and consistent

---

 FR2: Eye Region Processing

 FR2.1: Eye Region Extraction
- Description: System must extract eye regions from detected faces
- Priority: High
- Details:
  - System must extract left eye region using landmark indices
  - System must extract right eye region using landmark indices
  - System must add appropriate padding (30%) around eye regions
  - System must handle boundary cases (eye near frame edge)
  - Extracted regions must be valid and non-empty

 FR2.2: Image Preprocessing
- Description: System must preprocess eye images for model input
- Priority: High
- Details:
  - System must convert images to grayscale
  - System must apply CLAHE (Contrast Limited Adaptive Histogram Equalization) enhancement
  - System must apply Gaussian blur for noise reduction
  - System must resize images to 64x64 pixels
  - System must normalize pixel values to [0, 1] range
  - Preprocessing must be consistent and reproducible

 FR2.3: Image Enhancement
- Description: System must enhance eye images for better detection accuracy
- Priority: Medium
- Details:
  - System must improve contrast in varying lighting conditions
  - System must reduce noise in captured images
  - Enhancement must not distort eye features
  - Enhancement must be computationally efficient

---

 FR3: Eye State Detection

 FR3.1: CNN Model Inference
- Description: System must use CNN model to classify eye state
- Priority: High
- Details:
  - System must load pre-trained model (`eye_state_model.h5`)
  - System must perform inference on both left and right eyes
  - System must return probability scores (0-1) for eye state
  - System must average predictions from both eyes
  - Model inference must be real-time (low latency)

 FR3.2: Eye Aspect Ratio Calculation
- Description: System must calculate Eye Aspect Ratio (EAR) as additional metric
- Priority: High
- Details:
  - System must calculate EAR for left eye
  - System must calculate EAR for right eye
  - System must average EAR values from both eyes
  - EAR calculation must use specific landmark points
  - System must handle calculation errors gracefully

 FR3.3: Dual-Metric Detection
- Description: System must combine CNN predictions and EAR for robust detection
- Priority: High
- Details:
  - System must use both CNN predictions and EAR values
  - System must apply thresholds to both metrics
  - System must classify eye as closed if either metric indicates closure
  - Dual-metric approach must reduce false positives and false negatives

 FR3.4: Prediction Smoothing
- Description: System must smooth predictions to reduce noise
- Priority: High
- Details:
  - System must maintain history of last N predictions (default: 5)
  - System must calculate moving average of predictions
  - Smoothing must prevent false alerts from brief blinks
  - History size must be configurable

---

 FR4: Drowsiness Detection

 FR4.1: Eye Closure Duration Monitoring
- Description: System must monitor continuous eye closure duration
- Priority: High
- Details:
  - System must track when eyes become closed
  - System must track duration of continuous eye closure
  - System must reset counter when eyes open
  - Duration tracking must be frame-rate independent

 FR4.2: Drowsiness Threshold
- Description: System must trigger alert when eyes closed beyond threshold
- Priority: High
- Details:
  - System must use configurable threshold (default: 0.5 seconds)
  - System must calculate threshold based on frame rate
  - System must trigger alert when threshold exceeded
  - Threshold must be adjustable for different use cases

 FR4.3: Drowsiness Decision Logic
- Description: System must make drowsiness decisions based on multiple factors
- Priority: High
- Details:
  - System must combine eye state predictions and EAR values
  - System must consider prediction history
  - System must account for continuous closure duration
  - Decision logic must be robust and minimize false positives

---

 FR5: Alert System

 FR5.1: Visual Alerts
- Description: System must provide visual feedback on video feed
- Priority: High
- Details:
  - System must display eye state (Open/Closed) on video
  - System must display prediction confidence and EAR values
  - System must display closed duration timer
  - System must display alert message when drowsiness detected
  - Visual indicators must use color coding (green=open, red=closed)
  - Text must be readable and non-intrusive

 FR5.2: Audio Alerts
- Description: System must provide audio alerts when drowsiness detected
- Priority: High
- Details:
  - System must play alarm sound file (`alarm.wav`) when alert triggered
  - System must implement alarm cooldown to prevent excessive alerts
  - Cooldown period must be configurable (default: 2.0 seconds)
  - System must handle missing alarm file gracefully
  - Audio must be clear and attention-grabbing

 FR5.3: Alert Persistence
- Description: System must maintain alert state until eyes open
- Priority: Medium
- Details:
  - Alert must remain active while eyes are closed
  - Alert must clear when eyes open
  - Visual alert must be persistent during drowsiness state

---

 FR6: Video Processing

 FR6.1: Camera Interface
- Description: System must interface with camera/webcam
- Priority: High
- Details:
  - System must open default camera (index 0)
  - System must handle camera initialization errors
  - System must support camera frame rate detection
  - System must flip video horizontally for mirror effect
  - System must release camera resources on exit

 FR6.2: Frame Processing
- Description: System must process video frames in real-time
- Priority: High
- Details:
  - System must read frames from camera continuously
  - System must process frames at acceptable frame rate (≥15 FPS)
  - System must handle frame read errors gracefully
  - System must convert frames to appropriate color space (RGB for MediaPipe)

 FR6.3: Video Display
- Description: System must display processed video with overlays
- Priority: High
- Details:
  - System must display video feed in window
  - System must overlay detection information
  - System must update display in real-time
  - Window must be closable (press 'q' key)

---

 FR7: Configuration and Parameters

 FR7.1: Configurable Thresholds
- Description: System must support configurable detection thresholds
- Priority: Medium
- Details:
  - Eye state threshold must be configurable (default: 0.5)
  - EAR threshold must be configurable (default: 0.15)
  - Closed frames threshold must be configurable (default: 0.5 seconds)
  - Thresholds must be defined as constants in code
  - Thresholds must be easily adjustable

 FR7.2: Model Configuration
- Description: System must support model configuration
- Priority: High
- Details:
  - Model path must be configurable
  - Model input size must be configurable (default: 64x64)
  - System must handle model loading errors
  - Model must be loaded once at startup

 FR7.3: Processing Parameters
- Description: System must support configurable processing parameters
- Priority: Medium
- Details:
  - Prediction history size must be configurable (default: 5)
  - Alarm cooldown must be configurable (default: 2.0 seconds)
  - MediaPipe confidence thresholds must be configurable

---

 FR8: Error Handling

 FR8.1: Camera Error Handling
- Description: System must handle camera-related errors
- Priority: High
- Details:
  - System must detect if camera cannot be opened
  - System must display appropriate error messages
  - System must exit gracefully on camera errors
  - System must not crash on camera disconnection

 FR8.2: Model Error Handling
- Description: System must handle model-related errors
- Priority: High
- Details:
  - System must detect if model file is missing
  - System must display appropriate error messages
  - System must exit gracefully if model cannot be loaded
  - System must handle model inference errors

 FR8.3: Processing Error Handling
- Description: System must handle processing errors gracefully
- Priority: High
- Details:
  - System must handle face detection failures
  - System must handle eye extraction failures
  - System must handle image preprocessing errors
  - System must continue operation despite transient errors
  - System must log or display error information

---

 Non-Functional Requirements

 NFR1: Performance

 NFR1.1: Real-Time Processing
- Description: System must process video in real-time
- Priority: High
- Target: Minimum 15 FPS processing rate
- Measurement: Frames processed per second
- Details:
  - System must not introduce significant lag
  - Processing must be optimized for real-time operation
  - Frame skipping must be minimal

 NFR1.2: Detection Latency
- Description: Drowsiness detection must have low latency
- Priority: High
- Target: Detection latency < 100ms per frame
- Measurement: Time from frame capture to detection result
- Details:
  - Model inference must be fast
  - Image preprocessing must be efficient
  - Overall pipeline must be optimized

 NFR1.3: Resource Usage
- Description: System must use resources efficiently
- Priority: Medium
- Target: CPU usage < 70% on average hardware
- Details:
  - Memory usage must be reasonable
  - CPU usage must not spike excessively
  - System must be suitable for edge deployment

---

 NFR2: Accuracy

 NFR2.1: Detection Accuracy
- Description: System must accurately detect eye state
- Priority: High
- Target: Eye state classification accuracy > 90%
- Measurement: Correct classifications / Total classifications
- Details:
  - False positive rate must be low (< 5%)
  - False negative rate must be low (< 5%)
  - System must handle various eye shapes and sizes

 NFR2.2: Drowsiness Detection Accuracy
- Description: System must accurately detect drowsiness events
- Priority: High
- Target: Drowsiness detection accuracy > 85%
- Details:
  - System must distinguish between blinks and drowsiness
  - System must not trigger false alarms
  - System must not miss actual drowsiness events

 NFR2.3: Robustness
- Description: System must work in various conditions
- Priority: High
- Details:
  - System must work in different lighting conditions
  - System must handle head movement and rotation
  - System must work with different face orientations
  - System must be resilient to noise

---

 NFR3: Usability

 NFR3.1: User Interface
- Description: System must provide clear visual feedback
- Priority: High
- Details:
  - Video display must be clear and readable
  - Status information must be visible
  - Color coding must be intuitive
  - Text overlays must not obstruct face view

 NFR3.2: Ease of Use
- Description: System must be easy to use
- Priority: Medium
- Details:
  - System must start with minimal configuration
  - Default settings must work for most users
  - System must provide clear instructions
  - Exit mechanism must be obvious (press 'q')

 NFR3.3: Feedback Clarity
- Description: System feedback must be clear and actionable
- Priority: High
- Details:
  - Alert messages must be clear
  - Status indicators must be unambiguous
  - Numerical values must be meaningful
  - Visual feedback must be immediate

---

 NFR4: Reliability

 NFR4.1: System Stability
- Description: System must run stably without crashes
- Priority: High
- Target: Crash-free operation for extended periods
- Details:
  - System must handle errors gracefully
  - System must not crash on invalid input
  - System must recover from transient errors
  - Memory leaks must be avoided

 NFR4.2: Continuous Operation
- Description: System must operate continuously
- Priority: High
- Details:
  - System must handle long-running sessions
  - System must maintain performance over time
  - System must not degrade with extended use
  - Resource cleanup must be proper

 NFR4.3: Error Recovery
- Description: System must recover from errors
- Priority: Medium
- Details:
  - System must continue operation after transient errors
  - System must handle camera reconnection
  - System must handle face detection failures gracefully

---

 NFR5: Compatibility

 NFR5.1: Camera Compatibility
- Description: System must work with various cameras
- Priority: High
- Details:
  - System must work with built-in webcams
  - System must work with USB cameras
  - System must support different camera resolutions
  - System must handle different frame rates

 NFR5.2: Operating System Compatibility
- Description: System must work on multiple operating systems
- Priority: Medium
- Details:
  - Core functionality must work on Windows, Linux, macOS
  - Audio alerts may be OS-specific (Windows winsound)
  - System must handle OS-specific differences
  - Dependencies must be cross-platform

 NFR5.3: Hardware Compatibility
- Description: System must work on various hardware configurations
- Priority: Medium
- Details:
  - System must work on different CPU architectures
  - System must work with/without GPU acceleration
  - System must adapt to available resources
  - Performance must scale with hardware

---

 NFR6: Maintainability

 NFR6.1: Code Quality
- Description: Code must be maintainable and well-structured
- Priority: Medium
- Details:
  - Code must follow Python PEP 8 style guidelines
  - Code must be properly commented
  - Functions must have clear documentation
  - Code must be modular and organized

 NFR6.2: Configuration Management
- Description: Configuration must be easy to manage
- Priority: Medium
- Details:
  - Configuration parameters must be clearly defined
  - Configuration must be centralized
  - Default values must be sensible
  - Configuration must be well-documented

 NFR6.3: Extensibility
- Description: System must be extensible for future features
- Priority: Low
- Details:
  - Code structure must support adding new features
  - Detection methods must be modular
  - Alert system must be extensible
  - Integration points must be clear

---

 NFR7: Security and Privacy

 NFR7.1: Data Privacy
- Description: System must respect user privacy
- Priority: High
- Details:
  - Video data must not be stored or transmitted
  - Processing must be local (no cloud upload)
  - No personal data must be collected
  - System must operate offline

 NFR7.2: Resource Security
- Description: System must use resources securely
- Priority: Medium
- Details:
  - Camera access must be appropriate
  - File access must be secure
  - System must not expose sensitive information
  - Error messages must not leak sensitive data

---

 NFR8: Scalability

 NFR8.1: Model Scalability
- Description: System must support model updates
- Priority: Low
- Details:
  - Model replacement must be straightforward
  - System must support different model architectures
  - Model versioning must be possible
  - Model loading must be flexible

 NFR8.2: Feature Scalability
- Description: System must support additional detection features
- Priority: Low
- Details:
  - System architecture must support new metrics
  - Code structure must allow feature additions
  - Integration points must be clear
  - Backward compatibility must be maintained

---

 Requirements Traceability

 Implementation Status

| Requirement ID | Status | Notes |
|---------------|--------|-------|
| FR1.1 | ✅ Complete | MediaPipe face detection implemented |
| FR1.2 | ✅ Complete | 468 facial landmarks extraction working |
| FR2.1 | ✅ Complete | Eye region extraction with padding |
| FR2.2 | ✅ Complete | Full preprocessing pipeline implemented |
| FR2.3 | ✅ Complete | CLAHE and Gaussian blur enhancement |
| FR3.1 | ✅ Complete | CNN model inference working |
| FR3.2 | ✅ Complete | EAR calculation implemented |
| FR3.3 | ✅ Complete | Dual-metric detection active |
| FR3.4 | ✅ Complete | Prediction smoothing with history |
| FR4.1 | ✅ Complete | Eye closure duration tracking |
| FR4.2 | ✅ Complete | Configurable threshold system |
| FR4.3 | ✅ Complete | Robust decision logic implemented |
| FR5.1 | ✅ Complete | Visual overlays on video feed |
| FR5.2 | ✅ Complete | Audio alarm system (Windows) |
| FR5.3 | ✅ Complete | Alert persistence implemented |
| FR6.1 | ✅ Complete | Camera interface working |
| FR6.2 | ✅ Complete | Real-time frame processing |
| FR6.3 | ✅ Complete | Video display with overlays |
| FR7.1 | ✅ Complete | Configurable thresholds |
| FR7.2 | ✅ Complete | Model configuration support |
| FR7.3 | ✅ Complete | Processing parameters configurable |
| FR8.1 | ✅ Complete | Camera error handling |
| FR8.2 | ✅ Complete | Model error handling |
| FR8.3 | ✅ Complete | Processing error handling |

---

 Notes

- Priority Levels:
  - High: Critical for system functionality
  - Medium: Important but not blocking
  - Low: Nice to have, can be deferred

- Status Indicators:
  - ✅ Complete: Feature is implemented and tested
  - 🔄 Planned: Feature is planned but not yet implemented
  - ⚠️ In Progress: Feature is currently being developed

- Detection Metrics:
  - CNN Prediction: Probability score (0-1) from deep learning model
  - EAR (Eye Aspect Ratio): Geometric metric based on eye landmark distances
  - Combined Decision: Eye closed if CNN < threshold OR EAR < threshold

- Performance Targets:
  - Real-time processing: ≥15 FPS
  - Detection latency: <100ms per frame
  - Accuracy: >90% for eye state, >85% for drowsiness

- This document should be updated as requirements evolve or new features are added.

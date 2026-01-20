<h1>HelmX – AI-Based Motorcycle Crash Detection System</h1>
<h3>Overview</h3>
<p>HelmX Crash Detection is an AI-powered, unsupervised anomaly detection system designed for motorcycles.
It uses inertial sensor data (accelerometer + gyroscope) to detect crash events in real time and automatically sends emergency alerts with GPS location via GSM.

The system is optimized for edge deployment on Raspberry Pi</p>

<h3>Key Features</h3>

<li>Unsupervised Crash Detection using CNN Autoencoder</li>

<li>Trained only on normal riding data (no crash data required)</li>

<li>Sliding window–based temporal analysis</li>

<li>Real-time inference on Raspberry Pi</li>

<li>Automatic GPS location acquisition</li>

<li>Emergency SMS alert via GSM</li>

<li>Edge-based processing (no cloud dependency)</li>

</ul>

<h3>System Architecture</h3>

<p>MPU6050 (IMU Sensors)</p>
        ↓
<p>Raspberry Pi (Edge Device)</p>
        ↓
<p>CNN Autoencoder (Anomaly Detection)</p>
        ↓
<p>Crash Decision Logic</p>
        ↓
<p>GPS + GSM Module</p>
        ↓
<p>Emergency SMS with Location</p>

<h4>Datasets Used (Training)</h4>

<p>This model is trained only on non-crash data, including:</p>

<ul>
<li>CARLA Simulator IMU Data</li>
<li>Driving behaviors (slow, standard, aggressive)</li>
<li>Road anomalies (bumps, potholes)</li>
</ul>

<h3>Model Training Pipeline</h3>
<ol>
<li>Data Loading

<p>Accelerometer + gyroscope data combined into a 6D feature vector</p>
<p>Shape per sample:</p>
<p>[accelX, accelY, accelZ, gyroX, gyroY, gyroZ]</p>
</li>
<li>Sliding Window Creation
<p>Window size: 60 samples (~1 second)</p>
<p>Stride: 15 samples</p>
<p> Output shape:</p>
<p>(N, 60, 6)</p>
</li>
<li>Normalization
<p>Mean and standard deviation computed from training data</p>
<p>Saved for real-time inference</p>
</li>
<li>CNN Autoencoder Architecture
<p>Encoder</p>
<p>Conv2D → MaxPooling → Dropout</p>
<p>Decoder</p>
<p>Upsampling → Conv2D</p>
<p>Loss function: Mean Squared Error (MSE)</p>
</li>
<li>Training Strategy
<p>Train/validation split: 80/20</p>
<p>Optimizer: Adam</p>
<p>Early stopping based on validation loss</p>
</li></ol>

<h4>Anomaly Threshold Selection</h4>

<p>After training, reconstruction error is calculated on normal data
    This threshold represents the maximum normal reconstruction error.
    Any window exceeding this value is treated as an anomaly.
</p>

<h4>Real-Time Inference (Raspberry Pi)</h4>
<p>
<ul>
<li>Sliding Window Logic</li>
<li>Sensor samples are collected continuously</li>
<li>A deque buffer stores the latest 60 samples</li>
<li>Every 15 new samples, the model runs inference</li>
<li>Real-Time Decision Rule</li>
</ul>
<h5>A crash is confirmed when:</h5>
Reconstruction error > threshold
For 3 consecutive windows to avoid false alarms due to noise or bumps.
Sensor Integration
<ul>
<li>MPU6050 IMU used for real-time motion sensing</li>
<li>Connected via I2C</li>
<li>Sample rate ≈ 60 Hz</li>
</ul>
Emergency Alert System
    <h5>GPS</h5>
    <ul>
    <li>GPS coordinates obtained from GSM/GPS module</li>
    <li>NMEA $GPGGA messages parsed to extract latitude & longitude</li>
    </ul>
    <h5>GSM</h5>
    <ul>
    <li>Connected via USB/UART (/dev/ttyUSB0)</li>
    <li>SMS sent using AT commands</li>
    </ul>
</p>


<h3>Hardware Requirements</h3>
<ul>
<li>Raspberry Pi</li>
<li>MPU6050 Accelerometer + Gyroscope</li>
<li>GSM/GPS Module (SIM808 / SIM760)</li>
<li>SIM card</li>
<li>Power supply / battery</li>
</ul>

<h3>Software Requirements</h3>
<ul>
<li>Python</li>
<li>TensorFlow</li>
<li>NumPy</li>
<li>Pandas</li>
<li>scikit-learn</li>
<li>mpu6050 library</li>
</ul>



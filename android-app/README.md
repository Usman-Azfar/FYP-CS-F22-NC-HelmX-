 HelmX - Android Application

 Project Overview

HelmX is an AI-powered smart helmet application designed for motorcycle riders. The Android application serves as the mobile interface for the HelmX ecosystem, providing users with real-time navigation, ride analytics, safety features, and seamless integration with the smart helmet hardware.

The application is part of a comprehensive Final Year Project (FYP) that includes:
- Android Mobile App (this repository)
- Web Application (companion web platform)
- Crash Detection Model (AI-based anomaly detection system)

HelmX combines artificial intelligence, IoT sensors, and cloud computing to create a fully integrated safety ecosystem, making every motorcycle ride smarter, safer, and more connected.

 Problem Statement

Motorcycle riders face significant safety challenges on the road, including:
- High accident rates: Motorcycles are more vulnerable in traffic accidents
- Limited emergency response: Delayed medical assistance can be life-threatening
- Lack of real-time safety monitoring: No integrated system to track rider behavior and detect anomalies
- Poor navigation experience: Existing solutions don't provide helmet-integrated navigation
- Insufficient ride analytics: Limited insights into riding patterns and safety metrics

HelmX addresses these challenges by providing:
- Real-time crash detection and automatic emergency alerts
- Integrated navigation system with voice guidance
- Comprehensive ride analytics and safety metrics
- User-friendly mobile interface for monitoring and control
- Cloud-based data synchronization for multi-device access

 Technologies Used

 Core Technologies
- Kotlin: Primary programming language for Android development
- Android SDK: Target SDK 36, Minimum SDK 24 (Android 7.0+)
- Gradle: Build automation and dependency management (Kotlin DSL)

 Backend Services
- Firebase Authentication: User authentication and account management
- Firebase Firestore: Cloud database for user data and ride information
- Firebase Analytics: Usage analytics and crash reporting

 Maps & Location Services
- Google Maps SDK: Interactive map display and navigation
- Google Places API: Location search and place details
- Google Location Services: Real-time location tracking and geocoding

 UI/UX Libraries
- Material Design Components: Modern, responsive UI components
- ViewBinding: Type-safe view references
- AndroidX Libraries: Core Android support libraries
  - AppCompat
  - Activity KTX
  - ConstraintLayout
  - Core KTX

 Development Tools
- Android Studio: Primary IDE
- Git: Version control
- Secrets Gradle Plugin: Secure API key management

 Installation Steps

 Prerequisites

Before you begin, ensure you have the following installed:

1. Android Studio (latest stable version recommended)
   - Download from: https://developer.android.com/studio
   - Includes Android SDK, Gradle, and necessary build tools

2. JDK 11 or higher
   - Android Studio typically includes a bundled JDK
   - Verify: `File > Project Structure > SDK Location`

3. Git (for cloning the repository)
   - Download from: https://git-scm.com/downloads

4. Firebase Account
   - Create a project at: https://console.firebase.google.com/
   - Enable Authentication and Firestore

5. Google Cloud Account
   - Required for Google Maps API
   - Enable Maps SDK for Android and Places API

 Setup Instructions

1. Clone the Repository
   ```bash
   git clone <repository-url>
   cd android-app/HelmX
   ```

2. Configure Firebase
   - Download `google-services.json` from Firebase Console
   - Place it in `app/` directory (replace existing file if present)
   - Ensure your Firebase project has:
     - Authentication enabled (Email/Password)
     - Firestore Database created
     - Analytics enabled (optional)

3. Configure Google Maps API
   - Create a Google Cloud project
   - Enable "Maps SDK for Android" and "Places API"
   - Create an API key
   - Add the API key to `local.properties`:
     ```properties
     MAPS_API_KEY=your_api_key_here
     ```
   - The Secrets Gradle Plugin will automatically inject this into the app

4. Sync Project
   - Open Android Studio
   - Open the `HelmX` project folder
   - Wait for Gradle sync to complete
   - If prompted, accept SDK licenses and install missing components

5. Build the Project
   ```bash
   ./gradlew build
   ```
   Or use Android Studio: `Build > Make Project`

 How to Run the Project

 Running on Android Emulator

1. Create an Android Virtual Device (AVD)
   - Open Android Studio
   - Go to `Tools > Device Manager`
   - Click `Create Device`
   - Select a device (e.g., Pixel 5)
   - Choose a system image (API 24 or higher recommended)
   - Finish the setup

2. Start the Emulator
   - Click the green play button next to your AVD
   - Wait for the emulator to boot

3. Run the App
   - Click the green "Run" button in Android Studio
   - Or use: `Run > Run 'app'`
   - Or use command line: `./gradlew installDebug`

 Running on Physical Device

1. Enable Developer Options
   - Go to `Settings > About Phone`
   - Tap "Build Number" 7 times
   - Go back to `Settings > Developer Options`
   - Enable "USB Debugging"

2. Connect Device
   - Connect your Android device via USB
   - Accept the USB debugging prompt on your device
   - Verify connection: `adb devices`

3. Run the App
   - Select your device from the device dropdown in Android Studio
   - Click the "Run" button
   - The app will install and launch on your device

 Running from Command Line

```bash
 Build debug APK
./gradlew assembleDebug

 Install on connected device
./gradlew installDebug

 Run tests
./gradlew test

 Run instrumented tests
./gradlew connectedAndroidTest
```

 First-Time Setup in App

1. Create an Account
   - Launch the app
   - Tap "Sign up"
   - Enter full name, email, phone number, and password
   - Accept Terms & Conditions
   - Tap "Sign Up"

2. Login
   - Enter your email and password
   - Tap "Log In"
   - You'll be redirected to the Dashboard

3. Grant Permissions
   - Allow location permissions when prompted (required for navigation)
   - These permissions are essential for map features

 Project Structure

```
HelmX/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/yourname/helmx/
│   │   │   │   ├── MainActivity.kt           Entry point activity
│   │   │   │   ├── LoginActivity.kt          User authentication
│   │   │   │   ├── SignUpActivity.kt         User registration
│   │   │   │   ├── DashboardActivity.kt      Main dashboard
│   │   │   │   ├── NavigationActivity.kt     Maps and navigation
│   │   │   │   ├── AuthManager.kt            Firebase auth wrapper
│   │   │   │   └── User.kt                   User data model
│   │   │   ├── res/
│   │   │   │   ├── layout/                   XML layouts
│   │   │   │   ├── values/                   Strings, colors, themes
│   │   │   │   ├── drawable/                 Icons and graphics
│   │   │   │   └── menu/                     Navigation menus
│   │   │   └── AndroidManifest.xml
│   │   ├── test/                             Unit tests
│   │   └── androidTest/                      Instrumented tests
│   ├── build.gradle.kts                      App-level dependencies
│   └── google-services.json                  Firebase config
├── build.gradle.kts                          Project-level config
├── gradle/
│   ├── libs.versions.toml                    Dependency versions
│   └── wrapper/                              Gradle wrapper
└── settings.gradle.kts                       Project settings
```

 Key Features

 Authentication
- Email/Password authentication
- Google Sign-In (planned)
- Secure session management
- Password reset functionality (planned)

 Dashboard
- User profile display
- Ride statistics (active rides, total distance, average speed)
- Carbon footprint tracking
- Quick navigation to key features

 Navigation
- Interactive Google Maps integration
- Location search with geocoding
- Real-time location tracking
- Route planning and navigation (planned)
- Distance and duration calculations

 Settings
- Dark mode support
- Notification preferences
- Account management
- App preferences

 Development Status

Current Phase: Phase-I Completed

 Completed Features
- ✅ User authentication (Email/Password)
- ✅ User registration
- ✅ Dashboard with user data display
- ✅ Google Maps integration
- ✅ Location search and geocoding
- ✅ Basic navigation interface
- ✅ Firebase integration

 Planned Features
- 🔄 Google Sign-In
- 🔄 Password reset
- 🔄 Real-time navigation with turn-by-turn directions
- 🔄 Ride tracking and analytics
- 🔄 Crash detection alerts
- 🔄 Emergency contact management
- 🔄 Ride history and statistics
- 🔄 Social features

 Troubleshooting

 Build Issues

Gradle Sync Failed
- Check internet connection
- Verify Gradle wrapper version
- Try: `File > Invalidate Caches / Restart`

Missing SDK Components
- Open `Tools > SDK Manager`
- Install missing SDK platforms and build tools

API Key Issues
- Verify `MAPS_API_KEY` in `local.properties`
- Check API key restrictions in Google Cloud Console
- Ensure Maps SDK is enabled for your project

 Runtime Issues

App Crashes on Launch
- Check Logcat for error messages
- Verify `google-services.json` is correctly placed
- Ensure Firebase project is properly configured

Maps Not Loading
- Verify Google Maps API key is valid
- Check API key restrictions (package name, SHA-1)
- Ensure Maps SDK is enabled in Google Cloud Console

Authentication Errors
- Verify Firebase Authentication is enabled
- Check Firestore rules allow read/write
- Ensure internet connection is active

 Contributing

This is a Final Year Project. For contributions or questions, please contact the project maintainers.

 License

[Specify your license here]

 Contact

For support or inquiries about the HelmX Android application, please contact the development team.

---

Note: This application is part of the HelmX ecosystem. For information about other components (web app, crash detection model), refer to their respective documentation.

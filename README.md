# MagicWave 🎵 - Frequency Therapy App

**MagicWave** is a modern React Native frequency therapy application built with Expo that generates real-time sine wave audio for healing, meditation, and relaxation. Experience the power of binaural beats, solfeggio frequencies, and sacred sound therapy with a beautiful, intuitive interface.

## Features

### 🎧 Real Audio Generation
The app generates authentic sine wave frequencies using mathematical algorithms rather than pre-recorded audio files. This ensures pure, precise frequencies for optimal therapeutic effects.

### 🌙 Sleep Timer
Set automatic sleep timers (5, 10, 15, 30, 45, 60, or 90 minutes) to automatically stop playback when you fall asleep. Perfect for bedtime meditation sessions.

### 🎨 Modern Design
Beautiful, minimalistic interface with smooth 60fps animations and both light and dark themes. The design prioritizes clarity and ease of use while maintaining visual appeal.

### 📱 Frequency Categories
* **Meditation & Relaxation**: Traditional meditation frequencies including 432Hz, 528Hz, and other healing tones
* **Hindu Gods & Mantras**: Sacred frequencies associated with Krishna, Shiva, Hanuman, and other deities
* **Binaural Beats**: Delta, Theta, Alpha, and Beta wave frequencies for different mental states
* **Sacred Tasks**: Specific frequencies for focused work and concentration
* **Solfeggio Frequencies**: Ancient musical scale used for healing and spiritual development

### 💾 Favorites & Recent
Save your favorite frequencies and access recently played sounds. The app tracks your listening history and provides quick access to preferred frequencies.

### 🔊 Audio Controls
Full volume control, play/pause functionality, and seamless audio management. Only one frequency plays at a time to maintain audio clarity.

## Technical Implementation

### Architecture Overview
MagicWave follows a modern React Native architecture with proper separation of concerns:

**Context Pattern**: The AudioContext manages global audio state across the entire application, providing a clean interface for audio operations.

**Component Structure**: Reusable components like FrequencyCard, SpotifyPlaybackBar, and Animated components ensure consistent behavior throughout the app.

**Utility Classes**: Dedicated utility classes handle audio generation, storage operations, and theme management.

### Audio Engine Deep Dive

The heart of MagicWave is its custom audio engine that generates frequencies in real-time:

```javascript
class FrequencyAudioEngine {
  generateSineWave(frequency, duration = 10, sampleRate = 44100) {
    const samples = duration * sampleRate;
    const amplitude = 0.3;
    const audioData = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      audioData[i] = amplitude * Math.sin(2 * Math.PI * frequency * t);
    }
    
    return audioData;
  }
}
```

**Sine Wave Generation**: The app calculates each audio sample using the mathematical sine function. For a given frequency, it generates a pure tone without harmonics or distortion.

**WAV File Creation**: Generated audio data is converted into WAV format using proper header structures and 16-bit PCM encoding. This ensures compatibility across all devices.

**Base64 Encoding**: The WAV data is encoded as a base64 data URI, allowing expo-av to play the generated audio seamlessly.

### Real-time Audio Processing

**Sample Rate**: Uses standard 44.1kHz sample rate for CD-quality audio output.

**Amplitude Control**: Maintains comfortable 0.3 amplitude to prevent audio distortion while ensuring audible output.

**Looping**: Implements seamless looping using expo-av's built-in looping capabilities, creating continuous frequency playback.

### State Management

The AudioContext provides centralized state management for:

```javascript
const AudioProvider = ({ children }) => {
  const [currentFrequency, setCurrentFrequency] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [timer, setTimer] = useState(null);
  // ... additional state
};
```

**Frequency State**: Tracks currently playing frequency and playback status across all screens.

**Volume Management**: Maintains volume levels with real-time updates to the audio engine.

**Timer Integration**: Handles sleep timer functionality with automatic cleanup when timers expire.

### Sleep Timer Implementation

The sleep timer uses JavaScript's setTimeout with proper cleanup:

```javascript
async setTimer(minutes) {
  if (this.timer) {
    clearTimeout(this.timer);
    this.timer = null;
  }
  
  if (minutes > 0) {
    this.timer = setTimeout(() => {
      this.stopFrequency();
    }, minutes * 60 * 1000);
  }
}
```

**Automatic Cleanup**: Clears existing timers before setting new ones to prevent multiple timers running simultaneously.

**Memory Management**: Properly nullifies timer references to prevent memory leaks.

### Animation System

MagicWave uses React Native Reanimated 3 for smooth 60fps animations:

**Native Driver**: All animations use the native driver to ensure smooth performance by running on the UI thread.

**Optimized Easing**: Custom easing functions provide natural motion that feels responsive and polished.

**Gesture Handling**: Implements smooth gesture recognition for swipe navigation and interactive elements.

### Theme System

The theme system supports both manual and automatic theme switching:

```javascript
const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('system');
  const [manualTheme, setManualTheme] = useState('light');
  
  const systemColorScheme = useColorScheme();
  const currentTheme = themeMode === 'system' ? systemColorScheme : manualTheme;
};
```

**System Integration**: Automatically detects system theme preferences and responds to changes.

**Persistent Storage**: Saves user theme preferences using AsyncStorage for consistency across app launches.

**Dynamic Colors**: Uses Material Design 3 color tokens for consistent theming throughout the interface.

### Storage Management

**AsyncStorage**: Utilizes React Native's AsyncStorage for persisting favorites, recent frequencies, and user preferences.

**Data Serialization**: Properly serializes complex objects like frequency data and user statistics for storage.

**Error Handling**: Implements robust error handling for storage operations to prevent data corruption.

### Performance Optimizations

**Lazy Loading**: Components load only when needed to reduce initial bundle size and improve startup time.

**Memory Management**: Properly disposes of audio resources when components unmount to prevent memory leaks.

**Native Animations**: Uses native animation drivers to ensure smooth performance even on lower-end devices.

## Installation & Setup

### Prerequisites
Before setting up MagicWave, ensure you have the following installed:

* Node.js (version 16 or higher)
* npm or yarn package manager
* Expo CLI (`npm install -g @expo/cli`)
* Git for version control

### Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/magicwave.git
   cd magicwave
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npx expo start
   ```

4. **Run on Device**
   * Install Expo Go on your mobile device
   * Scan the QR code displayed in your terminal
   * The app will load on your device for testing

### Building for Production

MagicWave uses EAS Build for creating production-ready applications:

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS**
   ```bash
   eas login
   eas build:configure
   ```

3. **Build APK (Android)**
   ```bash
   eas build -p android --profile preview
   ```

4. **Build for App Store (iOS)**
   ```bash
   eas build -p ios --profile production
   ```

The build process typically takes 10-15 minutes and produces a downloadable APK or IPA file.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Animated.js      # Animation components with 60fps optimization
│   ├── FrequencyCard.js # Individual frequency display cards
│   ├── MeditationLogo.js # App branding and logo
│   └── SpotifyPlaybackBar.js # Main audio control interface
├── contexts/            # React Context providers
│   └── AudioContext.js  # Global audio state management
├── data/               # Static data and configurations
│   └── frequencies.js  # Frequency definitions and categories
├── navigation/         # Navigation configuration
│   └── AppNavigator.js # Main navigation stack
├── screens/           # Main application screens
│   ├── AboutScreen.js # Information and credits
│   ├── FavoritesScreen.js # Saved and recent frequencies
│   ├── HomeScreen.js  # Main frequency selection
│   └── PlayerScreen.js # Detailed playback control
└── utils/             # Utility functions and helpers
    ├── audio.js       # Core audio engine implementation
    ├── storage.js     # Data persistence utilities
    └── theme.js       # Theme configuration and management
```

### Key Components Explained

**AudioContext.js**: Central hub for all audio-related state and operations. This context provides a clean interface for components to interact with the audio engine without tight coupling.

**audio.js**: Contains the FrequencyAudioEngine class responsible for generating, playing, and managing audio. This is where the mathematical sine wave generation happens.

**FrequencyCard.js**: Displays individual frequencies with proper styling, animations, and interaction handling. Each card shows frequency information and current playback status.

**SpotifyPlaybackBar.js**: The main audio control interface inspired by modern music apps. Includes play/pause, volume control, favorites, and the sleep timer modal.

### Configuration Files

**app.json**: Contains Expo configuration including app metadata, icons, splash screens, and build settings. This file defines how your app appears in app stores.

**eas.json**: EAS Build configuration for different build profiles (development, preview, production). Controls build optimization and deployment settings.

**package.json**: Standard Node.js package file listing all dependencies and scripts. Includes both runtime dependencies and development tools.

## Customization Guide

### Adding New Frequencies

To add new frequencies to MagicWave, edit the `src/data/frequencies.js` file:

```javascript
export const customFrequencies = [
  {
    id: 'custom_001',
    name: 'Your Custom Frequency',
    frequency: 333,
    description: 'Description of the frequency effects',
    category: 'Custom',
    image: '🎵',
    benefits: ['Benefit 1', 'Benefit 2'],
    chakra: 'Heart',
    color: '#4CAF50'
  }
];
```

**Required Fields**: Each frequency needs an id, name, frequency value (in Hz), category, and image emoji.

**Optional Fields**: Description, benefits array, chakra association, and custom color can enhance the user experience.

### Modifying Categories

Categories are defined in the same frequencies.js file and can be customized:

```javascript
export const frequencyCategories = [
  {
    name: 'Your Category',
    icon: '🎯',
    color: '#FF5722',
    description: 'Category description'
  }
];
```

### Theme Customization

Modify `src/utils/theme.js` to change colors and styling:

```javascript
export const lightTheme = {
  colors: {
    primary: '#your-primary-color',
    surface: '#your-surface-color',
    // ... other color definitions
  }
};
```

**Color System**: Uses Material Design 3 color tokens for consistency and accessibility.

**Dynamic Theming**: Colors automatically adapt between light and dark modes.

### Audio Engine Modifications

For advanced users, the audio engine can be modified in `src/utils/audio.js`:

**Sample Rate**: Change the sample rate for different audio quality (higher = better quality, larger files).

**Amplitude**: Adjust the amplitude for different volume characteristics.

**Wave Generation**: Implement different wave types (square, sawtooth, triangle) by modifying the generation function.

## Contributing

We welcome contributions to MagicWave! Here's how you can help improve the app:

### Getting Started with Contributions

1. **Fork the Repository** on GitHub
2. **Create a Feature Branch** (`git checkout -b feature/amazing-enhancement`)
3. **Make Your Changes** following the coding standards
4. **Test Thoroughly** on both iOS and Android devices
5. **Commit Your Changes** (`git commit -m 'Add amazing enhancement'`)
6. **Push to Branch** (`git push origin feature/amazing-enhancement`)
7. **Open a Pull Request** with detailed description

### Contribution Guidelines

**Code Style**: Follow React Native and JavaScript best practices. Use consistent indentation and meaningful variable names.

**Component Design**: Create reusable components that follow the existing architecture patterns.

**Performance**: Ensure all animations use the native driver and test on lower-end devices.

**Documentation**: Update documentation for any new features or changes to existing functionality.

### Areas for Contribution

**New Frequency Sets**: Add more therapeutic frequency collections based on scientific research.

**Audio Enhancements**: Implement binaural beat generation or other advanced audio processing.

**UI Improvements**: Enhance the visual design while maintaining accessibility and usability.

**Platform Features**: Add platform-specific features like iOS shortcuts or Android widgets.

## Deployment

### App Store Deployment (iOS)

1. **Prepare Assets**: Ensure all app icons and screenshots meet Apple's requirements
2. **Build Production Version**: Use EAS Build with production profile
3. **Upload to App Store Connect**: Submit the IPA file through Xcode or Transporter
4. **Complete App Information**: Fill out app description, categories, and pricing
5. **Submit for Review**: Apple typically takes 1-3 days for review

### Google Play Store Deployment (Android)

1. **Generate Signed APK**: Use EAS Build to create a production-signed APK
2. **Create Developer Account**: Register for Google Play Console
3. **Upload APK**: Submit your signed APK with app details
4. **Configure Store Listing**: Add descriptions, screenshots, and categorization
5. **Publish**: Google Play review is usually faster than Apple (few hours to 1 day)

### Direct Distribution

For testing or enterprise distribution, you can share APK files directly:

1. **Build Preview APK**: `eas build -p android --profile preview`
2. **Download from EAS**: Get the APK from your EAS dashboard
3. **Share File**: Distribute the APK file directly to users
4. **Enable Unknown Sources**: Users must allow installation from unknown sources

## License

This project is licensed under the MIT License. This means you can freely use, modify, and distribute the code for both personal and commercial purposes.

### MIT License Details

You are free to:
* Use the software for any purpose
* Change the software to suit your needs
* Share the software with others
* Share changes you make to the software

The only requirement is to include the original license and copyright notice in any copies or significant portions of the software.

## Support & Community

### Getting Help

**GitHub Issues**: Report bugs or request features through GitHub Issues. Please provide detailed information about your device, OS version, and steps to reproduce any problems.

**Documentation**: Check this README and inline code comments for implementation details.

**Community Discussions**: Join discussions in the GitHub Discussions section for questions and ideas.

### Frequently Asked Questions

**Q: Why doesn't audio play on my device?**
A: Ensure your device volume is up and check that no other apps are using exclusive audio mode. Try restarting the app.

**Q: Can I add my own frequency sets?**
A: Yes! Edit the frequencies.js file to add custom frequencies and categories.

**Q: How accurate are the generated frequencies?**
A: The app generates mathematically precise sine waves at the specified frequencies, ensuring therapeutic accuracy.

**Q: Does the app work offline?**
A: Yes, all frequency generation happens locally on your device without requiring internet connection.

### Acknowledgments

MagicWave was built with inspiration from modern meditation apps and frequency therapy research. Special thanks to the React Native and Expo communities for providing excellent tools and documentation.

The frequency data includes traditional healing frequencies, scientifically studied binaural beats, and frequencies associated with various spiritual and therapeutic practices.

---

**Built with ♥ using React Native, Expo, and mathematical precision for authentic frequency therapy experiences.**

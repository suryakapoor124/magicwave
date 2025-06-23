import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Device from 'expo-device';
import * as SplashScreen from 'expo-splash-screen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AudioProvider } from './src/contexts/AudioContext';
import ThemeProvider, { useTheme } from './src/utils/theme';
import { settingsManager } from './src/utils/storage';
import { audioEngine } from './src/utils/audio';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
}

function Main() {
  const { theme, isDark } = useTheme();
  const [isInitialized, setIsInitialized] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize app components
      await settingsManager.initialize();
      
      // Check device compatibility
      if (!Device.isDevice) {
        Alert.alert(
          'Device Warning',
          'This app works best on a physical device for optimal audio experience.',
          [{ text: 'OK' }]
        );
      }

      // Setup audio engine
      await audioEngine.setupAudio();

    } catch (error) {
      console.error('App initialization error:', error);
      // Don't set initialized here, let onLayout handle it
    } finally {
      setIsInitialized(true);
    }
  };

  const onLayoutRootView = useCallback(async () => {
    if (isInitialized && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isInitialized, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (fontError) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Text style={[styles.errorText, { color: theme.colors.onSurface }]}>
          Error loading fonts. Please restart the app.
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AudioProvider>
        <AppNavigator />
      </AudioProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

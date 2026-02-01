import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AudioProvider } from "./src/contexts/AudioContext";
import { CustomSplashScreen } from "./src/components/CustomSplashScreen";
import ThemeProvider, { useTheme } from "./src/utils/theme";
import { settingsManager } from "./src/utils/storage";
import { audioEngine } from "./src/utils/audio";

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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          Ubuntu_300Light:
            "https://fonts.gstatic.com/s/ubuntu/v20/4iCpE_yL0EHgdJg1E_BCIg.ttf",
          Ubuntu_400Regular:
            "https://fonts.gstatic.com/s/ubuntu/v20/4iCpE_yL0EHgdJg1E_BCIg.ttf",
          Ubuntu_500Medium:
            "https://fonts.gstatic.com/s/ubuntu/v20/4iCuE_yL0EHgdJg1E_B8iHN2LhhFpJEaKuSM.ttf",
          Ubuntu_700Bold:
            "https://fonts.gstatic.com/s/ubuntu/v20/4iCuE_yL0EHgdJg1E_B8rHN2LhhFpJEaKuSM.ttf",
        });
      } catch (error) {
        console.warn("Font loading issue, using system fonts:", error.message);
      }

      try {
        // Initialize settings
        await settingsManager.initialize();
      } catch (error) {
        console.error("Settings init error:", error.message);
      }

      try {
        // Setup audio
        await audioEngine.setupAudio();
      } catch (error) {
        console.error("Audio setup error:", error.message);
      }

      setIsReady(true);
    }

    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isReady]);

  if (!isReady) {
    return <CustomSplashScreen isDark={isDark} />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style={isDark ? "light" : "dark"} />
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
});

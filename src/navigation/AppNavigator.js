import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { View, StyleSheet, Easing } from 'react-native';
import { useTheme } from '../utils/theme';
import { HomeScreen } from '../screens/HomeScreen';
import { PlayerScreen } from '../screens/PlayerScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { SpotifyPlaybackBar } from '../components/SpotifyPlaybackBar';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { theme, isDark } = useTheme();

  // Optimized 60fps screen transition configuration
  const customTransitionConfig = {
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: 250,
          easing: Easing.in(Easing.cubic),
        },
      },
    },
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      };
    },
  };

  // Modal transition for player screen
  const modalTransitionConfig = {
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: 350,
          easing: Easing.out(Easing.cubic),
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: 300,
          easing: Easing.in(Easing.cubic),
        },
      },
    },
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateY: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.height, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      };
    },
  };

  const screenOptions = {
    headerShown: false,
    cardStyle: { backgroundColor: theme.colors.background },
    ...customTransitionConfig,
  };

  return (
    <View style={styles.container}>
      <NavigationContainer
        theme={{
          dark: isDark,
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.onSurface,
            border: theme.colors.outline,
            notification: theme.colors.primary,
          },
        }}
      >
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={screenOptions}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Favorites" 
            component={FavoritesScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Player" 
            component={PlayerScreen} 
            options={{ 
              headerShown: false,
              presentation: 'modal',
              ...modalTransitionConfig,
            }}
          />
          <Stack.Screen 
            name="About" 
            component={AboutScreen} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      
      {/* Keep the functional playback bar */}
      <SpotifyPlaybackBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});



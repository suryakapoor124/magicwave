import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useTheme, getCategoryColor, createCategoryTheme } from '../utils/theme';
import { useAudioContext } from '../contexts/AudioContext';
import { LargeFrequencyCard } from '../components/FrequencyCard';
import { AnimatedCard, BouncyButton, PulseView, WaveAnimation } from '../components/Animated';
import { favoritesManager, settingsManager } from '../utils/storage';
import { audioEngine, AudioUtils } from '../utils/audio';

const { width, height } = Dimensions.get('window');

export const PlayerScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const {
    currentFrequency,
    isPlaying,
    progress,
    duration,
    volume,
    togglePlayPause,
    stopFrequency,
    setVolumeLevel,
    toggleFavorite,
    isFavorite,
    playNext,
    playPrevious,
    seekTo,
  } = useAudioContext();

  if (!currentFrequency) {
    navigation.goBack();
    return null;
  }

  const categoryColor = getCategoryColor(currentFrequency.category, isDark);

  return (
    <LinearGradient
      colors={[theme.colors.background, categoryColor + '15']}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'} 
          backgroundColor="transparent"
          translucent
        />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={[styles.headerButton, { backgroundColor: theme.colors.surfaceContainerHigh }]}
          >
            <Ionicons name="chevron-down" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
            Now Playing
          </Text>
          
          <TouchableOpacity 
            onPress={() => toggleFavorite(currentFrequency)}
            style={[styles.headerButton, { backgroundColor: theme.colors.surfaceContainerHigh }]}
          >
            <Ionicons 
              name={isFavorite(currentFrequency) ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite(currentFrequency) ? theme.colors.primary : theme.colors.onSurface} 
            />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Frequency Display */}
          <View style={styles.frequencyDisplay}>
            <View style={[styles.iconContainer, { 
              backgroundColor: categoryColor + '10',
              borderColor: categoryColor + '30',
              borderWidth: 1,
              shadowColor: categoryColor,
              shadowOpacity: 0.3,
              shadowRadius: 20,
            }]}>
              <Text style={[styles.frequencyIcon, { fontSize: 80 }]}>
                {currentFrequency.image}
              </Text>
            </View>
            
            <Text style={[styles.frequencyName, { color: theme.colors.onSurface }]}>
              {currentFrequency.name}
            </Text>
            <Text style={[styles.frequencyValue, { color: categoryColor }]}>
              {currentFrequency.frequency}Hz
            </Text>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
              <Text style={[styles.frequencyCategory, { color: categoryColor }]}>
                {currentFrequency.category}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.surfaceContainerHighest }]}>
              <LinearGradient
                colors={[categoryColor, categoryColor + '80']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress}%` }]}
              />
            </View>
            <View style={styles.timeLabels}>
              <Text style={[styles.timeText, { color: theme.colors.onSurfaceVariant }]}>
                {/* Format time if needed, currently just progress % */}
                Playing
              </Text>
              <Text style={[styles.timeText, { color: theme.colors.onSurfaceVariant }]}>
                ∞
              </Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity 
              onPress={playPrevious}
              style={[styles.controlButton, { backgroundColor: theme.colors.surfaceContainerHigh }]}
            >
              <Ionicons name="play-skip-back" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={togglePlayPause}
              style={[styles.playButton, { 
                backgroundColor: categoryColor,
                shadowColor: categoryColor,
                shadowOpacity: 0.5,
                shadowRadius: 15,
                elevation: 10
              }]}
            >
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={32} 
                color="white" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={playNext}
              style={[styles.controlButton, { backgroundColor: theme.colors.surfaceContainerHigh }]}
            >
              <Ionicons name="play-skip-forward" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>

          {/* Volume Control */}
          <View style={[styles.volumeSection, { backgroundColor: theme.colors.surfaceContainer, padding: 16, borderRadius: 20 }]}>
            <Ionicons name="volume-low" size={20} color={theme.colors.onSurfaceVariant} />
            <Slider 
              style={styles.volumeSlider}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={setVolumeLevel}
              minimumTrackTintColor={categoryColor}
              maximumTrackTintColor={theme.colors.surfaceContainerHighest}
              thumbTintColor={categoryColor}
            />
            <Ionicons name="volume-high" size={20} color={theme.colors.onSurfaceVariant} />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: Platform.OS === 'android' ? 40 : 0,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-around',
    paddingBottom: 40,
  },
  frequencyDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  frequencyIcon: {
    textAlign: 'center',
  },
  frequencyName: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  frequencyValue: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 1,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  frequencyCategory: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 32,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
  },
});

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[styles.headerButton, { backgroundColor: theme.colors.surfaceVariant }]}
        >
          <Ionicons name="chevron-down" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Now Playing
        </Text>
        
        <TouchableOpacity 
          onPress={() => toggleFavorite(currentFrequency)}
          style={[styles.headerButton, { backgroundColor: theme.colors.surfaceVariant }]}
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
          <Text style={[styles.frequencyIcon, { fontSize: 120 }]}>
            {currentFrequency.image}
          </Text>
          <Text style={[styles.frequencyName, { color: theme.colors.onSurface }]}>
            {currentFrequency.name}
          </Text>
          <Text style={[styles.frequencyValue, { color: categoryColor }]}>
            {currentFrequency.frequency}Hz
          </Text>
          <Text style={[styles.frequencyCategory, { color: theme.colors.onSurfaceVariant }]}>
            {currentFrequency.category}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.outline }]}>
            <LinearGradient
              colors={[categoryColor, categoryColor + '80']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            onPress={playPrevious}
            style={[styles.controlButton, { backgroundColor: theme.colors.surfaceContainer }]}
          >
            <Ionicons name="play-skip-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={togglePlayPause}
            style={[styles.playButton, { backgroundColor: categoryColor }]}
          >
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={32} 
              color="white" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={playNext}
            style={[styles.controlButton, { backgroundColor: theme.colors.surfaceContainer }]}
          >
            <Ionicons name="play-skip-forward" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* Volume Control */}
        <View style={styles.volumeSection}>
          <Ionicons name="volume-low" size={20} color={theme.colors.onSurfaceVariant} />
          <Slider 
            style={styles.volumeSlider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={setVolumeLevel}
            minimumTrackTintColor={categoryColor}
            maximumTrackTintColor={theme.colors.outline}
            thumbTintColor={categoryColor}
          />
          <Ionicons name="volume-high" size={20} color={theme.colors.onSurfaceVariant} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  frequencyDisplay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  frequencyIcon: {
    marginBottom: 20,
  },
  frequencyName: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  frequencyValue: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  frequencyCategory: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressSection: {
    marginVertical: 30,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    gap: 40,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 16,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
  },
});

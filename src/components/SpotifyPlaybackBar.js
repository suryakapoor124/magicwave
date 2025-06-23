import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { useAudioContext } from '../contexts/AudioContext';
import { BouncyButton, PulseView } from './Animated';
import * as Haptics from 'expo-haptics';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

// Animated wave bar component for 60fps smooth animation
const AnimatedWaveBar = ({ height, delay }) => {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const createWaveAnimation = () => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 400,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.3,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation = createWaveAnimation();
    animation.start();

    return () => {
      animation.stop();
    };
  }, [scaleAnim, delay]);

  return (
    <Animated.View 
      style={[
        styles.waveBar, 
        { 
          height,
          transform: [{ scaleY: scaleAnim }]
        }
      ]} 
    />
  );
};

export const SpotifyPlaybackBar = () => {
  const { theme, isDark } = useTheme();
  const { 
    currentFrequency, 
    isPlaying, 
    progress, 
    togglePlayPause, 
    toggleFavorite, 
    isFavorite,
    volume,
    setVolumeLevel,
    stopFrequency,
    timer,
    setTimerDuration 
  } = useAudioContext();
  
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);

  if (!currentFrequency) return null;

  const handlePlayPause = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    togglePlayPause();
  };

  const handleFavorite = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(currentFrequency);
  };

  const handleStop = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    stopFrequency();
  };

  const handleVolumeChange = async (newVolume) => {
    await setVolumeLevel(newVolume);
  };

  const toggleVolumeControl = () => {
    setShowVolumeControl(!showVolumeControl);
  };

  const handleTimerPress = () => {
    setShowTimerModal(true);
  };

  const handleSetTimer = (minutes) => {
    setTimerDuration(minutes);
    setShowTimerModal(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const isFrequencyFavorite = isFavorite(currentFrequency);

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: isDark ? theme.colors.surfaceContainer : theme.colors.surface,
        borderTopColor: isDark ? theme.colors.outline : theme.colors.outlineVariant,
      }
    ]}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.colors.outline }]}>
          <LinearGradient
            colors={['#DC2626', '#EF4444']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
      </View>

      {/* Main content */}
      <View style={styles.mainContent}>
        <View style={styles.leftSection}>
          {/* Frequency Icon/Image */}
          <View style={[styles.albumArt, { backgroundColor: theme.colors.primary }]}>
            {isPlaying ? (
              <PulseView pulseScale={1.1} pulseDuration={1000}>
                <Text style={styles.albumIcon}>{currentFrequency.image}</Text>
              </PulseView>
            ) : (
              <Text style={styles.albumIcon}>{currentFrequency.image}</Text>
            )}
          </View>

          {/* Track info */}
          <View style={styles.trackInfo}>
            <Text 
              style={[styles.trackTitle, { color: theme.colors.onSurface }]}
              numberOfLines={1}
            >
              {currentFrequency.name}
            </Text>
            <Text 
              style={[styles.trackSubtitle, { color: theme.colors.onSurfaceVariant }]}
              numberOfLines={1}
            >
              {currentFrequency.frequency}Hz • {currentFrequency.category}
            </Text>
          </View>
        </View>

        {/* Right section - Controls */}
        <View style={styles.rightSection}>
          {/* Close button */}
          <BouncyButton style={styles.controlButton} onPress={handleStop}>
            <Ionicons 
              name="close" 
              size={20} 
              color={theme.colors.onSurfaceVariant} 
            />
          </BouncyButton>

          {/* Volume button */}
          <BouncyButton style={styles.controlButton} onPress={toggleVolumeControl}>
            <Ionicons 
              name={volume > 0.5 ? "volume-high" : volume > 0 ? "volume-medium" : "volume-mute"} 
              size={20} 
              color={theme.colors.onSurfaceVariant} 
            />
          </BouncyButton>

          {/* Like button */}
          <BouncyButton style={styles.controlButton} onPress={handleFavorite}>
            <Ionicons 
              name={isFrequencyFavorite ? "heart" : "heart-outline"} 
              size={20} 
              color={isFrequencyFavorite ? theme.colors.primary : theme.colors.onSurfaceVariant} 
            />
          </BouncyButton>

          {/* Timer button */}
          <BouncyButton style={styles.controlButton} onPress={handleTimerPress}>
            <Ionicons 
              name="timer" 
              size={20} 
              color={timer ? theme.colors.primary : theme.colors.onSurfaceVariant} 
            />
          </BouncyButton>

          {/* Play/Pause button */}
          <BouncyButton 
            style={styles.playButton}
            onPress={handlePlayPause}
          >
            <Ionicons 
              name={isPlaying ? 'pause' : 'play'} 
              size={24} 
              color="white" 
            />
          </BouncyButton>
        </View>
      </View>

      {/* Volume Control Slider */}
      {showVolumeControl && (
        <View style={styles.volumeContainer}>
          <View style={styles.volumeSection}>
            <Ionicons name="volume-low" size={16} color={theme.colors.onSurfaceVariant} />
            <Slider
              style={styles.volumeSlider}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.outline}
              thumbTintColor={theme.colors.primary}
              step={0.1}
            />
            <Ionicons name="volume-high" size={16} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.volumeText, { color: theme.colors.onSurfaceVariant }]}>
              {Math.round(volume * 100)}%
            </Text>
          </View>
        </View>
      )}

      {/* Animated wave indicators when playing */}
      {isPlaying && (
        <View style={styles.playingIndicator}>
          <AnimatedWaveBar height={8} delay={0} />
          <AnimatedWaveBar height={12} delay={100} />
          <AnimatedWaveBar height={6} delay={200} />
          <AnimatedWaveBar height={10} delay={300} />
        </View>
      )}

      {/* Sleep Timer Modal */}
      <Modal
        visible={showTimerModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
              Sleep Timer
            </Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Stop playing after:
            </Text>
            
            <View style={styles.timerOptions}>
              {[5, 10, 15, 30, 45, 60, 90].map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.timerOption,
                    { backgroundColor: timer === minutes ? theme.colors.primary : theme.colors.surfaceVariant },
                  ]}
                  onPress={() => handleSetTimer(minutes)}
                >
                  <Text style={[
                    styles.timerOptionText,
                    { color: timer === minutes ? 'white' : theme.colors.onSurfaceVariant }
                  ]}>
                    {minutes}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              {timer && (
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.colors.errorContainer }]}
                  onPress={() => handleSetTimer(0)}
                >
                  <Text style={[styles.modalButtonText, { color: theme.colors.onErrorContainer }]}>
                    Clear Timer
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={() => setShowTimerModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.onSurfaceVariant }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressContainer: {
    height: 2,
  },
  progressBar: {
    height: 2,
    width: '100%',
  },
  progressFill: {
    height: '100%',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 64,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  albumArt: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  albumIcon: {
    fontSize: 24,
    color: 'white',
  },
  trackInfo: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackSubtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playingIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  waveBar: {
    width: 2,
    backgroundColor: '#DC2626',
    borderRadius: 1,
    transformOrigin: 'bottom',
  },
  volumeContainer: {
  },
  fullScreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  heartButton: {
    padding: 8,
  },
  albumArtContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  largeAlbumArt: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  largeAlbumIcon: {
    fontSize: width * 0.3,
    color: 'white',
  },
  trackInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  trackDetails: {
    flex: 1,
  },
  fullTrackTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  fullTrackSubtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  progressSection: {
    marginBottom: 32,
  },
  fullProgressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
    position: 'relative',
  },
  fullProgressFill: {
    height: '100%',
    backgroundColor: '#DC2626',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#DC2626',
    marginLeft: -6,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '400',
  },
  controlsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  shuffleButton: {
    padding: 8,
  },
  skipButton: {
    padding: 8,
  },
  mainPlayButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  repeatButton: {
    padding: 8,
  },
  volumeContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  volumeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
  },
  volumeText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  volumeTrack: {
    height: 4,
    borderRadius: 2,
  },
  volumeFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 4,
    backgroundColor: '#DC2626',
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  timerOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  timerOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  timerOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

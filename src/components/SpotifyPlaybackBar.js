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
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { useAudioContext } from '../contexts/AudioContext';
import { PulseView } from './Animated';
import * as Haptics from 'expo-haptics';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

// Lightweight animated wave component - minimal animations for performance
const AnimatedWaveBar = React.memo(({ isPlaying, color, delay, height }) => {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isPlaying) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.3,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      scaleAnim.setValue(0.3);
    }
  }, [isPlaying]);

  return (
    <Animated.View 
      style={[
        styles.waveBar, 
        { 
          height,
          backgroundColor: color,
          transform: [{ scaleY: scaleAnim }],
        }
      ]} 
    />
  );
});

export const SpotifyPlaybackBar = () => {
  const { theme, isDark } = useTheme();
  const { 
    currentFrequency, 
    isPlaying, 
    togglePlayPause, 
    toggleFavorite, 
    isFavorite,
    volume,
    setVolumeLevel,
    stopFrequency,
    timer,
    setTimerDuration 
  } = useAudioContext();
  
  // All useState hooks at the top
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(60);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [slideUpAnim] = useState(new Animated.Value(0));
  const [opacityAnim] = useState(new Animated.Value(0));
  
  // All useRef hooks at the top
  const timerRef = useRef(null);

  // Ultra-lightweight slide animation
  useEffect(() => {
    if (currentFrequency) {
      slideUpAnim.setValue(1);
      opacityAnim.setValue(1);
    } else {
      slideUpAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [currentFrequency]);

  // Simplified timer countdown - update every 5 seconds instead of every second
  useEffect(() => {
    if (timer && isPlaying) {
      const startTime = Date.now();
      const endTime = startTime + (timer * 60 * 1000);
      
      setTimeRemaining(timer * 60);
      
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const remainingMs = endTime - now;
        
        if (remainingMs <= 0) {
          clearInterval(timerRef.current);
          setTimeRemaining(null);
          setTimerDuration(0);
          stopFrequency();
        } else {
          setTimeRemaining(Math.ceil(remainingMs / 1000));
        }
      }, 5000); // Update every 5 seconds instead of 1 second for better performance
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        setTimeRemaining(null);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timer, isPlaying]);

  if (!currentFrequency) return null;

  const handlePlayPause = () => {
    togglePlayPause(); // Remove all haptics and async for instant response
  };

  const handleFavorite = () => {
    toggleFavorite(currentFrequency);
  };

  const handleStop = () => {
    stopFrequency();
    setTimerDuration(0);
  };

  const handleVolumeChange = (newVolume) => {
    // Direct, instant volume update
    console.log('Volume changing to:', newVolume);
    setVolumeLevel(newVolume);
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
  };

  const handleClearTimer = () => {
    setTimerDuration(0);
    setShowTimerModal(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isFrequencyFavorite = isFavorite(currentFrequency);

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.outline + '20',
      }
    ]}>
      {/* Enhanced Progress Indicator with Glow Effect */}
      <View style={styles.progressContainer}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.progressBar, 
            { 
              opacity: isPlaying ? 1 : 0.4,
            }
          ]}
        />
        {isPlaying && (
          <View style={styles.playingIndicator}>
            <AnimatedWaveBar height={3} delay={0} color={theme.colors.primary} isPlaying={isPlaying} />
            <AnimatedWaveBar height={4} delay={1} color={theme.colors.primary} isPlaying={isPlaying} />
            <AnimatedWaveBar height={3} delay={2} color={theme.colors.primary} isPlaying={isPlaying} />
          </View>
        )}
      </View>

      {/* Timer Countdown Display - Prominently Visible */}
      {timeRemaining && (
        <View style={[styles.timerCountdownBar, { backgroundColor: theme.colors.primaryContainer }]}>
          <View style={styles.timerCountdownContent}>
            <Ionicons name="timer" size={16} color={theme.colors.onPrimaryContainer} />
            <Text style={[styles.timerCountdownText, { color: theme.colors.onPrimaryContainer }]}>
              Sleep timer: {formatTime(timeRemaining)} remaining
            </Text>
            <TouchableOpacity 
              onPress={() => setTimerDuration(0)}
              style={[styles.cancelTimerButton, { backgroundColor: theme.colors.onPrimaryContainer + '20' }]}
            >
              <Ionicons name="close" size={14} color={theme.colors.onPrimaryContainer} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Left Section - Enhanced Track Info */}
        <View style={styles.leftSection}>
          <View style={[
            styles.albumArt, 
            { 
              backgroundColor: theme.colors.primary + '20',
              borderColor: theme.colors.primary + '30',
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isPlaying ? 0.2 : 0,
              shadowRadius: 4,
              elevation: isPlaying ? 2 : 0,
            }
          ]}>
            {currentFrequency.image && currentFrequency.image !== '�' ? (
              <Text style={styles.albumIcon}>{currentFrequency.image}</Text>
            ) : (
              <Ionicons name="musical-notes" size={20} color={theme.colors.primary} />
            )}
          </View>

          <View style={styles.trackInfo}>
            <Text 
              style={[styles.trackTitle, { color: theme.colors.onSurface }]}
              numberOfLines={1}
            >
              {currentFrequency.name}
            </Text>
            <View style={styles.trackSubtitleContainer}>
              <Text 
                style={[styles.trackSubtitle, { color: theme.colors.onSurfaceVariant }]}
                numberOfLines={1}
              >
                {currentFrequency.frequency}Hz • {currentFrequency.category}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Section - Optimized Controls */}
        <View style={styles.rightSection}>
          {/* Volume button - simplified */}
          <TouchableOpacity 
            style={[
              styles.controlButton, 
              { 
                backgroundColor: showVolumeControl 
                  ? theme.colors.primary + '20'
                  : theme.colors.surfaceContainer,
              }
            ]} 
            onPress={toggleVolumeControl}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={volume > 0.5 ? "volume-high" : volume > 0 ? "volume-medium" : "volume-mute"} 
              size={18} 
              color={showVolumeControl ? theme.colors.primary : theme.colors.onSurface} 
            />
          </TouchableOpacity>

          {/* Timer button - simplified */}
          <TouchableOpacity 
            style={[
              styles.controlButton, 
              { 
                backgroundColor: timer ? theme.colors.primary + '20' : theme.colors.surfaceContainer,
              }
            ]} 
            onPress={handleTimerPress}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="timer" 
              size={18} 
              color={timer ? theme.colors.primary : theme.colors.onSurface} 
            />
          </TouchableOpacity>

          {/* Favorite button - simplified */}
          <TouchableOpacity 
            style={[
              styles.controlButton, 
              { 
                backgroundColor: isFrequencyFavorite 
                  ? theme.colors.primary + '20' 
                  : theme.colors.surfaceContainer,
              }
            ]} 
            onPress={handleFavorite}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isFrequencyFavorite ? "heart" : "heart-outline"} 
              size={18} 
              color={isFrequencyFavorite ? theme.colors.primary : theme.colors.onSurface} 
            />
          </TouchableOpacity>

          {/* Play/Pause button - simplified */}
          <TouchableOpacity 
            style={[
              styles.playButton, 
              { backgroundColor: theme.colors.primary }
            ]}
            onPress={handlePlayPause}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isPlaying ? 'pause' : 'play'} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>

          {/* Stop button - simplified */}
          <TouchableOpacity 
            style={[
              styles.controlButton, 
              { backgroundColor: theme.colors.surfaceContainer }
            ]} 
            onPress={handleStop}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="stop" 
              size={18} 
              color={theme.colors.onSurface} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Working Volume Control - Community Slider */}
      {showVolumeControl && (
        <View 
          style={[
            styles.volumeContainer, 
            { 
              backgroundColor: theme.colors.surfaceContainer,
            }
          ]}
        >
          <View style={styles.volumeSection}>
            <TouchableOpacity onPress={() => handleVolumeChange(0)}>
              <Ionicons name="volume-mute" size={16} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
            
            {/* Community Slider with touch debugging */}
            <View style={styles.sliderWrapper}>
              <Slider
                style={styles.volumeSlider}
                minimumValue={0}
                maximumValue={1}  
                value={volume}
                onValueChange={handleVolumeChange}
                onSlidingStart={() => console.log('Slider started')}
                onSlidingComplete={(value) => {
                  console.log('Slider completed:', value);
                  handleVolumeChange(value);
                }}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.outline + '60'}
                thumbTintColor={theme.colors.primary}
                step={0.01}
                tapToSeek={true}
              />
            </View>
            
            <TouchableOpacity onPress={() => handleVolumeChange(1)}>
              <Ionicons name="volume-high" size={16} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
            
            <Text style={[styles.volumeText, { color: theme.colors.onSurface }]}>
              {Math.round(volume * 100)}%
            </Text>
          </View>
          
          {/* Quick volume buttons for testing */}
          <View style={styles.quickVolumeButtons}>
            <TouchableOpacity 
              style={[styles.quickVolumeButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => handleVolumeChange(0.25)}
            >
              <Text style={styles.quickVolumeText}>25%</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickVolumeButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => handleVolumeChange(0.5)}
            >
              <Text style={styles.quickVolumeText}>50%</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickVolumeButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => handleVolumeChange(0.75)}
            >
              <Text style={styles.quickVolumeText}>75%</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickVolumeButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => handleVolumeChange(1)}
            >
              <Text style={styles.quickVolumeText}>100%</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Enhanced Timer Modal with Proper Theme */}
      <Modal
        visible={showTimerModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
                Sleep Timer
              </Text>
              <TouchableOpacity 
                onPress={() => setShowTimerModal(false)}
                style={[styles.closeButton, { backgroundColor: theme.colors.surfaceVariant }]}
              >
                <Ionicons name="close" size={20} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Audio will automatically stop after selected time
            </Text>
            
            {/* Slider for timer selection */}
            <View style={[styles.sliderContainer, { backgroundColor: theme.colors.surfaceContainer }]}>
              <View style={styles.sliderHeader}>
                <Text style={[styles.sliderHeaderText, { color: theme.colors.onSurfaceContainer }]}>
                  Duration (1-500 minutes)
                </Text>
              </View>
              
              <View style={styles.sliderRow}>
                <Text style={[styles.sliderLabel, { color: theme.colors.onSurfaceContainer }]}>
                  1 min
                </Text>
                <Text style={[styles.sliderLabel, { color: theme.colors.onSurfaceContainer }]}>
                  500 min
                </Text>
              </View>
              
              <Slider
                style={styles.timerSlider}
                minimumValue={1}
                maximumValue={500}
                value={timerMinutes}
                onValueChange={setTimerMinutes}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.outline}
                thumbTintColor={theme.colors.primary}
                step={1}
                tapToSeek={true}
              />
              
              <View style={styles.selectedTimeContainer}>
                <Text style={[styles.selectedTimeText, { color: theme.colors.primary }]}>
                  {timerMinutes} minute{timerMinutes !== 1 ? 's' : ''}
                </Text>
                <Text style={[styles.selectedTimeSubtext, { color: theme.colors.onSurfaceVariant }]}>
                  ({Math.floor(timerMinutes / 60)}h {timerMinutes % 60}m)
                </Text>
              </View>
            </View>

            {/* Quick select buttons */}
            <View style={styles.quickSelectSection}>
              <Text style={[styles.quickSelectLabel, { color: theme.colors.onSurface }]}>
                Quick Select
              </Text>
              <View style={styles.quickSelectContainer}>
                {[5, 15, 30, 60, 90, 120].map((minutes) => (
                  <TouchableOpacity
                    key={minutes}
                    style={[
                      styles.quickSelectButton,
                      { 
                        backgroundColor: timerMinutes === minutes 
                          ? theme.colors.primary 
                          : theme.colors.surfaceContainer,
                        borderColor: timerMinutes === minutes 
                          ? theme.colors.primary 
                          : theme.colors.outline + '30',
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => setTimerMinutes(minutes)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.quickSelectText,
                      { 
                        color: timerMinutes === minutes 
                          ? 'white' 
                          : theme.colors.onSurface,
                        fontWeight: timerMinutes === minutes ? '600' : '500',
                      }
                    ]}>
                      {minutes}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              {timer && (
                <TouchableOpacity
                  style={[
                    styles.modalButton, 
                    styles.clearButton, 
                    { 
                      backgroundColor: theme.colors.errorContainer,
                      borderColor: theme.colors.error + '30',
                      borderWidth: 1,
                    }
                  ]}
                  onPress={handleClearTimer}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={18} color={theme.colors.onErrorContainer} />
                  <Text style={[styles.modalButtonText, { color: theme.colors.onErrorContainer }]}>
                    Clear Timer
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[
                  styles.modalButton, 
                  styles.setButton, 
                  { 
                    backgroundColor: theme.colors.primary,
                    shadowColor: theme.colors.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 3,
                  }
                ]}
                onPress={() => handleSetTimer(timerMinutes)}
                activeOpacity={0.9}
              >
                <Ionicons name="timer" size={18} color="white" />
                <Text style={[styles.modalButtonText, { color: 'white', fontWeight: '600' }]}>
                  Set Timer
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
    borderTopWidth: 0.5,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  progressContainer: {
    height: 3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: 3,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  progressFill: {
    height: '100%',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 70,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  albumArt: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    elevation: 2,
  },
  albumIcon: {
    fontSize: 26,
    color: 'white',
  },
  trackInfo: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
    letterSpacing: 0.1,
  },
  trackSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.8,
    letterSpacing: 0.05,
  },
  trackSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerCountdownBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  timerCountdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  timerCountdownText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  cancelTimerButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },

  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  playButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  playingIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 3,
  },
  waveBar: {
    width: 3,
    borderRadius: 1.5,
    transformOrigin: 'bottom',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
    width: '100%',
  },
  sliderWrapper: {
    flex: 1,
    marginHorizontal: 8,
    height: 40,
    justifyContent: 'center',
  },
  quickVolumeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  quickVolumeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  quickVolumeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  customSliderContainer: {
    flex: 1,
    height: 30,
    marginHorizontal: 8,
    justifyContent: 'center',
    position: 'relative',
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  sliderActiveTrack: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  sliderThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    top: -6,
    marginLeft: -8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    opacity: 0.8,
  },
  sliderContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sliderHeader: {
    marginBottom: 12,
  },
  sliderHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  timerSlider: {
    width: '100%',
    height: 40,
    marginBottom: 16,
  },
  selectedTimeContainer: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  selectedTimeText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  selectedTimeSubtext: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
  quickSelectSection: {
    marginBottom: 24,
  },
  quickSelectLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.1,
  },
  quickSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  quickSelectButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickSelectText: {
    fontSize: 14,
    letterSpacing: 0.1,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    minWidth: 120,
    justifyContent: 'center',
    gap: 8,
  },
  clearButton: {
    flex: 1,
  },
  setButton: {
    flex: 1,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});

import React, { useState, useEffect, useRef } from "react";
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
  SafeAreaView,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../utils/theme";
import { useAudioContext } from "../contexts/AudioContext";
import { PulseView } from "./Animated";
import * as Haptics from "expo-haptics";
import Slider from "@react-native-community/slider";

const { width, height } = Dimensions.get("window");

const AnimatedWaveBar = ({ height, delay, color, isPlaying }) => {
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: height,
            duration: 400,
            delay: delay * 100,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      anim.setValue(1);
    }
  }, [isPlaying, height, delay]);

  return (
    <Animated.View
      style={{
        width: 3,
        height: 12,
        backgroundColor: color,
        borderRadius: 1.5,
        marginHorizontal: 1,
        transform: [{ scaleY: anim }],
      }}
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
    setTimerDuration,
  } = useAudioContext();

  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(60);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [slideUpAnim] = useState(new Animated.Value(0));
  const [opacityAnim] = useState(new Animated.Value(0));

  const timerRef = useRef(null);

  useEffect(() => {
    if (currentFrequency) {
      slideUpAnim.setValue(1);
      opacityAnim.setValue(1);
    } else {
      slideUpAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [currentFrequency]);

  useEffect(() => {
    if (timer && isPlaying) {
      const startTime = Date.now();
      const endTime = startTime + timer * 60 * 1000;

      setTimeRemaining(timer * 60);

      timerRef.current = setInterval(() => {
        const now = Date.now();
        const remainingMs = endTime - now;

        if (remainingMs <= 0) {
          clearInterval(timerRef.current);
          setTimeRemaining(0);
          setTimerDuration(0);
          stopFrequency();
        } else {
          setTimeRemaining(Math.max(0, Math.ceil(remainingMs / 1000)));
        }
      }, 1000);
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
    togglePlayPause();
  };

  const handleFavorite = () => {
    toggleFavorite(currentFrequency);
  };

  const handleStop = () => {
    stopFrequency();
    setTimerDuration(0);
  };

  const handleVolumeChange = (newVolume) => {
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
    const safeSeconds = Number.isFinite(seconds) ? seconds : 0;
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const safeTimeRemaining = Number.isFinite(timeRemaining) ? timeRemaining : 0;
  const timerProgress = timer
    ? Math.max(0, Math.min(100, (safeTimeRemaining / (timer * 60)) * 100))
    : 0;

  const isFrequencyFavorite = isFavorite(currentFrequency);

  const renderFullScreenPlayer = () => (
    <Modal
      visible={showFullScreen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFullScreen(false)}
    >
      <LinearGradient
        colors={["#191414", "#121212"]} // Spotify Dark Gradient
        style={styles.fullScreenContainer}
      >
        <SafeAreaView style={styles.fullScreenSafeArea}>
          <View style={styles.fsHeader}>
            <TouchableOpacity
              onPress={() => setShowFullScreen(false)}
              style={styles.fsHeaderButton}
            >
              <Ionicons name="chevron-down" size={32} color="white" />
            </TouchableOpacity>
            <Text style={[styles.fsHeaderTitle, { color: "white" }]}>
              NOW PLAYING
            </Text>
            <TouchableOpacity
              onPress={() => setShowTimerModal(true)}
              style={styles.fsHeaderButton}
            >
              <Ionicons
                name="timer-outline"
                size={28}
                color={timer ? "#1DB954" : "white"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.fsContent}
            contentContainerStyle={styles.fsContentInner}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.fsArtworkContainer, { shadowColor: "#000" }]}>
              <LinearGradient
                colors={["#282828", "#121212"]}
                style={styles.fsArtwork}
              >
                <Text style={styles.fsArtworkIcon}>
                  {currentFrequency.image}
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.fsTrackInfo}>
              <View>
                <Text style={[styles.fsTitle, { color: "white" }]}>
                  {currentFrequency.name}
                </Text>
                <Text style={[styles.fsSubtitle, { color: "#B3B3B3" }]}>
                  {currentFrequency.frequency} Hz • {currentFrequency.category}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleFavorite(currentFrequency)}
              >
                <Ionicons
                  name={isFrequencyFavorite ? "heart" : "heart-outline"}
                  size={32}
                  color={isFrequencyFavorite ? "#1DB954" : "white"}
                />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.factCard,
                { backgroundColor: theme.colors.surfaceContainer },
              ]}
            >
              <View style={styles.factHeader}>
                <Ionicons
                  name="sparkles"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.factLabel, { color: theme.colors.primary }]}
                >
                  Did you know
                </Text>
              </View>
              <Text
                style={[
                  styles.factText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {currentFrequency.description}
              </Text>
            </View>

            <View style={styles.fsProgressContainer}>
              {timer ? (
                <>
                  <View style={styles.fsProgressBar}>
                    <View
                      style={[
                        styles.fsProgressFill,
                        {
                          width: `${timerProgress}%`,
                          backgroundColor: "#1DB954",
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.fsTimeLabels}>
                    <Text style={[styles.fsTimeText, { color: "#B3B3B3" }]}>
                      {formatTime(safeTimeRemaining)} remaining
                    </Text>
                    <Text style={[styles.fsTimeText, { color: "#B3B3B3" }]}>
                      {timer} min timer
                    </Text>
                  </View>
                </>
              ) : (
                <View style={styles.fsNoTimer}>
                  <Text style={[styles.fsNoTimerText, { color: "#B3B3B3" }]}>
                    Infinite Playback
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.fsControls}>
              <TouchableOpacity
                onPress={() => setVolumeLevel(Math.max(0, volume - 0.1))}
              >
                <Ionicons name="volume-low" size={28} color="#B3B3B3" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.fsPlayButton, { backgroundColor: "white" }]}
                onPress={togglePlayPause}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={40}
                  color="black"
                  style={{ marginLeft: isPlaying ? 0 : 4 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setVolumeLevel(Math.min(1, volume + 0.1))}
              >
                <Ionicons name="volume-high" size={28} color="#B3B3B3" />
              </TouchableOpacity>
            </View>

            <View style={styles.fsVolumeContainer}>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={setVolumeLevel}
                minimumTrackTintColor="#1DB954"
                maximumTrackTintColor="#535353"
                thumbTintColor="white"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: "#191414", // Force dark background
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setShowFullScreen(true)}
        style={styles.mainContent}
      >
        <View style={styles.leftSection}>
          <View
            style={[
              styles.albumArt,
              {
                backgroundColor: "#282828",
                borderColor: "transparent",
              },
            ]}
          >
            {currentFrequency.image && currentFrequency.image !== "" ? (
              <Text style={styles.albumIcon}>{currentFrequency.image}</Text>
            ) : (
              <Ionicons name="musical-notes" size={20} color="#1DB954" />
            )}
          </View>

          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {currentFrequency.name}
            </Text>
            <View style={styles.trackSubtitleContainer}>
              <Text style={styles.trackSubtitle} numberOfLines={1}>
                {currentFrequency.frequency}Hz • {currentFrequency.category}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleFavorite}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFrequencyFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFrequencyFavorite ? "#1DB954" : "#B3B3B3"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlayPause}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={28}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <View style={styles.progressContainer}>
        <LinearGradient
          colors={["#1DB954", "#1DB954"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.progressBar,
            {
              width: `${progress || 0}%`,
            },
          ]}
        />
      </View>
      {renderFullScreenPlayer()}

      <Modal
        visible={showTimerModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalTitle, { color: theme.colors.onSurface }]}
              >
                Sleep Timer
              </Text>
              <TouchableOpacity
                onPress={() => setShowTimerModal(false)}
                style={[
                  styles.closeButton,
                  { backgroundColor: theme.colors.surfaceContainer },
                ]}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={theme.colors.onSurface}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.modalSubtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Audio will automatically stop after selected time
            </Text>

            {timer && timeRemaining !== null && (
              <View style={styles.timerCountdownRow}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.timerCountdownText,
                    { color: theme.colors.primary },
                  ]}
                >
                  {formatTime(safeTimeRemaining)} remaining
                </Text>
              </View>
            )}

            <View
              style={[
                styles.sliderContainer,
                { backgroundColor: theme.colors.surfaceContainer },
              ]}
            >
              <View style={styles.sliderHeader}>
                <Text
                  style={[
                    styles.sliderHeaderText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Duration (1-500 minutes)
                </Text>
              </View>

              <View style={styles.sliderRow}>
                <Text
                  style={[
                    styles.sliderLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  1 min
                </Text>
                <Text
                  style={[
                    styles.sliderLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  500 min
                </Text>
              </View>

              <Slider
                style={styles.timerSlider}
                minimumValue={1}
                maximumValue={500}
                value={timerMinutes}
                onValueChange={setTimerMinutes}
                minimumTrackTintColor="#1DB954"
                maximumTrackTintColor="#535353"
                thumbTintColor="#1DB954"
                step={1}
                tapToSeek={true}
              />

              <View style={styles.selectedTimeContainer}>
                <Text
                  style={[
                    styles.selectedTimeText,
                    { color: theme.colors.primary },
                  ]}
                >
                  {timerMinutes} minute{timerMinutes !== 1 ? "s" : ""}
                </Text>
                <Text
                  style={[
                    styles.selectedTimeSubtext,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  ({Math.floor(timerMinutes / 60)}h {timerMinutes % 60}m)
                </Text>
              </View>
            </View>

            <View style={styles.quickSelectSection}>
              <Text
                style={[
                  styles.quickSelectLabel,
                  { color: theme.colors.onSurface },
                ]}
              >
                Quick Select
              </Text>
              <View style={styles.quickSelectContainer}>
                {[5, 15, 30, 60, 90, 120].map((minutes) => (
                  <TouchableOpacity
                    key={minutes}
                    style={[
                      styles.quickSelectButton,
                      {
                        backgroundColor:
                          timerMinutes === minutes
                            ? theme.colors.primary
                            : theme.colors.surfaceContainer,
                        borderColor:
                          timerMinutes === minutes
                            ? theme.colors.primary
                            : theme.colors.outline + "30",
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => setTimerMinutes(minutes)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.quickSelectText,
                        {
                          color:
                            timerMinutes === minutes
                              ? theme.colors.onPrimary
                              : theme.colors.onSurface,
                          fontWeight: timerMinutes === minutes ? "600" : "500",
                        },
                      ]}
                    >
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
                      backgroundColor: "rgba(239, 68, 68, 0.2)",
                      borderColor: "rgba(239, 68, 68, 0.5)",
                      borderWidth: 1,
                    },
                  ]}
                  onPress={handleClearTimer}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  <Text style={[styles.modalButtonText, { color: "#EF4444" }]}>
                    Clear Timer
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.setButton,
                  {
                    backgroundColor: "#1DB954",
                    shadowColor: "#1DB954",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 3,
                  },
                ]}
                onPress={() => handleSetTimer(timerMinutes)}
                activeOpacity={0.9}
              >
                <Ionicons name="timer" size={18} color="white" />
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: "white", fontWeight: "600" },
                  ]}
                >
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
    position: "absolute",
    bottom: Platform.OS === "ios" ? 86 : 66, // Position above the tab bar
    left: 8,
    right: 8,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#191414", // Spotify Black/Dark Grey
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: "hidden", // Ensure rounded corners clip content
    zIndex: 100,
  },
  progressContainer: {
    height: 2,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    position: "absolute",
    bottom: 0, // Move progress bar to bottom of mini player
    zIndex: 10,
  },
  progressBar: {
    height: 2,
    width: "100%",
    backgroundColor: "#1DB954", // Spotify Green
  },
  playingIndicator: {
    position: "absolute",
    right: 16,
    bottom: 24, // Adjust for new height
    flexDirection: "row",
    alignItems: "flex-end",
    height: 12,
  },
  timerCountdownBar: {
    display: "none", // Hide timer bar in mini player to save space
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: "100%",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  albumArt: {
    width: 48,
    height: 48,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#282828",
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
    color: "white",
  },
  trackSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#B3B3B3",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  controlButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // Remove circle background for cleaner look
  },

  // Volume Control
  volumeContainer: {
    padding: 16,
    borderTopWidth: 0.5,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  volumeSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  sliderWrapper: {
    flex: 1,
  },
  volumeSlider: {
    width: "100%",
    height: 40,
  },
  volumeText: {
    fontSize: 12,
    fontWeight: "600",
    width: 36,
    textAlign: "right",
  },
  quickVolumeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  quickVolumeButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  quickVolumeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },

  // Full Screen Player Styles
  fullScreenContainer: {
    flex: 1,
  },
  fullScreenSafeArea: {
    flex: 1,
  },
  fsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 20,
  },
  fsHeaderButton: {
    padding: 8,
  },
  fsHeaderTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  fsContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  fsContentInner: {
    paddingBottom: 8,
  },
  fsArtworkContainer: {
    alignItems: "center",
    marginBottom: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  fsArtwork: {
    width: width - 96,
    height: width - 96,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  fsArtworkIcon: {
    fontSize: 80,
  },
  fsTrackInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  fsTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  fsSubtitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  factCard: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
  },
  factHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  factLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  factText: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
  },
  fsProgressContainer: {
    marginBottom: 32,
  },
  fsProgressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    marginBottom: 8,
    overflow: "hidden",
  },
  fsProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  fsTimeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fsTimeText: {
    fontSize: 12,
    opacity: 0.7,
  },
  fsNoTimer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  fsNoTimerText: {
    fontSize: 12,
    opacity: 0.5,
    letterSpacing: 1,
  },
  fsControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  fsPlayButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  fsVolumeContainer: {
    paddingHorizontal: 12,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
    borderRadius: 12,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  sliderContainer: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  sliderHeader: {
    marginBottom: 12,
  },
  sliderHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sliderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  selectedTimeContainer: {
    alignItems: "center",
    marginTop: 12,
  },
  selectedTimeText: {
    fontSize: 24,
    fontWeight: "700",
  },
  selectedTimeSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  quickSelectSection: {
    marginBottom: 24,
  },
  quickSelectLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  quickSelectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickSelectButton: {
    flexBasis: "30%",
    flexGrow: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickSelectText: {
    fontSize: 14,
    fontWeight: "600",
  },
  timerSlider: {
    width: "100%",
    height: 40,
  },
  timerCountdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  timerCountdownText: {
    fontSize: 14,
    fontWeight: "600",
  },
  timerValue: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  clearButton: {
    borderWidth: 1,
  },
  setButton: {
    // styles handled inline for shadow
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

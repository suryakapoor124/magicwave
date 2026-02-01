import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Platform,
  Modal,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useTheme, getCategoryColor, fontFamilies } from "../utils/theme";
import { useAudioContext } from "../contexts/AudioContext";

const { width, height } = Dimensions.get("window");

export const PlayerScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const {
    currentFrequency,
    isPlaying,
    progress,
    volume,
    togglePlayPause,
    stopFrequency,
    setVolumeLevel,
    toggleFavorite,
    isFavorite,
    playNext,
    playPrevious,
    timer,
    setTimerDuration,
  } = useAudioContext();

  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(timer || 60);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [scaleAnim] = useState(new Animated.Value(1));
  const timerRef = useRef(null);

  // Timer countdown logic
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

  // Play button animation
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isPlaying]);

  if (!currentFrequency) {
    navigation.goBack();
    return null;
  }

  const categoryColor = getCategoryColor(currentFrequency.category, isDark);
  const safeTimeRemaining = Number.isFinite(timeRemaining) ? timeRemaining : 0;
  const timerProgress = timer
    ? Math.max(0, Math.min(100, (safeTimeRemaining / (timer * 60)) * 100))
    : 0;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
        secs,
      ).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0",
    )}`;
  };

  const handleSetTimer = (minutes) => {
    setTimerMinutes(minutes);
    setTimerDuration(minutes);
    setShowTimerModal(false);
  };

  const handleClearTimer = () => {
    setTimerDuration(0);
    setTimerMinutes(60);
    setShowTimerModal(false);
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, categoryColor + "12"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              styles.headerButton,
              {
                backgroundColor: theme.colors.surfaceContainer + "80",
              },
            ]}
          >
            <Ionicons
              name="chevron-down"
              size={28}
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamilies.medium,
              },
            ]}
          >
            Now Playing
          </Text>

          <TouchableOpacity
            onPress={() => toggleFavorite(currentFrequency)}
            style={[
              styles.headerButton,
              {
                backgroundColor: isFavorite(currentFrequency)
                  ? categoryColor + "30"
                  : theme.colors.surfaceContainer + "80",
              },
            ]}
          >
            <Ionicons
              name={isFavorite(currentFrequency) ? "heart" : "heart-outline"}
              size={28}
              color={
                isFavorite(currentFrequency)
                  ? theme.colors.primary
                  : theme.colors.onSurface
              }
            />
          </TouchableOpacity>
        </View>

        {/* Spacer */}
        <View style={{ flex: 0.3 }} />

        {/* Frequency Display - Large and Centered */}
        <View style={styles.frequencyDisplay}>
          <LinearGradient
            colors={[categoryColor + "25", categoryColor + "08"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.iconContainer,
              {
                borderColor: categoryColor + "40",
                borderWidth: 2,
                shadowColor: categoryColor,
                shadowOpacity: 0.4,
                shadowRadius: 32,
              },
            ]}
          >
            <Text style={styles.frequencyIcon}>{currentFrequency.image}</Text>
          </LinearGradient>

          <Text
            style={[
              styles.frequencyName,
              {
                color: theme.colors.onSurface,
                fontFamily: fontFamilies.bold,
              },
            ]}
          >
            {currentFrequency.name}
          </Text>

          <Text
            style={[
              styles.frequencyValue,
              { color: categoryColor, fontFamily: fontFamilies.bold },
            ]}
          >
            {currentFrequency.frequency} Hz
          </Text>

          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: categoryColor + "20" },
            ]}
          >
            <Text
              style={[
                styles.frequencyCategory,
                { color: categoryColor, fontFamily: fontFamilies.medium },
              ]}
            >
              {currentFrequency.category}
            </Text>
          </View>

          {/* Description */}
          <Text
            style={[
              styles.frequencyDescription,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamilies.regular,
              },
            ]}
          >
            {currentFrequency.description ||
              "Immerse yourself in healing frequencies"}
          </Text>
        </View>

        {/* Timer Status */}
        {timer > 0 && (
          <View
            style={[
              styles.timerStatusContainer,
              {
                backgroundColor: categoryColor + "15",
                borderColor: categoryColor + "30",
              },
            ]}
          >
            <View style={styles.timerStatusContent}>
              <Ionicons name="timer" size={20} color={categoryColor} />
              <View style={styles.timerStatusText}>
                <Text
                  style={[
                    styles.timerStatusLabel,
                    { color: categoryColor, fontFamily: fontFamilies.bold },
                  ]}
                >
                  Sleep Timer Active
                </Text>
                <Text
                  style={[
                    styles.timerStatusValue,
                    {
                      color: theme.colors.onSurfaceVariant,
                      fontFamily: fontFamilies.regular,
                    },
                  ]}
                >
                  {formatTime(safeTimeRemaining)} remaining
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.timerProgressBar,
                { backgroundColor: theme.colors.surfaceContainer },
              ]}
            >
              <View
                style={[
                  styles.timerProgressFill,
                  {
                    width: `${timerProgress}%`,
                    backgroundColor: categoryColor,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Progress */}
        <View style={styles.progressSection}>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.colors.surfaceContainerHighest },
            ]}
          >
            <LinearGradient
              colors={[categoryColor, categoryColor + "80"]}
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
            style={[
              styles.controlButton,
              {
                backgroundColor: theme.colors.surfaceContainer,
              },
            ]}
          >
            <Ionicons
              name="play-skip-back-outline"
              size={24}
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              onPress={togglePlayPause}
              style={[
                styles.playButton,
                {
                  backgroundColor: categoryColor,
                  shadowColor: categoryColor,
                  shadowOpacity: 0.5,
                  shadowRadius: 20,
                  elevation: 12,
                },
              ]}
            >
              <Ionicons
                name={isPlaying ? "pause-sharp" : "play-sharp"}
                size={40}
                color="white"
              />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            onPress={playNext}
            style={[
              styles.controlButton,
              {
                backgroundColor: theme.colors.surfaceContainer,
              },
            ]}
          >
            <Ionicons
              name="play-skip-forward-outline"
              size={24}
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {/* Volume Control */}
          <View
            style={[
              styles.volumeSection,
              {
                backgroundColor: theme.colors.surfaceContainer,
              },
            ]}
          >
            <Ionicons
              name="volume-low"
              size={20}
              color={theme.colors.onSurfaceVariant}
            />
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
            <Ionicons
              name="volume-high"
              size={20}
              color={theme.colors.onSurfaceVariant}
            />
          </View>

          {/* Sleep Timer Button */}
          <TouchableOpacity
            onPress={() => setShowTimerModal(true)}
            style={[
              styles.timerButton,
              {
                backgroundColor:
                  timer > 0
                    ? categoryColor + "25"
                    : theme.colors.surfaceContainer,
                borderColor:
                  timer > 0 ? categoryColor : theme.colors.outline + "20",
                borderWidth: 1,
              },
            ]}
          >
            <Ionicons
              name={timer > 0 ? "timer" : "timer-outline"}
              size={22}
              color={timer > 0 ? categoryColor : theme.colors.onSurface}
            />
            <Text
              style={[
                styles.timerButtonText,
                {
                  color: timer > 0 ? categoryColor : theme.colors.onSurface,
                  fontFamily: fontFamilies.medium,
                },
              ]}
            >
              {timer > 0 ? `${timer}m` : "Sleep"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Modern Sleep Timer Modal */}
      <Modal
        visible={showTimerModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={[
              theme.colors.surface,
              theme.colors.surfaceContainer + "40",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalContent}
          >
            <SafeAreaView style={styles.modalSafeArea}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <Ionicons name="timer" size={28} color={categoryColor} />
                  <View>
                    <Text
                      style={[
                        styles.modalTitle,
                        {
                          color: theme.colors.onSurface,
                          fontFamily: fontFamilies.bold,
                        },
                      ]}
                    >
                      Sleep Timer
                    </Text>
                    <Text
                      style={[
                        styles.modalSubtitle,
                        {
                          color: theme.colors.onSurfaceVariant,
                          fontFamily: fontFamilies.regular,
                        },
                      ]}
                    >
                      Stop playing after selected time
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setShowTimerModal(false)}
                  style={[
                    styles.modalCloseButton,
                    { backgroundColor: theme.colors.surfaceContainer },
                  ]}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme.colors.onSurface}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScroll}
              >
                {/* Current Selection Display */}
                <View
                  style={[
                    styles.selectionDisplay,
                    {
                      backgroundColor: categoryColor + "12",
                      borderColor: categoryColor + "30",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.selectionValue,
                      { color: categoryColor, fontFamily: fontFamilies.bold },
                    ]}
                  >
                    {timerMinutes} minute{timerMinutes !== 1 ? "s" : ""}
                  </Text>
                  <Text
                    style={[
                      styles.selectionSubtext,
                      {
                        color: theme.colors.onSurfaceVariant,
                        fontFamily: fontFamilies.regular,
                      },
                    ]}
                  >
                    {Math.floor(timerMinutes / 60)}h {timerMinutes % 60}m
                  </Text>
                </View>

                {/* Slider Section */}
                <View
                  style={[
                    styles.sliderSection,
                    { backgroundColor: theme.colors.surfaceContainer },
                  ]}
                >
                  <View style={styles.sliderHeader}>
                    <Text
                      style={[
                        styles.sliderLabel,
                        {
                          color: theme.colors.onSurface,
                          fontFamily: fontFamilies.medium,
                        },
                      ]}
                    >
                      Custom Duration
                    </Text>
                    <Text
                      style={[
                        styles.sliderRange,
                        {
                          color: theme.colors.onSurfaceVariant,
                          fontFamily: fontFamilies.regular,
                        },
                      ]}
                    >
                      1 - 500 min
                    </Text>
                  </View>

                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={500}
                    value={timerMinutes}
                    onValueChange={setTimerMinutes}
                    minimumTrackTintColor={categoryColor}
                    maximumTrackTintColor={theme.colors.surfaceContainerHighest}
                    thumbTintColor={categoryColor}
                    step={1}
                  />

                  <View style={styles.sliderLabels}>
                    <Text
                      style={[
                        styles.sliderRangeLabel,
                        {
                          color: theme.colors.onSurfaceVariant,
                          fontFamily: fontFamilies.regular,
                        },
                      ]}
                    >
                      1 min
                    </Text>
                    <Text
                      style={[
                        styles.sliderRangeLabel,
                        {
                          color: theme.colors.onSurfaceVariant,
                          fontFamily: fontFamilies.regular,
                        },
                      ]}
                    >
                      500 min
                    </Text>
                  </View>
                </View>

                {/* Quick Select Buttons */}
                <View style={styles.quickSelectSection}>
                  <Text
                    style={[
                      styles.quickSelectTitle,
                      {
                        color: theme.colors.onSurface,
                        fontFamily: fontFamilies.bold,
                      },
                    ]}
                  >
                    Quick Select
                  </Text>

                  <View style={styles.quickSelectGrid}>
                    {[5, 10, 15, 30, 45, 60, 90, 120].map((minutes) => (
                      <TouchableOpacity
                        key={minutes}
                        onPress={() => setTimerMinutes(minutes)}
                        style={[
                          styles.quickSelectButton,
                          {
                            backgroundColor:
                              timerMinutes === minutes
                                ? categoryColor
                                : theme.colors.surfaceContainer,
                            borderColor:
                              timerMinutes === minutes
                                ? categoryColor
                                : theme.colors.outline + "30",
                            borderWidth: 1.5,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.quickSelectButtonText,
                            {
                              color:
                                timerMinutes === minutes
                                  ? "white"
                                  : theme.colors.onSurface,
                              fontFamily:
                                timerMinutes === minutes
                                  ? fontFamilies.bold
                                  : fontFamilies.medium,
                            },
                          ]}
                        >
                          {minutes}m
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Info Section */}
                <View
                  style={[
                    styles.infoSection,
                    { backgroundColor: categoryColor + "08" },
                  ]}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <Text
                    style={[
                      styles.infoText,
                      {
                        color: theme.colors.onSurfaceVariant,
                        fontFamily: fontFamilies.regular,
                      },
                    ]}
                  >
                    The audio will automatically stop when the timer reaches
                    zero
                  </Text>
                </View>
              </ScrollView>

              {/* Modal Actions */}
              <View style={styles.modalActions}>
                {timer > 0 && (
                  <TouchableOpacity
                    onPress={handleClearTimer}
                    style={[
                      styles.actionButton,
                      styles.clearButton,
                      { backgroundColor: "rgba(239, 68, 68, 0.15)" },
                    ]}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: "#EF4444", fontFamily: fontFamilies.medium },
                      ]}
                    >
                      Clear
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => handleSetTimer(timerMinutes)}
                  style={[
                    styles.actionButton,
                    styles.setButton,
                    {
                      backgroundColor: categoryColor,
                      shadowColor: categoryColor,
                      shadowOpacity: 0.4,
                      shadowRadius: 12,
                      elevation: 8,
                    },
                  ]}
                >
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: "white", fontFamily: fontFamilies.bold },
                    ]}
                  >
                    Set Timer
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: Platform.OS === "android" ? 20 : 0,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  frequencyDisplay: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 36,
    elevation: 12,
  },
  frequencyIcon: {
    fontSize: 100,
    textAlign: "center",
  },
  frequencyName: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  frequencyValue: {
    fontSize: 24,
    marginBottom: 16,
    letterSpacing: 1,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginBottom: 16,
  },
  frequencyCategory: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  frequencyDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: width - 40,
  },
  timerStatusContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  timerStatusContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  timerStatusText: {
    flex: 1,
  },
  timerStatusLabel: {
    fontSize: 14,
  },
  timerStatusValue: {
    fontSize: 12,
    marginTop: 2,
  },
  timerProgressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  timerProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    marginVertical: 24,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  volumeSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
  },
  timerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  timerButtonText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    maxHeight: height * 0.85,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 0,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  modalHeaderLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
  },
  modalSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  selectionDisplay: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: "center",
  },
  selectionValue: {
    fontSize: 28,
    marginBottom: 4,
  },
  selectionSubtext: {
    fontSize: 12,
  },
  sliderSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 14,
  },
  sliderRange: {
    fontSize: 12,
  },
  slider: {
    height: 50,
    marginVertical: 16,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderRangeLabel: {
    fontSize: 11,
  },
  quickSelectSection: {
    marginBottom: 24,
  },
  quickSelectTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  quickSelectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  quickSelectButton: {
    width: (width - 60) / 4,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickSelectButtonText: {
    fontSize: 13,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  setButton: {
    flex: 1.2,
  },
  actionButtonText: {
    fontSize: 14,
  },
});

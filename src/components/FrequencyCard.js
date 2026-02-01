import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  useTheme,
  getCategoryColor,
  fontFamilies,
  fontStyles,
} from "../utils/theme";
import { AnimatedCard, BouncyButton } from "./Animated";
import { favoritesManager } from "../utils/storage";

const { width } = Dimensions.get("window");

export const FrequencyCard = ({
  frequency,
  onPress,
  index = 0,
  isPlaying = false,
  style,
  showCategory = true,
}) => {
  const { theme, isDark } = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);

  const categoryColor = getCategoryColor(frequency.category, isDark);
  const gradientColors = isPlaying
    ? [categoryColor + "20", categoryColor + "08"]
    : [
        theme.colors.surfaceContainer + "60",
        theme.colors.surfaceContainer + "30",
      ];

  useEffect(() => {
    favoritesManager
      .isFavorite(frequency.id)
      .then(setIsFavorite)
      .catch(() => {});
  }, [frequency.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();

    setIsFavorite(!isFavorite);

    if (isFavorite) {
      favoritesManager.removeFromFavorites(frequency.id).catch(() => {
        setIsFavorite(true);
      });
    } else {
      favoritesManager.addToFavorites(frequency).catch(() => {
        setIsFavorite(false);
      });
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress(frequency);
    }
  };

  const FrequencyDisplay = ({ children }) => {
    return children;
  };

  return (
    <TouchableOpacity
      style={[styles.modernCard, style]}
      onPress={handlePress}
      activeOpacity={0.88}
      delayPressIn={0}
      delayPressOut={0}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.cardContainer,
          {
            borderColor: isPlaying
              ? categoryColor
              : theme.colors.outline + "15",
            borderWidth: isPlaying ? 2 : 1,
            shadowColor: isPlaying ? categoryColor : "#000",
            shadowOpacity: isPlaying ? 0.4 : 0.08,
            shadowRadius: isPlaying ? 16 : 8,
          },
        ]}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View
            style={[styles.categoryDot, { backgroundColor: categoryColor }]}
          />

          <TouchableOpacity
            style={[
              styles.favoriteButton,
              {
                backgroundColor: theme.colors.surfaceContainerHigh,
                borderColor: theme.colors.outline + "20",
                borderWidth: 1,
              },
            ]}
            onPress={toggleFavorite}
            activeOpacity={0.7}
            delayPressIn={0}
            delayPressOut={0}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={14}
              color={
                isFavorite
                  ? theme.colors.primary
                  : theme.colors.onSurfaceVariant
              }
            />
          </TouchableOpacity>
        </View>

        {/* Frequency Content */}
        <View style={styles.cardContent}>
          {/* Frequency Icon/Emoji */}
          <FrequencyDisplay>
            <LinearGradient
              colors={[categoryColor + "25", categoryColor + "08"]}
              style={[
                styles.iconContainer,
                {
                  borderColor: categoryColor + "35",
                  borderWidth: 1.5,
                  shadowColor: categoryColor,
                  shadowOpacity: 0.35,
                  shadowRadius: 14,
                },
              ]}
            >
              {frequency.image && frequency.image !== "" ? (
                <Text style={styles.frequencyIcon}>{frequency.image}</Text>
              ) : (
                <Ionicons
                  name="musical-notes"
                  size={32}
                  color={categoryColor}
                />
              )}
            </LinearGradient>
          </FrequencyDisplay>

          <FrequencyDisplay>
            <View style={styles.frequencySection}>
              <Text
                style={[
                  styles.frequencyValue,
                  {
                    color: theme.colors.onSurface,
                    fontFamily: fontFamilies.bold,
                  },
                ]}
              >
                {frequency.frequency}
              </Text>
              <Text
                style={[
                  styles.frequencyUnit,
                  {
                    color: theme.colors.onSurfaceVariant,
                    fontFamily: fontFamilies.medium,
                  },
                ]}
              >
                Hz
              </Text>
            </View>
          </FrequencyDisplay>

          <Text
            style={[
              styles.frequencyName,
              {
                color: theme.colors.onSurface,
                fontFamily: fontFamilies.medium,
              },
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {frequency.name}
          </Text>

          {showCategory && (
            <View style={styles.categoryContainer}>
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: categoryColor + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    { color: categoryColor, fontFamily: fontFamilies.bold },
                  ]}
                >
                  {frequency.category}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Play Indicator */}
        {isPlaying && (
          <View
            style={[styles.playIndicator, { backgroundColor: categoryColor }]}
          >
            <Ionicons name="play" size={11} color="white" />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modernCard: {
    elevation: 0,
  },
  cardContainer: {
    borderRadius: 28,
    padding: 16,
    height: 240,
    elevation: 8,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    elevation: 3,
  },
  favoriteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    elevation: 6,
  },
  frequencyIcon: {
    fontSize: 42,
    textAlign: "center",
  },
  frequencySection: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 10,
  },
  frequencyValue: {
    fontSize: 30,
    letterSpacing: 0.8,
  },
  frequencyUnit: {
    fontSize: 14,
    marginLeft: 3,
    opacity: 0.75,
  },
  frequencyName: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 19,
    letterSpacing: 0.25,
    height: 38,
  },
  categoryContainer: {
    alignItems: "center",
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  categoryText: {
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  playIndicator: {
    position: "absolute",
    top: 14,
    left: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});

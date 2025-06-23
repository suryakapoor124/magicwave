import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, getCategoryColor } from '../utils/theme';
import { AnimatedCard, BouncyButton, PulseView } from './Animated';
import { favoritesManager } from '../utils/storage';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with 16px padding

export const FrequencyCard = ({ 
  frequency, 
  onPress, 
  index = 0, 
  isPlaying = false,
  style,
  showCategory = true 
}) => {
  const { theme, isDark } = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const categoryColor = getCategoryColor(frequency.category, isDark);
  const gradientColors = isDark 
    ? [categoryColor + '40', categoryColor + '20']
    : [categoryColor + '30', categoryColor + '10'];

  useEffect(() => {
    checkFavoriteStatus();
  }, [frequency.id]);

  const checkFavoriteStatus = async () => {
    const favorite = await favoritesManager.isFavorite(frequency.id);
    setIsFavorite(favorite);
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    
    if (isFavorite) {
      await favoritesManager.removeFromFavorites(frequency.id);
    } else {
      await favoritesManager.addToFavorites(frequency);
    }
    
    setIsFavorite(!isFavorite);
  };

  const handlePress = () => {
    if (onPress) {
      onPress(frequency);
    }
  };

  const FrequencyDisplay = ({ children }) => {
    if (isPlaying) {
      return (
        <PulseView pulseScale={1.1} pulseDuration={800}>
          {children}
        </PulseView>
      );
    }
    return children;
  };

  return (
    <AnimatedCard
      style={[styles.card, { width: cardWidth }, style]}
      onPress={handlePress}
      index={index}
      delay={100}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.cardGradient,
          {
            borderColor: isPlaying ? categoryColor : theme.colors.outline,
            borderWidth: isPlaying ? 2 : 1,
          }
        ]}
      >
        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? '#FF6B6B' : theme.colors.onSurfaceVariant}
          />
        </TouchableOpacity>

        {/* Playing Indicator */}
        {isPlaying && (
          <View style={styles.playingIndicator}>
            <View style={[styles.playingDot, { backgroundColor: categoryColor }]} />
            <Text style={styles.playingText}>Playing</Text>
          </View>
        )}

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Frequency Icon */}
          <View style={styles.iconContainer}>
            <FrequencyDisplay>
              <Text style={styles.frequencyIcon}>{frequency.image}</Text>
            </FrequencyDisplay>
          </View>

          {/* Frequency Info */}
          <View style={styles.infoContainer}>
            <Text 
              style={[
                styles.frequencyName,
                { color: theme.colors.onSurface }
              ]}
              numberOfLines={2}
            >
              {frequency.name}
            </Text>
            
            <FrequencyDisplay>
              <Text 
                style={[
                  styles.frequencyValue,
                  { color: categoryColor }
                ]}
              >
                {frequency.frequency}Hz
              </Text>
            </FrequencyDisplay>
            
            <Text 
              style={[
                styles.frequencyDescription,
                { color: theme.colors.onSurfaceVariant }
              ]}
              numberOfLines={2}
            >
              {frequency.description}
            </Text>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            {/* Duration Badge */}
            <View style={styles.badgeContainer}>
              <View 
                style={[
                  styles.durationBadge,
                  { backgroundColor: categoryColor + '20' }
                ]}
              >
                <Text 
                  style={[
                    styles.durationText,
                    { color: categoryColor }
                  ]}
                >
                  {frequency.duration}m
                </Text>
              </View>
              
              {frequency.isRecommended && (
                <View 
                  style={[
                    styles.recommendedBadge,
                    { backgroundColor: theme.colors.primary + '20' }
                  ]}
                >
                  <Text 
                    style={[
                      styles.recommendedText,
                      { color: theme.colors.primary }
                    ]}
                  >
                    ⭐ Rec
                  </Text>
                </View>
              )}
            </View>

            {/* Category Badge */}
            {showCategory && (
              <View style={styles.categoryContainer}>
                <Text 
                  style={[
                    styles.categoryText,
                    { color: theme.colors.onSurfaceVariant }
                  ]}
                  numberOfLines={1}
                >
                  {frequency.category}
                </Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </AnimatedCard>
  );
};

// Large frequency card for player screen
export const LargeFrequencyCard = ({ 
  frequency, 
  isPlaying = false, 
  onPress, 
  style 
}) => {
  const { theme, isDark } = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const categoryColor = getCategoryColor(frequency.category, isDark);
  const gradientColors = isDark 
    ? [categoryColor + '60', categoryColor + '30', categoryColor + '10']
    : [categoryColor + '40', categoryColor + '20', categoryColor + '05'];

  useEffect(() => {
    checkFavoriteStatus();
  }, [frequency.id]);

  const checkFavoriteStatus = async () => {
    const favorite = await favoritesManager.isFavorite(frequency.id);
    setIsFavorite(favorite);
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      await favoritesManager.removeFromFavorites(frequency.id);
    } else {
      await favoritesManager.addToFavorites(frequency);
    }
    setIsFavorite(!isFavorite);
  };

  const FrequencyDisplay = ({ children }) => {
    if (isPlaying) {
      return (
        <PulseView pulseScale={1.05} pulseDuration={1000}>
          {children}
        </PulseView>
      );
    }
    return children;
  };

  return (
    <AnimatedCard style={[styles.largeCard, style]} onPress={onPress}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.largeCardGradient,
          {
            borderColor: isPlaying ? categoryColor : theme.colors.outline,
            borderWidth: isPlaying ? 3 : 1,
          }
        ]}
      >
        {/* Header */}
        <View style={styles.largeCardHeader}>
          <View style={styles.categoryBadge}>
            <Text style={[styles.categoryBadgeText, { color: categoryColor }]}>
              {frequency.category}
            </Text>
          </View>
          
          <BouncyButton onPress={toggleFavorite} style={styles.largeFavoriteButton}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite ? '#FF6B6B' : theme.colors.onSurfaceVariant}
            />
          </BouncyButton>
        </View>

        {/* Main Content */}
        <View style={styles.largeCardContent}>
          <FrequencyDisplay>
            <Text style={styles.largeFrequencyIcon}>{frequency.image}</Text>
          </FrequencyDisplay>
          
          <Text 
            style={[
              styles.largeFrequencyName,
              { color: theme.colors.onSurface }
            ]}
          >
            {frequency.name}
          </Text>
          
          <FrequencyDisplay>
            <Text 
              style={[
                styles.largeFrequencyValue,
                { color: categoryColor }
              ]}
            >
              {frequency.frequency}Hz
            </Text>
          </FrequencyDisplay>
          
          <Text 
            style={[
              styles.largeFrequencyDescription,
              { color: theme.colors.onSurfaceVariant }
            ]}
          >
            {frequency.description}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.largeCardFooter}>
          <View 
            style={[
              styles.largeDurationBadge,
              { backgroundColor: categoryColor + '20' }
            ]}
          >
            <Ionicons name="time-outline" size={16} color={categoryColor} />
            <Text 
              style={[
                styles.largeDurationText,
                { color: categoryColor }
              ]}
            >
              {frequency.duration} minutes
            </Text>
          </View>
          
          {isPlaying && (
            <View style={styles.largePlayingIndicator}>
              <PulseView>
                <View style={[styles.largePlayingDot, { backgroundColor: categoryColor }]} />
              </PulseView>
              <Text style={[styles.largePlayingText, { color: categoryColor }]}>
                Now Playing
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  // Small card styles
  card: {
    marginBottom: 16,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 16,
    height: 240,
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  frequencyIcon: {
    fontSize: 36,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  frequencyName: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
    minHeight: 16,
    maxHeight: 32,
  },
  frequencyValue: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
    height: 22,
  },
  frequencyDescription: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 4,
    minHeight: 14,
    maxHeight: 28,
  },
  bottomSection: {
    alignItems: 'center',
    paddingTop: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  durationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '600',
  },
  recommendedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  recommendedText: {
    fontSize: 8,
    fontWeight: '600',
  },
  categoryContainer: {
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 9,
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: '500',
  },
  playingIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  playingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  playingText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Large card styles
  largeCard: {
    marginBottom: 20,
  },
  largeCardGradient: {
    borderRadius: 24,
    padding: 24,
    minHeight: 300,
  },
  largeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  largeFavoriteButton: {
    padding: 8,
  },
  largeCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeFrequencyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  largeFrequencyName: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  largeFrequencyValue: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
  },
  largeFrequencyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
  largeCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  largeDurationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  largeDurationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  largePlayingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  largePlayingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  largePlayingText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

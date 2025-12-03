import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, getCategoryColor } from '../utils/theme';
import { AnimatedCard, BouncyButton } from './Animated';
import { favoritesManager } from '../utils/storage';

const { width } = Dimensions.get('window');

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
  const gradientColors = isPlaying 
    ? [categoryColor + '30', categoryColor + '10']
    : [theme.colors.surfaceContainer + '90', theme.colors.surfaceContainer + '50'];

  useEffect(() => {
    // Fast, non-blocking favorite check
    favoritesManager.isFavorite(frequency.id).then(setIsFavorite).catch(() => {});
  }, [frequency.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    
    // Optimistic UI update
    setIsFavorite(!isFavorite);
    
    // Background operation
    if (isFavorite) {
      favoritesManager.removeFromFavorites(frequency.id).catch(() => {
        setIsFavorite(true); // Revert on error
      });
    } else {
      favoritesManager.addToFavorites(frequency).catch(() => {
        setIsFavorite(false); // Revert on error
      });
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress(frequency);
    }
  };

  // Remove heavy PulseView animation
  const FrequencyDisplay = ({ children }) => {
    return children;
  };

  return (
    <TouchableOpacity
      style={[styles.modernCard, style]}
      onPress={handlePress}
      activeOpacity={0.9}
      delayPressIn={0}
      delayPressOut={0}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.cardContainer, { 
          borderColor: isPlaying ? categoryColor : theme.colors.outline + '20',
          borderWidth: isPlaying ? 1.5 : 1,
        }]}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
          
          <TouchableOpacity
            style={[styles.favoriteButton, { backgroundColor: theme.colors.surfaceContainerHigh }]}
            onPress={toggleFavorite}
            activeOpacity={0.8}
            delayPressIn={0}
            delayPressOut={0}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={16}
              color={isFavorite ? theme.colors.primary : theme.colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        </View>

        {/* Frequency Content */}
        <View style={styles.cardContent}>
          {/* Frequency Icon/Emoji */}
          <FrequencyDisplay>
            <LinearGradient
              colors={[categoryColor + '20', categoryColor + '05']}
              style={[styles.iconContainer, { 
                borderColor: categoryColor + '40',
                borderWidth: 1,
                shadowColor: categoryColor,
                shadowOpacity: 0.4,
                shadowRadius: 12,
              }]}
            >
              {frequency.image && frequency.image !== '' ? (
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
              <Text style={[styles.frequencyValue, { color: theme.colors.onSurface }]}>
                {frequency.frequency}
              </Text>
              <Text style={[styles.frequencyUnit, { color: theme.colors.onSurfaceVariant }]}>
                Hz
              </Text>
            </View>
          </FrequencyDisplay>
          
          <Text 
            style={[styles.frequencyName, { color: theme.colors.onSurface }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {frequency.name}
          </Text>
          
          {showCategory && (
            <View style={styles.categoryContainer}>
              <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {frequency.category}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Play Indicator */}
        {isPlaying && (
          <View style={[styles.playIndicator, { backgroundColor: categoryColor }]}>
            <Ionicons name="play" size={12} color="white" />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Modern Card Styles - Material Design 3
  modernCard: {
    // Width and margins controlled by parent
  },
  cardContainer: {
    borderRadius: 24,
    padding: 16,
    height: 240,
    elevation: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  frequencyIcon: {
    fontSize: 40,
    textAlign: 'center',
  },
  frequencySection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  frequencyValue: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  frequencyUnit: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
    opacity: 0.7,
  },
  frequencyName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
    letterSpacing: 0.2,
    height: 40,
  },
  categoryContainer: {
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  playIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

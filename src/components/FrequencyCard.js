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
  const gradientColors = isDark 
    ? [categoryColor + '40', categoryColor + '20']
    : [categoryColor + '30', categoryColor + '10'];

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
        colors={isPlaying ? [categoryColor + '20', categoryColor + '05'] : [theme.colors.surface, theme.colors.surface]}
        style={[styles.cardContainer, { 
          borderColor: isPlaying ? categoryColor : theme.colors.outline + '20',
          borderWidth: isPlaying ? 1.5 : 0.5,
        }]}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <LinearGradient
            colors={[categoryColor, categoryColor + '80']}
            style={styles.categoryIndicator}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          <TouchableOpacity
            style={[styles.favoriteButton, { backgroundColor: theme.colors.surfaceContainer }]}
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
            <View style={[styles.iconContainer, { backgroundColor: categoryColor + '20' }]}>
              {frequency.image && frequency.image !== '�' && frequency.image !== '' ? (
                <Text style={styles.frequencyIcon}>{frequency.image}</Text>
              ) : (
                <Ionicons 
                  name="musical-notes" 
                  size={32} 
                  color={categoryColor} 
                />
              )}
            </View>
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
    padding: 20,
    height: 220,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  frequencyIcon: {
    fontSize: 36,
    textAlign: 'center',
  },
  frequencySection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  frequencyValue: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.25,
  },
  frequencyUnit: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 3,
    opacity: 0.8,
  },
  frequencyName: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  categoryContainer: {
    alignItems: 'center',
    marginTop: 6,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  playIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
});

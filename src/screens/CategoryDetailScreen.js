import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, getCategoryColor } from '../utils/theme';
import { frequencyCategories } from '../data/frequencies';
import { FrequencyCard } from '../components/FrequencyCard';
import { useAudioContext } from '../contexts/AudioContext';
import { favoritesManager } from '../utils/storage';
import { LoadingSpinner } from '../components/Animated';

const { width } = Dimensions.get('window');

export const CategoryDetailScreen = ({ navigation, route }) => {
  const { category } = route.params;
  const { theme, isDark } = useTheme();
  const { playFrequency, currentFrequency, isPlaying } = useAudioContext();
  const [frequencies, setFrequencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryColor = getCategoryColor(category, isDark);
  const categoryData = frequencyCategories[category];

  useEffect(() => {
    loadFrequencies();
  }, [category]);

  const loadFrequencies = async () => {
    setIsLoading(true);
    try {
      if (categoryData) {
        const freqList = categoryData.frequencies.map(freq => ({
          ...freq,
          category: category,
        }));
        setFrequencies(freqList);
      }
    } catch (error) {
      console.error('Error loading frequencies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFrequencyPress = (frequency) => {
    playFrequency(frequency);
    favoritesManager.addToRecent(frequency).catch(() => {});
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner size="large" color={categoryColor} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: theme.colors.surfaceContainerHigh }]}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          {category}
        </Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner for Category */}
        <LinearGradient
          colors={[categoryColor, categoryColor + '80']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{category}</Text>
            <Text style={styles.heroSubtitle}>
              {frequencies.length} Tracks • {categoryData?.description || 'Curated frequencies for you'}
            </Text>
          </View>
          <Ionicons name="musical-notes" size={80} color="rgba(255,255,255,0.2)" style={styles.heroIcon} />
        </LinearGradient>

        <View style={styles.listContainer}>
          {frequencies.map((frequency, index) => (
            <FrequencyCard
              key={`${frequency.id}-${frequency.category}`}
              frequency={frequency}
              onPress={handleFrequencyPress}
              index={index}
              isPlaying={currentFrequency?.id === frequency.id && isPlaying}
              style={styles.cardStyle}
              showCategory={false}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
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
  scrollContent: {
    paddingBottom: 100,
  },
  heroBanner: {
    margin: 20,
    marginTop: 0,
    padding: 24,
    borderRadius: 24,
    height: 160,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  heroContent: {
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  heroIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  listContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardStyle: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
});

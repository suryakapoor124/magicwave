import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, getCategoryColor } from '../utils/theme';
import { useAudioContext } from '../contexts/AudioContext';
import { frequencyCategories, popularFrequencies } from '../data/frequencies';
import { FrequencyCard } from '../components/FrequencyCard';
import { AnimatedCard, BouncyButton, PulseView, LoadingSpinner } from '../components/Animated';
import { HeadphonePopup } from '../components/HeadphonePopup';
import { MeditationLogo } from '../components/MeditationLogo';
import { favoritesManager, settingsManager } from '../utils/storage';
import { audioEngine, AudioUtils } from '../utils/audio';

const { width, height } = Dimensions.get('window');

export const HomeScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { playFrequency, currentFrequency, isPlaying } = useAudioContext();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [frequencies, setFrequencies] = useState([]);
  const [showHeadphonePopup, setShowHeadphonePopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const scrollViewRef = useRef(null);

  const categories = ['All', ...Object.keys(frequencyCategories)];

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    loadFrequencies();
  }, [selectedCategory]);

  const initializeApp = async () => {
    setIsLoading(true);
    
    try {
      // Initialize storage managers
      await favoritesManager.initialize();
      await settingsManager.initialize();
      
      // Check if we should show headphone popup
      const showHeadphoneWarning = await settingsManager.getSetting('showHeadphoneWarning');
      if (showHeadphoneWarning !== false) {
        setShowHeadphonePopup(true);
      }
      
      // Load initial frequencies
      await loadFrequencies();
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFrequencies = async () => {
    try {
      let freqList = [];
      
      if (selectedCategory === 'All') {
        // Load all frequencies from all categories
        Object.entries(frequencyCategories).forEach(([categoryName, categoryData]) => {
          categoryData.frequencies.forEach(freq => {
            freqList.push({ ...freq, category: categoryName });
          });
        });
        
        // Add popular frequencies at the top
        const popularWithCategory = popularFrequencies.map(freq => ({
          ...freq,
          isPopular: true,
        }));
        
        freqList = [...popularWithCategory, ...freqList];
      } else {
        // Load frequencies from selected category
        const categoryData = frequencyCategories[selectedCategory];
        if (categoryData) {
          freqList = categoryData.frequencies.map(freq => ({
            ...freq,
            category: selectedCategory,
          }));
        }
      }
      
      setFrequencies(freqList);
    } catch (error) {
      console.error('Error loading frequencies:', error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    
    // Scroll to top when category changes
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const handleFrequencyPress = async (frequency) => {
    try {
      // Use audio context to play frequency
      await playFrequency(frequency);
      
      // Add to recent
      await favoritesManager.addToRecent(frequency);
    } catch (error) {
      console.error('Error handling frequency press:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFrequencies();
    setRefreshing(false);
  };

  const navigateToFavorites = () => {
    navigation.navigate('Favorites');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const navigateToSearch = () => {
    navigation.navigate('Search');
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        {/* Top Bar with App Name and About Button */}
        <View style={styles.topBar}>
          <View style={styles.greetingSection}>
            <Text style={[styles.greeting, { color: theme.colors.onSurface }]}>
              MagicWave
            </Text>
          </View>
          
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              onPress={toggleTheme}
              style={[styles.headerButton, { backgroundColor: theme.colors.surfaceVariant }]}
            >
              <Ionicons 
                name={isDark ? 'sunny-outline' : 'moon-outline'} 
                size={22} 
                color={theme.colors.onSurface} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate('About')}
              style={[styles.headerButton, { backgroundColor: theme.colors.surfaceVariant }]}
            >
              <Ionicons name="information-circle-outline" size={22} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick access tiles (Spotify-style) */}
        <View style={styles.quickAccess}>
          <TouchableOpacity 
            style={[styles.quickTile, { backgroundColor: theme.colors.surfaceContainer }]}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Ionicons name="heart" size={16} color={theme.colors.primary} />
            <Text style={[styles.quickTileText, { color: theme.colors.onSurface }]}>
              Liked Frequencies
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickTile, { backgroundColor: theme.colors.surfaceContainer }]}
            onPress={() => setSelectedCategory('Chill Vibes Only')}
          >
            <Text style={styles.quickTileEmoji}>🌊</Text>
            <Text style={[styles.quickTileText, { color: theme.colors.onSurface }]}>
              Chill Vibes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickTile, { backgroundColor: theme.colors.surfaceContainer }]}
            onPress={() => setSelectedCategory('Deep Sleep Ops')}
          >
            <Text style={styles.quickTileEmoji}>🌙</Text>
            <Text style={[styles.quickTileText, { color: theme.colors.onSurface }]}>
              Sleep Sounds
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickTile, { backgroundColor: theme.colors.surfaceContainer }]}
            onPress={() => setSelectedCategory('Brain Gym')}
          >
            <Text style={styles.quickTileEmoji}>🧠</Text>
            <Text style={[styles.quickTileText, { color: theme.colors.onSurface }]}>
              Focus Mode
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCategoryTabs = () => (
    <View style={styles.categoryContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category;
          const categoryColor = category === 'All' 
            ? theme.colors.primary 
            : getCategoryColor(category, isDark);
          
          return (
            <BouncyButton
              key={category}
              onPress={() => handleCategorySelect(category)}
              style={[
                styles.categoryTab,
                {
                  backgroundColor: isSelected 
                    ? categoryColor 
                    : theme.colors.surfaceVariant,
                  borderColor: categoryColor,
                  borderWidth: isSelected ? 0 : 1,
                }
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: isSelected 
                      ? 'white' 
                      : theme.colors.onSurfaceVariant,
                    fontWeight: isSelected ? '600' : '500',
                  }
                ]}
              >
                {category}
              </Text>
            </BouncyButton>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderCurrentlyPlaying = () => {
    // Removed - using bottom playback bar instead
    return null;
  };

  const renderFrequencyGrid = () => (
    <View style={styles.frequencyGrid}>
      {frequencies.map((frequency, index) => (
        <FrequencyCard
          key={`${frequency.id}-${frequency.category}`}
          frequency={frequency}
          onPress={handleFrequencyPress}
          index={index}
          isPlaying={currentFrequency?.id === frequency.id && isPlaying}
          style={styles.frequencyCard}
        />
      ))}
    </View>
  );

  const renderEmptyState = () => (
    <AnimatedCard style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🎵</Text>
      <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
        No frequencies found
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
        Try selecting a different category
      </Text>
    </AnimatedCard>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'} 
          backgroundColor={theme.colors.background} 
        />
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>
            Loading MagicWave...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background} 
      />
      
      {/* Extra padding for status bar */}
      <View style={styles.statusBarSpacer} />
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {renderHeader()}
        {renderCategoryTabs()}
        {renderCurrentlyPlaying()}
        
        {frequencies.length > 0 ? renderFrequencyGrid() : renderEmptyState()}
      </ScrollView>
      
      <HeadphonePopup
        visible={showHeadphonePopup}
        onClose={() => setShowHeadphonePopup(false)}
        onContinue={() => setShowHeadphonePopup(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarSpacer: {
    height: 10, // Extra padding for status bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150, // Increased for playback bar
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAccess: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  quickTile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: (width - 64) / 2,
    height: 60,
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 12,
  },
  quickTileEmoji: {
    fontSize: 20,
  },
  quickTileText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
  },
  nowPlayingContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  nowPlaying: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  nowPlayingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nowPlayingIcon: {
    fontSize: 24,
  },
  nowPlayingInfo: {
    flex: 1,
  },
  nowPlayingName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  nowPlayingFreq: {
    fontSize: 12,
    fontWeight: '500',
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  frequencyCard: {
    width: (width - 56) / 2, // 2 columns with padding
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

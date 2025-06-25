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
  Platform,
  Image,
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

  const handleFrequencyPress = (frequency) => {
    // Non-blocking frequency play for instant UI response
    playFrequency(frequency);
    
    // Add to recent in background (non-blocking)
    favoritesManager.addToRecent(frequency).catch(() => {});
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
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        {/* Modern Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/magicwave.jpg')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.brandContent}>
              <Text style={[styles.appTitle, { color: theme.colors.onSurface }]}>
                MagicWave
              </Text>
              <Text style={[styles.appSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                Frequency Therapy
              </Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={toggleTheme}
              style={[styles.actionButton, { backgroundColor: theme.colors.surfaceContainer }]}
            >
              <Ionicons 
                name={isDark ? 'sunny' : 'moon'} 
                size={20} 
                color={theme.colors.onSurface} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate('About')}
              style={[styles.actionButton, { backgroundColor: theme.colors.surfaceContainer }]}
            >
              <Ionicons name="person-circle-outline" size={20} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Professional Quick Access Grid */}
        <View style={styles.quickAccessGrid}>
          <TouchableOpacity 
            style={[styles.quickAccessCard, { backgroundColor: theme.colors.surfaceContainer }]}
            onPress={() => navigation.navigate('Favorites')}
          >
            <LinearGradient
              colors={[theme.colors.primary + '20', theme.colors.primary + '10']}
              style={styles.quickIconContainer}
            >
              <Ionicons name="heart" size={16} color={theme.colors.primary} />
            </LinearGradient>
            <Text style={[styles.quickAccessText, { color: theme.colors.onSurface }]}>
              Favorites
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickAccessCard, { backgroundColor: theme.colors.surfaceContainer }]}
            onPress={() => setSelectedCategory('Chill Vibes Only')}
          >
            <LinearGradient
              colors={[theme.colors.secondary + '20', theme.colors.secondary + '10']}
              style={styles.quickIconContainer}
            >
              <Text style={styles.quickAccessEmoji}>🌊</Text>
            </LinearGradient>
            <Text style={[styles.quickAccessText, { color: theme.colors.onSurface }]}>
              Chill
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickAccessCard, { backgroundColor: theme.colors.surfaceContainer }]}
            onPress={() => setSelectedCategory('Deep Sleep Ops')}
          >
            <LinearGradient
              colors={[theme.colors.tertiary + '20', theme.colors.tertiary + '10']}
              style={styles.quickIconContainer}
            >
              <Text style={styles.quickAccessEmoji}>🌙</Text>
            </LinearGradient>
            <Text style={[styles.quickAccessText, { color: theme.colors.onSurface }]}>
              Sleep
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickAccessCard, { backgroundColor: theme.colors.surfaceContainer }]}
            onPress={() => setSelectedCategory('Brain Gym')}
          >
            <LinearGradient
              colors={[theme.colors.accent + '20', theme.colors.accent + '10']}
              style={styles.quickIconContainer}
            >
              <Text style={styles.quickAccessEmoji}>🧠</Text>
            </LinearGradient>
            <Text style={[styles.quickAccessText, { color: theme.colors.onSurface }]}>
              Focus
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCategoryTabs = () => (
    <View style={[styles.categorySection, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Browse Categories
      </Text>
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
            <TouchableOpacity
              key={category}
              onPress={() => handleCategorySelect(category)}
              style={[
                styles.modernCategoryChip,
                {
                  backgroundColor: isSelected 
                    ? categoryColor 
                    : theme.colors.surfaceContainer,
                  borderColor: isSelected ? categoryColor : 'transparent',
                  borderWidth: 1,
                }
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color: isSelected 
                      ? 'white' 
                      : theme.colors.onSurface,
                    fontWeight: isSelected ? '600' : '500',
                  }
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
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
    <View style={styles.contentSection}>
      <View style={styles.frequenciesGrid}>
        {frequencies.map((frequency, index) => (
          <FrequencyCard
            key={`${frequency.id}-${frequency.category}`}
            frequency={frequency}
            onPress={handleFrequencyPress}
            index={index}
            isPlaying={currentFrequency?.id === frequency.id && isPlaying}
            style={styles.frequencyCardStyle}
          />
        ))}
      </View>
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
    height: Platform.OS === 'ios' ? 0 : 20, // Adaptive status bar spacing
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
    letterSpacing: 0.15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150, // Space for playback bar
  },
  
  // Modern Header Styles
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brandContent: {
    flex: 1,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.25,
  },
  appSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
    letterSpacing: 0.1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  // Quick Access Grid
  quickAccessGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAccessCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  quickAccessEmoji: {
    fontSize: 16,
  },
  
  // Category Section
  categorySection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.15,
  },
  categoryScroll: {
    paddingHorizontal: 4,
    gap: 8,
  },
  modernCategoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  
  // Content Section
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  frequenciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  frequencyCardStyle: {
    width: (width - 48) / 2, // 2-column grid with proper spacing
    marginBottom: 16,
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
});
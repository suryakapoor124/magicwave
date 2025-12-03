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
import { MeditationLogo } from '../components/MeditationLogo';
import { favoritesManager, settingsManager } from '../utils/storage';
import { audioEngine, AudioUtils } from '../utils/audio';

const { width, height } = Dimensions.get('window');

export const HomeScreen = ({ navigation, route }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { playFrequency, currentFrequency, isPlaying } = useAudioContext();
  const [frequencies, setFrequencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef(null);

  // Handle category selection from other tabs if needed
  const selectedCategoryParam = route.params?.selectedCategory;

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (selectedCategoryParam) {
      loadFrequencies(selectedCategoryParam);
    } else {
      loadFrequencies('All');
    }
  }, [selectedCategoryParam]);

  const initializeApp = async () => {
    setIsLoading(true);
    try {
      await favoritesManager.initialize();
      await settingsManager.initialize();
      await loadFrequencies('All');
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFrequencies = async (category) => {
    try {
      let freqList = [];
      if (category === 'All' || !category) {
        // Load popular and random mix for Home
        const popularWithCategory = popularFrequencies.map(freq => ({
          ...freq,
          isPopular: true,
        }));
        
        // Get some random ones for "Surprise Me"
        const allFreqs = [];
        Object.entries(frequencyCategories).forEach(([catName, catData]) => {
          catData.frequencies.forEach(freq => {
            allFreqs.push({ ...freq, category: catName });
          });
        });
        
        // Shuffle for variety
        const shuffled = allFreqs.sort(() => 0.5 - Math.random()).slice(0, 10);
        freqList = [...popularWithCategory, ...shuffled];
      } else {
        const categoryData = frequencyCategories[category];
        if (categoryData) {
          freqList = categoryData.frequencies.map(freq => ({
            ...freq,
            category: category,
          }));
        }
      }
      setFrequencies(freqList);
    } catch (error) {
      console.error('Error loading frequencies:', error);
    }
  };

  const handleFrequencyPress = (frequency) => {
    playFrequency(frequency);
    favoritesManager.addToRecent(frequency).catch(() => {});
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFrequencies(selectedCategoryParam || 'All');
    setRefreshing(false);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.greeting, { color: theme.colors.onSurfaceVariant }]}>
            Welcome back,
          </Text>
          <Text style={[styles.appTitle, { color: theme.colors.onSurface }]}>
            MagicWave
          </Text>
        </View>
        <TouchableOpacity 
          onPress={toggleTheme}
          style={[styles.themeButton, { backgroundColor: theme.colors.surfaceContainerHigh }]}
        >
          <Ionicons 
            name={isDark ? 'sunny' : 'moon'} 
            size={20} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDidYouKnow = () => (
    <View style={styles.factContainer}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.factCard}
      >
        <View style={styles.factHeader}>
          <Ionicons name="bulb" size={24} color="white" />
          <Text style={styles.factLabel}>Did You Know?</Text>
        </View>
        <Text style={styles.factText}>
          Listening to specific frequencies can influence your emotional state by up to 40%, helping to reduce anxiety and improve focus naturally.
        </Text>
      </LinearGradient>
    </View>
  );

  const renderSurpriseMe = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Daily Mix
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {frequencies.slice(0, 5).map((freq, index) => (
          <FrequencyCard
            key={`surprise-${freq.id}`}
            frequency={freq}
            onPress={handleFrequencyPress}
            isPlaying={currentFrequency?.id === freq.id && isPlaying}
            style={styles.horizontalCard}
            showCategory={false}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderFrequencyGrid = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Trending Now
      </Text>
      <View style={styles.frequenciesGrid}>
        {frequencies.slice(5).map((frequency, index) => (
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

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.colors.primary} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {renderDidYouKnow()}
        {renderSurpriseMe()}
        {renderFrequencyGrid()}
      </ScrollView>
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
    paddingVertical: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButtonWrapper: {
    marginRight: 4,
  },
  modernCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minHeight: 48,
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
  // New Styles
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  factContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  factCard: {
    padding: 20,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  factLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  factText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    opacity: 0.95,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  horizontalCard: {
    width: width * 0.7,
  },
});
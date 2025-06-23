import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Share,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { useAudioContext } from '../contexts/AudioContext';
import { FrequencyCard } from '../components/FrequencyCard';
import { AnimatedCard, BouncyButton, LoadingSpinner } from '../components/Animated';
import { favoritesManager, StorageUtils } from '../utils/storage';
import { popularFrequencies } from '../data/frequencies';

export const FavoritesScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { playFrequency, currentFrequency, isPlaying } = useAudioContext();
  const [favorites, setFavorites] = useState({ recommended: [], userFavorites: [], all: [] });
  const [recent, setRecent] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites', 'recent', 'stats'
  
  // Gesture handling for swipe navigation with 60fps optimization
  const translateX = useSharedValue(0);
  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.translateX = translateX.value;
    },
    onActive: (event, context) => {
      // Only handle horizontal gestures, ignore if user is scrolling vertically
      if (Math.abs(event.translationY) > Math.abs(event.translationX)) {
        return;
      }
      translateX.value = context.translateX + event.translationX;
    },
    onEnd: (event) => {
      // Only trigger navigation if it's a clear horizontal swipe
      if (Math.abs(event.translationY) > Math.abs(event.translationX)) {
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
          mass: 1,
        });
        return;
      }
      
      const threshold = 100;
      const velocity = event.velocityX;
      
      if (velocity > 1000 || event.translationX > threshold) {
        // Swipe right - go back
        runOnJS(navigation.goBack)();
      } else {
        // Snap back with smooth spring animation
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
          mass: 1,
        });
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [favoriteData, recentData, statsData] = await Promise.all([
        favoritesManager.getFavorites(),
        favoritesManager.getRecent(),
        favoritesManager.getStats(),
      ]);
      
      setFavorites(favoriteData);
      setRecent(recentData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading favorites data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleFrequencyPress = async (frequency) => {
    try {
      // Use audio context to play frequency directly
      await playFrequency(frequency);
      await favoritesManager.addToRecent(frequency);
    } catch (error) {
      console.error('Error handling frequency press:', error);
    }
  };

  const handleRemoveFromFavorites = async (frequencyId) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this frequency from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await favoritesManager.removeFromFavorites(frequencyId);
            await loadData();
          },
        },
      ]
    );
  };

  const handleClearRecent = async () => {
    Alert.alert(
      'Clear Recent',
      'Are you sure you want to clear all recent frequencies?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await favoritesManager.clearRecent();
            await loadData();
          },
        },
      ]
    );
  };

  const handleExportFavorites = async () => {
    try {
      const exportData = await favoritesManager.exportFavorites();
      
      await Share.share({
        message: 'MagicWave Frequencies Export',
        title: 'My Favorite Frequencies',
        url: `data:application/json;base64,${btoa(exportData)}`,
      });
    } catch (error) {
      console.error('Error exporting favorites:', error);
      Alert.alert('Export Failed', 'Could not export favorites');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <BouncyButton onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
        </BouncyButton>
        
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Favorites
        </Text>
        
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
          
          <BouncyButton onPress={handleExportFavorites} style={styles.exportButton}>
            <Ionicons name="share-outline" size={24} color={theme.colors.onSurface} />
          </BouncyButton>
        </View>
      </View>
      
      <Text style={[styles.headerSubtitle, { color: theme.colors.onSurfaceVariant }]}>
        Your saved frequencies and recent plays
      </Text>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabScroll}
      >
        {[
          { id: 'favorites', label: 'Favorites', icon: 'heart' },
          { id: 'recent', label: 'Recent', icon: 'time' },
          { id: 'stats', label: 'Stats', icon: 'analytics' },
        ].map((tab) => (
          <BouncyButton
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[
              styles.tab,
              {
                backgroundColor: activeTab === tab.id 
                  ? theme.colors.primary 
                  : theme.colors.surfaceVariant,
              }
            ]}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={activeTab === tab.id ? 'white' : theme.colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === tab.id 
                    ? 'white' 
                    : theme.colors.onSurfaceVariant,
                }
              ]}
            >
              {tab.label}
            </Text>
          </BouncyButton>
        ))}
      </ScrollView>
    </View>
  );

  const renderFavoritesTab = () => (
    <View style={styles.tabContent}>
      {/* Recommended Section */}
      {favorites.recommended.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              ⭐ Recommended
            </Text>
            <View style={[styles.badge, { backgroundColor: theme.colors.primary + '20' }]}>
              <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
                {favorites.recommended.length}
              </Text>
            </View>
          </View>
          
          <View style={styles.frequencyGrid}>
            {favorites.recommended.map((frequency, index) => (
              <FrequencyCard
                key={`rec-${frequency.id}`}
                frequency={frequency}
                onPress={handleFrequencyPress}
                index={index}
                style={styles.frequencyCard}
                isPlaying={currentFrequency?.id === frequency.id && isPlaying}
                isDark={isDark}
              />
            ))}
          </View>
        </View>
      )}

      {/* User Favorites Section */}
      {favorites.userFavorites.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              💖 My Favorites
            </Text>
            <View style={styles.sectionActions}>
              <View style={[styles.badge, { backgroundColor: theme.colors.secondary + '20' }]}>
                <Text style={[styles.badgeText, { color: theme.colors.secondary }]}>
                  {favorites.userFavorites.length}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.frequencyGrid}>
            {favorites.userFavorites.map((frequency, index) => (
              <FrequencyCard
                key={`fav-${frequency.id}`}
                frequency={frequency}
                onPress={handleFrequencyPress}
                index={index}
                style={styles.frequencyCard}
                isPlaying={currentFrequency?.id === frequency.id && isPlaying}
                isDark={isDark}
              />
            ))}
          </View>
        </View>
      )}

      {/* Empty State */}
      {favorites.all.length === 0 && (
        <AnimatedCard style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💫</Text>
          <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
            No favorites yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Heart frequencies to save them here
          </Text>
          <BouncyButton
            onPress={() => navigation.navigate('Home')}
            style={[styles.emptyButton, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={[styles.emptyButtonText, { color: theme.colors.onPrimary }]}>
              Explore Frequencies
            </Text>
          </BouncyButton>
        </AnimatedCard>
      )}
    </View>
  );

  const renderRecentTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          🕐 Recently Played
        </Text>
        {recent.length > 0 && (
          <BouncyButton onPress={handleClearRecent} style={styles.clearButton}>
            <Text style={[styles.clearButtonText, { color: theme.colors.error }]}>
              Clear All
            </Text>
          </BouncyButton>
        )}
      </View>

      {recent.length > 0 ? (
        <View style={styles.frequencyGrid}>
          {recent.map((frequency, index) => (
            <FrequencyCard
              key={`recent-${frequency.id}-${frequency.playedAt}`}
              frequency={frequency}
              onPress={handleFrequencyPress}
              index={index}
              style={styles.frequencyCard}
              isPlaying={currentFrequency?.id === frequency.id && isPlaying}
              isDark={isDark}
            />
          ))}
        </View>
      ) : (
        <AnimatedCard style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎵</Text>
          <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
            No recent frequencies
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Play some frequencies to see them here
          </Text>
        </AnimatedCard>
      )}
    </View>
  );

  const renderStatsTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        📊 Your Statistics
      </Text>
      
      {stats && (
        <View style={styles.statsContainer}>
          <AnimatedCard style={[styles.statCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
              {stats.favoritesCount}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Favorites
            </Text>
          </AnimatedCard>
          
          <AnimatedCard style={[styles.statCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
              {stats.totalPlayTimeMinutes}m
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Total Time
            </Text>
          </AnimatedCard>
          
          <AnimatedCard style={[styles.statCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={styles.statIcon}>📅</Text>
            <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
              {stats.recentCount}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Recent Plays
            </Text>
          </AnimatedCard>
          
          <AnimatedCard style={[styles.statCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={styles.statIcon}>🏷️</Text>
            <Text style={[styles.statValue, { color: theme.colors.onSurface }]} numberOfLines={1}>
              {stats.mostPlayedCategory || 'None'}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Top Category
            </Text>
          </AnimatedCard>
        </View>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'favorites':
        return renderFavoritesTab();
      case 'recent':
        return renderRecentTab();
      case 'stats':
        return renderStatsTab();
      default:
        return renderFavoritesTab();
    }
  };

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
            Loading favorites...
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
      
      <PanGestureHandler 
        onGestureEvent={panGestureEvent}
        activeOffsetX={[-20, 20]}
        failOffsetY={[-20, 20]}
      >
        <Animated.View style={[styles.container, animatedStyle]}>
          <ScrollView
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
            {renderTabs()}
            {renderTabContent()}
          </ScrollView>
        </Animated.View>
      </PanGestureHandler>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarSpacer: {
    height: 10,
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  exportButton: {
    padding: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    marginBottom: 20,
  },
  tabScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  frequencyCard: {
    width: '48%',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginVertical: 20,
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
    marginBottom: 20,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

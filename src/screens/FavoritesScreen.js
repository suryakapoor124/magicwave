import React, { useState, useEffect } from "react";
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
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, fontFamilies } from "../utils/theme";
import { useAudioContext } from "../contexts/AudioContext";
import { FrequencyCard } from "../components/FrequencyCard";
import { LoadingSpinner } from "../components/Animated";
import { favoritesManager } from "../utils/storage";

const { width } = Dimensions.get("window");

export const FavoritesScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { playFrequency, currentFrequency, isPlaying } = useAudioContext();
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("favorites");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [favoritesData, recentData] = await Promise.all([
        favoritesManager.getFavorites(),
        favoritesManager.getRecent(),
      ]);
      setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
      setRecent(Array.isArray(recentData) ? recentData : []);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavorites([]);
      setRecent([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleFrequencyPress = (frequency) => {
    playFrequency(frequency);
  };

  const handleRemoveFromFavorites = async (frequency) => {
    Alert.alert(
      "Remove from Favorites",
      `Are you sure you want to remove "${frequency.name}" from favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await favoritesManager.removeFromFavorites(frequency.id);
              setFavorites((prev) =>
                prev.filter((fav) => fav.id !== frequency.id),
              );
            } catch (error) {
              console.error("Error removing favorite:", error);
            }
          },
        },
      ],
    );
  };

  const handleClearRecent = async () => {
    Alert.alert(
      "Clear Recent",
      "Are you sure you want to clear all recent frequencies?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await favoritesManager.clearRecent();
              setRecent([]);
            } catch (error) {
              console.error("Error clearing recent:", error);
            }
          },
        },
      ],
    );
  };

  const renderFavoritesTab = () => {
    if (favorites.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💝</Text>
          <Text
            style={[
              styles.emptyTitle,
              {
                color: theme.colors.onSurface,
                fontFamily: fontFamilies.bold,
              },
            ]}
          >
            No Favorites Yet
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamilies.regular,
              },
            ]}
          >
            Add frequencies to your favorites by tapping the heart icon on any
            frequency card.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={[
              styles.emptyButton,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text
              style={[
                styles.emptyButtonText,
                { fontFamily: fontFamilies.bold },
              ]}
            >
              Explore Frequencies
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.onSurface,
                fontFamily: fontFamilies.bold,
              },
            ]}
          >
            Your Favorites
          </Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.colors.primary + "20" },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: theme.colors.primary,
                  fontFamily: fontFamilies.bold,
                },
              ]}
            >
              {favorites.length}
            </Text>
          </View>
        </View>

        <View style={styles.frequenciesGrid}>
          {favorites.map((frequency) => (
            <View key={frequency.id} style={styles.cardWrapper}>
              <FrequencyCard
                frequency={frequency}
                onPress={() => handleFrequencyPress(frequency)}
                isPlaying={currentFrequency?.id === frequency.id && isPlaying}
              />
              <TouchableOpacity
                onPress={() => handleRemoveFromFavorites(frequency)}
                style={[
                  styles.removeButton,
                  { backgroundColor: theme.colors.error + "20" },
                ]}
              >
                <Ionicons name="trash" size={16} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderRecentTab = () => {
    if (recent.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⏱️</Text>
          <Text
            style={[
              styles.emptyTitle,
              {
                color: theme.colors.onSurface,
                fontFamily: fontFamilies.bold,
              },
            ]}
          >
            No Recent History
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamilies.regular,
              },
            ]}
          >
            Your recently played frequencies will appear here.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.onSurface,
                fontFamily: fontFamilies.bold,
              },
            ]}
          >
            Recently Played
          </Text>
          <TouchableOpacity
            onPress={handleClearRecent}
            style={[
              styles.clearButton,
              { backgroundColor: theme.colors.primary + "20" },
            ]}
          >
            <Text
              style={[
                styles.clearButtonText,
                {
                  color: theme.colors.primary,
                  fontFamily: fontFamilies.medium,
                },
              ]}
            >
              Clear
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.frequenciesGrid}>
          {recent.map((frequency) => (
            <FrequencyCard
              key={frequency.id}
              frequency={frequency}
              onPress={() => handleFrequencyPress(frequency)}
              isPlaying={currentFrequency?.id === frequency.id && isPlaying}
            />
          ))}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <LinearGradient
          colors={[theme.colors.primary + "20", theme.colors.secondary + "10"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text
                style={[
                  styles.greeting,
                  {
                    color: theme.colors.onSurfaceVariant,
                    fontFamily: fontFamilies.regular,
                  },
                ]}
              >
                Collections
              </Text>
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: theme.colors.primary,
                    fontFamily: fontFamilies.bold,
                  },
                ]}
              >
                Your Frequencies
              </Text>
            </View>
            <TouchableOpacity
              onPress={toggleTheme}
              style={[
                styles.themeButton,
                {
                  backgroundColor: theme.colors.surfaceContainer,
                  borderColor: theme.colors.primary + "30",
                  borderWidth: 1.5,
                },
              ]}
            >
              <Ionicons
                name={isDark ? "sunny" : "moon"}
                size={18}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {[
            { id: "favorites", label: "Favorites", icon: "heart" },
            { id: "recent", label: "Recent", icon: "time" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    activeTab === tab.id
                      ? theme.colors.primary + "20"
                      : "transparent",
                  borderBottomColor:
                    activeTab === tab.id ? theme.colors.primary : "transparent",
                  borderBottomWidth: activeTab === tab.id ? 2 : 0,
                },
              ]}
            >
              <Ionicons
                name={tab.icon}
                size={18}
                color={
                  activeTab === tab.id
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant
                }
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab.id
                        ? theme.colors.primary
                        : theme.colors.onSurfaceVariant,
                    fontFamily: fontFamilies.bold,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === "favorites" && renderFavoritesTab()}
          {activeTab === "recent" && renderRecentTab()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: Platform.OS === "android" ? 40 : 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    marginBottom: 4,
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  headerTitle: {
    fontSize: 32,
    marginBottom: 0,
    letterSpacing: 0.3,
  },
  themeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 16,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    letterSpacing: 0.2,
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    letterSpacing: 0.3,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  clearButtonText: {
    fontSize: 12,
    letterSpacing: 0.2,
  },
  frequenciesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  cardWrapper: {
    width: (width - 52) / 2,
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
    letterSpacing: 0.2,
    opacity: 0.8,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  emptyButtonText: {
    color: "white",
    fontSize: 14,
    letterSpacing: 0.2,
  },
});

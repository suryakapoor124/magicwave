import React, { useState, useEffect, useRef } from "react";
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
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, getCategoryColor, fontFamilies } from "../utils/theme";
import { useAudioContext } from "../contexts/AudioContext";
import { frequencyCategories, popularFrequencies } from "../data/frequencies";
import { FrequencyCard } from "../components/FrequencyCard";
import { BouncyButton, LoadingSpinner } from "../components/Animated";
import { favoritesManager, settingsManager } from "../utils/storage";

const { width, height } = Dimensions.get("window");

export const HomeScreen = ({ navigation, route }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { playFrequency, currentFrequency, isPlaying } = useAudioContext();
  const [frequencies, setFrequencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const scrollViewRef = useRef(null);

  const selectedCategoryParam = route.params?.selectedCategory;

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (selectedCategoryParam) {
      loadFrequencies(selectedCategoryParam);
      setSelectedCategory(selectedCategoryParam);
    } else {
      loadFrequencies("All");
    }
  }, [selectedCategoryParam]);

  const initializeApp = async () => {
    setIsLoading(true);
    try {
      await favoritesManager.initialize();
      await settingsManager.initialize();
      await loadFrequencies("All");
    } catch (error) {
      console.error("Error initializing app:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFrequencies = async (category) => {
    try {
      let freqList = [];
      if (category === "All" || !category) {
        // Load ALL frequencies from all categories
        const allFreqs = [];
        Object.entries(frequencyCategories).forEach(([catName, catData]) => {
          catData.frequencies.forEach((freq) => {
            allFreqs.push({
              ...freq,
              category: catName,
              isPopular: popularFrequencies.some((pf) => pf.id === freq.id),
            });
          });
        });

        // Sort: popular first, then by frequency value
        freqList = allFreqs.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return a.frequency - b.frequency;
        });
      } else {
        const categoryData = frequencyCategories[category];
        if (categoryData) {
          freqList = categoryData.frequencies.map((freq) => ({
            ...freq,
            category: category,
            isPopular: popularFrequencies.some((pf) => pf.id === freq.id),
          }));
        }
      }
      setFrequencies(freqList);
    } catch (error) {
      console.error("Error loading frequencies:", error);
    }
  };

  const handleFrequencyPress = (frequency) => {
    playFrequency(frequency);
    favoritesManager.addToRecent(frequency).catch(() => {});
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFrequencies(selectedCategory);
    setRefreshing(false);
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    loadFrequencies(category);
  };

  const renderHeader = () => (
    <LinearGradient
      colors={[theme.colors.primary + "25", theme.colors.secondary + "12"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
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
            Welcome back
          </Text>
          <Text
            style={[
              styles.appTitle,
              { color: theme.colors.primary, fontFamily: fontFamilies.bold },
            ]}
          >
            MagicWave
          </Text>
          <Text
            style={[
              styles.tagline,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamilies.regular,
              },
            ]}
          >
            Discover healing frequencies
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
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.themeButtonGradient}
          >
            <Ionicons
              name={isDark ? "sunny" : "moon"}
              size={18}
              color="white"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const didYouKnowFacts = [
    {
      title: "Brain Entrainment",
      description:
        "Binaural beats at 40Hz can enhance cognitive function and focus by synchronizing brainwave patterns.",
      icon: "brain",
    },
    {
      title: "Healing Frequencies",
      description:
        "528 Hz is known as the 'Love Frequency' and may promote DNA repair and emotional balance.",
      icon: "heart",
    },
    {
      title: "Sleep Science",
      description:
        "Delta waves at 2-4 Hz frequencies are naturally produced during deep sleep and restoration.",
      icon: "moon",
    },
    {
      title: "Chakra Alignment",
      description:
        "Ancient frequencies like 432 Hz align with natural harmonic ratios found in nature.",
      icon: "sparkles",
    },
  ];

  const getRandomFact = () => {
    return didYouKnowFacts[Math.floor(Math.random() * didYouKnowFacts.length)];
  };

  const [currentFact] = useState(getRandomFact());

  const renderDidYouKnow = () => {
    return (
      <View style={styles.factContainer}>
        <LinearGradient
          colors={
            isDark
              ? [theme.colors.primary, theme.colors.tertiary]
              : [theme.colors.primary, theme.colors.secondary]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.factCard}
        >
          <View style={styles.factIconContainer}>
            <Ionicons name={currentFact.icon} size={28} color="white" />
          </View>
          <View style={styles.factContent}>
            <Text style={[styles.factTitle, { fontFamily: fontFamilies.bold }]}>
              {currentFact.title}
            </Text>
            <Text
              style={[styles.factText, { fontFamily: fontFamilies.regular }]}
            >
              {currentFact.description}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderCategoryButtons = () => {
    const categories = ["All", ...Object.keys(frequencyCategories)];

    return (
      <View style={styles.categorySection}>
        <Text
          style={[
            styles.categoryTitle,
            { color: theme.colors.onSurface, fontFamily: fontFamilies.bold },
          ]}
        >
          Categories
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            const categoryColor = getCategoryColor(category, isDark);

            return (
              <TouchableOpacity
                key={category}
                onPress={() => handleCategoryPress(category)}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: isSelected
                      ? categoryColor + "25"
                      : theme.colors.surfaceContainer,
                    borderColor: isSelected
                      ? categoryColor
                      : theme.colors.outline + "30",
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    {
                      color: isSelected
                        ? categoryColor
                        : theme.colors.onSurface,
                      fontFamily: isSelected
                        ? fontFamilies.bold
                        : fontFamilies.medium,
                    },
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
  };

  const renderTrendingSection = () => {
    const trendingFreqs = frequencies.filter((f) => f.isPopular).slice(0, 4);

    if (trendingFreqs.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="flame" size={24} color="#FF6B6B" />
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.onSurface, fontFamily: fontFamilies.bold },
            ]}
          >
            Trending Now
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingScroll}
        >
          {trendingFreqs.map((freq) => (
            <View
              key={`trending-${freq.id}`}
              style={styles.trendingCardWrapper}
            >
              <LinearGradient
                colors={[
                  getCategoryColor(freq.category, isDark) + "20",
                  getCategoryColor(freq.category, isDark) + "05",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.trendingCard}
              >
                <TouchableOpacity
                  onPress={() => handleFrequencyPress(freq)}
                  activeOpacity={0.8}
                  style={styles.trendingCardContent}
                >
                  <View style={styles.trendingBadge}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                  </View>
                  <Text style={[styles.trendingEmoji]}>{freq.image}</Text>
                  <Text
                    style={[
                      styles.trendingName,
                      {
                        color: theme.colors.onSurface,
                        fontFamily: fontFamilies.bold,
                      },
                    ]}
                  >
                    {freq.name}
                  </Text>
                  <Text
                    style={[
                      styles.trendingFreq,
                      {
                        color: getCategoryColor(freq.category, isDark),
                        fontFamily: fontFamilies.bold,
                      },
                    ]}
                  >
                    {freq.frequency}Hz
                  </Text>
                  <View
                    style={[
                      styles.trendingPlayButton,
                      {
                        backgroundColor: getCategoryColor(
                          freq.category,
                          isDark,
                        ),
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        currentFrequency?.id === freq.id && isPlaying
                          ? "pause-sharp"
                          : "play-sharp"
                      }
                      size={18}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderFrequenciesSection = () => {
    if (frequencies.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="search"
            size={48}
            color={theme.colors.onSurfaceVariant}
          />
          <Text
            style={[
              styles.emptyText,
              { color: theme.colors.onSurface, fontFamily: fontFamilies.bold },
            ]}
          >
            No frequencies found
          </Text>
        </View>
      );
    }

    const displayFreqs =
      selectedCategory === "All"
        ? frequencies.filter((f) => !f.isPopular)
        : frequencies;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="grid" size={24} color={theme.colors.primary} />
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.onSurface, fontFamily: fontFamilies.bold },
            ]}
          >
            {selectedCategory === "All" ? "All Frequencies" : selectedCategory}
          </Text>
          <Text
            style={[
              styles.frequencyCount,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamilies.regular,
              },
            ]}
          >
            ({displayFreqs.length})
          </Text>
        </View>
        <View style={styles.frequenciesGrid}>
          {displayFreqs.map((frequency, index) => (
            <FrequencyCard
              key={`${frequency.id}-${frequency.category}-${index}`}
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
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <LoadingSpinner size="large" color={theme.colors.primary} />
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
        ref={scrollViewRef}
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
        {renderHeader()}
        {renderDidYouKnow()}
        {renderTrendingSection()}
        {renderCategoryButtons()}
        {renderFrequenciesSection()}
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
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: Platform.OS === "android" ? 40 : 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  greeting: {
    fontSize: 13,
    marginBottom: 4,
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  appTitle: {
    fontSize: 32,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  tagline: {
    fontSize: 12,
    letterSpacing: 0.3,
    opacity: 0.7,
  },
  themeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  themeButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  factContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
  },
  factCard: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 24,
    alignItems: "flex-start",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  factIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    marginTop: 2,
  },
  factContent: {
    flex: 1,
  },
  factTitle: {
    fontSize: 16,
    color: "white",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  factText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 22,
    letterSpacing: 0.3,
    flex: 1,
  },
  frequencyCount: {
    fontSize: 14,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 18,
    marginBottom: 12,
    paddingHorizontal: 20,
    letterSpacing: 0.3,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
  trendingScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  trendingCardWrapper: {
    width: width * 0.85,
  },
  trendingCard: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  trendingCardContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  trendingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FFD700",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  trendingEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  trendingName: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  trendingFreq: {
    fontSize: 16,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  trendingPlayButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  frequenciesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 12,
  },
  frequencyCardStyle: {
    width: (width - 52) / 2,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

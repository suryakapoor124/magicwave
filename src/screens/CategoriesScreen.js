import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, getCategoryColor, fontFamilies } from "../utils/theme";
import { frequencyCategories } from "../data/frequencies";

const { width } = Dimensions.get("window");

const categoryIcons = {
  All: "apps",
  "Chill Vibes Only": "water",
  "Hindu Gods & Mantras": "flower",
  "Sacred Tasks": "book",
  "Deep Sleep Ops": "moon",
  "Zen Mode Activated": "leaf",
  "Fix Me Up Doc": "medkit",
  "Brain Gym": "school",
  "Third Eye Opened": "eye",
  "Cool Down Center": "snow",
  "Vibe Boost Station": "flash",
  "Mood Mechanics": "happy",
  "Mindfulness Mastery": "body",
  "Chakra Harmonics": "aperture",
  "Ancient Wisdom": "hourglass",
  "Breathwork Bliss": "infinite",
  "Alien Frequencies": "planet",
  "Headache Be Gone": "bandage",
  "Power-Up Mode": "battery-charging",
};

export const CategoriesScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const categories = Object.keys(frequencyCategories);

  const handleCategoryPress = (category) => {
    navigation.navigate("CategoryDetail", { category });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={[theme.colors.primary + "20", theme.colors.secondary + "10"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text
            style={[
              styles.headerTitle,
              {
                color: theme.colors.primary,
                fontFamily: fontFamilies.bold,
              },
            ]}
          >
            Explore
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamilies.regular,
              },
            ]}
          >
            Discover your perfect frequency
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {categories.map((category) => {
            const color = getCategoryColor(category, isDark);
            const icon = categoryIcons[category] || "list";
            const count = frequencyCategories[category].frequencies.length;

            return (
              <TouchableOpacity
                key={category}
                style={styles.cardWrapper}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[color + "20", color + "08"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.card,
                    {
                      borderColor: color + "30",
                      shadowColor: color,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[color, color + "80"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardIconContainer}
                  >
                    <Ionicons name={icon} size={36} color="white" />
                  </LinearGradient>

                  <View style={styles.cardContent}>
                    <Text
                      style={[
                        styles.cardTitle,
                        {
                          color: theme.colors.onSurface,
                          fontFamily: fontFamilies.bold,
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {category}
                    </Text>
                    <Text
                      style={[
                        styles.cardSubtitle,
                        {
                          color: theme.colors.onSurfaceVariant,
                          fontFamily: fontFamilies.regular,
                        },
                      ]}
                    >
                      {count} Frequencies
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.cardArrow,
                      { backgroundColor: color + "15" },
                    ]}
                  >
                    <Ionicons name="arrow-forward" size={18} color={color} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: Platform.OS === "android" ? 40 : 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  header: {
    paddingHorizontal: 0,
  },
  headerTitle: {
    fontSize: 36,
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    letterSpacing: 0.2,
    opacity: 0.8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  cardWrapper: {
    width: (width - 48) / 2,
    height: 200,
    borderRadius: 28,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  card: {
    flex: 1,
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    justifyContent: "space-between",
    elevation: 0,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 4,
  },
  cardContent: {
    flex: 1,
    justifyContent: "flex-start",
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
  cardArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
});

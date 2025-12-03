import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, getCategoryColor } from '../utils/theme';
import { frequencyCategories } from '../data/frequencies';

const { width } = Dimensions.get('window');

const categoryIcons = {
  'All': 'apps',
  'Chill Vibes Only': 'water',
  'Hindu Gods & Mantras': 'flower',
  'Sacred Tasks': 'book',
  'Deep Sleep Ops': 'moon',
  'Zen Mode Activated': 'leaf',
  'Fix Me Up Doc': 'medkit',
  'Brain Gym': 'school',
  'Third Eye Opened': 'eye',
  'Cool Down Center': 'snow',
  'Vibe Boost Station': 'flash',
  'Mood Mechanics': 'happy',
  'Mindfulness Mastery': 'body',
  'Chakra Harmonics': 'aperture',
  'Ancient Wisdom': 'hourglass',
  'Breathwork Bliss': 'infinite',
  'Alien Frequencies': 'planet',
  'Headache Be Gone': 'bandage',
  'Power-Up Mode': 'battery-charging',
};

export const CategoriesScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const categories = Object.keys(frequencyCategories);

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryDetail', { category });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Explore
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          Find your perfect frequency
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {categories.map((category, index) => {
            const color = getCategoryColor(category, isDark);
            const icon = categoryIcons[category] || 'list';
            const count = frequencyCategories[category].frequencies.length;

            return (
              <TouchableOpacity
                key={category}
                style={styles.cardWrapper}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={[color, color + '90']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                  <View style={styles.cardIconContainer}>
                    <Ionicons name={icon} size={32} color="white" />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {category}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                      {count} Tracks
                    </Text>
                  </View>
                  <View style={styles.cardDecoration} />
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.25,
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: (width - 48) / 2,
    marginBottom: 16,
    height: 160,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    zIndex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  cardDecoration: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});

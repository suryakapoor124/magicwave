import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { frequencyCategories } from '../data/frequencies';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [userPreference, setUserPreference] = useState(null); // null means follow system
  const [isLoading, setIsLoading] = useState(true);

  // Load user preference from storage
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const stored = await AsyncStorage.getItem('themePreference');
      if (stored !== null) {
        setUserPreference(stored);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemePreference = async (preference) => {
    try {
      if (preference === null) {
        await AsyncStorage.removeItem('themePreference');
      } else {
        await AsyncStorage.setItem('themePreference', preference);
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    let newPreference;
    if (userPreference === null) {
      // Currently following system, switch to opposite of system
      newPreference = systemColorScheme === 'dark' ? 'light' : 'dark';
    } else if (userPreference === 'dark') {
      newPreference = 'light';
    } else {
      newPreference = 'dark';
    }
    
    setUserPreference(newPreference);
    await saveThemePreference(newPreference);
  };

  // Determine actual theme to use
  const isDark = userPreference !== null ? userPreference === 'dark' : systemColorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  if (isLoading) {
    return null; // or a loading screen
  }

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDark, 
      toggleTheme,
      userPreference,
      systemColorScheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

// Function to get category color
export const getCategoryColor = (category, isDark) => {
  const categoryData = frequencyCategories[category];
  if (categoryData) {
    return isDark ? categoryData.darkColor : categoryData.color;
  }
  // Default color if category not found
  return isDark ? darkTheme.colors.primary : lightTheme.colors.primary;
};

// Modern Minimalistic Theme System with Warm Accents
export const lightTheme = {
  colors: {
    primary: '#6366F1', // Modern Indigo
    onPrimary: '#FFFFFF',
    primaryContainer: '#E0E7FF',
    onPrimaryContainer: '#312E81',
    
    secondary: '#F59E0B', // Warm Amber
    onSecondary: '#FFFFFF',
    secondaryContainer: '#FEF3C7',
    onSecondaryContainer: '#92400E',
    
    tertiary: '#EA580C', // Warm Orange
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FED7AA',
    onTertiaryContainer: '#9A3412',
    
    error: '#EF4444',
    onError: '#FFFFFF',
    errorContainer: '#FEE2E2',
    onErrorContainer: '#991B1B',
    
    background: '#FAFAFA',
    onBackground: '#1F2937',
    surface: '#FFFFFF',
    onSurface: '#1F2937',
    surfaceVariant: '#F1F5F9',
    onSurfaceVariant: '#64748B',
    
    outline: '#E2E8F0',
    outlineVariant: '#F1F5F9',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#1E293B',
    inverseOnSurface: '#F8FAFC',
    inversePrimary: '#818CF8',
    
    // Modern surfaces
    surfaceContainer: '#F8FAFC',
    surfaceContainerHigh: '#F1F5F9',
    surfaceContainerHighest: '#E2E8F0',
    
    // Accent colors
    accent: '#D97706', // Warm amber accent
    onAccent: '#FFFFFF',
    warning: '#F59E0B',
    onWarning: '#FFFFFF',
    golden: '#F59E0B', // Golden highlights
    onGolden: '#FFFFFF',
  }
};

export const darkTheme = {
  colors: {
    primary: '#818CF8', // Lighter Indigo for dark mode
    onPrimary: '#1E1B4B',
    primaryContainer: '#312E81',
    onPrimaryContainer: '#E0E7FF',
    
    secondary: '#FBBF24', // Warm Amber for dark mode
    onSecondary: '#451A03',
    secondaryContainer: '#92400E',
    onSecondaryContainer: '#FEF3C7',
    
    tertiary: '#FB923C', // Warm Orange for dark mode
    onTertiary: '#431407',
    tertiaryContainer: '#9A3412',
    onTertiaryContainer: '#FED7AA',
    
    error: '#F87171',
    onError: '#7F1D1D',
    errorContainer: '#991B1B',
    onErrorContainer: '#FECACA',
    
    background: '#0F172A',
    onBackground: '#F8FAFC',
    surface: '#1E293B',
    onSurface: '#F8FAFC',
    surfaceVariant: '#334155',
    onSurfaceVariant: '#CBD5E1',
    
    outline: '#475569',
    outlineVariant: '#334155',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#F8FAFC',
    inverseOnSurface: '#1E293B',
    inversePrimary: '#6366F1',
    
    // Dark surfaces
    surfaceContainer: '#334155',
    surfaceContainerHigh: '#475569',
    surfaceContainerHighest: '#64748B',
    
    // Accent colors for dark mode
    accent: '#FBBF24', // Warm amber accent for dark mode
    onAccent: '#451A03',
    warning: '#FBBF24',
    onWarning: '#78350F',
    golden: '#FBBF24', // Golden highlights for dark mode
    onGolden: '#451A03',
  }
};

// Create dynamic theme based on category
export const createCategoryTheme = (categoryColor, categoryDarkColor, isDark) => {
  const baseTheme = isDark ? darkTheme : lightTheme;
  
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: isDark ? categoryDarkColor : categoryColor,
      primaryContainer: isDark ? categoryDarkColor + '30' : categoryColor + '20',
      onPrimaryContainer: isDark ? categoryColor : categoryDarkColor,
    }
  };
};

// Typography system (Material You 3)
export const typography = {
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '400',
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '400',
    letterSpacing: 0,
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '400',
    letterSpacing: 0,
  },
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '400',
    letterSpacing: 0,
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '400',
    letterSpacing: 0,
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '400',
    letterSpacing: 0,
  },
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '500',
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.4,
  },
};

// Elevation system
export const elevation = {
  level0: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  level1: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  level2: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  level3: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  level4: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
  },
  level5: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.20,
    shadowRadius: 16,
    elevation: 5,
  },
};

// Motion system
export const motion = {
  easing: {
    standard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    emphasized: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    decelerated: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
    accelerated: 'cubic-bezier(0.4, 0.0, 1, 1.0)',
  },
  duration: {
    short1: 50,
    short2: 100,
    short3: 150,
    short4: 200,
    medium1: 250,
    medium2: 300,
    medium3: 350,
    medium4: 400,
    long1: 450,
    long2: 500,
    long3: 550,
    long4: 600,
    extraLong1: 700,
    extraLong2: 800,
    extraLong3: 900,
    extraLong4: 1000,
  },
};

// Shape system
export const shapes = {
  corner: {
    none: 0,
    extraSmall: 4,
    small: 8,
    medium: 12,
    large: 16,
    extraLarge: 28,
    full: 9999,
  },
};

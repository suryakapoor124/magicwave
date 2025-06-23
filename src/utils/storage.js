import AsyncStorage from '@react-native-async-storage/async-storage';
import { popularFrequencies, getAllFrequencies } from '../data/frequencies';

const FAVORITES_KEY = '@frequency_favorites';
const RECENT_KEY = '@frequency_recent';
const SETTINGS_KEY = '@app_settings';

export class FavoritesManager {
  constructor() {
    this.favorites = [];
    this.recent = [];
    this.initialized = false;
  }

  // Initialize favorites from storage
  async initialize() {
    if (this.initialized) return;
    
    try {
      await this.loadFavorites();
      await this.loadRecent();
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing favorites:', error);
      this.initialized = true;
    }
  }

  // Load favorites from storage
  async loadFavorites() {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        this.favorites = JSON.parse(storedFavorites);
      } else {
        // Initialize with popular frequencies if no favorites exist
        this.favorites = [...popularFrequencies];
        await this.saveFavorites();
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      this.favorites = [...popularFrequencies];
    }
  }

  // Save favorites to storage
  async saveFavorites() {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  // Add frequency to favorites
  async addToFavorites(frequency) {
    await this.initialize();
    
    const exists = this.favorites.find(fav => fav.id === frequency.id);
    if (!exists) {
      this.favorites.push(frequency);
      await this.saveFavorites();
      return true;
    }
    return false;
  }

  // Remove frequency from favorites
  async removeFromFavorites(frequencyId) {
    await this.initialize();
    
    const index = this.favorites.findIndex(fav => fav.id === frequencyId);
    if (index > -1) {
      this.favorites.splice(index, 1);
      await this.saveFavorites();
      return true;
    }
    return false;
  }

  // Check if frequency is in favorites
  async isFavorite(frequencyId) {
    await this.initialize();
    return this.favorites.some(fav => fav.id === frequencyId);
  }

  // Get all favorites
  async getFavorites() {
    await this.initialize();
    
    // Separate recommended from user favorites
    const recommended = this.favorites.filter(fav => fav.isRecommended);
    const userFavorites = this.favorites.filter(fav => !fav.isRecommended);
    
    return {
      recommended,
      userFavorites,
      all: this.favorites
    };
  }

  // Load recent frequencies
  async loadRecent() {
    try {
      const storedRecent = await AsyncStorage.getItem(RECENT_KEY);
      if (storedRecent) {
        this.recent = JSON.parse(storedRecent);
      }
    } catch (error) {
      console.error('Error loading recent:', error);
      this.recent = [];
    }
  }

  // Save recent frequencies
  async saveRecent() {
    try {
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(this.recent));
    } catch (error) {
      console.error('Error saving recent:', error);
    }
  }

  // Add frequency to recent
  async addToRecent(frequency) {
    await this.initialize();
    
    // Remove if already exists
    this.recent = this.recent.filter(recent => recent.id !== frequency.id);
    
    // Add to beginning
    this.recent.unshift({
      ...frequency,
      playedAt: new Date().toISOString()
    });
    
    // Keep only last 20
    this.recent = this.recent.slice(0, 20);
    
    await this.saveRecent();
  }

  // Get recent frequencies
  async getRecent() {
    await this.initialize();
    return this.recent;
  }

  // Clear all recent
  async clearRecent() {
    this.recent = [];
    await this.saveRecent();
  }

  // Get statistics
  async getStats() {
    await this.initialize();
    
    const allFrequencies = getAllFrequencies();
    const favoritesCount = this.favorites.length;
    const recentCount = this.recent.length;
    
    // Calculate most played category
    const categoryPlayCount = {};
    this.recent.forEach(freq => {
      const category = freq.category || 'Unknown';
      categoryPlayCount[category] = (categoryPlayCount[category] || 0) + 1;
    });
    
    const mostPlayedCategory = Object.entries(categoryPlayCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null;
    
    // Calculate total play time (estimate)
    const totalPlayTime = this.recent.reduce((total, freq) => {
      return total + (freq.duration || 30);
    }, 0);
    
    return {
      totalFrequencies: allFrequencies.length,
      favoritesCount,
      recentCount,
      mostPlayedCategory,
      totalPlayTimeMinutes: totalPlayTime,
      lastPlayedAt: this.recent[0]?.playedAt || null
    };
  }

  // Search frequencies
  async searchFrequencies(query) {
    const allFrequencies = getAllFrequencies();
    const lowercaseQuery = query.toLowerCase();
    
    return allFrequencies.filter(freq => 
      freq.name.toLowerCase().includes(lowercaseQuery) ||
      freq.description.toLowerCase().includes(lowercaseQuery) ||
      freq.frequency.toString().includes(query) ||
      freq.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Export favorites
  async exportFavorites() {
    await this.initialize();
    
    const data = {
      favorites: this.favorites,
      recent: this.recent,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(data, null, 2);
  }

  // Import favorites
  async importFavorites(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.favorites && Array.isArray(data.favorites)) {
        this.favorites = data.favorites;
        await this.saveFavorites();
      }
      
      if (data.recent && Array.isArray(data.recent)) {
        this.recent = data.recent;
        await this.saveRecent();
      }
      
      return true;
    } catch (error) {
      console.error('Error importing favorites:', error);
      return false;
    }
  }
}

// Settings Manager
export class SettingsManager {
  constructor() {
    this.settings = {
      theme: 'auto', // 'light', 'dark', 'auto'
      volume: 0.5,
      backgroundAudio: false,
      backgroundType: 'white-noise',
      hapticFeedback: true,
      autoPlay: false,
      defaultDuration: 30,
      showOnboarding: true,
    };
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(storedSettings) };
      }
      this.initialized = true;
    } catch (error) {
      console.error('Error loading settings:', error);
      this.initialized = true;
    }
  }

  async saveSettings() {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  async getSetting(key) {
    await this.initialize();
    return this.settings[key];
  }

  async setSetting(key, value) {
    await this.initialize();
    this.settings[key] = value;
    await this.saveSettings();
  }

  async getAllSettings() {
    await this.initialize();
    return { ...this.settings };
  }

  async resetSettings() {
    this.settings = {
      theme: 'auto',
      volume: 0.5,
      backgroundAudio: false,
      backgroundType: 'white-noise',
      hapticFeedback: true,
      autoPlay: false,
      defaultDuration: 30,
      showOnboarding: true,
    };
    await this.saveSettings();
  }
}

// Singleton instances
export const favoritesManager = new FavoritesManager();
export const settingsManager = new SettingsManager();

// Utility functions
export const StorageUtils = {
  // Clear all app data
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove([FAVORITES_KEY, RECENT_KEY, SETTINGS_KEY]);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  },

  // Get storage size
  async getStorageSize() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);
      
      let totalSize = 0;
      stores.forEach(([key, value]) => {
        if (key.startsWith('@frequency_') || key.startsWith('@app_')) {
          totalSize += value ? value.length : 0;
        }
      });
      
      return totalSize;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  },

  // Format storage size
  formatStorageSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Linking,
  ScrollView,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { AnimatedCard, BouncyButton } from '../components/Animated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const AboutScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const openLink = async (url, platform, appUrl = null) => {
    try {
      console.log(`Attempting to open ${platform} link: ${url}`);
      
      // For Instagram, try app first, then browser
      if (platform === 'Instagram' && appUrl) {
        try {
          const canOpenApp = await Linking.canOpenURL(appUrl);
          console.log(`Can open Instagram app: ${canOpenApp}`);
          
          if (canOpenApp) {
            await Linking.openURL(appUrl);
            console.log('Successfully opened Instagram app');
            return;
          }
        } catch (appError) {
          console.log('Instagram app failed, trying browser');
        }
      }
      
      // For all platforms, try to open the URL directly first
      try {
        await Linking.openURL(url);
        console.log(`Successfully opened ${platform} link`);
        return;
      } catch (directError) {
        console.log(`Direct URL failed for ${platform}, trying alternative methods`);
      }
      
      // If direct URL fails, try Android browser intent
      try {
        const cleanUrl = url.replace('https://', '').replace('http://', '');
        const browserIntent = `intent://${cleanUrl}#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end`;
        await Linking.openURL(browserIntent);
        console.log(`Opened ${platform} with browser intent`);
        return;
      } catch (intentError) {
        console.log(`Browser intent failed for ${platform}`);
      }
      
      // If all methods fail, show copy option
      Alert.alert(
        `Open ${platform}`,
        `Unable to open link automatically. Would you like to copy the URL to open it manually?`,
        [
          { 
            text: 'Copy Link', 
            onPress: async () => {
              await Clipboard.setStringAsync(url);
              Alert.alert('Link Copied', 'The link has been copied to your clipboard. You can paste it in your browser.');
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      
    } catch (error) {
      console.error(`Error opening ${platform} link:`, error);
      // Final fallback - copy option
      Alert.alert(
        'Link Error',
        `Unable to open link. Would you like to copy the URL?`,
        [
          { 
            text: 'Copy Link', 
            onPress: async () => {
              await Clipboard.setStringAsync(url);
              Alert.alert('Link Copied', 'The link has been copied to your clipboard.');
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const socialLinks = [
    {
      id: 'coffee',
      name: 'Buy Me a Coffee',
      icon: 'cafe-outline',
      url: 'https://coff.ee/suryanshkapoor',
      color: '#FF813F',
      gradient: ['#FF813F', '#FF6B35'],
      description: 'Support the development',
      subtitle: 'Help keep MagicWave growing',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'logo-instagram',
      url: 'https://www.instagram.com/isuryanshkapoor/',
      appUrl: 'instagram://user?username=isuryanshkapoor',
      color: '#E4405F',
      gradient: ['#E4405F', '#C13584', '#833AB4'],
      description: 'Follow my journey',
      subtitle: 'Behind-the-scenes content',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'logo-linkedin',
      url: 'https://www.linkedin.com/in/suryansh-kapoor-710807257',
      color: '#0A66C2',
      gradient: ['#0A66C2', '#004182'],
      description: 'Professional network',
      subtitle: 'Connect and collaborate',
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: 'logo-github',
      url: 'https://github.com/suryakapoor124',
      color: isDark ? '#f0f6fc' : '#24292f',
      gradient: isDark ? ['#f0f6fc', '#c9d1d9'] : ['#24292f', '#57606a'],
      description: 'Open source projects',
      subtitle: 'Code and contributions',
    },
  ];

  const features = [
    'Binaural beats for deep relaxation',
    'Solfeggio frequencies for healing',
    'Meditation enhancement tones',
    'Customizable frequency therapy',
    'Beautiful, modern interface',
    'Multiple frequency categories',
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background} 
      />
      
      {/* Status bar spacer */}
      <View style={styles.statusBarSpacer} />
      
      {/* Modern Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[styles.headerButton, { backgroundColor: theme.colors.surfaceVariant }]}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
            About
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            MagicWave v1.0.0
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={toggleTheme}
          style={[styles.headerButton, { backgroundColor: theme.colors.surfaceVariant }]}
        >
          <Ionicons 
            name={isDark ? 'sunny' : 'moon'} 
            size={24} 
            color={theme.colors.onSurface} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: theme.colors.surface }]}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroLogoContainer}>
                <Image
                  source={require('../../assets/magicwave.jpg')}
                  style={styles.heroLogo}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.heroTitle}>MagicWave</Text>
              <Text style={styles.heroDescription}>
                Frequency therapy reimagined for modern wellness
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.featuresGrid}>
          <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.featureIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="musical-notes" size={28} color={theme.colors.primary} />
            </View>
            <Text style={[styles.featureTitle, { color: theme.colors.onSurface }]}>
              Pure Frequencies
            </Text>
            <Text style={[styles.featureDesc, { color: theme.colors.onSurfaceVariant }]}>
              Real-time generated healing tones
            </Text>
          </View>

          <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.featureIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
              <Ionicons name="timer-outline" size={28} color={theme.colors.secondary} />
            </View>
            <Text style={[styles.featureTitle, { color: theme.colors.onSurface }]}>
              Sleep Timer
            </Text>
            <Text style={[styles.featureDesc, { color: theme.colors.onSurfaceVariant }]}>
              Auto-stop for peaceful rest
            </Text>
          </View>

          <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.featureIcon, { backgroundColor: theme.colors.tertiary + '20' }]}>
              <Ionicons name="heart-outline" size={28} color={theme.colors.tertiary} />
            </View>
            <Text style={[styles.featureTitle, { color: theme.colors.onSurface }]}>
              Favorites
            </Text>
            <Text style={[styles.featureDesc, { color: theme.colors.onSurfaceVariant }]}>
              Save your healing sounds
            </Text>
          </View>

          <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.featureIcon, { backgroundColor: theme.colors.accent + '20' }]}>
              <Ionicons name="color-palette-outline" size={28} color={theme.colors.accent} />
            </View>
            <Text style={[styles.featureTitle, { color: theme.colors.onSurface }]}>
              Themes
            </Text>
            <Text style={[styles.featureDesc, { color: theme.colors.onSurfaceVariant }]}>
              Light and dark modes
            </Text>
          </View>
        </View>

        {/* Developer Profile */}
        <View style={[styles.profileSection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.profileAvatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.profileInitials}>SK</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.colors.onSurface }]}>
                Suryansh Kapoor
              </Text>
              <Text style={[styles.profileTitle, { color: theme.colors.onSurfaceVariant }]}>
                
              </Text>
              <Text style={[styles.profileLocation, { color: theme.colors.onSurfaceVariant }]}>
                🫧
              </Text>
            </View>
          </View>
          <Text style={[styles.profileBio, { color: theme.colors.onSurfaceVariant }]}>
            There is no place like http://127.0.0.1
          </Text>
        </View>

        {/* Social Links - Professional Grid */}
        <View style={[styles.socialSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Connect & Support
          </Text>
          <View style={styles.socialGrid}>
            {socialLinks.map((social, index) => (
              <TouchableOpacity
                key={social.id}
                onPress={() => openLink(social.url, social.name, social.appUrl)}
                style={[
                  styles.socialCard,
                  { backgroundColor: theme.colors.surfaceContainer }
                ]}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={social.gradient}
                  style={styles.socialIconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={social.icon} size={20} color="white" />
                </LinearGradient>
                <View style={styles.socialContent}>
                  <Text style={[styles.socialName, { color: theme.colors.onSurface }]}>
                    {social.name}
                  </Text>
                  <Text style={[styles.socialDesc, { color: theme.colors.onSurfaceVariant }]}>
                    {social.description}
                  </Text>
                  <Text style={[styles.socialSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                    {social.subtitle}
                  </Text>
                </View>
                <View style={[styles.socialArrow, { backgroundColor: theme.colors.outline + '20' }]}>
                  <Ionicons name="chevron-forward" size={16} color={theme.colors.onSurfaceVariant} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View style={[styles.infoSection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                Version
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                1.0.1
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                Platform
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                React Native
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                Framework
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                Expo SDK 51
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                License
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                GPL-3.0
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            Made with ❤️ for wellness and mindfulness
          </Text>
          <Text style={[styles.footerCopy, { color: theme.colors.onSurfaceVariant }]}>
            © 2025 MagicWave. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarSpacer: {
    height: 20, // Extra space for status bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // Hero Section - Google-style hero
  heroSection: {
    margin: 20,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  heroGradient: {
    padding: 40,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroLogoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroLogo: {
    width: '100%',
    height: '100%',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    letterSpacing: 0.25,
  },
  heroDescription: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.15,
  },

  // Features Grid - Material Design cards
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  featureCard: {
    width: (SCREEN_WIDTH - 56) / 2,
    margin: 8,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28, // Exactly half of width/height for perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden', // This ensures perfect circular clipping
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  featureDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },

  // Profile Section - Professional layout
  profileSection: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: 0.15,
  },
  profileTitle: {
    fontSize: 16,
    marginBottom: 2,
    opacity: 0.8,
  },
  profileLocation: {
    fontSize: 14,
    opacity: 0.7,
  },
  profileBio: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
    letterSpacing: 0.1,
  },

  // Social Section - Modern grid layout
  socialSection: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    letterSpacing: 0.15,
  },
  socialGrid: {
    gap: 12,
  },
  socialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  socialIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  socialContent: {
    flex: 1,
  },
  socialName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  socialDesc: {
    fontSize: 14,
    marginBottom: 2,
    opacity: 0.8,
  },
  socialSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  socialArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Info Section - Technical details
  infoSection: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },

  // Footer - Clean and minimal
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
    gap: 8,
  },
  footerText: {
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 0.1,
    opacity: 0.8,
  },
  footerCopy: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.6,
  },
});

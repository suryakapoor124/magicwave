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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { AnimatedCard, BouncyButton } from '../components/Animated';

export const AboutScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const openLink = async (url, platform) => {
    try {
      console.log(`Attempting to open ${platform} link: ${url}`);
      
      // For Android, try different URL schemes
      let urlsToTry = [url];
      
      if (platform === 'LinkedIn') {
        urlsToTry = [
          'linkedin://profile/suryansh-kapoor-710807257', // LinkedIn app
          url, // Fallback to web
        ];
      } else if (platform === 'GitHub') {
        urlsToTry = [
          'github://user?username=suryakapoor124', // GitHub app
          url, // Fallback to web
        ];
      }
      
      let linkOpened = false;
      
      for (const urlToTry of urlsToTry) {
        try {
          const canOpen = await Linking.canOpenURL(urlToTry);
          console.log(`Can open ${urlToTry}: ${canOpen}`);
          
          if (canOpen) {
            await Linking.openURL(urlToTry);
            linkOpened = true;
            break;
          }
        } catch (error) {
          console.log(`Failed to open ${urlToTry}:`, error);
          continue;
        }
      }
      
      if (!linkOpened) {
        Alert.alert(
          'Link Error', 
          `Unable to open ${platform} link. Please check if you have a browser installed.`,
          [
            { text: 'Copy Link', onPress: () => {
              // You could implement clipboard copy here if needed
              console.log('Link to copy:', url);
            }},
            { text: 'OK', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error(`Error opening ${platform} link:`, error);
      Alert.alert('Error', `Failed to open ${platform} link: ${error.message}`);
    }
  };

  const socialLinks = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'logo-linkedin',
      url: 'https://www.linkedin.com/in/suryansh-kapoor-710807257',
      color: '#0A66C2',
      description: 'Connect with me professionally',
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: 'logo-github',
      url: 'https://github.com/suryakapoor124',
      color: isDark ? '#f0f6fc' : '#24292f',
      description: 'Check out my projects',
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
      
      {/* Extra padding for status bar */}
      <View style={styles.statusBarSpacer} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: theme.colors.surfaceVariant }]}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          About MagicWave
        </Text>
        
        <TouchableOpacity 
          onPress={toggleTheme}
          style={[styles.backButton, { backgroundColor: theme.colors.surfaceVariant }]}
        >
          <Ionicons 
            name={isDark ? 'sunny-outline' : 'moon-outline'} 
            size={24} 
            color={theme.colors.onSurface} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Logo Section */}
        <AnimatedCard style={[styles.logoSection, { backgroundColor: theme.colors.surface }]}>
          <LinearGradient
            colors={[theme.colors.primary + '20', theme.colors.primary + '10']}
            style={styles.logoContainer}
          >
            <Text style={styles.logoIcon}>🎵</Text>
          </LinearGradient>
          <Text style={[styles.appName, { color: theme.colors.onSurface }]}>
            MagicWave
          </Text>
          <Text style={[styles.appTagline, { color: theme.colors.onSurfaceVariant }]}>
            Your personal frequency therapy companion
          </Text>
          <Text style={[styles.version, { color: theme.colors.primary }]}>
            Version 1.0.0
          </Text>
        </AnimatedCard>

        {/* Description */}
        <AnimatedCard style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            About the App
          </Text>
          <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            MagicWave is a modern frequency therapy application designed to enhance your meditation, 
            relaxation, and healing journey. Experience the power of carefully crafted frequencies 
            that promote wellness, focus, and inner peace.
          </Text>
        </AnimatedCard>

        {/* Features */}
        <AnimatedCard style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Features
          </Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color={theme.colors.primary} 
                style={styles.featureIcon}
              />
              <Text style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
                {feature}
              </Text>
            </View>
          ))}
        </AnimatedCard>

        {/* How to Use */}
        <AnimatedCard style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            How to Use MagicWave
          </Text>
          <View style={styles.instructionItem}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepText}>1</Text>
            </View>
            <View style={styles.instructionContent}>
              <Text style={[styles.instructionTitle, { color: theme.colors.onSurface }]}>
                Choose Your Category
              </Text>
              <Text style={[styles.instructionDescription, { color: theme.colors.onSurfaceVariant }]}>
                Browse different frequency categories like "Chill Vibes Only" or "Deep Sleep Ops"
              </Text>
            </View>
          </View>
          
          <View style={styles.instructionItem}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.secondary }]}>
              <Text style={styles.stepText}>2</Text>
            </View>
            <View style={styles.instructionContent}>
              <Text style={[styles.instructionTitle, { color: theme.colors.onSurface }]}>
                Select a Frequency
              </Text>
              <Text style={[styles.instructionDescription, { color: theme.colors.onSurfaceVariant }]}>
                Tap on any frequency to see its details and benefits
              </Text>
            </View>
          </View>

          <View style={styles.instructionItem}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.tertiary }]}>
              <Text style={styles.stepText}>3</Text>
            </View>
            <View style={styles.instructionContent}>
              <Text style={[styles.instructionTitle, { color: theme.colors.onSurface }]}>
                Play & Relax
              </Text>
              <Text style={[styles.instructionDescription, { color: theme.colors.onSurfaceVariant }]}>
                Press play and let the healing frequencies work their magic. Use headphones for best results!
              </Text>
            </View>
          </View>

          <View style={styles.instructionItem}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.accent }]}>
              <Text style={styles.stepText}>4</Text>
            </View>
            <View style={styles.instructionContent}>
              <Text style={[styles.instructionTitle, { color: theme.colors.onSurface }]}>
                Save Favorites
              </Text>
              <Text style={[styles.instructionDescription, { color: theme.colors.onSurfaceVariant }]}>
                Tap the heart icon to save your favorite frequencies for quick access
              </Text>
            </View>
          </View>
        </AnimatedCard>

        {/* Developer Section */}
        <AnimatedCard style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Developer
          </Text>
          <View style={styles.developerInfo}>
            <View style={[styles.developerAvatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.developerInitials}>SK</Text>
            </View>
            <View style={styles.developerDetails}>
              <Text style={[styles.developerName, { color: theme.colors.onSurface }]}>
                Suryansh Kapoor
              </Text>
            </View>
          </View>
        </AnimatedCard>

        {/* Social Links */}
        <AnimatedCard style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Connect with Me
          </Text>
          <View style={styles.socialContainer}>
            {socialLinks.map((social) => (
              <BouncyButton
                key={social.id}
                onPress={() => openLink(social.url, social.name)}
                style={[
                  styles.socialButton,
                  { 
                    backgroundColor: theme.colors.surfaceContainer,
                    borderColor: social.color + '30',
                    borderWidth: 1,
                  }
                ]}
              >
                <View style={[styles.socialIconContainer, { backgroundColor: social.color + '20' }]}>
                  <Ionicons name={social.icon} size={24} color={social.color} />
                </View>
                <View style={styles.socialInfo}>
                  <Text style={[styles.socialName, { color: theme.colors.onSurface }]}>
                    {social.name}
                  </Text>
                  <Text style={[styles.socialDescription, { color: theme.colors.onSurfaceVariant }]}>
                    {social.description}
                  </Text>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={theme.colors.onSurfaceVariant} 
                />
              </BouncyButton>
            ))}
          </View>
        </AnimatedCard>

        {/* Thank You Section */}
        <AnimatedCard style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Thank You
          </Text>
          <Text style={[styles.thankYouText, { color: theme.colors.onSurfaceVariant }]}>
            Thank you for using MagicWave! Your journey towards wellness and mindfulness 
            is important, and I'm honored to be part of it. If you have any feedback 
            or suggestions, feel free to reach out.
          </Text>
        </AnimatedCard>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            Made with ❤️ by Suryansh Kapoor
          </Text>
          <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
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
    height: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoSection: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
    borderRadius: 16,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  version: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  instructionContent: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  instructionDescription: {
    fontSize: 15,
    lineHeight: 20,
  },
  developerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  developerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  developerInitials: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  developerDetails: {
    flex: 1,
  },
  developerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  developerTitle: {
    fontSize: 14,
  },
  socialContainer: {
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  socialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  socialInfo: {
    flex: 1,
  },
  socialName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  socialDescription: {
    fontSize: 14,
  },
  thankYouText: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

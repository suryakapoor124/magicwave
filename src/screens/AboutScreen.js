import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Linking,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, fontFamilies } from "../utils/theme";

const { width } = Dimensions.get("window");

export const AboutScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [selectedLink, setSelectedLink] = useState(null);

  const appInfo = {
    name: "MagicWave",
    version: "1.2.0",
    description:
      "MagicWave works in frequencies, not words. Designed to bring focus, balance, and quiet..",
  };

  const developer = {
    name: "Suryansh Kapoor",
    title: "I am Studing Computer Science",
    bio: "I use Arch BTW",
    image: "🐱",
  };

  const socialLinks = [
    {
      id: "instagram",
      icon: "logo-instagram",
      label: "Instagram",
      url: "https://www.instagram.com/isuryanshkapoor/",
      appUrl:
        Platform.OS === "android"
          ? "instagram://user/isuryanshkapoor/"
          : "instagram://user?username=isuryanshkapoor",
      color: "#E4405F",
    },
    {
      id: "github",
      icon: "logo-github",
      label: "GitHub",
      url: "https://github.com/suryakapoor124",
      appUrl:
        Platform.OS === "android"
          ? "https://github.com/suryakapoor124"
          : "https://github.com/suryakapoor124",
      color: "#333333",
    },
    {
      id: "linkedin",
      icon: "logo-linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/suryansh-kapoor-710807257/",
      appUrl:
        Platform.OS === "android"
          ? "linkedin://profile/suryansh-kapoor-710807257"
          : "linkedin://profile/suryansh-kapoor-710807257",
      color: "#0A66C2",
    },
  ];

  const features = [
    {
      icon: "musical-notes",
      title: "Healing Frequencies",
      description:
        "Access a curated collection of scientifically-backed healing frequencies",
    },
    {
      icon: "brain",
      title: "Brain Entrainment",
      description:
        "Use binaural beats to synchronize your brainwaves for optimal states",
    },
    {
      icon: "moon",
      title: "Sleep Enhancement",
      description:
        "Delta wave frequencies designed for deep, restorative sleep",
    },
    {
      icon: "sparkles",
      title: "Wellness",
      description:
        "Ancient frequencies combined with modern science for holistic healing",
    },
  ];

  const handleOpenLink = async (link) => {
    try {
      setSelectedLink(link.id);

      // Try app URL first on Android
      if (Platform.OS === "android" && link.appUrl && link.id !== "github") {
        try {
          const supported = await Linking.canOpenURL(link.appUrl);
          if (supported) {
            await Linking.openURL(link.appUrl);
            return;
          }
        } catch (appError) {
          console.log(`App URL failed for ${link.id}, trying web URL`);
        }
      }

      // Fallback to web URL
      const supported = await Linking.canOpenURL(link.url);
      if (supported) {
        await Linking.openURL(link.url);
      }
    } catch (error) {
      console.error(`Error opening ${link.label}:`, error);
    } finally {
      setSelectedLink(null);
    }
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

      <ScrollView
        showsVerticalScrollIndicator={false}
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
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                styles.backButton,
                {
                  backgroundColor: theme.colors.surfaceContainer,
                  borderColor: theme.colors.primary + "30",
                  borderWidth: 1.5,
                },
              ]}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.colors.onSurface}
              />
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: theme.colors.primary,
                    fontFamily: fontFamilies.bold,
                  },
                ]}
              >
                About MagicWave
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
                Version {appInfo.version}
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
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* App Description */}
        <LinearGradient
          colors={[theme.colors.primary + "15", theme.colors.secondary + "08"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.descriptionCard,
            {
              borderColor: theme.colors.primary + "30",
              borderWidth: 1,
            },
          ]}
        >
          <Text
            style={[
              styles.appName,
              {
                color: theme.colors.primary,
                fontFamily: fontFamilies.bold,
              },
            ]}
          >
            {appInfo.name}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.onSurface,
                fontFamily: fontFamilies.regular,
              },
            ]}
          >
            {appInfo.description}
          </Text>
        </LinearGradient>

        {/* Features */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.onSurface,
                fontFamily: fontFamilies.bold,
              },
            ]}
          >
            Key Features
          </Text>

          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <LinearGradient
                key={index}
                colors={[
                  theme.colors.surfaceContainer,
                  theme.colors.surfaceContainerHigh,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.featureCard,
                  {
                    borderColor: theme.colors.primary + "20",
                    borderWidth: 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.featureIconContainer,
                    { backgroundColor: theme.colors.primary + "15" },
                  ]}
                >
                  <Ionicons
                    name={feature.icon}
                    size={24}
                    color={theme.colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.featureTitle,
                    {
                      color: theme.colors.onSurface,
                      fontFamily: fontFamilies.bold,
                    },
                  ]}
                >
                  {feature.title}
                </Text>
                <Text
                  style={[
                    styles.featureDescription,
                    {
                      color: theme.colors.onSurfaceVariant,
                      fontFamily: fontFamilies.regular,
                    },
                  ]}
                >
                  {feature.description}
                </Text>
              </LinearGradient>
            ))}
          </View>
        </View>

        {/* Developer Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.onSurface,
                fontFamily: fontFamilies.bold,
              },
            ]}
          >
            Meet the Developer
          </Text>

          <LinearGradient
            colors={[
              theme.colors.primary + "20",
              theme.colors.secondary + "10",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.developerCard,
              {
                borderColor: theme.colors.primary + "30",
                borderWidth: 1.5,
              },
            ]}
          >
            <View style={styles.developerHeader}>
              <Text
                style={[
                  styles.developerImage,
                  { fontFamily: fontFamilies.regular },
                ]}
              >
                {developer.image}
              </Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.developerName,
                    {
                      color: theme.colors.onSurface,
                      fontFamily: fontFamilies.bold,
                    },
                  ]}
                >
                  {developer.name}
                </Text>
                <Text
                  style={[
                    styles.developerTitle,
                    {
                      color: theme.colors.primary,
                      fontFamily: fontFamilies.medium,
                    },
                  ]}
                >
                  {developer.title}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.developerBio,
                {
                  color: theme.colors.onSurface,
                  fontFamily: fontFamilies.regular,
                },
              ]}
            >
              {developer.bio}
            </Text>

            {/* Social Links */}
            <View style={styles.socialContainer}>
              {socialLinks.map((link) => (
                <TouchableOpacity
                  key={link.id}
                  onPress={() => handleOpenLink(link)}
                  activeOpacity={0.7}
                  style={[
                    styles.socialButton,
                    {
                      backgroundColor: theme.colors.surfaceContainer,
                      borderColor: link.color + "30",
                      borderWidth: 1.5,
                      transform: [
                        {
                          scale: selectedLink === link.id ? 0.95 : 1,
                        },
                      ],
                    },
                  ]}
                >
                  <Ionicons name={link.icon} size={28} color={link.color} />
                  <Text
                    style={[
                      styles.socialLabel,
                      {
                        color: link.color,
                        fontFamily: fontFamilies.medium,
                      },
                    ]}
                  >
                    {link.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.onSurface,
                fontFamily: fontFamilies.bold,
              },
            ]}
          >
            App Information
          </Text>

          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: theme.colors.surfaceContainer,
                borderColor: theme.colors.primary + "20",
                borderWidth: 1,
              },
            ]}
          >
            <View style={styles.infoRow}>
              <Text
                style={[
                  styles.infoLabel,
                  {
                    color: theme.colors.onSurfaceVariant,
                    fontFamily: fontFamilies.medium,
                  },
                ]}
              >
                Application
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color: theme.colors.onSurface,
                    fontFamily: fontFamilies.regular,
                  },
                ]}
              >
                {appInfo.name}
              </Text>
            </View>

            <View
              style={[
                styles.divider,
                { backgroundColor: theme.colors.outline + "20" },
              ]}
            />

            <View style={styles.infoRow}>
              <Text
                style={[
                  styles.infoLabel,
                  {
                    color: theme.colors.onSurfaceVariant,
                    fontFamily: fontFamilies.medium,
                  },
                ]}
              >
                Version
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color: theme.colors.onSurface,
                    fontFamily: fontFamilies.regular,
                  },
                ]}
              >
                {appInfo.version}
              </Text>
            </View>

            <View
              style={[
                styles.divider,
                { backgroundColor: theme.colors.outline + "20" },
              ]}
            />

            <View style={styles.infoRow}>
              <Text
                style={[
                  styles.infoLabel,
                  {
                    color: theme.colors.onSurfaceVariant,
                    fontFamily: fontFamilies.medium,
                  },
                ]}
              >
                Platform
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color: theme.colors.onSurface,
                    fontFamily: fontFamilies.regular,
                  },
                ]}
              >
                React Native
              </Text>
            </View>

            <View
              style={[
                styles.divider,
                { backgroundColor: theme.colors.outline + "20" },
              ]}
            />

            <View style={styles.infoRow}>
              <Text
                style={[
                  styles.infoLabel,
                  {
                    color: theme.colors.onSurfaceVariant,
                    fontFamily: fontFamilies.medium,
                  },
                ]}
              >
                Status
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: theme.colors.secondary + "20" },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: theme.colors.secondary },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: theme.colors.secondary,
                      fontFamily: fontFamilies.medium,
                    },
                  ]}
                >
                  Active
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.colors.primary + "10",
              borderTopColor: theme.colors.primary + "20",
              borderTopWidth: 1,
            },
          ]}
        >
          <Text
            style={[
              styles.footerText,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamilies.regular,
              },
            ]}
          >
            Made with 💜 by{" "}
            <Text
              style={[
                {
                  color: theme.colors.primary,
                  fontFamily: fontFamilies.bold,
                },
              ]}
            >
              Suryansh Kapoor
            </Text>
          </Text>
          <Text
            style={[
              styles.footerSubtext,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamilies.regular,
              },
            ]}
          >
            Bringing harmony through frequency and technology
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
  scrollContent: {
    paddingBottom: 40,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === "android" ? 40 : 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 28,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  appName: {
    fontSize: 24,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.25,
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  featureCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  featureDescription: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
    letterSpacing: 0.2,
    opacity: 0.8,
  },
  developerCard: {
    padding: 24,
    borderRadius: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  developerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  developerImage: {
    fontSize: 56,
    marginRight: 16,
  },
  developerName: {
    fontSize: 20,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  developerTitle: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  developerBio: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
    letterSpacing: 0.25,
    opacity: 0.85,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  socialLabel: {
    fontSize: 11,
    marginTop: 6,
    letterSpacing: 0.2,
  },
  infoCard: {
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  infoValue: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    letterSpacing: 0.2,
  },
  footer: {
    marginHorizontal: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  footerSubtext: {
    fontSize: 12,
    textAlign: "center",
    letterSpacing: 0.2,
    opacity: 0.7,
  },
});

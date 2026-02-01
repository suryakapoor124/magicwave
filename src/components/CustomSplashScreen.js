import React from "react";
import { View, StyleSheet, Image, Text, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

export const CustomSplashScreen = ({ isDark = false }) => {
  const backgroundColor = isDark ? "#0F0F0F" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#000000";
  const gradientColors = isDark
    ? ["#1A1A1A", "#2D2D2D"]
    : ["#F8F9FA", "#E9ECEF"];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/magicwave.png")}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: textColor }]}>MagicWave</Text>
            <Text style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>
              Frequency Therapy
            </Text>
          </View>

          <View style={styles.footer}>
            <Text
              style={[styles.footerText, { color: textColor, opacity: 0.5 }]}
            >
              Loading your healing frequencies...
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 32,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  footer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.1,
  },
});

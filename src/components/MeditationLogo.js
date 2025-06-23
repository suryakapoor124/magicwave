import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Animated as RNAnimated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useTheme } from '../utils/theme';
import { PulseView } from './Animated';

// Animated sparkle/particle component
const AnimatedParticle = ({ style, delay = 0, size = 4, duration = 3500, ...rest }) => {
  const anim = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    const loop = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(anim, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        RNAnimated.timing(anim, {
          toValue: 0,
          duration,
          delay: 0,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim, duration, delay]);

  // Animate opacity and scale for sparkle effect
  const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] });
  const scale = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.7, 1.2, 0.7] });

  // Only animate transform and opacity with native driver
  return (
    <RNAnimated.View
      style={[
        style,
        {
          opacity,
          transform: [{ scale }],
          // width, height, borderRadius must be static (not animated)
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
      {...rest}
    />
  );
};

// Animated shimmer overlay
const AnimatedShimmer = ({ size }) => {
  const shimmerAnim = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    const loop = RNAnimated.loop(
      RNAnimated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);
  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-size * 0.4, size * 0.4],
  });
  return (
    <RNAnimated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
      }}
    >
      <RNAnimated.View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: size,
          height: size,
          transform: [{ translateX }],
          opacity: 0.18,
        }}
      >
        <LinearGradient
          colors={["#fff", "#FECACA", "#fff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      </RNAnimated.View>
    </RNAnimated.View>
  );
};

export const MeditationLogo = ({ size = 80, animated = true, showText = false, variant = 'full' }) => {
  const { theme, isDark } = useTheme();

  // Gradient text for MagicWave
  const GradientText = ({ children, style }) => (
    <View style={{ position: 'relative' }}>
      <LinearGradient
        colors={['#fff', '#FECACA', '#DC2626']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: 8 }]}
      />
      <Text
        style={[
          style,
          {
            backgroundColor: 'transparent',
            fontWeight: 'bold',
            textShadowColor: '#DC2626',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 8,
            elevation: 2,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );

  const LogoContent = () => (
    <View style={[styles.logoContainer, { width: size, height: size }]}> 
      <LinearGradient
        colors={isDark ? 
          ['#1a1a1a', '#DC2626', '#EF4444', '#F87171'] : 
          ['#FFFFFF', '#FEE2E2', '#FECACA', '#DC2626']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientCircle, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Svg width={size * 0.8} height={size * 0.8} viewBox="0 0 120 120">
          <Defs>
            <RadialGradient id="aura" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#DC2626" stopOpacity="0.3" />
              <Stop offset="70%" stopColor="#EF4444" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="#F87171" stopOpacity="0.05" />
            </RadialGradient>
          </Defs>
          {/* Outer aura */}
          <Circle cx="60" cy="60" r="55" fill="url(#aura)" />
          {/* Inner meditation circle */}
          <Circle 
            cx="60" 
            cy="60" 
            r="45" 
            fill="none" 
            stroke={isDark ? "#DC2626" : "#B91C1C"} 
            strokeWidth="1" 
            opacity="0.3" 
          />
          <G transform="translate(60, 60)">
            {/* Meditation person silhouette */}
            {/* Body in lotus position */}
            <Path
              d="M0,-20 C-6,-20 -10,-16 -10,-8 L-10,10 C-10,14 -6,18 0,18 C6,18 10,14 10,10 L10,-8 C10,-16 6,-20 0,-20 Z"
              fill={isDark ? "white" : "#1F2937"}
              opacity="0.9"
            />
            {/* Head */}
            <Circle
              cx="0"
              cy="-25"
              r="7"
              fill={isDark ? "white" : "#1F2937"}
              opacity="0.9"
            />
            {/* Left arm in mudra position */}
            <Path
              d="M-10,-2 C-16,-2 -20,2 -18,8 C-16,12 -12,10 -10,6"
              fill={isDark ? "white" : "#1F2937"}
              opacity="0.9"
            />
            {/* Right arm in mudra position */}
            <Path
              d="M10,-2 C16,-2 20,2 18,8 C16,12 12,10 10,6"
              fill={isDark ? "white" : "#1F2937"}
              opacity="0.9"
            />
            {/* Legs in lotus position */}
            <Path
              d="M-10,12 C-16,12 -20,16 -18,20 C-16,22 -12,20 -8,18 L8,18 C12,20 16,22 18,20 C20,16 16,12 10,12"
              fill={isDark ? "white" : "#1F2937"}
              opacity="0.9"
            />
            {/* Crown chakra symbol */}
            <Circle
              cx="0"
              cy="-32"
              r="3"
              fill={isDark ? "#DC2626" : "#EF4444"}
              opacity="0.8"
            />
            {/* Third eye */}
            <Circle
              cx="0"
              cy="-26"
              r="1.5"
              fill={isDark ? "#DC2626" : "#EF4444"}
              opacity="0.6"
            />
            {/* Energy lines */}
            <Path
              d="M-20,-15 Q0,-35 20,-15"
              fill="none"
              stroke={isDark ? "#DC2626" : "#EF4444"}
              strokeWidth="1"
              opacity="0.4"
            />
            <Path
              d="M-15,-20 Q0,-30 15,-20"
              fill="none"
              stroke={isDark ? "#DC2626" : "#EF4444"}
              strokeWidth="1"
              opacity="0.3"
            />
          </G>
        </Svg>
        {/* Animated shimmer overlay */}
        <AnimatedShimmer size={size} />
        {/* Animated sparkles/particles */}
        <AnimatedParticle style={[styles.particle1, { backgroundColor: '#fff', width: size * 0.06, height: size * 0.06, borderRadius: size * 0.03 }]} delay={0} size={size * 0.06} />
        <AnimatedParticle style={[styles.particle2, { backgroundColor: '#fff', width: size * 0.045, height: size * 0.045, borderRadius: size * 0.022 }]} delay={900} size={size * 0.045} />
        <AnimatedParticle style={[styles.particle3, { backgroundColor: '#fff', width: size * 0.03, height: size * 0.03, borderRadius: size * 0.015 }]} delay={1800} size={size * 0.03} />
      </LinearGradient>
      {showText && (
        <GradientText style={[styles.logoText, { color: theme.colors.onSurface, fontSize: size * 0.15 }]}>MagicWave</GradientText>
      )}
    </View>
  );

  if (animated) {
    return (
      <PulseView pulseScale={1.05} pulseDuration={3000}>
        <LogoContent />
      </PulseView>
    );
  }
  return <LogoContent />;
};

// Spotify-style app icon
export const SpotifyStyleIcon = ({ size = 60 }) => {
  const { theme, isDark } = useTheme();
  
  return (
    <View style={[styles.iconContainer, { width: size, height: size }]}>
      <LinearGradient
        colors={['#DC2626', '#EF4444']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.iconGradient, { width: size, height: size, borderRadius: size / 4 }]}
      >
        <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 60 60">
          <G transform="translate(30, 30)">
            {/* Simplified meditation icon */}
            <Circle cx="0" cy="-8" r="6" fill="white" />
            <Path
              d="M0,-2 C-6,-2 -8,2 -8,8 L-8,15 C-8,18 -6,20 0,20 C6,20 8,18 8,15 L8,8 C8,2 6,-2 0,-2 Z"
              fill="white"
            />
            {/* Sound waves */}
            <Path
              d="M-15,5 Q-20,8 -15,12"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M15,5 Q20,8 15,12"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </G>
        </Svg>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gradientCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  particle1: {
    position: 'absolute',
    top: '10%',
    right: '15%',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
    opacity: 0.6,
  },
  particle2: {
    position: 'absolute',
    bottom: '20%',
    left: '10%',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'white',
    opacity: 0.4,
  },
  particle3: {
    position: 'absolute',
    top: '60%',
    right: '20%',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'white',
    opacity: 0.5,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGradient: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

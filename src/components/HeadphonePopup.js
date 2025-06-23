import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { AnimatedCard, BouncyButton, PulseView } from './Animated';
import { settingsManager } from '../utils/storage';
import { AudioUtils } from '../utils/audio';

const { width, height } = Dimensions.get('window');

export const HeadphonePopup = ({ visible, onClose, onContinue }) => {
  const { theme, isDark } = useTheme();
  const [hasHeadphones, setHasHeadphones] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (visible) {
      checkHeadphones();
    }
  }, [visible]);

  const checkHeadphones = async () => {
    const connected = await AudioUtils.checkHeadphones();
    setHasHeadphones(connected);
  };

  const handleContinueWithoutHeadphones = async () => {
    // Set setting to not show this popup again for this session
    await settingsManager.setSetting('showHeadphoneWarning', false);
    onContinue();
  };

  const handleContinueWithHeadphones = () => {
    onContinue();
  };

  const gradientColors = isDark
    ? ['#1F2937', '#374151', '#4B5563']
    : ['#F9FAFB', '#F3F4F6', '#E5E7EB'];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.backdrop} />
        
        <AnimatedCard
          style={styles.popupContainer}
          delay={200}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[
              styles.popup,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline,
              }
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <PulseView pulseScale={1.1} pulseDuration={1500}>
                <View style={[styles.iconContainer, { backgroundColor: hasHeadphones ? '#10B981' : '#F59E0B' }]}>
                  <Ionicons
                    name={hasHeadphones ? 'headset' : 'headset-outline'}
                    size={40}
                    color="white"
                  />
                </View>
              </PulseView>
              
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                {hasHeadphones ? 'Headphones Detected!' : 'Headphones Recommended'}
              </Text>
              
              <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                {hasHeadphones 
                  ? 'Perfect! You\'re all set for the best frequency therapy experience.'
                  : 'For the optimal healing frequency experience, headphones are highly recommended.'
                }
              </Text>
            </View>

            {/* Benefits */}
            <View style={styles.benefitsContainer}>
              <Text style={[styles.benefitsTitle, { color: theme.colors.onSurface }]}>
                Why headphones matter:
              </Text>
              
              <View style={styles.benefitsList}>
                <BenefitItem
                  icon="volume-high"
                  text="Better sound isolation"
                  theme={theme}
                />
                <BenefitItem
                  icon="ear"
                  text="Direct frequency delivery"
                  theme={theme}
                />
                <BenefitItem
                  icon="heart"
                  text="Enhanced healing effects"
                  theme={theme}
                />
                <BenefitItem
                  icon="moon"
                  text="No disturbance to others"
                  theme={theme}
                />
              </View>
            </View>

            {/* Warning (if no headphones) */}
            {!hasHeadphones && (
              <View style={[styles.warningContainer, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="warning" size={20} color="#D97706" />
                <Text style={[styles.warningText, { color: '#92400E' }]}>
                  Without headphones, the app's effectiveness may be significantly reduced
                </Text>
              </View>
            )}

            {/* Advanced Options Toggle */}
            <TouchableOpacity
              style={styles.advancedToggle}
              onPress={() => setShowAdvanced(!showAdvanced)}
              activeOpacity={0.7}
            >
              <Text style={[styles.advancedText, { color: theme.colors.primary }]}>
                Advanced Options
              </Text>
              <Ionicons
                name={showAdvanced ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>

            {showAdvanced && (
              <AnimatedCard style={styles.advancedOptions}>
                <View style={[styles.optionRow, { borderBottomColor: theme.colors.outline }]}>
                  <Text style={[styles.optionText, { color: theme.colors.onSurface }]}>
                    Volume Level
                  </Text>
                  <Text style={[styles.optionValue, { color: theme.colors.onSurfaceVariant }]}>
                    50% (Recommended)
                  </Text>
                </View>
                
                <View style={[styles.optionRow, { borderBottomColor: theme.colors.outline }]}>
                  <Text style={[styles.optionText, { color: theme.colors.onSurface }]}>
                    Background Audio
                  </Text>
                  <Text style={[styles.optionValue, { color: theme.colors.onSurfaceVariant }]}>
                    Disabled
                  </Text>
                </View>
                
                <View style={styles.optionRow}>
                  <Text style={[styles.optionText, { color: theme.colors.onSurface }]}>
                    Audio Quality
                  </Text>
                  <Text style={[styles.optionValue, { color: theme.colors.onSurfaceVariant }]}>
                    High (44.1kHz)
                  </Text>
                </View>
              </AnimatedCard>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {hasHeadphones ? (
                <BouncyButton
                  onPress={handleContinueWithHeadphones}
                  style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
                >
                  <Text style={[styles.primaryButtonText, { color: theme.colors.onPrimary }]}>
                    Continue with Headphones
                  </Text>
                </BouncyButton>
              ) : (
                <>
                  <BouncyButton
                    onPress={handleContinueWithoutHeadphones}
                    style={[styles.secondaryButton, { borderColor: theme.colors.outline }]}
                  >
                    <Text style={[styles.secondaryButtonText, { color: theme.colors.onSurface }]}>
                      Continue Anyway
                    </Text>
                  </BouncyButton>
                  
                  <BouncyButton
                    onPress={checkHeadphones}
                    style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
                  >
                    <Text style={[styles.primaryButtonText, { color: theme.colors.onPrimary }]}>
                      Check Again
                    </Text>
                  </BouncyButton>
                </>
              )}
            </View>

            {/* Skip Option */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.skipText, { color: theme.colors.onSurfaceVariant }]}>
                Skip this check
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </AnimatedCard>
      </View>
    </Modal>
  );
};

const BenefitItem = ({ icon, text, theme }) => (
  <View style={styles.benefitItem}>
    <View style={[styles.benefitIcon, { backgroundColor: theme.colors.primary + '20' }]}>
      <Ionicons name={icon} size={16} color={theme.colors.primary} />
    </View>
    <Text style={[styles.benefitText, { color: theme.colors.onSurfaceVariant }]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  popupContainer: {
    width: Math.min(width - 40, 400),
    maxHeight: height - 100,
  },
  popup: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 14,
    flex: 1,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  advancedToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },
  advancedText: {
    fontSize: 14,
    fontWeight: '600',
  },
  advancedOptions: {
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionValue: {
    fontSize: 14,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 16,
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

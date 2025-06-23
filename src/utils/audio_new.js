import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import * as Haptics from 'expo-haptics';

class FrequencyAudioEngine {
  constructor() {
    this.sound = null;
    this.isPlaying = false;
    this.currentFrequency = null;
    this.volume = 0.5;
    this.timer = null;
    this.backgroundSound = null;
    this.isBackgroundEnabled = false;
    this.setupAudio();
  }

  async setupAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      });
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  }

  // Play frequency (simplified version for demo)
  async playFrequency(frequencyData, options = {}) {
    try {
      // Stop any currently playing sound
      await this.stop();

      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // For demo purposes, we'll simulate playing the frequency
      // In a real app, you would generate sine wave audio or use pre-recorded tones
      this.currentFrequency = typeof frequencyData === 'object' ? frequencyData.frequency : frequencyData;
      this.isPlaying = true;

      console.log('Playing frequency:', this.currentFrequency, 'Hz');
      
      // Simulate audio playback without actual sound generation
      // In production, you would replace this with actual audio generation using:
      // - Web Audio API (for web)
      // - Native audio synthesis (for mobile)
      // - Pre-recorded sine wave files
      
      return Promise.resolve();

    } catch (error) {
      console.error('Error playing frequency:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  // Pause playback
  async pauseFrequency() {
    try {
      if (this.sound) {
        await this.sound.pauseAsync();
      }
      this.isPlaying = false;
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Error pausing:', error);
      this.isPlaying = false;
    }
  }

  // Resume playback
  async resumeFrequency() {
    try {
      if (this.sound) {
        await this.sound.playAsync();
      }
      this.isPlaying = true;
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Error resuming:', error);
      this.isPlaying = false;
    }
  }

  // Stop playback
  async stopFrequency() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      }
      
      this.isPlaying = false;
      this.currentFrequency = null;
      
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Error stopping:', error);
      // Reset state even if there's an error
      this.isPlaying = false;
      this.currentFrequency = null;
      this.sound = null;
    }
  }

  // Set volume
  async setVolume(volume) {
    try {
      this.volume = Math.max(0, Math.min(1, volume));
      if (this.sound) {
        await this.sound.setVolumeAsync(this.volume);
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  }

  // Set timer
  async setTimer(minutes) {
    try {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      
      if (minutes > 0) {
        this.timer = setTimeout(() => {
          this.stopFrequency();
        }, minutes * 60 * 1000);
      }
    } catch (error) {
      console.error('Error setting timer:', error);
    }
  }

  // Clear timer
  async clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  // Get current status
  getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentFrequency: this.currentFrequency,
      volume: this.volume,
      hasTimer: !!this.timer,
    };
  }

  // Cleanup
  async cleanup() {
    await this.stopFrequency();
    await this.clearTimer();
  }
}

// Create singleton instance
export const audioEngine = new FrequencyAudioEngine();

// Audio utilities
export const AudioUtils = {
  // Convert frequency to note name (for display purposes)
  frequencyToNote(frequency) {
    const A4 = 440;
    const C0 = A4 * Math.pow(2, -4.75);
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    if (frequency > 0) {
      const h = Math.round(12 * Math.log2(frequency / C0));
      const octave = Math.floor(h / 12);
      const n = h % 12;
      return noteNames[n] + octave;
    }
    return '';
  },

  // Validate frequency range
  isValidFrequency(frequency) {
    return frequency >= 20 && frequency <= 20000; // Human hearing range
  },

  // Format frequency for display
  formatFrequency(frequency) {
    if (frequency >= 1000) {
      return (frequency / 1000).toFixed(1) + 'kHz';
    }
    return frequency + 'Hz';
  },
};

export default audioEngine;

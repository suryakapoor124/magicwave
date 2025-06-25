import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import * as Haptics from 'expo-haptics';

class FrequencyAudioEngine {
  constructor() {
    this.sound = null;
    this.isPlaying = false;
    this.currentFrequency = null;
    this.volume = 0.5;
    this.timer = null;
    this.audioCache = new Map(); // Cache for generated audio
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

  // Ultra-fast audio generation (minimal processing)
  generateSineWave(frequency, duration = 0.5, sampleRate = 11025) {
    const samples = Math.floor(duration * sampleRate);
    const amplitude = 0.25; // Lower amplitude for faster processing
    const audioData = new Float32Array(samples);
    
    const step = 2 * Math.PI * frequency / sampleRate;
    for (let i = 0; i < samples; i++) {
      audioData[i] = amplitude * Math.sin(step * i);
    }
    
    return audioData;
  }

  // Create minimal WAV file (ultra-fast)
  createWavFile(audioData, sampleRate = 11025) {
    const length = audioData.length;
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);
    
    // Minimal WAV header
    view.setUint32(0, 0x46464952, true); // "RIFF"
    view.setUint32(4, 36 + length * 2, true);
    view.setUint32(8, 0x45564157, true); // "WAVE"
    view.setUint32(12, 0x20746d66, true); // "fmt "
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    view.setUint32(36, 0x61746164, true); // "data"
    view.setUint32(40, length * 2, true);
    
    // Fast PCM conversion
    let offset = 44;
    for (let i = 0; i < length; i++) {
      view.setInt16(offset, audioData[i] * 32767, true);
      offset += 2;
    }
    
    return buffer;
  }

  // Create data URI (ultra-fast base64)
  createAudioURI(wavBuffer) {
    const bytes = new Uint8Array(wavBuffer);
    let binary = '';
    const chunkSize = 8192;
    
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, chunk);
    }
    
    return `data:audio/wav;base64,${btoa(binary)}`;
  }

  // Play frequency (with caching for instant response)
  async playFrequency(frequencyData, options = {}) {
    try {
      // Extract frequency value immediately
      const frequency = typeof frequencyData === 'object' ? frequencyData.frequency : frequencyData;
      
      // Fast stop without delay
      if (this.sound) {
        this.sound.stopAsync().catch(() => {}); // Non-blocking
        this.sound.unloadAsync().catch(() => {}); // Non-blocking
        this.sound = null;
      }
      
      this.currentFrequency = frequency;
      this.isPlaying = false; // Will be set to true when sound starts

      let audioURI;
      
      // Check cache first for instant response
      if (this.audioCache.has(frequency)) {
        audioURI = this.audioCache.get(frequency);
      } else {
        // Generate and cache audio data
        const audioData = this.generateSineWave(frequency, 0.5);
        const wavBuffer = this.createWavFile(audioData, 11025);
        audioURI = this.createAudioURI(wavBuffer);
        
        // Cache for next time (limit cache size)
        if (this.audioCache.size < 50) {
          this.audioCache.set(frequency, audioURI);
        }
      }
      
      // Create and play sound immediately
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioURI },
        {
          shouldPlay: true,
          isLooping: true,
          volume: this.volume,
        }
      );
      
      this.sound = sound;
      this.isPlaying = true;

      // Simplified status listener
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish && !status.isLooping) {
          this.isPlaying = false;
          this.currentFrequency = null;
        }
      });

    } catch (error) {
      console.error('Error playing frequency:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  // Pause playback (instant)
  async pauseFrequency() {
    if (this.sound) {
      this.sound.pauseAsync().catch(() => {});
      this.isPlaying = false;
    }
  }

  // Resume playback (instant)
  async resumeFrequency() {
    if (this.sound) {
      this.sound.playAsync().catch(() => {});
      this.isPlaying = true;
    }
  }

  // Stop playback (fast)
  async stopFrequency() {
    try {
      if (this.sound) {
        this.sound.stopAsync().catch(() => {});
        this.sound.unloadAsync().catch(() => {});
        this.sound = null;
      }
      
      this.isPlaying = false;
      this.currentFrequency = null;
      
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    } catch (error) {
      // Reset state even if there's an error
      this.isPlaying = false;
      this.currentFrequency = null;
      this.sound = null;
    }
  }

  // Set volume (instant)
  async setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.sound) {
      this.sound.setVolumeAsync(this.volume).catch(() => {});
    }
  }

  // Set timer (instant)
  async setTimer(minutes) {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    if (minutes > 0) {
      this.timer = setTimeout(() => {
        this.stopFrequency();
      }, minutes * 60 * 1000);
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

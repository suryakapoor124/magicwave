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

  // Generate sine wave audio data
  generateSineWave(frequency, duration = 10, sampleRate = 44100) {
    const samples = duration * sampleRate;
    const amplitude = 0.3; // Comfortable volume level
    const audioData = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      audioData[i] = amplitude * Math.sin(2 * Math.PI * frequency * t);
    }
    
    return audioData;
  }

  // Create WAV file from audio data
  createWavFile(audioData, sampleRate = 44100) {
    const length = audioData.length;
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return buffer;
  }

  // Create data URI from WAV buffer
  createAudioURI(wavBuffer) {
    const bytes = new Uint8Array(wavBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return `data:audio/wav;base64,${base64}`;
  }

  // Play frequency (with actual audio generation)
  async playFrequency(frequencyData, options = {}) {
    try {
      console.log('AudioEngine: Starting playFrequency...');
      
      // Stop any currently playing sound and wait for it to stop
      await this.stopFrequency();
      
      // Small delay to ensure previous sound is fully stopped
      await new Promise(resolve => setTimeout(resolve, 100));

      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Extract frequency value
      const frequency = typeof frequencyData === 'object' ? frequencyData.frequency : frequencyData;
      this.currentFrequency = frequency;

      console.log('AudioEngine: Generating and playing frequency:', frequency, 'Hz');
      
      // Generate sine wave audio
      const audioData = this.generateSineWave(frequency, 10); // 10 second loop
      const wavBuffer = this.createWavFile(audioData);
      const audioURI = this.createAudioURI(wavBuffer);
      
      console.log('AudioEngine: Audio data generated, creating sound...');
      
      // Create and play sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioURI },
        {
          shouldPlay: true,
          isLooping: true,
          volume: this.volume,
        }
      );

      console.log('AudioEngine: Sound created and should be playing');
      
      this.sound = sound;
      this.isPlaying = true;

      // Set up status update listener
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish && !status.isLooping) {
          this.isPlaying = false;
          this.currentFrequency = null;
        }
      });

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
        this.isPlaying = false;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
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
        this.isPlaying = true;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error('Error resuming:', error);
      this.isPlaying = false;
    }
  }

  // Stop playback
  async stopFrequency() {
    try {
      console.log('AudioEngine: Stopping current frequency...');
      
      if (this.sound) {
        console.log('AudioEngine: Sound exists, stopping and unloading...');
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
        console.log('AudioEngine: Sound stopped and unloaded');
      }
      
      this.isPlaying = false;
      this.currentFrequency = null;
      
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('AudioEngine: Error stopping:', error);
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
        this.timer = null;
      }
      
      if (minutes > 0) {
        console.log(`AudioEngine: Setting sleep timer for ${minutes} minutes`);
        this.timer = setTimeout(() => {
          console.log('AudioEngine: Sleep timer expired, stopping frequency');
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

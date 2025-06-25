import React, { createContext, useContext, useState, useEffect } from 'react';
import { audioEngine } from '../utils/audio';
import { favoritesManager } from '../utils/storage';

const AudioContext = createContext();

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [currentFrequency, setCurrentFrequency] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [queue, setQueue] = useState([]); // Array of frequencies
  const [queueIndex, setQueueIndex] = useState(0);

  useEffect(() => {
    initializeAudio();
    loadFavorites();
  }, []);

  const initializeAudio = async () => {
    try {
      await audioEngine.setupAudio();
      setVolume(audioEngine.volume);
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const favs = await favoritesManager.getFavorites();
      setFavorites(Array.isArray(favs) ? favs : []);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setFavorites([]);
    }
  };

  // Ultra-fast frequency playback (60fps smooth)
  const playFrequency = (frequency, queueList = null, index = 0) => {
    // Instant UI feedback - no async/await
    setCurrentFrequency(frequency);
    setIsPlaying(true);
    setIsLoading(false);
    
    if (queueList) {
      setQueue(queueList);
      setQueueIndex(index);
    }
    
    // Fire and forget audio start
    audioEngine.playFrequency(frequency).catch(() => {
      setIsPlaying(false);
    });
    
    // Background operations
    favoritesManager.addToRecent(frequency).catch(() => {});
  };

  const pauseFrequency = () => {
    setIsPlaying(false);
    audioEngine.pauseFrequency();
  };

  const resumeFrequency = () => {
    setIsPlaying(true);
    audioEngine.resumeFrequency();
  };

  const stopFrequency = () => {
    setIsPlaying(false);
    setCurrentFrequency(null);
    setProgress(0);
    audioEngine.stopFrequency();
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseFrequency();
    } else if (currentFrequency) {
      resumeFrequency();
    }
  };

  const setVolumeLevel = (newVolume) => {
    setVolume(newVolume);
    audioEngine.setVolume(newVolume);
  };

  const toggleFavorite = async (frequency) => {
    try {
      const isFav = (favorites || []).some(fav => fav.id === frequency.id);
      
      if (isFav) {
        await favoritesManager.removeFromFavorites(frequency.id);
        setFavorites((favorites || []).filter(fav => fav.id !== frequency.id));
      } else {
        await favoritesManager.addToFavorites(frequency);
        setFavorites([...(favorites || []), frequency]);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const isFavorite = (frequency) => {
    if (!frequency) return false;
    return (favorites || []).some(fav => fav.id === frequency.id);
  };

  const setTimerDuration = (minutes) => {
    if (minutes > 0) {
      setTimer(minutes);
      audioEngine.setTimer(minutes);
    } else {
      setTimer(null);
      audioEngine.clearTimer();
    }
  };

  // Next in queue
  const playNext = () => {
    if (queue.length > 0 && queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      setQueueIndex(nextIndex);
      playFrequency(queue[nextIndex], queue, nextIndex);
    }
  };

  // Previous in queue
  const playPrevious = () => {
    if (queue.length > 0 && queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      setQueueIndex(prevIndex);
      playFrequency(queue[prevIndex], queue, prevIndex);
    }
  };

  // Seek (for now, just set progress)
  const seekTo = (percent) => {
    setProgress(percent);
    // Optionally, update audioEngine position if supported
  };

  const value = {
    currentFrequency,
    isPlaying,
    progress,
    duration,
    volume,
    isLoading,
    timer,
    favorites,
    playFrequency,
    pauseFrequency,
    resumeFrequency,
    stopFrequency,
    togglePlayPause,
    setVolumeLevel,
    toggleFavorite,
    isFavorite,
    setTimerDuration,
    queue,
    queueIndex,
    playNext,
    playPrevious,
    seekTo,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

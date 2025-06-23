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

  // Play a frequency or from queue
  const playFrequency = async (frequency, queueList = null, index = 0) => {
    try {
      setIsLoading(true);
      console.log('Playing frequency:', frequency.name, frequency.frequency + 'Hz');
      
      setCurrentFrequency(frequency);
      if (queueList) {
        setQueue(queueList);
        setQueueIndex(index);
      }
      
      await audioEngine.playFrequency(frequency);
      setIsPlaying(true);
      
      // Add to recent
      await favoritesManager.addToRecent(frequency);
      console.log('Frequency started successfully');
    } catch (error) {
      console.error('Failed to play frequency:', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const pauseFrequency = async () => {
    try {
      await audioEngine.pauseFrequency();
      setIsPlaying(false);
    } catch (error) {
      console.error('Failed to pause frequency:', error);
    }
  };

  const resumeFrequency = async () => {
    try {
      await audioEngine.resumeFrequency();
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to resume frequency:', error);
    }
  };

  const stopFrequency = async () => {
    try {
      await audioEngine.stopFrequency();
      setIsPlaying(false);
      setCurrentFrequency(null);
      setProgress(0);
    } catch (error) {
      console.error('Failed to stop frequency:', error);
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await pauseFrequency();
    } else if (currentFrequency) {
      await resumeFrequency();
    } else {
      // If no frequency is set, we can't resume
      console.log('No frequency to resume');
    }
  };

  const setVolumeLevel = async (newVolume) => {
    try {
      await audioEngine.setVolume(newVolume);
      setVolume(newVolume);
    } catch (error) {
      console.error('Failed to set volume:', error);
    }
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

  const setTimerDuration = async (minutes) => {
    try {
      if (minutes > 0) {
        await audioEngine.setTimer(minutes);
        setTimer(minutes);
      } else {
        await audioEngine.clearTimer();
        setTimer(null);
      }
    } catch (error) {
      console.error('Failed to set timer:', error);
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

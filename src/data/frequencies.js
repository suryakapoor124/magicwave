export const frequencyCategories = {
  'Chill Vibes Only': {
    color: '#059669', // Emerald green
    darkColor: '#10B981',
    frequencies: [
      { id: 1, name: 'Serenity Wave', frequency: 432, description: 'Universal harmony and relaxation', duration: 30, image: '🌸' },
      { id: 2, name: 'Zen Garden', frequency: 528, description: 'Love frequency for DNA repair', duration: 25, image: '🌿' },
      { id: 4, name: 'Ocean Depths', frequency: 110, description: 'Deep relaxation and grounding', duration: 35, image: '🌊' }
    ]
  },
  'Hindu Gods & Mantras': {
    color: '#FF6B35', // Sacred orange
    darkColor: '#FF8C42',
    frequencies: [
      { id: 91, name: 'Hare Krishna Mantra', frequency: 741, description: 'Love, devotion and divine play', duration: 40, image: '🪈' },
      { id: 88, name: 'Om Namah Shivaya', frequency: 136.1, description: 'Transformation and destruction of evil', duration: 30, image: '🔱' },
      { id: 93, name: 'Hanuman Chalisa', frequency: 963, description: 'Strength, courage and devotion', duration: 30, image: '🐒' },
      { id: 87, name: 'Ganesha Mantra', frequency: 426.7, description: 'Remover of obstacles and new beginnings', duration: 25, image: '🐘' },
      { id: 96, name: 'Gayatri Mantra', frequency: 110, description: 'Universal prayer for enlightenment', duration: 50, image: '☀️' }
    ]
  },
  'Deep Sleep Ops': {
    color: '#7C3AED', // Deep purple
    darkColor: '#A855F7',
    frequencies: [
      { id: 6, name: 'Dreamland Express', frequency: 40, description: 'Delta waves for deep sleep', duration: 60, image: '🌙' },
      { id: 8, name: 'Sleep Potion', frequency: 285, description: 'Tissue healing during sleep', duration: 50, image: '✨' },
      { id: 10, name: 'Pillow Talk', frequency: 528, description: 'Cellular repair during rest', duration: 30, image: '💤' }
    ]
  },
  'Zen Mode Activated': {
    color: '#D97706', // Golden amber
    darkColor: '#FBBF24',
    frequencies: [
      { id: 11, name: 'Buddha\'s Frequency', frequency: 963, description: 'Crown chakra activation', duration: 30, image: '🧘' },
      { id: 13, name: 'Inner Peace', frequency: 741, description: 'Expression and solutions', duration: 20, image: '☮️' }
    ]
  },
  'Fix Me Up Doc': {
    color: '#EF4444', // Medical red
    darkColor: '#DC2626',
    frequencies: [
      { id: 16, name: 'Pain Zapper', frequency: 174, description: 'Natural pain relief', duration: 20, image: '⚡' },
      { id: 17, name: 'Healing Beam', frequency: 528, description: 'DNA repair and healing', duration: 30, image: '🔬' },
      { id: 21, name: 'Immune Boost', frequency: 852, description: 'Strengthen immune system', duration: 30, image: '💪' }
    ]
  },
  'Brain Gym': {
    color: '#3B82F6', // Brain blue
    darkColor: '#2563EB',
    frequencies: [
      { id: 22, name: 'Focus Beam', frequency: 40, description: 'Gamma waves for concentration', duration: 25, image: '🎯' },
      { id: 23, name: 'Memory Boost', frequency: 432, description: 'Enhanced memory retention', duration: 30, image: '🧠' },
      { id: 26, name: 'IQ Amplifier', frequency: 963, description: 'Higher consciousness', duration: 35, image: '🚀' }
    ]
  },
  'Third Eye Opened': {
    color: '#8B5CF6', // Mystical purple
    darkColor: '#7C2D12',
    frequencies: [
      { id: 27, name: 'Cosmic Connection', frequency: 963, description: 'Pineal gland activation', duration: 30, image: '🌌' },
      { id: 31, name: 'Chakra Alignment', frequency: 741, description: 'Energy center balance', duration: 35, image: '🌈' }
    ]
  },
  'Mood Mechanics': {
    color: '#EC4899', // Mood pink
    darkColor: '#DB2777',
    frequencies: [
      { id: 42, name: 'Happy Pills', frequency: 528, description: 'Serotonin boost frequency', duration: 20, image: '😊' },
      { id: 43, name: 'Depression Buster', frequency: 396, description: 'Emotional healing', duration: 30, image: '🌅' }
    ]
  },
  'Ancient Wisdom': {
    color: '#B45309', // Ancient bronze
    darkColor: '#D97706',
    frequencies: [
      { id: 74, name: 'Om Mantra', frequency: 136.1, description: 'Universal sound vibration', duration: 25, image: '🕉️' },
      { id: 73, name: 'Tibetan Singing Bowl', frequency: 432, description: 'Traditional healing sound', duration: 30, image: '🎵' }
    ]
  },
  'Alien Frequencies': {
    color: '#10B981', // Alien green
    darkColor: '#059669',
    frequencies: [
      { id: 47, name: 'UFO Landing', frequency: 111, description: 'Extraterrestrial contact', duration: 30, image: '🛸' },
      { id: 51, name: 'Starseed Activation', frequency: 555, description: 'Cosmic DNA awakening', duration: 60, image: '⭐' }
    ]
  },
  'Power-Up Mode': {
    color: '#DC2626', // Power red
    darkColor: '#B91C1C',
    frequencies: [
      { id: 56, name: 'Workout Warrior', frequency: 40, description: 'Athletic performance boost', duration: 15, image: '💪' },
      { id: 60, name: 'Champion Frequency', frequency: 963, description: 'Peak performance state', duration: 35, image: '🏆' }
    ]
  }
};

// Popular frequencies for favorites default
export const popularFrequencies = [
  { id: 174, name: 'Pain Relief Pro', frequency: 174, description: 'Natural anesthetic', duration: 20, image: '⚡', category: 'Fix Me Up Doc', isRecommended: true },
  { id: 963, name: 'Cosmic Crown', frequency: 963, description: 'Crown chakra activation', duration: 30, image: '👑', category: 'Third Eye Opened', isRecommended: true },
  { id: 396, name: 'Fear Fighter', frequency: 396, description: 'Liberation from fear', duration: 25, image: '🛡️', category: 'Chill Vibes Only', isRecommended: true },
  { id: 528, name: 'Love Frequency', frequency: 528, description: 'DNA repair miracle tone', duration: 30, image: '💚', category: 'Chill Vibes Only', isRecommended: true }
];

// Motion sickness frequency
export const motionSicknessFrequency = {
  id: 999,
  name: 'Motion Sickness Relief',
  frequency: 100,
  description: 'Vestibular system balance',
  duration: 15,
  image: '🤢',
  category: 'Fix Me Up Doc'
};

// Get all frequencies as a flat array
export const getAllFrequencies = () => {
  const allFreqs = [];
  Object.entries(frequencyCategories).forEach(([categoryName, categoryData]) => {
    categoryData.frequencies.forEach(freq => {
      allFreqs.push({ ...freq, category: categoryName });
    });
  });
  return allFreqs;
};

// Get frequency by ID
export const getFrequencyById = (id) => {
  const allFreqs = getAllFrequencies();
  return allFreqs.find(freq => freq.id === id);
};

// Get category color
export const getCategoryColor = (categoryName, isDark = false) => {
  const category = frequencyCategories[categoryName];
  if (!category) return isDark ? '#374151' : '#9CA3AF';
  return isDark ? category.darkColor : category.color;
};

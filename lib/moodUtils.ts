export type Mood = {
  id: string;
  date: string;
  moodType: string;
  intensity: number;
  note?: string;
  source: 'manual' | 'webcam' | 'voice' | 'text';
};

export type WeeklyMood = {
  startDate: string;
  endDate: string;
  moods: Mood[];
};

export const MOOD_TYPES = [
  { type: 'happy', emoji: '😊', color: 'bg-yellow-400' },
  { type: 'sad', emoji: '😢', color: 'bg-blue-400' },
  { type: 'angry', emoji: '😡', color: 'bg-red-400' },
  { type: 'neutral', emoji: '😐', color: 'bg-gray-400' },
  { type: 'excited', emoji: '🤩', color: 'bg-purple-400' },
];

export const getMoodEmoji = (moodType: string): string => {
  const mood = MOOD_TYPES.find((m) => m.type === moodType);
  return mood ? mood.emoji : '😐';
};

export const getMoodColor = (moodType: string): string => {
  const mood = MOOD_TYPES.find((m) => m.type === moodType);
  return mood ? mood.color : 'bg-gray-400';
};

export const saveCurrentMood = (mood: Omit<Mood, 'id' | 'date'>): Mood => {
  const newMood: Mood = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    ...mood,
  };
  
  // Get existing moods
  const moodsJson = localStorage.getItem('moods');
  const moods: Mood[] = moodsJson ? JSON.parse(moodsJson) : [];
  
  // Add new mood
  moods.push(newMood);
  
  // Save back to localStorage
  localStorage.setItem('moods', JSON.stringify(moods));
  
  // Update last mood date
  localStorage.setItem('lastMoodDate', new Date().toDateString());
  
  return newMood;
};

export const getMoods = (): Mood[] => {
  const moodsJson = localStorage.getItem('moods');
  return moodsJson ? JSON.parse(moodsJson) : [];
};

export const getWeeklyMoods = (): WeeklyMood | null => {
  const moods = getMoods();
  
  if (moods.length === 0) {
    return null;
  }
  
  // Get the current week's start and end dates
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - dayOfWeek); // Start of week (Sunday)
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6); // End of week (Saturday)
  endDate.setHours(23, 59, 59, 999);
  
  // Filter moods for the current week
  const weeklyMoods = moods.filter((mood) => {
    const moodDate = new Date(mood.date);
    return moodDate >= startDate && moodDate <= endDate;
  });
  
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    moods: weeklyMoods,
  };
};

export const getMoodCount = (moodType: string): number => {
  const weeklyMood = getWeeklyMoods();
  
  if (!weeklyMood) {
    return 0;
  }
  
  return weeklyMood.moods.filter((mood) => mood.moodType === moodType).length;
};

export const getDominantMood = (): string | null => {
  const weeklyMood = getWeeklyMoods();
  
  if (!weeklyMood || weeklyMood.moods.length === 0) {
    return null;
  }
  
  const moodCounts = MOOD_TYPES.map((mood) => ({
    type: mood.type,
    count: weeklyMood.moods.filter((m) => m.moodType === mood.type).length,
  }));
  
  const dominantMood = moodCounts.reduce((prev, current) => 
    (prev.count > current.count) ? prev : current
  );
  
  return dominantMood.count > 0 ? dominantMood.type : null;
};

export const getMoodAdvice = (moodType: string): string => {
  const adviceMap: Record<string, string[]> = {
    happy: [
      "Keep spreading your joy to others!",
      "Try journaling about what made you happy today.",
      "Share your positive energy with someone who needs it.",
      "Build on this feeling by doing something you love.",
      "Take a moment to appreciate this feeling of happiness.",
    ],
    sad: [
      "It's okay to feel sad. Take some time for self-care.",
      "Try talking to someone you trust about your feelings.",
      "Consider a short walk in nature to clear your mind.",
      "Listen to music that resonates with how you feel right now.",
      "Remember that this feeling will pass with time.",
    ],
    angry: [
      "Take deep breaths and count to ten slowly.",
      "Try to identify exactly what triggered your anger.",
      "Consider writing down your thoughts to process them.",
      "Remove yourself from the situation if possible.",
      "Channel your energy into physical activity like a brisk walk.",
    ],
    neutral: [
      "Use this balanced state to plan your day or week.",
      "Try mindfulness meditation to center yourself further.",
      "This is a good time for self-reflection and goal setting.",
      "Consider trying something new while you're in a steady state.",
      "Acknowledge the stability of your current mood.",
    ],
    excited: [
      "Channel this energy into something productive or creative!",
      "Share your excitement with others who will appreciate it.",
      "Document this feeling to revisit when you need motivation.",
      "Use this momentum to tackle something challenging.",
      "Enjoy this feeling of enthusiasm and possibility!",
    ],
  };
  
  const defaultAdvice = [
    "Take a moment to check in with yourself about how you're feeling.",
    "Consider what might have influenced your current mood.",
    "Remember that all emotions are valid and serve a purpose.",
    "Practice self-compassion, whatever you're feeling.",
    "Take care of your basic needs: rest, hydration, and nutrition.",
  ];
  
  const moodAdvice = adviceMap[moodType] || defaultAdvice;
  return moodAdvice[Math.floor(Math.random() * moodAdvice.length)];
};

// Reset weekly moods (should be called at the beginning of each week)
export const resetWeeklyMoods = (): void => {
  const moods = getMoods();
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  
  // Keep only moods from the last week or newer
  const recentMoods = moods.filter((mood) => {
    const moodDate = new Date(mood.date);
    return moodDate >= lastWeek;
  });
  
  localStorage.setItem('moods', JSON.stringify(recentMoods));
};
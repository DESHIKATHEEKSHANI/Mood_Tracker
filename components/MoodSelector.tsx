'use client';

import { useState } from 'react';
import { MOOD_TYPES, saveCurrentMood } from '@/lib/moodUtils';
import { useToast } from '@/hooks/use-toast';

const MoodSelector = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { toast } = useToast();

  const handleMoodSelect = (moodType: string) => {
    setSelectedMood(moodType);
    
    saveCurrentMood({
      moodType,
      intensity: 3, // Medium intensity as default
      source: 'manual',
    });
    
    toast({
      title: "Mood saved!",
      description: `You're feeling ${moodType} today. Take care of yourself!`,
    });
    
    // Collapse the mood selector after selection
    setTimeout(() => {
      setIsExpanded(false);
    }, 500);
  };

  return (
    <div className="mood-selector flex flex-col items-center">
      {isExpanded ? (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6 max-w-2xl mx-auto">
          {MOOD_TYPES.map((mood) => (
            <button
              key={mood.type}
              onClick={() => handleMoodSelect(mood.type)}
              className={`flex flex-col items-center p-4 rounded-lg transition-all duration-300 ${
                selectedMood === mood.type 
                  ? 'bg-primary/20 scale-110' 
                  : 'bg-card hover:bg-primary/10 hover:scale-105'
              }`}
            >
              <span className="text-4xl mb-2">{mood.emoji}</span>
              <span className="capitalize font-medium">{mood.type}</span>
            </button>
          ))}
        </div>
      ) : (
        <button 
          onClick={() => setIsExpanded(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg"
        >
          How are you feeling today?
        </button>
      )}
    </div>
  );
};

export default MoodSelector;
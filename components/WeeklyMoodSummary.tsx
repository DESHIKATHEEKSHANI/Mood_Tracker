'use client';

import { useEffect, useState } from 'react';
import { MOOD_TYPES, getMoodCount, getDominantMood } from '@/lib/moodUtils';
import { Progress } from '@/components/ui/progress';

const WeeklyMoodSummary = () => {
  const [moodCounts, setMoodCounts] = useState<Record<string, number>>({});
  const [dominantMood, setDominantMood] = useState<string | null>(null);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    const counts: Record<string, number> = {};
    let total = 0;
    
    MOOD_TYPES.forEach((mood) => {
      const count = getMoodCount(mood.type);
      counts[mood.type] = count;
      total += count;
    });
    
    setMoodCounts(counts);
    setTotalEntries(total);
    setDominantMood(getDominantMood());
  }, []);

  const calculatePercentage = (count: number): number => {
    if (totalEntries === 0) return 0;
    return (count / totalEntries) * 100;
  };

  return (
    <div className="weekly-mood-summary">
      {totalEntries > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Your Mood Distribution</h3>
            
            <div className="space-y-4">
              {MOOD_TYPES.map((mood) => {
                const count = moodCounts[mood.type] || 0;
                const percentage = calculatePercentage(count);
                
                return (
                  <div key={mood.type} className="mood-stat">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{mood.emoji}</span>
                        <span className="capitalize">{mood.type}</span>
                      </div>
                      <span className="text-muted-foreground">{count} entries</span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-2 ${mood.color}`} 
                    />
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Your Week at a Glance</h3>
            
            {dominantMood ? (
              <div className="text-center p-4">
                <div className="text-6xl mb-4">
                  {MOOD_TYPES.find(m => m.type === dominantMood)?.emoji}
                </div>
                <p className="text-lg mb-2">
                  You've been mostly <span className="font-semibold capitalize">{dominantMood}</span> this week
                </p>
                <p className="text-muted-foreground">
                  Based on {totalEntries} mood entries
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48">
                <p className="text-muted-foreground text-center">
                  Not enough data yet. Start tracking your mood to see insights!
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg p-8 shadow-sm text-center">
          <h3 className="text-xl font-semibold mb-4">No Mood Data Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start tracking your mood to see weekly patterns and insights!
          </p>
          <div className="flex justify-center space-x-4">
            {MOOD_TYPES.map((mood) => (
              <div key={mood.type} className="text-3xl">
                {mood.emoji}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyMoodSummary;
'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Mood, getMoodEmoji, getMoodColor } from '@/lib/moodUtils';

interface MoodCalendarProps {
  moods: Mood[];
  currentMonth: Date;
}

const MoodCalendar = ({ moods, currentMonth }: MoodCalendarProps) => {
  const [displayMonth, setDisplayMonth] = useState(new Date(currentMonth));
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(displayMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setDisplayMonth(newMonth);
  };
  
  // Generate calendar data
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  // Create calendar grid
  const calendarDays = [];
  
  // Fill in leading empty cells
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Fill in days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  // Get moods for each day
  const getMoodsForDay = (day: number) => {
    const date = new Date(year, month, day);
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    return moods.filter(mood => {
      const moodDate = new Date(mood.date);
      return moodDate >= dayStart && moodDate <= dayEnd;
    });
  };
  
  // Get dominant mood for a day
  const getDominantMood = (dayMoods: Mood[]) => {
    if (dayMoods.length === 0) return null;
    
    const moodCounts: Record<string, number> = {};
    
    dayMoods.forEach(mood => {
      moodCounts[mood.moodType] = (moodCounts[mood.moodType] || 0) + 1;
    });
    
    let dominantMood = '';
    let maxCount = 0;
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantMood = mood;
      }
    });
    
    return dominantMood;
  };

  return (
    <div className="mood-calendar">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigateMonth('prev')}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous Month</span>
        </Button>
        
        <h3 className="font-medium text-lg">
          {displayMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigateMonth('next')}
          disabled={new Date(year, month) > new Date()}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next Month</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-sm font-medium">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="p-2 h-24 bg-muted/30 rounded-md"></div>;
          }
          
          const dayMoods = getMoodsForDay(day);
          const dominantMood = getDominantMood(dayMoods);
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
          
          return (
            <div 
              key={`day-${day}`} 
              className={`p-2 h-24 rounded-md border ${
                isToday ? 'border-primary/50 bg-primary/5' : 'border-border'
              } relative overflow-hidden`}
            >
              <div className="text-sm font-medium mb-1">{day}</div>
              
              {dominantMood ? (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <span className="text-6xl">{getMoodEmoji(dominantMood)}</span>
                </div>
              ) : null}
              
              <div className="flex flex-wrap gap-1">
                {dayMoods.slice(0, 3).map((mood, i) => (
                  <div 
                    key={`mood-${day}-${i}`}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${getMoodColor(mood.moodType)} text-white`}
                    title={`${mood.moodType} (${new Date(mood.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`}
                  >
                    <span className="text-xs">{getMoodEmoji(mood.moodType)}</span>
                  </div>
                ))}
                
                {dayMoods.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                    +{dayMoods.length - 3}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoodCalendar;
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getWeekRange, formatWeekRange } from '@/lib/dateUtils';
import { getMoods, Mood, getWeeklyMoods, MOOD_TYPES, getMoodEmoji } from '@/lib/moodUtils';
import MoodChart from '@/components/analysis/MoodChart';
import MoodCalendar from '@/components/analysis/MoodCalendar';

export default function AnalysisPage() {
  const [selectedTab, setSelectedTab] = useState('chart');
  const [moods, setMoods] = useState<Mood[]>([]);
  const [currentWeekRange, setCurrentWeekRange] = useState(getWeekRange());
  const [weekRangeText, setWeekRangeText] = useState('');
  
  useEffect(() => {
    const allMoods = getMoods();
    setMoods(allMoods);
    
    // Set the week range text
    setWeekRangeText(formatWeekRange(currentWeekRange));
  }, [currentWeekRange]);
  
  const navigateWeek = (direction: 'next' | 'prev') => {
    const newDate = new Date(direction === 'next' 
      ? currentWeekRange.end.getTime() + 24 * 60 * 60 * 1000 
      : currentWeekRange.start.getTime() - 24 * 60 * 60 * 1000
    );
    
    setCurrentWeekRange(getWeekRange(newDate));
  };
  
  // Filter moods for the current week
  const filteredMoods = moods.filter(mood => {
    const moodDate = new Date(mood.date);
    return moodDate >= currentWeekRange.start && moodDate <= currentWeekRange.end;
  });

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mt-4">Mood Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Track and visualize your mood patterns over time
          </p>
        </div>
        
        <div className="week-navigation flex items-center justify-between bg-card rounded-lg p-4 mb-6">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigateWeek('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Week</span>
          </Button>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="font-medium">{weekRangeText}</span>
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigateWeek('next')}
            disabled={currentWeekRange.end > new Date()}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Week</span>
          </Button>
        </div>
        
        <Tabs defaultValue="chart" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="chart">Mood Chart</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Weekly Mood Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <MoodChart moods={filteredMoods} weekRange={currentWeekRange} />
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MOOD_TYPES.slice(0, 3).map(mood => {
                  const count = filteredMoods.filter(m => m.moodType === mood.type).length;
                  
                  return (
                    <Card key={mood.type}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-3xl mr-3">{mood.emoji}</span>
                            <div>
                              <p className="font-medium capitalize">{mood.type}</p>
                              <p className="text-sm text-muted-foreground">
                                {count} {count === 1 ? 'entry' : 'entries'}
                              </p>
                            </div>
                          </div>
                          <div className={`h-10 w-10 rounded-full ${mood.color} flex items-center justify-center`}>
                            <span className="text-white font-bold">{count}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Mood Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <MoodCalendar moods={moods} currentMonth={currentWeekRange.start} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Entries</h2>
          
          {filteredMoods.length > 0 ? (
            <div className="space-y-4">
              {filteredMoods
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map(mood => (
                  <Card key={mood.id}>
                    <CardContent className="p-4 flex items-start">
                      <div className="text-3xl mr-4">{getMoodEmoji(mood.moodType)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium capitalize">{mood.moodType}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(mood.date).toLocaleDateString(undefined, { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {mood.note && <p className="text-sm">{mood.note}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          Via {mood.source} tracking
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No mood entries for this week.</p>
                <Link 
                  href="/journal"
                  className="text-primary hover:underline inline-block mt-2"
                >
                  Go to journal to track your mood
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
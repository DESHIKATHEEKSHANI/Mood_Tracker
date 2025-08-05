'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { getCurrentGreeting, formatDate } from '@/lib/dateUtils';
import { getRandomQuote } from '@/lib/quoteUtils';
import MoodSelector from '@/components/MoodSelector';
import WeeklyMoodSummary from '@/components/WeeklyMoodSummary';
import MoodCards from '@/components/MoodCards';
import UserProgress from '@/components/UserProgress';
import { useToast } from '@/hooks/use-toast';
import { MoodCard } from '@/components/ui/card';

export default function Home() {
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [quote, setQuote] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setGreeting(getCurrentGreeting());
    setCurrentDate(formatDate(new Date()));
    setQuote(getRandomQuote());

    // Check if user has logged mood today
    const lastMoodDate = localStorage.getItem('lastMoodDate');
    const today = new Date().toDateString();
    
    if (lastMoodDate !== today) {
      setTimeout(() => {
        toast({
          title: "Don't forget to log your mood today!",
          description: "Track your emotional wellbeing consistently for better insights.",
        });
      }, 3000);
    }
  }, [toast]);

  return (
    <main className="min-h-screen">
      <section className="hero-section flex flex-col md:flex-row items-center justify-between py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="greeting-container mb-8 md:mb-0 md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold mb-2 animate-fade-in">{greeting} 👋</h2>
          <p className="text-muted-foreground text-lg mb-6">{currentDate}</p>
          <Link 
            href="/journal"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-semibold inline-flex items-center transition-all duration-300 hover:translate-x-1"
          >
            Start Your Day
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        <div className="hero-image w-full md:w-1/2 flex justify-center">
          <Image 
            src="/images/hero-illustration.png" 
            alt="Moodify Hero" 
            width={400} 
            height={400}
            priority
            className="rounded-lg shadow-lg animate-float"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 md:px-12 max-w-7xl mx-auto mb-12">
        <MoodCard className="overflow-hidden">
          <div className="h-64 relative overflow-hidden rounded-t-lg">
            <Image 
              src="https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Motivational Image" 
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="p-6">
            <p className="text-lg font-medium text-center italic">{quote}</p>
          </div>
        </MoodCard>
        
        <MoodCard className="relative">
          <div className="absolute top-4 right-4">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-semibold mb-4">Your Calendar</h3>
            {/* Calendar component will be implemented later */}
            <div className="calendar-placeholder h-64 bg-muted rounded-lg flex items-center justify-center">
              <Link 
                href="/journal"
                className="text-primary hover:underline font-medium"
              >
                View your mood calendar
              </Link>
            </div>
          </div>
        </MoodCard>
      </section>

      <section className="bg-muted py-12 px-6 md:px-12 mb-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How Are You Feeling Today?</h2>
          <MoodSelector />
        </div>
      </section>

      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8">Your Mood This Week</h2>
        <WeeklyMoodSummary />
      </section>

      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8">Explore Your Moods</h2>
        <MoodCards />
      </section>

      <section className="bg-muted py-12 px-6 md:px-12 mb-12" id="progress">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Your Progress</h2>
          <UserProgress />
        </div>
      </section>

      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8">Stay Inspired</h2>
        <div className="aspect-video max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/V04ojClenZU?si=P5Tpt0VvESwVC8xn"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            className="w-full h-full"
          ></iframe>
        </div>
      </section>
    </main>
  );
}
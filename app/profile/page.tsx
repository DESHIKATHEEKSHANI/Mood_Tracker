'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, User, Calendar, Heart, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MOOD_TYPES } from '@/lib/moodUtils';

export default function ProfilePage() {
  const [nickname, setNickname] = useState('');
  const [favoriteTheme, setFavoriteTheme] = useState('happy');
  const [happiestDay, setHappiestDay] = useState('');
  const [saddestDay, setSaddestDay] = useState('');
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [profilePicture, setProfilePicture] = useState('/images/default-profile.png');
  
  const { toast } = useToast();

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setNickname(profile.nickname || '');
      setFavoriteTheme(profile.favoriteTheme || 'happy');
      setHappiestDay(profile.happiestDay || '');
      setSaddestDay(profile.saddestDay || '');
      setMotivationalQuote(profile.motivationalQuote || '');
      setProfilePicture(profile.profilePicture || '/images/default-profile.png');
    }
  }, []);
  
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePicture(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save profile to localStorage
    const profile = {
      nickname,
      favoriteTheme,
      happiestDay,
      saddestDay,
      motivationalQuote,
      profilePicture
    };
    
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully.",
    });
  };
  
  const getMoodEmoji = (moodType: string): string => {
    const mood = MOOD_TYPES.find(m => m.type === moodType);
    return mood ? mood.emoji : '😐';
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mt-4">Your Profile</h1>
          <p className="text-muted-foreground mt-2">
            Personalize your Moodify experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="profile-picture flex flex-col items-center justify-center mb-6">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20 mb-4">
                      <Image 
                        src={profilePicture} 
                        alt="Profile Picture" 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-pic-upload" className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary py-2 px-4 rounded-md transition-colors">
                        Upload Photo
                      </Label>
                      <Input 
                        type="file" 
                        id="profile-pic-upload" 
                        accept="image/*" 
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nickname" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Nickname
                    </Label>
                    <Input 
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Enter your nickname"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mood-theme" className="flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      Favorite Mood Theme
                    </Label>
                    <select 
                      id="mood-theme"
                      value={favoriteTheme}
                      onChange={(e) => setFavoriteTheme(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      {MOOD_TYPES.map(mood => (
                        <option key={mood.type} value={mood.type}>
                          {mood.emoji} {mood.type.charAt(0).toUpperCase() + mood.type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="happiest-day" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Happiest Day
                      </Label>
                      <Input 
                        type="date" 
                        id="happiest-day"
                        value={happiestDay}
                        onChange={(e) => setHappiestDay(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="saddest-day" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Saddest Day
                      </Label>
                      <Input 
                        type="date" 
                        id="saddest-day"
                        value={saddestDay}
                        onChange={(e) => setSaddestDay(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="motivational-quote" className="flex items-center">
                      <Quote className="h-4 w-4 mr-2" />
                      Personal Motivational Quote
                    </Label>
                    <Textarea 
                      id="motivational-quote"
                      value={motivationalQuote}
                      onChange={(e) => setMotivationalQuote(e.target.value)}
                      placeholder="Write something motivational..."
                      rows={3}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Save Profile</Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
                <CardDescription>Preview how your profile looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="profile-summary space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20 mb-4">
                      <Image 
                        src={profilePicture} 
                        alt="Profile Picture" 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-bold">
                      {nickname || 'Your Nickname'}
                    </h3>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <div className="flex items-center p-3 bg-card rounded-lg border">
                      <Heart className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Favorite Mood</p>
                        <p className="font-medium">
                          {getMoodEmoji(favoriteTheme)} {favoriteTheme.charAt(0).toUpperCase() + favoriteTheme.slice(1)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-card rounded-lg border">
                      <Calendar className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Happiest Day</p>
                        <p className="font-medium">
                          {happiestDay ? new Date(happiestDay).toLocaleDateString() : '-'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-card rounded-lg border">
                      <Calendar className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Saddest Day</p>
                        <p className="font-medium">
                          {saddestDay ? new Date(saddestDay).toLocaleDateString() : '-'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-primary/10 rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-2">
                        <Quote className="h-4 w-4 inline mr-2" />
                        Personal Quote
                      </p>
                      <p className="italic font-medium">
                        "{motivationalQuote || "Stay positive and keep moving forward!"}"
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
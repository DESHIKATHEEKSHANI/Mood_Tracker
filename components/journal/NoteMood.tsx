'use client';

import { useState, useRef } from 'react';
import { PencilLine, Mic, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { saveCurrentMood, getMoodAdvice } from '@/lib/moodUtils';
import { useToast } from '@/hooks/use-toast';

// Text-based mood analysis (simplified)
const analyzeTextMood = (text: string) => {
  // Word lists for different emotions
  const moodWords = {
    happy: ['happy', 'joy', 'delighted', 'cheerful', 'glad', 'pleased', 'overjoyed', 'thrilled', 'content', 'lovely'],
    sad: ['sad', 'unhappy', 'depressed', 'down', 'blue', 'gloomy', 'miserable', 'heartbroken', 'disappointed', 'lonely'],
    angry: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'enraged', 'hostile', 'bitter', 'upset'],
    neutral: ['okay', 'fine', 'alright', 'neutral', 'average', 'moderate', 'normal', 'indifferent', 'impartial'],
    excited: ['excited', 'enthusiastic', 'eager', 'energetic', 'animated', 'lively', 'spirited', 'thrilled', 'exhilarated']
  };
  
  // Convert to lowercase for comparison
  const lowerText = text.toLowerCase();
  
  // Count words from each category
  const counts = {
    happy: 0,
    sad: 0,
    angry: 0,
    neutral: 0,
    excited: 0
  };
  
  // Check each category
  Object.entries(moodWords).forEach(([mood, words]) => {
    words.forEach(word => {
      if (lowerText.includes(word)) {
        counts[mood as keyof typeof counts] += 1;
      }
    });
  });
  
  // Find the dominant mood
  let dominantMood = 'neutral';
  let maxCount = 0;
  
  Object.entries(counts).forEach(([mood, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantMood = mood;
    }
  });
  
  // If no specific mood is detected, try to determine from overall text sentiment
  if (maxCount === 0) {
    // Very simple sentiment analysis as fallback
    const positiveWords = ['good', 'great', 'love', 'like', 'wonderful', 'amazing', 'excellent'];
    const negativeWords = ['bad', 'hate', 'dislike', 'terrible', 'awful', 'horrible', 'worst'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) {
      dominantMood = 'happy';
    } else if (negativeCount > positiveCount) {
      dominantMood = 'sad';
    }
  }
  
  // Calculate intensity (1-5 scale)
  let intensity = 3; // Default neutral
  
  if (dominantMood === 'happy' || dominantMood === 'excited') {
    intensity = 4;
  } else if (dominantMood === 'sad') {
    intensity = 2;
  } else if (dominantMood === 'angry') {
    intensity = 1;
  }
  
  // Modify intensity based on certain intensifier words
  const intensifiers = ['very', 'extremely', 'incredibly', 'so', 'really', 'absolutely'];
  intensifiers.forEach(intensifier => {
    if (lowerText.includes(intensifier)) {
      if (dominantMood === 'happy' || dominantMood === 'excited') {
        intensity = 5;
      } else if (dominantMood === 'sad' || dominantMood === 'angry') {
        intensity = 1;
      }
    }
  });
  
  return { mood: dominantMood, intensity };
};

const NoteMood = () => {
  const [inputText, setInputText] = useState('');
  const [detectedMood, setDetectedMood] = useState('No mood detected yet');
  const [advice, setAdvice] = useState('No advice given yet');
  const [isRecording, setIsRecording] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const analyzeText = () => {
    if (inputText.trim().length < 3) {
      toast({
        title: "Text too short",
        description: "Please enter more text for accurate mood detection.",
        variant: "destructive",
      });
      return;
    }
    
    const { mood, intensity } = analyzeTextMood(inputText);
    setDetectedMood(getMoodEmoji(mood));
    setAdvice(getMoodAdvice(mood));
    
    // Save to localStorage
    saveCurrentMood({
      moodType: mood,
      intensity,
      note: inputText,
      source: 'text',
    });
    
    toast({
      title: "Mood analyzed",
      description: "Your text has been analyzed and your mood has been saved.",
    });
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        toast({
          title: "Voice input started",
          description: "Speak clearly to enter your text.",
        });
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setInputText(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast({
          title: "Voice recognition error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current.start();
    } else {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition. Try using Chrome.",
        variant: "destructive",
      });
    }
  };
  
  const getMoodEmoji = (mood: string): string => {
    switch (mood) {
      case 'happy':
        return 'Happy 😊';
      case 'sad':
        return 'Sad 😢';
      case 'angry':
        return 'Angry 😡';
      case 'excited':
        return 'Excited 🤩';
      case 'neutral':
        return 'Neutral 😐';
      default:
        return 'Unknown 🤔';
    }
  };

  return (
    <div className="note-mood">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PencilLine className="h-5 w-5 mr-2" />
                Note Mood Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label htmlFor="moodText" className="block text-sm font-medium mb-2">
                  How are you feeling today?
                </label>
                <Textarea
                  id="moodText"
                  placeholder="Write about your mood, feelings, or experiences today..."
                  value={inputText}
                  onChange={handleTextChange}
                  rows={6}
                  className="resize-none"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={analyzeText}
                  className="flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Analyze Mood
                </Button>
                
                <Button 
                  onClick={startVoiceInput}
                  disabled={isRecording}
                  variant="outline"
                  className="flex items-center"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  {isRecording ? 'Listening...' : 'Voice Input'}
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground mt-4">
                <p>Tips for best results:</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Be specific about how you're feeling</li>
                  <li>Include any events that affected your mood</li>
                  <li>Write at least a few sentences for better analysis</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Detected Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{detectedMood}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Advice</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{advice}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteMood;
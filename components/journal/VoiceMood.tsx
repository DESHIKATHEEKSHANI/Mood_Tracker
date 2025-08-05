'use client';

import { useState, useRef } from 'react';
import { Mic, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { saveCurrentMood, getMoodAdvice } from '@/lib/moodUtils';
import { useToast } from '@/hooks/use-toast';

// Simple sentiment analysis
const analyzeSentiment = (text: string): { mood: string, score: number } => {
  // Lists of positive and negative words
  const positiveWords = [
    'happy', 'joy', 'excited', 'good', 'great', 'amazing', 'wonderful', 
    'fantastic', 'awesome', 'love', 'loved', 'like', 'liked', 'delighted',
    'cheerful', 'content', 'ecstatic', 'glad', 'pleased', 'thrilled'
  ];
  
  const negativeWords = [
    'sad', 'angry', 'bad', 'terrible', 'awful', 'frustrated', 'depressed', 
    'anxious', 'worried', 'hate', 'hatred', 'dislike', 'miserable', 
    'heartbroken', 'upset', 'fear', 'scared', 'horrible', 'dreadful', 'mad'
  ];
  
  const excitedWords = [
    'excited', 'thrilled', 'enthusiastic', 'eager', 'energetic', 'pumped',
    'animated', 'lively', 'spirited', 'hyped', 'exhilarated', 'ecstatic'
  ];
  
  // Convert to lowercase for comparison
  const lowerText = text.toLowerCase();
  
  // Count instances of words in each category
  let positiveCount = 0;
  let negativeCount = 0;
  let excitedCount = 0;
  
  // Check for each positive word
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  // Check for each negative word
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  // Check for each excited word
  excitedWords.forEach(word => {
    if (lowerText.includes(word)) excitedCount++;
  });
  
  // Determine mood based on counts
  let mood = 'neutral';
  let score = 3; // Default neutral score (1-5 scale)
  
  if (positiveCount > negativeCount) {
    if (excitedCount >= 2) {
      mood = 'excited';
      score = 5;
    } else {
      mood = 'happy';
      score = 4;
    }
  } else if (negativeCount > positiveCount) {
    if (lowerText.includes('angry') || lowerText.includes('mad') || lowerText.includes('frustrat')) {
      mood = 'angry';
      score = 1;
    } else {
      mood = 'sad';
      score = 2;
    }
  }
  
  return { mood, score };
};

const VoiceMood = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [detectedMood, setDetectedMood] = useState('No mood detected yet');
  const [advice, setAdvice] = useState('No advice given yet');
  
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        setTranscript('Listening...');
        toast({
          title: "Voice recording started",
          description: "Speak clearly about how you're feeling today.",
        });
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);
        
        // Analyze sentiment if we have enough text
        if (currentTranscript.length > 5) {
          const { mood, score } = analyzeSentiment(currentTranscript);
          setDetectedMood(getMoodEmoji(mood));
          setAdvice(getMoodAdvice(mood));
          
          // Save to localStorage
          saveCurrentMood({
            moodType: mood,
            intensity: score,
            note: currentTranscript,
            source: 'voice',
          });
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Voice recognition error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
        if (transcript === 'Listening...') {
          setTranscript('No speech detected. Please try again.');
        }
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
  
  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      toast({
        title: "Voice recording stopped",
        description: "Your mood has been analyzed based on your speech.",
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
    <div className="voice-mood">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mic className="h-5 w-5 mr-2" />
                Voice Mood Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="bg-muted p-4 rounded-lg h-40 mb-4 overflow-auto">
                  <p className={transcript === 'Listening...' ? 'text-muted-foreground italic' : ''}>
                    {transcript || 'Your speech will appear here...'}
                  </p>
                </div>
                
                <div className="flex space-x-4">
                  <Button
                    onClick={startVoiceInput}
                    disabled={isRecording}
                    className={`flex items-center ${isRecording ? 'opacity-50' : ''}`}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Start Voice Input
                  </Button>
                  
                  <Button
                    onClick={stopVoiceInput}
                    disabled={!isRecording}
                    variant="destructive"
                    className="flex items-center"
                  >
                    <StopCircle className="h-4 w-4 mr-2" />
                    Stop Recording
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Tips for best results:</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Speak clearly and at a normal pace</li>
                  <li>Include emotion words like "happy," "sad," or "frustrated"</li>
                  <li>Share how your day is going and how you're feeling</li>
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

export default VoiceMood;
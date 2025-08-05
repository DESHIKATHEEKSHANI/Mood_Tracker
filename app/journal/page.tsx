'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import WebcamMood from '@/components/journal/WebcamMood';
import VoiceMood from '@/components/journal/VoiceMood';
import NoteMood from '@/components/journal/NoteMood';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function JournalPage() {
  const [selectedTab, setSelectedTab] = useState('webcam');

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
          
          <h1 className="text-3xl md:text-4xl font-bold mt-4">AI Journal</h1>
          <p className="text-muted-foreground mt-2">
            Track your mood using different methods and get personalized advice
          </p>
        </div>

        <Tabs defaultValue="webcam" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="webcam" className="flex items-center">
              <span className="mr-2">📷</span>
              <span>Webcam</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center">
              <span className="mr-2">🎤</span>
              <span>Voice</span>
            </TabsTrigger>
            <TabsTrigger value="note" className="flex items-center">
              <span className="mr-2">📝</span>
              <span>Note</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="webcam">
            <WebcamMood />
          </TabsContent>
          
          <TabsContent value="voice">
            <VoiceMood />
          </TabsContent>
          
          <TabsContent value="note">
            <NoteMood />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
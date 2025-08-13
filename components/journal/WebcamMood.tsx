"use client";

import { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { Camera, StopCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveCurrentMood, getMoodAdvice } from "@/lib/moodUtils";
import { useToast } from "@/hooks/use-toast";

const WebcamMood = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isWebcamStarted, setIsWebcamStarted] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [detectedMood, setDetectedMood] = useState("No mood detected yet");
  const [advice, setAdvice] = useState("No advice given yet");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Update model paths to include the full path structure
        const modelPath = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
          faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
          faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
          faceapi.nets.faceExpressionNet.loadFromUri(modelPath),
        ]);
        setIsModelLoaded(true);
        toast({
          title: "Models loaded successfully",
          description: "You can now start using the webcam mood detection.",
        });
      } catch (error) {
        console.error("Error loading models:", error);
        toast({
          title: "Error loading models",
          description:
            "Please ensure all model files are present in the public/models directory.",
          variant: "destructive",
        });
      }
    };

    loadModels();

    return () => {
      // Clean up any active tracking when component unmounts
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Stop webcam if it was started
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [toast]);

  const startWebcam = async () => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsWebcamStarted(true);
      toast({
        title: "Webcam started",
        description: "Click 'Start Tracking' to begin mood detection.",
      });
    } catch (error) {
      console.error("Error accessing webcam:", error);
      toast({
        title: "Webcam access error",
        description: "Could not access your webcam. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const startTracking = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsTracking(true);

    intervalRef.current = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        const displaySize = {
          width: videoRef.current.width,
          height: videoRef.current.height,
        };

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }

        if (detections.length > 0) {
          const expressions = detections[0].expressions;
          // Fixed TypeScript issue with proper type assertion
          const mood = (
            Object.keys(expressions) as Array<keyof typeof expressions>
          ).reduce((a, b) => (expressions[a] > expressions[b] ? a : b));

          setDetectedMood(mapMoodName(mood));
          const moodAdvice = getMoodAdvice(mapMoodToType(mood));
          setAdvice(moodAdvice);

          // Save to localStorage
          saveCurrentMood({
            moodType: mapMoodToType(mood),
            intensity: expressions[mood] * 5, // Scale 0-1 to 0-5
            source: "webcam",
          });
        }
      } catch (error) {
        console.error("Error during face detection:", error);
        // Optionally show a toast for detection errors
        // toast({
        //   title: "Detection error",
        //   description: "Error occurred during mood detection.",
        //   variant: "destructive",
        // });
      }
    }, 100);
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);
  };

  // Map face-api mood names to our mood types
  const mapMoodName = (mood: string): string => {
    switch (mood) {
      case "happy":
        return "Happy 😊";
      case "sad":
        return "Sad 😢";
      case "angry":
        return "Angry 😡";
      case "disgusted":
        return "Disgusted 🤢";
      case "fearful":
        return "Fearful 😨";
      case "neutral":
        return "Neutral 😐";
      case "surprised":
        return "Surprised 😲";
      default:
        return mood;
    }
  };

  const mapMoodToType = (mood: string): string => {
    switch (mood) {
      case "happy":
      case "surprised":
        return "happy";
      case "sad":
      case "fearful":
        return "sad";
      case "angry":
      case "disgusted":
        return "angry";
      case "neutral":
        return "neutral";
      default:
        return "neutral";
    }
  };

  return (
    <div className="webcam-mood">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Webcam Mood Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="video-container relative mb-4 bg-muted rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  width={640}
                  height={480}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={480}
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={startWebcam}
                  disabled={!isModelLoaded || isWebcamStarted}
                  className="flex items-center"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Start Webcam
                </Button>

                <Button
                  onClick={startTracking}
                  disabled={!isWebcamStarted || isTracking}
                  variant="outline"
                  className="flex items-center"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Tracking
                </Button>

                <Button
                  onClick={stopTracking}
                  disabled={!isTracking}
                  variant="destructive"
                  className="flex items-center"
                >
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop Tracking
                </Button>
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

export default WebcamMood;
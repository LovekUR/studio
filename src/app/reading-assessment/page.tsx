"use client";

import { useState, useRef, useEffect } from "react";
import { FeaturePage } from "@/components/common/FeaturePage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Play, Square, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReadingAssessmentPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    getMicrophonePermission();
  }, []);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setPermission(true);
      } catch (err) {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Microphone Access Denied",
          description: "Please allow microphone access in your browser settings to use this feature.",
        });
        setPermission(false);
      }
    }
  };

  const startRecording = async () => {
    if (!permission) {
      getMicrophonePermission();
      return;
    }
    setAudioURL(null);
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorder.current = recorder;
    mediaRecorder.current.start();

    audioChunks.current = [];
    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setIsRecording(false);
      };
    }
  };
  
  const handleAnalysis = () => {
      toast({
          title: "Feature Coming Soon!",
          description: "Speech analysis is currently under development. Please check back later."
      })
  }

  return (
    <FeaturePage
      title="Audio-Based Reading Assessment"
      description="Record a student reading aloud and get an instant analysis of their fluency and accuracy."
    >
        <Card className="max-w-2xl mx-auto bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-headline">Reading Recorder</CardTitle>
                <CardDescription>
                    Press record and have the student read a passage. Press stop when they're finished.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center space-y-6">
                    {!permission && (
                        <div className="flex items-center p-4 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800">
                            <AlertTriangle className="w-6 h-6 mr-3" />
                            <p>Microphone permission is required to use this feature.</p>
                        </div>
                    )}
                    <div className="flex space-x-4">
                        {!isRecording ? (
                            <Button size="lg" onClick={startRecording} disabled={!permission}>
                                <Mic className="mr-2 h-5 w-5" />
                                Start Recording
                            </Button>
                        ) : (
                            <Button size="lg" onClick={stopRecording} variant="destructive">
                                <MicOff className="mr-2 h-5 w-5" />
                                Stop Recording
                            </Button>
                        )}
                    </div>
                    {isRecording && (
                        <div className="flex items-center text-red-500">
                           <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                           Recording...
                        </div>
                    )}

                    {audioURL && (
                        <div className="w-full space-y-4">
                            <div className="font-semibold text-center">Recording Complete</div>
                            <audio src={audioURL} controls className="w-full" />
                            <Button className="w-full" onClick={handleAnalysis}>
                                <Play className="mr-2 h-5 w-5" />
                                Analyze Reading (Coming Soon)
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    </FeaturePage>
  );
}

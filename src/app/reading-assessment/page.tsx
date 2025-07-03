"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { readingAssessment, ReadingAssessmentOutput } from "@/ai/flows/reading-assessment";

import { FeaturePage } from "@/components/common/FeaturePage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, AlertTriangle, Loader2, FileText, Bot, Gauge, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  passage: z.string().min(20, "Please provide a passage of at least 20 characters."),
});

const blobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export default function ReadingAssessmentPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number | null>(null);
  
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ReadingAssessmentOutput | null>(null);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passage: "",
    },
  });

  useEffect(() => {
    getMicrophonePermission();
  }, []);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setPermission(true);
      } catch (err) {
        console.error("Microphone permission denied:", err);
        toast({
          variant: "destructive",
          title: "Microphone Access Denied",
          description: "Please allow microphone access in your browser settings to use this feature.",
        });
        setPermission(false);
      }
    } else {
        toast({
            variant: "destructive",
            title: "Unsupported Browser",
            description: "Your browser does not support audio recording.",
        });
    }
  };

  const startRecording = async () => {
    if (!permission) {
      await getMicrophonePermission();
      if (!permission) return;
    }

    setAudioURL(null);
    setAudioBlob(null);
    setAnalysisResult(null);
    setIsRecording(true);
    setRecordingStartTime(Date.now());
    
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
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
        setIsRecording(false);
        if (recordingStartTime) {
            setRecordingDuration((Date.now() - recordingStartTime) / 1000);
        }
      };
    }
  };
  
  async function onAnalyze(values: z.infer<typeof formSchema>) {
      if (!audioBlob || !recordingDuration) {
          toast({
              variant: "destructive",
              title: "No Recording Found",
              description: "Please record the student's reading first.",
          });
          return;
      }

      setIsLoading(true);
      setAnalysisResult(null);
      try {
          const audioDataUri = await blobToDataURL(audioBlob);
          const result = await readingAssessment({
              passage: values.passage,
              audioDataUri: audioDataUri,
              durationSeconds: recordingDuration,
          });
          setAnalysisResult(result);
      } catch (error) {
          console.error("Error analyzing reading:", error);
          toast({
              variant: "destructive",
              title: "Oh no! Something went wrong.",
              description: "Failed to analyze the reading. Please try again.",
          });
      } finally {
          setIsLoading(false);
      }
  }

  return (
    <FeaturePage
      title="Audio-Based Reading Assessment"
      description="Record a student reading aloud and get an instant AI-powered analysis of their fluency and accuracy."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="bg-card">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAnalyze)}>
              <CardHeader>
                  <CardTitle className="font-headline">1. Enter Passage & Record</CardTitle>
                  <CardDescription>
                      Input the text the student will read, then use the controls to record their audio.
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="passage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reading Passage</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste or type the reading passage here..."
                          className="resize-y min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormLabel>Recording Controls</FormLabel>
                  {!permission && (
                      <div className="flex items-center p-3 bg-yellow-100/50 border border-yellow-300/50 rounded-md text-yellow-800 text-sm">
                          <AlertTriangle className="w-5 h-5 mr-2 shrink-0" />
                          <p>Microphone permission is required to record.</p>
                      </div>
                  )}
                  <div className="flex space-x-4">
                      {!isRecording ? (
                          <Button type="button" size="lg" onClick={startRecording} disabled={!permission}>
                              <Mic className="mr-2" />
                              Start Recording
                          </Button>
                      ) : (
                          <Button type="button" size="lg" onClick={stopRecording} variant="destructive">
                              <MicOff className="mr-2" />
                              Stop Recording
                          </Button>
                      )}
                  </div>
                  {isRecording && (
                      <div className="flex items-center text-red-500">
                         <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                         Recording in progress...
                      </div>
                  )}

                  {audioURL && (
                      <div className="space-y-2 pt-2">
                          <p className="font-medium text-sm">Recorded Audio:</p>
                          <audio src={audioURL} controls className="w-full" />
                      </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                 <Button type="submit" disabled={isLoading || !audioBlob} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 animate-spin" /> : "Analyze Reading"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="bg-card">
            <CardHeader>
                <CardTitle className="font-headline">2. Review Analysis</CardTitle>
                <CardDescription>The assessment results will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px]">
                {isLoading && (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Analyzing... this may take a moment.</p>
                  </div>
                )}
                {!isLoading && !analysisResult && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mb-4"/>
                        <p>Your analysis will be displayed here once you submit a recording.</p>
                    </div>
                )}
                {analysisResult && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4">
                                <CardHeader className="p-0 flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                                    <Gauge className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="text-2xl font-bold">{analysisResult.accuracy}%</div>
                                    <Progress value={analysisResult.accuracy} className="h-2 mt-2" />
                                </CardContent>
                            </Card>
                            <Card className="p-4">
                                <CardHeader className="p-0 flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium">Words Per Minute</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="text-2xl font-bold">{analysisResult.wordsPerMinute}</div>
                                    <p className="text-xs text-muted-foreground">Reading speed</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <h3 className="font-headline text-lg flex items-center mb-2"><Bot className="mr-2 h-5 w-5"/> AI Feedback</h3>
                            <p className="text-sm text-foreground/90 whitespace-pre-wrap font-body bg-muted/50 p-4 rounded-md">{analysisResult.feedback}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-headline text-lg flex items-center mb-2"><FileText className="mr-2 h-5 w-5"/> Transcript</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap font-body border p-4 rounded-md">{analysisResult.transcript}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </FeaturePage>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateGameAndLessonPlan } from "@/ai/flows/game-and-lesson-plan-generation";

import { FeaturePage } from "@/components/common/FeaturePage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ClipboardList, Gamepad2 } from "lucide-react";

const formSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters."),
  gradeLevel: z.string().min(1, "Grade level is required."),
  learningObjectives: z.string().min(10, "Please provide learning objectives."),
  gameType: z.string().min(3, "Game type must be at least 3 characters."),
});

interface GenerationOutput {
    lessonPlan: string;
    gameDescription: string;
}

export default function LessonPlannerPage() {
  const [generatedPlan, setGeneratedPlan] = useState<GenerationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      gradeLevel: "",
      learningObjectives: "",
      gameType: "Quiz",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedPlan(null);
    try {
      const result = await generateGameAndLessonPlan(values);
      setGeneratedPlan(result);
    } catch (error) {
      console.error("Error generating plan:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "Failed to generate the lesson plan. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FeaturePage
      title="Game & Lesson Planner"
      description="Automatically generate comprehensive lesson plans and fun educational games for any topic."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline">Lesson Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Photosynthesis" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gradeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade Level</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Grade 4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gameType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Quiz, Puzzle, Simulation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="learningObjectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Learning Objectives</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Students will be able to define photosynthesis and identify its key components."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Generate Plan & Game"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
            {isLoading && (
                <Card className="bg-card/80 backdrop-blur-sm">
                    <CardContent className="min-h-[300px] flex justify-center items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </CardContent>
                </Card>
            )}

            {generatedPlan ? (
                <>
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-headline flex items-center"><ClipboardList className="mr-2" /> Lesson Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="whitespace-pre-wrap font-body text-foreground/90">
                    {generatedPlan.lessonPlan}
                  </CardContent>
                </Card>
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Gamepad2 className="mr-2" /> Game Description</CardTitle>
                  </CardHeader>
                  <CardContent className="whitespace-pre-wrap font-body text-foreground/90">
                    {generatedPlan.gameDescription}
                  </CardContent>
                </Card>
                </>
            ) : !isLoading && (
                <Card className="bg-card/80 backdrop-blur-sm">
                    <CardContent className="min-h-[300px] flex justify-center items-center">
                        <p className="text-muted-foreground text-center">Your generated lesson plan and game will appear here.</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </FeaturePage>
  );
}

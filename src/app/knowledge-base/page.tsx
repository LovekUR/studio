"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { instantKnowledgeBase } from "@/ai/flows/instant-knowledge-base";

import { FeaturePage } from "@/components/common/FeaturePage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

const formSchema = z.object({
  question: z.string().min(10, "Your question should be at least 10 characters long."),
});

export default function KnowledgeBasePage() {
  const [generatedAnswer, setGeneratedAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedAnswer(null);
    try {
      const result = await instantKnowledgeBase(values);
      setGeneratedAnswer(result.answer);
    } catch (error) {
      console.error("Error getting answer:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "Failed to get an answer. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FeaturePage
      title="Instant Knowledge Base"
      description="Ask any teaching or subject-related question and get a simple, clear answer with a helpful analogy."
    >
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="font-headline">Ask a Question</CardTitle>
            <CardDescription>
              For example: "How can I explain photosynthesis to a 2nd grader?"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Type your question here..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Get Answer"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {(isLoading || generatedAnswer) && (
           <Card className="mt-8 bg-card">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <Sparkles className="mr-2 h-6 w-6 text-yellow-400" />
                Here's your answer
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[150px] whitespace-pre-wrap font-body text-foreground/90">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
               ) : (
                <p>{generatedAnswer}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </FeaturePage>
  );
}

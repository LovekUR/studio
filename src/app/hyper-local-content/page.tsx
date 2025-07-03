'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateHyperLocalContent, HyperLocalContentInput } from "@/ai/flows/hyper-local-content-generation";

import { FeaturePage } from "@/components/common/FeaturePage";
import { Navbar } from "@/components/common/Navbar"; 
import { Footer } from "@/components/common/Footer"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  contentType: z.enum(['story', 'explanation', 'worksheet']),
  topic: z.string().min(3, "Topic must be at least 3 characters."),
  language: z.string().min(2, "Language must be at least 2 characters."),
  gradeLevel: z.coerce.number().int().min(1).max(12),
});

export default function HyperLocalContentPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentType: "story",
      topic: "",
      language: "",
      gradeLevel: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedContent(null);
    try {
      const result = await generateHyperLocalContent(values as HyperLocalContentInput);
      setGeneratedContent(result.content);
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "Failed to generate content. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={darkMode ? 'dark bg-black text-white' : 'bg-white text-black'}>
      <Navbar />

      <FeaturePage
        title="Hyper-Local Content Generator"
        description="Create stories, explanations, or worksheets in any local language to make learning more accessible."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="font-headline">Request Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="contentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a content type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="story">Story</SelectItem>
                            <SelectItem value="explanation">Explanation</SelectItem>
                            <SelectItem value="worksheet">Worksheet</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., The Solar System" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Hindi, Swahili, Spanish" {...field} />
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
                          <Input type="number" min="1" max="12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Generate Content"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="font-headline">Generated Content</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[300px] whitespace-pre-wrap font-body text-foreground/90">
              {isLoading && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
              {generatedContent ? generatedContent : !isLoading && <p className="text-muted-foreground">Your generated content will appear here.</p>}
            </CardContent>
          </Card>
        </div>
      </FeaturePage>

      <Footer />
    </div>
  );
}

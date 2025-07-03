"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateVisualAid } from "@/ai/flows/visual-aid-generation";

import { FeaturePage } from "@/components/common/FeaturePage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Paintbrush } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  prompt: z.string().min(10, "Your description should be at least 10 characters long."),
});

export default function VisualAidPage() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const result = await generateVisualAid(values);
      setGeneratedImage(result.imageUrl);
    } catch (error) {
      console.error("Error generating visual aid:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "Failed to generate the image. Please try a different prompt.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FeaturePage
      title="Visual Aid Generator"
      description="Create simple line drawings, diagrams, or charts from a text description."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline">Describe Your Visual</CardTitle>
            <CardDescription>
              e.g., "A simple black and white line drawing of the water cycle for a coloring sheet."
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the image you want to create..."
                          className="resize-none"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Generate Image"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline">Generated Visual</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[300px] flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            ) : generatedImage ? (
              <Image src={generatedImage} alt="Generated visual aid" width={512} height={512} className="rounded-lg border-2 border-muted-foreground/20 object-contain" />
            ) : (
              <div className="text-center text-muted-foreground">
                <Paintbrush className="mx-auto h-12 w-12" />
                <p className="mt-2">Your generated image will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FeaturePage>
  );
}

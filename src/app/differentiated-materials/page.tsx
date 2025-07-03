"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { differentiatedWorksheetGeneration } from "@/ai/flows/differentiated-worksheet-generation";

import { Navbar } from "@/components/common/Navbar"; // ✅ Your reusable Navbar
import { Footer } from "@/components/common/Footer"; // ✅ Your reusable Footer

import { FeaturePage } from "@/components/common/FeaturePage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud } from "lucide-react";

const formSchema = z.object({
  photoDataUri: z.string().refine((val) => val.startsWith("data:image/"), {
    message: "Please upload a valid image file.",
  }),
  gradeLevels: z.string().min(1, "Please enter at least one grade level."),
});

type GeneratedWorksheets = Record<string, string>;

export default function DifferentiatedMaterialsPage() {
  const [generatedWorksheets, setGeneratedWorksheets] =
    useState<GeneratedWorksheets | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photoDataUri: "",
      gradeLevels: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        form.setValue("photoDataUri", dataUri);
        setPreview(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedWorksheets(null);
    try {
      const result = await differentiatedWorksheetGeneration(values);
      setGeneratedWorksheets(result.worksheets);
    } catch (error) {
      console.error("Error generating worksheets:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description:
          "Failed to generate worksheets. Please check your input and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Navbar at top */}
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <FeaturePage
          title="Differentiated Material Creator"
          description="Upload a photo of a textbook page to generate tailored worksheets for different grade levels."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="font-headline">
                  Create Worksheets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="photoDataUri"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Textbook Photo</FormLabel>
                          <FormControl>
                            <>
                              <Input
                                id="picture"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                              <label htmlFor="picture" className="cursor-pointer">
                                <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                  {preview ? (
                                    <Image
                                      src={preview}
                                      alt="Preview"
                                      width={400}
                                      height={300}
                                      className="mx-auto rounded-md object-contain max-h-48"
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center">
                                      <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                      <p className="mt-2 text-muted-foreground">
                                        Click to upload or drag & drop
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </label>
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gradeLevels"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Levels</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1, 3, 5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Generate Worksheets"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="font-headline">
                  Generated Worksheets
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-[300px]">
                {isLoading && (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {generatedWorksheets ? (
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(generatedWorksheets).map(
                      ([grade, content]) => (
                        <AccordionItem value={`item-${grade}`} key={grade}>
                          <AccordionTrigger className="font-headline capitalize">
                            Worksheet for {grade}
                          </AccordionTrigger>
                          <AccordionContent className="whitespace-pre-wrap font-body text-foreground/90">
                            {content}
                          </AccordionContent>
                        </AccordionItem>
                      )
                    )}
                  </Accordion>
                ) : (
                  !isLoading && (
                    <p className="text-muted-foreground">
                      Your generated worksheets will appear here, organized by
                      grade level.
                    </p>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </FeaturePage>
      </main>

      {/* ✅ Footer at bottom */}
      <Footer />
    </div>
  );
}

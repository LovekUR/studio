// src/ai/flows/visual-aid-generation.ts
'use server';

/**
 * @fileOverview Generates simple visual aids like line drawings from text prompts.
 *
 * - generateVisualAid - A function that handles the visual aid generation process.
 * - GenerateVisualAidInput - The input type for the generateVisualAid function.
 * - GenerateVisualAidOutput - The return type for the generateVisualAid function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVisualAidInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the visual aid to generate.'),
});
export type GenerateVisualAidInput = z.infer<typeof GenerateVisualAidInputSchema>;

const GenerateVisualAidOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      'A data URI containing the generated image, that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.
    ),
});
export type GenerateVisualAidOutput = z.infer<typeof GenerateVisualAidOutputSchema>;

export async function generateVisualAid(input: GenerateVisualAidInput): Promise<GenerateVisualAidOutput> {
  return generateVisualAidFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVisualAidPrompt',
  input: {schema: GenerateVisualAidInputSchema},
  output: {schema: GenerateVisualAidOutputSchema},
  prompt: `You are an AI assistant that generates simple visual aids like line drawings based on text prompts.

  Generate an image based on the following prompt: {{{prompt}}}
  Return the image as a data URI.
  `, // removed text that assumed image format
});

const generateVisualAidFlow = ai.defineFlow(
  {
    name: 'generateVisualAidFlow',
    inputSchema: GenerateVisualAidInputSchema,
    outputSchema: GenerateVisualAidOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    if (!media?.url) {
      throw new Error('No image was generated.');
    }
    return {imageUrl: media.url};
  }
);

// The `differentiatedWorksheetGeneration` flow generates differentiated worksheets for different grade levels from textbook photos.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DifferentiatedWorksheetGenerationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a textbook page, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  gradeLevels: z
    .string()
    .describe('The grade levels for which to differentiate the worksheet, comma separated.'),
});
export type DifferentiatedWorksheetGenerationInput =
  z.infer<typeof DifferentiatedWorksheetGenerationInputSchema>;

const DifferentiatedWorksheetGenerationOutputSchema = z.object({
  worksheets: z
    .record(z.string(), z.string())
    .describe('A map of grade level to worksheet content.'),
});
export type DifferentiatedWorksheetGenerationOutput =
  z.infer<typeof DifferentiatedWorksheetGenerationOutputSchema>;

export async function differentiatedWorksheetGeneration(
  input: DifferentiatedWorksheetGenerationInput
): Promise<DifferentiatedWorksheetGenerationOutput> {
  return differentiatedWorksheetGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'differentiatedWorksheetGenerationPrompt',
  input: {schema: DifferentiatedWorksheetGenerationInputSchema},
  output: {schema: DifferentiatedWorksheetGenerationOutputSchema},
  prompt: `You are an expert teacher specializing in creating differentiated worksheets for multi-grade classrooms.

You will use the textbook page photo to generate differentiated worksheets for the specified grade levels.

Grade Levels: {{{gradeLevels}}}
Photo: {{media url=photoDataUri}}

Make sure to return worksheets in a format like this:
{
   "grade1": "worksheet for grade 1",
   "grade2": "worksheet for grade 2",
}
`,
});

const differentiatedWorksheetGenerationFlow = ai.defineFlow(
  {
    name: 'differentiatedWorksheetGenerationFlow',
    inputSchema: DifferentiatedWorksheetGenerationInputSchema,
    outputSchema: DifferentiatedWorksheetGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

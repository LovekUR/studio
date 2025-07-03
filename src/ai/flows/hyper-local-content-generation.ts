// src/ai/flows/hyper-local-content-generation.ts
'use server';
/**
 * @fileOverview Generates hyper-local content (stories, explanations, worksheets) in the teacher's local language.
 *
 * - generateHyperLocalContent - A function to generate hyper-local content.
 * - HyperLocalContentInput - Input type for the generateHyperLocalContent function.
 * - HyperLocalContentOutput - Return type for the generateHyperLocalContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HyperLocalContentInputSchema = z.object({
  contentType: z.enum(['story', 'explanation', 'worksheet']).describe('The type of content to generate.'),
  topic: z.string().describe('The topic of the content.'),
  language: z.string().describe('The local language to generate the content in.'),
  gradeLevel: z.number().describe('The grade level for which the content is intended.'),
});

export type HyperLocalContentInput = z.infer<typeof HyperLocalContentInputSchema>;

const HyperLocalContentOutputSchema = z.object({
  content: z.string().describe('The generated hyper-local content.'),
});

export type HyperLocalContentOutput = z.infer<typeof HyperLocalContentOutputSchema>;

export async function generateHyperLocalContent(input: HyperLocalContentInput): Promise<HyperLocalContentOutput> {
  return hyperLocalContentFlow(input);
}

const hyperLocalContentPrompt = ai.definePrompt({
  name: 'hyperLocalContentPrompt',
  input: {schema: HyperLocalContentInputSchema},
  output: {schema: HyperLocalContentOutputSchema},
  prompt: `You are an expert in generating educational content tailored to local contexts.

  Generate a {{{contentType}}} about {{{topic}}} in {{{language}}} for grade level {{{gradeLevel}}}.
  The content should be engaging, culturally relevant, and easy to understand for students of that age.

  Content:`,
});

const hyperLocalContentFlow = ai.defineFlow(
  {
    name: 'hyperLocalContentFlow',
    inputSchema: HyperLocalContentInputSchema,
    outputSchema: HyperLocalContentOutputSchema,
  },
  async input => {
    const {output} = await hyperLocalContentPrompt(input);
    return output!;
  }
);

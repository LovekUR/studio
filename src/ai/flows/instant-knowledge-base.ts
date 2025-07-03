'use server';

/**
 * @fileOverview A flow for providing instant answers to teacher questions with simple analogies.
 *
 * - instantKnowledgeBase - A function that handles the question answering process.
 * - InstantKnowledgeBaseInput - The input type for the instantKnowledgeBase function.
 * - InstantKnowledgeBaseOutput - The return type for the instantKnowledgeBase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InstantKnowledgeBaseInputSchema = z.object({
  question: z.string().describe('The question the teacher wants answered.'),
});
export type InstantKnowledgeBaseInput = z.infer<typeof InstantKnowledgeBaseInputSchema>;

const InstantKnowledgeBaseOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, including a simple analogy.'),
});
export type InstantKnowledgeBaseOutput = z.infer<typeof InstantKnowledgeBaseOutputSchema>;

export async function instantKnowledgeBase(input: InstantKnowledgeBaseInput): Promise<InstantKnowledgeBaseOutput> {
  return instantKnowledgeBaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'instantKnowledgeBasePrompt',
  input: {schema: InstantKnowledgeBaseInputSchema},
  output: {schema: InstantKnowledgeBaseOutputSchema},
  prompt: `You are an expert in explaining complex topics with simple analogies.

  A teacher has asked the following question:
  {{question}}

  Provide a concise answer to the question, including a simple analogy to help the teacher understand and explain the concept to their students.`,
});

const instantKnowledgeBaseFlow = ai.defineFlow(
  {
    name: 'instantKnowledgeBaseFlow',
    inputSchema: InstantKnowledgeBaseInputSchema,
    outputSchema: InstantKnowledgeBaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

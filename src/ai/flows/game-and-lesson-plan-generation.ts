'use server';
/**
 * @fileOverview A game and lesson plan generation AI agent.
 *
 * - generateGameAndLessonPlan - A function that handles the game and lesson plan generation process.
 * - GenerateGameAndLessonPlanInput - The input type for the generateGameAndLessonPlan function.
 * - GenerateGameAndLessonPlanOutput - The return type for the generateGameAndLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGameAndLessonPlanInputSchema = z.object({
  topic: z.string().describe('The topic for the game and lesson plan.'),
  gradeLevel: z.string().describe('The grade level for the game and lesson plan.'),
  learningObjectives: z.string().describe('The learning objectives for the lesson.'),
  gameType: z.string().describe('The type of game to be generated (e.g., quiz, puzzle, simulation).'),
});
export type GenerateGameAndLessonPlanInput = z.infer<typeof GenerateGameAndLessonPlanInputSchema>;

const GenerateGameAndLessonPlanOutputSchema = z.object({
  lessonPlan: z.string().describe('A detailed lesson plan for the specified topic and grade level.'),
  gameDescription: z.string().describe('A description of the educational game, including rules and objectives.'),
});
export type GenerateGameAndLessonPlanOutput = z.infer<typeof GenerateGameAndLessonPlanOutputSchema>;

export async function generateGameAndLessonPlan(input: GenerateGameAndLessonPlanInput): Promise<GenerateGameAndLessonPlanOutput> {
  return generateGameAndLessonPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGameAndLessonPlanPrompt',
  input: {schema: GenerateGameAndLessonPlanInputSchema},
  output: {schema: GenerateGameAndLessonPlanOutputSchema},
  prompt: `You are an experienced educator skilled in creating engaging and effective lesson plans and educational games.

  Based on the following information, create a lesson plan and a game description:

  Topic: {{{topic}}}
  Grade Level: {{{gradeLevel}}}
  Learning Objectives: {{{learningObjectives}}}
  Game Type: {{{gameType}}}

  Ensure that the lesson plan is comprehensive and includes activities, assessments, and resources.
  The game description should detail the game's rules, objectives, and how it reinforces the learning objectives.
  `,
});

const generateGameAndLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateGameAndLessonPlanFlow',
    inputSchema: GenerateGameAndLessonPlanInputSchema,
    outputSchema: GenerateGameAndLessonPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

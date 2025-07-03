'use server';
/**
 * @fileOverview An audio reading assessment AI agent.
 *
 * - readingAssessment - A function that handles the reading assessment process.
 * - ReadingAssessmentInput - The input type for the readingAssessment function.
 * - ReadingAssessmentOutput - The return type for the readingAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReadingAssessmentInputSchema = z.object({
  passage: z.string().describe('The text passage the student was supposed to read.'),
  audioDataUri: z
    .string()
    .describe(
      "The student's reading audio, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  durationSeconds: z.number().describe('The duration of the audio recording in seconds.'),
});
export type ReadingAssessmentInput = z.infer<typeof ReadingAssessmentInputSchema>;

const ReadingAssessmentOutputSchema = z.object({
  transcript: z.string().describe("The transcription of the student's reading."),
  accuracy: z.number().min(0).max(100).describe('The percentage of words read correctly.'),
  wordsPerMinute: z.number().describe('The calculated words per minute.'),
  feedback: z.string().describe("Qualitative feedback on the student's reading performance, including areas for improvement."),
});
export type ReadingAssessmentOutput = z.infer<typeof ReadingAssessmentOutputSchema>;

export async function readingAssessment(input: ReadingAssessmentInput): Promise<ReadingAssessmentOutput> {
  return readingAssessmentFlow(input);
}

function calculateWPM(transcript: string, durationSeconds: number): number {
    if (durationSeconds <= 0) return 0;
    const words = transcript.trim().split(/\s+/).filter(Boolean).length;
    return Math.round((words / durationSeconds) * 60);
}

const prompt = ai.definePrompt({
  name: 'readingAssessmentPrompt',
  input: {schema: ReadingAssessmentInputSchema},
  output: {schema: z.object({
    transcript: z.string().describe('The transcription of the student\'s reading.'),
    accuracy: z.number().min(0).max(100).describe('The percentage of words read correctly, comparing the transcript to the original passage.'),
    feedback: z.string().describe('Qualitative, encouraging, and constructive feedback on the student\'s reading performance, including notes on pace, pronunciation, and intonation.'),
  })},
  prompt: `You are an expert reading assessment tool for young students in India.
Your task is to analyze an audio recording of a student reading a passage and provide a helpful assessment for their teacher.

1. Transcribe the audio provided. Be accurate with the transcription.
2. Compare your transcription to the original passage text provided below.
3. Calculate the accuracy as a percentage of correctly read words.
4. Provide constructive, encouraging feedback for the teacher about the student's reading. Mention specific errors if any (e.g., mispronounced words, skipped words), and suggest areas for improvement. Keep the feedback concise and actionable.

Original Passage:
"{{{passage}}}"

Student's Reading Audio:
{{media url=audioDataUri}}
`,
});

const readingAssessmentFlow = ai.defineFlow(
  {
    name: 'readingAssessmentFlow',
    inputSchema: ReadingAssessmentInputSchema,
    outputSchema: ReadingAssessmentOutputSchema,
  },
  async (input) => {
    // Gemini 1.5 Flash/Pro are good for this multimodal task.
    // The default model is `gemini-2.0-flash` which should be sufficient.
    const {output} = await prompt(input);

    if (!output) {
        throw new Error("Failed to get a response from the AI model.");
    }
    
    const wpm = calculateWPM(output.transcript, input.durationSeconds);

    return {
      ...output,
      wordsPerMinute: wpm,
    };
  }
);

'use server';

/**
 * @fileOverview Summarizes a lengthy build description for a concise preview.
 *
 * - summarizeBuildDescription - A function that summarizes the build description.
 * - SummarizeBuildDescriptionInput - The input type for the summarizeBuildDescription function.
 * - SummarizeBuildDescriptionOutput - The return type for the summarizeBuildDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeBuildDescriptionInputSchema = z.object({
  buildDescription: z
    .string()
    .describe('The lengthy description of the Minecraft build.'),
});
export type SummarizeBuildDescriptionInput = z.infer<
  typeof SummarizeBuildDescriptionInputSchema
>;

const SummarizeBuildDescriptionOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the Minecraft build description.'),
});
export type SummarizeBuildDescriptionOutput = z.infer<
  typeof SummarizeBuildDescriptionOutputSchema
>;

export async function summarizeBuildDescription(
  input: SummarizeBuildDescriptionInput
): Promise<SummarizeBuildDescriptionOutput> {
  return summarizeBuildDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeBuildDescriptionPrompt',
  input: {schema: SummarizeBuildDescriptionInputSchema},
  output: {schema: SummarizeBuildDescriptionOutputSchema},
  prompt: `Summarize the following Minecraft build description in a concise manner for use as a preview. The summary should be no more than 100 characters.\n\nBuild Description: {{{buildDescription}}}`,
});

const summarizeBuildDescriptionFlow = ai.defineFlow(
  {
    name: 'summarizeBuildDescriptionFlow',
    inputSchema: SummarizeBuildDescriptionInputSchema,
    outputSchema: SummarizeBuildDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

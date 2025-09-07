'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBuildTagsInputSchema = z.object({
  description: z.string().describe('The description of the Minecraft build.'),
  imageDataUri: z
    .string()
    .describe(
      "A photo of the Minecraft build, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateBuildTagsInput = z.infer<typeof GenerateBuildTagsInputSchema>;

const GenerateBuildTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe('An array of relevant tags for the Minecraft build.'),
});
export type GenerateBuildTagsOutput = z.infer<typeof GenerateBuildTagsOutputSchema>;

export async function generateBuildTags(input: GenerateBuildTagsInput): Promise<GenerateBuildTagsOutput> {
  return generateBuildTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBuildTagsPrompt',
  input: {schema: GenerateBuildTagsInputSchema},
  output: {schema: GenerateBuildTagsOutputSchema},
  prompt: `You are an expert in categorizing Minecraft builds. Based on the
description and image provided, generate a list of relevant tags that
can be used to improve searchability and discoverability.

Description: {{{description}}}
Image: {{media url=imageDataUri}}

Tags:`,
});

const generateBuildTagsFlow = ai.defineFlow(
  {
    name: 'generateBuildTagsFlow',
    inputSchema: GenerateBuildTagsInputSchema,
    outputSchema: GenerateBuildTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

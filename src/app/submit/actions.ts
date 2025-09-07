'use server';

import { z } from 'zod';
import { addBuild } from '@/lib/data';
import { summarizeBuildDescription } from '@/ai/flows/summarize-build-description';
import { generateBuildTags } from '@/ai/flows/generate-build-tags';
import { redirect } from 'next/navigation';

const formSchema = z.object({
  name: z.string(),
  builderName: z.string(),
  description: z.string(),
  imageDataUri: z.string(),
});

export async function submitBuild(formData: FormData) {
  const parsed = formSchema.safeParse({
    name: formData.get('name'),
    builderName: formData.get('builderName'),
    description: formData.get('description'),
    imageDataUri: formData.get('imageDataUri'),
  });

  if (!parsed.success) {
    throw new Error('Invalid form data.');
  }

  const { name, builderName, description, imageDataUri } = parsed.data;

  // Since image upload is not directly implemented, we'll use the data URI for AI processing
  // and a placeholder for the stored URL. In a real app, you would upload the image to a
  // storage service (like Firebase Storage) and get a public URL.
  // For this example, we'll use the data URI itself, which is inefficient but functional.
  const imageUrl = imageDataUri; 

  // Use GenAI to generate a summary and tags
  const [summaryResult, tagsResult] = await Promise.all([
    summarizeBuildDescription({ buildDescription: description }),
    generateBuildTags({ description, imageDataUri }),
  ]);

  const summary = summaryResult.summary;
  const tags = tagsResult.tags;

  await addBuild({
    name,
    builderName,
    description,
    imageUrl,
    summary,
    tags,
    status: 'pending',
  });

  // No need to redirect from here, the client-side router will handle it after the promise resolves.
  // This allows us to show a success toast.
}

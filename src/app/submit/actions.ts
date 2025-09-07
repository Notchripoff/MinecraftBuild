'use server';

import { z } from 'zod';
import { addBuild } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { summarizeBuildDescription } from '@/ai/flows/summarize-build-description';
import { generateBuildTags } from '@/ai/flows/generate-build-tags';

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

  const imageUrl = imageDataUri; 

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
    status: 'approved',
  });
}

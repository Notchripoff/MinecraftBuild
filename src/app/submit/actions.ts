'use server';

import { z } from 'zod';
import { addBuild } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { summarizeBuildDescription } from '@/ai/flows/summarize-build-description';
import { generateBuildTags } from '@/ai/flows/generate-build-tags';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary at the module level to ensure it's loaded for the server action.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const formSchema = z.object({
  name: z.string(),
  builderName: z.string(),
  description: z.string(),
  image: z.instanceof(File),
});

async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

async function uploadToCloudinary(dataUri: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'vava-showcase',
      tags: ['minecraft-build'],
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary.');
  }
}

export async function submitBuild(formData: FormData) {
  const parsed = formSchema.safeParse({
    name: formData.get('name'),
    builderName: formData.get('builderName'),
    description: formData.get('description'),
    image: formData.get('image'),
  });

  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error('Invalid form data.');
  }

  const { name, builderName, description, image } = parsed.data;

  const imageDataUri = await fileToDataUri(image);
  const imageUrl = await uploadToCloudinary(imageDataUri);

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

  revalidatePath('/');
}

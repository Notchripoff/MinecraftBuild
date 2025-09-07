'use server';

import { z } from 'zod';
import { addBuild } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { summarizeBuildDescription } from '@/ai/flows/summarize-build-description';
import { generateBuildTags } from '@/ai/flows/generate-build-tags';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

async function uploadToCloudinary(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                tags: ['minecraft-build'],
                folder: 'vava-showcase'
            },
            (error, result) => {
                if (error) {
                    reject(new Error('Failed to upload image to Cloudinary.'));
                } else if (result) {
                    resolve(result.secure_url);
                } else {
                    reject(new Error('Cloudinary upload resulted in no error and no result.'));
                }
            }
        );
        uploadStream.end(buffer);
    });
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

  const [imageUrl, imageDataUri] = await Promise.all([
    uploadToCloudinary(image),
    fileToDataUri(image)
  ]);
  
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

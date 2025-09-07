'use server';

import { addLike, addComment } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const commentSchema = z.object({
  author: z.string().min(2, 'Name must be at least 2 characters.'),
  comment: z.string().min(3, 'Comment must be at least 3 characters.'),
});

export async function likeBuild(buildId: string) {
  try {
    await addLike(buildId);
    revalidatePath(`/build/${buildId}`);
  } catch (error) {
    console.error('Failed to like build:', error);
    throw new Error('Something went wrong, please try again.');
  }
}

export async function commentOnBuild(buildId: string, formData: FormData) {
  const parsed = commentSchema.safeParse({
    author: formData.get('author'),
    comment: formData.get('comment'),
  });

  if (!parsed.success) {
    const errorMessages = parsed.error.issues.map((issue) => issue.message).join(', ');
    throw new Error(errorMessages);
  }

  const { author, comment } = parsed.data;

  try {
    await addComment(buildId, author, comment);
    revalidatePath(`/build/${buildId}`);
  } catch (error) {
    console.error('Failed to add comment:', error);
    throw new Error('Something went wrong, please try again.');
  }
}

'use server';

import { revalidatePath } from 'next/cache';
import { updateBuild, deleteBuild as dbDeleteBuild } from '@/lib/data';

export async function approveBuild(id: string) {
  const result = await updateBuild(id, { status: 'approved' });
  if (!result) {
    throw new Error('Build not found');
  }
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function deleteBuild(id: string) {
  const success = await dbDeleteBuild(id);
  if (!success) {
    throw new Error('Failed to delete build');
  }
  revalidatePath('/admin');
  revalidatePath('/');
}

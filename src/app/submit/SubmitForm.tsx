'use client';

import { useState, useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { submitBuild } from './actions';
import { Upload, X, ImagePlus } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const formSchema = z.object({
  name: z.string().min(3, 'Build name must be at least 3 characters.'),
  builderName: z.string().min(2, 'Builder name must be at least 2 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  image: z
    .instanceof(File, { message: 'Please upload an image.' })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'Image must be under 5MB.'
    )
    .refine(
      (file) => ['image/png', 'image/jpeg', 'image/webp'].includes(file.type),
      'Image must be a PNG, JPG, or WebP file.'
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function SubmitForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      builderName: '',
      description: '',
      image: undefined,
    },
  });

  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      form.setValue('image', file, { shouldValidate: true });
    } else {
      setImagePreview(null);
      form.setValue('image', undefined, { shouldValidate: true });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileChange(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    multiple: false,
    maxSize: MAX_FILE_SIZE,
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('builderName', values.builderName);
      formData.append('description', values.description);
      formData.append('image', values.image);

      try {
        await submitBuild(formData);
        toast({
          title: 'Submission Successful!',
          description: 'Your build has been submitted and is now live.',
          className: 'bg-green-500 text-white',
        });
        router.push('/');
      } catch (error) {
        console.error(error);
        toast({
          title: 'Submission Failed',
          description: (error as Error).message || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    });
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Build Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Floating Celestial Castle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="builderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Builder's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your in-game name or nickname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your build. What makes it special? What materials did you use?"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Build Image</FormLabel>
                  <FormControl>
                    <div
                      {...getRootProps()}
                      className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 text-center transition ${
                        isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
                      }`}
                    >
                      <input {...getInputProps()} onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
                      <ImagePlus className="mb-2 h-10 w-10 text-muted-foreground" />
                      {isDragActive ? (
                        <p className="text-sm text-primary">Drop your image here ...</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Drag & drop an image here, or click to select
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>A beautiful screenshot of your creation. Max 5MB.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {imagePreview && (
              <div className="space-y-2">
                <FormLabel>Image Preview</FormLabel>
                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                  <Image
                    src={imagePreview}
                    alt="Preview of uploaded build"
                    fill
                    className="object-cover"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                    onClick={() => handleFileChange(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Submit Build
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

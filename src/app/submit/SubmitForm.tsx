'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
import { Upload } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, 'Build name must be at least 3 characters.'),
  builderName: z.string().min(2, 'Builder name must be at least 2 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  image: z.any().refine((files) => files?.length === 1, 'An image is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SubmitForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  async function onSubmit(values: FormValues) {
    if (!imagePreview) {
      toast({
        title: 'Image Error',
        description: 'Image preview is not available. Please re-select the image.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('builderName', values.builderName);
    formData.append('description', values.description);
    formData.append('imageDataUri', imagePreview);

    try {
      await submitBuild(formData);

      toast({
        title: 'Submission Successful!',
        description: 'Your build has been submitted for approval.',
        className: 'bg-green-500 text-white',
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
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
                    <Input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        handleImageChange(e);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    A beautiful screenshot of your creation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {imagePreview && (
              <div className="space-y-2">
                <FormLabel>Image Preview</FormLabel>
                <div className="aspect-video relative w-full overflow-hidden rounded-md border">
                  <Image src={imagePreview} alt="Preview of uploaded build" fill className="object-cover" />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : <> <Upload className="mr-2 h-4 w-4" /> Submit Build </>}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

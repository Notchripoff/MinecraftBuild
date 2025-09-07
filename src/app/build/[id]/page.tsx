import { getBuildById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

type BuildPageProps = {
  params: {
    id: string;
  };
};

export default async function BuildPage({ params }: BuildPageProps) {
  const build = await getBuildById(params.id);

  if (!build) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="aspect-[16/9] relative w-full">
          <Image
            src={build.imageUrl}
            alt={`Image of ${build.name}`}
            fill
            className="object-cover"
            priority
            data-ai-hint="minecraft build"
          />
          {build.status === 'pending' && (
             <div className="absolute top-4 left-4">
                <Badge className="bg-yellow-500 text-white">Pending Approval</Badge>
             </div>
          )}
        </div>
        <div className="p-6 md:p-8 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold font-headline">{build.name}</h1>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Built by {build.builderName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(build.createdAt, 'MMMM d, yyyy')}</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2 font-headline">About this build</h2>
            <p className="text-foreground/80 whitespace-pre-wrap">{build.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 font-headline">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {build.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

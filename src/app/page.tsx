import { getBuilds } from '@/lib/data';
import BuildGallery from '@/components/BuildGallery';

export default async function HomePage() {
  const allBuilds = await getBuilds();
  const approvedBuilds = allBuilds
    .filter((build) => build.status === 'approved')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
          K12 VAVA Community Builds
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore the amazing creations from our school's Minecraft community. Search for your
          favorite builds and get inspired for your next project!
        </p>
      </div>
      <BuildGallery builds={approvedBuilds} />
    </div>
  );
}

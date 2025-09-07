import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function CreditsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Credits</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          This project was made possible by the following people.
        </p>
      </div>

      <div className="animate-fade-in-up animation-delay-200">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border shadow-lg">
          <Image
            src="https://picsum.photos/1280/720"
            alt="A beautiful Minecraft build"
            fill
            className="object-cover"
            data-ai-hint="minecraft build"
            priority
          />
        </div>
      </div>

      <Card className="animate-fade-in-up animation-delay-300">
        <CardHeader>
          <CardTitle>Development Team</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg">
          <p>
            <span className="font-semibold">Frontend & Design:</span> Jackson
          </p>
          <p>
            <span className="font-semibold">Backend & Infrastructure:</span> Brikari
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

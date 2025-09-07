import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreditsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Credits</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          This project was made possible by the following people.
        </p>
      </div>
      <Card className="animate-fade-in-up animation-delay-200">
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

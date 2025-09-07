'use client';

import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const themes = [
  { name: 'Light', value: 'light' },
  { name: 'Dark', value: 'dark' },
  { name: 'Crimson', value: 'theme-crimson' },
  { name: 'Forest', value: 'theme-forest' },
];

export default function ThemePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle>Customize Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Select a theme to change the appearance of the application.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {themes.map((t) => (
              <Button
                key={t.value}
                variant="outline"
                onClick={() => setTheme(t.value)}
                className={cn(
                  'h-12 justify-between transition-all duration-300 transform hover:scale-105',
                  theme === t.value && 'ring-2 ring-primary'
                )}
              >
                {t.name}
                {theme === t.value && <Check className="h-5 w-5 text-primary" />}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

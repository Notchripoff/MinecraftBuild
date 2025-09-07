'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Palette, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const themes = [
  { name: 'Light', value: 'light' },
  { name: 'Dark', value: 'dark' },
  { name: 'Crimson', value: 'theme-crimson' },
  { name: 'Forest', value: 'theme-forest' },
];

function hexToHsl(hex: string): string {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}


export default function ThemePage() {
  const { theme, setTheme } = useTheme();
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  
  // Load saved values from localStorage on mount
  useEffect(() => {
    const savedColor = localStorage.getItem('primary-color');
    const savedBg = localStorage.getItem('background-image');

    if (savedColor) {
      setPrimaryColor(savedColor);
      document.documentElement.style.setProperty('--primary', hexToHsl(savedColor));
    }
    if (savedBg) {
      setBackgroundImage(savedBg);
    }
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setPrimaryColor(newColor);
    document.documentElement.style.setProperty('--primary', hexToHsl(newColor));
    localStorage.setItem('primary-color', newColor);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBackgroundImage(result);
        localStorage.setItem('background-image', result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearBackgroundImage = () => {
    setBackgroundImage(null);
    localStorage.removeItem('background-image');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle>Customize Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-muted-foreground">Select a base theme</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
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
          </div>

          <Separator />
          
          <div className="space-y-4">
             <Label htmlFor="color-picker" className="flex items-center gap-2 text-muted-foreground">
              <Palette className="w-5 h-5" />
              Custom Primary Color
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="color-picker"
                type="color"
                value={primaryColor}
                onChange={handleColorChange}
                className="h-12 w-20 p-1"
              />
              <span className="font-mono text-sm bg-muted px-3 py-2 rounded-md">{primaryColor.toUpperCase()}</span>
            </div>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <Label htmlFor="background-picker" className="flex items-center gap-2 text-muted-foreground">
              <ImageIcon className="w-5 h-5" />
              Custom Background
            </Label>
             <div className="flex items-center gap-4">
              <Input
                id="background-picker"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {backgroundImage && (
                <Button variant="ghost" size="icon" onClick={clearBackgroundImage}>
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

        </CardContent>
      </Card>
      {/* This style tag applies the background image */}
      {backgroundImage && (
        <style>
          {`
            body {
              background-image: url(${backgroundImage});
              background-size: cover;
              background-position: center;
              background-attachment: fixed;
            }
            :root, .dark, .theme-crimson, .theme-forest {
              --background: transparent;
            }
            .bg-card, .bg-popover, .bg-background {
               background-color: hsla(var(--background-opaque, 0 0% 100% / 0.8));
               backdrop-filter: blur(8px);
            }
            .bg-muted {
               background-color: hsla(var(--muted-opaque, 210 40% 96.1% / 0.8));
            }

            .dark .bg-card, .dark .bg-popover, .dark .bg-background {
               background-color: hsla(var(--background-opaque, 222.2 84% 4.9% / 0.8));
            }
            .dark .bg-muted {
               background-color: hsla(var(--muted-opaque, 217.2 32.6% 17.5% / 0.8));
            }
            .theme-crimson .bg-card, .theme-crimson .bg-popover, .theme-crimson .bg-background {
              background-color: hsla(var(--background-opaque, 0 0% 12% / 0.8));
            }
            .theme-crimson .bg-muted {
              background-color: hsla(var(--muted-opaque, 0 0% 20% / 0.8));
            }
            .theme-forest .bg-card, .theme-forest .bg-popover, .theme-forest .bg-background {
              background-color: hsla(var(--background-opaque, 210 30% 20% / 0.8));
            }
            .theme-forest .bg-muted {
              background-color: hsla(var(--muted-opaque, 200 40% 25% / 0.8));
            }
          `}
        </style>
      )}
    </div>
  );
}

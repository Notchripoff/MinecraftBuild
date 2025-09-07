'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Palette, Image as ImageIcon, X, Droplets, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const themes = [
  { name: 'System', value: 'system', icon: Monitor },
  { name: 'Light', value: 'light', icon: Sun },
  { name: 'Dark', value: 'dark', icon: Palette },
  { name: 'Crimson', value: 'theme-crimson', icon: Palette },
  { name: 'Forest', value: 'theme-forest', icon: Palette },
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
  const [mounted, setMounted] = useState(false);
  
  const [primaryColor, setPrimaryColor] = useState('#1c7ed6');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundBlur, setBackgroundBlur] = useState(0);
  const [backgroundBrightness, setBackgroundBrightness] = useState(100);
  const [backgroundSize, setBackgroundSize] = useState('cover');

  useEffect(() => {
    setMounted(true);

    const savedColor = localStorage.getItem('primary-color');
    const savedBg = localStorage.getItem('background-image');
    const savedBlur = localStorage.getItem('background-blur');
    const savedBrightness = localStorage.getItem('background-brightness');
    const savedSize = localStorage.getItem('background-size');

    if (savedColor) handleColorChange(savedColor, false);
    if (savedBg) handleImageChange(savedBg, false);
    if (savedBlur) handleBlurChange([parseInt(savedBlur, 10)], false);
    if (savedBrightness) handleBrightnessChange([parseInt(savedBrightness, 10)], false);
    if (savedSize) handleSizeChange(savedSize, false);
  }, []);

  const setCssVariable = (property: string, value: string) => {
    document.documentElement.style.setProperty(property, value);
  };
  
  const handleColorChange = (newColor: string, save = true) => {
    setPrimaryColor(newColor);
    setCssVariable('--primary', hexToHsl(newColor));
    if (save) localStorage.setItem('primary-color', newColor);
  };

  const handleImageChange = (fileOrUrl: File | string | null, save = true) => {
    if (typeof fileOrUrl === 'string') {
      setBackgroundImage(fileOrUrl);
      setCssVariable('--background-image', `url(${fileOrUrl})`);
      if (save) localStorage.setItem('background-image', fileOrUrl);
    } else if (fileOrUrl) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        handleImageChange(result, save);
      };
      reader.readAsDataURL(fileOrUrl);
    } else {
       setBackgroundImage(null);
       document.documentElement.style.removeProperty('--background-image');
       if(save) localStorage.removeItem('background-image');
    }
  };

  const handleBlurChange = (value: number[], save = true) => {
    const [blurValue] = value;
    setBackgroundBlur(blurValue);
    setCssVariable('--background-blur', `${blurValue}px`);
    if (save) localStorage.setItem('background-blur', blurValue.toString());
  };

  const handleBrightnessChange = (value: number[], save = true) => {
    const [brightnessValue] = value;
    setBackgroundBrightness(brightnessValue);
    setCssVariable('--background-brightness', `${brightnessValue}%`);
    if (save) localStorage.setItem('background-brightness', brightnessValue.toString());
  };

  const handleSizeChange = (value: string, save = true) => {
    setBackgroundSize(value);
    setCssVariable('--background-size', value);
    if (save) localStorage.setItem('background-size', value);
  };

  const clearBackgroundImage = () => {
    handleImageChange(null);
  };

  if (!mounted) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
       <div className="text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Customize Your Experience</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Personalize the look and feel of the application to match your style.
        </p>
      </div>

      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>Select a base theme and customize the primary color.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div>
            <Label className="text-sm font-medium">Base Theme</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {themes.map((t) => (
                <Button
                  key={t.value}
                  variant="outline"
                  onClick={() => setTheme(t.value)}
                  className={cn(
                    'h-12 justify-start gap-3 px-4 transition-all duration-300 transform hover:scale-105',
                    theme === t.value && 'ring-2 ring-primary'
                  )}
                >
                  <t.icon className="w-5 h-5" />
                  <span>{t.name}</span>
                  {theme === t.value && <Check className="h-5 w-5 text-primary ml-auto" />}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label htmlFor="color-picker" className="flex items-center gap-2 font-medium">
              <Palette className="w-5 h-5" />
              Primary Color
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="color-picker"
                type="color"
                value={primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-12 w-20 p-1 cursor-pointer"
              />
              <div className="w-full h-12 rounded-md border" style={{ backgroundColor: primaryColor }} />
            </div>
          </div>

        </CardContent>
      </Card>
      
      <Card className="animate-fade-in-up animation-delay-200">
        <CardHeader>
          <CardTitle>Background Settings</CardTitle>
          <CardDescription>Upload a custom background and adjust its appearance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="space-y-4">
              <Label htmlFor="background-picker" className="flex items-center gap-2 font-medium">
                <ImageIcon className="w-5 h-5" />
                Custom Background Image
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="background-picker"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                            file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground 
                            hover:file:bg-primary/90"
                />
                {backgroundImage && (
                  <Button variant="ghost" size="icon" onClick={clearBackgroundImage} aria-label="Clear background">
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
              {backgroundImage && (
                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                    <img
                      src={backgroundImage}
                      alt="Background Preview"
                      className="w-full h-full object-cover"
                    />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2 font-medium">
                <Droplets className="w-5 h-5" />
                Background Blur ({backgroundBlur}px)
              </Label>
              <Slider
                value={[backgroundBlur]}
                onValueChange={handleBlurChange}
                max={40}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2 font-medium">
                <Sun className="w-5 h-5" />
                Background Brightness ({backgroundBrightness}%)
              </Label>
              <Slider
                value={[backgroundBrightness]}
                onValueChange={handleBrightnessChange}
                min={20}
                max={100}
                step={5}
              />
            </div>

             <div className="space-y-4">
              <Label className="flex items-center gap-2 font-medium">
                Background Size
              </Label>
               <Select value={backgroundSize} onValueChange={handleSizeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

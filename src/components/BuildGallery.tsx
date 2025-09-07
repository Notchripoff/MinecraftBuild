'use client';

import { useState, useMemo } from 'react';
import type { Build } from '@/lib/types';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Search } from 'lucide-react';

export default function BuildGallery({ builds }: { builds: Build[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBuilds = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    if (!lowercasedTerm) return builds;
    return builds.filter(
      (build) =>
        build.name.toLowerCase().includes(lowercasedTerm) ||
        build.builderName.toLowerCase().includes(lowercasedTerm) ||
        build.description.toLowerCase().includes(lowercasedTerm) ||
        build.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))
    );
  }, [builds, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-lg mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search builds by name, builder, or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 w-full"
        />
      </div>
      {filteredBuilds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuilds.map((build) => (
            <Link key={build.id} href={`/build/${build.id}`} passHref>
              <Card className="h-full flex flex-col group overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader className="p-0">
                  <div className="aspect-[16/9] relative w-full overflow-hidden">
                    <Image
                      src={build.imageUrl}
                      alt={`Image of ${build.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint="minecraft build"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pt-6">
                  <h3 className="text-lg font-bold font-headline">{build.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">By {build.builderName}</p>
                  <p className="mt-2 text-sm line-clamp-2">{build.summary}</p>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    {build.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg">
          <h3 className="text-xl font-semibold">No builds found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or check back later!
          </p>
        </div>
      )}
    </div>
  );
}

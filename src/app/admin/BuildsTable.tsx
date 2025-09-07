'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { approveBuild, deleteBuild as deleteBuildAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import type { Build } from '@/lib/types';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Trash2, ExternalLink } from 'lucide-react';

export default function BuildsTable({ builds }: { builds: Build[] }) {
  const pendingBuilds = builds.filter((b) => b.status === 'pending');
  const approvedBuilds = builds.filter((b) => b.status === 'approved');

  return (
    <Card>
      <CardContent className="p-0">
        <Tabs defaultValue="pending">
          <div className="p-4 border-b">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pendingBuilds.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedBuilds.length})</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="pending" className="m-0">
            <BuildsList builds={pendingBuilds} />
          </TabsContent>
          <TabsContent value="approved" className="m-0">
            <BuildsList builds={approvedBuilds} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function BuildsList({ builds }: { builds: Build[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: string) => {
    startTransition(async () => {
      try {
        await approveBuild(id);
        toast({ title: 'Success', description: 'Build approved and is now public.' });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to approve build.',
          variant: 'destructive',
        });
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this build? This cannot be undone.')) {
      startTransition(async () => {
        try {
          await deleteBuildAction(id);
          toast({ title: 'Success', description: 'Build has been deleted.' });
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to delete build.',
            variant: 'destructive',
          });
        }
      });
    }
  };

  if (builds.length === 0) {
    return <p className="p-8 text-center text-muted-foreground">No builds in this category.</p>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Builder</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {builds.map((build) => (
            <TableRow key={build.id}>
              <TableCell className="font-medium">{build.name}</TableCell>
              <TableCell>{build.builderName}</TableCell>
              <TableCell>{format(new Date(build.createdAt), 'dd MMM yyyy')}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  {build.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleApprove(build.id)}
                      disabled={isPending}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  )}
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/build/${build.id}`} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(build.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

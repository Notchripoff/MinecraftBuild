import { getBuilds } from '@/lib/data';
import BuildsTable from './BuildsTable';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const allBuilds = await getBuilds();
  const sortedBuilds = [...allBuilds].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage community build submissions.
        </p>
      </div>
      <BuildsTable builds={sortedBuilds} />
    </div>
  );
}

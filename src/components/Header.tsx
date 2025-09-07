import Link from 'next/link';
import { Button } from './ui/button';
import { Box } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Button variant="ghost" asChild>
    <Link
      href={href}
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  </Button>
);

const Header = () => {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Box className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-bold font-headline text-foreground">
              BlockVerse Showcase
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-2">
              <NavLink href="/">Gallery</NavLink>
              <NavLink href="/admin">Admin</NavLink>
            </nav>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/submit">Submit Build</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;

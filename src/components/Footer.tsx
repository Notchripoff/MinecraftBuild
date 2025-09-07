import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-card/80 backdrop-blur-sm border-t mt-auto">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          © {new Date().getFullYear()} K12 VAVA Showcase. Built for the school's Minecraft
          masters.
        </p>
        <Link href="/credits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Credits
        </Link>
      </div>
    </footer>
  );
};
export default Footer;

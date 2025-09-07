const Footer = () => {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BlockVerse Showcase. Built for the school's Minecraft
          masters.
        </p>
      </div>
    </footer>
  );
};
export default Footer;

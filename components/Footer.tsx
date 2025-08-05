import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-muted py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4 italic">
            "Happiness is not something ready-made. It comes from your own actions."
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Moodify. Designed to brighten your day!
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
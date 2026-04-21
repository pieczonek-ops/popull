import { Globe, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest w-full border-t border-outline flex flex-col items-center gap-6 py-12 mt-20">
      <div className="max-w-screen-2xl w-full px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <Link to="/" className="text-lg font-bold text-on-surface uppercase tracking-widest italic no-underline">The Editorial Pulse</Link>
        <nav className="flex flex-wrap justify-center gap-8">
          <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium no-underline" to="/">O nas</Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium no-underline" to="/">Prywatność</Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium no-underline" to="/">Reklama</Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium no-underline" to="/">Kontakt</Link>
        </nav>
        <div className="flex gap-4">
          <a className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all no-underline" href="#">
            <Globe className="w-4 h-4" />
          </a>
          <a className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all no-underline" href="#">
            <Share2 className="w-4 h-4" />
          </a>
        </div>
      </div>
      <p className="text-xs text-on-surface-variant">© 2024 The Editorial Pulse. Kinetic Broadsheet Media.</p>
    </footer>
  );
}

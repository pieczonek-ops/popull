import { Home, TrendingUp, Film, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-low/80 backdrop-blur-md border-t border-outline flex justify-around items-center py-3 z-50">
      <Link className="flex flex-col items-center gap-1 text-primary" to="/">
        <Home className="w-5 h-5 fill-primary" />
        <span className="text-[10px] font-bold">Start</span>
      </Link>
      <Link className="flex flex-col items-center gap-1 text-on-surface-variant" to="/">
        <TrendingUp className="w-5 h-5" />
        <span className="text-[10px] font-medium">Trendy</span>
      </Link>
      <Link className="flex flex-col items-center gap-1 text-on-surface-variant" to="/">
        <Film className="w-5 h-5" />
        <span className="text-[10px] font-medium">Kategorie</span>
      </Link>
      <Link className="flex flex-col items-center gap-1 text-on-surface-variant" to="/admin">
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium">Profil</span>
      </Link>
    </nav>
  );
}

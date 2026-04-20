import { Home, TrendingUp, Film, User } from 'lucide-react';

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-low/80 backdrop-blur-xl border-t border-white/5 flex justify-around items-center py-3 z-50">
      <a className="flex flex-col items-center gap-1 text-primary" href="#">
        <Home className="w-5 h-5 fill-primary" />
        <span className="text-[10px] font-bold">Start</span>
      </a>
      <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
        <TrendingUp className="w-5 h-5" />
        <span className="text-[10px] font-medium">Trendy</span>
      </a>
      <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
        <Film className="w-5 h-5" />
        <span className="text-[10px] font-medium">Kategorie</span>
      </a>
      <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium">Profil</span>
      </a>
    </nav>
  );
}

import { Search, Sun, Moon, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 z-50 w-full bg-surface/80 backdrop-blur-xl border-b border-outline">
      <div className="flex justify-between items-center px-6 py-4 w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4 lg:gap-8">
          <span className="text-2xl font-black italic tracking-tighter text-primary uppercase">The Pulse</span>
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-primary border-b-2 border-primary font-bold py-1" href="#home">Trendujące</a>
            <a className="text-on-surface-variant font-medium hover:text-on-surface transition-all duration-300 px-2 rounded-lg" href="#category/Rozrywka">Rozrywka</a>
            <a className="text-on-surface-variant font-medium hover:text-on-surface transition-all duration-300 px-2 rounded-lg" href="#category/Technologia">Technologia</a>
            <a className="text-on-surface-variant font-medium hover:text-on-surface transition-all duration-300 px-2 rounded-lg" href="#category/Świat">Świat</a>
          </nav>
        </div>
        <div className="flex items-center gap-4 flex-1 max-w-md ml-4">
          <div className="relative w-full hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
            <input 
              className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 focus:bg-surface-container-lowest transition-all outline-none" 
              placeholder="Szukaj newsów..." 
              type="text"
            />
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
            title={theme === 'light' ? 'Przełącz na tryb ciemny' : 'Przełącz na tryb jasny'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <a href="#admin" className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-highest transition-all px-4 py-2 rounded-full border border-white/5">
            <User className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest hidden lg:block">
              {user ? 'Panel' : 'Zaloguj'}
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}

import { Link } from 'react-router-dom';
import { Pen, Sun, Moon } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function Navbar() {
  const { theme, setTheme } = useAppStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14">
      <div
        className="h-full px-6 flex items-center justify-between border-b"
        style={{ 
          background: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
          backdropFilter: 'blur(12px)', 
          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' 
        }}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
            <Pen className="w-3.5 h-3.5 text-white dark:text-black" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-neutral-900 dark:text-white">
            ai2human
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </nav>
  );
}

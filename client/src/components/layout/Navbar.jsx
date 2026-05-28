import { Link } from 'react-router-dom';
import { Pen } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14">
      <div
        className="h-full px-6 flex items-center justify-between border-b"
        style={{ background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
            <Pen className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-white">
            ai2human
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500 hidden sm:block">Personal Tool</span>
        </div>
      </div>
    </nav>
  );
}

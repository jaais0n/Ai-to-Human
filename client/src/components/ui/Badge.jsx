import { motion } from 'framer-motion';

export default function Badge({ children, color = 'indigo', className = '' }) {
  const colors = {
    indigo: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    green: 'bg-green-500/15 text-green-400 border-green-500/25',
    yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
    red: 'bg-red-500/15 text-red-400 border-red-500/25',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
    slate: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.indigo} ${className}`}
    >
      {children}
    </span>
  );
}

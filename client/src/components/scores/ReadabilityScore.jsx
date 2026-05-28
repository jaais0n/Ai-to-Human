import { motion } from 'framer-motion';

export default function ReadabilityScore({ data }) {
  if (!data) {
    return (
      <div className="glass-card rounded-xl p-3 border border-white/5">
        <p className="text-xs text-slate-600 mb-1.5">Readability</p>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full w-0 rounded-full" />
        </div>
        <p className="text-xs text-slate-700 mt-1.5">—</p>
      </div>
    );
  }

  const { score, label, gradeLevel } = data;
  const color =
    score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="glass-card rounded-xl p-3 border border-white/5">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs text-slate-500">Readability</p>
        <motion.span
          className="text-sm font-bold"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {score}
        </motion.span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        />
      </div>
      <p className="text-xs mt-1.5" style={{ color }}>
        {label}
      </p>
      <p className="text-xs text-slate-700 mt-0.5">{gradeLevel}</p>
    </div>
  );
}

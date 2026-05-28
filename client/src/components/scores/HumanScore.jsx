import { motion } from 'framer-motion';
import { getScoreLabel } from '../../utils/humanScore';

export default function HumanScore({ score }) {
  if (score === null || score === undefined) {
    return (
      <div className="glass-card rounded-xl p-3 border border-white/5">
        <p className="text-xs text-slate-600 mb-1.5">Human Score</p>
        <div className="h-1.5 rounded-full bg-[var(--accent-dim)] overflow-hidden">
          <div className="h-full w-0 rounded-full" />
        </div>
        <p className="text-xs text-slate-700 mt-1.5">—</p>
      </div>
    );
  }

  const { label, color } = getScoreLabel(score);

  return (
    <div className="glass-card rounded-xl p-3 border border-white/5">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs text-slate-500">Human Score</p>
        <motion.span
          className="text-lg font-semibold text-[var(--text-primary)]"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {score}%
        </motion.span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--accent-dim)] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <p className="text-xs mt-1.5" style={{ color }}>
        {label}
      </p>
      <p className="text-xs text-slate-700 mt-0.5">est. heuristic</p>
    </div>
  );
}

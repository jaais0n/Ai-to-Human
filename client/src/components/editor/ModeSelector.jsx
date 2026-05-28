import { motion } from 'framer-motion';
import useAppStore from '../../store/useAppStore';

const MODES = [
  { id: 'standard', label: 'Standard' },
  { id: 'professional', label: 'Professional' },
  { id: 'casual', label: 'Casual' },
  { id: 'academic', label: 'Academic' },
  { id: 'seo', label: 'SEO' },
];

export default function ModeSelector() {
  const { mode, setMode } = useAppStore();

  return (
    <div className="flex flex-wrap gap-1.5">
      {MODES.map((m) => {
        const isActive = mode === m.id;
        return (
          <motion.button
            key={m.id}
            onClick={() => setMode(m.id)}
            whileTap={{ scale: 0.97 }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              isActive
                ? 'bg-white text-black'
                : 'text-neutral-500 hover:text-white hover:bg-white/5'
            }`}
            aria-pressed={isActive}
          >
            {m.label}
          </motion.button>
        );
      })}
    </div>
  );
}

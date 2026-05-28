import { motion } from 'framer-motion';
import { PenTool, Loader2 } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { useHumanize } from '../../hooks/useHumanize';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useMemo } from 'react';

export default function HumanizeButton() {
  const { isLoading, inputText } = useAppStore();
  const { humanize } = useHumanize();

  useKeyboardShortcuts(
    useMemo(
      () => [{ key: 'Enter', ctrl: true, action: humanize }],
      [humanize]
    )
  );

  const isDisabled = isLoading || !inputText.trim();

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        id="humanize-btn"
        onClick={humanize}
        disabled={isDisabled}
        whileHover={{ scale: isDisabled ? 1 : 1.03 }}
        whileTap={{ scale: isDisabled ? 1 : 0.97 }}
        className={`btn-primary flex items-center gap-2.5 px-7 py-3.5 text-sm ${
          isDisabled ? '' : ''
        }`}
        aria-label="Humanize content"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <PenTool className="w-4 h-4" />
        )}
        <span>{isLoading ? 'Processing...' : 'Rewrite'}</span>
      </motion.button>

      <p className="text-[11px] text-neutral-700">
        <kbd className="px-1 py-0.5 rounded bg-[var(--accent-dim)] border border-[var(--border-subtle)] font-mono text-[11px]">Ctrl</kbd>
        {' + '}
        <kbd className="px-1 py-0.5 rounded bg-[var(--accent-dim)] border border-[var(--border-subtle)] font-mono text-[11px]">Enter</kbd>
      </p>
    </div>
  );
}

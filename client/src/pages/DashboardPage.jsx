import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Diff } from 'lucide-react';
import InputPanel from '../components/editor/InputPanel';
import OutputPanel from '../components/editor/OutputPanel';
import HumanizeButton from '../components/editor/HumanizeButton';
import ModeSelector from '../components/editor/ModeSelector';
import ControlPanel from '../components/editor/ControlPanel';
import HistoryPanel from '../components/history/HistoryPanel';
import DiffViewer from '../components/editor/DiffViewer';
import useAppStore from '../store/useAppStore';
import { useHumanize } from '../hooks/useHumanize';

export default function DashboardPage() {
  const [showHistory, setShowHistory] = useState(false);
  const { showDiff, setShowDiff, inputText, outputText, mode, strength, creativity, complexity, tone } = useAppStore();
  const { humanize } = useHumanize();

  useEffect(() => {
    // Only auto-trigger if an output already exists (meaning the user is tweaking settings for an active text)
    if (outputText && inputText) {
      const timer = setTimeout(() => {
        humanize();
      }, 800); // 800ms debounce
      return () => clearTimeout(timer);
    }
  }, [mode, strength, creativity, complexity, tone]);

  return (
    <div className="min-h-screen pt-18 pb-8 px-4 md:px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Top controls bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 mb-4"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <ModeSelector />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {inputText && outputText && (
                <button
                  onClick={() => setShowDiff(!showDiff)}
                  className={`btn-ghost flex items-center gap-1.5 px-3 py-2 ${
                    showDiff ? 'bg-[var(--accent-dim)] border-[var(--border-hover)] text-[var(--text-primary)]' : ''
                  }`}
                >
                  <Diff className="w-3.5 h-3.5" />
                  Diff
                </button>
              )}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`btn-ghost flex items-center gap-1.5 px-3 py-2 ${
                  showHistory ? 'bg-[var(--accent-dim)] border-[var(--border-hover)] text-[var(--text-primary)]' : ''
                }`}
              >
                <History className="w-3.5 h-3.5" />
                History
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main layout */}
        <div className="flex gap-4">
          {/* Editor area */}
          <div className="flex-1 min-w-0">
            {showDiff && inputText && outputText ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-5 mb-4"
              >
                <DiffViewer original={inputText} modified={outputText} />
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
                {/* Left panel */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="card p-5 min-h-[500px]"
                >
                  <InputPanel />
                </motion.div>

                {/* Center button */}
                <div className="flex items-center justify-center md:pt-20">
                  <HumanizeButton />
                </div>

                {/* Right panel */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="card p-5 min-h-[500px]"
                >
                  <OutputPanel />
                </motion.div>
              </div>
            )}

            {/* Advanced controls */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <ControlPanel />
            </motion.div>
          </div>

          {/* History sidebar */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '300px' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 overflow-hidden"
              >
                <div className="card p-5 h-full min-h-[500px] w-[300px]">
                  <HistoryPanel onClose={() => setShowHistory(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

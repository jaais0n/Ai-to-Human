import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, X, Clock, ChevronRight } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function HistoryPanel({ onClose }) {
  const { history, removeFromHistory, clearHistory, setInputText, setOutputText } = useAppStore();

  const loadEntry = (entry) => {
    setInputText(entry.inputText);
    setOutputText(entry.outputText);
    onClose?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-neutral-500" />
          <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500">History</h3>
          <span className="text-[11px] text-neutral-700">({history.length})</span>
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-[11px] text-neutral-600 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-600 hover:text-[var(--text-primary)] hover:bg-[var(--accent-dim)] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent-dim)] flex items-center justify-center">
            <Clock className="w-4 h-4 text-neutral-700" />
          </div>
          <p className="text-xs text-neutral-700">No history yet</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-1.5">
          <AnimatePresence>
            {history.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card-inner rounded-lg p-3 hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer group"
                onClick={() => loadEntry(entry)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-[var(--accent-dim)] text-neutral-500 capitalize">
                        {entry.mode}
                      </span>
                      <span className="text-[11px] text-neutral-700">{entry.wordCount}w</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate">{entry.outputText}</p>
                    <p className="text-[11px] text-neutral-700 mt-1 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatDate(entry.timestamp)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFromHistory(entry.id); }}
                      className="p-1 rounded-md text-neutral-700 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-700" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

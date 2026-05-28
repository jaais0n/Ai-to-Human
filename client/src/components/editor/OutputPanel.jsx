import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Download, CheckCheck, Wand2 } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import { useWordCount } from '../../hooks/useWordCount';
import { downloadText } from '../../utils/fileParser';
import { SkeletonBlock } from '../ui/Skeleton';

export default function OutputPanel() {
  const {
    outputText,
    isLoading,
    exportFormat,
    addToast,
  } = useAppStore();

  const [copied, setCopied] = useState(false);
  const { displayed, isTyping } = useTypingEffect(outputText, 6, !!outputText);
  const { words } = useWordCount(outputText);

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    addToast({ type: 'success', message: 'Copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    downloadText(outputText, 'humanized-content', exportFormat || 'txt');
    addToast({ type: 'success', message: `Downloaded as .${exportFormat || 'txt'}` });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-500">Output</h2>
          {isTyping && (
            <span className="text-[11px] text-neutral-500" style={{ animation: 'pulse-subtle 1.5s ease infinite' }}>
              writing...
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {outputText && (
            <>
              <button onClick={handleCopy} className="btn-ghost flex items-center gap-1.5 px-2 py-1.5">
                {copied ? <CheckCheck className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button onClick={handleDownload} className="btn-ghost flex items-center gap-1.5 px-2 py-1.5">
                <Download className="w-3 h-3" />
                Export
              </button>
            </>
          )}
        </div>
      </div>

      {/* Output area */}
      <div className="relative flex-1 card-inner rounded-xl p-4 overflow-hidden transition-all duration-200">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-transparent animate-spin" />
                <span className="text-xs text-neutral-500">Processing...</span>
              </div>
              <SkeletonBlock />
            </motion.div>
          ) : outputText ? (
            <motion.div
              key="output"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full overflow-y-auto"
            >
              <p
                className={`text-sm leading-relaxed text-neutral-200 whitespace-pre-wrap ${isTyping ? 'typing-cursor' : ''}`}
              >
                {displayed}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center gap-3 text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-neutral-600" />
              </div>
              <p className="text-sm text-neutral-600">
                Output will appear here
              </p>
              <p className="text-[11px] text-neutral-700">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[11px]">Ctrl+Enter</kbd> to run
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Word count */}
      {outputText && (
        <div className="mt-2.5 text-[11px] text-neutral-600">
          {words.toLocaleString()} words
        </div>
      )}
    </div>
  );
}

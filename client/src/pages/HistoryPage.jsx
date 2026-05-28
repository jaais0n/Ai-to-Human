import { motion } from 'framer-motion';
import HistoryPanel from '../components/history/HistoryPanel';
import useAppStore from '../store/useAppStore';

export default function HistoryPage() {
  const { history } = useAppStore();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-2">History</h1>
          <p className="text-sm text-slate-400">
            Your last {history.length} humanization sessions. Click any entry to reload it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl border border-white/5 p-6 min-h-[400px]"
        >
          <HistoryPanel />
        </motion.div>
      </div>
    </div>
  );
}

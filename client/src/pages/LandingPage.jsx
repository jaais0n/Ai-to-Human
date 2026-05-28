import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PenTool, ArrowRight, ShieldCheck, FileText, Settings2,
  CheckCircle2
} from 'lucide-react';

const features = [
  {
    icon: PenTool,
    title: 'Natural Phrasing',
    desc: 'Transforms mechanical structures into authentic, flowing prose.',
  },
  {
    icon: Settings2,
    title: 'Precise Controls',
    desc: 'Six distinct stylistic modes ranging from professional to casual.',
  },
  {
    icon: FileText,
    title: 'Readability Focused',
    desc: 'Automatically improves Flesch-Kincaid scores and eliminates clichés.',
  },
  {
    icon: ShieldCheck,
    title: 'Bypass Detectors',
    desc: 'Creates writing indistinguishable from human authors.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black selection:bg-black/20 dark:selection:bg-white/20 selection:text-black dark:selection:text-white">
      {/* Subtle grid background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 pt-32 pb-24 px-6 md:px-12 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mt-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-neutral-200 dark:border-white/10 rounded-full text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 dark:bg-white animate-pulse" />
              Editorial Grade Engine
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-6 leading-[1.1]">
              Write like a human.
            </h1>

            <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto mb-10 leading-relaxed font-light">
              A minimalist, high-fidelity tool to rewrite, refine, and humanize your content. 
              Designed for writers who demand authenticity.
            </p>

            <div className="flex justify-center">
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-8 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                >
                  Open Workspace
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="w-full max-w-5xl mx-auto grid md:grid-cols-2 gap-px bg-neutral-200 dark:bg-white/10 border border-neutral-200 dark:border-white/10 rounded-2xl overflow-hidden mb-24">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="bg-white dark:bg-black p-10 flex flex-col"
            >
              <f.icon className="w-5 h-5 text-neutral-400 mb-6" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-[280px]">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Minimal checklist */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-2xl mx-auto border border-neutral-200 dark:border-white/10 rounded-2xl p-10 bg-neutral-50 dark:bg-[#050505]"
        >
          <div className="flex flex-col items-center mb-8">
            <h2 className="font-medium text-neutral-900 dark:text-white text-xl">The Standard</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
            {[
              'Varies sentence length naturally',
              'Removes repetitive AI patterns',
              'Maintains original context',
              'Six tailored editorial modes',
              'Real-time readability metrics',
              'Clean, distraction-free editor',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-400">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-32 mb-12 text-center"
        >
          <Link to="/dashboard" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2">
            Start writing <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

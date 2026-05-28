import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, Zap, Shield, Brain, Layers,
  CheckCircle, Star
} from 'lucide-react';
import ParticleBackground from '../components/particles/ParticleBackground';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Rewriting',
    desc: 'GPT-4o transforms robotic prose into authentic, human-sounding content instantly.',
    color: '#6366f1',
  },
  {
    icon: Layers,
    title: '6 Humanization Modes',
    desc: 'Standard, Professional, Casual, LinkedIn, SEO, and Academic — each with tailored prompts.',
    color: '#3b82f6',
  },
  {
    icon: Zap,
    title: 'Real-Time Analysis',
    desc: 'Human Score, Flesch-Kincaid readability, and tone detection in seconds.',
    color: '#a78bfa',
  },
  {
    icon: Shield,
    title: 'Advanced Controls',
    desc: 'Dial in strength, creativity, and complexity with precision sliders.',
    color: '#34d399',
  },
];

const modes = ['Standard', 'Professional', 'Casual', 'LinkedIn', 'SEO', 'Academic'];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground />

      {/* Gradient orbs */}
      <div className="fixed top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
      <div className="fixed bottom-20 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }} />

      <div className="relative z-10 pt-24 pb-20 px-4">
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-500/20 text-sm text-indigo-300 mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Powered by GPT-4o</span>
              <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-slate-400">Personal Edition</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">
              <span className="text-white">Make AI Writing</span>
              <br />
              <span className="text-gradient">Sound Human</span>
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Transform robotic, AI-generated content into natural, authentic writing
              that flows like a real person wrote it. Six modes, infinite possibilities.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-gradient flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white shadow-glow animate-gradient"
                >
                  <Sparkles className="w-4 h-4" />
                  Start Humanizing
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>

            </div>
          </motion.div>

          {/* Mode pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mt-12"
          >
            {modes.map((m, i) => (
              <motion.span
                key={m}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="px-3 py-1.5 rounded-full glass-card border border-white/8 text-xs text-slate-400"
              >
                {m} Mode
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Features grid */}
        <div className="max-w-5xl mx-auto mt-24 grid md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              className="glass-card rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}20`, border: `1px solid ${f.color}30` }}
              >
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-2xl mx-auto mt-20 glass-card rounded-3xl p-8 border border-indigo-500/15"
        >
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-400" />
            <h2 className="font-bold text-white text-lg">What ai2human Does</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Rewrites robotic AI sentences',
              'Adds natural sentence variation',
              'Removes AI cliché phrases',
              'Improves readability score',
              'Preserves original meaning',
              'Works in 6 writing modes',
              'Provides Human Score estimate',
              'Auto-saves your history',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-sm text-slate-300">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-white/5">
            <p className="text-xs text-slate-600 text-center">
              ⚠️ Results may vary depending on AI detector platforms.
              This tool is for writing quality improvement only.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center mt-16"
        >
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-gradient flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-white shadow-glow mx-auto text-base"
            >
              Open Dashboard
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

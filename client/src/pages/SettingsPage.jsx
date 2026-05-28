import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Key, Palette, Download, Sliders, Eye, EyeOff,
  Save, CheckCircle, AlertCircle, RefreshCw,
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { checkHealth } from '../services/humanize.service';

const MODES = ['standard', 'professional', 'casual', 'linkedin', 'seo', 'academic'];
const FORMATS = ['txt', 'md'];

function Section({ icon: Icon, title, children, color = '#6366f1' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl border border-white/5 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <h2 className="font-semibold text-white text-sm">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

export default function SettingsPage() {
  const {
    theme, setTheme,
    exportFormat, setExportFormat,
    defaultMode, setDefaultMode,
    addToast,
  } = useAppStore();

  const [testStatus, setTestStatus] = useState(null); // 'ok' | 'error' | 'loading'

  const testConnection = async () => {
    setTestStatus('loading');
    try {
      await checkHealth();
      setTestStatus('ok');
      addToast({ type: 'success', message: 'Backend connected successfully!' });
    } catch {
      setTestStatus('error');
      addToast({ type: 'error', message: 'Could not connect to backend. Is the server running?' });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
          <p className="text-sm text-slate-400">Configure your preferences and writing defaults.</p>
        </motion.div>

        <div className="space-y-5">
          {/* Backend Connection Test */}
          <Section icon={RefreshCw} title="Backend Connection" color="#6366f1">
            <p className="text-xs text-slate-500 mb-4">
              Test your local backend connection to ensure the humanization algorithm is reachable.
            </p>
            <div className="flex gap-2">
              <button
                onClick={testConnection}
                disabled={testStatus === 'loading'}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white glass-card border border-white/8 hover:border-white/15 transition-all"
              >
                {testStatus === 'loading' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                Test Connection
              </button>
              {testStatus === 'ok' && (
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <CheckCircle className="w-3.5 h-3.5" /> Connected
                </span>
              )}
              {testStatus === 'error' && (
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="w-3.5 h-3.5" /> Failed
                </span>
              )}
            </div>
          </Section>

          {/* Theme */}
          <Section icon={Palette} title="Appearance" color="#3b82f6">
            <div className="flex gap-3">
              {['dark', 'light'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all capitalize ${
                    theme === t
                      ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                      : 'bg-white/3 border-white/8 text-slate-400 hover:text-white'
                  }`}
                >
                  {t === 'dark' ? '🌙 Dark' : '☀️ Light'}
                </button>
              ))}
            </div>
          </Section>

          {/* Defaults */}
          <Section icon={Sliders} title="Writing Defaults" color="#a78bfa">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 block">
                  Default Mode
                </label>
                <div className="flex flex-wrap gap-2">
                  {MODES.map((m) => (
                    <button
                      key={m}
                      onClick={() => setDefaultMode(m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all capitalize ${
                        defaultMode === m
                          ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                          : 'bg-white/3 border-white/8 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Export */}
          <Section icon={Download} title="Export Preferences" color="#34d399">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-2 block">
                Default Export Format
              </label>
              <div className="flex gap-3">
                {FORMATS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setExportFormat(f)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all uppercase ${
                      exportFormat === f
                        ? 'bg-green-500/20 border-green-500/40 text-green-300'
                        : 'bg-white/3 border-white/8 text-slate-400 hover:text-white'
                    }`}
                  >
                    .{f}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          <div className="text-center pt-4">
            <p className="text-xs text-slate-700">
              All settings are stored locally in your browser. No data is sent to external servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

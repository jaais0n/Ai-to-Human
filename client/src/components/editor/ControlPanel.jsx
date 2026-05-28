import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { useState } from 'react';

function Slider({ label, value, onChange, min = 0, max = 100, step = 1, description }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-neutral-400">{label}</label>
        <span className="text-xs font-mono text-neutral-500">{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{
          background: `linear-gradient(to right, var(--slider-filled) 0%, var(--slider-filled) ${value}%, var(--slider-empty) ${value}%, var(--slider-empty) 100%)`,
        }}
      />
      {description && (
        <p className="text-[11px] text-neutral-700">{description}</p>
      )}
    </div>
  );
}

export default function ControlPanel() {
  const {
    strength, setStrength,
    creativity, setCreativity,
    complexity, setComplexity,
    tone, setTone,
  } = useAppStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-medium text-neutral-500 hover:text-neutral-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Advanced
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/5">
          <div className="pt-4 space-y-5">
            <Slider
              label="Strength"
              value={strength}
              onChange={setStrength}
              description="How aggressively to rewrite"
            />
            <Slider
              label="Creativity"
              value={creativity}
              onChange={setCreativity}
              description="Freedom to deviate from original"
            />
            <Slider
              label="Complexity"
              value={complexity}
              onChange={setComplexity}
              description="Simple vs. sophisticated sentences"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-400">Tone</label>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="e.g. friendly, authoritative..."
              className="w-full px-3 py-2 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder-neutral-500 outline-none focus:border-[var(--border-hover)] transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  );
}

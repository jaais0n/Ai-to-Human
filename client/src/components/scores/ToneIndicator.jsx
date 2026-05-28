const TONE_COLORS = {
  Professional: '#60a5fa',
  Casual: '#a78bfa',
  Academic: '#34d399',
  Persuasive: '#f472b6',
  Informative: '#fb923c',
  Neutral: '#94a3b8',
};

const TONE_EMOJIS = {
  Professional: '💼',
  Casual: '😊',
  Academic: '🎓',
  Persuasive: '🎯',
  Informative: '📊',
  Neutral: '⚖️',
};

export default function ToneIndicator({ tone }) {
  if (!tone) {
    return (
      <div className="glass-card rounded-xl p-3 border border-white/5">
        <p className="text-xs text-slate-600 mb-1.5">Tone</p>
        <div className="h-6 flex items-center">
          <span className="text-xs text-slate-700">—</span>
        </div>
      </div>
    );
  }

  const color = TONE_COLORS[tone] || '#94a3b8';
  const emoji = TONE_EMOJIS[tone] || '⚖️';

  return (
    <div className="glass-card rounded-xl p-3 border border-white/5">
      <p className="text-xs text-slate-500 mb-1.5">Tone</p>
      <div
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium border"
        style={{
          background: `${color}18`,
          borderColor: `${color}40`,
          color,
        }}
      >
        <span>{emoji}</span>
        <span>{tone}</span>
      </div>
    </div>
  );
}

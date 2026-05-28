import { useMemo } from 'react';
import { computeDiff } from '../../utils/diffHighlight';
import { GitCompare } from 'lucide-react';

export default function DiffViewer({ original, modified }) {
  const diffTokens = useMemo(
    () => computeDiff(original, modified),
    [original, modified]
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <GitCompare className="w-4 h-4 text-neutral-400" />
        <h3 className="text-sm font-medium text-[var(--text-primary)]">Changes</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Original */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
            <p className="text-xs font-medium text-neutral-500">Original</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-sm text-neutral-500 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
            {original}
          </div>
        </div>

        {/* Modified */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
            <p className="text-xs font-medium text-neutral-500">Humanized</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] leading-relaxed max-h-72 overflow-y-auto">
            {diffTokens.map((token, i) => (
              token.type === 'added' ? (
                <mark
                  key={i}
                  className="bg-green-500/10 text-green-300 rounded px-0.5 border-b border-green-500/30 not-italic"
                >
                  {token.text}
                </mark>
              ) : (
                <span key={i}>{token.text}</span>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

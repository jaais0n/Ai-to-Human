/**
 * Simple word-level diff to highlight changed portions
 */
export function computeDiff(original, modified) {
  if (!original || !modified) return [];

  const origWords = original.split(/(\s+)/);
  const modWords = modified.split(/(\s+)/);

  // LCS-based diff (simplified for performance)
  const result = [];
  const origSet = new Set(origWords.map((w) => w.toLowerCase().trim()).filter(Boolean));
  const modSet = new Set(modWords.map((w) => w.toLowerCase().trim()).filter(Boolean));

  for (const word of modWords) {
    const trimmed = word.toLowerCase().trim();
    if (!trimmed) {
      result.push({ type: 'unchanged', text: word });
    } else if (!origSet.has(trimmed)) {
      result.push({ type: 'added', text: word });
    } else {
      result.push({ type: 'unchanged', text: word });
    }
  }

  return result;
}

export function highlightDiff(diffTokens) {
  return diffTokens.map((token, i) => {
    if (token.type === 'added') {
      return `<mark class="diff-added" key="${i}">${escapeHtml(token.text)}</mark>`;
    }
    return escapeHtml(token.text);
  }).join('');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

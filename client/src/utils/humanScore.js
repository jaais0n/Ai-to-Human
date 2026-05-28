/**
 * Heuristic human score calculator
 * Analyzes text for variety, naturalness, and complexity
 */
export function calculateHumanScore(text) {
  if (!text || text.trim().length < 50) return null;

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length < 2) return 60;

  // 1. Sentence length variance (humans vary more)
  const lengths = sentences.map((s) => s.trim().split(/\s+/).length);
  const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance =
    lengths.reduce((a, b) => a + Math.pow(b - avgLen, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);
  const lengthVarianceScore = Math.min(stdDev * 4, 30); // max 30 pts

  // 2. Vocabulary diversity (type-token ratio)
  const words = text
    .toLowerCase()
    .match(/\b[a-z]{3,}\b/g) || [];
  const uniqueWords = new Set(words);
  const ttr = uniqueWords.size / Math.max(words.length, 1);
  const vocabScore = Math.min(ttr * 60, 25); // max 25 pts

  // 3. Penalty for known AI phrases
  const aiPhrases = [
    'delve', 'tapestry', 'comprehensive', 'crucial', 'it is worth noting',
    'in today\'s world', 'in conclusion', 'furthermore', 'moreover', 'notably',
    'leverage', 'utilize', 'in summary', 'to summarize', 'as an ai',
    'i cannot', 'it is important to note', 'in the realm of',
  ];
  const aiPenalty = aiPhrases.reduce((penalty, phrase) => {
    const count = (text.toLowerCase().match(new RegExp(phrase, 'g')) || []).length;
    return penalty + count * 3;
  }, 0);

  // 4. Contraction usage (human-like)
  const contractions = (text.match(/\b(don't|can't|won't|isn't|aren't|it's|you're|we're|they're|I'm|I've|I'll|you'll|we'll|they'll)\b/gi) || []).length;
  const contractionScore = Math.min(contractions * 2, 15); // max 15 pts

  // 5. Question and exclamation variety
  const questions = (text.match(/\?/g) || []).length;
  const exclamations = (text.match(/!/g) || []).length;
  const punctuationVariety = Math.min((questions + exclamations) * 2, 10); // max 10 pts

  const rawScore =
    lengthVarianceScore +
    vocabScore +
    contractionScore +
    punctuationVariety -
    aiPenalty;

  // Normalize to 55–98 range (humanized text is never perfect)
  const normalizedScore = Math.max(55, Math.min(98, 55 + rawScore));
  return Math.round(normalizedScore);
}

export function getScoreLabel(score) {
  if (score >= 90) return { label: 'Highly Human', color: '#22c55e' };
  if (score >= 75) return { label: 'Mostly Human', color: '#84cc16' };
  if (score >= 60) return { label: 'Somewhat Human', color: '#f59e0b' };
  return { label: 'Mostly AI', color: '#ef4444' };
}

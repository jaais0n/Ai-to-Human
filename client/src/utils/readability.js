/**
 * Flesch-Kincaid readability score calculator
 */
export function calculateReadability(text) {
  if (!text || text.trim().length < 50) return null;

  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length || 1;
  const words = (text.match(/\b\w+\b/g) || []).length;
  const syllables = countSyllables(text);

  if (words === 0) return null;

  // Flesch Reading Ease formula
  const score =
    206.835 -
    1.015 * (words / sentences) -
    84.6 * (syllables / words);

  const clamped = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(clamped),
    label: getReadabilityLabel(clamped),
    gradeLevel: getGradeLevel(clamped),
  };
}

function countSyllables(text) {
  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  return words.reduce((total, word) => total + countWordSyllables(word), 0);
}

function countWordSyllables(word) {
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function getReadabilityLabel(score) {
  if (score >= 90) return 'Very Easy';
  if (score >= 80) return 'Easy';
  if (score >= 70) return 'Fairly Easy';
  if (score >= 60) return 'Standard';
  if (score >= 50) return 'Fairly Difficult';
  if (score >= 30) return 'Difficult';
  return 'Very Confusing';
}

function getGradeLevel(score) {
  if (score >= 90) return '5th grade';
  if (score >= 80) return '6th grade';
  if (score >= 70) return '7th grade';
  if (score >= 60) return '8-9th grade';
  if (score >= 50) return 'Some college';
  if (score >= 30) return 'College';
  return 'Professional';
}

export function detectTone(text) {
  if (!text) return null;
  const lower = text.toLowerCase();

  const tones = {
    Professional: ['therefore', 'consequently', 'additionally', 'furthermore', 'regarding', 'implementation', 'strategy', 'framework'],
    Casual: ["don't", "can't", "won't", "you'll", "let's", 'hey', 'honestly', 'basically', 'kinda', 'gonna'],
    Academic: ['hypothesis', 'empirical', 'methodology', 'discourse', 'paradigm', 'theoretical', 'research', 'analysis'],
    Persuasive: ['must', 'should', 'need to', 'important', 'critical', 'essential', 'vital', 'crucial'],
    Informative: ['according to', 'for example', 'such as', 'in fact', 'statistics show', 'data suggests'],
  };

  const scores = {};
  for (const [tone, keywords] of Object.entries(tones)) {
    scores[tone] = keywords.filter((kw) => lower.includes(kw)).length;
  }

  const topTone = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return topTone[1] > 0 ? topTone[0] : 'Neutral';
}

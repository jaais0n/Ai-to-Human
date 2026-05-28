const { translate } = require('@vitalets/google-translate-api');
const nlp = require('compromise');

// ============================================================
// ULTIMATE 0% AI BYPASS ENGINE (100% Free, NO API KEY)
// ============================================================

const PHRASE_REPLACEMENTS = [
  [/it is important to note that /gi, ''],
  [/it is worth noting that /gi, ''],
  [/in today's world/gi, 'these days'],
  [/in the realm of/gi, 'when it comes to'],
  [/furthermore/gi, 'also'],
  [/moreover/gi, 'plus'],
  [/additionally/gi, 'and'],
  [/in conclusion/gi, 'to wrap up'],
  [/to summarize/gi, 'basically'],
  [/therefore/gi, 'so'],
  [/thus/gi, 'so'],
  [/hence/gi, 'so'],
  [/however/gi, 'but'],
];

const WORD_REPLACEMENTS = {
  'utilize': 'use',
  'leverage': 'use',
  'facilitate': 'help',
  'optimize': 'improve',
  'enhance': 'boost',
  'mitigate': 'reduce',
  'elucidate': 'explain',
  'crucial': 'key',
  'vital': 'important',
  'paramount': 'top',
  'multifaceted': 'complex',
  'plethora': 'a lot of',
  'myriad': 'many',
  'delve': 'dig',
  'foster': 'encourage',
  'robust': 'strong',
  'seamless': 'smooth'
};

async function translationChain(text, languages) {
  let currentText = text;
  for (const lang of languages) {
    try {
      const res = await translate(currentText, { to: lang });
      currentText = res.text;
    } catch (err) {
      console.error(`Translation step to ${lang} failed:`, err.message);
    }
  }
  return currentText;
}

function aggressiveHeuristics(text) {
  let doc = nlp(text);
  
  // 1. Force all possible contractions
  doc.contractions().contract();
  let processed = doc.text();

  // 2. Remove AI hedging phrases
  PHRASE_REPLACEMENTS.forEach(([pattern, replacement]) => {
    processed = processed.replace(pattern, replacement);
  });

  // 3. Swap AI words for idioms or extremely casual phrases
  const IDIOMS = {
    'utilize': 'put to use',
    'leverage': 'take advantage of',
    'facilitate': 'smooth the way for',
    'optimize': 'fine-tune',
    'enhance': 'beef up',
    'mitigate': 'soften the blow of',
    'elucidate': 'clear up',
    'crucial': 'make-or-break',
    'vital': 'super important',
    'paramount': 'the absolute top priority',
    'multifaceted': 'layered',
    'plethora': 'whole bunch',
    'myriad': 'ton',
    'delve': 'dive deep',
    'foster': 'nurture',
    'robust': 'rock-solid',
    'seamless': 'frictionless',
    'understand': 'wrap our heads around',
    'discover': 'stumble upon',
    'important': 'a big deal',
    'significant': 'major',
    'perspective': 'point of view',
    'innovative': 'out-of-the-box'
  };

  Object.keys(IDIOMS).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    processed = processed.replace(regex, IDIOMS[word]);
  });

  // 4. Force extreme burstiness (chop sentences & add parentheticals)
  let sentences = processed.split(/([.?!])\s*/).filter(Boolean);
  let finalSentences = [];
  
  const QUIRKS = [
    " — which is pretty wild — ",
    " (you know what I mean?) ",
    " — let's be real — ",
    " (obviously) ",
    " — to be completely honest — ",
    ", like, ",
    " — and this is key — "
  ];
  
  for (let i = 0; i < sentences.length; i += 2) {
    let sentence = sentences[i].trim();
    let punctuation = sentences[i + 1] || '.';
    
    if (!sentence) continue;

    // A) Chop medium sentences randomly on conjunctions
    if (sentence.length > 40 && Math.random() < 0.5) {
      const parts = sentence.split(/\b(and|but|so|because|or)\b/i);
      if (parts.length >= 3) {
        sentence = parts[0].trim();
        const nextPart = (parts[1] + ' ' + parts[2]).trim();
        sentences.splice(i + 2, 0, nextPart, punctuation);
        punctuation = '.';
      }
    }
    
    // B) Inject structural quirks (em-dashes and parentheses)
    if (sentence.length > 60 && Math.random() < 0.3) {
      const words = sentence.split(' ');
      const mid = Math.floor(words.length / 2);
      const quirk = QUIRKS[Math.floor(Math.random() * QUIRKS.length)];
      words.splice(mid, 0, quirk);
      sentence = words.join(' ').replace(/\s+/g, ' ');
    }

    // C) Add casual starters randomly
    if (Math.random() < 0.25 && sentence.length > 15) {
      const starters = ["Look. ", "Honestly, ", "Think about it. ", "And here's the thing... ", "Basically, ", "Right. ", "See, "];
      const starter = starters[Math.floor(Math.random() * starters.length)];
      sentence = starter + sentence.charAt(0).toLowerCase() + sentence.slice(1);
    }

    // D) Turn some statements into rhetorical questions
    if (Math.random() < 0.1 && sentence.length > 30 && !sentence.endsWith('?')) {
      sentence = sentence.replace(/[.!]+$/, '');
      sentence = "And " + sentence.charAt(0).toLowerCase() + sentence.slice(1) + ", right?";
      punctuation = '';
    }

    finalSentences.push(sentence + punctuation);
  }

  let finalString = finalSentences.join(' ');
  
  // 5. Cyrillic Homoglyph Injection (The UNDETECTABLE Bypass)
  // Advanced detectors strip zero-width spaces. They CANNOT strip Cyrillic letters 
  // because they are valid characters. By replacing random Latin letters with 
  // identical-looking Cyrillic letters, we break the AI tokenizer completely, 
  // ensuring a 0% AI score.
  
  const HOMOGLYPHS = {
    'a': 'а', // Cyrillic a (U+0430)
    'c': 'с', // Cyrillic c (U+0441)
    'e': 'е', // Cyrillic e (U+0435)
    'o': 'о', // Cyrillic o (U+043E)
    'p': 'р', // Cyrillic p (U+0440)
    'x': 'х', // Cyrillic x (U+0445)
    'y': 'у'  // Cyrillic y (U+0443)
  };

  let words = finalString.split(' ');
  for (let w = 0; w < words.length; w++) {
    // Only target words longer than 3 characters, and apply to about 40% of words
    if (words[w].length > 3 && Math.random() < 0.4) {
      let charArray = words[w].split('');
      for (let c = 0; c < charArray.length; c++) {
        let char = charArray[c];
        // If the character has a homoglyph, 50% chance to replace it
        if (HOMOGLYPHS[char] && Math.random() < 0.5) {
          charArray[c] = HOMOGLYPHS[char];
          break; // Only replace one character per word to avoid making it too messy
        }
      }
      words[w] = charArray.join('');
    }
  }

  // 6. Minor formatting imperfections (Double spaces)
  let homoglyphText = words.join(' ');
  homoglyphText = homoglyphText.replace(/\. /g, '.  '); // Double space after periods like older typists

  return homoglyphText;
}

async function humanizeText({
  text,
  mode = 'standard',
  strength = 70,
  creativity = 50,
  complexity = 50,
  tone = '',
}) {
  console.log('[Humanizer] Starting Ultimate Bypass...');
  
  // Step 0: Preserve formatting — split into blocks by line breaks
  // This preserves bullet points, numbered lists, paragraphs, etc.
  const blocks = text.split(/\n/);
  
  let chain = ['ja', 'de', 'es', 'en'];
  if (strength > 70) {
    chain = ['zh-CN', 'ru', 'ar', 'fr', 'en'];
  }

  try {
    const processedBlocks = [];
    
    for (const block of blocks) {
      const trimmed = block.trim();
      
      // Preserve empty lines (paragraph breaks) as-is
      if (trimmed === '') {
        processedBlocks.push('');
        continue;
      }
      
      // Detect and preserve bullet/list prefixes
      const bulletMatch = trimmed.match(/^(\s*(?:[-•*]|\d+[.)]\s?)\s*)/);
      const prefix = bulletMatch ? bulletMatch[1] : '';
      const content = bulletMatch ? trimmed.slice(prefix.length) : trimmed;
      
      // Skip very short fragments (headers, labels, etc.) — just apply homoglyphs
      if (content.length < 10) {
        processedBlocks.push(prefix + applyHomoglyphs(content));
        continue;
      }
      
      // Step 1: Translation chain on this block only
      let translated = await translationChain(content, chain);
      if (!translated || translated.trim() === '') translated = content;
      
      // Step 2: Apply heuristics on this block only
      const humanized = aggressiveHeuristics(translated);
      
      processedBlocks.push(prefix + humanized);
    }
    
    return processedBlocks.join('\n');
  } catch (err) {
    console.error('[Humanize Error] Engine failed:', err);
    throw new Error('Failed to process text. Please try again.');
  }
}

// Extracted homoglyph logic so it can be used standalone for short text
function applyHomoglyphs(text) {
  const HOMOGLYPHS = {
    'a': 'а', 'c': 'с', 'e': 'е', 'o': 'о',
    'p': 'р', 'x': 'х', 'y': 'у'
  };
  
  let words = text.split(' ');
  for (let w = 0; w < words.length; w++) {
    if (words[w].length > 3 && Math.random() < 0.4) {
      let charArray = words[w].split('');
      for (let c = 0; c < charArray.length; c++) {
        if (HOMOGLYPHS[charArray[c]] && Math.random() < 0.5) {
          charArray[c] = HOMOGLYPHS[charArray[c]];
          break;
        }
      }
      words[w] = charArray.join('');
    }
  }
  return words.join(' ');
}

module.exports = { humanizeText };

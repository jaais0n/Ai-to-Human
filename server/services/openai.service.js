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

function aggressiveHeuristics(text, creativity = 50, complexity = 50, tone = '') {
  let doc = nlp(text);
  
  // 1. Force all possible contractions
  doc.contractions().contract();
  let processed = doc.text();

  // 2. Remove AI hedging phrases
  PHRASE_REPLACEMENTS.forEach(([pattern, replacement]) => {
    processed = processed.replace(pattern, replacement);
  });

  // 3. Swap AI words for idioms or extremely casual phrases
  // If complexity is high (>70), don't swap to very casual idioms
  if (complexity < 70) {
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
  }

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
  
  // Calculate probabilities based on creativity and complexity
  const cRatio = creativity / 100;
  const chopProb = 0.5 * (1 - (complexity / 100)) * (cRatio + 0.5); // Lower complexity = higher chop
  const quirkProb = 0.3 * cRatio;
  const starterProb = 0.25 * cRatio;
  const questionProb = 0.1 * cRatio;
  
  for (let i = 0; i < sentences.length; i += 2) {
    let sentence = sentences[i].trim();
    let punctuation = sentences[i + 1] || '.';
    
    if (!sentence) continue;

    // Tone injection (prepend tone-specific starters to first sentence or randomly)
    if (tone && i === 0 && Math.random() < 0.8) {
       const lowerTone = tone.toLowerCase();
       if (lowerTone.includes('friendly') || lowerTone.includes('casual')) {
          sentence = "Hey there! " + sentence.charAt(0).toUpperCase() + sentence.slice(1);
       } else if (lowerTone.includes('professional') || lowerTone.includes('formal')) {
          sentence = "It is essential to consider that " + sentence.charAt(0).toLowerCase() + sentence.slice(1);
       }
    }

    // A) Chop medium sentences randomly on conjunctions
    if (sentence.length > 40 && Math.random() < chopProb) {
      const parts = sentence.split(/\b(and|but|so|because|or)\b/i);
      if (parts.length >= 3) {
        sentence = parts[0].trim();
        const nextPart = (parts[1] + ' ' + parts[2]).trim();
        sentences.splice(i + 2, 0, nextPart, punctuation);
        punctuation = '.';
      }
    }
    
    // B) Inject structural quirks (em-dashes and parentheses)
    if (sentence.length > 60 && Math.random() < quirkProb) {
      const words = sentence.split(' ');
      const mid = Math.floor(words.length / 2);
      const quirk = QUIRKS[Math.floor(Math.random() * QUIRKS.length)];
      words.splice(mid, 0, quirk);
      sentence = words.join(' ').replace(/\s+/g, ' ');
    }

    // C) Add casual starters randomly
    if (Math.random() < starterProb && sentence.length > 15 && complexity < 60) {
      const starters = ["Look. ", "Honestly, ", "Think about it. ", "And here's the thing... ", "Basically, ", "Right. ", "See, "];
      const starter = starters[Math.floor(Math.random() * starters.length)];
      sentence = starter + sentence.charAt(0).toLowerCase() + sentence.slice(1);
    }

    // D) Turn some statements into rhetorical questions
    if (Math.random() < questionProb && sentence.length > 30 && !sentence.endsWith('?')) {
      sentence = sentence.replace(/[.!]+$/, '');
      sentence = "And " + sentence.charAt(0).toLowerCase() + sentence.slice(1) + ", right?";
      punctuation = '';
    }

    finalSentences.push(sentence + punctuation);
  }

  let finalString = finalSentences.join(' ');
  
  // 5. Cyrillic Homoglyph Injection (The UNDETECTABLE Bypass)
  const HOMOGLYPHS = {
    'a': 'а', 'c': 'с', 'e': 'е', 'o': 'о',
    'p': 'р', 'x': 'х', 'y': 'у'
  };

  const homoProb = 0.4 * cRatio; // Higher creativity = more homoglyphs

  let words = finalString.split(' ');
  for (let w = 0; w < words.length; w++) {
    if (words[w].length > 3 && Math.random() < homoProb) {
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

  // 6. Minor formatting imperfections
  let homoglyphText = words.join(' ');
  if (creativity > 60) {
    homoglyphText = homoglyphText.replace(/\. /g, '.  '); 
  }

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
  
  const blocks = text.split(/\n/);
  
  let chain = ['ja', 'de', 'es', 'en'];
  if (strength > 70) {
    chain = ['zh-CN', 'ru', 'ar', 'fr', 'en'];
  } else if (strength < 40) {
    chain = ['es', 'en']; // lower strength = fewer translation hops
  }

  try {
    const processedBlocks = [];
    
    for (const block of blocks) {
      const trimmed = block.trim();
      
      if (trimmed === '') {
        processedBlocks.push('');
        continue;
      }
      
      const bulletMatch = trimmed.match(/^(\s*(?:[-•*]|\d+[.)]\s?)\s*)/);
      const prefix = bulletMatch ? bulletMatch[1] : '';
      const content = bulletMatch ? trimmed.slice(prefix.length) : trimmed;
      
      if (content.length < 10) {
        processedBlocks.push(prefix + applyHomoglyphs(content));
        continue;
      }
      
      let translated = await translationChain(content, chain);
      if (!translated || translated.trim() === '') translated = content;
      
      // Pass the advanced controls to the heuristics engine
      const humanized = aggressiveHeuristics(translated, creativity, complexity, tone);
      
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

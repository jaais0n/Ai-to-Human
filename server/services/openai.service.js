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
  [/delve into/gi, 'look at'],
  [/a tapestry of/gi, 'a mix of'],
  [/testament to/gi, 'proof of'],
  [/underscore the importance/gi, 'show why it matters'],
  [/at the end of the day/gi, 'ultimately'],
  [/navigate the landscape/gi, 'find your way'],
  [/shed light on/gi, 'explain'],
  [/embark on/gi, 'start'],
  [/as a matter of fact/gi, 'actually'],
  [/first and foremost/gi, 'firstly'],
  [/in light of/gi, 'because of'],
  [/in a similar vein/gi, 'similarly'],
  [/the vast majority/gi, 'most'],
  [/with that being said/gi, 'that said'],
  [/it goes without saying/gi, 'obviously'],
  [/by and large/gi, 'mostly'],
  [/for the most part/gi, 'mostly']
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
  'seamless': 'smooth',
  'comprehensive': 'full',
  'dynamic': 'active',
  'synergy': 'teamwork',
  'catalyst': 'spark',
  'holistic': 'complete',
  'paradigm': 'model',
  'inherent': 'basic',
  'resonate': 'connect',
  'align': 'match',
  'illuminating': 'helpful',
  'underscore': 'highlight',
  'testament': 'proof',
  'tapestry': 'mix',
  'bustling': 'busy'
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

  // 3a. Swap AI words for simpler synonyms globally
  Object.keys(WORD_REPLACEMENTS).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    processed = processed.replace(regex, WORD_REPLACEMENTS[word]);
  });

  // 3b. Swap AI words for idioms or extremely casual phrases
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
      'innovative': 'out-of-the-box',
      'comprehensive': 'all-around',
      'dynamic': 'ever-changing',
      'synergy': 'teamwork',
      'catalyst': 'spark',
      'holistic': 'big-picture',
      'paradigm': 'model',
      'inherent': 'built-in',
      'resonate': 'hit home',
      'align': 'match up',
      'illuminating': 'eye-opening'
    };

    Object.keys(IDIOMS).forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      processed = processed.replace(regex, IDIOMS[word]);
    });
  }

  // 3c. Drop common AI adverbs that detectors flag
  const ADVERBS_TO_DROP = [
    'significantly', 'increasingly', 'crucially', 'ultimately', 'undeniably',
    'undoubtedly', 'certainly', 'fundamentally', 'intrinsically', 'essentially',
    'consequently', 'subsequently', 'accordingly', 'notably'
  ];
  ADVERBS_TO_DROP.forEach(adv => {
    const regex = new RegExp(`\\b${adv}\\b\\s*`, 'gi');
    processed = processed.replace(regex, '');
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
  
  // Calculate probabilities based on creativity and complexity
  const cRatio = creativity / 100;
  const chopProb = 0.4 * (1 - (complexity / 100)) * (cRatio + 0.5); 
  const quirkProb = 0.15 * cRatio; 
  const starterProb = 0.2 * cRatio; 
  const questionProb = 0.15 * cRatio;
  
  for (let i = 0; i < sentences.length; i += 2) {
    let sentence = sentences[i].trim();
    let punctuation = sentences[i + 1] || '.';
    
    if (!sentence) continue;

    if (tone && i === 0 && Math.random() < 0.8) {
       const lowerTone = tone.toLowerCase();
       if (lowerTone.includes('friendly') || lowerTone.includes('casual')) {
          sentence = "Hey there! " + sentence.charAt(0).toUpperCase() + sentence.slice(1);
       } else if (lowerTone.includes('professional') || lowerTone.includes('formal')) {
          sentence = "It is essential to consider that " + sentence.charAt(0).toLowerCase() + sentence.slice(1);
       }
    }

    if (sentence.length > 40 && Math.random() < chopProb) {
      const parts = sentence.split(/\b(and|but|so|because|or)\b/i);
      if (parts.length >= 3) {
        sentence = parts[0].trim();
        const nextPart = (parts[1] + ' ' + parts[2]).trim();
        sentences.splice(i + 2, 0, nextPart, punctuation);
        punctuation = '.';
      }
    }
    
    if (sentence.length > 60 && Math.random() < quirkProb) {
      const words = sentence.split(' ');
      const mid = Math.floor(words.length / 2);
      const quirk = QUIRKS[Math.floor(Math.random() * QUIRKS.length)];
      words.splice(mid, 0, quirk);
      sentence = words.join(' ').replace(/\s+/g, ' ');
    }

    if (Math.random() < starterProb && sentence.length > 15 && complexity < 60) {
      const starters = ["Look. ", "Honestly, ", "Think about it. ", "And here's the thing... ", "Basically, ", "Right. ", "See, ", "To be fair, "];
      const starter = starters[Math.floor(Math.random() * starters.length)];
      sentence = starter + sentence.charAt(0).toLowerCase() + sentence.slice(1);
    }

    if (Math.random() < questionProb && sentence.length > 30 && !sentence.endsWith('?')) {
      sentence = sentence.replace(/[.!]+$/, '');
      sentence = "And " + sentence.charAt(0).toLowerCase() + sentence.slice(1) + ", right?";
      punctuation = '';
    }

    if (sentence.endsWith(punctuation)) punctuation = '';

    finalSentences.push(sentence + punctuation);
  }

  let finalString = finalSentences.join(' ');
  
  // Clean up excessive periods (more than 3 into exactly 3)
  finalString = finalString.replace(/\.{4,}/g, '...');
  
  // Clean up double spaces caused by slicing
  finalString = finalString.replace(/\s{2,}/g, ' ');

  return finalString.trim();
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
  
  let chain = ['nl', 'fi', 'sw', 'en'];
  if (strength > 70) {
    chain = ['zh-CN', 'so', 'la', 'fr', 'en']; // Extreme perplexity
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
        processedBlocks.push(prefix + content);
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

module.exports = { humanizeText };

const nlp = require('compromise');
const translate = require('google-translate-api-x');

// ============================================================
// HUMANIZER ENGINE v6 — TRANSLATION + AGGRESSIVE RESTRUCTURING
// 1. Translation chain (changes words)
// 2. Extreme sentence restructuring (changes burstiness + perplexity)
// No LLM needed — pure NLP + translation
// ============================================================

// =============== AI PHRASE KILLER ===============

const AI_PHRASES = [
  [/it is important to note that\s*/gi, ''],
  [/it is worth noting that\s*/gi, ''],
  [/it's worth mentioning that\s*/gi, ''],
  [/it should be noted that\s*/gi, ''],
  [/in today's world,?\s*/gi, ''],
  [/in the realm of/gi, 'in'],
  [/furthermore,?\s*/gi, ''],
  [/moreover,?\s*/gi, ''],
  [/additionally,?\s*/gi, ''],
  [/in conclusion,?\s*/gi, ''],
  [/to summarize,?\s*/gi, ''],
  [/therefore,?\s*/gi, ''],
  [/thus,?\s*/gi, ''],
  [/hence,?\s*/gi, ''],
  [/however,?\s*/gi, 'But '],
  [/nevertheless,?\s*/gi, ''],
  [/consequently,?\s*/gi, ''],
  [/subsequently,?\s*/gi, ''],
  [/delve into/gi, 'look into'],
  [/shed light on/gi, 'explain'],
  [/embark on/gi, 'start'],
  [/the vast majority of/gi, 'most'],
  [/a plethora of/gi, 'lots of'],
  [/a myriad of/gi, 'many'],
  [/plays a crucial role/gi, 'matters'],
  [/it is essential to/gi, 'you need to'],
  [/in order to/gi, 'to'],
  [/due to the fact that/gi, 'because'],
  [/at the end of the day,?\s*/gi, ''],
  [/on the other hand,?\s*/gi, ''],
  [/as a result,?\s*/gi, ''],
  [/in light of/gi, 'given'],
  [/with regard to/gi, 'about'],
  [/in terms of/gi, 'for'],
  [/it can be argued that\s*/gi, ''],
  [/it is clear that\s*/gi, ''],
  [/in summary,?\s*/gi, ''],
  [/to conclude,?\s*/gi, ''],
  [/overall,?\s*/gi, ''],
  [/it is evident that\s*/gi, ''],
  [/has the potential to/gi, 'can'],
  [/serves as a/gi, 'is a'],
  [/cannot be overstated/gi, 'matters'],
  [/at the same time,?\s*/gi, ''],
  [/as we know,?\s*/gi, ''],
  [/as mentioned earlier,?\s*/gi, ''],
  [/it goes without saying that\s*/gi, ''],
  [/needless to say,?\s*/gi, ''],
  [/in this day and age,?\s*/gi, ''],
  [/when it comes to/gi, 'with'],
  [/the fact that/gi, 'that'],
  [/in the context of/gi, 'in'],
  [/on a daily basis/gi, 'daily'],
  [/a wide range of/gi, 'many'],
  [/a large number of/gi, 'many'],
];

const AI_WORDS = {
  'utilize': 'use', 'leverage': 'use', 'facilitate': 'help',
  'optimize': 'improve', 'enhance': 'improve', 'mitigate': 'reduce',
  'elucidate': 'explain', 'delve': 'dig into', 'foster': 'grow',
  'robust': 'strong', 'seamless': 'smooth', 'paramount': 'top',
  'multifaceted': 'complex', 'holistic': 'full', 'paradigm': 'model',
  'synergy': 'teamwork', 'catalyst': 'trigger', 'bustling': 'busy',
  'tapestry': 'mix', 'underscore': 'show', 'illuminate': 'show',
  'resonate': 'connect with', 'comprehensive': 'full', 'innovative': 'new',
  'pivotal': 'key', 'intricate': 'detailed', 'realm': 'field',
  'plethora': 'tons', 'myriad': 'tons of', 'endeavor': 'effort',
  'embark': 'start', 'crucial': 'key', 'vital': 'key',
  'testament': 'proof', 'undoubtedly': '', 'significantly': '',
  'fundamentally': '', 'essentially': '', 'increasingly': '',
  'notably': '', 'crucially': '', 'intrinsically': '',
  'undeniably': '', 'certainly': '', 'inevitably': '',
  'transformative': 'big', 'revolutionize': 'change',
  'groundbreaking': 'new', 'cutting-edge': 'modern',
  'state-of-the-art': 'latest', 'unprecedented': 'new',
};

function cleanAIPhrases(text) {
  let result = text;
  AI_PHRASES.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement);
  });
  Object.keys(AI_WORDS).forEach(word => {
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi');
    result = result.replace(regex, AI_WORDS[word]);
  });
  return result.replace(/\s{2,}/g, ' ').trim();
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// =============== TRANSLATION (changes word choice) ===============

async function translateRoundTrip(text, lang) {
  try {
    const toLang = await translate(text, { from: 'en', to: lang });
    if (!toLang.text) return text;
    const backToEn = await translate(toLang.text, { from: lang, to: 'en' });
    return backToEn.text || text;
  } catch {
    return text;
  }
}

// =============== AGGRESSIVE RESTRUCTURING (changes burstiness) ===============

function splitIntoSentences(text) {
  // Better sentence splitting that handles abbreviations
  return text.match(/[^.!?]+[.!?]+/g) || [text];
}

function aggressiveRestructure(sentences) {
  const result = [];
  
  for (let i = 0; i < sentences.length; i++) {
    let s = sentences[i].trim();
    if (!s) continue;
    
    const rand = Math.random();
    
    // Strategy A (25%): Split long sentence into 2-3 shorter ones
    if (s.length > 80 && rand < 0.25) {
      // Try to split at conjunctions
      const splitPoints = [', and ', ', but ', ', which ', ', where ', ', while ', '; '];
      let didSplit = false;
      for (const sp of splitPoints) {
        const idx = s.indexOf(sp);
        if (idx > 15 && idx < s.length - 15) {
          let first = s.substring(0, idx).trim();
          let second = s.substring(idx + sp.length).trim();
          if (!first.match(/[.!?]$/)) first += '.';
          second = second.charAt(0).toUpperCase() + second.slice(1);
          if (!second.match(/[.!?]$/)) second += '.';
          result.push(first);
          result.push(second);
          didSplit = true;
          break;
        }
      }
      if (!didSplit) result.push(s);
      continue;
    }
    
    // Strategy B (15%): Merge with next short sentence
    if (s.length < 50 && i + 1 < sentences.length && sentences[i + 1].trim().length < 50 && rand < 0.40) {
      let next = sentences[i + 1].trim();
      // Remove period from first sentence, add conjunction
      s = s.replace(/[.!?]+$/, '');
      const conjunctions = [' — and ', ', and ', ' — ', '. Plus, '];
      const conj = conjunctions[Math.floor(Math.random() * conjunctions.length)];
      next = next.charAt(0).toLowerCase() + next.slice(1);
      result.push(s + conj + next);
      i++; // skip next
      continue;
    }
    
    // Strategy C (10%): Convert to a question
    if (s.length > 30 && s.length < 100 && rand < 0.50 && !s.includes('?')) {
      s = s.replace(/[.!]+$/, '');
      const questionForms = [
        `But why does ${s.charAt(0).toLowerCase() + s.slice(1)} matter?`,
        `And ${s.charAt(0).toLowerCase() + s.slice(1)}? Yes.`,
        `Think about it: ${s.charAt(0).toLowerCase() + s.slice(1)}.`,
      ];
      result.push(questionForms[Math.floor(Math.random() * questionForms.length)]);
      continue;
    }
    
    // Strategy D (15%): Add a discourse marker
    if (s.length > 20 && rand < 0.65) {
      const markers = [
        'Look, ', 'Honestly, ', 'The thing is, ', 'See, ',
        'Now, ', 'Sure, ', 'Right, so ', 'OK so ',
        'And yeah, ', 'Point is, ', 'Truth is, ', 'Basically, '
      ];
      const marker = markers[Math.floor(Math.random() * markers.length)];
      s = marker + s.charAt(0).toLowerCase() + s.slice(1);
      result.push(s);
      continue;
    }
    
    // Strategy E (10%): Fragment — just a short punchy fragment
    if (s.length > 40 && rand < 0.75) {
      // Extract a key noun phrase and make it a fragment
      const doc = nlp(s);
      const nouns = doc.nouns().out('array');
      if (nouns.length > 0) {
        const fragment = nouns[0];
        if (fragment.length > 5) {
          result.push(fragment + '.');
          result.push(s); // Keep original too
          continue;
        }
      }
    }
    
    // Default: keep as-is
    result.push(s);
  }
  
  return result;
}

// =============== CONTRACTIONS + CLEANUP ===============

function addContractions(text) {
  try {
    const doc = nlp(text);
    doc.contractions().contract();
    return doc.text();
  } catch {
    return text;
  }
}

function finalCleanup(text) {
  let result = text;
  // Fix capitalization after periods
  result = result.replace(/([.!?])\s+([a-z])/g, (m, p, l) => p + ' ' + l.toUpperCase());
  // Fix double periods
  result = result.replace(/\.{2,}/g, '.');
  // Fix spaces before punctuation
  result = result.replace(/\s+([.!?,;:])/g, '$1');
  // Fix double spaces
  result = result.replace(/\s{2,}/g, ' ');
  // Fix sentences starting with lowercase after being joined
  result = result.replace(/(^|\.\s+)([a-z])/g, (m, prefix, letter) => prefix + letter.toUpperCase());
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  return result.trim();
}

// =============== MAIN ENGINE ===============

async function humanizeText({
  text,
  mode = 'standard',
  strength = 70,
  creativity = 50,
  complexity = 50,
  tone = '',
}) {
  console.log('[Humanizer] Starting v6 Engine...');
  console.log('[Humanizer] Input:', text.length, 'chars');
  
  try {
    // Split into paragraphs
    const paragraphs = text.split(/\n+/);
    const results = [];
    
    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed) { results.push(''); continue; }
      if (trimmed.length < 10) { results.push(trimmed); continue; }
      
      // STEP 1: Kill AI phrases BEFORE translation
      let current = cleanAIPhrases(trimmed);
      console.log('[Humanizer] Step 1: AI phrases cleaned');
      
      // STEP 2: English → Malayalam → English (word change)
      console.log('[Humanizer] Step 2: EN → ML → EN...');
      current = await translateRoundTrip(current, 'ml');
      
      // STEP 3: English → Hindi → English (more word change)
      console.log('[Humanizer] Step 3: EN → HI → EN...');
      current = await translateRoundTrip(current, 'hi');
      
      // STEP 4: Kill AI phrases AGAIN (translation reintroduces them)
      current = cleanAIPhrases(current);
      console.log('[Humanizer] Step 4: AI phrases cleaned again');
      
      // STEP 5: AGGRESSIVE RESTRUCTURING (this is the key!)
      // Split into sentences and randomly restructure them
      console.log('[Humanizer] Step 5: Aggressive restructuring...');
      let sentences = splitIntoSentences(current);
      sentences = aggressiveRestructure(sentences);
      current = sentences.join(' ');
      
      // STEP 6: Add contractions
      current = addContractions(current);
      console.log('[Humanizer] Step 6: Contractions added');
      
      // STEP 7: Final cleanup
      current = finalCleanup(current);
      
      results.push(current);
    }
    
    const finalResult = results.join('\n\n');
    console.log('[Humanizer] Done!', finalResult.length, 'chars');
    return finalResult;
    
  } catch (err) {
    console.error('[Humanize Error]', err);
    throw new Error('Failed to humanize text. Please try again.');
  }
}

module.exports = { humanizeText };

const nlp = require('compromise');
const https = require('https');
const { translate } = require('@vitalets/google-translate-api');

// ============================================================
// HUMANIZER ENGINE v3 — COMBINED APPROACH (No API Key)
// Translation back-translate + Selective synonyms + NLP cleanup
// ============================================================

// Words to never touch during synonym replacement
const PROTECTED = new Set([
  'ai', 'artificial', 'intelligence', 'machine', 'learning', 'data',
  'algorithm', 'algorithms', 'technology', 'system', 'systems',
  'computer', 'digital', 'internet', 'software', 'hardware',
  'i', 'you', 'we', 'they', 'he', 'she', 'it', 'the', 'a', 'an',
  'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'can',
  'not', 'no', 'yes', 'and', 'or', 'but', 'if', 'so', 'yet',
  'this', 'that', 'these', 'those', 'my', 'your', 'our', 'their',
  'what', 'which', 'who', 'whom', 'where', 'when', 'why', 'how',
  'all', 'each', 'every', 'both', 'few', 'more', 'most', 'some',
  'any', 'many', 'much', 'own', 'other', 'such', 'than', 'too',
  'very', 'just', 'also', 'only', 'still', 'even', 'then', 'now',
  'work', 'make', 'take', 'give', 'get', 'go', 'come', 'see',
  'know', 'think', 'say', 'tell', 'find', 'want', 'need', 'use',
  'live', 'way', 'world', 'people', 'time', 'year', 'day', 'thing',
  'part', 'place', 'case', 'point', 'fact', 'hand', 'life', 'kind',
]);

// =================== STEP 1: AI PHRASE KILLER ===================

const AI_PHRASES = [
  [/it is important to note that\s*/gi, ''],
  [/it is worth noting that\s*/gi, ''],
  [/it's worth mentioning that\s*/gi, ''],
  [/in today's world,?\s*/gi, 'These days, '],
  [/in the realm of/gi, 'in'],
  [/furthermore,?\s*/gi, 'Also, '],
  [/moreover,?\s*/gi, 'Plus, '],
  [/additionally,?\s*/gi, 'And '],
  [/in conclusion,?\s*/gi, 'To wrap it up, '],
  [/to summarize,?\s*/gi, 'Basically, '],
  [/therefore,?\s*/gi, 'So '],
  [/thus,?\s*/gi, 'So '],
  [/hence,?\s*/gi, 'So '],
  [/however,?\s*/gi, 'But '],
  [/nevertheless,?\s*/gi, 'Still, '],
  [/consequently,?\s*/gi, 'So '],
  [/subsequently,?\s*/gi, 'Then '],
  [/a tapestry of/gi, 'a mix of'],
  [/testament to/gi, 'proof of'],
  [/delve into/gi, 'look into'],
  [/shed light on/gi, 'explain'],
  [/embark on/gi, 'start'],
  [/navigate the landscape of/gi, 'deal with'],
  [/the vast majority of/gi, 'most'],
  [/a plethora of/gi, 'lots of'],
  [/a myriad of/gi, 'many'],
  [/plays a crucial role/gi, 'matters a lot'],
  [/it is essential to/gi, 'you need to'],
  [/in order to/gi, 'to'],
  [/due to the fact that/gi, 'because'],
  [/at the end of the day,?\s*/gi, ''],
  [/on the other hand,?\s*/gi, 'Then again, '],
  [/as a result,?\s*/gi, 'So '],
  [/in light of/gi, 'given'],
  [/with regard to/gi, 'about'],
  [/in terms of/gi, 'for'],
  [/it can be argued that\s*/gi, ''],
  [/one might argue that\s*/gi, ''],
  [/it is clear that\s*/gi, ''],
  [/cannot be overstated/gi, 'is a big deal'],
  [/plays an important role/gi, 'matters'],
  [/is of paramount importance/gi, 'really matters'],
  [/has the potential to/gi, 'can'],
  [/it should be noted that\s*/gi, ''],
  [/serves as a/gi, 'is a'],
  [/in summary,?\s*/gi, 'So basically, '],
  [/to conclude,?\s*/gi, 'So '],
  [/in this context,?\s*/gi, ''],
  [/given the above,?\s*/gi, ''],
  [/as mentioned above,?\s*/gi, ''],
  [/it is evident that\s*/gi, ''],
  [/overall,?\s*/gi, 'All in all, '],
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
  'pivotal': 'key', 'intricate': 'detailed', 'landscape': 'space',
  'realm': 'field', 'plethora': 'tons', 'myriad': 'tons of',
  'endeavor': 'effort', 'embark': 'start', 'crucial': 'key',
  'vital': 'key', 'testament': 'proof', 'undoubtedly': '',
  'significantly': '', 'fundamentally': '', 'essentially': '',
  'increasingly': '', 'notably': '', 'crucially': '',
  'intrinsically': '', 'undeniably': '', 'certainly': '',
};

function killAIPhrases(text) {
  let result = text;
  AI_PHRASES.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement);
  });
  Object.keys(AI_WORDS).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, AI_WORDS[word]);
  });
  // Clean up double spaces from removals
  result = result.replace(/\s{2,}/g, ' ').trim();
  return result;
}

// =================== STEP 2: BACK-TRANSLATION ===================
// Translate to another language and back to restructure sentences naturally

async function backTranslate(text, targetLang = 'ja') {
  try {
    // Step A: English -> Target language
    const toTarget = await translate(text, { to: targetLang });
    if (!toTarget.text) throw new Error('Empty translation');
    
    // Step B: Target language -> English
    const backToEn = await translate(toTarget.text, { to: 'en' });
    if (!backToEn.text) throw new Error('Empty back-translation');
    
    return backToEn.text;
  } catch (err) {
    console.error(`[BackTranslate] Failed (${targetLang}):`, err.message);
    return text; // Return original on failure
  }
}

// =================== STEP 3: SELECTIVE SYNONYM SWAP ===================

function fetchSynonyms(word) {
  return new Promise((resolve) => {
    const url = `https://api.datamuse.com/words?ml=${encodeURIComponent(word)}&max=10&md=f`;
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const results = JSON.parse(data);
          const synonyms = results
            .filter(r => {
              if (r.word.includes(' ') || r.word.includes('-')) return false;
              if (r.word.toLowerCase() === word.toLowerCase()) return false;
              // Must be a common word (frequency > 5.0)
              const freq = r.tags?.find(t => t.startsWith('f:'));
              if (!freq) return false;
              const freqVal = parseFloat(freq.substring(2));
              if (freqVal < 5.0) return false;
              // Word length should be similar (avoid weird short/long replacements)
              if (Math.abs(r.word.length - word.length) > 4) return false;
              return true;
            })
            .slice(0, 3)
            .map(r => r.word);
          resolve(synonyms);
        } catch {
          resolve([]);
        }
      });
    });
    req.on('error', () => resolve([]));
    req.setTimeout(3000, () => { req.destroy(); resolve([]); });
  });
}

function extractSwappableWords(text) {
  const doc = nlp(text);
  const words = [];
  
  // Only adjectives and adverbs — these are safest to replace
  doc.match('#Adjective').not('#Determiner').forEach(m => {
    const w = m.text().replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (w.length > 3 && !PROTECTED.has(w)) words.push(w);
  });
  doc.adverbs().forEach(m => {
    const w = m.text().replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (w.length > 4 && !PROTECTED.has(w)) words.push(w);
  });
  
  return [...new Set(words)];
}

async function selectiveSynonymSwap(text, swapRate = 0.3) {
  const words = extractSwappableWords(text);
  if (words.length === 0) return text;
  
  console.log(`[Humanizer]   Adjectives/adverbs found: ${words.join(', ')}`);
  
  // Fetch synonyms in parallel
  const results = await Promise.all(words.map(w => fetchSynonyms(w)));
  const cache = {};
  words.forEach((w, i) => { cache[w] = results[i]; });
  
  let result = text;
  let swapCount = 0;
  
  for (const word of words) {
    if (Math.random() > swapRate) continue;
    const syns = cache[word];
    if (!syns || syns.length === 0) continue;
    
    const synonym = syns[Math.floor(Math.random() * Math.min(syns.length, 2))];
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'i');
    const match = result.match(regex);
    
    if (match) {
      const original = match[0];
      let replacement = synonym;
      if (original[0] === original[0].toUpperCase() && original[0] !== original[0].toLowerCase()) {
        replacement = synonym.charAt(0).toUpperCase() + synonym.slice(1);
      }
      result = result.replace(regex, replacement);
      swapCount++;
    }
  }
  
  console.log(`[Humanizer]   Swapped ${swapCount}/${words.length} adjectives/adverbs`);
  return result;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// =================== STEP 4: NLP CLEANUP ===================

function addContractions(text) {
  const doc = nlp(text);
  doc.contractions().contract();
  return doc.text();
}

function sentenceCleanup(text) {
  // Fix capitalization after periods
  let result = text.replace(/([.!?])\s+([a-z])/g, (m, p, l) => p + ' ' + l.toUpperCase());
  // Fix double periods
  result = result.replace(/\.{2,}/g, '.');
  // Fix spaces before punctuation
  result = result.replace(/\s+([.!?,;:])/g, '$1');
  // Fix double spaces
  result = result.replace(/\s{2,}/g, ' ');
  return result.trim();
}

// =================== MAIN ENGINE ===================

async function humanizeText({
  text,
  mode = 'standard',
  strength = 70,
  creativity = 50,
  complexity = 50,
  tone = '',
}) {
  console.log('[Humanizer] Starting v3 Combined Engine...');
  console.log('[Humanizer] Input:', text.length, 'chars |', 
    'creativity:', creativity, 'complexity:', complexity, 'strength:', strength);
  
  try {
    // STEP 1: Kill AI-specific phrases and buzzwords
    console.log('[Humanizer] Step 1: Removing AI fingerprints...');
    let result = killAIPhrases(text);
    
    // STEP 2: Back-translate through another language to restructure
    // This is the single most effective technique for changing perplexity
    // Use Japanese for maximum restructuring (SOV grammar vs English SVO)
    const backTranslateLang = strength > 60 ? 'ja' : 'es';
    console.log(`[Humanizer] Step 2: Back-translating through ${backTranslateLang}...`);
    
    // Process sentence by sentence to preserve structure better
    const sentences = result.match(/[^.!?]+[.!?]+/g) || [result];
    const translatedSentences = [];
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length < 15) {
        translatedSentences.push(trimmed);
        continue;
      }
      const translated = await backTranslate(trimmed, backTranslateLang);
      translatedSentences.push(translated);
    }
    
    result = translatedSentences.join(' ');
    
    // STEP 3: Re-apply AI phrase killer (translation may reintroduce AI words)
    console.log('[Humanizer] Step 3: Second pass AI phrase cleanup...');
    result = killAIPhrases(result);
    
    // STEP 4: Add contractions
    console.log('[Humanizer] Step 4: Contractions...');
    result = addContractions(result);
    
    // STEP 5: Selective synonym swap (only adjectives/adverbs — safest)
    const swapRate = 0.2 + (creativity / 250); // 0.2 to 0.6
    console.log(`[Humanizer] Step 5: Selective synonym swap (rate: ${swapRate.toFixed(2)})...`);
    result = await selectiveSynonymSwap(result, swapRate);
    
    // STEP 6: Final cleanup
    console.log('[Humanizer] Step 6: Final cleanup...');
    result = sentenceCleanup(result);
    
    console.log('[Humanizer] Done!', result.length, 'chars');
    return result;
    
  } catch (err) {
    console.error('[Humanize Error]', err);
    throw new Error('Failed to humanize text. Please try again.');
  }
}

module.exports = { humanizeText };

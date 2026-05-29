const nlp = require('compromise');
const https = require('https');
const { translate } = require('@vitalets/google-translate-api');

// ============================================================
// HUMANIZER ENGINE v4 — MULTI-HOP TRANSLATION
// English → Malayalam → English → Hindi → English
// All processing is invisible — user only sees final English output
// ============================================================

// --- Translation with fallback (Google Translate → MyMemory API) ---
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// MyMemory free translation API (no key needed)
function myMemoryTranslate(text, from, to) {
  return new Promise((resolve) => {
    // MyMemory uses different lang codes - ml for Malayalam, hi for Hindi
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.substring(0, 500))}&langpair=${from}|${to}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.responseStatus === 200 && result.responseData?.translatedText) {
            const translated = result.responseData.translatedText;
            // MyMemory sometimes returns the input text unchanged
            if (translated.toUpperCase() === text.substring(0, 500).toUpperCase()) {
              resolve(null);
            } else {
              resolve(translated);
            }
          } else {
            console.log(`[MyMemory] Status: ${result.responseStatus}, msg: ${result.responseData?.translatedText?.substring(0, 50)}`);
            resolve(null);
          }
        } catch (e) {
          console.log('[MyMemory] Parse error:', e.message);
          resolve(null);
        }
      });
    }).on('error', (e) => {
      console.log('[MyMemory] Network error:', e.message);
      resolve(null);
    });
  });
}

async function translateText(text, targetLang, sourceLang = 'en') {
  // Try Google Translate first
  try {
    const res = await translate(text, { to: targetLang, from: sourceLang });
    if (res.text) return res.text;
  } catch (err) {
    console.log(`[Translate] Google failed (${targetLang}), trying MyMemory...`);
  }
  
  // Fallback to MyMemory API
  try {
    const result = await myMemoryTranslate(text, sourceLang, targetLang);
    if (result) return result;
  } catch (err) {
    console.log(`[Translate] MyMemory also failed (${targetLang})`);
  }
  
  return text; // Return original if both fail
}

// --- AI phrase cleanup (applied after translation) ---
const AI_PHRASES = [
  [/it is important to note that\s*/gi, ''],
  [/it is worth noting that\s*/gi, ''],
  [/it's worth mentioning that\s*/gi, ''],
  [/in today's world,?\s*/gi, 'These days, '],
  [/in the realm of/gi, 'in'],
  [/furthermore,?\s*/gi, 'Also, '],
  [/moreover,?\s*/gi, 'Plus, '],
  [/additionally,?\s*/gi, 'And '],
  [/in conclusion,?\s*/gi, ''],
  [/to summarize,?\s*/gi, ''],
  [/therefore,?\s*/gi, 'So '],
  [/thus,?\s*/gi, 'So '],
  [/hence,?\s*/gi, 'So '],
  [/however,?\s*/gi, 'But '],
  [/nevertheless,?\s*/gi, 'Still, '],
  [/consequently,?\s*/gi, 'So '],
  [/subsequently,?\s*/gi, 'Then '],
  [/delve into/gi, 'look into'],
  [/shed light on/gi, 'explain'],
  [/embark on/gi, 'start'],
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
  [/it is clear that\s*/gi, ''],
  [/in summary,?\s*/gi, ''],
  [/to conclude,?\s*/gi, ''],
  [/overall,?\s*/gi, ''],
  [/it is evident that\s*/gi, ''],
  [/has the potential to/gi, 'can'],
  [/serves as a/gi, 'is a'],
  [/cannot be overstated/gi, 'is a big deal'],
  [/undoubtedly,?\s*/gi, ''],
  [/undeniably,?\s*/gi, ''],
  [/significantly,?\s*/gi, ''],
  [/fundamentally,?\s*/gi, ''],
  [/essentially,?\s*/gi, ''],
  [/increasingly,?\s*/gi, ''],
  [/notably,?\s*/gi, ''],
  [/crucially,?\s*/gi, ''],
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
  'pivotal': 'key', 'intricate': 'detailed',
  'realm': 'field', 'plethora': 'tons', 'myriad': 'tons of',
  'endeavor': 'effort', 'embark': 'start', 'crucial': 'key',
  'vital': 'key', 'testament': 'proof',
};

function cleanAIPhrases(text) {
  let result = text;
  AI_PHRASES.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement);
  });
  Object.keys(AI_WORDS).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, AI_WORDS[word]);
  });
  return result.replace(/\s{2,}/g, ' ').trim();
}

// --- Add natural contractions ---
function addContractions(text) {
  try {
    const doc = nlp(text);
    doc.contractions().contract();
    return doc.text();
  } catch {
    return text;
  }
}

// --- Final text cleanup ---
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
  // Ensure first letter is capitalized
  result = result.charAt(0).toUpperCase() + result.slice(1);
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
  console.log('[Humanizer] Starting v4 Multi-Hop Translation Engine...');
  console.log('[Humanizer] Input:', text.length, 'chars');
  
  try {
    // Split into paragraphs to preserve structure
    const paragraphs = text.split(/\n+/);
    const processedParagraphs = [];
    
    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed) {
        processedParagraphs.push('');
        continue;
      }
      
      if (trimmed.length < 10) {
        processedParagraphs.push(trimmed);
        continue;
      }
      
      // ========== STEP 1: Remove AI phrases first ==========
      console.log('[Humanizer] Step 1: Cleaning AI phrases...');
      let result = cleanAIPhrases(trimmed);
      
      // ========== STEP 2: English → Malayalam → English ==========
      // Malayalam (Dravidian language) has SOV word order, 
      // agglutinative morphology — completely different from English
      console.log('[Humanizer] Step 2: English → Malayalam → English...');
      let malayalamText = await translateText(result, 'ml', 'en'); // English to Malayalam
      await sleep(500); // Small delay to avoid rate limiting
      let backToEnglish1 = await translateText(malayalamText, 'en', 'ml'); // Malayalam to English
      await sleep(500);
      
      if (backToEnglish1 && backToEnglish1.trim().length > 0) {
        result = backToEnglish1;
      }
      
      // ========== STEP 3: English → Hindi → English ==========
      // Hindi (Indo-Aryan) also has SOV order but different morphology
      // This second hop further breaks AI patterns
      console.log('[Humanizer] Step 3: English → Hindi → English...');
      let hindiText = await translateText(result, 'hi', 'en'); // English to Hindi
      await sleep(500);
      let backToEnglish2 = await translateText(hindiText, 'en', 'hi'); // Hindi to English
      
      if (backToEnglish2 && backToEnglish2.trim().length > 0) {
        result = backToEnglish2;
      }
      
      // ========== STEP 4: Clean AI phrases again ==========
      // Translation might reintroduce formal/AI-like phrasing
      console.log('[Humanizer] Step 4: Second pass AI cleanup...');
      result = cleanAIPhrases(result);
      
      // ========== STEP 5: Add natural contractions ==========
      console.log('[Humanizer] Step 5: Adding contractions...');
      result = addContractions(result);
      
      // ========== STEP 6: Final cleanup ==========
      result = finalCleanup(result);
      
      processedParagraphs.push(result);
    }
    
    const finalResult = processedParagraphs.join('\n\n');
    console.log('[Humanizer] Done!', finalResult.length, 'chars');
    return finalResult;
    
  } catch (err) {
    console.error('[Humanize Error]', err);
    throw new Error('Failed to humanize text. Please try again.');
  }
}

module.exports = { humanizeText };

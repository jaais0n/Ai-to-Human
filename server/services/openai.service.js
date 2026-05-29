const nlp = require('compromise');
const translate = require('google-translate-api-x');

// ============================================================
// HUMANIZER ENGINE v5 — MULTI-HOP TRANSLATION (Production)
// English → Malayalam → English → Hindi → English
// Uses google-translate-api-x (reliable, no rate limit issues)
// All processing is invisible — user only sees final English output
// ============================================================

// --- AI phrase cleanup (applied AFTER translation) ---
const AI_PHRASES = [
  [/it is important to note that\s*/gi, ''],
  [/it is worth noting that\s*/gi, ''],
  [/it's worth mentioning that\s*/gi, ''],
  [/it should be noted that\s*/gi, ''],
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
  [/at the same time,?\s*/gi, 'Also, '],
  [/it is important to note that\s*/gi, ''],
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
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
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
  console.log('[Humanizer] Starting v5 Engine...');
  console.log('[Humanizer] Input:', text.length, 'chars');
  
  try {
    // Split into paragraphs to preserve structure
    const paragraphs = text.split(/\n+/);
    const results = [];
    
    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed) { results.push(''); continue; }
      if (trimmed.length < 10) { results.push(trimmed); continue; }
      
      // STEP 1: Remove AI phrases BEFORE translation
      let current = cleanAIPhrases(trimmed);
      
      // STEP 2: English → Malayalam → English
      console.log('[Humanizer] Translating: EN → ML → EN...');
      try {
        const toMalayalam = await translate(current, { from: 'en', to: 'ml' });
        if (toMalayalam.text) {
          const backToEn = await translate(toMalayalam.text, { from: 'ml', to: 'en' });
          if (backToEn.text && backToEn.text.trim().length > 5) {
            current = backToEn.text;
          }
        }
      } catch (err) {
        console.log('[Humanizer] Malayalam step failed:', err.message?.substring(0, 60));
      }
      
      // STEP 3: English → Hindi → English
      console.log('[Humanizer] Translating: EN → HI → EN...');
      try {
        const toHindi = await translate(current, { from: 'en', to: 'hi' });
        if (toHindi.text) {
          const backToEn = await translate(toHindi.text, { from: 'hi', to: 'en' });
          if (backToEn.text && backToEn.text.trim().length > 5) {
            current = backToEn.text;
          }
        }
      } catch (err) {
        console.log('[Humanizer] Hindi step failed:', err.message?.substring(0, 60));
      }
      
      // STEP 4: Clean AI phrases AGAIN (translation reintroduces them)
      current = cleanAIPhrases(current);
      
      // STEP 5: Add contractions
      current = addContractions(current);
      
      // STEP 6: Final cleanup
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

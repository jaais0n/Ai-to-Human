const nlp = require('compromise');
const translate = require('google-translate-api-x');

// ============================================================
// HUMANIZER ENGINE v7.1 — CURATED DICTIONARY + TRANSLATION
// Hand-picked 200+ safe synonyms + Translation chain + Restructuring
// NO LLM, NO AI API — pure NLP
// ============================================================

// ============================================================
// STEP 1: AI PHRASE KILLER
// ============================================================

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
  [/when it comes to/gi, 'with'],
  [/the fact that/gi, 'that'],
  [/a wide range of/gi, 'many'],
  [/a large number of/gi, 'many'],
  [/in the context of/gi, 'in'],
  [/it goes without saying that\s*/gi, ''],
  [/needless to say,?\s*/gi, ''],
  [/for the purpose of/gi, 'to'],
  [/have the ability to/gi, 'can'],
  [/is able to/gi, 'can'],
  [/take into consideration/gi, 'consider'],
  [/prior to/gi, 'before'],
  [/subsequent to/gi, 'after'],
  [/in the near future/gi, 'soon'],
  [/at this point in time/gi, 'now'],
];

// ============================================================
// CURATED SAFE SYNONYM DICTIONARY (200+ entries)
// Every single replacement is hand-picked and verified safe
// ============================================================

const SYNONYM_MAP = {
  // --- Adjectives ---
  'important': ['key', 'big', 'major', 'critical'],
  'significant': ['real', 'meaningful', 'notable'],
  'various': ['different', 'several', 'multiple'],
  'modern': ['current', 'present-day', 'recent'],
  'vast': ['huge', 'massive', 'enormous'],
  'large': ['big', 'sizable', 'substantial'],
  'complex': ['tricky', 'involved', 'complicated'],
  'sophisticated': ['advanced', 'refined', 'polished'],
  'capable': ['able', 'skilled', 'equipped'],
  'impossible': ['unthinkable', 'out of reach', 'not doable'],
  'traditional': ['old-school', 'classic', 'conventional'],
  'effective': ['useful', 'practical', 'solid'],
  'efficient': ['productive', 'streamlined', 'quick'],
  'essential': ['needed', 'core', 'basic'],
  'specific': ['particular', 'certain', 'exact'],
  'potential': ['possible', 'likely', 'promising'],
  'valuable': ['useful', 'worthwhile', 'precious'],
  'relevant': ['fitting', 'appropriate', 'related'],
  'current': ['ongoing', 'present', 'active'],
  'advanced': ['cutting-edge', 'high-end', 'developed'],
  'rapid': ['fast', 'quick', 'speedy'],
  'substantial': ['considerable', 'decent', 'hefty'],
  'comprehensive': ['thorough', 'complete', 'full'],
  'innovative': ['creative', 'fresh', 'original'],
  'crucial': ['key', 'central', 'vital'],
  'diverse': ['varied', 'mixed', 'assorted'],
  'remarkable': ['striking', 'impressive', 'notable'],
  'considerable': ['sizable', 'decent', 'meaningful'],
  'numerous': ['many', 'plenty of', 'several'],
  'prominent': ['well-known', 'leading', 'major'],
  'prevalent': ['common', 'widespread', 'frequent'],
  'adequate': ['enough', 'decent', 'satisfactory'],
  'profound': ['deep', 'intense', 'serious'],
  'notable': ['worth noting', 'striking', 'impressive'],
  'evident': ['clear', 'plain', 'obvious'],
  'robust': ['solid', 'tough', 'reliable'],
  'pivotal': ['central', 'key', 'critical'],
  'integral': ['core', 'built-in', 'central'],
  'dynamic': ['lively', 'active', 'energetic'],
  'seamless': ['smooth', 'effortless', 'fluid'],
  'unprecedented': ['unheard of', 'first-ever', 'brand new'],
  'transformative': ['game-changing', 'radical', 'major'],

  // --- Verbs ---
  'analyze': ['study', 'examine', 'look at'],
  'identify': ['spot', 'find', 'pick out'],
  'detect': ['notice', 'catch', 'spot'],
  'evolve': ['grow', 'develop', 'change'],
  'transform': ['reshape', 'alter', 'change'],
  'continue': ['keep', 'carry on', 'go on'],
  'integrate': ['blend', 'combine', 'merge'],
  'implement': ['set up', 'carry out', 'roll out'],
  'demonstrate': ['show', 'prove', 'display'],
  'establish': ['set up', 'create', 'build'],
  'utilize': ['use', 'apply', 'employ'],
  'facilitate': ['help', 'assist', 'support'],
  'enhance': ['boost', 'improve', 'lift'],
  'optimize': ['fine-tune', 'improve', 'tweak'],
  'leverage': ['tap into', 'use', 'harness'],
  'generate': ['create', 'produce', 'make'],
  'maintain': ['keep', 'hold', 'preserve'],
  'achieve': ['reach', 'hit', 'pull off'],
  'require': ['need', 'call for', 'demand'],
  'ensure': ['make sure', 'guarantee', 'confirm'],
  'incorporate': ['include', 'add', 'blend in'],
  'determine': ['figure out', 'decide', 'settle'],
  'contribute': ['add to', 'help with', 'pitch in'],
  'indicate': ['point to', 'suggest', 'show'],
  'address': ['tackle', 'deal with', 'handle'],
  'navigate': ['get through', 'work through', 'handle'],
  'streamline': ['simplify', 'speed up', 'clean up'],
  'collaborate': ['team up', 'partner', 'work together'],
  'revolutionize': ['shake up', 'overhaul', 'reinvent'],
  'monitor': ['track', 'watch', 'keep tabs on'],
  'evaluate': ['assess', 'review', 'judge'],
  'acquire': ['get', 'pick up', 'obtain'],

  // --- Nouns ---
  'society': ['world', 'community', 'culture'],
  'tool': ['resource', 'instrument', 'aid'],
  'patterns': ['trends', 'behaviors', 'habits'],
  'amounts': ['quantities', 'volumes', 'loads'],
  'tasks': ['jobs', 'duties', 'activities'],
  'industries': ['sectors', 'fields', 'businesses'],
  'integration': ['adoption', 'blending', 'merging'],
  'approach': ['method', 'strategy', 'way'],
  'challenges': ['hurdles', 'obstacles', 'struggles'],
  'opportunities': ['chances', 'openings', 'possibilities'],
  'solutions': ['answers', 'fixes', 'remedies'],
  'development': ['growth', 'progress', 'advance'],
  'environment': ['setting', 'space', 'surroundings'],
  'individuals': ['people', 'folks', 'persons'],
  'organizations': ['companies', 'groups', 'firms'],
  'resources': ['assets', 'supplies', 'tools'],
  'processes': ['steps', 'procedures', 'methods'],
  'strategies': ['plans', 'tactics', 'moves'],
  'framework': ['structure', 'setup', 'blueprint'],
  'perspective': ['viewpoint', 'angle', 'outlook'],
  'infrastructure': ['backbone', 'foundation', 'setup'],
  'methodology': ['approach', 'method', 'technique'],
  'implementation': ['rollout', 'setup', 'execution'],
  'collaboration': ['teamwork', 'partnership', 'cooperation'],
  'components': ['parts', 'pieces', 'elements'],
  'landscape': ['scene', 'terrain', 'picture'],
  'paradigm': ['model', 'pattern', 'standard'],
  'ecosystem': ['network', 'community', 'environment'],
  'stakeholders': ['players', 'participants', 'parties'],
  'capabilities': ['abilities', 'skills', 'strengths'],
  'outcomes': ['results', 'effects', 'consequences'],
  'insights': ['findings', 'takeaways', 'lessons'],

  // --- Adverbs ---
  'significantly': ['a lot', 'greatly', 'noticeably'],
  'increasingly': ['more and more', 'progressively'],
  'effectively': ['well', 'properly', 'successfully'],
  'continuously': ['nonstop', 'always', 'endlessly'],
  'rapidly': ['quickly', 'fast', 'at full speed'],
  'constantly': ['always', 'nonstop', 'all the time'],
  'undoubtedly': ['for sure', 'no doubt', 'clearly'],
  'fundamentally': ['at its core', 'basically'],
  'essentially': ['really', 'basically', 'at heart'],
  'primarily': ['mainly', 'mostly', 'first and foremost'],
  'particularly': ['especially', 'mainly', 'notably'],
  'dramatically': ['sharply', 'wildly', 'heavily'],
  'inevitably': ['naturally', 'of course'],
  'substantially': ['a good deal', 'heavily', 'largely'],
};

// Words to NEVER replace
const PROTECTED = new Set([
  'ai', 'artificial', 'intelligence', 'machine', 'learning', 'data',
  'algorithm', 'algorithms', 'technology', 'system', 'systems',
  'computer', 'digital', 'internet', 'software', 'hardware',
  'i', 'you', 'we', 'they', 'he', 'she', 'it', 'the', 'a', 'an',
]);

function cleanAIPhrases(text) {
  let result = text;
  AI_PHRASES.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement);
  });
  return result.replace(/\s{2,}/g, ' ').trim();
}

// ============================================================
// STEP 2: CURATED SYNONYM REPLACEMENT (safe, no WordNet)
// ============================================================

function curatedSynonymReplace(text, swapRate = 0.5) {
  let result = text;
  let swapCount = 0;
  
  const words = Object.keys(SYNONYM_MAP);
  // Shuffle to avoid replacing in same order every time
  words.sort(() => Math.random() - 0.5);
  
  for (const word of words) {
    if (Math.random() > swapRate) continue;
    
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (!regex.test(result)) continue;
    
    const synonyms = SYNONYM_MAP[word];
    const replacement = synonyms[Math.floor(Math.random() * synonyms.length)];
    
    // Replace all occurrences (case-preserving)
    result = result.replace(regex, (match) => {
      swapCount++;
      if (match[0] === match[0].toUpperCase() && match[0] !== match[0].toLowerCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }
  
  console.log(`[Humanizer] Swapped ${swapCount} words with curated synonyms`);
  return result;
}

// ============================================================
// STEP 3: TRANSLATION CHAIN
// ============================================================

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

// ============================================================
// STEP 4: AGGRESSIVE RESTRUCTURING
// ============================================================

function splitSentences(text) {
  return text.match(/[^.!?]+[.!?]+/g) || [text];
}

const STARTERS = [
  'Look, ', 'Honestly, ', 'The thing is, ', 'See, ',
  'Now, ', 'Sure, ', 'And yeah, ', 'Point is, ',
  'Truth is, ', 'Basically, ', "Here's the deal — ",
  'Real talk — ', 'I mean, ', "What's interesting is, ",
];

const REACTIONS = [
  " That's a big deal.", " And it's picking up speed.",
  " No surprise there.", " Pretty wild, right?",
  " It's worth watching.", " And that's just the start.",
];

function aggressiveRestructure(sentences) {
  const result = [];
  
  for (let i = 0; i < sentences.length; i++) {
    let s = sentences[i].trim();
    if (!s) continue;
    
    const rand = Math.random();
    
    // 25%: Split long sentence
    if (s.length > 80 && rand < 0.25) {
      const splits = [', and ', ', but ', ', which ', ', where ', '; '];
      let didSplit = false;
      for (const sp of splits) {
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
    
    // 15%: Merge two short sentences
    if (s.length < 50 && i + 1 < sentences.length && sentences[i + 1].trim().length < 50 && rand < 0.40) {
      let next = sentences[i + 1].trim();
      s = s.replace(/[.]+$/, '');
      // Don't lowercase if starts with uppercase abbreviation (like AI)
      if (next.length > 1 && next[0] !== next[0].toUpperCase()) {
        next = next.charAt(0).toLowerCase() + next.slice(1);
      }
      result.push(s + ', and ' + next);
      i++;
      continue;
    }
    
    // 20%: Add a human discourse marker (but protect leading caps/acronyms)
    if (s.length > 25 && rand < 0.60) {
      const marker = STARTERS[Math.floor(Math.random() * STARTERS.length)];
      // Don't lowercase if starts with an acronym (2+ uppercase letters)
      if (s.length > 1 && s[0] === s[0].toUpperCase() && s[1] === s[1]?.toUpperCase()) {
        result.push(marker + s);
      } else {
        result.push(marker + s.charAt(0).toLowerCase() + s.slice(1));
      }
      continue;
    }
    
    // 10%: Add a punchy reaction
    if (s.length > 30 && rand < 0.70) {
      const reaction = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
      result.push(s + reaction);
      continue;
    }
    
    result.push(s);
  }
  
  return result;
}

// ============================================================
// STEP 5: CLEANUP
// ============================================================

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
  result = result.replace(/([.!?])\s+([a-z])/g, (m, p, l) => p + ' ' + l.toUpperCase());
  result = result.replace(/\.{2,}/g, '.');
  result = result.replace(/\s+([.!?,;:])/g, '$1');
  result = result.replace(/\s{2,}/g, ' ');
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  return result.trim();
}

// ============================================================
// MAIN ENGINE
// ============================================================

async function humanizeText({
  text,
  mode = 'standard',
  strength = 70,
  creativity = 50,
  complexity = 50,
  tone = '',
}) {
  console.log('[Humanizer] Starting v7.1 Engine...');
  console.log('[Humanizer] Input:', text.length, 'chars');
  
  try {
    const paragraphs = text.split(/\n+/);
    const results = [];
    
    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed) { results.push(''); continue; }
      if (trimmed.length < 10) { results.push(trimmed); continue; }
      
      // STEP 1: Kill AI phrases
      console.log('[Humanizer] Step 1: Cleaning AI phrases...');
      let current = cleanAIPhrases(trimmed);
      
      // STEP 2: Curated synonym replacement BEFORE translation
      console.log('[Humanizer] Step 2: Curated synonym swap...');
      const swapRate = 0.4 + (creativity / 200); // 0.4 to 0.9
      current = curatedSynonymReplace(current, swapRate);
      
      // STEP 3: Translation chain (restructure sentences)
      console.log('[Humanizer] Step 3: EN → ML → EN...');
      current = await translateRoundTrip(current, 'ml');
      console.log('[Humanizer] Step 4: EN → HI → EN...');
      current = await translateRoundTrip(current, 'hi');
      
      // STEP 5: Clean AI phrases again
      current = cleanAIPhrases(current);
      
      // STEP 6: Curated synonym replacement AGAIN (translation reintroduces AI words)
      current = curatedSynonymReplace(current, 0.3);
      
      // STEP 7: Aggressive sentence restructuring
      console.log('[Humanizer] Step 5: Restructuring...');
      let sentences = splitSentences(current);
      sentences = aggressiveRestructure(sentences);
      current = sentences.join(' ');
      
      // STEP 8: Contractions
      current = addContractions(current);
      
      // STEP 9: Final cleanup
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

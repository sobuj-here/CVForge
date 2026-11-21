/**
 * CVForge - Job Description Keyword Matcher & Optimizer
 * Compares user CV profile against pasted job description text to highlight matches and gaps.
 */

const STOP_WORDS = new Set([
  'and', 'the', 'for', 'with', 'that', 'this', 'from', 'have', 'are', 'was', 'were',
  'will', 'our', 'you', 'your', 'about', 'can', 'has', 'their', 'which', 'who',
  'what', 'when', 'where', 'how', 'any', 'all', 'into', 'out', 'must', 'should',
  'would', 'could', 'been', 'being', 'having', 'over', 'more', 'most', 'other',
  'some', 'such', 'than', 'them', 'then', 'there', 'these', 'they', 'through',
  'work', 'years', 'experience', 'skills', 'ability', 'looking', 'role', 'team',
  'company', 'opportunity', 'position', 'responsibilities', 'requirements', 'qualifications'
]);

export function matchJobDescription(jobText, profile) {
  if (!jobText || jobText.trim().length < 20) {
    return {
      matchScore: 0,
      matchedKeywords: [],
      missingKeywords: [],
      totalKeywordsCount: 0
    };
  }

  // 1. Build profile word bank
  const profileTokens = new Set();

  // Add headline and summary
  tokenize(profile.personal?.headline || '').forEach(t => profileTokens.add(t));
  tokenize(profile.personal?.summary || '').forEach(t => profileTokens.add(t));

  // Add skills
  if (Array.isArray(profile.skills)) {
    profile.skills.forEach(s => {
      tokenize(s.name || '').forEach(t => profileTokens.add(t));
    });
  } else {
    (profile.skills?.technical || []).forEach(s => {
      tokenize(s.name).forEach(t => profileTokens.add(t));
    });
    (profile.skills?.tools || []).forEach(t => {
      tokenize(t).forEach(w => profileTokens.add(w));
    });
    (profile.skills?.soft || []).forEach(s => {
      tokenize(s.name).forEach(t => profileTokens.add(t));
    });
  }

  // Add experience highlights
  (profile.experience || []).forEach(e => {
    tokenize(e.title || '').forEach(t => profileTokens.add(t));
    (e.highlights || []).forEach(h => {
      tokenize(h).forEach(t => profileTokens.add(t));
    });
    (e.technologies || []).forEach(tech => {
      tokenize(tech).forEach(t => profileTokens.add(t));
    });
  });

  // Add projects
  (profile.projects || []).forEach(p => {
    tokenize(p.title || '').forEach(t => profileTokens.add(t));
    tokenize(p.description || '').forEach(t => profileTokens.add(t));
    (p.technologies || []).forEach(tech => {
      tokenize(tech).forEach(t => profileTokens.add(t));
    });
  });

  // 2. Extract significant terms from Job Description
  const rawWords = jobText.toLowerCase().match(/[a-z0-9+#.-]{2,}/g) || [];
  const freqMap = new Map();

  rawWords.forEach(w => {
    const clean = w.replace(/^[^a-z0-9]+|[^a-z0-9+]+$/g, '');
    if (clean.length > 2 && !STOP_WORDS.has(clean) && !/^\d+$/.test(clean)) {
      freqMap.set(clean, (freqMap.get(clean) || 0) + 1);
    }
  });

  // Sort by frequency
  const sortedKeywords = Array.from(freqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(entry => entry[0]);

  const matchedKeywords = [];
  const missingKeywords = [];

  sortedKeywords.forEach(kw => {
    if (profileTokens.has(kw) || Array.from(profileTokens).some(pt => pt.includes(kw) || kw.includes(pt))) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const total = matchedKeywords.length + missingKeywords.length;
  const matchScore = total > 0 ? Math.round((matchedKeywords.length / total) * 100) : 0;

  return {
    matchScore,
    matchedKeywords,
    missingKeywords,
    totalKeywordsCount: total
  };
}

function tokenize(text) {
  if (!text) return [];
  const matches = text.toLowerCase().match(/[a-z0-9+#.-]{2,}/g) || [];
  return matches
    .map(w => w.replace(/^[^a-z0-9]+|[^a-z0-9+]+$/g, ''))
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

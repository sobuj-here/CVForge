/**
 * CVForge - ATS (Applicant Tracking System) Compatibility Engine
 * Performs detailed audits on structure, keywords, action verbs, metrics, and parseability.
 */

const ACTION_VERBS = new Set([
  'accelerated', 'achieved', 'administered', 'advised', 'analyzed', 'applied', 'architected',
  'automated', 'authored', 'built', 'championed', 'coached', 'collaborated', 'completed',
  'conceived', 'conducted', 'configured', 'constructed', 'consolidated', 'coordinated',
  'created', 'decreased', 'delivered', 'deployed', 'designed', 'developed', 'devised',
  'directed', 'documented', 'doubled', 'drafted', 'drove', 'eliminated', 'engineered',
  'enhanced', 'established', 'evaluated', 'executed', 'expanded', 'expedited', 'facilitated',
  'formulated', 'founded', 'generated', 'guided', 'headed', 'identified', 'implemented',
  'improved', 'increased', 'initiated', 'inspected', 'instituted', 'integrated', 'invented',
  'launched', 'led', 'managed', 'maximized', 'mentored', 'minimized', 'modernized',
  'negotiated', 'optimized', 'orchestrated', 'organized', 'overhauled', 'oversaw',
  'partnered', 'pioneered', 'planned', 'programmed', 'published', 're-engineered',
  'rebuilt', 'reduced', 'refined', 'reorganized', 'resolved', 'restructured', 'revamped',
  'scaled', 'secured', 'simplified', 'spearheaded', 'standardized', 'streamlined',
  'strengthened', 'structured', 'supervised', 'surpassed', 'trained', 'transformed',
  'unified', 'upgraded', 'validated'
]);

export function runAtsAudit(profile) {
  let score = 0;
  const passed = [];
  const warnings = [];
  const suggestions = [];

  const personal = profile.personal || {};
  const experience = profile.experience || [];
  const education = profile.education || [];
  const skills = profile.skills || { technical: [], soft: [], tools: [] };
  const projects = profile.projects || [];
  const internships = profile.internships || [];

  // 1. Contact Information Checks (Total: 20 pts)
  if (personal.fullName && personal.fullName.trim().length > 2) {
    score += 5;
    passed.push('Full candidate name is clearly identified');
  } else {
    warnings.push('Candidate full name is missing or too short.');
    suggestions.push('Add your first and last name in Personal Information.');
  }

  if (personal.email && personal.email.includes('@') && personal.email.includes('.')) {
    score += 5;
    passed.push('Valid professional email address detected');
  } else {
    warnings.push('Valid email address is missing.');
    suggestions.push('Provide a professional email address for recruiter contact.');
  }

  if (personal.phone && personal.phone.replace(/[^0-9]/g, '').length >= 7) {
    score += 5;
    passed.push('Telephone contact number is provided');
  } else {
    warnings.push('Phone number is missing or incomplete.');
    suggestions.push('Include a reachable phone number with country/area code.');
  }

  if (personal.location && personal.location.trim().length > 2) {
    score += 5;
    passed.push('Geographic location (City, State/Country) is provided');
  } else {
    suggestions.push('Add your city and country/state to assist geo-targeted ATS searches.');
  }

  // 2. Professional Summary / Headline (Total: 15 pts)
  if (personal.headline && personal.headline.trim().length > 3) {
    score += 5;
    passed.push('Clear professional job headline provided');
  } else {
    suggestions.push('Add a job title headline (e.g. "Senior Cloud Engineer") right under your name.');
  }

  if (personal.summary && personal.summary.trim().split(/\s+/).length >= 25) {
    score += 10;
    passed.push('Substantive professional summary provided (>25 words)');
  } else if (personal.summary && personal.summary.trim().length > 0) {
    score += 5;
    suggestions.push('Expand your professional summary to 3-5 sentences highlighting core competencies.');
  } else {
    warnings.push('Professional summary section is completely empty.');
    suggestions.push('Write a brief executive summary or use the Smart Summary Generator.');
  }

  // 3. Experience / Practical Evidence (Total: 25 pts)
  const hasExperience = experience.length > 0;
  const hasInternships = internships.length > 0;
  const hasProjects = projects.length > 0;

  if (hasExperience || hasInternships || hasProjects) {
    score += 10;
    passed.push('Documented practical experience, projects, or internships found');
  } else {
    warnings.push('No work experience, internships, or practical projects found.');
    suggestions.push('Add work experience, academic projects, or internships to demonstrate competence.');
  }

  // Check Bullet Points, Action Verbs, and Metrics
  let allBullets = [];
  experience.forEach(e => {
    if (Array.isArray(e.highlights)) allBullets.push(...e.highlights);
  });
  internships.forEach(i => {
    if (Array.isArray(i.highlights)) allBullets.push(...i.highlights);
  });
  projects.forEach(p => {
    if (p.description) allBullets.push(p.description);
    if (p.outcomes) allBullets.push(p.outcomes);
  });

  if (allBullets.length > 0) {
    let actionVerbCount = 0;
    let metricCount = 0;
    const metricRegex = /(\d+[\d,.]*%?|\$\d+[\d,.]*[kKmMbB]?|\d+x|\d+\s*(percent|users|engineers|years|clients|transactions|dollars))/i;

    allBullets.forEach(bullet => {
      const clean = bullet.trim();
      const firstWord = clean.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
      if (firstWord && ACTION_VERBS.has(firstWord)) {
        actionVerbCount++;
      }
      if (metricRegex.test(clean)) {
        metricCount++;
      }
    });

    const actionVerbRatio = actionVerbCount / allBullets.length;
    if (actionVerbRatio >= 0.4 || actionVerbCount >= 4) {
      score += 10;
      passed.push(`Strong action verbs found in bullet points (${actionVerbCount} action verbs)`);
    } else {
      suggestions.push(`Start bullet points with strong past-tense action verbs (e.g., "Led", "Architected", "Optimized" instead of "Responsible for").`);
    }

    if (metricCount >= 2) {
      score += 5;
      passed.push(`Quantified achievements detected (${metricCount} metric/impact points)`);
    } else {
      suggestions.push('Quantify your achievements with numbers, percentages, or cost savings (e.g., "Reduced latency by 34%").');
    }
  }

  // 4. Education & Academic Background (Total: 15 pts)
  if (education.length > 0) {
    const hasDegree = education.some(e => e.degree && e.degree.trim().length > 2);
    const hasSchool = education.some(e => e.institution && e.institution.trim().length > 2);
    if (hasDegree && hasSchool) {
      score += 15;
      passed.push('Clear educational credentials with degree and institution found');
    } else {
      score += 8;
      suggestions.push('Ensure each education entry lists both degree title and school/university name.');
    }
  } else {
    suggestions.push('Add your highest educational degree, university, or equivalent diploma.');
  }

  // 5. Skills Section (Total: 15 pts)
  const totalSkills = Array.isArray(skills)
    ? skills.length
    : ((skills.technical || []).length + (skills.tools || []).length);

  if (totalSkills >= 8) {
    score += 15;
    passed.push(`Comprehensive skill taxonomy detected (${totalSkills} skills & tools)`);
  } else if (totalSkills >= 4) {
    score += 10;
    suggestions.push('Add more specific technical skills, frameworks, or tools to improve keyword matching.');
  } else {
    warnings.push('Very few skills listed.');
    suggestions.push('List at least 6-8 core technical competencies and tools relevant to your target role.');
  }

  // 6. Format-Specific Parseability (Total: 10 pts)
  const currentFormat = profile.format || 'reverse-chronological';
  if (currentFormat === 'ats-friendly') {
    score += 10;
    passed.push('Using strict ATS-Friendly single-column layout optimized for parsers');
  } else if (currentFormat === 'reverse-chronological' || currentFormat === 'combination' || currentFormat === 'targeted') {
    score += 8;
    passed.push('Layout format is well-suited for both ATS parsing and human recruiters');
  } else if (currentFormat === 'creative-visual') {
    warnings.push('Creative Visual format uses multi-column design. For strict ATS portals (e.g. Workday, Taleo), switch to "ATS-Friendly" or "Reverse Chronological" before applying.');
  } else {
    score += 6;
  }

  // Cap score between 0 and 100
  score = Math.min(100, Math.max(0, score));

  const disclaimer = 'ATS Compatibility scores are rule-based heuristics designed to guide formatting and keyword presence. They do not guarantee job interview callbacks or hiring decisions, as company hiring criteria vary widely.';

  let tier = 'Needs Work';
  let tierColor = 'text-red-500 bg-red-50 dark:bg-red-950/40 border-red-200';
  if (score >= 85) {
    tier = 'ATS Optimized (Excellent)';
    tierColor = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200';
  } else if (score >= 70) {
    tier = 'Good Compatibility';
    tierColor = 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200';
  } else if (score >= 50) {
    tier = 'Moderate Compatibility';
    tierColor = 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200';
  }

  const checks = [
    ...passed.map(name => ({ status: 'pass', name })),
    ...warnings.map(name => ({ status: 'warning', name })),
    ...suggestions.map(name => ({ status: 'suggestion', name }))
  ];

  return {
    score,
    tier,
    tierColor,
    passed,
    warnings,
    suggestions,
    checks,
    disclaimer
  };
}

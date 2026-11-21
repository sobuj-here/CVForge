/**
 * CVForge - Profile Completeness Calculator
 * Calculates percentage completion and guides user on completing key sections.
 */

export function calculateCompleteness(profile) {
  const skillsCount = Array.isArray(profile.skills)
    ? profile.skills.length
    : ((profile.skills?.technical || []).length + (profile.skills?.tools || []).length);

  const checks = [
    { label: 'Full Name', done: !!(profile.personal?.fullName && profile.personal.fullName.trim().length > 2), weight: 10 },
    { label: 'Job Headline', done: !!(profile.personal?.headline && profile.personal.headline.trim().length > 3), weight: 10 },
    { label: 'Email Address', done: !!(profile.personal?.email && profile.personal.email.includes('@')), weight: 10 },
    { label: 'Phone Number', done: !!(profile.personal?.phone && profile.personal.phone.trim().length > 6), weight: 5 },
    { label: 'Location', done: !!(profile.personal?.location && profile.personal.location.trim().length > 2), weight: 5 },
    { label: 'Professional Summary', done: !!(profile.personal?.summary && profile.personal.summary.trim().length > 20), weight: 15 },
    { label: 'Education Credential', done: (profile.education || []).length > 0, weight: 15 },
    { label: 'Experience or Projects', done: (profile.experience || []).length > 0 || (profile.projects || []).length > 0 || (profile.internships || []).length > 0, weight: 15 },
    { label: 'Skills Added', done: skillsCount >= 3, weight: 10 },
    { label: 'Languages', done: (profile.languages || []).length > 0, weight: 5 }
  ];

  let completedWeight = 0;
  const missing = [];

  checks.forEach(c => {
    if (c.done) {
      completedWeight += c.weight;
    } else {
      missing.push(c.label);
    }
  });

  return {
    percentage: Math.min(100, completedWeight),
    checks,
    missing
  };
}

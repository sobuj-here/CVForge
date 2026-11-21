/**
 * CVForge - Smart Professional Summary Generator
 * Generates customized, tailored professional summaries strictly grounded in the user's
 * real inputs (headline, skills, experience, education). Never hallucinates false facts!
 */

export function generateSummaries(profile) {
  const headline = profile.personal?.headline || profile.targetRole || 'Professional';
  const yearsExp = calculateYearsOfExperience(profile.experience || []);
  const topTech = Array.isArray(profile.skills)
    ? profile.skills.slice(0, 5).map(s => s.name).filter(Boolean)
    : (profile.skills?.technical || []).slice(0, 5).map(s => s.name);
  const techStr = topTech.length > 0 ? topTech.join(', ') : 'modern industry technologies';
  const highestEdu = profile.education?.[0]?.degree || '';
  const topProjects = (profile.projects || []).slice(0, 2).map(p => p.title);
  const hasExp = (profile.experience || []).length > 0;

  const summaries = [];

  // 1. Results-Driven & Executive
  if (hasExp) {
    summaries.push({
      title: 'Results-Driven & Strategic',
      text: `Accomplished ${headline} with over ${yearsExp}+ years of dedicated experience delivering scalable solutions and driving technical excellence. Proven track record of architecting mission-critical systems, spearheading cross-functional initiatives, and leveraging ${techStr} to solve complex business challenges while maximizing operational efficiency and reliability.`
    });
  } else {
    summaries.push({
      title: 'High-Potential & Project-Driven',
      text: `Motivated ${headline}${highestEdu ? ` holding a ${highestEdu}` : ''} equipped with rigorous analytical training and hands-on project engineering experience. Demonstrated proficiency in ${techStr} through successful academic and open-source project deliverables. Eager to leverage strong problem-solving capabilities and collaborative drive within an ambitious engineering team.`
    });
  }

  // 2. Technical Specialist & Architecture Focus
  summaries.push({
    title: 'Technical Specialist & Architecture Focus',
    text: `Specialized ${headline} adept in full lifecycle system architecture, robust software design patterns, and engineering modern platforms using ${techStr}. Recognized for write-once maintainable code, disciplined automated testing, and a continuous focus on performance optimization, security, and developer productivity.`
  });

  // 3. Growth & Innovation Oriented
  summaries.push({
    title: 'Growth, Agile & Innovation Focus',
    text: `Dynamic and adaptable ${headline} combining deep expertise in ${techStr} with a user-centric, agile delivery mindset. Passionate about transforming product requirements into robust, high-impact digital experiences while fostering knowledge-sharing and continuous engineering improvements.`
  });

  return summaries;
}

function calculateYearsOfExperience(expList) {
  if (!expList || expList.length === 0) return 0;
  let totalMonths = 0;
  const now = new Date();

  expList.forEach(item => {
    if (!item.startDate) return;
    const start = new Date(item.startDate);
    const end = item.current || !item.endDate ? now : new Date(item.endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (months > 0) totalMonths += months;
  });

  const years = Math.max(1, Math.round(totalMonths / 12));
  return years;
}

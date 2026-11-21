/**
 * CVForge - Professional Summary Generator
 * Generates clear, natural, human-written professional summaries grounded in the user's
 * real inputs (headline, skills, experience, education).
 */

export function generateSummaries(profile) {
  const headline = profile.personal?.headline || profile.targetRole || 'Professional';
  const yearsExp = calculateYearsOfExperience(profile.experience || []);
  const topTech = Array.isArray(profile.skills)
    ? profile.skills.slice(0, 5).map(s => s.name).filter(Boolean)
    : (profile.skills?.technical || []).slice(0, 5).map(s => s.name);
  const techStr = topTech.length > 0 ? topTech.join(', ') : 'industry-standard tools and practices';
  const highestEdu = profile.education?.[0]?.degree || '';
  const hasExp = (profile.experience || []).length > 0;

  const summaries = [];

  if (hasExp) {
    summaries.push({
      title: 'Results-Focused Professional',
      text: `${headline} with ${yearsExp > 1 ? `${yearsExp} years of experience` : 'hands-on experience'} in ${techStr}. Proven track record of leading projects, improving operational workflows, and delivering measurable results.`
    });

    summaries.push({
      title: 'Technical & Operational Specialist',
      text: `Detail-oriented ${headline} with expertise in ${techStr}. Experienced in developing efficient solutions, collaborating across cross-functional teams, and consistently meeting project milestones.`
    });

    summaries.push({
      title: 'Leadership & Project Delivery',
      text: `Adaptable ${headline} skilled in ${techStr}. Focused on clear communication, process optimization, and driving successful outcomes from planning through execution.`
    });
  } else {
    summaries.push({
      title: 'Career Starter / Graduate',
      text: `Motivated ${headline}${highestEdu ? ` with a degree in ${highestEdu}` : ''} and practical experience in ${techStr}. Strong analytical foundation, quick to master new tools, and eager to contribute to team goals.`
    });

    summaries.push({
      title: 'Project & Skills-Focused',
      text: `${headline} with hands-on project experience in ${techStr}. Strong problem-solving abilities, collaborative mindset, and dedicated to delivering high-quality work.`
    });

    summaries.push({
      title: 'Analytical & Growth-Oriented',
      text: `Detail-focused ${headline}${highestEdu ? ` holding a ${highestEdu}` : ''}. Skilled in ${techStr} with a strong work ethic and enthusiasm for learning industry best practices.`
    });
  }

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

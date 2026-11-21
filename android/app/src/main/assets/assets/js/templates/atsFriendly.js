/**
 * Format 9: ATS-Friendly CV
 * Strictly engineered for optimal machine readability across all Applicant Tracking Systems
 * (Workday, Taleo, Greenhouse, Lever, iCIMS).
 * Single column, standard semantic headers, no tables, no floating graphic elements, universal typography.
 */

import {
  escapeHtml,
  formatDateRange,
  getCleanUrl,
  formatEducationDegree,
  isFreshGraduateCandidate,
  renderReferencesHtml,
  isSectionEnabled,
  getSkillsList
} from './templateUtils.js';

export function renderAtsFriendly(profile) {
  const p = profile.personal || {};
  const dateFormat = 'Month YYYY'; // Best standard for ATS
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const allSkills = getSkillsList(profile);

  // Reverse chronological sort for parser clarity
  const expList = [...(profile.experience || [])].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const eduList = [...(profile.education || [])].sort((a, b) => {
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  return `
    <div class="cv-format cv-ats-friendly max-w-[800px] mx-auto text-black leading-normal text-sm font-sans bg-white p-2">
      <!-- Standard ATS Header -->
      <header class="text-center pb-3 mb-4 border-b border-black">
        <h1 class="cv-name text-2xl font-bold uppercase tracking-wide text-black mb-1">
          ${escapeHtml(p.fullName || 'CANDIDATE NAME')}
        </h1>
        ${p.headline ? `<div class="text-sm font-semibold text-black uppercase mb-1.5">${escapeHtml(p.headline)}</div>` : ''}

        <div class="cv-contact-line text-xs text-black space-x-1.5">
          ${p.location ? `<span>${escapeHtml(p.location)}</span> |` : ''}
          ${p.email ? `<span>${escapeHtml(p.email)}</span> |` : ''}
          ${p.phone ? `<span>${escapeHtml(p.phone)}</span>` : ''}
          ${p.linkedin ? `| <span>${getCleanUrl(p.linkedin)}</span>` : ''}
          ${p.github ? `| <span>${getCleanUrl(p.github)}</span>` : ''}
          ${p.website ? `| <span>${getCleanUrl(p.website)}</span>` : ''}
        </div>
      </header>

      <!-- Standard Section 1: Professional Summary / Career Objective -->
      ${p.summary || p.objective ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            ${p.objective && !p.summary ? 'Career Objective' : 'Professional Summary'}
          </h2>
          <p class="text-xs text-black leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Standard Section: Skills -->
      ${isSectionEnabled(profile, 'skills') && allSkills.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Skills
          </h2>
          <div class="text-xs text-black leading-relaxed">
            ${allSkills.map(s => escapeHtml(s.level ? `${s.name} (${s.level})` : s.name)).join(' • ')}
          </div>
        </section>
      ` : ''}

      <!-- For Fresh Grads: Education Comes First -->
      ${isFreshGraduate && eduList.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Education
          </h2>
          <div class="space-y-2 text-xs">
            ${eduList.map(edu => `
              <div>
                <div class="flex justify-between items-baseline font-bold text-black">
                  <span>${formatEducationDegree(edu)}</span>
                  <span>${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
                <div class="text-black">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''} ${edu.gpa ? `— GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
                ${edu.coursework ? `<div class="text-[11px] text-black">Relevant Coursework: ${escapeHtml(edu.coursework)}</div>` : ''}
                ${edu.honors ? `<div class="text-[11px] text-black">${escapeHtml(edu.honors)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Standard Section: Professional Work Experience (Omitted if fresh graduate or empty) -->
      ${!isFreshGraduate && expList.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Work Experience
          </h2>
          <div class="space-y-3">
            ${expList.map(exp => `
              <div>
                <div class="flex justify-between items-baseline text-xs font-bold text-black">
                  <span>${escapeHtml(exp.title)}</span>
                  <span>${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}</span>
                </div>
                <div class="text-xs text-black mb-1">
                  <span class="font-semibold">${escapeHtml(exp.company)}</span>
                  ${exp.location ? ` — ${escapeHtml(exp.location)}` : ''}
                </div>

                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 space-y-0.5 text-xs text-black">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}

                ${Array.isArray(exp.technologies) && exp.technologies.length > 0 ? `
                  <div class="mt-1 text-[11px] text-black">
                    <strong>Technologies Used:</strong> ${exp.technologies.map(t => escapeHtml(t)).join(', ')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Standard Section: Projects (if present) -->
      ${profile.projects?.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            ${isFreshGraduate ? 'Academic & Practical Projects' : 'Key Projects'}
          </h2>
          <div class="space-y-2 text-xs">
            ${profile.projects.map(proj => `
              <div>
                <div class="font-bold text-black">
                  ${escapeHtml(proj.title)}
                  ${proj.role ? ` — Role: ${escapeHtml(proj.role)}` : ''}
                </div>
                ${proj.description ? `<p class="text-black">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<p class="text-black"><strong>Outcomes:</strong> ${escapeHtml(proj.outcomes)}</p>` : ''}
                ${Array.isArray(proj.technologies) && proj.technologies.length > 0 ? `<div class="text-[11px] text-black"><strong>Tools & Technologies:</strong> ${proj.technologies.map(t => escapeHtml(t)).join(', ')}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Standard Section: Education (For experienced candidates) -->
      ${!isFreshGraduate && eduList.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Education
          </h2>
          <div class="space-y-2 text-xs">
            ${eduList.map(edu => `
              <div>
                <div class="flex justify-between items-baseline font-bold text-black">
                  <span>${formatEducationDegree(edu)}</span>
                  <span>${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
                <div class="text-black">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''} ${edu.gpa ? `— GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
                ${edu.honors ? `<div class="text-[11px] text-black">${escapeHtml(edu.honors)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Standard Section: Certifications -->
      ${profile.certifications?.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Certifications
          </h2>
          <div class="space-y-1 text-xs text-black">
            ${profile.certifications.map(c => `
              <div class="flex justify-between">
                <span><strong>${escapeHtml(c.title)}</strong>, ${escapeHtml(c.issuer)}</span>
                <span>${formatDateRange(c.issueDate, c.expiryDate, false, dateFormat)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Languages -->
      ${profile.languages?.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Languages
          </h2>
          <div class="text-xs text-black">
            ${profile.languages.map(l => `${escapeHtml(l.name)} (${escapeHtml(l.proficiency || 'Proficient')})`).join(' | ')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, '#000000')}

    </div>
  `;
}

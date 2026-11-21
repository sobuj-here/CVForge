/**
 * Format: Modern ATS Resume
 * Strictly single-column, 100% ATS parseable (Workday, Taleo, Greenhouse, Lever).
 * Uses clear semantic headers, high-contrast black/slate text, bulleted achievements,
 * and zero complex layout tables or graphic shapes.
 */

import {
  escapeHtml,
  formatDateRange,
  formatEducationDegree,
  isFreshGraduateCandidate,
  isSectionEnabled,
  getSkillsList
} from './templateUtils.js';

export function renderModernAts(profile) {
  const p = profile.personal || {};
  const dateFormat = 'Month YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  const expList = [...(profile.experience || [])].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const eduList = [...(profile.education || [])].sort((a, b) => {
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  return `
    <div class="cv-format cv-modern-ats max-w-[800px] mx-auto bg-white text-black text-xs font-sans p-6 sm:p-8 leading-normal">
      
      <!-- Standard ATS Header -->
      <header class="text-center pb-3 mb-4 border-b-2 border-black">
        <h1 class="cv-name text-2xl font-bold uppercase tracking-tight text-black">
          ${escapeHtml(p.fullName || 'Candidate Name')}
        </h1>
        ${p.headline ? `<div class="text-xs font-semibold text-black mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs text-black mt-1 flex flex-wrap justify-center gap-x-2 gap-y-0.5">
          ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
          ${p.phone ? `<span>| ${escapeHtml(p.phone)}</span>` : ''}
          ${p.email ? `<span>| ${escapeHtml(p.email)}</span>` : ''}
          ${p.linkedin ? `<span>| ${escapeHtml(p.linkedin)}</span>` : ''}
          ${p.github ? `<span>| ${escapeHtml(p.github)}</span>` : ''}
        </div>
      </header>

      <!-- Professional Summary -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            ${p.objective && !p.summary ? 'Career Objective' : 'Professional Summary'}
          </h2>
          <p class="text-xs text-black leading-relaxed text-justify">
            ${escapeHtml(p.summary || p.objective)}
          </p>
        </section>
      ` : ''}

      <!-- Skills -->
      ${isSectionEnabled(profile, 'skills') && skills.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Skills
          </h2>
          <div class="text-xs text-black leading-relaxed">
            ${skills.map(s => escapeHtml(s.level ? `${s.name} (${s.level})` : s.name)).join(' • ')}
          </div>
        </section>
      ` : ''}

      <!-- Experience (Comes first for experienced candidates) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Work Experience
          </h2>
          <div class="space-y-3 text-xs">
            ${expList.map(exp => `
              <div>
                <div class="flex justify-between items-baseline font-bold text-black">
                  <span>${escapeHtml(exp.title || 'Job Title')}</span>
                  <span>${formatDateRange(exp.startDate, exp.endDate, dateFormat, exp.current)}</span>
                </div>
                <div class="text-black font-semibold">${escapeHtml(exp.company || '')}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
                ${exp.highlights && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 mt-1 space-y-0.5 text-black">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education -->
      ${isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Education
          </h2>
          <div class="space-y-2 text-xs">
            ${eduList.map(edu => `
              <div>
                <div class="flex justify-between items-baseline font-bold text-black">
                  <span>${escapeHtml(formatEducationDegree(edu))}</span>
                  <span>${formatDateRange(edu.startDate, edu.endDate, dateFormat)}</span>
                </div>
                <div class="text-black">${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                ${edu.gpa ? `<div class="text-[11px] text-black">Grade / GPA: ${escapeHtml(edu.gpa)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Projects -->
      ${isSectionEnabled(profile, 'projects') && (profile.projects || []).length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Key Projects
          </h2>
          <div class="space-y-2 text-xs">
            ${profile.projects.map(proj => `
              <div>
                <div class="font-bold text-black">${escapeHtml(proj.title || '')}</div>
                ${proj.description ? `<p class="text-black leading-relaxed">${escapeHtml(proj.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Certifications -->
      ${isSectionEnabled(profile, 'certifications') && (profile.certifications || []).length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Certifications
          </h2>
          <ul class="list-disc list-outside ml-4 text-xs text-black space-y-0.5">
            ${profile.certifications.map(c => `
              <li><strong>${escapeHtml(c.title || '')}</strong>${c.issuer ? ` — ${escapeHtml(c.issuer)}` : ''}</li>
            `).join('')}
          </ul>
        </section>
      ` : ''}

      <!-- References -->
      ${(profile.references && profile.references.filter(r => r && (r.name || r.title || r.organization || r.company || r.email || r.phone)).length > 0) ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            References
          </h2>
          <div class="space-y-1 text-xs text-black">
            ${profile.references.filter(r => r && (r.name || r.title || r.organization || r.company || r.email || r.phone)).map(r => `
              <div>
                <strong>${escapeHtml(r.name || '')}</strong> — ${escapeHtml(r.title || '')}${r.organization || r.company ? `, ${escapeHtml(r.organization || r.company)}` : ''}
                ${r.email ? ` | Email: ${escapeHtml(r.email)}` : ''}
                ${r.phone ? ` | Phone: ${escapeHtml(r.phone)}` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

    </div>
  `;
}

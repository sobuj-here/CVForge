/**
 * Format: United States Resume (Standard US Resume)
 * Strict American standards:
 * - Sized for US Letter (8.5 x 11 in)
 * - Zero photos or protected demographic details (strictly EEOC compliant)
 * - Powerful action-oriented accomplishment bullet points
 * - Concise, recruiter-scannable layout
 */

import {
  escapeHtml,
  formatDateRange,
  formatEducationDegree,
  isFreshGraduateCandidate,
  isSectionEnabled,
  getSkillsList
} from './templateUtils.js';

export function renderUsResume(profile) {
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
    <div class="cv-format cv-us-resume max-w-[800px] mx-auto bg-white text-slate-900 text-xs font-sans p-8 leading-normal shadow-xs">
      
      <!-- US Header (Clean, centered, no photos) -->
      <header class="text-center pb-3 mb-4 border-b border-slate-900">
        <h1 class="cv-name text-2xl font-bold tracking-tight text-slate-950 uppercase">
          ${escapeHtml(p.fullName || 'Candidate Name')}
        </h1>
        ${p.headline ? `<div class="text-xs font-semibold text-slate-700 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs text-slate-600 mt-1 flex flex-wrap justify-center gap-x-3 gap-y-0.5">
          ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
          ${p.phone ? `<span>• ${escapeHtml(p.phone)}</span>` : ''}
          ${p.email ? `<span>• <a href="mailto:${p.email}" class="text-blue-700 underline">${escapeHtml(p.email)}</a></span>` : ''}
          ${p.linkedin ? `<span>• <a href="${p.linkedin}" target="_blank" class="text-blue-700 underline">LinkedIn</a></span>` : ''}
          ${p.github ? `<span>• <a href="${p.github}" target="_blank" class="text-blue-700 underline">GitHub</a></span>` : ''}
        </div>
      </header>

      <!-- Professional Summary -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            ${p.objective && !p.summary ? 'Objective' : 'Professional Summary'}
          </h2>
          <p class="text-xs text-slate-800 leading-relaxed text-justify">
            ${escapeHtml(p.summary || p.objective)}
          </p>
        </section>
      ` : ''}

      <!-- Skills / Core Competencies -->
      ${isSectionEnabled(profile, 'skills') && skills.length > 0 ? `
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Core Competencies & Skills
          </h2>
          <div class="text-xs text-slate-800 leading-relaxed">
            <strong>Key Skills:</strong> ${skills.map(s => escapeHtml(s.level ? `${s.name} (${s.level})` : s.name)).join(' • ')}
          </div>
        </section>
      ` : ''}

      <!-- Experience (Comes first for experienced candidates) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Professional Experience
          </h2>
          <div class="space-y-3">
            ${expList.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline font-bold text-slate-900">
                  <span>${escapeHtml(exp.title || 'Role Title')}</span>
                  <span class="text-[11px] font-semibold text-slate-600">${formatDateRange(exp.startDate, exp.endDate, dateFormat, exp.current)}</span>
                </div>
                <div class="text-slate-700 font-semibold text-xs">${escapeHtml(exp.company || '')}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
                ${exp.highlights && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-slate-800">
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
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Education
          </h2>
          <div class="space-y-2">
            ${eduList.map(edu => `
              <div>
                <div class="flex justify-between items-baseline font-bold text-slate-900">
                  <span>${escapeHtml(formatEducationDegree(edu))}</span>
                  <span class="text-[11px] font-semibold text-slate-600">${formatDateRange(edu.startDate, edu.endDate, dateFormat)}</span>
                </div>
                <div class="text-slate-700">${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                ${edu.gpa ? `<div class="text-[11px] text-slate-600">GPA: ${escapeHtml(edu.gpa)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Projects / Capstones -->
      ${isSectionEnabled(profile, 'projects') && (profile.projects || []).length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Key Projects
          </h2>
          <div class="space-y-2">
            ${profile.projects.map(proj => `
              <div class="page-break-avoid space-y-0.5">
                <div class="font-bold text-slate-900">${escapeHtml(proj.title || '')}</div>
                ${proj.description ? `<p class="text-slate-800 leading-relaxed">${escapeHtml(proj.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Certifications -->
      ${isSectionEnabled(profile, 'certifications') && (profile.certifications || []).length > 0 ? `
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Certifications
          </h2>
          <ul class="list-disc list-outside ml-4 text-xs text-slate-800 space-y-0.5">
            ${profile.certifications.map(c => `
              <li><strong>${escapeHtml(c.title || '')}</strong>${c.issuer ? ` — ${escapeHtml(c.issuer)}` : ''}</li>
            `).join('')}
          </ul>
        </section>
      ` : ''}

      <!-- References -->
      ${(profile.references && profile.references.filter(r => r && (r.name || r.title || r.organization || r.company || r.email || r.phone)).length > 0) ? `
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
            References
          </h2>
          <div class="space-y-1 text-xs text-slate-800">
            ${profile.references.filter(r => r && (r.name || r.title || r.organization || r.company || r.email || r.phone)).map(r => `
              <div>
                <strong>${escapeHtml(r.name || '')}</strong> — ${escapeHtml(r.title || '')}${r.organization || r.company ? `, ${escapeHtml(r.organization || r.company)}` : ''}
                ${r.email ? ` | ${escapeHtml(r.email)}` : ''}
                ${r.phone ? ` | ${escapeHtml(r.phone)}` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

    </div>
  `;
}

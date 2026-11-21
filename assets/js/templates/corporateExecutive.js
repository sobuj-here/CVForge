/**
 * Format: Corporate Executive CV
 * Tailored for Directors, VPs, C-Suite, and Senior Managers.
 * Features:
 * - Bold double-bordered executive header with full-width leadership banner
 * - Executive Core Capabilities & Governance Matrix
 * - Quantified Strategic Milestones and P&L / operational impact bullets
 * - Elegant navy/slate corporate palette
 */

import {
  escapeHtml,
  formatDateRange,
  getCleanUrl,
  renderPhotoHtml,
  isSectionEnabled,
  formatEducationDegree,
  isFreshGraduateCandidate,
  renderReferencesHtml,
  getSkillsList
} from './templateUtils.js';

export function renderCorporateExecutive(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  const expList = [...(profile.experience || [])].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const photoHtml = renderPhotoHtml(profile, 'w-24 h-24', 'rounded-xl shadow-md border-2 border-white');

  return `
    <div class="cv-format cv-corporate-executive max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-serif p-8 shadow-sm">
      
      <!-- Executive Header -->
      <header class="border-b-4 border-double pb-5 mb-6" style="border-color: ${primaryColor}">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-center sm:text-left space-y-1">
            <h1 class="cv-name text-3xl font-black uppercase tracking-tight" style="color: ${primaryColor}">
              ${escapeHtml(p.fullName || 'Executive Candidate')}
            </h1>
            ${p.headline ? `
              <div class="text-sm font-bold tracking-wider text-slate-700 uppercase font-sans">
                ${escapeHtml(p.headline)}
              </div>
            ` : ''}
            <div class="cv-contact-line text-xs font-sans text-slate-600 flex flex-wrap gap-x-3 gap-y-0.5 justify-center sm:justify-start pt-1">
              ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
              ${p.phone ? `<span>• ${escapeHtml(p.phone)}</span>` : ''}
              ${p.email ? `<span>• <a href="mailto:${p.email}" class="text-blue-800 underline">${escapeHtml(p.email)}</a></span>` : ''}
              ${p.linkedin ? `<span>• <a href="${p.linkedin}" target="_blank" class="text-blue-800 underline">${getCleanUrl(p.linkedin)}</a></span>` : ''}
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>
      </header>

      <!-- Executive Profile / Strategic Value Proposition -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-5 bg-slate-50 border-l-4 p-4 rounded-r-lg page-break-avoid font-sans" style="border-color: ${primaryColor}">
          <h2 class="cv-section-title text-xs font-black uppercase tracking-widest text-slate-900 mb-1.5" style="color: ${primaryColor}">
            Executive Profile & Strategic Leadership
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed text-justify">
            ${escapeHtml(p.summary || p.objective)}
          </p>
        </section>
      ` : ''}

      <!-- Core Competencies & Governance Pillars -->
      ${isSectionEnabled(profile, 'skills') && skills.length > 0 ? `
        <section class="mb-5 page-break-avoid font-sans">
          <h2 class="cv-section-title text-xs font-black uppercase tracking-widest pb-1 mb-2.5 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Core Capabilities & Executive Competencies
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            ${skills.map(s => `
              <div class="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded">
                <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
                <span class="font-bold text-slate-900">${escapeHtml(s.name)}</span>
                ${s.level ? `<span class="text-[10px] text-slate-500">(${escapeHtml(s.level)})</span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Executive Experience -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-black uppercase tracking-widest pb-1 mb-3 border-b font-sans" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Professional Leadership & Career History
          </h2>
          <div class="space-y-4">
            ${expList.map(exp => `
              <div class="space-y-1 page-break-avoid">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline font-sans">
                  <div>
                    <span class="font-extrabold text-sm text-slate-950">${escapeHtml(exp.title || '')}</span>
                    <span class="text-slate-600 font-bold ml-1.5">| ${escapeHtml(exp.company || '')}</span>
                    ${exp.location ? `<span class="text-slate-500 font-normal text-xs ml-1">(${escapeHtml(exp.location)})</span>` : ''}
                  </div>
                  <span class="text-xs font-bold text-slate-500">${formatDateRange(exp.startDate, exp.endDate, dateFormat, exp.current)}</span>
                </div>
                ${exp.highlights && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700 leading-relaxed font-sans">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education & Credentials -->
      ${isSectionEnabled(profile, 'education') && (profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid font-sans">
          <h2 class="cv-section-title text-xs font-black uppercase tracking-widest pb-1 mb-2.5 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education & Executive Credentials
          </h2>
          <div class="space-y-2">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <div>
                  <span class="font-bold text-xs text-slate-900">${escapeHtml(formatEducationDegree(edu))}</span>
                  <span class="text-slate-600 ml-1">— ${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</span>
                </div>
                <span class="text-xs text-slate-500">${formatDateRange(edu.startDate, edu.endDate, dateFormat)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Key Projects / Strategic Initiatives -->
      ${isSectionEnabled(profile, 'projects') && (profile.projects || []).length > 0 ? `
        <section class="mb-5 font-sans">
          <h2 class="cv-section-title text-xs font-black uppercase tracking-widest pb-1 mb-2.5 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Key Projects & Capital Deliverables
          </h2>
          <div class="space-y-2.5">
            ${profile.projects.map(proj => `
              <div class="page-break-avoid space-y-0.5">
                <div class="font-bold text-xs text-slate-900">${escapeHtml(proj.title || '')}</div>
                ${proj.description ? `<p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(proj.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}

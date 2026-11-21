/**
 * Format: United Kingdom CV (British Standard Curriculum Vitae)
 * Authentic UK standard:
 * - 2-page standard format on ISO A4 paper
 * - Concise, impactful Personal Statement at top
 * - British English conventions (e.g. "Key Competencies", "Employment History")
 * - Formal Education & Qualifications
 * - References: Verified referee contacts (omitted when empty)
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

export function renderUkCv(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#0f172a';
  const dateFormat = 'Month YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  const expList = [...(profile.experience || [])].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  return `
    <div class="cv-format cv-uk-cv max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      
      <!-- UK Header -->
      <header class="text-center pb-4 mb-5 border-b-2 border-slate-900">
        <h1 class="cv-name text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
          ${escapeHtml(p.fullName || 'Candidate Name')}
        </h1>
        ${p.headline ? `<div class="text-sm font-semibold text-slate-700 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs text-slate-600 mt-2 flex flex-wrap justify-center gap-x-3 gap-y-0.5">
          ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
          ${p.phone ? `<span>• ${escapeHtml(p.phone)}</span>` : ''}
          ${p.email ? `<span>• <a href="mailto:${p.email}" class="text-blue-700 underline">${escapeHtml(p.email)}</a></span>` : ''}
          ${p.linkedin ? `<span>• <a href="${p.linkedin}" target="_blank" class="text-blue-700 underline">LinkedIn</a></span>` : ''}
          ${p.website ? `<span>• <a href="${p.website}" target="_blank" class="text-blue-700 underline">Portfolio</a></span>` : ''}
        </div>
      </header>

      <!-- Personal Statement -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Personal Statement
          </h2>
          <p class="text-xs text-slate-800 leading-relaxed text-justify">
            ${escapeHtml(p.summary || p.objective)}
          </p>
        </section>
      ` : ''}

      <!-- Key Competencies & Skills -->
      ${isSectionEnabled(profile, 'skills') && skills.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Key Competencies & Skills
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            ${skills.map(s => `
              <div class="flex items-center gap-1.5 text-slate-800">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                <span class="font-medium">${escapeHtml(s.name)}</span>
                ${s.level ? `<span class="text-slate-500 text-[10px]">(${escapeHtml(s.level)})</span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Employment History -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-3">
            Employment History
          </h2>
          <div class="space-y-3.5">
            ${expList.map(exp => `
              <div class="page-break-avoid space-y-1">
                <div class="flex justify-between items-baseline font-bold text-slate-900">
                  <span class="text-xs font-bold">${escapeHtml(exp.title || '')}</span>
                  <span class="text-[11px] font-semibold text-slate-500">${formatDateRange(exp.startDate, exp.endDate, dateFormat, exp.current)}</span>
                </div>
                <div class="text-xs text-slate-700 font-semibold">${escapeHtml(exp.company || '')}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
                ${exp.highlights && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-slate-700">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education & Qualifications -->
      ${isSectionEnabled(profile, 'education') && (profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2.5">
            Education & Qualifications
          </h2>
          <div class="space-y-2.5">
            ${profile.education.map(edu => `
              <div>
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-xs text-slate-900">${escapeHtml(formatEducationDegree(edu))}</span>
                  <span class="text-[11px] text-slate-500">${formatDateRange(edu.startDate, edu.endDate, dateFormat)}</span>
                </div>
                <div class="text-slate-700 text-xs">${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                ${edu.gpa ? `<div class="text-[11px] text-slate-500">Classification / Grade: ${escapeHtml(edu.gpa)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Projects -->
      ${isSectionEnabled(profile, 'projects') && (profile.projects || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Key Projects
          </h2>
          <div class="space-y-2">
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

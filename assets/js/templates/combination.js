/**
 * Format 5: Combination / Hybrid CV
 * Combines high-level executive functional competence pillars with exhaustive
 * employment history or project-based proof points. Highly favored by recruiters.
 */

import {
  escapeHtml,
  formatDateRange,
  getCleanUrl,
  renderPhotoHtml,
  isSectionEnabled,
  formatEducationDegree,
  isFreshGraduateCandidate,
  renderCategorizedSkillsHtml,
  renderReferencesHtml,
  getSkillsList
} from './templateUtils.js';

export function renderCombination(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = settings.dateFormat || 'Month YYYY';

  // Sort experience reverse-chronologically
  const expList = [...(profile.experience || [])].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const eduList = [...(profile.education || [])].sort((a, b) => {
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const photoHtml = renderPhotoHtml(profile, 'w-24 h-24', 'rounded-2xl shadow-xs');
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  // Collect skills list
  const allSkillsList = getSkillsList(profile);

  return `
    <div class="cv-format cv-combination max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm">
      <!-- Executive Header -->
      <header class="border-b-2 pb-4 mb-5" style="border-color: ${primaryColor}">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex-1">
            <h1 class="cv-name text-3xl font-extrabold tracking-tight uppercase" style="color: ${primaryColor}">
              ${escapeHtml(p.fullName || 'Candidate Name')}
            </h1>
            ${p.headline ? `<p class="text-sm font-bold text-slate-700 tracking-wide mt-0.5">${escapeHtml(p.headline)}</p>` : ''}
            <div class="cv-contact-line text-xs text-slate-600 mt-2 space-y-0.5">
              ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
              <div>${escapeHtml(p.email || '')} ${p.phone ? `• ${escapeHtml(p.phone)}` : ''}</div>
              <div class="text-blue-700">
                ${p.linkedin ? `<a href="${p.linkedin}" target="_blank" class="hover:underline">LinkedIn</a>` : ''}
                ${p.github ? ` • <a href="${p.github}" target="_blank" class="hover:underline">GitHub</a>` : ''}
                ${p.website ? ` • <a href="${p.website}" target="_blank" class="hover:underline">Portfolio</a>` : ''}
              </div>
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>
      </header>

      <!-- Executive Profile / Summary -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-5 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            ${p.objective && !p.summary ? 'Career Objective' : 'Executive Profile & Strategic Capabilities'}
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Top Half: Core Competency & Leadership Matrix (Hybrid Pillar) -->
      ${isSectionEnabled(profile, 'skills') && allSkillsList.length > 0 ? `
        <section class="mb-5 bg-slate-50 border border-slate-200 rounded-lg p-3.5 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-extrabold uppercase tracking-wider mb-2" style="color: ${primaryColor}">
            Skills & Core Capabilities
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            ${allSkillsList.map(sk => `
              <div class="flex items-center gap-1.5 text-slate-800">
                <span class="w-1.5 h-1.5 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
                <span class="font-medium">${escapeHtml(sk.name)}</span>
                ${sk.level ? `<span class="text-[10px] text-slate-500 font-normal">(${escapeHtml(sk.level)})</span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- For Fresh Grads: Highlight Education First -->
      ${isFreshGraduate && isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
        <section class="mb-5 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education & Academic Credentials
          </h2>
          <div class="space-y-2 text-xs">
            ${eduList.map(edu => `
              <div class="flex justify-between items-baseline">
                <div>
                  <span class="font-bold text-slate-900">${formatEducationDegree(edu)}</span>
                  <span class="text-slate-600"> — ${escapeHtml(edu.institution)}</span>
                  ${edu.gpa ? `<span class="text-slate-500"> (GPA: ${escapeHtml(edu.gpa)})</span>` : ''}
                </div>
                <span class="text-slate-500">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Bottom Half: Full Detailed Reverse Chronological Work History (Omitted if fresh graduate or empty) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Professional Experience & Career History
          </h2>
          <div class="space-y-4">
            ${expList.map(exp => `
              <div class="break-inside-avoid">
                <div class="flex justify-between items-baseline">
                  <div>
                    <span class="font-bold text-slate-900 text-sm">${escapeHtml(exp.title)}</span>
                    <span class="text-slate-600 font-semibold text-xs"> — ${escapeHtml(exp.company)}</span>
                  </div>
                  <span class="text-xs font-semibold text-slate-600">
                    ${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}
                  </span>
                </div>
                ${exp.location ? `<div class="text-[11px] text-slate-500 mb-1.5 italic">${escapeHtml(exp.location)}</div>` : ''}

                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Key Projects -->
      ${isSectionEnabled(profile, 'projects') && profile.projects?.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            ${isFreshGraduate ? 'Key Applied Projects & Deliverables' : 'Signature Projects'}
          </h2>
          <div class="space-y-3">
            ${profile.projects.map(proj => `
              <div class="break-inside-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">${escapeHtml(proj.title)} ${proj.role ? `(${escapeHtml(proj.role)})` : ''}</span>
                  ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="text-xs text-blue-700 hover:underline">Live Demo</a>` : ''}
                </div>
                ${proj.description ? `<p class="text-xs text-slate-700 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<p class="text-xs text-slate-600 italic mt-0.5">Impact: ${escapeHtml(proj.outcomes)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education (For experienced candidates) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
        <section class="mb-5 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education
          </h2>
          <div class="space-y-2 text-xs">
            ${eduList.map(edu => `
              <div class="flex justify-between items-baseline">
                <div>
                  <span class="font-bold text-slate-900">${formatEducationDegree(edu)}</span>
                  <span class="text-slate-600"> — ${escapeHtml(edu.institution)}</span>
                  ${edu.gpa ? `<span class="text-slate-500"> (GPA: ${escapeHtml(edu.gpa)})</span>` : ''}
                </div>
                <span class="text-slate-500">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Certifications -->
      ${isSectionEnabled(profile, 'certifications') && profile.certifications?.length > 0 ? `
        <section class="mb-5 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Certifications & Training
          </h2>
          <div class="flex flex-wrap gap-x-6 gap-y-1 text-xs">
            ${profile.certifications.map(c => `
              <div><strong>${escapeHtml(c.title)}</strong> — ${escapeHtml(c.issuer)}</div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}

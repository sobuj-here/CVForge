/**
 * Format: Clean Minimal CV
 * Inspired by Swiss modernism: disciplined whitespace, ultra-clear visual hierarchy,
 * elegant understated hairline accents, and high readability.
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

export function renderCleanMinimal(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#0f172a';
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  const photoHtml = renderPhotoHtml(profile, 'w-20 h-20', 'rounded-lg grayscale hover:grayscale-0 transition');

  return `
    <div class="cv-format cv-clean-minimal max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      
      <!-- Minimalist Header -->
      <header class="flex justify-between items-start pb-6 mb-6 border-b border-slate-200">
        <div class="space-y-1.5">
          <h1 class="cv-name text-3xl font-light tracking-tight text-slate-900">
            <span class="font-extrabold">${escapeHtml(p.fullName || 'Candidate Name')}</span>
          </h1>
          ${p.headline ? `<p class="text-xs font-medium text-slate-500 tracking-wide">${escapeHtml(p.headline)}</p>` : ''}
          <div class="cv-contact-line text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-0.5 pt-1">
            ${p.email ? `<a href="mailto:${p.email}" class="hover:text-slate-900 underline underline-offset-2">${escapeHtml(p.email)}</a>` : ''}
            ${p.phone ? `<span>${escapeHtml(p.phone)}</span>` : ''}
            ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
            ${p.linkedin ? `<a href="${p.linkedin}" target="_blank" class="hover:text-slate-900 underline underline-offset-2">LinkedIn</a>` : ''}
            ${p.github ? `<a href="${p.github}" target="_blank" class="hover:text-slate-900 underline underline-offset-2">GitHub</a>` : ''}
            ${p.website ? `<a href="${p.website}" target="_blank" class="hover:text-slate-900 underline underline-offset-2">Portfolio</a>` : ''}
          </div>
        </div>
        ${photoHtml ? `<div class="shrink-0 ml-4">${photoHtml}</div>` : ''}
      </header>

      <!-- Summary -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-6 grid grid-cols-12 gap-4 page-break-avoid">
          <div class="col-span-12 sm:col-span-3">
            <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Profile
            </h2>
          </div>
          <div class="col-span-12 sm:col-span-9">
            <p class="text-xs text-slate-700 leading-relaxed text-justify">
              ${escapeHtml(p.summary || p.objective)}
            </p>
          </div>
        </section>
      ` : ''}

      <!-- Skills -->
      ${isSectionEnabled(profile, 'skills') && skills.length > 0 ? `
        <section class="mb-6 grid grid-cols-12 gap-4 page-break-avoid">
          <div class="col-span-12 sm:col-span-3">
            <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Skills
            </h2>
          </div>
          <div class="col-span-12 sm:col-span-9">
            <div class="flex flex-wrap gap-1.5">
              ${skills.map(s => `
                <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs">
                  ${escapeHtml(s.name)}
                  ${s.level ? `<span class="text-slate-500 font-normal">(${escapeHtml(s.level)})</span>` : ''}
                </span>
              `).join('')}
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Experience (Omitted if fresh graduate or empty) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && (profile.experience || []).length > 0 ? `
        <section class="mb-6 grid grid-cols-12 gap-4">
          <div class="col-span-12 sm:col-span-3">
            <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Experience
            </h2>
          </div>
          <div class="col-span-12 sm:col-span-9 space-y-4">
            ${profile.experience.map(exp => `
              <div class="space-y-1 page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-xs text-slate-900">${escapeHtml(exp.title || '')}</span>
                  <span class="text-[11px] text-slate-400">${formatDateRange(exp.startDate, exp.endDate, dateFormat, exp.current)}</span>
                </div>
                <div class="text-[11px] text-slate-600 font-medium">${escapeHtml(exp.company || '')}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
                ${exp.highlights && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-600 mt-1">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education -->
      ${isSectionEnabled(profile, 'education') && (profile.education || []).length > 0 ? `
        <section class="mb-6 grid grid-cols-12 gap-4 page-break-avoid">
          <div class="col-span-12 sm:col-span-3">
            <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Education
            </h2>
          </div>
          <div class="col-span-12 sm:col-span-9 space-y-3">
            ${profile.education.map(edu => `
              <div>
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-xs text-slate-900">${escapeHtml(formatEducationDegree(edu))}</span>
                  <span class="text-[11px] text-slate-400">${formatDateRange(edu.startDate, edu.endDate, dateFormat)}</span>
                </div>
                <div class="text-[11px] text-slate-600">${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                ${edu.gpa ? `<div class="text-[10px] text-slate-500">Result: ${escapeHtml(edu.gpa)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Projects -->
      ${isSectionEnabled(profile, 'projects') && (profile.projects || []).length > 0 ? `
        <section class="mb-6 grid grid-cols-12 gap-4">
          <div class="col-span-12 sm:col-span-3">
            <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Projects
            </h2>
          </div>
          <div class="col-span-12 sm:col-span-9 space-y-3">
            ${profile.projects.map(proj => `
              <div class="page-break-avoid space-y-0.5">
                <div class="font-bold text-xs text-slate-900">${escapeHtml(proj.title || '')}</div>
                ${proj.description ? `<p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(proj.description)}</p>` : ''}
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

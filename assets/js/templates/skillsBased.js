/**
 * Format 4: Skills-Based CV
 * Organizes profile around verified skill matrices, proficiency tiers, tooling domains,
 * and project-based proof points that validate each skill.
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

export function renderSkillsBased(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = settings.dateFormat || 'Month YYYY';

  const allSkills = getSkillsList(profile);

  const photoHtml = renderPhotoHtml(profile, 'w-24 h-24', 'rounded-2xl shadow-xs');
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  return `
    <div class="cv-format cv-skills-based max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm">
      <!-- Header -->
      <header class="border-b-4 pb-4 mb-5" style="border-color: ${primaryColor}">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex-1">
            <h1 class="cv-name text-3xl font-black tracking-tight" style="color: ${primaryColor}">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
            ${p.headline ? `<p class="text-base font-semibold text-slate-700">${escapeHtml(p.headline)}</p>` : ''}
            <div class="cv-contact-line text-xs text-slate-600 mt-2 space-y-0.5">
              ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
              <div>
                ${p.email ? `<a href="mailto:${p.email}" class="hover:underline">${escapeHtml(p.email)}</a>` : ''}
                ${p.phone ? ` • ${escapeHtml(p.phone)}` : ''}
              </div>
              <div class="text-blue-700 space-x-2">
                ${p.github ? `<a href="${p.github}" target="_blank" class="hover:underline">GitHub</a>` : ''}
                ${p.linkedin ? `<a href="${p.linkedin}" target="_blank" class="hover:underline">LinkedIn</a>` : ''}
                ${p.website || p.portfolio ? `<a href="${p.website || p.portfolio}" target="_blank" class="hover:underline">Portfolio</a>` : ''}
              </div>
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>
      </header>

      <!-- Technical Profile / Objective -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider mb-1.5" style="color: ${primaryColor}">
            ${p.objective && !p.summary ? 'Career Objective' : 'Technical Profile & Core Competence'}
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Centerpiece Section: Skills & Competency Matrix -->
      ${isSectionEnabled(profile, 'skills') && allSkills.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Skills & Competencies
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            ${allSkills.map(sk => `
              <div class="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50/60 text-xs">
                <span class="font-semibold text-slate-800">${escapeHtml(sk.name)}</span>
                ${sk.level ? `
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    sk.level === 'Expert' || sk.level === 'Proficient' ? 'bg-emerald-100 text-emerald-800' :
                    sk.level === 'Advanced' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-200 text-slate-700'
                  }">${escapeHtml(sk.level)}</span>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Validating Projects & Evidence -->
      ${isSectionEnabled(profile, 'projects') && profile.projects?.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Project-Based Proof Points & Implementations
          </h2>

          <div class="space-y-3.5">
            ${profile.projects.map(proj => `
              <div class="border-l-2 pl-3 border-slate-300 page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">
                    ${escapeHtml(proj.title)}
                    ${proj.projectType ? `<span class="text-[11px] font-semibold text-slate-500"> [${escapeHtml(proj.projectType)}]</span>` : ''}
                    ${proj.role ? `<span class="font-normal text-slate-600"> (${escapeHtml(proj.role)})</span>` : ''}
                  </span>
                  ${proj.liveUrl || proj.githubUrl ? `
                    <span class="text-xs text-blue-700 space-x-1.5">
                      ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="hover:underline">Demo</a>` : ''}
                      ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" class="hover:underline">Code</a>` : ''}
                    </span>
                  ` : ''}
                </div>
                ${proj.description ? `<p class="text-xs text-slate-700 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<p class="text-xs text-slate-600 mt-0.5"><strong>Verified Impact:</strong> ${escapeHtml(proj.outcomes)}</p>` : ''}
                ${Array.isArray(proj.technologies) && proj.technologies.length > 0 ? `
                  <div class="text-[11px] text-slate-500 mt-0.5"><strong>Skills Applied:</strong> ${proj.technologies.map(t => escapeHtml(t)).join(', ')}</div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Work History Summary (Omitted if fresh graduate or empty) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && profile.experience?.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Employment History
          </h2>
          <div class="space-y-2 text-xs">
            ${profile.experience.map(exp => `
              <div class="flex justify-between items-baseline page-break-avoid">
                <div>
                  <span class="font-bold text-slate-900">${escapeHtml(exp.title)}</span>
                  <span class="text-slate-600"> — ${escapeHtml(exp.company)}</span>
                </div>
                <span class="text-slate-500">${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education & Credentials -->
      ${isSectionEnabled(profile, 'education') && profile.education?.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education
          </h2>
          <div class="space-y-2 text-xs">
            ${profile.education.map(edu => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <div>
                    <span class="font-bold text-slate-900">${formatEducationDegree(edu)}</span>
                    <span class="text-slate-600"> — ${escapeHtml(edu.institution)}</span>
                  </div>
                  <span class="text-slate-500">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
                ${edu.coursework ? `<div class="text-[11px] text-slate-500 mt-0.5"><strong>Coursework:</strong> ${escapeHtml(edu.coursework)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Certifications -->
      ${isSectionEnabled(profile, 'certifications') && profile.certifications?.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Certifications
          </h2>
          <div class="flex flex-wrap gap-x-6 gap-y-1 text-xs">
            ${profile.certifications.map(c => `
              <div><strong>${escapeHtml(c.title)}</strong> — ${escapeHtml(c.issuer || '')}${c.issueDate ? ` (${escapeHtml(c.issueDate)})` : ''}</div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}

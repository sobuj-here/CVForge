/**
 * Format 1: Chronological CV
 * Focuses on long-term career progression and loyalty, arranged in forward chronological order
 * (earliest history to present), highlighting promotions, milestones, and foundational roots.
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
  renderReferencesHtml
} from './templateUtils.js';

export function renderChronological(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = settings.dateFormat || 'Month YYYY';

  // Sort experience from OLDEST to NEWEST for true forward chronological progression
  const expList = [...(profile.experience || [])].sort((a, b) => {
    return (a.startDate || '').localeCompare(b.startDate || '');
  });

  const eduList = [...(profile.education || [])].sort((a, b) => {
    return (a.startDate || '').localeCompare(b.startDate || '');
  });

  const photoHtml = renderPhotoHtml(profile, 'w-24 h-24', 'rounded-xl shadow-xs');
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  return `
    <div class="cv-format cv-chronological max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm">
      <!-- Header -->
      <header class="border-b-2 pb-4 mb-6" style="border-color: ${primaryColor}">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="cv-name text-3xl font-bold tracking-tight" style="color: ${primaryColor}">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
            ${p.headline ? `<p class="text-base font-semibold text-slate-600 mt-1">${escapeHtml(p.headline)}</p>` : ''}
            <div class="inline-block mt-2 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border border-slate-300 text-slate-600 bg-slate-50">
              Career Progression CV
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>

        <div class="cv-contact-line flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-3 pt-2 border-t border-slate-200">
          ${p.email ? `<span><strong>Email:</strong> ${escapeHtml(p.email)}</span>` : ''}
          ${p.phone ? `<span><strong>Tel:</strong> ${escapeHtml(p.phone)}</span>` : ''}
          ${p.location ? `<span><strong>Location:</strong> ${escapeHtml(p.location)}</span>` : ''}
          ${p.linkedin ? `<span><strong>LinkedIn:</strong> <a href="${p.linkedin}" target="_blank" class="text-blue-700 hover:underline">${getCleanUrl(p.linkedin)}</a></span>` : ''}
          ${p.website ? `<span><strong>Web:</strong> <a href="${p.website}" target="_blank" class="text-blue-700 hover:underline">${getCleanUrl(p.website)}</a></span>` : ''}
        </div>
      </header>

      <!-- Professional Summary / Objective -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs uppercase tracking-widest font-bold pb-1 mb-2 border-b border-slate-300" style="color: ${primaryColor}">
            ${p.objective && !p.summary ? 'Career Objective' : 'Executive Career Profile'}
          </h2>
          <p class="text-slate-700 leading-relaxed text-justify text-xs">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Foundational Education & Credentials -->
      ${isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs uppercase tracking-widest font-bold pb-1 mb-3 border-b border-slate-300" style="color: ${primaryColor}">
            1. Academic & Professional Foundations
          </h2>
          <div class="space-y-3">
            ${eduList.map(edu => `
              <div class="border-l-2 pl-3 border-slate-300 break-inside-avoid">
                <div class="flex justify-between items-baseline">
                  <h3 class="font-bold text-slate-900 text-xs">${formatEducationDegree(edu)}</h3>
                  <span class="text-xs font-medium text-slate-500">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
                <div class="text-xs text-slate-600 font-medium">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                ${edu.gpa ? `<div class="text-xs text-slate-600 mt-0.5"><strong>Academic Standing:</strong> ${escapeHtml(edu.gpa)} ${edu.honors ? `(${escapeHtml(edu.honors)})` : ''}</div>` : ''}
                ${edu.coursework ? `<div class="text-xs text-slate-500 mt-0.5"><strong>Core Disciplines:</strong> ${escapeHtml(edu.coursework)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Chronological Career History (Oldest -> Newest) - Omitted if fresh graduate or empty -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-6">
          <div class="flex items-center justify-between pb-1 mb-4 border-b border-slate-300">
            <h2 class="cv-section-title text-xs uppercase tracking-widest font-bold" style="color: ${primaryColor}">
              2. Progressive Career History & Timeline
            </h2>
            <span class="text-[11px] italic text-slate-500">Ordered chronologically</span>
          </div>

          <div class="relative border-l-2 pl-4 ml-1 space-y-5" style="border-color: ${primaryColor}">
            ${expList.map((exp) => `
              <div class="relative break-inside-avoid">
                <!-- Timeline bullet node -->
                <div class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-white border-2" style="border-color: ${primaryColor}"></div>
                
                <div class="flex justify-between items-baseline">
                  <h3 class="font-bold text-sm text-slate-900">${escapeHtml(exp.title)}</h3>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    ${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}
                  </span>
                </div>
                
                <div class="text-xs font-semibold text-slate-600 mb-1.5">
                  ${escapeHtml(exp.company)}${exp.location ? ` — ${escapeHtml(exp.location)}` : ''}
                </div>

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
        <section class="mb-6">
          <h2 class="cv-section-title text-xs uppercase tracking-widest font-bold pb-1 mb-3 border-b border-slate-300" style="color: ${primaryColor}">
            ${isFreshGraduate ? '2. Applied Projects & Deliverables' : '3. Key Project Milestones'}
          </h2>
          <div class="space-y-3">
            ${profile.projects.map(proj => `
              <div class="border-l-2 pl-3 border-slate-300 break-inside-avoid">
                <div class="flex justify-between items-baseline">
                  <h3 class="font-bold text-slate-900 text-xs">${escapeHtml(proj.title)} ${proj.role ? `<span class="font-normal text-slate-500">(${escapeHtml(proj.role)})</span>` : ''}</h3>
                  ${proj.liveUrl || proj.githubUrl ? `
                    <span class="text-xs text-blue-700 space-x-1.5">
                      ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="hover:underline">Demo</a>` : ''}
                      ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" class="hover:underline">Source</a>` : ''}
                    </span>
                  ` : ''}
                </div>
                ${proj.description ? `<p class="text-xs text-slate-700 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<p class="text-xs text-slate-600 italic mt-0.5">Outcome: ${escapeHtml(proj.outcomes)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Skills Matrix (All 6 Categorized Domains) -->
      ${isSectionEnabled(profile, 'skills') ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs uppercase tracking-widest font-bold pb-1 mb-2 border-b border-slate-300" style="color: ${primaryColor}">
            ${isFreshGraduate ? '3. Competencies & Skills' : '4. Core Capabilities & Skills'}
          </h2>
          ${renderCategorizedSkillsHtml(profile, primaryColor)}
        </section>
      ` : ''}

      <!-- Certifications -->
      ${isSectionEnabled(profile, 'certifications') && profile.certifications?.length > 0 ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs uppercase tracking-widest font-bold pb-1 mb-2 border-b border-slate-300" style="color: ${primaryColor}">
            Certifications & Accreditations
          </h2>
          <div class="text-xs text-slate-700 space-y-1">
            ${profile.certifications.map(c => `
              <div><strong>${escapeHtml(c.title)}</strong> — ${escapeHtml(c.issuer)}${c.issueDate ? ` (${escapeHtml(c.issueDate)})` : ''}</div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}

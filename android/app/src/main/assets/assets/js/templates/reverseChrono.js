/**
 * Format 2: Reverse Chronological CV
 * Modern standard corporate resume format. Prioritizes the most recent roles,
 * quantifiable achievements, and immediate core strengths.
 * Gracefully adapts for both seasoned professionals and fresh graduates.
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

export function renderReverseChronological(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = settings.dateFormat || 'Month YYYY';

  // Sort experience newest first (Reverse Chronological)
  const expList = [...(profile.experience || [])].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const eduList = [...(profile.education || [])].sort((a, b) => {
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const photoHtml = renderPhotoHtml(profile, 'w-24 h-24', 'mb-2 md:mb-0');
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  return `
    <div class="cv-format cv-reverse-chrono max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm">
      <!-- Header -->
      <header class="pb-5 mb-5 border-b" style="border-color: ${primaryColor}">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div class="flex-1">
            <h1 class="cv-name font-extrabold uppercase tracking-tight" style="color: ${primaryColor}">
              ${escapeHtml(p.fullName || 'Candidate Name')}
            </h1>
            ${p.headline ? `<div class="text-base font-semibold text-slate-700 mt-1 tracking-wide">${escapeHtml(p.headline)}</div>` : ''}

            <div class="cv-contact-line flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-slate-600 mt-2">
              ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
              ${p.email ? `<span>• <a href="mailto:${p.email}" class="hover:underline">${escapeHtml(p.email)}</a></span>` : ''}
              ${p.phone ? `<span>• ${escapeHtml(p.phone)}</span>` : ''}
              ${p.linkedin ? `<span>• <a href="${p.linkedin}" target="_blank" class="text-blue-700 hover:underline">LinkedIn</a></span>` : ''}
              ${p.github ? `<span>• <a href="${p.github}" target="_blank" class="text-blue-700 hover:underline">GitHub</a></span>` : ''}
              ${p.website || p.portfolio ? `<span>• <a href="${p.website || p.portfolio}" target="_blank" class="text-blue-700 hover:underline">Portfolio</a></span>` : ''}
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>
      </header>

      <!-- Professional Summary / Career Objective -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            ${p.objective && !p.summary ? 'Career Objective' : 'Professional Summary'}
          </h2>
          <p class="text-slate-700 text-xs leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Core Skills Matrix (All 6 Categorized Domains) -->
      ${isSectionEnabled(profile, 'skills') ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Core Competencies & Skills
          </h2>
          ${renderCategorizedSkillsHtml(profile, primaryColor)}
        </section>
      ` : ''}

      <!-- For Fresh Graduates: Highlight Education & Projects First -->
      ${isFreshGraduate && isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education & Academic Credentials
          </h2>
          <div class="space-y-3">
            ${eduList.map(edu => `
              <div>
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">${formatEducationDegree(edu)}</span>
                  <span class="text-xs text-slate-600">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
                <div class="text-xs text-slate-600">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''} ${edu.gpa ? `• GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
                ${edu.honors ? `<div class="text-[11px] text-slate-500 italic">${escapeHtml(edu.honors)}</div>` : ''}
                ${edu.coursework ? `<div class="text-[11px] text-slate-600 mt-0.5"><strong>Key Coursework:</strong> ${escapeHtml(edu.coursework)}</div>` : ''}
                ${edu.thesis ? `<div class="text-[11px] text-slate-600 mt-0.5"><strong>Thesis / Project:</strong> ${escapeHtml(edu.thesis)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Professional Experience (Omitted entirely if fresh graduate or empty) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Professional Experience
          </h2>
          <div class="space-y-4">
            ${expList.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <div>
                    <span class="font-bold text-slate-900 text-sm">${escapeHtml(exp.title)}</span>
                    <span class="text-slate-600 font-semibold text-xs"> | ${escapeHtml(exp.company)}</span>
                    ${exp.employmentType ? `<span class="text-[11px] text-slate-500 font-normal"> (${escapeHtml(exp.employmentType)})</span>` : ''}
                  </div>
                  <span class="text-xs font-semibold text-slate-600 shrink-0">
                    ${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}
                  </span>
                </div>
                ${exp.location ? `<div class="text-[11px] text-slate-500 mb-1.5 italic">${escapeHtml(exp.location)}</div>` : ''}

                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}

                ${Array.isArray(exp.technologies) && exp.technologies.length > 0 ? `
                  <div class="mt-1.5 text-[11px] text-slate-600">
                    <span class="font-semibold text-slate-700">Environment:</span> ${exp.technologies.map(t => escapeHtml(t)).join(', ')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Internships (if present) -->
      ${isSectionEnabled(profile, 'internships') && profile.internships?.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Internship Experience
          </h2>
          <div class="space-y-3">
            ${profile.internships.map(intern => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">${escapeHtml(intern.title)} — ${escapeHtml(intern.company)}</span>
                  <span class="text-xs text-slate-500">${formatDateRange(intern.startDate, intern.endDate, intern.current, dateFormat)}</span>
                </div>
                ${Array.isArray(intern.highlights) ? `
                  <ul class="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-700 text-xs">
                    ${intern.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Key Projects -->
      ${isSectionEnabled(profile, 'projects') && profile.projects?.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Key Projects & Deliverables
          </h2>
          <div class="space-y-3.5">
            ${profile.projects.map(proj => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">
                    ${escapeHtml(proj.title)}
                    ${proj.projectType ? `<span class="text-[11px] font-semibold text-slate-500"> [${escapeHtml(proj.projectType)}]</span>` : ''}
                    ${proj.role ? `<span class="font-normal text-slate-600"> (${escapeHtml(proj.role)})</span>` : ''}
                  </span>
                </div>
                ${proj.description ? `<p class="text-xs text-slate-700 mt-1">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<div class="text-[11px] text-slate-600 mt-0.5"><strong>Outcome:</strong> ${escapeHtml(proj.outcomes)}</div>` : ''}
                ${Array.isArray(proj.technologies) && proj.technologies.length > 0 ? `
                  <div class="text-[11px] text-slate-500 mt-0.5">
                    <strong>Tech:</strong> ${proj.technologies.map(t => escapeHtml(t)).join(', ')}
                  </div>
                ` : ''}
                <div class="flex gap-3 text-[11px] text-blue-700 mt-0.5">
                  ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="hover:underline">Live Demo</a>` : ''}
                  ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" class="hover:underline">GitHub</a>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education for Experienced Candidates (Displayed after experience) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education
          </h2>
          <div class="space-y-3">
            ${eduList.map(edu => `
              <div>
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">${formatEducationDegree(edu)}</span>
                  <span class="text-xs text-slate-600">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
                <div class="text-xs text-slate-600">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''} ${edu.gpa ? `• GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
                ${edu.honors ? `<div class="text-[11px] text-slate-500 italic">${escapeHtml(edu.honors)}</div>` : ''}
                ${edu.coursework ? `<div class="text-[11px] text-slate-600 mt-0.5"><strong>Coursework:</strong> ${escapeHtml(edu.coursework)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Certifications -->
      ${isSectionEnabled(profile, 'certifications') && profile.certifications?.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Certifications & Training
          </h2>
          <div class="space-y-1.5 text-xs">
            ${profile.certifications.map(c => `
              <div>
                <strong>${escapeHtml(c.title)}</strong> — ${escapeHtml(c.issuer || '')}${c.issueDate ? ` (${escapeHtml(c.issueDate)})` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Languages -->
      ${isSectionEnabled(profile, 'languages') && profile.languages?.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Languages
          </h2>
          <div class="text-xs text-slate-700">
            ${profile.languages.map(l => `<span><strong>${escapeHtml(l.name)}</strong> (${escapeHtml(l.proficiency || l.cefr || 'Proficient')})</span>`).join('  •  ')}
          </div>
        </section>
      ` : ''}

      <!-- References (Handles upon-request or listed references) -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}

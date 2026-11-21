/**
 * Format 7: Academic CV (Curriculum Vitae)
 * Formal scholarly dossier format tailored for university faculty, postdocs, research scientists,
 * and graduate fellowships. Comprehensive, unconstrained multi-page academic structure.
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

export function renderAcademic(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#7c2d12'; // Default academic burgundy/brown
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const academic = profile.academic || {};
  const photoHtml = renderPhotoHtml(profile, 'w-24 h-28', 'rounded shadow-xs');
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  return `
    <div class="cv-format cv-academic max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm font-serif">
      <!-- Formal Academic Header -->
      <header class="pb-5 mb-6 border-b-2" style="border-color: ${primaryColor}">
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1 text-center md:text-left">
            <h1 class="cv-name text-3xl font-bold tracking-tight text-slate-900 mb-1">
              ${escapeHtml(p.fullName || 'Candidate Name')}
            </h1>
            ${p.headline ? `<div class="text-base italic text-slate-700">${escapeHtml(p.headline)}</div>` : ''}

            <div class="cv-contact-line text-xs text-slate-600 mt-3 space-y-0.5">
              ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
              <div>
                ${p.email ? `Email: <a href="mailto:${p.email}" class="underline text-slate-800">${escapeHtml(p.email)}</a>` : ''}
                ${p.phone ? ` • Tel: ${escapeHtml(p.phone)}` : ''}
              </div>
              <div class="space-x-3 text-slate-700">
                ${p.website ? `<a href="${p.website}" target="_blank" class="underline">Academic Homepage</a>` : ''}
                ${p.portfolio ? `• <a href="${p.portfolio}" target="_blank" class="underline">Google Scholar</a>` : ''}
                ${p.github ? `• <a href="${p.github}" target="_blank" class="underline">Code Repository</a>` : ''}
              </div>
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>
      </header>

      <!-- Research Specializations / Interests -->
      ${(academic.researchInterests?.length > 0) ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Research Specializations & Scholarly Interests
          </h2>
          <div class="flex flex-wrap gap-2 text-xs text-slate-800">
            ${academic.researchInterests.map(interest => `
              <span class="border border-slate-300 rounded px-2.5 py-0.5 bg-slate-50 font-sans">${escapeHtml(interest)}</span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Academic Education (With Dissertation & Advisor) -->
      ${isSectionEnabled(profile, 'education') && profile.education?.length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Academic Education
          </h2>
          <div class="space-y-4 text-xs">
            ${profile.education.map(edu => `
              <div class="break-inside-avoid">
                <div class="flex justify-between items-baseline font-bold text-slate-900 text-sm">
                  <span>${formatEducationDegree(edu)}</span>
                  <span class="font-normal text-xs text-slate-600">${formatDateRange(edu.startDate, edu.endDate, edu.current, 'YYYY')}</span>
                </div>
                <div class="text-slate-700 italic">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                ${edu.honors ? `<div class="text-slate-600 font-sans text-[11px] mt-0.5">Honors: ${escapeHtml(edu.honors)}</div>` : ''}
                ${edu.coursework ? `<div class="text-slate-600 font-sans text-[11px] mt-0.5"><strong>Coursework:</strong> ${escapeHtml(edu.coursework)}</div>` : ''}
                ${edu.thesis ? `<div class="text-slate-800 italic mt-1 ml-3 border-l-2 pl-2 border-slate-300">${escapeHtml(edu.thesis)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Academic & Research Appointments (Omitted if fresh graduate or empty) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && profile.experience?.length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Academic Appointments & Research Positions
          </h2>
          <div class="space-y-4 text-xs">
            ${profile.experience.map(exp => `
              <div class="break-inside-avoid">
                <div class="flex justify-between items-baseline font-bold text-slate-900 text-sm">
                  <span>${escapeHtml(exp.title)}</span>
                  <span class="font-normal text-xs text-slate-600">${formatDateRange(exp.startDate, exp.endDate, exp.current, 'YYYY')}</span>
                </div>
                <div class="text-slate-700 italic mb-1.5">${escapeHtml(exp.company)}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-5 space-y-1 text-slate-700">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Peer-Reviewed Publications -->
      ${(profile.publications?.length > 0) ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Publications & Preprints
          </h2>
          <div class="space-y-3 text-xs">
            ${profile.publications.map((pub, idx) => `
              <div class="break-inside-avoid">
                <span class="font-bold">[${idx + 1}]</span>
                ${pub.authors ? `<span class="italic">${escapeHtml(pub.authors)}.</span>` : ''}
                <span class="font-bold">"${escapeHtml(pub.title)}."</span>
                <span class="text-slate-700">${escapeHtml(pub.journal || '')}</span>
                <span class="text-slate-500">(${escapeHtml(pub.year || '')})</span>
                ${pub.doi ? `<span class="text-blue-700 underline font-sans ml-1 text-[11px]"><a href="https://doi.org/${pub.doi}" target="_blank">DOI: ${escapeHtml(pub.doi)}</a></span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Research Projects & Software Artifacts -->
      ${isSectionEnabled(profile, 'projects') && profile.projects?.length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Research Projects & Deliverables
          </h2>
          <div class="space-y-3 text-xs">
            ${profile.projects.map(proj => `
              <div class="break-inside-avoid">
                <div class="font-bold text-slate-900">${escapeHtml(proj.title)} ${proj.role ? `<span class="font-normal italic">(${escapeHtml(proj.role)})</span>` : ''}</div>
                ${proj.description ? `<p class="text-slate-700 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.githubUrl ? `<div class="text-[11px] font-sans text-blue-700 mt-0.5"><a href="${proj.githubUrl}" target="_blank" class="underline">Repository: ${getCleanUrl(proj.githubUrl)}</a></div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Methodological & Technical Competencies -->
      ${isSectionEnabled(profile, 'skills') ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Methodological & Technical Competencies
          </h2>
          <div class="font-sans">
            ${renderCategorizedSkillsHtml(profile, primaryColor)}
          </div>
        </section>
      ` : ''}

      <!-- Awards & Honors -->
      ${(profile.achievements?.length > 0) ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Honors, Fellowships & Awards
          </h2>
          <div class="space-y-1.5 text-xs">
            ${profile.achievements.map(ach => `
              <div class="flex justify-between">
                <span><strong>${escapeHtml(ach.title)}</strong>, ${escapeHtml(ach.issuer || '')}</span>
                <span class="text-slate-500">${escapeHtml(ach.year || '')}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Academic References -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}

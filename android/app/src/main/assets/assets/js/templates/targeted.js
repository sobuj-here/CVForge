/**
 * Format 6: Targeted CV
 * Laser-focused on a single target position and employer.
 * Displays explicit Target Position Badges, Value Proposition, and a direct
 * Requirements-to-Qualifications Alignment Matrix.
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

export function renderTargeted(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const targetRole = profile.targetRole || p.headline || 'Targeted Position';
  const targetCompany = profile.targetCompany || '';
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  // Collect candidate skills for alignment
  const allCandidateSkills = getSkillsList(profile).map(s => s.name);

  const topSkillsSummary = allCandidateSkills.slice(0, 5).join(', ') || 'Demonstrated technical & professional competencies';

  // Highlight or deliverable outcome
  const executionSummary = profile.experience?.[0]?.highlights?.[0]
    ? profile.experience[0].highlights[0]
    : profile.projects?.[0]?.description
    ? profile.projects[0].description
    : 'Demonstrated history of driving operational standards and delivering project goals';

  // Collaboration / communication summary
  const collaborationSummary = allCandidateSkills.length > 0
    ? `${allCandidateSkills[0]} — Core expertise and reliable cross-functional teamwork`
    : 'Demonstrated effectiveness in organizational workflow coordination and team communication';

  const photoHtml = renderPhotoHtml(profile, 'w-20 h-20', 'rounded-xl shadow-xs');

  return `
    <div class="cv-format cv-targeted max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm">
      <!-- Target Alignment Header Banner -->
      <div class="mb-4 p-3 rounded-t-lg text-white flex items-center justify-between" style="background-color: ${primaryColor}">
        <div class="text-xs font-bold uppercase tracking-wider">
          TARGETED APPLICATION DOSSIER
        </div>
        <div class="text-xs bg-white/20 px-2.5 py-0.5 rounded font-medium">
          Position: <strong class="text-white">${escapeHtml(targetRole)}</strong>
          ${targetCompany ? ` @ <span class="underline">${escapeHtml(targetCompany)}</span>` : ''}
        </div>
      </div>

      <!-- Candidate Contact Header -->
      <header class="border-b pb-4 mb-5 border-slate-300">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex-1">
            <h1 class="cv-name text-2xl font-extrabold text-slate-900 tracking-tight">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
            <p class="text-xs font-semibold text-slate-600 mt-0.5">Candidate for: <span style="color: ${primaryColor}">${escapeHtml(targetRole)}</span></p>
            <div class="cv-contact-line text-xs text-slate-600 mt-2 flex flex-wrap gap-x-3">
              ${p.email ? `<span>${escapeHtml(p.email)}</span>` : ''}
              ${p.phone ? `<span>• ${escapeHtml(p.phone)}</span>` : ''}
              ${p.location ? `<span>• ${escapeHtml(p.location)}</span>` : ''}
              ${p.linkedin ? `<span>• <a href="${p.linkedin}" target="_blank" class="text-blue-700 hover:underline">LinkedIn</a></span>` : ''}
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>
      </header>

      <!-- Targeted Executive Pitch -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-5 bg-blue-50/50 border-l-4 p-3.5 rounded-r break-inside-avoid" style="border-color: ${primaryColor}">
          <h2 class="cv-section-title text-xs font-extrabold uppercase tracking-wider mb-1" style="color: ${primaryColor}">
            Targeted Value Proposition for ${escapeHtml(targetCompany || targetRole)}
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Core Targeted Alignment Matrix (Requirement -> Candidate Match) -->
      <section class="mb-5 break-inside-avoid">
        <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
          Core Competencies & Direct Job Alignment Matrix
        </h2>
        
        <table class="w-full text-xs border border-slate-200 rounded overflow-hidden">
          <thead class="bg-slate-100 text-slate-700 text-left font-bold border-b border-slate-200">
            <tr>
              <th class="p-2 w-1/3">Target Requirement Domain</th>
              <th class="p-2 w-2/3">Candidate Verified Competency & Evidence</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr>
              <td class="p-2 font-semibold text-slate-900 bg-slate-50/50">Core Skills & Tools</td>
              <td class="p-2 text-slate-700">${escapeHtml(topSkillsSummary)}</td>
            </tr>
            <tr>
              <td class="p-2 font-semibold text-slate-900 bg-slate-50/50">Execution & Deliverables</td>
              <td class="p-2 text-slate-700">${escapeHtml(executionSummary)}</td>
            </tr>
            <tr>
              <td class="p-2 font-semibold text-slate-900 bg-slate-50/50">Communication & Teamwork</td>
              <td class="p-2 text-slate-700">${escapeHtml(collaborationSummary)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Curated Relevant Experience (Omitted if fresh graduate or empty) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && profile.experience?.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Directly Relevant Professional Experience
          </h2>
          <div class="space-y-4">
            ${profile.experience.map(exp => `
              <div class="break-inside-avoid">
                <div class="flex justify-between items-baseline">
                  <div>
                    <span class="font-bold text-slate-900 text-sm">${escapeHtml(exp.title)}</span>
                    <span class="text-slate-600 font-semibold text-xs"> — ${escapeHtml(exp.company)}</span>
                  </div>
                  <span class="text-xs text-slate-500 font-semibold">${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}</span>
                </div>
                ${exp.location ? `<div class="text-[11px] text-slate-500 mb-1 italic">${escapeHtml(exp.location)}</div>` : ''}

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

      <!-- Relevant Projects -->
      ${isSectionEnabled(profile, 'projects') && profile.projects?.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Targeted Deliverables & Implementations
          </h2>
          <div class="space-y-3">
            ${profile.projects.map(proj => `
              <div class="border-l-2 pl-3 border-slate-300 break-inside-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">${escapeHtml(proj.title)}</span>
                  ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="text-xs text-blue-700 hover:underline">Link</a>` : ''}
                </div>
                ${proj.description ? `<p class="text-xs text-slate-700 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<p class="text-xs text-slate-600 italic mt-0.5">Value: ${escapeHtml(proj.outcomes)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Skills Matrix -->
      ${isSectionEnabled(profile, 'skills') ? `
        <section class="mb-5 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Skills & Competencies
          </h2>
          ${renderCategorizedSkillsHtml(profile, primaryColor)}
        </section>
      ` : ''}

      <!-- Education -->
      ${isSectionEnabled(profile, 'education') && profile.education?.length > 0 ? `
        <section class="mb-5 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education & Academic Credentials
          </h2>
          <div class="space-y-1.5 text-xs">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <div>
                  <span class="font-bold text-slate-900">${formatEducationDegree(edu)}</span>
                  <span class="text-slate-600"> — ${escapeHtml(edu.institution)}</span>
                </div>
                <span class="text-slate-500">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
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

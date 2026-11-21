/**
 * Format 3: Functional CV
 * Prioritizes functional competency clusters, skill domains, and aggregated proof points
 * over chronological work history. Followed by a concise, streamlined work history list.
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

export function renderFunctional(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  // Extract functional areas or synthesize from experience/skills/projects dynamically
  let functionalAreas = profile.functionalAreas || [];
  if (functionalAreas.length === 0) {
    const allHighlights = [];
    (profile.experience || []).forEach(e => {
      if (Array.isArray(e.highlights)) allHighlights.push(...e.highlights);
    });

    if (allHighlights.length > 0) {
      functionalAreas = [
        {
          id: 'fa_synth_1',
          title: p.headline ? `${p.headline} — Core Capabilities` : 'Operational Execution & Professional Delivery',
          summary: 'Driving key organizational objectives, optimizing workflow efficiencies, and ensuring high-standard execution.',
          achievements: allHighlights.slice(0, 3)
        },
        {
          id: 'fa_synth_2',
          title: 'Quality Standards & Collaborative Performance',
          summary: 'Standardizing best practices, cross-functional communication, and consistent on-schedule delivery.',
          achievements: allHighlights.slice(3, 6)
        }
      ];
    } else if ((profile.projects || []).length > 0) {
      functionalAreas = [
        {
          id: 'fa_synth_proj_1',
          title: 'Project Planning & Practical Implementation',
          summary: 'Conducting thorough research, executing planned deliverables, and producing documented outcomes.',
          achievements: profile.projects.map(pr => `${pr.title}: ${pr.description || pr.outcomes || 'Successfully delivered key milestones.'}`).slice(0, 3)
        }
      ];
    }
  }

  const photoHtml = renderPhotoHtml(profile, 'w-24 h-24', 'rounded-2xl shadow-sm border border-white/30');

  return `
    <div class="cv-format cv-functional max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm">
      <!-- Header with Competency Banner -->
      <header class="p-6 rounded-lg mb-6 text-white" style="background-color: ${primaryColor}">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex-1">
            <h1 class="cv-name text-3xl font-extrabold tracking-tight">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
            ${p.headline ? `<div class="text-sm font-medium text-slate-200 mt-1">${escapeHtml(p.headline)}</div>` : ''}
            <div class="cv-contact-line text-xs space-y-1 text-slate-200 mt-2">
              ${p.email ? `<div>${escapeHtml(p.email)}</div>` : ''}
              ${p.phone ? `<div>${escapeHtml(p.phone)}</div>` : ''}
              ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
              ${p.linkedin ? `<div><a href="${p.linkedin}" target="_blank" class="underline text-slate-100">${getCleanUrl(p.linkedin)}</a></div>` : ''}
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>
      </header>

      <!-- Value Proposition / Summary -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-6 bg-slate-50 border border-slate-200 rounded p-4 break-inside-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider mb-2" style="color: ${primaryColor}">
            ${p.objective && !p.summary ? 'Career Objective' : 'Core Value Proposition & Expertise'}
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Dominant Section: Areas of Core Functional Competence -->
      ${functionalAreas.length > 0 ? `
        <section class="mb-6">
          <div class="flex items-center gap-2 mb-4 pb-1 border-b-2" style="border-color: ${primaryColor}">
            <h2 class="cv-section-title text-sm font-extrabold uppercase tracking-wider" style="color: ${primaryColor}">
              Key Areas of Functional Competency & Proven Impact
            </h2>
          </div>

          <div class="space-y-4">
            ${functionalAreas.map(fa => `
              <div class="border border-slate-200 rounded-lg p-4 bg-white shadow-xs break-inside-avoid">
                <h3 class="font-bold text-slate-900 text-sm mb-1" style="color: ${primaryColor}">
                  • ${escapeHtml(fa.title)}
                </h3>
                ${fa.summary ? `<p class="text-xs text-slate-600 mb-2 italic">${escapeHtml(fa.summary)}</p>` : ''}
                
                ${Array.isArray(fa.achievements) && fa.achievements.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                    ${fa.achievements.map(ach => `<li>${escapeHtml(ach)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Key Projects Demonstrating Competency -->
      ${isSectionEnabled(profile, 'projects') && profile.projects?.length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Project Evidence & Deliverables
          </h2>
          <div class="space-y-3">
            ${profile.projects.map(proj => `
              <div class="border-l-2 pl-3 border-slate-300 break-inside-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">${escapeHtml(proj.title)} ${proj.role ? `(${escapeHtml(proj.role)})` : ''}</span>
                  ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="text-xs text-blue-700 hover:underline">Demo</a>` : ''}
                </div>
                ${proj.description ? `<p class="text-xs text-slate-700 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<p class="text-xs text-slate-600 italic mt-0.5">${escapeHtml(proj.outcomes)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Core Skills -->
      ${isSectionEnabled(profile, 'skills') ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Technical & Professional Skills
          </h2>
          ${renderCategorizedSkillsHtml(profile, primaryColor)}
        </section>
      ` : ''}

      <!-- Streamlined Employment History (Omitted if fresh graduate or empty) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && profile.experience?.length > 0 ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Work History
          </h2>
          <div class="space-y-1.5 text-xs text-slate-700">
            ${profile.experience.map(exp => `
              <div class="flex justify-between items-baseline">
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

      <!-- Education -->
      ${isSectionEnabled(profile, 'education') && profile.education?.length > 0 ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education
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

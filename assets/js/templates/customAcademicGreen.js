/**
 * Custom Template 01: Academic Green Two-Column CV
 * Faithfully inspired by the authentic layout of 'CV Mathematics.pdf'.
 * Features:
 * - Two-column asymmetric layout with green horizontal accent divider rules (#7aa350)
 * - Left column: Circular profile photo, bold candidate headline, contact links,
 *   bulleted skills list, languages, and secondary competencies
 * - Right column: Career Objective, Education, Academic Projects with bulleted methodology,
 *   Research Interests, Achievements, and References
 * - 100% dynamic bindings to candidate profile with clean empty defaults and zero fake prefill.
 */

import {
  escapeHtml,
  formatDateRange,
  getCleanUrl,
  renderPhotoHtml,
  isSectionEnabled,
  formatEducationDegree,
  isFreshGraduateCandidate,
  getSkillsList
} from './templateUtils.js';

export function renderCustomAcademicGreen(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#7aa350';
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  const skillsList = getSkillsList(profile);
  const primarySkills = skillsList.slice(0, 8);
  const secondarySkills = skillsList.slice(8);

  const photoHtml = renderPhotoHtml(profile, 'w-28 h-28', 'rounded-full border-2 border-[#7aa350] shadow-sm');

  const refs = (profile.references || []).filter(r => r && (r.name || r.title || r.company || r.organization || r.email || r.phone));

  return `
    <div class="cv-format cv-custom-academic-green max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-6 sm:p-8 shadow-xs">
      
      <!-- Two Column Layout: Left (36%), Right (64%) -->
      <div class="grid grid-cols-12 gap-8 items-start">
        
        <!-- Left Sidebar Column (Cols 1-4 / 36%) -->
        <aside class="col-span-12 md:col-span-4 space-y-6">
          
          <!-- Photo & Candidate Identity -->
          <div class="space-y-3">
            ${photoHtml ? `
              <div class="flex items-center justify-center md:justify-start">
                ${photoHtml}
              </div>
            ` : `
              <div class="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-2xl border-2" style="border-color: ${primaryColor}">
                ${(p.fullName || 'CV').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            `}

            <div>
              <h1 class="cv-name text-2xl font-black tracking-tight text-slate-950 uppercase" style="font-family: Georgia, 'Times New Roman', serif;">
                ${escapeHtml(p.fullName || 'Candidate Name')}
              </h1>
              ${p.headline ? `<p class="text-xs font-semibold text-slate-600 mt-0.5">${escapeHtml(p.headline)}</p>` : ''}
            </div>

            <!-- Contact Information Block -->
            <div class="cv-contact-line space-y-1 text-slate-700 text-xs pt-1">
              ${p.phone ? `<div><a href="tel:${p.phone}" class="hover:underline">${escapeHtml(p.phone)}</a></div>` : ''}
              ${p.email ? `<div><a href="mailto:${p.email}" class="text-blue-700 hover:underline break-all">${escapeHtml(p.email)}</a></div>` : ''}
              ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
              ${p.github ? `<div><a href="${p.github}" target="_blank" class="text-blue-700 hover:underline break-all">${getCleanUrl(p.github)}</a></div>` : ''}
              ${p.linkedin ? `<div><a href="${p.linkedin}" target="_blank" class="text-blue-700 hover:underline break-all">${getCleanUrl(p.linkedin)}</a></div>` : ''}
              ${p.website ? `<div><a href="${p.website}" target="_blank" class="text-blue-700 hover:underline break-all">${getCleanUrl(p.website)}</a></div>` : ''}
            </div>
          </div>

          <!-- Skills Section (Bullet List) -->
          ${isSectionEnabled(profile, 'skills') && primarySkills.length > 0 ? `
            <div class="space-y-2">
              <h3 class="text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Technical Skills
              </h3>
              <ul class="space-y-1 list-disc list-inside text-xs text-slate-800">
                ${primarySkills.map(s => `
                  <li>
                    <span class="font-medium">${escapeHtml(s.name)}</span>
                    ${s.level ? `<span class="text-[10px] text-slate-500 font-normal">(${escapeHtml(s.level)})</span>` : ''}
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- Languages Section (Bullet List) -->
          ${isSectionEnabled(profile, 'languages') && (profile.languages || []).length > 0 ? `
            <div class="space-y-2">
              <h3 class="text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Languages
              </h3>
              <ul class="space-y-1 list-disc list-inside text-xs text-slate-800">
                ${profile.languages.map(l => `
                  <li>
                    <span class="font-medium">${escapeHtml(l.name)}</span>
                    <span class="text-slate-500">(${escapeHtml(l.proficiency || l.cefr || 'Competent')})</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- Secondary / Soft Skills (Bullet List) -->
          ${isSectionEnabled(profile, 'skills') && secondarySkills.length > 0 ? `
            <div class="space-y-2">
              <h3 class="text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Additional Competencies
              </h3>
              <ul class="space-y-1 list-disc list-inside text-xs text-slate-800">
                ${secondarySkills.map(s => `
                  <li>
                    <span class="font-medium">${escapeHtml(s.name)}</span>
                    ${s.level ? `<span class="text-[10px] text-slate-500 font-normal">(${escapeHtml(s.level)})</span>` : ''}
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

        </aside>

        <!-- Right Main Column (Cols 5-12 / 64%) -->
        <main class="col-span-12 md:col-span-8 space-y-5">
          
          <!-- Career Objective / Professional Summary -->
          ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
            <section class="space-y-1.5 page-break-avoid">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                ${p.objective && !p.summary ? 'Career Objective' : 'Career Objective & Profile'}
              </h2>
              <p class="text-xs text-slate-800 leading-relaxed text-justify">
                ${escapeHtml(p.summary || p.objective)}
              </p>
            </section>
          ` : ''}

          <!-- Education -->
          ${isSectionEnabled(profile, 'education') && (profile.education || []).length > 0 ? `
            <section class="space-y-2 page-break-avoid">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Education
              </h2>
              <div class="space-y-2.5">
                ${profile.education.map(edu => `
                  <div>
                    <div class="font-bold text-xs text-slate-900">
                      ${escapeHtml(formatEducationDegree(edu))}
                    </div>
                    <div class="text-slate-700 text-xs">
                      ${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}
                    </div>
                    <div class="text-slate-500 text-[11px]">
                      ${formatDateRange(edu.startDate, edu.endDate, dateFormat, false, 'Expected Graduation')}
                      ${edu.gpa ? ` • Result: ${escapeHtml(edu.gpa)}` : ''}
                    </div>
                    ${edu.coursework ? `<div class="text-[11px] text-slate-600 mt-0.5">Relevant Coursework: ${escapeHtml(edu.coursework)}</div>` : ''}
                    ${edu.thesis ? `<div class="text-[11px] text-slate-600 mt-0.5 italic">Thesis/Project: ${escapeHtml(edu.thesis)}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Work Experience (Omitted cleanly if empty or fresh graduate) -->
          ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && (profile.experience || []).length > 0 ? `
            <section class="space-y-2">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Work Experience
              </h2>
              <div class="space-y-3">
                ${profile.experience.map(exp => `
                  <div class="space-y-1 page-break-avoid">
                    <div class="flex justify-between items-baseline">
                      <span class="font-bold text-xs text-slate-900">${escapeHtml(exp.title || '')} — ${escapeHtml(exp.company || '')}</span>
                      <span class="text-[11px] text-slate-500">${formatDateRange(exp.startDate, exp.endDate, dateFormat, exp.current)}</span>
                    </div>
                    ${exp.highlights && exp.highlights.length > 0 ? `
                      <ul class="list-disc list-inside space-y-0.5 text-xs text-slate-700">
                        ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                      </ul>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Academic Projects / Key Projects -->
          ${isSectionEnabled(profile, 'projects') && (profile.projects || []).length > 0 ? `
            <section class="space-y-2">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Academic & Key Projects
              </h2>
              <div class="space-y-2.5">
                ${profile.projects.map(proj => `
                  <div class="space-y-1 page-break-avoid">
                    <div class="font-bold text-xs text-slate-900">
                      ${escapeHtml(proj.title || 'Project Title')}
                      ${proj.projectType ? `<span class="text-slate-500 font-normal"> (${escapeHtml(proj.projectType)})</span>` : ''}
                    </div>
                    ${proj.description ? `
                      <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(proj.description)}</p>
                    ` : ''}
                    ${proj.outcomes ? `
                      <ul class="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                        <li>${escapeHtml(proj.outcomes)}</li>
                      </ul>
                    ` : ''}
                    ${proj.technologies && proj.technologies.length > 0 ? `
                      <div class="text-[11px] text-slate-600">
                        <strong>Technologies:</strong> ${proj.technologies.map(t => escapeHtml(t)).join(', ')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Research Interests (if academic fields provided) -->
          ${profile.academic?.researchInterests && profile.academic.researchInterests.length > 0 ? `
            <section class="space-y-1.5 page-break-avoid">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Research Interests
              </h2>
              <ul class="list-disc list-inside space-y-0.5 text-xs text-slate-700">
                ${profile.academic.researchInterests.map(ri => `<li>${escapeHtml(ri)}</li>`).join('')}
              </ul>
            </section>
          ` : ''}

          <!-- Achievements & Seminars -->
          ${isSectionEnabled(profile, 'achievements') && (profile.achievements || []).length > 0 ? `
            <section class="space-y-1.5 page-break-avoid">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Achievements & Activities
              </h2>
              <ul class="list-disc list-inside space-y-0.5 text-xs text-slate-700">
                ${profile.achievements.map(ach => `
                  <li>
                    <span class="font-semibold">${escapeHtml(ach.title || '')}</span>
                    ${ach.description ? ` — ${escapeHtml(ach.description)}` : ''}
                  </li>
                `).join('')}
              </ul>
            </section>
          ` : ''}

          <!-- Certifications -->
          ${isSectionEnabled(profile, 'certifications') && (profile.certifications || []).length > 0 ? `
            <section class="space-y-1.5 page-break-avoid">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Certifications & Training
              </h2>
              <ul class="list-disc list-inside space-y-0.5 text-xs text-slate-700">
                ${profile.certifications.map(c => `
                  <li>
                    <span class="font-semibold">${escapeHtml(c.title || '')}</span>
                    ${c.issuer ? ` — ${escapeHtml(c.issuer)}` : ''}
                    ${c.issueDate ? ` (${escapeHtml(c.issueDate)})` : ''}
                  </li>
                `).join('')}
              </ul>
            </section>
          ` : ''}

          <!-- References Section (Only displayed when actual references are entered) -->
          ${isSectionEnabled(profile, 'references') && refs.length > 0 ? `
            <section class="space-y-2 page-break-avoid">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                References
              </h2>
              <div class="space-y-2">
                ${refs.map(r => `
                  <div class="text-xs">
                    <div class="font-bold text-slate-900">${escapeHtml(r.name)}</div>
                    <div class="text-slate-700">${escapeHtml(r.title || '')}</div>
                    ${(r.organization || r.company) ? `<div class="text-slate-600">${escapeHtml(r.organization || r.company)}</div>` : ''}
                    ${r.email ? `<div><a href="mailto:${r.email}" class="text-blue-700 hover:underline">${escapeHtml(r.email)}</a></div>` : ''}
                    ${r.phone ? `<div class="text-slate-600">${escapeHtml(r.phone)}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

        </main>

      </div>

    </div>
  `;
}

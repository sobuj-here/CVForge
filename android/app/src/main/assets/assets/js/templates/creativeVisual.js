/**
 * Format 10: Creative / Visual CV
 * High-aesthetic visual layout designed for UI/UX designers, creative leads, art directors,
 * and modern tech creators. Features an accent card/sidebar with visual skill progress meters,
 * project showcase badges, and sleek contemporary typography.
 * Multi-page safe: avoids awkward sidebar overflow or blank blocks on page breaks.
 */

import {
  escapeHtml,
  formatDateRange,
  getCleanUrl,
  isSectionEnabled,
  formatEducationDegree,
  isFreshGraduateCandidate,
  renderReferencesHtml,
  getSkillsList
} from './templateUtils.js';

export function renderCreativeVisual(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#7e22ce';
  const accentColor = settings.accentColor || '#a855f7';
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const photoShape = settings.photoShape || 'circle';
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  const hasPhoto = settings.showPhoto && p.photoUrl;

  // Flatten skills for visual progress meters
  const sidebarSkills = getSkillsList(profile).slice(0, 7);

  return `
    <div class="cv-format cv-creative-visual max-w-[850px] mx-auto bg-white rounded-xl shadow-xs text-slate-800 leading-relaxed text-sm flex flex-col md:flex-row gap-6 p-2">
      
      <!-- Left Accent Card (35% width) -->
      <aside class="w-full md:w-[35%] p-5 text-white rounded-2xl self-start shrink-0 space-y-5 page-break-avoid" style="background-color: ${primaryColor}">
        
        <!-- Profile Photo / Identity -->
        <div class="text-center">
          ${hasPhoto ? `
            <img src="${p.photoUrl}" alt="${escapeHtml(p.fullName)}" class="w-24 h-24 mx-auto object-cover border-4 border-white/30 shadow-md mb-3 ${photoShape === 'circle' ? 'rounded-full' : 'rounded-2xl'}" style="aspect-ratio: 1/1;" />
          ` : `
            <div class="w-16 h-16 rounded-full mx-auto bg-white/20 flex items-center justify-center text-white text-xl font-black border-2 border-white/40 shadow-inner mb-3">
              ${(p.fullName || 'CV').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
          `}
          <h1 class="cv-name text-2xl font-black tracking-tight text-white">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
          ${p.headline ? `<p class="text-xs font-semibold text-white/90 mt-1 uppercase tracking-wider">${escapeHtml(p.headline)}</p>` : ''}
        </div>

        <!-- Contact Details -->
        <div class="cv-contact-line space-y-2 text-xs border-t border-white/20 pt-3">
          <h3 class="text-[10px] uppercase tracking-widest font-black text-white/70">Contact Info</h3>
          ${p.email ? `<div class="break-all"><span class="text-white/60 block text-[9px] uppercase font-bold">Email</span> <a href="mailto:${p.email}" class="hover:underline font-medium">${escapeHtml(p.email)}</a></div>` : ''}
          ${p.phone ? `<div><span class="text-white/60 block text-[9px] uppercase font-bold">Phone</span> <span class="font-medium">${escapeHtml(p.phone)}</span></div>` : ''}
          ${p.location ? `<div><span class="text-white/60 block text-[9px] uppercase font-bold">Location</span> <span class="font-medium">${escapeHtml(p.location)}</span></div>` : ''}
          ${p.website ? `<div class="break-all"><span class="text-white/60 block text-[9px] uppercase font-bold">Portfolio</span> <a href="${p.website}" target="_blank" class="hover:underline font-medium underline">${getCleanUrl(p.website)}</a></div>` : ''}
          ${p.linkedin ? `<div class="break-all"><span class="text-white/60 block text-[9px] uppercase font-bold">LinkedIn</span> <a href="${p.linkedin}" target="_blank" class="hover:underline font-medium">${getCleanUrl(p.linkedin)}</a></div>` : ''}
          ${p.github ? `<div class="break-all"><span class="text-white/60 block text-[9px] uppercase font-bold">GitHub</span> <a href="${p.github}" target="_blank" class="hover:underline font-medium">${getCleanUrl(p.github)}</a></div>` : ''}
        </div>

        <!-- Visual Skills with Progress Bars -->
        ${sidebarSkills.length > 0 ? `
          <div class="space-y-3 border-t border-white/20 pt-3">
            <h3 class="text-[10px] uppercase tracking-widest font-black text-white/70">Skills & Competencies</h3>
            <div class="space-y-2">
              ${sidebarSkills.map(sk => {
                const name = typeof sk === 'string' ? sk : sk.name;
                const level = typeof sk === 'string' ? 'Intermediate' : sk.level;
                const pct = level === 'Expert' || level === 'Proficient' ? 95 : level === 'Advanced' ? 82 : level === 'Intermediate' ? 68 : 50;
                return `
                  <div>
                    <div class="flex justify-between text-xs font-semibold mb-0.5">
                      <span>${escapeHtml(name)}</span>
                      <span class="text-white/75 text-[10px] font-mono">${pct}%</span>
                    </div>
                    <div class="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div class="bg-white h-full rounded-full" style="width: ${pct}%"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Languages -->
        ${profile.languages?.length > 0 ? `
          <div class="space-y-2 border-t border-white/20 pt-3 text-xs">
            <h3 class="text-[10px] uppercase tracking-widest font-black text-white/70">Languages</h3>
            <div class="space-y-1">
              ${profile.languages.map(l => `
                <div class="flex justify-between">
                  <span>${escapeHtml(l.name)}</span>
                  <span class="text-white/80 font-mono text-[10px] font-bold">${escapeHtml(l.proficiency || l.cefr || '')}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </aside>

      <!-- Right Main Content Area (65% width) -->
      <main class="w-full md:w-[65%] space-y-5">
        
        <!-- Summary / Creative Vision -->
        ${p.summary || p.objective ? `
          <section class="page-break-avoid">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
              <h2 class="cv-section-title text-xs font-black uppercase tracking-wider text-slate-900">
                ${p.objective && !p.summary ? 'Career Objective' : 'Professional Profile & Vision'}
              </h2>
            </div>
            <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
          </section>
        ` : ''}

        <!-- For Fresh Grads: Education Comes First -->
        ${isFreshGraduate && profile.education?.length > 0 ? `
          <section class="page-break-avoid">
            <div class="flex items-center gap-2 mb-2 pb-1 border-b border-slate-200">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
              <h2 class="cv-section-title text-xs font-black uppercase tracking-wider text-slate-900">Education & Academic Credentials</h2>
            </div>
            <div class="space-y-2 text-xs">
              ${profile.education.map(edu => `
                <div class="flex justify-between items-baseline page-break-avoid">
                  <div>
                    <span class="font-bold text-slate-900">${formatEducationDegree(edu)}</span>
                    <div class="text-slate-600 text-[11px]">${escapeHtml(edu.institution)}${edu.gpa ? ` • Grade: ${escapeHtml(edu.gpa)}` : ''}</div>
                    ${edu.coursework ? `<div class="text-[11px] text-slate-500 mt-0.5">Coursework: ${escapeHtml(edu.coursework)}</div>` : ''}
                  </div>
                  <span class="text-slate-500 font-medium text-[11px]">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Work Experience Timeline (Omitted if fresh graduate or empty) -->
        ${!isFreshGraduate && profile.experience?.length > 0 ? `
          <section class="page-break-avoid">
            <div class="flex items-center gap-2 mb-3 pb-1 border-b border-slate-200">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
              <h2 class="cv-section-title text-xs font-black uppercase tracking-wider text-slate-900">Work Experience</h2>
            </div>

            <div class="relative border-l-2 ml-1 pl-4 space-y-4" style="border-color: ${accentColor}">
              ${profile.experience.map(exp => `
                <div class="relative page-break-avoid">
                  <!-- Timeline Node -->
                  <div class="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2" style="border-color: ${primaryColor}"></div>
                  
                  <div class="flex justify-between items-baseline">
                    <h3 class="font-bold text-slate-900 text-xs">${escapeHtml(exp.title)}</h3>
                    <span class="text-[11px] font-semibold text-slate-500">${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}</span>
                  </div>
                  <div class="text-xs font-semibold mb-1" style="color: ${primaryColor}">
                    ${escapeHtml(exp.company)}${exp.location ? ` • ${escapeHtml(exp.location)}` : ''}
                    ${exp.employmentType ? `<span class="ml-1 text-[10px] font-normal text-slate-500">(${escapeHtml(exp.employmentType)})</span>` : ''}
                  </div>

                  ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                    <ul class="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
                      ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                    </ul>
                  ` : ''}
                  
                  ${Array.isArray(exp.technologies) && exp.technologies.length > 0 ? `
                    <div class="mt-1 text-[11px] text-slate-500 font-medium">
                      Tools: ${exp.technologies.map(t => escapeHtml(t)).join(', ')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Featured Projects Gallery -->
        ${profile.projects?.length > 0 ? `
          <section class="page-break-avoid">
            <div class="flex items-center gap-2 mb-3 pb-1 border-b border-slate-200">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
              <h2 class="cv-section-title text-xs font-black uppercase tracking-wider text-slate-900">
                ${isFreshGraduate ? 'Applied Projects & Deliverables' : 'Featured Projects & Deliverables'}
              </h2>
            </div>

            <div class="grid grid-cols-1 gap-2.5">
              ${profile.projects.slice(0, 4).map(proj => `
                <div class="border border-slate-200 rounded-lg p-3 bg-slate-50/70 page-break-avoid">
                  <div class="flex justify-between items-baseline">
                    <span class="font-bold text-slate-900 text-xs">${escapeHtml(proj.title)}</span>
                    ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="text-xs font-bold hover:underline" style="color: ${primaryColor}">View ↗</a>` : ''}
                  </div>
                  ${proj.description ? `<p class="text-xs text-slate-700 mt-1">${escapeHtml(proj.description)}</p>` : ''}
                  ${proj.outcomes ? `<p class="text-[11px] text-slate-800 font-semibold mt-1">Impact: ${escapeHtml(proj.outcomes)}</p>` : ''}
                  ${Array.isArray(proj.technologies) ? `
                    <div class="flex flex-wrap gap-1 mt-1.5">
                      ${proj.technologies.map(t => `<span class="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 font-medium">${escapeHtml(t)}</span>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Education (For experienced candidates) -->
        ${!isFreshGraduate && profile.education?.length > 0 ? `
          <section class="page-break-avoid">
            <div class="flex items-center gap-2 mb-2 pb-1 border-b border-slate-200">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
              <h2 class="cv-section-title text-xs font-black uppercase tracking-wider text-slate-900">Education & Training</h2>
            </div>
            <div class="space-y-2 text-xs">
              ${profile.education.map(edu => `
                <div class="flex justify-between items-baseline page-break-avoid">
                  <div>
                    <span class="font-bold text-slate-900">${formatEducationDegree(edu)}</span>
                    <div class="text-slate-600 text-[11px]">${escapeHtml(edu.institution)}${edu.gpa ? ` • Grade: ${escapeHtml(edu.gpa)}` : ''}</div>
                  </div>
                  <span class="text-slate-500 font-medium text-[11px]">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Certifications -->
        ${profile.certifications?.length > 0 ? `
          <section class="page-break-avoid">
            <div class="flex items-center gap-2 mb-2 pb-1 border-b border-slate-200">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
              <h2 class="cv-section-title text-xs font-black uppercase tracking-wider text-slate-900">Certifications</h2>
            </div>
            <div class="space-y-1.5 text-xs">
              ${profile.certifications.map(c => `
                <div class="flex justify-between page-break-avoid">
                  <span><strong>${escapeHtml(c.title)}</strong> — ${escapeHtml(c.issuer)}</span>
                  <span class="text-slate-500 text-[11px]">${escapeHtml(c.issueDate || '')}</span>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- References -->
        ${renderReferencesHtml(profile, primaryColor)}

      </main>

    </div>
  `;
}

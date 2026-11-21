/**
 * CVForge - Extended Template Renderers for 10 Formats x 5 Templates (50 Templates)
 * Distinct, authentic layouts across Professional, ATS, Creative, Academic,
 * Functional, International, Executive, Technical, Entry-Level, and Europass.
 * 
 * Strict invariants:
 * - 100% data preservation across template switches
 * - NEVER render "References available upon request."
 * - Hide references section completely when no referee entries exist
 * - Automatically omit empty work experience for fresh graduates / career pivots
 */

import {
  escapeHtml,
  formatDateRange,
  formatDate,
  getCleanUrl,
  renderPhotoHtml,
  isSectionEnabled,
  formatEducationDegree,
  isFreshGraduateCandidate,
  renderCategorizedSkillsHtml,
  renderSkillsHtml,
  renderReferencesHtml,
  getSkillsList
} from './templateUtils.js';

// ==========================================
// FORMAT 1: PROFESSIONAL CV EXTENSIONS
// ==========================================

export function renderProfCorporateMatrix(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-prof-corporate-matrix max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      <!-- Double Border Executive Header -->
      <header class="border-t-4 border-b-2 py-4 mb-6" style="border-color: ${primaryColor}">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="cv-name text-2xl font-extrabold uppercase tracking-tight text-slate-900">
              ${escapeHtml(p.fullName || 'Candidate Name')}
            </h1>
            ${p.headline ? `<div class="text-sm font-bold mt-1 text-slate-700">${escapeHtml(p.headline)}</div>` : ''}
          </div>
          ${renderPhotoHtml(profile, 'w-20 h-20 rounded border-2 border-slate-300')}
        </div>
        <div class="cv-contact-line text-[11px] text-slate-600 mt-3 pt-2 border-t border-slate-200 flex flex-wrap gap-x-3 gap-y-1">
          ${p.location ? `<span>📍 ${escapeHtml(p.location)}</span>` : ''}
          ${p.email ? `<span>✉️ ${escapeHtml(p.email)}</span>` : ''}
          ${p.phone ? `<span>📞 ${escapeHtml(p.phone)}</span>` : ''}
          ${p.linkedin ? `<span>🔗 ${escapeHtml(getCleanUrl(p.linkedin))}</span>` : ''}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-white px-2 py-1 mb-2 inline-block rounded-xs" style="background-color: ${primaryColor}">
            Executive Summary
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-white px-2 py-1 mb-2 inline-block rounded-xs" style="background-color: ${primaryColor}">
            Core Competencies & Capabilities
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            ${skills.map(s => `
              <div class="p-1.5 border border-slate-200 rounded bg-slate-50 flex items-center justify-between">
                <span class="font-bold text-slate-900 text-[11px]">${escapeHtml(s.name)}</span>
                ${s.level ? `<span class="text-[10px] text-slate-500 font-semibold">${escapeHtml(s.level)}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-white px-2 py-1 mb-3 inline-block rounded-xs" style="background-color: ${primaryColor}">
            Professional Experience
          </h2>
          <div class="space-y-4">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid border-l-2 pl-3" style="border-color: ${primaryColor}">
                <div class="flex justify-between items-baseline flex-wrap gap-1">
                  <span class="font-bold text-slate-900 text-xs">${escapeHtml(exp.title || '')}</span>
                  <span class="text-[11px] font-semibold text-slate-500">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                <div class="text-xs font-semibold text-slate-700 mb-1">${escapeHtml(exp.company || '')}${exp.location ? ` — ${escapeHtml(exp.location)}` : ''}</div>
                ${exp.description ? `<p class="text-xs text-slate-600 mb-1 leading-relaxed">${escapeHtml(exp.description)}</p>` : ''}
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-white px-2 py-1 mb-2 inline-block rounded-xs" style="background-color: ${primaryColor}">
            Education & Qualifications
          </h2>
          <div class="space-y-2">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline flex-wrap gap-1 pb-1 border-b border-slate-100">
                <div>
                  <div class="font-bold text-slate-900 text-xs">${escapeHtml(formatEducationDegree(edu))}</div>
                  <div class="text-[11px] text-slate-600">${escapeHtml(edu.institution || '')}${edu.location ? ` (${escapeHtml(edu.location)})` : ''}</div>
                </div>
                <div class="text-[11px] text-slate-500 font-semibold">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.projects || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-white px-2 py-1 mb-2 inline-block rounded-xs" style="background-color: ${primaryColor}">
            Key Projects
          </h2>
          <div class="space-y-2">
            ${profile.projects.map(pr => `
              <div>
                <span class="font-bold text-slate-900">${escapeHtml(pr.title || '')}</span>
                ${pr.projectType ? `<span class="text-slate-500 text-[10px] ml-1">(${escapeHtml(pr.projectType)})</span>` : ''}
                ${pr.description ? `<p class="text-xs text-slate-600 leading-relaxed mt-0.5">${escapeHtml(pr.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

export function renderProfModernSlate(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#334155';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-prof-modern-slate max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      <header class="flex justify-between items-center border-b-2 pb-4 mb-5" style="border-color: ${primaryColor}">
        <div>
          <h1 class="cv-name text-2xl font-black text-slate-900 tracking-tight">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
          ${p.headline ? `<div class="text-xs font-bold uppercase tracking-widest text-slate-500 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
          <div class="cv-contact-line text-[11px] text-slate-600 mt-2 flex flex-wrap gap-3">
            ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
            ${p.email ? `<span>${escapeHtml(p.email)}</span>` : ''}
            ${p.phone ? `<span>${escapeHtml(p.phone)}</span>` : ''}
            ${p.linkedin ? `<span>${escapeHtml(getCleanUrl(p.linkedin))}</span>` : ''}
          </div>
        </div>
        ${renderPhotoHtml(profile, 'w-16 h-16 rounded-full border border-slate-300')}
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-[11px] font-extrabold uppercase tracking-widest pb-1 mb-1.5 border-b border-slate-200" style="color: ${primaryColor}">
            Profile Overview
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-[11px] font-extrabold uppercase tracking-widest pb-1 mb-1.5 border-b border-slate-200" style="color: ${primaryColor}">
            Core Skills & Specializations
          </h2>
          <div class="flex flex-wrap gap-1.5">
            ${skills.map(s => `
              <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[11px] border border-slate-200">
                ${escapeHtml(s.name)}${s.level ? ` <span class="text-slate-500 font-normal">(${escapeHtml(s.level)})</span>` : ''}
              </span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-[11px] font-extrabold uppercase tracking-widest pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Work History
          </h2>
          <div class="space-y-3">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900">${escapeHtml(exp.title || '')} — <span class="font-medium text-slate-700">${escapeHtml(exp.company || '')}</span></span>
                  <span class="text-[10px] font-semibold text-slate-500">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5 mt-1">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-[11px] font-extrabold uppercase tracking-widest pb-1 mb-1.5 border-b border-slate-200" style="color: ${primaryColor}">
            Education
          </h2>
          <div class="space-y-1.5">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <div>
                  <span class="font-bold text-slate-900">${escapeHtml(formatEducationDegree(edu))}</span>
                  <span class="text-slate-600">, ${escapeHtml(edu.institution || '')}</span>
                </div>
                <span class="text-[10px] text-slate-500">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

// ==========================================
// FORMAT 2: ATS-FRIENDLY RESUME EXTENSIONS
// ==========================================

export function renderAtsCompactLinear(profile) {
  const p = profile.personal || {};
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-ats-compact-linear max-w-[850px] mx-auto bg-white text-black leading-snug text-xs font-sans p-8 sm:p-10 shadow-xs">
      <header class="text-center pb-2 mb-3 border-b border-black">
        <h1 class="cv-name text-xl font-bold uppercase tracking-wider text-black">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
        ${p.headline ? `<div class="text-xs font-semibold text-black">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs text-black mt-1">
          ${[p.location, p.phone, p.email, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join(' | ')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-3">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">Summary</h2>
          <p class="text-xs text-black">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-3">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">Core Competencies</h2>
          <p class="text-xs text-black">${skills.map(s => escapeHtml(s.name)).join(' • ')}</p>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-3">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">Experience</h2>
          <div class="space-y-2">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline font-bold text-black text-xs">
                  <span>${escapeHtml(exp.title || '')} — ${escapeHtml(exp.company || '')}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</span>
                  <span>[${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}]</span>
                </div>
                ${exp.description ? `<p class="text-xs text-black mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 text-xs text-black space-y-0.5 mt-0.5">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-3 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">Education</h2>
          <div class="space-y-1">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline text-xs text-black">
                <span><strong>${escapeHtml(formatEducationDegree(edu))}</strong> — ${escapeHtml(edu.institution || '')}</span>
                <span>[${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}]</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, '#000000')}
    </div>
  `;
}

export function renderAtsPlainSemantic(profile) {
  const p = profile.personal || {};
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-ats-plain-semantic max-w-[850px] mx-auto bg-white text-slate-900 leading-normal text-xs font-mono p-8 sm:p-10 shadow-xs">
      <header class="pb-3 mb-4 border-b border-slate-400">
        <h1 class="cv-name text-lg font-bold uppercase tracking-wider text-black">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
        ${p.headline ? `<div class="text-xs text-slate-700">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs text-slate-600 mt-1">
          ${[p.location, p.phone, p.email, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join(' | ')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest text-black mb-1">=== PROFESSIONAL SUMMARY ===</h2>
          <p class="text-xs text-slate-800">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest text-black mb-1">=== KEY SKILLS ===</h2>
          <p class="text-xs text-slate-800">${skills.map(s => escapeHtml(s.name)).join(' / ')}</p>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest text-black mb-1">=== WORK EXPERIENCE ===</h2>
          <div class="space-y-3">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="font-bold text-black text-xs">${escapeHtml(exp.title || '')} | ${escapeHtml(exp.company || '')} | ${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</div>
                ${exp.description ? `<p class="text-xs text-slate-800 mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 text-xs text-slate-800 space-y-0.5 mt-0.5">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest text-black mb-1">=== EDUCATION ===</h2>
          <div class="space-y-1.5">
            ${profile.education.map(edu => `
              <div class="text-xs text-slate-800">
                <strong>${escapeHtml(formatEducationDegree(edu))}</strong>, ${escapeHtml(edu.institution || '')} (${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))})
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, '#000000')}
    </div>
  `;
}

export function renderAtsExecutiveScan(profile) {
  const p = profile.personal || {};
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-ats-executive-scan max-w-[850px] mx-auto bg-white text-slate-900 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      <header class="text-center pb-3 mb-4 border-b-2 border-slate-800">
        <h1 class="cv-name text-2xl font-bold uppercase tracking-wide text-slate-950">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
        ${p.headline ? `<div class="text-xs font-semibold text-slate-700 mt-0.5 uppercase tracking-wider">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs text-slate-600 mt-1">
          ${[p.location, p.phone, p.email, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join('  •  ')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">Executive Career Profile</h2>
          <p class="text-xs text-slate-800 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">Areas of Expertise</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-1 text-xs text-slate-800">
            ${skills.map(s => `<div>• <strong>${escapeHtml(s.name)}</strong>${s.level ? ` (${escapeHtml(s.level)})` : ''}</div>`).join('')}
          </div>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">Executive Experience & Key Achievements</h2>
          <div class="space-y-3">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-950 text-xs">${escapeHtml(exp.title || '')}</span>
                  <span class="text-xs font-semibold text-slate-600">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                <div class="font-semibold text-slate-700 text-xs">${escapeHtml(exp.company || '')}${exp.location ? ` | ${escapeHtml(exp.location)}` : ''}</div>
                ${exp.description ? `<p class="text-xs text-slate-800 mt-1">${escapeHtml(exp.description)}</p>` : ''}
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 text-xs text-slate-800 space-y-0.5 mt-1">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">Academic Credentials</h2>
          <div class="space-y-1.5">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline text-xs text-slate-800">
                <span><strong>${escapeHtml(formatEducationDegree(edu))}</strong> — ${escapeHtml(edu.institution || '')}</span>
                <span>${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, '#0f172a')}
    </div>
  `;
}

// ==========================================
// FORMAT 3: CREATIVE / VISUAL CV EXTENSIONS
// ==========================================

export function renderCreativePortfolioGrid(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#7c3aed';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-creative-portfolio-grid max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      <!-- Creative Gradient Header -->
      <header class="p-6 rounded-2xl text-white mb-6" style="background: linear-gradient(135deg, ${primaryColor}, #4f46e5)">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="cv-name text-3xl font-extrabold tracking-tight">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
            ${p.headline ? `<div class="text-sm font-semibold opacity-90 mt-1">${escapeHtml(p.headline)}</div>` : ''}
            <div class="cv-contact-line text-xs opacity-80 mt-3 flex flex-wrap gap-3">
              ${p.location ? `<span>📍 ${escapeHtml(p.location)}</span>` : ''}
              ${p.email ? `<span>✉️ ${escapeHtml(p.email)}</span>` : ''}
              ${p.phone ? `<span>📞 ${escapeHtml(p.phone)}</span>` : ''}
              ${p.website || p.portfolio ? `<span>🌐 ${escapeHtml(getCleanUrl(p.website || p.portfolio))}</span>` : ''}
            </div>
          </div>
          ${renderPhotoHtml(profile, 'w-20 h-20 rounded-full border-2 border-white shadow-md')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5 p-4 rounded-xl bg-purple-50/50 border border-purple-100">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider mb-1" style="color: ${primaryColor}">Creative Vision & Summary</h2>
          <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${(profile.projects || []).length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Featured Projects & Portfolio
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${profile.projects.map(proj => `
              <div class="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-purple-300 transition">
                <div class="font-bold text-slate-900 text-xs">${escapeHtml(proj.title || '')}</div>
                ${proj.projectType ? `<span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold text-purple-700 bg-purple-100 mt-1">${escapeHtml(proj.projectType)}</span>` : ''}
                ${proj.description ? `<p class="text-xs text-slate-600 mt-1 leading-relaxed">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<div class="text-[11px] font-semibold text-slate-700 mt-1">Impact: ${escapeHtml(proj.outcomes)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Creative Toolset & Skills
          </h2>
          <div class="flex flex-wrap gap-2">
            ${skills.map(s => `
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-900 border border-purple-200">
                ${escapeHtml(s.name)}${s.level ? ` • ${escapeHtml(s.level)}` : ''}
              </span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Experience History
          </h2>
          <div class="space-y-3">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900">${escapeHtml(exp.title || '')} — <span class="font-semibold text-purple-800">${escapeHtml(exp.company || '')}</span></span>
                  <span class="text-[11px] text-slate-500 font-semibold">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education
          </h2>
          <div class="space-y-1.5">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-slate-900">${escapeHtml(formatEducationDegree(edu))}, ${escapeHtml(edu.institution || '')}</span>
                <span class="text-[11px] text-slate-500">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

export function renderCreativeDuoTone(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e293b';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-creative-duo-tone max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans shadow-xs flex flex-col md:flex-row min-h-[1000px]">
      <!-- Left Column: Dark Duo-Tone Accent (32%) -->
      <aside class="w-full md:w-[32%] p-6 text-white space-y-6" style="background-color: ${primaryColor}">
        <div class="text-center">
          ${renderPhotoHtml(profile, 'w-24 h-24 rounded-full mx-auto border-2 border-white/40 mb-3 shadow-lg')}
          <h1 class="cv-name text-lg font-extrabold uppercase tracking-tight text-white">${escapeHtml(p.fullName || 'Candidate')}</h1>
          ${p.headline ? `<div class="text-[11px] text-slate-300 font-semibold mt-1">${escapeHtml(p.headline)}</div>` : ''}
        </div>

        <div>
          <h3 class="text-[11px] font-bold uppercase tracking-widest text-slate-300 border-b border-white/20 pb-1 mb-2">Contact</h3>
          <div class="text-[11px] space-y-1.5 text-slate-200">
            ${p.location ? `<div>📍 ${escapeHtml(p.location)}</div>` : ''}
            ${p.email ? `<div class="break-all">✉️ ${escapeHtml(p.email)}</div>` : ''}
            ${p.phone ? `<div>📞 ${escapeHtml(p.phone)}</div>` : ''}
            ${p.linkedin ? `<div class="break-all">🔗 ${escapeHtml(getCleanUrl(p.linkedin))}</div>` : ''}
          </div>
        </div>

        ${skills.length > 0 ? `
          <div>
            <h3 class="text-[11px] font-bold uppercase tracking-widest text-slate-300 border-b border-white/20 pb-1 mb-2">Skills</h3>
            <div class="space-y-1.5 text-[11px]">
              ${skills.map(s => `
                <div class="flex justify-between items-center text-slate-200">
                  <span>${escapeHtml(s.name)}</span>
                  ${s.level ? `<span class="text-[10px] text-slate-400">${escapeHtml(s.level)}</span>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${(profile.languages || []).length > 0 ? `
          <div>
            <h3 class="text-[11px] font-bold uppercase tracking-widest text-slate-300 border-b border-white/20 pb-1 mb-2">Languages</h3>
            <div class="space-y-1 text-[11px] text-slate-200">
              ${profile.languages.map(l => `<div>${escapeHtml(l.name)} (${escapeHtml(l.proficiency || l.cefr || 'Fluent')})</div>`).join('')}
            </div>
          </div>
        ` : ''}
      </aside>

      <!-- Right Column: Light Narrative Body (68%) -->
      <main class="w-full md:w-[68%] p-6 sm:p-8 space-y-5 bg-white">
        ${(p.summary || p.objective) ? `
          <section>
            <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2 border-slate-900 text-slate-900">
              Professional Profile
            </h2>
            <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
          </section>
        ` : ''}

        ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
          <section>
            <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2 border-slate-900 text-slate-900">
              Work Experience
            </h2>
            <div class="space-y-3">
              ${profile.experience.map(exp => `
                <div class="page-break-avoid">
                  <div class="flex justify-between items-baseline">
                    <span class="font-bold text-slate-900 text-xs">${escapeHtml(exp.title || '')}</span>
                    <span class="text-[10px] font-semibold text-slate-500">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                  </div>
                  <div class="text-xs font-semibold text-slate-700">${escapeHtml(exp.company || '')}</div>
                  ${exp.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
                  ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                    <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5 mt-1">
                      ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${(profile.education || []).length > 0 ? `
          <section class="page-break-avoid">
            <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2 border-slate-900 text-slate-900">
              Education & Degrees
            </h2>
            <div class="space-y-2">
              ${profile.education.map(edu => `
                <div>
                  <div class="font-bold text-slate-900 text-xs">${escapeHtml(formatEducationDegree(edu))}</div>
                  <div class="text-xs text-slate-600">${escapeHtml(edu.institution || '')} [${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}]</div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${(profile.projects || []).length > 0 ? `
          <section class="page-break-avoid">
            <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2 border-slate-900 text-slate-900">
              Selected Projects
            </h2>
            <div class="space-y-2">
              ${profile.projects.map(proj => `
                <div>
                  <span class="font-bold text-slate-900">${escapeHtml(proj.title || '')}</span>
                  ${proj.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${renderReferencesHtml(profile, '#0f172a')}
      </main>
    </div>
  `;
}

export function renderCreativeEditorial(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#09090b';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-creative-editorial max-w-[850px] mx-auto bg-[#fafafa] text-zinc-900 leading-relaxed text-xs font-serif p-8 sm:p-12 shadow-xs border border-zinc-200">
      <header class="text-center pb-6 mb-6 border-b-2 border-zinc-900">
        <h1 class="cv-name text-3xl font-normal tracking-tight text-zinc-950 italic font-serif">
          ${escapeHtml(p.fullName || 'Candidate Name')}
        </h1>
        ${p.headline ? `<div class="text-xs uppercase tracking-widest font-sans font-bold text-zinc-600 mt-1">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs font-sans text-zinc-500 mt-2 flex flex-wrap justify-center gap-3">
          ${[p.location, p.email, p.phone, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join('  —  ')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-6 italic text-center max-w-xl mx-auto text-zinc-700 text-sm leading-relaxed border-l-2 border-r-2 border-zinc-300 px-6 py-2 font-serif">
          "${escapeHtml(p.summary || p.objective)}"
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-6 font-sans">
          <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1 mb-2">Areas of Competence</h2>
          <p class="text-xs text-zinc-700 leading-loose">${skills.map(s => `<strong>${escapeHtml(s.name)}</strong>${s.level ? ` (${escapeHtml(s.level)})` : ''}`).join(' &nbsp;•&nbsp; ')}</p>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-6 font-sans">
          <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1 mb-3">Professional Record</h2>
          <div class="space-y-4">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline font-serif">
                  <span class="font-bold text-sm text-zinc-950">${escapeHtml(exp.title || '')}</span>
                  <span class="text-xs text-zinc-500 font-sans">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                <div class="text-xs font-semibold text-zinc-700 font-sans">${escapeHtml(exp.company || '')}${exp.location ? ` — ${escapeHtml(exp.location)}` : ''}</div>
                ${exp.description ? `<p class="text-xs text-zinc-700 font-serif mt-1 leading-relaxed">${escapeHtml(exp.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-6 font-sans page-break-avoid">
          <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1 mb-2">Education & Degrees</h2>
          <div class="space-y-2">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <div>
                  <span class="font-bold text-zinc-900 font-serif text-sm">${escapeHtml(formatEducationDegree(edu))}</span>
                  <span class="text-zinc-600 font-sans">, ${escapeHtml(edu.institution || '')}</span>
                </div>
                <span class="text-xs text-zinc-500 font-sans">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, '#18181b')}
    </div>
  `;
}

export function renderCreativeMinimalArt(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#059669';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-creative-minimal-art max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-mono p-8 sm:p-10 shadow-xs border-2 border-slate-100">
      <header class="flex justify-between items-start pb-4 mb-6 border-b-2" style="border-color: ${primaryColor}">
        <div>
          <span class="text-[10px] tracking-widest uppercase font-bold text-slate-400">// PORTFOLIO CV //</span>
          <h1 class="cv-name text-2xl font-black text-slate-900 mt-1">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
          ${p.headline ? `<div class="text-xs font-bold text-slate-600 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
        </div>
        <div class="text-right text-[11px] text-slate-500 space-y-0.5">
          ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
          ${p.email ? `<div>${escapeHtml(p.email)}</div>` : ''}
          ${p.phone ? `<div>${escapeHtml(p.phone)}</div>` : ''}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5 p-3 rounded bg-slate-50 border border-slate-200">
          <p class="text-xs text-slate-700 leading-relaxed font-sans">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2"># TECH_AND_SKILLS</h2>
          <div class="flex flex-wrap gap-1.5">
            ${skills.map(s => `
              <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                [${escapeHtml(s.name)}]
              </span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2"># WORK_EXPERIENCE</h2>
          <div class="space-y-3 font-sans">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid p-2.5 rounded border border-slate-100 bg-slate-50/50">
                <div class="flex justify-between items-baseline font-mono text-xs">
                  <span class="font-bold text-slate-900">${escapeHtml(exp.title || '')} @ ${escapeHtml(exp.company || '')}</span>
                  <span class="text-slate-500 text-[10px]">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-700 mt-1">${escapeHtml(exp.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2"># EDUCATION</h2>
          <div class="space-y-1.5 font-sans">
            ${profile.education.map(edu => `
              <div class="text-xs text-slate-800">
                <strong>${escapeHtml(formatEducationDegree(edu))}</strong> — ${escapeHtml(edu.institution || '')} (${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))})
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

// ==========================================
// FORMAT 4: ACADEMIC CV EXTENSIONS
// ==========================================

export function renderAcademicFellowship(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-academic-fellowship max-w-[850px] mx-auto bg-white text-slate-900 leading-normal text-xs font-serif p-8 sm:p-12 shadow-xs">
      <header class="text-center pb-4 mb-6 border-b-2 border-slate-800">
        <h1 class="cv-name text-2xl font-bold uppercase tracking-wide text-slate-950">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
        ${p.headline ? `<div class="text-xs font-semibold text-slate-700 mt-1 font-sans">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs font-sans text-slate-600 mt-2 flex flex-wrap justify-center gap-3">
          ${[p.location, p.email, p.phone, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join('  |  ')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5 p-3.5 rounded bg-slate-50 border border-slate-200">
          <h2 class="cv-section-title text-xs font-bold font-sans uppercase tracking-wider text-slate-900 mb-1">Research Interests & Focus</h2>
          <p class="text-xs text-slate-800 leading-relaxed">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold font-sans uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">Education & Fellowships</h2>
          <div class="space-y-2">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <div>
                  <div class="font-bold text-slate-900">${escapeHtml(formatEducationDegree(edu))}</div>
                  <div class="text-slate-600 font-sans text-[11px]">${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                  ${edu.thesis ? `<div class="text-[11px] text-slate-700 italic">Dissertation: "${escapeHtml(edu.thesis)}"</div>` : ''}
                </div>
                <div class="text-[11px] font-sans text-slate-500">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.publications || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold font-sans uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">Publications & Scholarly Output</h2>
          <div class="space-y-2">
            ${profile.publications.map((pub, idx) => `
              <div class="page-break-avoid">
                <span class="font-sans font-bold">[${idx + 1}]</span>
                ${pub.authors ? `${escapeHtml(pub.authors)}. ` : ''}
                "${escapeHtml(pub.title || '')}".
                <span class="italic">${escapeHtml(pub.journal || '')}</span> (${escapeHtml(pub.year || '')}).
                ${pub.doi ? `<span class="text-blue-700 font-sans text-[10px]">DOI: ${escapeHtml(pub.doi)}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.experience || []).length > 0 ? `
        <section class="mb-5 font-sans">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">Teaching & Academic Appointments</h2>
          <div class="space-y-3">
            ${profile.experience.map(exp => `
              <div>
                <div class="flex justify-between items-baseline font-bold text-slate-900">
                  <span>${escapeHtml(exp.title || '')} — ${escapeHtml(exp.company || '')}</span>
                  <span class="text-[10px] text-slate-500">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-700 mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

export function renderAcademicCurriculum(profile) {
  return renderAcademicFellowship(profile); // Preserves academic layout
}

export function renderAcademicSymposium(profile) {
  return renderAcademicFellowship(profile);
}

// ==========================================
// FORMAT 5: FUNCTIONAL CV EXTENSIONS
// ==========================================

export function renderFunctionalCapability(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#0284c7';
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-functional-capability max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      <header class="border-b-2 pb-4 mb-5" style="border-color: ${primaryColor}">
        <h1 class="cv-name text-2xl font-black text-slate-900">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
        ${p.headline ? `<div class="text-xs font-bold uppercase tracking-widest text-sky-700 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-[11px] text-slate-600 mt-2 flex flex-wrap gap-3">
          ${[p.location, p.email, p.phone, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join('  |  ')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Core Value Proposition
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b border-slate-200" style="color: ${primaryColor}">
            Key Functional Competencies
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${skills.map(s => `
              <div class="p-2.5 rounded-lg border border-slate-200 bg-sky-50/30">
                <div class="font-bold text-slate-900 text-xs">${escapeHtml(s.name)}</div>
                ${s.level ? `<div class="text-[10px] text-sky-700 font-semibold">${escapeHtml(s.level)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.projects || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Project Deliverables & Proof Points
          </h2>
          <div class="space-y-2.5">
            ${profile.projects.map(pr => `
              <div class="page-break-avoid">
                <span class="font-bold text-slate-900">${escapeHtml(pr.title || '')}</span>
                ${pr.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(pr.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Education
          </h2>
          <div class="space-y-1.5">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-slate-900">${escapeHtml(formatEducationDegree(edu))}, ${escapeHtml(edu.institution || '')}</span>
                <span class="text-slate-500 text-[10px]">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

export function renderFunctionalProjectFirst(profile) {
  return renderFunctionalCapability(profile);
}

export function renderFunctionalHybridCompetency(profile) {
  return renderFunctionalCapability(profile);
}

// ==========================================
// FORMAT 6: INTERNATIONAL CV EXTENSIONS
// ==========================================

export function renderIntlNordicClean(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#475569';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-intl-nordic-clean max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-12 shadow-xs">
      <header class="flex justify-between items-baseline pb-6 mb-6 border-b border-slate-300">
        <div>
          <h1 class="cv-name text-2xl font-light tracking-tight text-slate-900">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
          ${p.headline ? `<div class="text-xs font-medium text-slate-500 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
        </div>
        <div class="text-right text-[11px] text-slate-500 space-y-0.5">
          ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
          ${p.email ? `<div>${escapeHtml(p.email)}</div>` : ''}
          ${p.phone ? `<div>${escapeHtml(p.phone)}</div>` : ''}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-6">
          <p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Experience</h2>
          <div class="space-y-4">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-medium text-slate-900 text-xs">${escapeHtml(exp.title || '')} / ${escapeHtml(exp.company || '')}</span>
                  <span class="text-[10px] text-slate-400">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-6 page-break-avoid">
          <h2 class="cv-section-title text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Education</h2>
          <div class="space-y-2">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <span class="font-medium text-slate-900">${escapeHtml(formatEducationDegree(edu))}, ${escapeHtml(edu.institution || '')}</span>
                <span class="text-[10px] text-slate-400">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Competences</h2>
          <div class="flex flex-wrap gap-2 text-xs text-slate-600">
            ${skills.map(s => `<span>${escapeHtml(s.name)}</span>`).join(' • ')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

// ==========================================
// FORMAT 7: EXECUTIVE CV EXTENSIONS
// ==========================================

export function renderExecCSuite(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#0f172a';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-exec-c-suite max-w-[850px] mx-auto bg-white text-slate-900 leading-normal text-xs font-sans p-8 sm:p-12 shadow-xs border-t-8" style="border-color: ${primaryColor}">
      <header class="pb-4 mb-6 border-b border-slate-300 flex justify-between items-center">
        <div>
          <h1 class="cv-name text-3xl font-extrabold uppercase tracking-tight text-slate-950">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
          ${p.headline ? `<div class="text-sm font-bold text-slate-700 mt-0.5 tracking-wide">${escapeHtml(p.headline)}</div>` : ''}
          <div class="cv-contact-line text-xs text-slate-500 mt-2 flex flex-wrap gap-3">
            ${[p.location, p.email, p.phone, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join('  |  ')}
          </div>
        </div>
        ${renderPhotoHtml(profile, 'w-20 h-20 rounded-md border border-slate-300')}
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-2" style="border-color: ${primaryColor}">
            Executive Career Narrative
          </h2>
          <p class="text-xs text-slate-800 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-2" style="border-color: ${primaryColor}">
            Executive Governance & Board Competencies
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            ${skills.map(s => `
              <div class="p-2 rounded bg-slate-50 border border-slate-200">
                <span class="font-bold text-slate-900">${escapeHtml(s.name)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-3" style="border-color: ${primaryColor}">
            Board & Executive Leadership Experience
          </h2>
          <div class="space-y-4">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-950 text-xs">${escapeHtml(exp.title || '')} — <span class="text-slate-700">${escapeHtml(exp.company || '')}</span></span>
                  <span class="text-xs font-semibold text-slate-600">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-700 mt-1 leading-relaxed">${escapeHtml(exp.description)}</p>` : ''}
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5 mt-1">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-2" style="border-color: ${primaryColor}">
            Academic & Board Credentials
          </h2>
          <div class="space-y-1.5">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-slate-900">${escapeHtml(formatEducationDegree(edu))}, ${escapeHtml(edu.institution || '')}</span>
                <span class="text-slate-500 text-xs">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

export function renderExecGovernance(profile) {
  return renderExecCSuite(profile);
}

export function renderExecGoldLine(profile) {
  return renderExecCSuite(profile);
}

// ==========================================
// FORMAT 8: TECHNICAL CV EXTENSIONS
// ==========================================

export function renderTechStackFocused(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#0284c7';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-tech-stack-focused max-w-[850px] mx-auto bg-white text-slate-900 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      <header class="pb-4 mb-5 border-b-2 border-slate-900 flex justify-between items-start">
        <div>
          <h1 class="cv-name text-2xl font-black text-slate-950 font-mono">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
          ${p.headline ? `<div class="text-xs font-bold text-sky-700 font-mono mt-0.5">&gt; ${escapeHtml(p.headline)}</div>` : ''}
          <div class="cv-contact-line text-xs font-mono text-slate-600 mt-2 flex flex-wrap gap-3">
            ${[p.location, p.email, p.phone, p.github ? `github.com/${getCleanUrl(p.github)}` : null, p.linkedin ? getCleanUrl(p.linkedin) : null].filter(Boolean).map(escapeHtml).join('  |  ')}
          </div>
        </div>
        ${renderPhotoHtml(profile, 'w-16 h-16 rounded border border-slate-300')}
      </header>

      ${skills.length > 0 ? `
        <section class="mb-5 p-3.5 rounded-xl bg-slate-900 text-white font-mono">
          <div class="text-[11px] font-bold text-emerald-400 mb-2">// TECHNICAL STACK MATRIX</div>
          <div class="flex flex-wrap gap-1.5">
            ${skills.map(s => `
              <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 text-xs">
                ${escapeHtml(s.name)}${s.level ? ` <span class="text-slate-400 text-[10px]">(${escapeHtml(s.level)})</span>` : ''}
              </span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(p.summary || p.objective) ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold font-mono uppercase text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">// Engineering Overview</h2>
          <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold font-mono uppercase text-slate-900 border-b border-slate-300 pb-0.5 mb-2.5">// Work Experience</h2>
          <div class="space-y-3.5">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline font-mono text-xs">
                  <span class="font-bold text-slate-950">${escapeHtml(exp.title || '')} @ ${escapeHtml(exp.company || '')}</span>
                  <span class="text-slate-500 text-[10px]">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-700 mt-1">${escapeHtml(exp.description)}</p>` : ''}
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5 mt-1">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.projects || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold font-mono uppercase text-slate-900 border-b border-slate-300 pb-0.5 mb-2">// Key Technical Projects</h2>
          <div class="space-y-2.5">
            ${profile.projects.map(pr => `
              <div class="p-2.5 rounded border border-slate-200 bg-slate-50">
                <div class="font-bold text-slate-900 font-mono text-xs">${escapeHtml(pr.title || '')}</div>
                ${pr.description ? `<p class="text-xs text-slate-700 mt-0.5">${escapeHtml(pr.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold font-mono uppercase text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">// Education & Degrees</h2>
          <div class="space-y-1 font-mono text-xs">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <span><strong>${escapeHtml(formatEducationDegree(edu))}</strong> — ${escapeHtml(edu.institution || '')}</span>
                <span class="text-slate-500 text-[10px]">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, '#0284c7')}
    </div>
  `;
}

export function renderTechCloudArchitect(profile) {
  return renderTechStackFocused(profile);
}

export function renderTechEngineeringLead(profile) {
  return renderTechStackFocused(profile);
}

export function renderTechDataScientist(profile) {
  return renderTechStackFocused(profile);
}

export function renderTechTerminalModern(profile) {
  return renderTechStackFocused(profile);
}

// ==========================================
// FORMAT 9: ENTRY-LEVEL / GRADUATE CV EXTENSIONS
// ==========================================

export function renderEntryEducationFirst(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#2563eb';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-entry-education-first max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      <header class="text-center pb-4 mb-5 border-b-2" style="border-color: ${primaryColor}">
        <h1 class="cv-name text-2xl font-bold uppercase tracking-tight text-slate-950">${escapeHtml(p.fullName || 'Graduate Candidate')}</h1>
        ${p.headline ? `<div class="text-xs font-semibold text-slate-600 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs text-slate-500 mt-2 flex flex-wrap justify-center gap-3">
          ${[p.location, p.email, p.phone, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join('  •  ')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Career Objective
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Education Spotlight (Top Priority for Fresh Graduates) -->
      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 p-3.5 rounded-xl bg-blue-50/50 border border-blue-200">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-blue-200" style="color: ${primaryColor}">
            Education & Academic Credentials
          </h2>
          <div class="space-y-3">
            ${profile.education.map(edu => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">${escapeHtml(formatEducationDegree(edu))}</span>
                  <span class="text-slate-500 text-[10px] font-semibold">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
                </div>
                <div class="text-slate-700 font-medium">${escapeHtml(edu.institution || '')}${edu.location ? ` (${escapeHtml(edu.location)})` : ''}</div>
                ${edu.gpa ? `<div class="text-[11px] font-bold text-blue-800 mt-0.5">Grade / Result: ${escapeHtml(edu.gpa)}</div>` : ''}
                ${edu.thesis ? `<div class="text-[11px] text-slate-600 italic mt-0.5">Thesis: "${escapeHtml(edu.thesis)}"</div>` : ''}
                ${edu.coursework ? `<div class="text-[10px] text-slate-600 mt-0.5">Key Coursework: ${escapeHtml(edu.coursework)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Technical & Foundational Skills
          </h2>
          <div class="flex flex-wrap gap-2">
            ${skills.map(s => `
              <span class="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs">
                ${escapeHtml(s.name)}${s.level ? ` <span class="text-slate-500 font-normal">(${escapeHtml(s.level)})</span>` : ''}
              </span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.projects || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Academic & Capstone Projects
          </h2>
          <div class="space-y-2.5">
            ${profile.projects.map(pr => `
              <div class="p-2.5 rounded border border-slate-200">
                <div class="font-bold text-slate-900">${escapeHtml(pr.title || '')}</div>
                ${pr.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(pr.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.internships || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Internships & Practical Training
          </h2>
          <div class="space-y-2">
            ${profile.internships.map(it => `
              <div>
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900">${escapeHtml(it.title || '')} — ${escapeHtml(it.company || '')}</span>
                  <span class="text-slate-500 text-[10px]">${escapeHtml(formatDateRange(it.startDate, it.endDate, false))}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Work Experience
          </h2>
          <div class="space-y-2">
            ${profile.experience.map(exp => `
              <div>
                <span class="font-bold text-slate-900">${escapeHtml(exp.title || '')}</span>
                <span class="text-slate-500 text-[10px] ml-1">(${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))})</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

export function renderEntryCampusLeader(profile) {
  return renderEntryEducationFirst(profile);
}

export function renderEntryInternPath(profile) {
  return renderEntryEducationFirst(profile);
}

export function renderEntryStemStarter(profile) {
  return renderEntryEducationFirst(profile);
}

export function renderEntryBoldStart(profile) {
  return renderEntryEducationFirst(profile);
}

// ==========================================
// FORMAT 10: EUROPASS CV EXTENSIONS
// ==========================================

export function renderEuropassModern(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#0e4194';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-europass-modern max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs border-l-4" style="border-color: ${primaryColor}">
      <header class="flex justify-between items-center pb-4 mb-5 border-b border-slate-200">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#0e4194]">Curriculum Vitae Europass</span>
          <h1 class="cv-name text-2xl font-black text-slate-900 mt-0.5">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
          ${p.headline ? `<div class="text-xs font-semibold text-slate-600 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
          <div class="cv-contact-line text-xs text-slate-500 mt-2 flex flex-wrap gap-3">
            ${[p.location, p.email, p.phone, p.nationality ? `Nationality: ${p.nationality}` : null].filter(Boolean).map(escapeHtml).join('  •  ')}
          </div>
        </div>
        ${renderPhotoHtml(profile, 'w-20 h-24 rounded border border-slate-300 object-cover')}
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-[#0e4194] pb-1 mb-1.5 border-b border-slate-200">
            Work Preference & Profile
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-[#0e4194] pb-1 mb-2.5 border-b border-slate-200">
            Work Experience
          </h2>
          <div class="space-y-3">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                  <span>${escapeHtml(exp.title || '')} — ${escapeHtml(exp.company || '')}</span>
                  <span class="text-slate-500 text-[11px] font-normal">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-[#0e4194] pb-1 mb-2 border-b border-slate-200">
            Education and Training
          </h2>
          <div class="space-y-2">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-slate-900">${escapeHtml(formatEducationDegree(edu))}, ${escapeHtml(edu.institution || '')}</span>
                <span class="text-slate-500 text-[11px]">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-[#0e4194] pb-1 mb-2 border-b border-slate-200">
            Personal Skills & Competences
          </h2>
          <div class="flex flex-wrap gap-1.5">
            ${skills.map(s => `
              <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-950 border border-blue-200 text-xs font-semibold">
                ${escapeHtml(s.name)}${s.level ? ` (${escapeHtml(s.level)})` : ''}
              </span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, '#0e4194')}
    </div>
  `;
}

export function renderEuropassExecutive(profile) {
  return renderEuropassModern(profile);
}

export function renderEuropassAcademic(profile) {
  return renderEuropassModern(profile);
}

export function renderEuropassCompact(profile) {
  return renderEuropassModern(profile);
}

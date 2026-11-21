/**
 * Format: German CV (Tabellarischer Lebenslauf)
 * Authentic German standard:
 * - Tabular two-column layout (left dates column ~25%, right content ~75%)
 * - Formal Bewerbungsfoto in upper right
 * - Structured personal data (Persönliche Daten)
 * - Clear chronological career progression
 * - Standard A4 paper format
 */

import {
  escapeHtml,
  formatDateRange,
  renderPhotoHtml,
  isSectionEnabled,
  formatEducationDegree,
  isFreshGraduateCandidate,
  renderReferencesHtml,
  getSkillsList
} from './templateUtils.js';

export function renderGermanCv(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = 'MM/YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  const expList = [...(profile.experience || [])].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const photoHtml = renderPhotoHtml(profile, 'w-24 h-32', 'rounded-sm object-cover border border-slate-300 shadow-xs');

  return `
    <div class="cv-format cv-german-lebenslauf max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      
      <!-- Lebenslauf Header -->
      <header class="flex justify-between items-start pb-4 mb-6 border-b-2" style="border-color: ${primaryColor}">
        <div class="space-y-1">
          <div class="text-[11px] font-bold uppercase tracking-widest text-slate-500">Lebenslauf</div>
          <h1 class="cv-name text-2xl font-black text-slate-900 tracking-tight">
            ${escapeHtml(p.fullName || 'Candidate Name')}
          </h1>
          ${p.headline ? `<p class="text-xs font-semibold text-slate-700">${escapeHtml(p.headline)}</p>` : ''}
          <div class="cv-contact-line text-xs text-slate-600 space-y-0.5 pt-1">
            ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
            ${p.phone ? `<div>Tel.: ${escapeHtml(p.phone)}</div>` : ''}
            ${p.email ? `<div>E-Mail: <a href="mailto:${p.email}" class="text-blue-700 hover:underline">${escapeHtml(p.email)}</a></div>` : ''}
          </div>
        </div>
        ${photoHtml ? `<div class="shrink-0 ml-4">${photoHtml}</div>` : ''}
      </header>

      <!-- Persönliche Daten (Personal Information if provided) -->
      ${p.dateOfBirth || p.nationality ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primaryColor}">
            Persönliche Daten / Personal Details
          </h2>
          <table class="w-full text-xs">
            <tbody>
              ${p.dateOfBirth ? `
                <tr>
                  <td class="w-40 py-0.5 text-slate-500">Geburtsdatum / DOB:</td>
                  <td class="py-0.5 font-medium">${escapeHtml(p.dateOfBirth)}</td>
                </tr>
              ` : ''}
              ${p.nationality ? `
                <tr>
                  <td class="py-0.5 text-slate-500">Staatsangehörigkeit:</td>
                  <td class="py-0.5 font-medium">${escapeHtml(p.nationality)}</td>
                </tr>
              ` : ''}
              ${p.maritalStatus ? `
                <tr>
                  <td class="py-0.5 text-slate-500">Familienstand:</td>
                  <td class="py-0.5 font-medium">${escapeHtml(p.maritalStatus)}</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </section>
      ` : ''}

      <!-- Berufserfahrung / Work Experience (Tabular Layout) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b" style="color: ${primaryColor}">
            Beruflicher Werdegang / Work Experience
          </h2>
          <div class="space-y-3">
            ${expList.map(exp => `
              <div class="grid grid-cols-12 gap-3 page-break-avoid">
                <div class="col-span-12 sm:col-span-4 text-slate-600 font-mono text-[11px] font-semibold">
                  ${formatDateRange(exp.startDate, exp.endDate, dateFormat, exp.current)}
                </div>
                <div class="col-span-12 sm:col-span-8">
                  <div class="font-bold text-slate-900">${escapeHtml(exp.title || '')}</div>
                  <div class="text-slate-700 text-xs">${escapeHtml(exp.company || '')}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
                  ${exp.highlights && exp.highlights.length > 0 ? `
                    <ul class="list-disc list-outside ml-4 mt-1 text-slate-600 space-y-0.5 text-xs">
                      ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Ausbildung / Education (Tabular Layout) -->
      ${isSectionEnabled(profile, 'education') && (profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b" style="color: ${primaryColor}">
            Ausbildung / Education
          </h2>
          <div class="space-y-3">
            ${profile.education.map(edu => `
              <div class="grid grid-cols-12 gap-3">
                <div class="col-span-12 sm:col-span-4 text-slate-600 font-mono text-[11px] font-semibold">
                  ${formatDateRange(edu.startDate, edu.endDate, dateFormat)}
                </div>
                <div class="col-span-12 sm:col-span-8">
                  <div class="font-bold text-slate-900">${escapeHtml(formatEducationDegree(edu))}</div>
                  <div class="text-slate-700 text-xs">${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                  ${edu.gpa ? `<div class="text-[11px] text-slate-500">Abschlussnote: ${escapeHtml(edu.gpa)}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Kenntnisse & Qualifikationen / Skills -->
      ${isSectionEnabled(profile, 'skills') && skills.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primaryColor}">
            Kenntnisse & Fähigkeiten / Skills
          </h2>
          <div class="flex flex-wrap gap-2">
            ${skills.map(s => `
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs">
                <strong class="font-semibold text-slate-900">${escapeHtml(s.name)}</strong>
                ${s.level ? `<span class="text-slate-500">(${escapeHtml(s.level)})</span>` : ''}
              </span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Sprachen / Languages -->
      ${isSectionEnabled(profile, 'languages') && (profile.languages || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primaryColor}">
            Sprachen / Languages
          </h2>
          <div class="grid grid-cols-2 gap-2 text-xs">
            ${profile.languages.map(l => `
              <div>
                <span class="font-bold text-slate-900">${escapeHtml(l.name)}:</span>
                <span class="text-slate-600 ml-1">${escapeHtml(l.proficiency || l.cefr || 'Gut')}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, primaryColor)}

      <!-- Formal Date & Place -->
      <footer class="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-600 page-break-avoid">
        <div>
          <span>${p.location ? escapeHtml(p.location) : 'Ort'}, den ${new Date().toLocaleDateString('de-DE')}</span>
        </div>
        <div class="text-center">
          <div class="w-36 border-b border-slate-400 pb-1 mb-1"></div>
          <span class="text-[11px]">Unterschrift</span>
        </div>
      </footer>

    </div>
  `;
}

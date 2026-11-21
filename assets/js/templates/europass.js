/**
 * Format 8: Europass CV
 * Authentic European Union Europass Curriculum Vitae standard.
 * Features the signature 2-column layout (left dates/labels, right details),
 * official CEFR European Language Passport table (A1-C2), Mother Tongue,
 * Digital Competences, and European Union styling.
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

export function renderEuropass(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = '#0e4194'; // Official Europass Blue
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  const motherTongue = (profile.languages || []).find(l => l.proficiency === 'Native')?.name || 'English';
  const otherLanguages = (profile.languages || []).filter(l => l.proficiency !== 'Native');
  const photoHtml = renderPhotoHtml(profile, 'w-24 h-28', 'rounded-md shadow-xs');

  // Collect skills list
  const allSkills = getSkillsList(profile);

  return `
    <div class="cv-format cv-europass max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm bg-white">
      <!-- Official Europass Banner Header -->
      <header class="border-b-2 border-slate-300 pb-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- Europass Blue Insignia -->
            <div class="w-10 h-10 rounded bg-[#0e4194] flex items-center justify-center text-white font-extrabold text-xl shadow-xs shrink-0">
              <span class="tracking-tighter">eu</span>
            </div>
            <div>
              <div class="text-xs uppercase tracking-widest text-[#0e4194] font-bold">Europass Curriculum Vitae</div>
              <h1 class="cv-name text-2xl font-black text-slate-900">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
            </div>
          </div>
          <div class="flex items-center gap-3">
            ${p.headline ? `<div class="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded text-slate-700 hidden sm:block">${escapeHtml(p.headline)}</div>` : ''}
            ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
          </div>
        </div>
      </header>

      <!-- Standard Europass 2-Column Grid (Left: Label/Dates, Right: Details) -->
      <div class="space-y-6 text-xs">
        
        <!-- Personal Information -->
        <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 break-inside-avoid">
          <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
            Personal Information
          </div>
          <div class="cv-contact-line col-span-8 space-y-1 text-slate-700">
            ${p.location ? `<div><span class="text-slate-500">Address:</span> ${escapeHtml(p.location)}</div>` : ''}
            ${p.email ? `<div><span class="text-slate-500">Email:</span> ${escapeHtml(p.email)}</div>` : ''}
            ${p.phone ? `<div><span class="text-slate-500">Telephone:</span> ${escapeHtml(p.phone)}</div>` : ''}
            ${p.nationality ? `<div><span class="text-slate-500">Nationality:</span> ${escapeHtml(p.nationality)}</div>` : ''}
            ${p.dateOfBirth ? `<div><span class="text-slate-500">Date of Birth:</span> ${escapeHtml(p.dateOfBirth)}</div>` : ''}
            ${p.drivingLicense ? `<div><span class="text-slate-500">Driving Licence:</span> ${escapeHtml(p.drivingLicense)}</div>` : ''}
            ${p.linkedin ? `<div><span class="text-slate-500">LinkedIn:</span> <a href="${p.linkedin}" target="_blank" class="text-blue-700 underline">${getCleanUrl(p.linkedin)}</a></div>` : ''}
          </div>
        </section>

        <!-- Professional Summary / Objective -->
        ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 break-inside-avoid">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Occupational Profile
            </div>
            <div class="col-span-8 text-slate-700 leading-relaxed text-justify">
              ${escapeHtml(p.summary || p.objective)}
            </div>
          </section>
        ` : ''}

        <!-- For Fresh Grads: Education Comes First -->
        ${isFreshGraduate && isSectionEnabled(profile, 'education') && profile.education?.length > 0 ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Education & Training
            </div>
            <div class="col-span-8 space-y-4">
              ${profile.education.map(edu => `
                <div class="break-inside-avoid">
                  <div class="font-semibold text-slate-500 text-[11px]">
                    ${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}
                  </div>
                  <div class="font-bold text-slate-900 text-sm mt-0.5">
                    ${formatEducationDegree(edu)}
                  </div>
                  <div class="text-slate-700 italic">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                  ${edu.gpa ? `<div class="text-slate-600 mt-1">Grade / Qualification: ${escapeHtml(edu.gpa)}</div>` : ''}
                  ${edu.coursework ? `<div class="text-slate-600 mt-0.5">Principal subjects: ${escapeHtml(edu.coursework)}</div>` : ''}
                  ${edu.thesis ? `<div class="text-slate-600 italic mt-0.5">Thesis: ${escapeHtml(edu.thesis)}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Work Experience (Only if present and not fresh graduate) -->
        ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && profile.experience?.length > 0 ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Work Experience
            </div>
            <div class="col-span-8 space-y-5">
              ${profile.experience.map(exp => `
                <div class="break-inside-avoid">
                  <div class="font-semibold text-slate-500 text-[11px]">
                    ${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}
                  </div>
                  <div class="font-bold text-slate-900 text-sm mt-0.5">${escapeHtml(exp.title)}</div>
                  <div class="text-slate-700 italic">${escapeHtml(exp.company)}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
                  
                  ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                    <div class="mt-2 text-slate-700 space-y-1">
                      <div class="font-semibold text-slate-600 text-[11px]">Main activities and responsibilities:</div>
                      <ul class="list-disc list-outside ml-4 space-y-0.5">
                        ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Education and Training (For experienced candidates) -->
        ${!isFreshGraduate && isSectionEnabled(profile, 'education') && profile.education?.length > 0 ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Education & Training
            </div>
            <div class="col-span-8 space-y-4">
              ${profile.education.map(edu => `
                <div class="break-inside-avoid">
                  <div class="font-semibold text-slate-500 text-[11px]">
                    ${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}
                  </div>
                  <div class="font-bold text-slate-900 text-sm mt-0.5">
                    ${formatEducationDegree(edu)}
                  </div>
                  <div class="text-slate-700 italic">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                  ${edu.gpa ? `<div class="text-slate-600 mt-1">Grade / Qualification: ${escapeHtml(edu.gpa)}</div>` : ''}
                  ${edu.thesis ? `<div class="text-slate-600 italic mt-0.5">Thesis: ${escapeHtml(edu.thesis)}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Projects / Key Accomplishments -->
        ${isSectionEnabled(profile, 'projects') && profile.projects?.length > 0 ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Projects & Deliverables
            </div>
            <div class="col-span-8 space-y-3">
              ${profile.projects.map(proj => `
                <div class="break-inside-avoid">
                  <div class="font-bold text-slate-900 text-sm">${escapeHtml(proj.title)}</div>
                  ${proj.description ? `<p class="text-slate-700 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                  ${proj.outcomes ? `<p class="text-slate-600 italic mt-0.5">${escapeHtml(proj.outcomes)}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Personal Skills: European Language Passport (CEFR Grid) -->
        ${isSectionEnabled(profile, 'languages') && profile.languages?.length > 0 ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 break-inside-avoid">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Language Skills
            </div>
            <div class="col-span-8 space-y-3">
              <div>
                <span class="font-bold text-slate-800">Mother tongue(s):</span>
                <span class="text-slate-700 ml-2 font-semibold">${escapeHtml(motherTongue)}</span>
              </div>

              ${otherLanguages.length > 0 ? `
                <div class="mt-2">
                  <div class="font-bold text-slate-800 mb-1.5">Other language(s):</div>
                  <!-- Official CEFR Language Passport Table -->
                  <div class="overflow-x-auto">
                    <table class="w-full border border-slate-300 text-[10px] text-center">
                      <thead class="bg-slate-100 text-slate-700 font-bold">
                        <tr class="border-b border-slate-300">
                          <th class="p-1 border-r border-slate-300 text-left" rowspan="2">Language</th>
                          <th class="p-1 border-r border-slate-300" colspan="2">Understanding</th>
                          <th class="p-1 border-r border-slate-300" colspan="2">Speaking</th>
                          <th class="p-1">Writing</th>
                        </tr>
                        <tr class="border-b border-slate-300 text-[9px] text-slate-600">
                          <th class="p-1 border-r border-slate-200">Listening</th>
                          <th class="p-1 border-r border-slate-300">Reading</th>
                          <th class="p-1 border-r border-slate-200">Spoken Interaction</th>
                          <th class="p-1 border-r border-slate-300">Spoken Production</th>
                          <th class="p-1">Writing</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-200 font-mono font-medium">
                        ${otherLanguages.map(l => {
                          const level = l.cefr || (l.proficiency === 'Fluent' ? 'C1' : l.proficiency === 'Conversational' ? 'B2' : 'A2');
                          return `
                            <tr>
                              <td class="p-1.5 border-r border-slate-300 text-left font-sans font-bold text-slate-800">${escapeHtml(l.name)}</td>
                              <td class="p-1.5 border-r border-slate-200">${level}</td>
                              <td class="p-1.5 border-r border-slate-300">${level}</td>
                              <td class="p-1.5 border-r border-slate-200">${level}</td>
                              <td class="p-1.5 border-r border-slate-300">${level}</td>
                              <td class="p-1.5">${level}</td>
                            </tr>
                          `;
                        }).join('')}
                      </tbody>
                    </table>
                  </div>
                  <div class="text-[9px] text-slate-500 italic mt-1">Levels: A1/A2: Basic user - B1/B2: Independent user - C1/C2: Proficient user (Common European Framework of Reference for Languages)</div>
                </div>
              ` : ''}
            </div>
          </section>
        ` : ''}

        <!-- Skills & Competences -->
        ${isSectionEnabled(profile, 'skills') && allSkills.length > 0 ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 break-inside-avoid">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Skills & Competences
            </div>
            <div class="col-span-8 text-slate-700">
              <div class="flex flex-wrap gap-2 text-xs">
                ${allSkills.map(sk => `
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200">
                    <strong class="font-semibold text-slate-900">${escapeHtml(sk.name)}</strong>
                    ${sk.level ? `<span class="text-[11px] text-slate-500 font-normal">(${escapeHtml(sk.level)})</span>` : ''}
                  </span>
                `).join('')}
              </div>
            </div>
          </section>
        ` : ''}

        <!-- References -->
        ${(profile.references && profile.references.filter(r => r && (r.name || r.title || r.organization || r.email || r.phone)).length > 0) ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 break-inside-avoid">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              References
            </div>
            <div class="col-span-8 text-slate-700">
              <div class="space-y-2">
                ${profile.references.filter(r => r && (r.name || r.title || r.organization || r.email || r.phone)).map(r => `
                  <div>
                    <div class="font-bold text-slate-900">${escapeHtml(r.name)}</div>
                    <div class="text-slate-600">${escapeHtml(r.title || '')}${r.organization ? `, ${escapeHtml(r.organization)}` : ''}</div>
                    ${r.email || r.phone ? `<div class="text-slate-500 text-[11px]">${escapeHtml(r.email || '')} ${r.phone ? `• ${escapeHtml(r.phone)}` : ''}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        ` : ''}

        <!-- Driving Licence -->
        ${p.drivingLicense ? `
          <section class="grid grid-cols-12 gap-4 pb-2 break-inside-avoid">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Driving Licence
            </div>
            <div class="col-span-8 text-slate-700 font-semibold">
              Category: ${escapeHtml(p.drivingLicense)}
            </div>
          </section>
        ` : ''}

      </div>
    </div>
  `;
}

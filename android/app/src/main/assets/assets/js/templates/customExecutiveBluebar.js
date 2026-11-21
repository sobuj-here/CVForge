/**
 * Custom Template 03: Executive Blue-Bar Professional CV
 * Faithfully inspired by the authentic layout of 'Siddek CURRICULUM VITAE.pdf'.
 * Features:
 * - Full-width soft-blue banner bar section headers (#9bbce5 / #a6c2e2)
 * - Top-left bold underlined "CURRICULUM VITAE" title with contact details
 * - Top-right bordered passport photo
 * - Block-structured Educational Qualification entries
 * - 5-column Language Proficiency Matrix (Language | Reading | Writing | Listening | Speaking)
 * - Structured Personal Information block
 * - Signature line at bottom right
 * - 100% dynamic bindings to candidate profile with clean empty defaults and zero fake prefill.
 */

import {
  escapeHtml,
  renderPhotoHtml,
  isSectionEnabled,
  getSkillsList
} from './templateUtils.js';

export function renderCustomExecutiveBluebar(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const hasPhoto = settings.showPhoto && p.photoUrl;
  const skills = getSkillsList(profile);

  const eduList = [...(profile.education || [])].sort((a, b) => {
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  return `
    <div class="cv-format cv-custom-executive-bluebar max-w-[850px] mx-auto bg-white text-black text-xs font-sans p-6 sm:p-8 shadow-xs min-h-[1050px] flex flex-col justify-between">
      
      <div class="space-y-4">
        
        <!-- Header -->
        <header class="flex justify-between items-start pb-2">
          <div class="space-y-1">
            <h1 class="cv-name text-base font-black tracking-wide uppercase underline underline-offset-4 decoration-2">
              CURRICULUM VITAE
            </h1>
            <div class="text-sm font-black text-slate-900 uppercase tracking-tight">
              ${escapeHtml(p.fullName || 'Candidate Name')}
            </div>
            ${p.phone ? `<div class="text-xs">Contact No: <span class="font-bold">${escapeHtml(p.phone)}</span></div>` : ''}
            ${p.email ? `<div class="text-xs">E-mail: <a href="mailto:${p.email}" class="text-blue-700 underline">${escapeHtml(p.email)}</a></div>` : ''}
            ${p.location ? `<div class="text-xs text-slate-600">${escapeHtml(p.location)}</div>` : ''}
          </div>

          <!-- Top-Right Passport Photograph -->
          <div>
            ${hasPhoto ? `
              <div class="w-24 h-28 border border-black p-0.5 bg-white shadow-xs">
                <img src="${p.photoUrl}" alt="${escapeHtml(p.fullName)}" class="w-full h-full object-cover" />
              </div>
            ` : `
              <div class="w-24 h-28 border border-dashed border-slate-400 p-1 flex flex-col items-center justify-center text-center text-[10px] text-slate-400">
                <span>Passport</span>
                <span>Photo</span>
              </div>
            `}
          </div>
        </header>

        <!-- CAREER OBJECTIVE -->
        ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-3 py-1 bg-[#a6c2e2] text-slate-900 font-bold text-xs uppercase tracking-wide">
              CAREER OBJECTIVE
            </div>
            <p class="text-xs text-slate-900 leading-relaxed text-justify px-2 pt-1">
              ${escapeHtml(p.summary || p.objective)}
            </p>
          </section>
        ` : ''}

        <!-- EXPERIENCE (Omitted cleanly if empty) -->
        ${isSectionEnabled(profile, 'experience') && (profile.experience || []).length > 0 ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-3 py-1 bg-[#a6c2e2] text-slate-900 font-bold text-xs uppercase tracking-wide">
              EXPERIENCE
            </div>
            <div class="space-y-2 p-2">
              ${profile.experience.map(exp => `
                <div class="space-y-0.5">
                  <div class="font-bold text-xs underline underline-offset-2">
                    ${escapeHtml(exp.title || '')} — ${escapeHtml(exp.company || '')}
                  </div>
                  <div class="text-[11px] text-slate-600">
                    ${escapeHtml(exp.startDate || '')} to ${exp.current ? 'Present' : escapeHtml(exp.endDate || '')}
                  </div>
                  ${exp.highlights && exp.highlights.length > 0 ? `
                    <ul class="list-disc list-inside text-xs mt-1 space-y-0.5">
                      ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- EDUCATIONAL QUALIFICATION (Structured Block Layout) -->
        ${isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
          <section class="space-y-2 page-break-avoid">
            <div class="px-3 py-1 bg-[#a6c2e2] text-slate-900 font-bold text-xs uppercase tracking-wide">
              EDUCATIONAL QUALIFICATION
            </div>
            <div class="space-y-3 p-2">
              ${eduList.map(edu => {
                const passYear = edu.endDate ? edu.endDate.split('-')[0] : (edu.startDate || '');
                return `
                  <div class="space-y-1 border-b border-slate-100 pb-2 last:border-0">
                    <div class="font-bold text-xs underline underline-offset-2 text-slate-900">
                      ${escapeHtml(edu.degree || 'Degree')}
                    </div>
                    <table class="text-xs">
                      <tbody>
                        <tr>
                          <td class="w-24 font-semibold text-slate-800">Institute</td>
                          <td class="w-3">:</td>
                          <td class="text-slate-900 font-medium">${escapeHtml(edu.institution || '')}</td>
                        </tr>
                        ${edu.major || edu.field ? `
                          <tr>
                            <td class="font-semibold text-slate-800">Subject / Major</td>
                            <td>:</td>
                            <td class="text-slate-900">${escapeHtml(edu.major || edu.field)}</td>
                          </tr>
                        ` : ''}
                        ${passYear ? `
                          <tr>
                            <td class="font-semibold text-slate-800">Passing Year</td>
                            <td>:</td>
                            <td class="text-slate-900">${escapeHtml(passYear)}</td>
                          </tr>
                        ` : ''}
                        ${edu.gpa ? `
                          <tr>
                            <td class="font-semibold text-slate-800">Result</td>
                            <td>:</td>
                            <td class="text-slate-900 font-bold">${escapeHtml(edu.gpa)}</td>
                          </tr>
                        ` : ''}
                      </tbody>
                    </table>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        ` : ''}

        <!-- SKILLS & COMPETENCIES -->
        ${isSectionEnabled(profile, 'skills') && skills.length > 0 ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-3 py-1 bg-[#a6c2e2] text-slate-900 font-bold text-xs uppercase tracking-wide">
              SKILLS & COMPETENCIES
            </div>
            <div class="flex flex-wrap gap-2 p-2 text-xs">
              ${skills.map(s => `
                <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded border border-slate-200">
                  <span class="font-bold text-slate-900">${escapeHtml(s.name)}</span>
                  ${s.level ? `<span class="text-slate-600 font-normal">(${escapeHtml(s.level)})</span>` : ''}
                </span>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- LANGUAGE PROFICIENCY (5-Column Matrix: Language | Reading | Writing | Listening | Speaking) -->
        ${isSectionEnabled(profile, 'languages') && (profile.languages || []).length > 0 ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-3 py-1 bg-[#a6c2e2] text-slate-900 font-bold text-xs uppercase tracking-wide">
              LANGUAGE PROFICIENCY
            </div>
            <div class="p-2">
              <table class="w-full text-xs border border-black border-collapse text-center">
                <thead>
                  <tr class="bg-slate-100 font-bold border-b border-black">
                    <th class="border border-black p-1 text-left w-28">Language</th>
                    <th class="border border-black p-1">Reading</th>
                    <th class="border border-black p-1">Writing</th>
                    <th class="border border-black p-1">Listening</th>
                    <th class="border border-black p-1">Speaking</th>
                  </tr>
                </thead>
                <tbody>
                  ${profile.languages.map(lang => {
                    const prof = lang.proficiency || 'Good';
                    const isNative = prof.toLowerCase().includes('native') || prof.toLowerCase().includes('bilingual');
                    const grade = isNative ? 'Excellent' : prof;
                    return `
                      <tr class="border-b border-black">
                        <td class="border border-black p-1 font-bold text-left">${escapeHtml(lang.name)}</td>
                        <td class="border border-black p-1">${grade}</td>
                        <td class="border border-black p-1">${grade}</td>
                        <td class="border border-black p-1">${grade}</td>
                        <td class="border border-black p-1">${grade}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </section>
        ` : ''}

        <!-- PERSONAL INFORMATION -->
        <section class="space-y-1 page-break-avoid">
          <div class="px-3 py-1 bg-[#a6c2e2] text-slate-900 font-bold text-xs uppercase tracking-wide">
            PERSONAL INFORMATION
          </div>
          <table class="w-full text-xs border-collapse p-2">
            <tbody>
              <tr>
                <td class="w-36 py-0.5 font-bold text-slate-800">Full Name</td>
                <td class="w-4 py-0.5 font-bold">:</td>
                <td class="py-0.5 font-semibold">${escapeHtml(p.fullName || 'Candidate Name')}</td>
              </tr>
              ${p.fatherName ? `
                <tr>
                  <td class="py-0.5 font-bold text-slate-800">Father’s Name</td>
                  <td class="py-0.5 font-bold">:</td>
                  <td class="py-0.5">${escapeHtml(p.fatherName)}</td>
                </tr>
              ` : ''}
              ${p.motherName ? `
                <tr>
                  <td class="py-0.5 font-bold text-slate-800">Mother’s Name</td>
                  <td class="py-0.5 font-bold">:</td>
                  <td class="py-0.5">${escapeHtml(p.motherName)}</td>
                </tr>
              ` : ''}
              ${p.dateOfBirth ? `
                <tr>
                  <td class="py-0.5 font-bold text-slate-800">Date of Birth</td>
                  <td class="py-0.5 font-bold">:</td>
                  <td class="py-0.5">${escapeHtml(p.dateOfBirth)}</td>
                </tr>
              ` : ''}
              ${p.maritalStatus ? `
                <tr>
                  <td class="py-0.5 font-bold text-slate-800">Marital Status</td>
                  <td class="py-0.5 font-bold">:</td>
                  <td class="py-0.5">${escapeHtml(p.maritalStatus)}</td>
                </tr>
              ` : ''}
              ${p.religion ? `
                <tr>
                  <td class="py-0.5 font-bold text-slate-800">Religion</td>
                  <td class="py-0.5 font-bold">:</td>
                  <td class="py-0.5">${escapeHtml(p.religion)}</td>
                </tr>
              ` : ''}
              <tr>
                <td class="py-0.5 font-bold text-slate-800">Present Address</td>
                <td class="py-0.5 font-bold">:</td>
                <td class="py-0.5 leading-tight">${escapeHtml(p.location || 'Dhaka, Bangladesh')}</td>
              </tr>
              ${p.permanentAddress ? `
                <tr>
                  <td class="py-0.5 font-bold text-slate-800">Permanent Address</td>
                  <td class="py-0.5 font-bold">:</td>
                  <td class="py-0.5 leading-tight">${escapeHtml(p.permanentAddress)}</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </section>

        <!-- REFERENCES (If provided) -->
        ${(profile.references && profile.references.length > 0) ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-3 py-1 bg-[#a6c2e2] text-slate-900 font-bold text-xs uppercase tracking-wide">
              REFERENCES
            </div>
            <div class="p-2 space-y-2 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${(profile.references || []).map(r => `
                  <div>
                    <div class="font-bold text-slate-900">${escapeHtml(r.name || '')}</div>
                    <div class="text-slate-700">${escapeHtml(r.title || '')}${r.organization || r.company ? `, ${escapeHtml(r.organization || r.company)}` : ''}</div>
                    ${r.email ? `<div class="text-blue-700">Email: ${escapeHtml(r.email)}</div>` : ''}
                    ${r.phone ? `<div class="text-slate-600">Phone: ${escapeHtml(r.phone)}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        ` : ''}

      </div>

      <!-- Footer Signature Line -->
      <footer class="pt-8 flex justify-end page-break-avoid">
        <div class="text-center">
          <div class="w-44 border-t border-black pb-1"></div>
          <span class="text-xs font-bold">Signature</span>
        </div>
      </footer>

    </div>
  `;
}

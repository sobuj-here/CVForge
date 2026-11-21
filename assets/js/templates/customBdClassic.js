/**
 * Custom Template 02: Standard Bangladesh Classic CV
 * Faithfully inspired by the authentic layout of 'CV.pdf'.
 * Features:
 * - Traditional Bangladesh corporate & institutional standard layout
 * - Outer page box border
 * - Centered underlined "Curriculum Vitae" header
 * - Top-right boxed passport-style candidate photograph
 * - Aligned "PERSONAL DETAILS" block with colon alignment (:)
 * - Distinctive soft green banner header for "Education Qualification :"
 * - Formal 5-column Education Table: Degrees | Group/Major | Boards/University | Pass. Year | Result(GPA)
 * - "Extra Qualification / Skills :" section with bullet points
 * - Formal truth declaration with Date on left and Signature line on right.
 * - 100% dynamic bindings to candidate profile with clean empty defaults and zero fake prefill.
 */

import {
  escapeHtml,
  renderPhotoHtml,
  isSectionEnabled,
  getSkillsList
} from './templateUtils.js';

export function renderCustomBdClassic(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const hasPhoto = settings.showPhoto && p.photoUrl;
  const skills = getSkillsList(profile);

  // Extract education sorted chronologically (as traditional in BD CVs: SSC, HSC, Degree)
  const eduList = [...(profile.education || [])].sort((a, b) => {
    return (a.endDate || a.startDate || '').localeCompare(b.endDate || b.startDate || '');
  });

  const languagesKnown = (profile.languages || []).map(l => l.name).join(', ') || 'Bangla, English';

  return `
    <div class="cv-format cv-custom-bd-classic max-w-[850px] mx-auto bg-white text-black text-xs font-sans p-6 sm:p-8 shadow-xs border-2 border-black min-h-[1050px] flex flex-col justify-between">
      
      <div class="space-y-4">
        
        <!-- Header: Centered Curriculum Vitae with Top-Right Photo -->
        <header class="relative pt-2 pb-4">
          <div class="text-center">
            <h1 class="cv-name text-lg font-black tracking-wide uppercase underline underline-offset-4 decoration-2">
              Curriculum Vitae
            </h1>
          </div>

          <!-- Top-Right Passport Photograph (Strictly optional, respects showPhoto setting) -->
          <div class="absolute top-0 right-0">
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

        <!-- PERSONAL DETAILS (Colon-aligned structured block) -->
        <section class="space-y-1.5 pt-1 pr-28">
          <h2 class="text-xs font-bold uppercase tracking-wide text-black underline underline-offset-2 mb-2">
            PERSONAL DETAILS
          </h2>

          <table class="w-full text-xs border-collapse">
            <tbody>
              <tr>
                <td class="w-36 py-0.5 font-bold text-black align-top">Name</td>
                <td class="w-4 py-0.5 font-bold align-top">:</td>
                <td class="py-0.5 text-black font-semibold align-top">${escapeHtml(p.fullName || 'Candidate Name')}</td>
              </tr>
              ${p.headline ? `
                <tr>
                  <td class="py-0.5 font-bold text-black align-top">Designation / Role</td>
                  <td class="py-0.5 font-bold align-top">:</td>
                  <td class="py-0.5 text-black align-top">${escapeHtml(p.headline)}</td>
                </tr>
              ` : ''}
              ${p.fatherName ? `
                <tr>
                  <td class="py-0.5 font-bold text-black align-top">Father’s Name</td>
                  <td class="py-0.5 font-bold align-top">:</td>
                  <td class="py-0.5 text-black align-top">${escapeHtml(p.fatherName)}</td>
                </tr>
              ` : ''}
              ${p.motherName ? `
                <tr>
                  <td class="py-0.5 font-bold text-black align-top">Mother’s Name</td>
                  <td class="py-0.5 font-bold align-top">:</td>
                  <td class="py-0.5 text-black align-top">${escapeHtml(p.motherName)}</td>
                </tr>
              ` : ''}
              ${p.permanentAddress ? `
                <tr>
                  <td class="py-0.5 font-bold text-black align-top">Permanent address</td>
                  <td class="py-0.5 font-bold align-top">:</td>
                  <td class="py-0.5 text-black align-top leading-tight">${escapeHtml(p.permanentAddress)}</td>
                </tr>
              ` : ''}
              <tr>
                <td class="py-0.5 font-bold text-black align-top">Present Address</td>
                <td class="py-0.5 font-bold align-top">:</td>
                <td class="py-0.5 text-black align-top leading-tight">${escapeHtml(p.location || 'Dhaka, Bangladesh')}</td>
              </tr>
              ${p.dateOfBirth ? `
                <tr>
                  <td class="py-0.5 font-bold text-black align-top">Date of Birth</td>
                  <td class="py-0.5 font-bold align-top">:</td>
                  <td class="py-0.5 text-black align-top">${escapeHtml(p.dateOfBirth)}</td>
                </tr>
              ` : ''}
              ${p.gender ? `
                <tr>
                  <td class="py-0.5 font-bold text-black align-top">Gender / Sex</td>
                  <td class="py-0.5 font-bold align-top">:</td>
                  <td class="py-0.5 text-black align-top">${escapeHtml(p.gender)}</td>
                </tr>
              ` : ''}
              ${p.religion ? `
                <tr>
                  <td class="py-0.5 font-bold text-black align-top">Religion</td>
                  <td class="py-0.5 font-bold align-top">:</td>
                  <td class="py-0.5 text-black align-top">${escapeHtml(p.religion)}</td>
                </tr>
              ` : ''}
              ${p.maritalStatus ? `
                <tr>
                  <td class="py-0.5 font-bold text-black align-top">Marital Status</td>
                  <td class="py-0.5 font-bold align-top">:</td>
                  <td class="py-0.5 text-black align-top">${escapeHtml(p.maritalStatus)}</td>
                </tr>
              ` : ''}
              <tr>
                <td class="py-0.5 font-bold text-black align-top">Nationality</td>
                <td class="py-0.5 font-bold align-top">:</td>
                <td class="py-0.5 text-black align-top">${escapeHtml(p.nationality || 'Bangladeshi')}</td>
              </tr>
              <tr>
                <td class="py-0.5 font-bold text-black align-top">Language Known</td>
                <td class="py-0.5 font-bold align-top">:</td>
                <td class="py-0.5 text-black align-top">${escapeHtml(languagesKnown)}</td>
              </tr>
              <tr>
                <td class="py-0.5 font-bold text-black align-top">Mobile Number</td>
                <td class="py-0.5 font-bold align-top">:</td>
                <td class="py-0.5 text-black font-bold align-top">${escapeHtml(p.phone || '+880')}</td>
              </tr>
              <tr>
                <td class="py-0.5 font-bold text-black align-top">Email ID</td>
                <td class="py-0.5 font-bold align-top">:</td>
                <td class="py-0.5 text-blue-800 underline align-top">${escapeHtml(p.email || 'email@example.com')}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- Career Objective (If provided) -->
        ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-2.5 py-1 bg-[#8dbf7b] text-black font-bold text-xs uppercase tracking-wide">
              Career Objective :
            </div>
            <p class="text-xs text-black leading-relaxed text-justify px-1 pt-1">
              ${escapeHtml(p.summary || p.objective)}
            </p>
          </section>
        ` : ''}

        <!-- Educational Qualification (Classic 5-Column Table with Soft Green Header Bar) -->
        ${isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-2.5 py-1 bg-[#8dbf7b] text-black font-bold text-xs uppercase tracking-wide">
              Education Qualification :
            </div>
            <table class="w-full text-xs border border-black border-collapse text-center">
              <thead>
                <tr class="bg-slate-100 font-bold border-b border-black">
                  <th class="border border-black p-1 text-left">Degrees</th>
                  <th class="border border-black p-1 text-left">Group / Major</th>
                  <th class="border border-black p-1 text-left">Boards / University</th>
                  <th class="border border-black p-1 w-20">Pass. Year</th>
                  <th class="border border-black p-1 w-24">Result (GPA)</th>
                </tr>
              </thead>
              <tbody>
                ${eduList.map(edu => {
                  const passYear = edu.endDate ? edu.endDate.split('-')[0] : (edu.startDate || '');
                  return `
                    <tr class="border-b border-black">
                      <td class="border border-black p-1 font-bold text-left">${escapeHtml(edu.degree || 'Degree')}</td>
                      <td class="border border-black p-1 text-left">${escapeHtml(edu.major || edu.field || 'General')}</td>
                      <td class="border border-black p-1 text-left">${escapeHtml(edu.institution || '')}</td>
                      <td class="border border-black p-1 font-mono">${escapeHtml(passYear)}</td>
                      <td class="border border-black p-1 font-bold">${escapeHtml(edu.gpa || 'Appeared')}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </section>
        ` : ''}

        <!-- Work Experience (if present) -->
        ${isSectionEnabled(profile, 'experience') && (profile.experience || []).length > 0 ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-2.5 py-1 bg-[#8dbf7b] text-black font-bold text-xs uppercase tracking-wide">
              Experience :
            </div>
            <div class="space-y-2 p-1">
              ${profile.experience.map(exp => `
                <div>
                  <div class="font-bold text-xs">${escapeHtml(exp.title || '')} — ${escapeHtml(exp.company || '')}</div>
                  <div class="text-[11px] text-slate-700">${escapeHtml(exp.startDate || '')} to ${exp.current ? 'Present' : escapeHtml(exp.endDate || '')}</div>
                  ${exp.highlights && exp.highlights.length > 0 ? `
                    <ul class="list-disc list-inside text-xs mt-0.5 space-y-0.5">
                      ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Extra Qualification / Skills -->
        ${isSectionEnabled(profile, 'skills') && skills.length > 0 ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-2.5 py-1 bg-[#8dbf7b] text-black font-bold text-xs uppercase tracking-wide">
              Extra Qualification / Skills :
            </div>
            <ul class="list-disc list-inside p-1 text-xs text-black space-y-0.5">
              ${skills.map(s => `
                <li>
                  <span class="font-medium">${escapeHtml(s.name)}</span>
                  ${s.level ? `<span class="text-slate-600 font-normal"> (${escapeHtml(s.level)})</span>` : ''}
                </li>
              `).join('')}
            </ul>
          </section>
        ` : ''}

        <!-- Key Projects / Capstones -->
        ${isSectionEnabled(profile, 'projects') && (profile.projects || []).length > 0 ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-2.5 py-1 bg-[#8dbf7b] text-black font-bold text-xs uppercase tracking-wide">
              Key Projects & Capstones :
            </div>
            <div class="p-1 space-y-2">
              ${profile.projects.map(proj => `
                <div>
                  <div class="font-bold text-xs">${escapeHtml(proj.title || '')}</div>
                  ${proj.description ? `<p class="text-xs text-black">${escapeHtml(proj.description)}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- References (If provided) -->
        ${(profile.references && profile.references.length > 0) ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-2.5 py-1 bg-[#8dbf7b] text-black font-bold text-xs uppercase tracking-wide">
              References :
            </div>
            <div class="p-1 space-y-2">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                ${(profile.references || []).map(r => `
                  <div>
                    <div class="font-bold">${escapeHtml(r.name || '')}</div>
                    <div>${escapeHtml(r.title || '')}${r.organization || r.company ? `, ${escapeHtml(r.organization || r.company)}` : ''}</div>
                    ${r.email ? `<div>Email: ${escapeHtml(r.email)}</div>` : ''}
                    ${r.phone ? `<div>Phone: ${escapeHtml(r.phone)}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        ` : ''}

      </div>

      <!-- Formal Declaration & Sign-off Line -->
      <footer class="pt-6 space-y-8 page-break-avoid">
        <div>
          <span class="font-bold underline text-xs">Declaration</span> :
          <p class="text-xs text-black mt-1 leading-relaxed">
            The above information is true and correct to the best of my knowledge and belief.
          </p>
        </div>

        <div class="flex justify-between items-end text-xs font-semibold pt-4">
          <div>
            <span>Date: .........................</span>
          </div>
          <div class="text-center">
            <div class="w-36 border-t border-black pb-0.5"></div>
            <span>Signature</span>
          </div>
        </div>
      </footer>

    </div>
  `;
}

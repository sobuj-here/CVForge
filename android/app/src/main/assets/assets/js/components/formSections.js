/**
 * CVForge - Dynamic Form Sections Component (Clarity & Precision Enhanced)
 * Provides beginner-friendly, structured input sections with clear explanations,
 * realistic non-exaggerated examples, required/optional indicators,
 * 6-category skill taxonomy, fresh-graduate mode, and clean blank starting states.
 */

import { appState } from '../models/state.js';
import { generateSummaries } from '../engine/summaryEngine.js';
import { openPhotoCropModal } from './photoCropModal.js';

export function renderFormSections(containerId = 'form-sections-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const profile = appState.getProfile();
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const enabled = profile.enabledSections || {};

  // Unified skills list
  const skillsList = Array.isArray(profile.skills) ? profile.skills : [];

  // Detect duplicate skill entries in the unified skills list
  const allSkillNames = skillsList.map(s => s.name?.trim().toLowerCase()).filter(Boolean);
  const seenSkillsSet = new Set();
  const duplicateSkillsSet = new Set();
  for (const name of allSkillNames) {
    if (seenSkillsSet.has(name)) {
      duplicateSkillsSet.add(name);
    } else {
      seenSkillsSet.add(name);
    }
  }
  const duplicateCount = duplicateSkillsSet.size;

  container.innerHTML = `
    <!-- Sticky Quick Section Jump Navigation -->
    <div class="sticky top-0 z-10 bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-xs py-2 mb-3 border-b border-slate-200 dark:border-slate-800 -mx-4 px-4 overflow-x-auto flex gap-1.5 scrollbar-none">
      <a href="#sec-personal" class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500 whitespace-nowrap transition">Personal</a>
      <a href="#sec-summary" class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500 whitespace-nowrap transition">Summary</a>
      <a href="#sec-experience" class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500 whitespace-nowrap transition">Experience (${(profile.experience || []).length})</a>
      <a href="#sec-education" class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500 whitespace-nowrap transition">Education (${(profile.education || []).length})</a>
      <a href="#sec-skills" class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500 whitespace-nowrap transition">Skills</a>
      <a href="#sec-projects" class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500 whitespace-nowrap transition">Projects (${(profile.projects || []).length})</a>
      <a href="#sec-certs" class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500 whitespace-nowrap transition">Certs (${(profile.certifications || []).length})</a>
      <a href="#sec-languages" class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500 whitespace-nowrap transition">Languages</a>
      <a href="#sec-optional-manager" class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap transition">Optional Sections</a>
    </div>

    <div class="space-y-4 text-xs">
      
      <!-- Section 1: Personal & Contact Information -->
      <div id="sec-personal" class="form-accordion bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition">
        <button type="button" class="accordion-toggle w-full px-5 py-3.5 flex items-center justify-between text-left font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-black">1</span>
            <div>
              <div class="text-sm font-bold flex items-center gap-1.5">
                <span>Personal & Contact Information</span>
                <span class="text-[10px] text-red-500 font-bold">* Core</span>
              </div>
              <div class="text-[11px] text-slate-500 font-normal">Legal name, contact details, optional headline, and photo</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="btn-reset-section px-2 py-0.5 text-[10px] text-slate-400 hover:text-red-500 font-semibold rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer" data-section="personal" data-section-name="Personal Information" title="Reset personal information to blank">
              <i data-lucide="rotate-ccw" class="w-3 h-3"></i><span>Reset</span>
            </span>
            <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform"></i>
          </div>
        </button>
        <div class="accordion-content p-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
          
          <!-- Headshot Photo Formatting Card -->
          <div class="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col sm:flex-row items-center gap-4">
            <div class="relative w-16 h-16 shrink-0 bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-xs ${settings.photoShape === 'circle' ? 'rounded-full' : 'rounded-xl'} flex items-center justify-center">
              ${p.photoUrl ? `
                <img src="${p.photoUrl}" alt="Profile Thumbnail" class="w-full h-full object-cover" />
              ` : `
                <i data-lucide="user" class="w-8 h-8 text-slate-400"></i>
              `}
            </div>
            <div class="flex-1 text-center sm:text-left space-y-1">
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button type="button" id="btn-trigger-crop-modal" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition inline-flex items-center gap-1.5">
                  <i data-lucide="camera" class="w-3.5 h-3.5"></i>
                  <span>${p.photoUrl ? 'Edit / Re-crop Headshot' : 'Upload Headshot Photo'}</span>
                </button>
                ${p.photoUrl ? `
                  <button type="button" id="btn-remove-photo-direct" class="px-2.5 py-1.5 text-xs text-red-500 hover:text-red-700 font-bold hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition">
                    Remove Photo
                  </button>
                ` : ''}
              </div>
              <div class="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <label class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" id="chk-show-photo" class="rounded text-blue-600 focus:ring-blue-500" ${settings.showPhoto ? 'checked' : ''} />
                  <span>Show photo on CV formats</span>
                </label>
              </div>
              <p class="text-[10px] text-slate-500">
                * Note: Photos are standard in Germany, France, and Europass; typically omitted in US, UK, and Canada applications to prevent hiring bias.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Legal Name <span class="text-red-500 font-bold">*</span>
              </label>
              <input type="text" id="inp-full-name" value="${p.fullName || ''}" class="form-input w-full text-xs rounded-lg border ${!p.fullName ? 'border-amber-400 bg-amber-50/20' : 'border-slate-300 dark:border-slate-700'} dark:bg-slate-800 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Eleanor Vance" />
              ${!p.fullName ? `<span class="text-[10px] text-amber-600 mt-0.5 block">Full name is required on all CV formats.</span>` : ''}
            </div>

            <!-- Professional Headline (STRICTLY OPTIONAL) -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="inp-headline" class="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Professional Job Headline <span class="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </label>
              </div>
              <input type="text" id="inp-headline" value="${p.headline || ''}" class="form-input w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Mathematics Graduate, Junior Data Analyst, Administrative Assistant" />
              <p class="text-[10px] text-slate-400 mt-0.5">
                A brief 2–5 word summary of your professional identity or target role. Leave blank if preferred.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address <span class="text-red-500 font-bold">*</span>
              </label>
              <input type="email" id="inp-email" value="${p.email || ''}" class="form-input w-full text-xs rounded-lg border ${p.email && !p.email.includes('@') ? 'border-red-500 bg-red-50/30' : 'border-slate-300 dark:border-slate-700'} dark:bg-slate-800 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. name@example.com" />
              ${p.email && !p.email.includes('@') ? `<span class="text-[10px] text-red-500 mt-0.5 block">Please enter a valid email address.</span>` : ''}
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number <span class="text-red-500 font-bold">*</span>
              </label>
              <input type="tel" id="inp-phone" value="${p.phone || ''}" class="form-input w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. +1 (415) 555-0142" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location (City, Country) <span class="text-red-500 font-bold">*</span>
              </label>
              <input type="text" id="inp-location" value="${p.location || ''}" class="form-input w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Austin, TX, USA or London, UK" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn Profile (Optional)</label>
              <input type="url" id="inp-linkedin" value="${p.linkedin || ''}" class="form-input w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2" placeholder="https://linkedin.com/in/username" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub / Code Repository (Optional)</label>
              <input type="url" id="inp-github" value="${p.github || ''}" class="form-input w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2" placeholder="https://github.com/username" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Portfolio / Personal Website (Optional)</label>
              <input type="url" id="inp-website" value="${p.website || ''}" class="form-input w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2" placeholder="https://myportfolio.com" />
            </div>
          </div>

          <!-- Optional International & Regional Demographic Fields (Bangladesh, Germany, Europass & Asia) -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Optional International & Regional Fields</span>
              <span class="text-[10px] text-slate-400 font-normal">Relevant for Bangladesh, Germany, Europass & Asia; leave blank for US/UK</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label class="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Nationality</label>
                <input type="text" id="inp-nationality" value="${p.nationality || ''}" class="form-input w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5" placeholder="e.g. Bangladeshi, British, German" />
              </div>
              <div>
                <label class="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Date of Birth</label>
                <input type="text" id="inp-dob" value="${p.dateOfBirth || ''}" class="form-input w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5" placeholder="DD/MM/YYYY or YYYY-MM-DD" />
              </div>
              <div>
                <label class="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Driving Licence</label>
                <input type="text" id="inp-license" value="${p.drivingLicense || ''}" class="form-input w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5" placeholder="e.g. Clean Driver License" />
              </div>
            </div>

            <!-- South Asian / Bangladesh Standard Family & Background Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div>
                <label class="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Father's Name (Optional)</label>
                <input type="text" id="inp-father-name" value="${p.fatherName || ''}" class="form-input w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5" placeholder="e.g. Md. Rafiqul Islam" />
              </div>
              <div>
                <label class="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Mother's Name (Optional)</label>
                <input type="text" id="inp-mother-name" value="${p.motherName || ''}" class="form-input w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5" placeholder="e.g. Begum Rokeya" />
              </div>
              <div>
                <label class="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Religion (Optional)</label>
                <input type="text" id="inp-religion" value="${p.religion || ''}" class="form-input w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5" placeholder="e.g. Islam, Hinduism, Christianity" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div>
                <label class="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Marital Status (Optional)</label>
                <select id="inp-marital-status" class="form-input w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5">
                  <option value="">Select (Optional)...</option>
                  <option value="Single" ${p.maritalStatus === 'Single' ? 'selected' : ''}>Single</option>
                  <option value="Married" ${p.maritalStatus === 'Married' ? 'selected' : ''}>Married</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Gender (Optional)</label>
                <select id="inp-gender" class="form-input w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5">
                  <option value="">Select (Optional)...</option>
                  <option value="Male" ${p.gender === 'Male' ? 'selected' : ''}>Male</option>
                  <option value="Female" ${p.gender === 'Female' ? 'selected' : ''}>Female</option>
                  <option value="Other" ${p.gender === 'Other' ? 'selected' : ''}>Other</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Permanent Address (Optional)</label>
                <input type="text" id="inp-permanent-address" value="${p.permanentAddress || ''}" class="form-input w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5" placeholder="e.g. Vill: Joypur, P.O: Chandpur" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Professional Summary & Objective -->
      <div id="sec-summary" class="form-accordion bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <button type="button" class="accordion-toggle w-full px-5 py-3.5 flex items-center justify-between text-left font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black">2</span>
            <div>
              <div class="text-sm font-bold">Professional Summary & Career Objective</div>
              <div class="text-[11px] text-slate-500 font-normal">3-5 sentence introduction tailored to your target job</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="btn-reset-section px-2 py-0.5 text-[10px] text-slate-400 hover:text-red-500 font-semibold rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer" data-section="summary" data-section-name="Summary & Objective" title="Reset summary to blank">
              <i data-lucide="rotate-ccw" class="w-3 h-3"></i><span>Reset</span>
            </span>
            <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform"></i>
          </div>
        </button>
        <div class="accordion-content p-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
          
          <div class="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-lg text-[11px] text-indigo-900 dark:text-indigo-200 leading-normal">
            <strong>Guidance:</strong> A <em>Professional Summary</em> highlights your concrete accomplishments and operational scope (ideal for experienced professionals). A <em>Career Objective</em> emphasizes academic foundations, core analytical skills, and learning readiness (recommended for fresh graduates).
          </div>

          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Summary or Career Objective Statement</label>
            <button type="button" id="btn-smart-summary" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-800 transition">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
              Factual Summary Suggestions
            </button>
          </div>
          <textarea id="inp-summary" rows="4" class="form-input w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white p-3 leading-relaxed focus:ring-2 focus:ring-indigo-500" placeholder="Summarize your professional identity, relevant experience or academic training, core competencies, and practical career focus...">${p.summary || ''}</textarea>
          
          <div id="smart-summary-box" class="hidden p-3 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-lg space-y-2">
            <div class="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center justify-between">
              <span>Suggested professional summary drafts based on your profile:</span>
              <button type="button" id="btn-close-smart-summary" class="text-slate-400 hover:text-slate-600 text-xs">✕ Close</button>
            </div>
            <div id="smart-summary-options" class="space-y-2 text-xs"></div>
          </div>
        </div>
      </div>

      <!-- Section 3: Work Experience -->
      <div id="sec-experience" class="form-accordion bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <button type="button" class="accordion-toggle w-full px-5 py-3.5 flex items-center justify-between text-left font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-black">3</span>
            <div>
              <div class="text-sm font-bold flex items-center gap-2">
                <span>Work Experience</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${profile.isFreshGraduate ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
                  ${profile.isFreshGraduate ? 'Fresh Graduate Mode' : `${(profile.experience || []).length} positions`}
                </span>
              </div>
              <div class="text-[11px] text-slate-500 font-normal">Job titles, companies, employment types, locations, and responsibilities</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="btn-reset-section px-2 py-0.5 text-[10px] text-slate-400 hover:text-red-500 font-semibold rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer" data-section="experience" data-section-name="Work Experience" title="Reset work experience to empty">
              <i data-lucide="rotate-ccw" class="w-3 h-3"></i><span>Reset</span>
            </span>
            <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform"></i>
          </div>
        </button>
        <div class="accordion-content p-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
          
          <!-- Fresh Graduate / No Work Experience Toggle -->
          <div class="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 rounded-xl space-y-1.5">
            <label class="flex items-center gap-2 cursor-pointer font-bold text-emerald-950 dark:text-emerald-200 text-xs">
              <input type="checkbox" id="chk-fresh-graduate" ${profile.isFreshGraduate ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer" />
              <span>I am a Fresh Graduate / I have no formal work experience</span>
            </label>
            <p class="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed pl-6">
              When checked, the Work Experience section is automatically omitted from your final CV, prioritizing your Education, Projects, and Skills.
            </p>
          </div>

          ${profile.isFreshGraduate ? `
            <div class="text-xs text-slate-500 italic p-3 text-center border border-dashed border-emerald-300 dark:border-emerald-800 rounded-xl bg-emerald-50/30">
              Fresh graduate mode is active. You can still add internships or student projects in the dedicated sections below.
            </div>
          ` : `
            <div id="experience-items-list" class="space-y-4">
              ${renderExperienceList(profile.experience || [])}
            </div>
            <button type="button" id="btn-add-experience" class="w-full py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition">
              <i data-lucide="plus" class="w-4 h-4"></i> Add Work Experience Entry
            </button>
          `}
        </div>
      </div>

      <!-- Section 4: Education -->
      <div id="sec-education" class="form-accordion bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <button type="button" class="accordion-toggle w-full px-5 py-3.5 flex items-center justify-between text-left font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-black">4</span>
            <div>
              <div class="text-sm font-bold flex items-center gap-2">
                <span>Education & Academic Credentials</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${(profile.education || []).length} credentials</span>
              </div>
              <div class="text-[11px] text-slate-500 font-normal">Degree title, subject/major, institution, dates, and coursework</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="btn-reset-section px-2 py-0.5 text-[10px] text-slate-400 hover:text-red-500 font-semibold rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer" data-section="education" data-section-name="Education" title="Reset education to empty">
              <i data-lucide="rotate-ccw" class="w-3 h-3"></i><span>Reset</span>
            </span>
            <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform"></i>
          </div>
        </button>
        <div class="accordion-content p-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
          
          <!-- Degree vs Subject Guidance Box -->
          <div class="p-3 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-[11px] text-amber-900 dark:text-amber-200 leading-normal space-y-1">
            <strong>Understanding Degree vs. Subject / Major:</strong>
            <ul class="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 dark:text-amber-300">
              <li><strong>Degree:</strong> The qualification or credential awarded (e.g. <em>Bachelor of Science (BSc), Master of Arts (MA), Associate Degree (AAS), High School Diploma</em>).</li>
              <li><strong>Subject / Major:</strong> Your specific academic discipline or concentration (e.g. <em>Mathematics, Business Administration, Accounting, Economics, Physics</em>).</li>
            </ul>
          </div>

          <div id="education-items-list" class="space-y-4">
            ${renderEducationList(profile.education || [])}
          </div>
          <button type="button" id="btn-add-education" class="w-full py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition">
            <i data-lucide="plus" class="w-4 h-4"></i> Add Education Credential
          </button>
        </div>
      </div>

      <!-- Section 5: Skills (Single Unified Category) -->
      <div id="sec-skills" class="form-accordion bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <button type="button" class="accordion-toggle w-full px-5 py-3.5 flex items-center justify-between text-left font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-black">5</span>
            <div>
              <div class="text-sm font-bold flex items-center gap-2">
                <span>Skills</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${skillsList.length} skill${skillsList.length === 1 ? '' : 's'}</span>
              </div>
              <div class="text-[11px] text-slate-500 font-normal">Add key technical, software, analytical, or professional skills with optional proficiency</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="btn-reset-section px-2 py-0.5 text-[10px] text-slate-400 hover:text-red-500 font-semibold rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer" data-section="skills" data-section-name="Skills" title="Reset skills to empty">
              <i data-lucide="rotate-ccw" class="w-3 h-3"></i><span>Reset</span>
            </span>
            <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform"></i>
          </div>
        </button>
        <div class="accordion-content p-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
          
          <!-- Top Action Bar: Add Skill & Quick Custom Skill -->
          <div class="p-3 bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 rounded-xl space-y-2.5">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                <i data-lucide="sparkles" class="w-4 h-4 text-purple-600 dark:text-purple-400"></i>
                Add Skills to Your Profile
              </span>
              <button type="button" id="btn-add-skill" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs transition inline-flex items-center gap-1.5 shadow-xs">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>Add Skill</span>
              </button>
            </div>

            <!-- Add Custom Skill Quick Bar -->
            <div class="pt-2 border-t border-purple-200/60 dark:border-purple-800/40">
              <label class="block text-[11px] font-semibold text-purple-900 dark:text-purple-300 mb-1">
                Add Custom Skill (Direct Input)
              </label>
              <div class="flex flex-col sm:flex-row gap-2">
                <input type="text" id="inp-custom-skill-name" class="form-input text-xs rounded-lg border border-purple-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-1.5 flex-1 focus:ring-2 focus:ring-purple-500" placeholder="Type custom skill name (e.g. Microsoft Excel, SQL, Project Management)..." />
                <select id="sel-custom-skill-level" class="form-input text-xs rounded-lg border border-purple-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-1.5 sm:w-40 focus:ring-2 focus:ring-purple-500">
                  <option value="">Optional Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Proficient">Proficient</option>
                  <option value="Expert">Expert</option>
                </select>
                <button type="button" id="btn-add-custom-skill" class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 dark:bg-purple-700 dark:hover:bg-purple-600 text-white font-bold rounded-lg text-xs transition inline-flex items-center justify-center gap-1 shrink-0">
                  <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
                  <span>Add Custom Skill</span>
                </button>
              </div>
            </div>
          </div>

          ${duplicateCount > 0 ? `
            <div class="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 text-[11px]">
                <i data-lucide="alert-circle" class="w-4 h-4 text-amber-600 shrink-0"></i>
                <span><strong>${duplicateCount} duplicate skill${duplicateCount > 1 ? 's' : ''} detected:</strong> ${Array.from(duplicateSkillsSet).slice(0, 4).join(', ')}${duplicateCount > 4 ? '...' : ''}</span>
              </div>
              <button type="button" id="btn-deduplicate-skills" class="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px] transition shadow-xs">
                Clean Duplicate Skills
              </button>
            </div>
          ` : `
            <div class="flex items-center justify-between text-[11px] text-slate-500">
              <span>Unlimited skills supported. Reorder using ▲/▼ buttons.</span>
              <button type="button" id="btn-deduplicate-skills" class="text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 font-semibold flex items-center gap-1 transition" title="Scan and remove duplicate entries">
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-purple-500"></i>
                <span>Clean Duplicates</span>
              </button>
            </div>
          `}

          <!-- Unified Skills List Container -->
          <div id="skills-items-list" class="space-y-2">
            ${renderUnifiedSkillsList(skillsList)}
          </div>

          <p class="text-[11px] text-slate-400 dark:text-slate-500">
            * Note: All skills appear in a clean, unified presentation across all 10 CV formats. Proficiency levels (Beginner, Intermediate, Advanced, etc.) are optional.
          </p>
        </div>
      </div>

      <!-- Section 6: Key Projects -->
      <div id="sec-projects" class="form-accordion bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <button type="button" class="accordion-toggle w-full px-5 py-3.5 flex items-center justify-between text-left font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-black">6</span>
            <div>
              <div class="text-sm font-bold flex items-center gap-2">
                <span>Key Projects & Deliverables</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${(profile.projects || []).length} projects</span>
              </div>
              <div class="text-[11px] text-slate-500 font-normal">Academic capstones, course assignments, work deliverables, and personal projects</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="btn-reset-section px-2 py-0.5 text-[10px] text-slate-400 hover:text-red-500 font-semibold rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer" data-section="projects" data-section-name="Projects" title="Reset projects to empty">
              <i data-lucide="rotate-ccw" class="w-3 h-3"></i><span>Reset</span>
            </span>
            <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform"></i>
          </div>
        </button>
        <div class="accordion-content p-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div id="projects-items-list" class="space-y-4">
            ${renderProjectsList(profile.projects || [])}
          </div>
          <button type="button" id="btn-add-project" class="w-full py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition">
            <i data-lucide="plus" class="w-4 h-4"></i> Add Project Entry
          </button>
        </div>
      </div>

      <!-- Section 7: Certifications -->
      <div id="sec-certs" class="form-accordion bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <button type="button" class="accordion-toggle w-full px-5 py-3.5 flex items-center justify-between text-left font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-black">7</span>
            <div>
              <div class="text-sm font-bold flex items-center gap-2">
                <span>Certifications & Training</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${(profile.certifications || []).length} certs</span>
              </div>
              <div class="text-[11px] text-slate-500 font-normal">Professional licenses, technical certifications, and training certificates</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="btn-reset-section px-2 py-0.5 text-[10px] text-slate-400 hover:text-red-500 font-semibold rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer" data-section="certifications" data-section-name="Certifications" title="Reset certifications to empty">
              <i data-lucide="rotate-ccw" class="w-3 h-3"></i><span>Reset</span>
            </span>
            <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform"></i>
          </div>
        </button>
        <div class="accordion-content p-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div id="certifications-items-list" class="space-y-3">
            ${renderCertificationsList(profile.certifications || [])}
          </div>
          <button type="button" id="btn-add-certification" class="w-full py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition">
            <i data-lucide="plus" class="w-4 h-4"></i> Add Certification
          </button>
        </div>
      </div>

      <!-- Section 8: Languages -->
      <div id="sec-languages" class="form-accordion bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <button type="button" class="accordion-toggle w-full px-5 py-3.5 flex items-center justify-between text-left font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-black">8</span>
            <div>
              <div class="text-sm font-bold flex items-center gap-2">
                <span>Languages</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${(profile.languages || []).length} languages</span>
              </div>
              <div class="text-[11px] text-slate-500 font-normal">Native, Fluent, Professional Working, Intermediate, or Basic proficiencies</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="btn-reset-section px-2 py-0.5 text-[10px] text-slate-400 hover:text-red-500 font-semibold rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer" data-section="languages" data-section-name="Languages" title="Reset languages to empty">
              <i data-lucide="rotate-ccw" class="w-3 h-3"></i><span>Reset</span>
            </span>
            <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform"></i>
          </div>
        </button>
        <div class="accordion-content p-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div class="p-2.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-lg text-[11px] text-sky-900 dark:text-sky-200">
            <strong>Proficiency Guide:</strong> <em>Native</em> (mother tongue), <em>Fluent</em> (high operational fluency), <em>Professional Working</em> (comfortable in business meetings and written documentation), <em>Intermediate</em> (routine conversations), <em>Basic</em> (simple phrases).
          </div>
          <div id="languages-items-list" class="space-y-2">
            ${renderLanguagesList(profile.languages || [])}
          </div>
          <button type="button" id="btn-add-language" class="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition">
            <i data-lucide="plus" class="w-4 h-4"></i> Add Language
          </button>
        </div>
      </div>

      <!-- Section 9: Optional Sections Manager -->
      <div id="sec-optional-manager" class="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
        <div class="flex items-center justify-between">
          <span class="font-bold text-xs text-slate-800 dark:text-slate-200">Additional Optional CV Sections</span>
          <span class="text-[10px] text-slate-400">Toggle sections on or off as needed</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <label class="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" class="toggle-section rounded text-blue-600" data-sec="internships" ${enabled.internships ? 'checked' : ''} />
            <span>Internships</span>
          </label>
          <label class="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" class="toggle-section rounded text-blue-600" data-sec="publications" ${enabled.publications ? 'checked' : ''} />
            <span>Publications</span>
          </label>
          <label class="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" class="toggle-section rounded text-blue-600" data-sec="achievements" ${enabled.achievements ? 'checked' : ''} />
            <span>Achievements</span>
          </label>
          <label class="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" class="toggle-section rounded text-blue-600" data-sec="volunteer" ${enabled.volunteer ? 'checked' : ''} />
            <span>Volunteer</span>
          </label>
          <label class="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" class="toggle-section rounded text-blue-600" data-sec="references" ${enabled.references !== false ? 'checked' : ''} />
            <span>References</span>
          </label>
          <label class="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" class="toggle-section rounded text-blue-600" data-sec="custom" ${enabled.custom ? 'checked' : ''} />
            <span>Custom Sections</span>
          </label>
        </div>
      </div>

      <!-- Section 10: Professional References (If enabled) -->
      ${enabled.references !== false ? `
        <div id="sec-references" class="form-accordion bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <button type="button" class="accordion-toggle w-full px-5 py-3.5 flex items-center justify-between text-left font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-xs font-black">10</span>
              <div>
                <div class="text-sm font-bold flex items-center gap-1.5">
                  <span>Professional References</span>
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">Optional</span>
                </div>
                <div class="text-[11px] text-slate-500 font-normal">Referee contacts (omitted completely if left blank)</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="btn-reset-section px-2 py-0.5 text-[10px] text-slate-400 hover:text-red-500 font-semibold rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer" data-section="references" data-section-name="References" title="Reset references to empty">
                <i data-lucide="rotate-ccw" class="w-3 h-3"></i><span>Reset</span>
              </span>
              <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform"></i>
            </div>
          </button>
          <div class="accordion-content p-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
            
            <!-- Reference Guidance Note -->
            <div class="p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl">
              <p class="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                <strong class="font-semibold">Professional Referees:</strong> Add your verified referee contacts below. If no references are entered, the References section is automatically omitted from your final CV.
              </p>
            </div>

            <div id="references-items-list" class="space-y-3">
              ${renderReferencesList(profile.references || [])}
            </div>
            <button type="button" id="btn-add-reference" class="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition">
              <i data-lucide="plus" class="w-4 h-4"></i> Add Individual Referee
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Section 11: Internships (If enabled) -->
      ${enabled.internships ? `
        <div id="sec-internships" class="form-accordion bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <button type="button" class="accordion-toggle w-full px-5 py-3.5 flex items-center justify-between text-left font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-xs font-black">11</span>
              <div>
                <div class="text-sm font-bold">Internship Experience</div>
                <div class="text-[11px] text-slate-500 font-normal">Student internships, traineeships, and co-op placements</div>
              </div>
            </div>
            <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform"></i>
          </button>
          <div class="accordion-content p-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div id="internships-items-list" class="space-y-3">
              ${renderInternshipsList(profile.internships || [])}
            </div>
            <button type="button" id="btn-add-internship" class="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition">
              <i data-lucide="plus" class="w-4 h-4"></i> Add Internship
            </button>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  attachFormListeners();
  if (window.lucide) window.lucide.createIcons();
}

// Sub-renderers for Array Lists with Move Up / Move Down / Delete / Edit

function renderExperienceList(items) {
  if (items.length === 0) {
    return `<div class="text-xs text-slate-400 dark:text-slate-500 italic p-3 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">No work experience added. (Ideal for fresh graduates, transitioners, or candidates highlighting education and projects).</div>`;
  }
  return items.map((item, idx) => `
    <div class="p-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5 transition" data-id="${item.id}">
      <div class="flex items-center justify-between">
        <span class="font-bold text-xs text-slate-900 dark:text-white">#${idx + 1} — ${item.title || 'Untitled Position'} (${item.company || 'Organization'})</span>
        <div class="flex items-center gap-1">
          <button type="button" class="btn-move-up p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white" title="Move Up" ${idx === 0 ? 'disabled' : ''}>▲</button>
          <button type="button" class="btn-move-down p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white" title="Move Down" ${idx === items.length - 1 ? 'disabled' : ''}>▼</button>
          <button type="button" class="btn-delete-item text-xs text-red-500 hover:text-red-700 font-bold ml-2">Delete</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Job Title</label>
          <input type="text" class="exp-title form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. Operations Coordinator" value="${item.title || ''}" />
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Company / Organization</label>
          <input type="text" class="exp-company form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. Apex Logistics LLC" value="${item.company || ''}" />
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Employment Type</label>
          <select class="exp-type form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2 py-1.5 w-full">
            <option value="Full-time" ${item.employmentType === 'Full-time' ? 'selected' : ''}>Full-time</option>
            <option value="Part-time" ${item.employmentType === 'Part-time' ? 'selected' : ''}>Part-time</option>
            <option value="Contract" ${item.employmentType === 'Contract' ? 'selected' : ''}>Contract</option>
            <option value="Internship" ${item.employmentType === 'Internship' ? 'selected' : ''}>Internship</option>
            <option value="Freelance" ${item.employmentType === 'Freelance' ? 'selected' : ''}>Freelance</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Location</label>
          <input type="text" class="exp-location form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. Chicago, IL, USA" value="${item.location || ''}" />
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Start Date</label>
          <input type="text" class="exp-start form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. 2021-03" value="${item.startDate || ''}" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-0.5">
            <label class="text-[10px] font-semibold text-slate-600 dark:text-slate-400">End Date</label>
            <label class="text-[10px] text-slate-600 dark:text-slate-400 flex items-center gap-1 cursor-pointer">
              <input type="checkbox" class="exp-current" ${item.current ? 'checked' : ''} /> Currently Working Here
            </label>
          </div>
          <input type="text" class="exp-end form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. 2023-08" value="${item.endDate || ''}" ${item.current ? 'disabled' : ''} />
        </div>
      </div>

      <div>
        <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
          Key Responsibilities & Quantifiable Achievements (Enter each duty or metric on a new line)
        </label>
        <textarea class="exp-highlights form-input w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white p-2 leading-relaxed" rows="3" placeholder="• Coordinated weekly inventory counts across 2 warehouses, decreasing stock discrepancies by 15%.&#10;• Supervised order processing for 35 regional accounts with 99.2% on-time delivery.&#10;• Trained 4 new team members on company software and safety compliance.">${Array.isArray(item.highlights) ? item.highlights.join('\n') : ''}</textarea>
      </div>

      <div>
        <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Technologies / Tools Used (Comma-separated)</label>
        <input type="text" class="exp-technologies form-input w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1" placeholder="e.g. Microsoft Excel, SAP ERP, Asana, Google Workspace" value="${Array.isArray(item.technologies) ? item.technologies.join(', ') : ''}" />
      </div>
    </div>
  `).join('');
}

function renderEducationList(items) {
  if (items.length === 0) return `<div class="text-xs text-slate-400 italic p-3 text-center border border-dashed border-slate-300 rounded-xl">No education credentials added yet.</div>`;
  return items.map((item, idx) => `
    <div class="p-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5" data-id="${item.id}">
      <div class="flex items-center justify-between">
        <span class="font-bold text-xs text-slate-900 dark:text-white">#${idx + 1} — ${item.degree || 'Credential'}${item.major || item.field ? ` in ${item.major || item.field}` : ''}</span>
        <div class="flex items-center gap-1">
          <button type="button" class="btn-move-up p-1 text-slate-400 hover:text-slate-600" ${idx === 0 ? 'disabled' : ''}>▲</button>
          <button type="button" class="btn-move-down p-1 text-slate-400 hover:text-slate-600" ${idx === items.length - 1 ? 'disabled' : ''}>▼</button>
          <button type="button" class="btn-delete-item text-xs text-red-500 hover:text-red-700 font-bold ml-2">Delete</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
            Degree / Qualification <span class="text-red-500 font-bold">*</span>
          </label>
          <input type="text" class="edu-degree form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. Bachelor of Science (BSc), Master of Arts (MA), High School Diploma" value="${item.degree || ''}" />
          <span class="text-[10px] text-slate-400">The qualification title or certification level</span>
        </div>

        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
            Subject / Major <span class="text-red-500 font-bold">*</span>
          </label>
          <input type="text" class="edu-major form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. Mathematics, Business Administration, Economics, History" value="${item.major || item.field || ''}" />
          <span class="text-[10px] text-slate-400">Your specific academic discipline or field of study</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Institution / University Name</label>
          <input type="text" class="edu-institution form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. University of Texas at Austin" value="${item.institution || ''}" />
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Location</label>
          <input type="text" class="edu-location form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. Austin, TX, USA" value="${item.location || ''}" />
        </div>
        <div class="grid grid-cols-2 gap-1.5">
          <div>
            <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Start Date</label>
            <input type="text" class="edu-start form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2 py-1.5 w-full" placeholder="2020-09" value="${item.startDate || ''}" />
          </div>
          <div>
            <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">End Date</label>
            <input type="text" class="edu-end form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2 py-1.5 w-full" placeholder="2024-05" value="${item.endDate || ''}" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Grade / CGPA (Optional)</label>
          <input type="text" class="edu-gpa form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. 3.82 / 4.0 or Upper Second Class (2:1)" value="${item.gpa || ''}" />
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Academic Honors (Optional)</label>
          <input type="text" class="edu-honors form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. Dean's Honor List, Cum Laude" value="${item.honors || ''}" />
        </div>
      </div>

      <div>
        <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Relevant Coursework (Optional)</label>
        <input type="text" class="edu-coursework form-input w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5" placeholder="e.g. Linear Algebra, Probability & Statistics, Mathematical Modelling, Financial Accounting" value="${item.coursework || ''}" />
      </div>

      <div>
        <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Dissertation / Final Project Title (Optional)</label>
        <input type="text" class="edu-thesis form-input w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5" placeholder="e.g. Stochastic Simulation of Urban Traffic Bottlenecks" value="${item.thesis || ''}" />
      </div>
    </div>
  `).join('');
}

function renderUnifiedSkillsList(items) {
  if (!items || items.length === 0) {
    return `<div class="text-xs text-slate-400 italic p-4 text-center border border-dashed rounded-xl border-slate-200 dark:border-slate-700">No skills added yet. Click &ldquo;Add Skill&rdquo; or &ldquo;Add Custom Skill&rdquo; to add your skills.</div>`;
  }
  return items.map((sk, idx) => `
    <div class="flex items-center gap-2 p-2 bg-white dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition" data-id="${sk.id}">
      <span class="text-[11px] font-bold text-slate-400 w-6 text-center shrink-0">#${idx + 1}</span>
      <input type="text" class="sk-name form-input text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 flex-1 focus:ring-2 focus:ring-purple-500" placeholder="Skill name (e.g. Microsoft Excel, SQL, Project Coordination)" value="${(sk.name || '').replace(/"/g, '&quot;')}" />
      <select class="sk-level form-input text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white px-2 py-1.5 w-36 shrink-0 focus:ring-2 focus:ring-purple-500">
        <option value="" ${!sk.level ? 'selected' : ''}>Optional Level</option>
        <option value="Beginner" ${sk.level === 'Beginner' ? 'selected' : ''}>Beginner</option>
        <option value="Intermediate" ${sk.level === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
        <option value="Advanced" ${sk.level === 'Advanced' ? 'selected' : ''}>Advanced</option>
        <option value="Proficient" ${sk.level === 'Proficient' ? 'selected' : ''}>Proficient</option>
        <option value="Expert" ${sk.level === 'Expert' ? 'selected' : ''}>Expert</option>
      </select>
      <div class="flex items-center gap-0.5 shrink-0">
        <button type="button" class="btn-skill-up p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs" title="Move up" ${idx === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
        <button type="button" class="btn-skill-down p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs" title="Move down" ${idx === items.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
        <button type="button" class="btn-delete-skill p-1 text-slate-400 hover:text-red-500 text-xs font-bold ml-1" title="Remove skill">✕</button>
      </div>
    </div>
  `).join('');
}

function renderProjectsList(items) {
  if (items.length === 0) return `<div class="text-xs text-slate-400 italic p-3 text-center border border-dashed rounded-xl">No projects added yet. (Projects are especially helpful for fresh graduates).</div>`;
  return items.map((proj, idx) => `
    <div class="p-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5" data-id="${proj.id}">
      <div class="flex items-center justify-between">
        <span class="font-bold text-xs text-slate-900 dark:text-white">#${idx + 1} — ${proj.title || 'Untitled Project'}</span>
        <div class="flex items-center gap-1">
          <button type="button" class="btn-move-up p-1 text-slate-400 hover:text-slate-600" ${idx === 0 ? 'disabled' : ''}>▲</button>
          <button type="button" class="btn-move-down p-1 text-slate-400 hover:text-slate-600" ${idx === items.length - 1 ? 'disabled' : ''}>▼</button>
          <button type="button" class="btn-delete-item text-xs text-red-500 hover:text-red-700 font-bold ml-2">Delete</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Project Name</label>
          <input type="text" class="proj-title form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. Urban Traffic Flow Simulation" value="${proj.title || ''}" />
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Project Type</label>
          <input type="text" class="proj-type form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. Academic Capstone, Coursework, Client Deliverable" value="${proj.projectType || ''}" />
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Your Role</label>
          <input type="text" class="proj-role form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. Lead Student Researcher, Project Lead" value="${proj.role || ''}" />
        </div>
      </div>

      <div>
        <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Project Description (Purpose, problem solved, and methodology)</label>
        <textarea class="proj-desc form-input w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white p-2" rows="2" placeholder="e.g. Developed a discrete-event simulation model in Python to analyze arrival distributions and minimize traffic intersection wait times...">${proj.description || ''}</textarea>
      </div>

      <div>
        <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Key Contributions & Measurable Outcomes</label>
        <input type="text" class="proj-outcomes form-input w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5" placeholder="e.g. Demonstrated an estimated 18% reduction in simulated queue delays; presented at regional symposium" value="${proj.outcomes || ''}" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Technologies / Tools Used</label>
          <input type="text" class="proj-tech form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. Python, NumPy, Excel" value="${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}" />
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Project Live Demo Link (Optional)</label>
          <input type="url" class="proj-live form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="https://example.com/demo" value="${proj.liveUrl || ''}" />
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">GitHub / Code Link (Optional)</label>
          <input type="url" class="proj-github form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="https://github.com/user/project" value="${proj.githubUrl || ''}" />
        </div>
      </div>
    </div>
  `).join('');
}

function renderCertificationsList(items) {
  if (items.length === 0) return `<div class="text-xs text-slate-400 italic">No certifications added yet.</div>`;
  return items.map(c => `
    <div class="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center gap-2" data-id="${c.id}">
      <input type="text" class="cert-title form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2 py-1 flex-1 w-full sm:w-auto" placeholder="Certification Name (e.g. Project Management Professional)" value="${c.title || ''}" />
      <input type="text" class="cert-issuer form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2 py-1 w-full sm:w-44" placeholder="Issuing Body (e.g. PMI)" value="${c.issuer || ''}" />
      <input type="text" class="cert-date form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2 py-1 w-full sm:w-28" placeholder="Date (YYYY-MM)" value="${c.issueDate || ''}" />
      <button type="button" class="btn-delete-item text-xs text-red-500 hover:text-red-700 font-bold px-1.5">✕</button>
    </div>
  `).join('');
}

function renderLanguagesList(items) {
  if (items.length === 0) return `<div class="text-xs text-slate-400 italic">No languages added yet. Click "Add Language" to include languages spoken.</div>`;
  return items.map(l => `
    <div class="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700" data-id="${l.id}">
      <input type="text" class="lang-name form-input text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white px-2 py-1 flex-1" placeholder="Language (e.g. English, French, German, Mandarin, Arabic)" value="${l.name || ''}" />
      <select class="lang-prof form-input text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white px-2 py-1">
        <option value="Native / Bilingual" ${l.proficiency === 'Native / Bilingual' || l.proficiency === 'Native' ? 'selected' : ''}>Native / Bilingual</option>
        <option value="Fluent" ${l.proficiency === 'Fluent' || l.proficiency === 'Full Professional' ? 'selected' : ''}>Fluent</option>
        <option value="Professional Working" ${l.proficiency === 'Professional Working' || !l.proficiency ? 'selected' : ''}>Professional Working</option>
        <option value="Intermediate" ${l.proficiency === 'Intermediate' || l.proficiency === 'Limited Working' ? 'selected' : ''}>Intermediate</option>
        <option value="Basic" ${l.proficiency === 'Basic' || l.proficiency === 'Elementary' ? 'selected' : ''}>Basic</option>
      </select>
      <select class="lang-cefr form-input text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white px-2 py-1 w-24" title="European CEFR Level (Optional)">
        <option value="C2" ${l.cefr === 'C2' ? 'selected' : ''}>C2 (Mastery)</option>
        <option value="C1" ${l.cefr === 'C1' ? 'selected' : ''}>C1 (Effective)</option>
        <option value="B2" ${l.cefr === 'B2' || !l.cefr ? 'selected' : ''}>B2 (Vantage)</option>
        <option value="B1" ${l.cefr === 'B1' ? 'selected' : ''}>B1 (Threshold)</option>
        <option value="A2" ${l.cefr === 'A2' ? 'selected' : ''}>A2 (Waystage)</option>
        <option value="A1" ${l.cefr === 'A1' ? 'selected' : ''}>A1 (Basic)</option>
      </select>
      <button type="button" class="btn-delete-item text-slate-400 hover:text-red-500 font-bold px-1.5">✕</button>
    </div>
  `).join('');
}

function renderReferencesList(items) {
  if (items.length === 0) return `<div class="text-xs text-slate-400 italic p-3 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">No individual referees added.</div>`;
  return items.map((ref, idx) => `
    <div class="p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-2" data-id="${ref.id}">
      <div class="flex justify-between items-center">
        <span class="font-bold text-xs text-slate-900 dark:text-slate-100">#${idx + 1} — ${ref.name || 'Referee Contact'}</span>
        <div class="flex items-center gap-1">
          <button type="button" class="btn-ref-up p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs" title="Move up" ${idx === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
          <button type="button" class="btn-ref-down p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs" title="Move down" ${idx === items.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
          <button type="button" class="btn-delete-item text-xs text-red-500 hover:text-red-700 font-bold ml-1">✕ Delete</button>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Referee Full Name</label>
          <input type="text" class="ref-name form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. Dr. Arthur Pendelton" value="${(ref.name || '').replace(/"/g, '&quot;')}" />
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Job Title / Designation</label>
          <input type="text" class="ref-title form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. Professor & Department Chair" value="${(ref.title || '').replace(/"/g, '&quot;')}" />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Organization / University</label>
          <input type="text" class="ref-company form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. Acme Corp / Stanford University" value="${(ref.organization || ref.company || '').replace(/"/g, '&quot;')}" />
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Email Address</label>
          <input type="email" class="ref-email form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. referee@organization.org" value="${(ref.email || '').replace(/"/g, '&quot;')}" />
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Phone Number</label>
          <input type="tel" class="ref-phone form-input text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5 w-full" placeholder="e.g. +1 (555) 234-5678" value="${(ref.phone || '').replace(/"/g, '&quot;')}" />
        </div>
      </div>
    </div>
  `).join('');
}

function renderInternshipsList(items) {
  if (items.length === 0) return `<div class="text-xs text-slate-400 italic">No internships listed.</div>`;
  return items.map(i => `
    <div class="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/40 space-y-2" data-id="${i.id}">
      <div class="flex justify-between items-center">
        <span class="font-bold text-xs">${i.title || 'Intern Role'} — ${i.company || 'Company'}</span>
        <button type="button" class="btn-delete-item text-xs text-red-500 font-bold">Delete</button>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <input type="text" class="int-title form-input text-xs rounded border p-1" placeholder="Role Title" value="${i.title || ''}" />
        <input type="text" class="int-company form-input text-xs rounded border p-1" placeholder="Company / Team" value="${i.company || ''}" />
      </div>
      <textarea class="int-highlights form-input w-full text-xs rounded border p-1.5" rows="2" placeholder="Key deliverables...">${Array.isArray(i.highlights) ? i.highlights.join('\n') : ''}</textarea>
    </div>
  `).join('');
}

function attachFormListeners() {
  // Accordion Expand/Collapse Toggling
  document.querySelectorAll('.accordion-toggle').forEach(btn => {
    btn.onclick = (e) => {
      if (e.target.closest('.btn-reset-section')) return;
      const accordion = btn.closest('.form-accordion');
      const content = accordion?.querySelector('.accordion-content');
      const icon = btn.querySelector('[data-lucide="chevron-down"]');
      if (content) {
        const isHidden = content.classList.contains('hidden');
        if (isHidden) {
          content.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          content.classList.add('hidden');
          if (icon) icon.style.transform = 'rotate(-90deg)';
        }
      }
    };
  });

  // Section Reset Handlers (Per-Accordion)
  document.querySelectorAll('.btn-reset-section').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const secKey = btn.getAttribute('data-section');
      const secName = btn.getAttribute('data-section-name') || secKey;
      if (confirm(`Reset the "${secName}" section to clean empty state? This action cannot be undone.`)) {
        appState.resetSection(secKey);
        renderFormSections();
      }
    };
  });

  const pInputs = [
    { id: 'inp-full-name', field: 'fullName' },
    { id: 'inp-headline', field: 'headline' },
    { id: 'inp-email', field: 'email' },
    { id: 'inp-phone', field: 'phone' },
    { id: 'inp-location', field: 'location' },
    { id: 'inp-linkedin', field: 'linkedin' },
    { id: 'inp-github', field: 'github' },
    { id: 'inp-website', field: 'website' },
    { id: 'inp-nationality', field: 'nationality' },
    { id: 'inp-dob', field: 'dateOfBirth' },
    { id: 'inp-license', field: 'drivingLicense' },
    { id: 'inp-father-name', field: 'fatherName' },
    { id: 'inp-mother-name', field: 'motherName' },
    { id: 'inp-religion', field: 'religion' },
    { id: 'inp-marital-status', field: 'maritalStatus' },
    { id: 'inp-gender', field: 'gender' },
    { id: 'inp-permanent-address', field: 'permanentAddress' }
  ];

  pInputs.forEach(({ id, field }) => {
    const el = document.getElementById(id);
    if (el) {
      el.oninput = () => appState.updatePersonalField(field, el.value);
    }
  });

  // Photo Crop Modal Triggers
  document.getElementById('btn-trigger-crop-modal')?.addEventListener('click', () => openPhotoCropModal());
  document.getElementById('btn-remove-photo-direct')?.addEventListener('click', () => {
    appState.updatePersonalField('photoUrl', '');
  });

  // Summary
  const sumEl = document.getElementById('inp-summary');
  if (sumEl) sumEl.oninput = () => appState.updatePersonalField('summary', sumEl.value);

  // Smart Summary Generator
  const btnSmart = document.getElementById('btn-smart-summary');
  const boxSmart = document.getElementById('smart-summary-box');
  const optSmart = document.getElementById('smart-summary-options');
  if (btnSmart && boxSmart && optSmart) {
    btnSmart.onclick = () => {
      boxSmart.classList.remove('hidden');
      const summaries = generateSummaries(appState.getProfile());
      optSmart.innerHTML = summaries.map(s => `
        <div class="p-2.5 bg-white dark:bg-slate-800 rounded border border-indigo-200 dark:border-indigo-700/60 hover:border-indigo-500 transition cursor-pointer group" data-text="${encodeURIComponent(s.text)}">
          <div class="font-bold text-indigo-700 dark:text-indigo-400 group-hover:underline flex items-center justify-between">
            <span>${s.title}</span>
            <span class="text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 px-1.5 py-0.5 rounded font-normal">Click to insert</span>
          </div>
          <p class="text-[11px] text-slate-700 dark:text-slate-300 mt-1 leading-normal">${s.text}</p>
        </div>
      `).join('');

      optSmart.querySelectorAll('[data-text]').forEach(card => {
        card.onclick = () => {
          const text = decodeURIComponent(card.getAttribute('data-text'));
          sumEl.value = text;
          appState.updatePersonalField('summary', text);
          boxSmart.classList.add('hidden');
        };
      });
    };

    document.getElementById('btn-close-smart-summary')?.addEventListener('click', () => {
      boxSmart.classList.add('hidden');
    });
  }

  // Fresh Graduate Toggle
  const chkFresh = document.getElementById('chk-fresh-graduate');
  if (chkFresh) {
    chkFresh.onchange = () => {
      appState.setFreshGraduate(chkFresh.checked);
      renderFormSections();
    };
  }


  // Section Visibility Toggles
  document.querySelectorAll('.toggle-section').forEach(chk => {
    chk.onchange = () => {
      const secKey = chk.getAttribute('data-sec');
      appState.toggleSectionEnabled(secKey, chk.checked);
      renderFormSections();
    };
  });

  // Experience handlers (Clean blank defaults!)
  document.getElementById('btn-add-experience')?.addEventListener('click', () => {
    appState.addItem('experience', {
      title: '',
      company: '',
      location: '',
      employmentType: 'Full-time',
      startDate: '',
      endDate: '',
      current: false,
      highlights: [],
      technologies: []
    });
    renderFormSections();
  });

  document.querySelectorAll('#experience-items-list [data-id]').forEach(row => {
    const id = row.getAttribute('data-id');
    const updateExp = () => {
      const highlights = (row.querySelector('.exp-highlights')?.value || '').split('\n').map(h => h.trim()).filter(Boolean);
      const technologies = (row.querySelector('.exp-technologies')?.value || '').split(',').map(t => t.trim()).filter(Boolean);
      appState.updateItem('experience', id, {
        title: row.querySelector('.exp-title')?.value || '',
        company: row.querySelector('.exp-company')?.value || '',
        employmentType: row.querySelector('.exp-type')?.value || 'Full-time',
        location: row.querySelector('.exp-location')?.value || '',
        startDate: row.querySelector('.exp-start')?.value || '',
        endDate: row.querySelector('.exp-end')?.value || '',
        current: !!row.querySelector('.exp-current')?.checked,
        highlights,
        technologies
      });
    };
    row.querySelectorAll('input, select, textarea').forEach(inp => inp.oninput = updateExp);
    row.querySelector('.exp-current')?.addEventListener('change', () => {
      const endInp = row.querySelector('.exp-end');
      if (endInp) endInp.disabled = row.querySelector('.exp-current').checked;
      updateExp();
    });
    row.querySelector('.btn-delete-item')?.addEventListener('click', () => {
      appState.deleteItem('experience', id);
      renderFormSections();
    });
    row.querySelector('.btn-move-up')?.addEventListener('click', () => {
      const idx = appState.getProfile().experience.findIndex(x => x.id === id);
      if (idx > 0) { appState.moveItem('experience', idx, idx - 1); renderFormSections(); }
    });
    row.querySelector('.btn-move-down')?.addEventListener('click', () => {
      const idx = appState.getProfile().experience.findIndex(x => x.id === id);
      if (idx < appState.getProfile().experience.length - 1) { appState.moveItem('experience', idx, idx + 1); renderFormSections(); }
    });
  });

  // Education handlers (Clean blank defaults!)
  document.getElementById('btn-add-education')?.addEventListener('click', () => {
    appState.addItem('education', {
      degree: '',
      major: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: '',
      coursework: '',
      thesis: ''
    });
    renderFormSections();
  });

  document.querySelectorAll('#education-items-list [data-id]').forEach(row => {
    const id = row.getAttribute('data-id');
    const updateEdu = () => {
      appState.updateItem('education', id, {
        degree: row.querySelector('.edu-degree')?.value || '',
        major: row.querySelector('.edu-major')?.value || '',
        field: row.querySelector('.edu-major')?.value || '',
        institution: row.querySelector('.edu-institution')?.value || '',
        location: row.querySelector('.edu-location')?.value || '',
        startDate: row.querySelector('.edu-start')?.value || '',
        endDate: row.querySelector('.edu-end')?.value || '',
        gpa: row.querySelector('.edu-gpa')?.value || '',
        honors: row.querySelector('.edu-honors')?.value || '',
        coursework: row.querySelector('.edu-coursework')?.value || '',
        thesis: row.querySelector('.edu-thesis')?.value || ''
      });
    };
    row.querySelectorAll('input').forEach(inp => inp.oninput = updateEdu);
    row.querySelector('.btn-delete-item')?.addEventListener('click', () => {
      appState.deleteItem('education', id);
      renderFormSections();
    });
    row.querySelector('.btn-move-up')?.addEventListener('click', () => {
      const idx = appState.getProfile().education.findIndex(x => x.id === id);
      if (idx > 0) { appState.moveItem('education', idx, idx - 1); renderFormSections(); }
    });
    row.querySelector('.btn-move-down')?.addEventListener('click', () => {
      const idx = appState.getProfile().education.findIndex(x => x.id === id);
      if (idx < appState.getProfile().education.length - 1) { appState.moveItem('education', idx, idx + 1); renderFormSections(); }
    });
  });

  // Skills handlers (Unified Single Category: Skills)
  document.getElementById('btn-add-skill')?.addEventListener('click', () => {
    appState.addSkill({ name: '', level: '' });
    renderFormSections();
    const inputs = document.querySelectorAll('#skills-items-list .sk-name');
    if (inputs.length) inputs[inputs.length - 1].focus();
  });

  const handleAddCustomSkill = () => {
    const nameInp = document.getElementById('inp-custom-skill-name');
    const levelInp = document.getElementById('sel-custom-skill-level');
    const nameVal = (nameInp?.value || '').trim();
    if (!nameVal) {
      nameInp?.focus();
      return;
    }
    const levelVal = levelInp?.value || '';
    appState.addSkill({ name: nameVal, level: levelVal });
    renderFormSections();
  };

  document.getElementById('btn-add-custom-skill')?.addEventListener('click', handleAddCustomSkill);
  document.getElementById('inp-custom-skill-name')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomSkill();
    }
  });

  document.getElementById('btn-deduplicate-skills')?.addEventListener('click', () => {
    const curSkills = Array.isArray(appState.getProfile().skills) ? appState.getProfile().skills : [];
    const seen = new Set();
    const deduped = [];
    for (const s of curSkills) {
      const key = (s.name || '').trim().toLowerCase();
      if (key && !seen.has(key)) {
        seen.add(key);
        deduped.push(s);
      }
    }
    appState.updateSection('skills', deduped);
    renderFormSections();
  });

  document.querySelectorAll('#skills-items-list [data-id]').forEach(row => {
    const id = row.getAttribute('data-id');
    const nameInp = row.querySelector('.sk-name');
    const levelSelect = row.querySelector('.sk-level');

    const updateSk = () => {
      appState.updateSkill(id, {
        name: nameInp?.value || '',
        level: levelSelect?.value || ''
      });
    };

    nameInp?.addEventListener('input', updateSk);
    nameInp?.addEventListener('change', updateSk);
    levelSelect?.addEventListener('change', updateSk);

    row.querySelector('.btn-delete-skill')?.addEventListener('click', () => {
      appState.deleteSkill(id);
      renderFormSections();
    });

    row.querySelector('.btn-skill-up')?.addEventListener('click', () => {
      const skills = Array.isArray(appState.getProfile().skills) ? appState.getProfile().skills : [];
      const idx = skills.findIndex(s => s.id === id);
      if (idx > 0) {
        appState.moveSkill(idx, idx - 1);
        renderFormSections();
      }
    });

    row.querySelector('.btn-skill-down')?.addEventListener('click', () => {
      const skills = Array.isArray(appState.getProfile().skills) ? appState.getProfile().skills : [];
      const idx = skills.findIndex(s => s.id === id);
      if (idx >= 0 && idx < skills.length - 1) {
        appState.moveSkill(idx, idx + 1);
        renderFormSections();
      }
    });
  });

  // Projects (Clean blank defaults!)
  document.getElementById('btn-add-project')?.addEventListener('click', () => {
    appState.addItem('projects', {
      title: '',
      projectType: '',
      role: '',
      description: '',
      outcomes: '',
      technologies: [],
      liveUrl: '',
      githubUrl: ''
    });
    renderFormSections();
  });

  document.querySelectorAll('#projects-items-list [data-id]').forEach(row => {
    const id = row.getAttribute('data-id');
    const updateProj = () => {
      const tech = (row.querySelector('.proj-tech')?.value || '').split(',').map(t => t.trim()).filter(Boolean);
      appState.updateItem('projects', id, {
        title: row.querySelector('.proj-title')?.value || '',
        projectType: row.querySelector('.proj-type')?.value || '',
        role: row.querySelector('.proj-role')?.value || '',
        description: row.querySelector('.proj-desc')?.value || '',
        outcomes: row.querySelector('.proj-outcomes')?.value || '',
        technologies: tech,
        liveUrl: row.querySelector('.proj-live')?.value || '',
        githubUrl: row.querySelector('.proj-github')?.value || ''
      });
    };
    row.querySelectorAll('input, textarea').forEach(el => el.oninput = updateProj);
    row.querySelector('.btn-delete-item')?.addEventListener('click', () => {
      appState.deleteItem('projects', id);
      renderFormSections();
    });
    row.querySelector('.btn-move-up')?.addEventListener('click', () => {
      const idx = appState.getProfile().projects.findIndex(x => x.id === id);
      if (idx > 0) { appState.moveItem('projects', idx, idx - 1); renderFormSections(); }
    });
    row.querySelector('.btn-move-down')?.addEventListener('click', () => {
      const idx = appState.getProfile().projects.findIndex(x => x.id === id);
      if (idx < appState.getProfile().projects.length - 1) { appState.moveItem('projects', idx, idx + 1); renderFormSections(); }
    });
  });

  // Certifications (Clean blank defaults!)
  document.getElementById('btn-add-certification')?.addEventListener('click', () => {
    appState.addItem('certifications', { title: '', issuer: '', issueDate: '' });
    renderFormSections();
  });

  document.querySelectorAll('#certifications-items-list [data-id]').forEach(row => {
    const id = row.getAttribute('data-id');
    const updateCert = () => {
      appState.updateItem('certifications', id, {
        title: row.querySelector('.cert-title')?.value || '',
        issuer: row.querySelector('.cert-issuer')?.value || '',
        issueDate: row.querySelector('.cert-date')?.value || ''
      });
    };
    row.querySelectorAll('input').forEach(el => el.oninput = updateCert);
    row.querySelector('.btn-delete-item')?.addEventListener('click', () => {
      appState.deleteItem('certifications', id);
      renderFormSections();
    });
  });

  // Languages (Clean blank defaults!)
  document.getElementById('btn-add-language')?.addEventListener('click', () => {
    appState.addItem('languages', { name: '', proficiency: 'Professional Working', cefr: 'B2' });
    renderFormSections();
  });

  document.querySelectorAll('#languages-items-list [data-id]').forEach(row => {
    const id = row.getAttribute('data-id');
    const updateLang = () => {
      appState.updateItem('languages', id, {
        name: row.querySelector('.lang-name')?.value || '',
        proficiency: row.querySelector('.lang-prof')?.value || 'Professional Working',
        cefr: row.querySelector('.lang-cefr')?.value || 'B2'
      });
    };
    row.querySelectorAll('input, select').forEach(el => el.onchange = updateLang);
    row.querySelector('.btn-delete-item')?.addEventListener('click', () => {
      appState.deleteItem('languages', id);
      renderFormSections();
    });
  });

  // References (Clean blank defaults!)
  document.getElementById('btn-add-reference')?.addEventListener('click', () => {
    appState.addItem('references', { name: '', title: '', company: '', organization: '', email: '', phone: '' });
    renderFormSections();
  });

  document.querySelectorAll('#references-items-list [data-id]').forEach(row => {
    const id = row.getAttribute('data-id');
    const updateRef = () => {
      const comp = row.querySelector('.ref-company')?.value || '';
      appState.updateItem('references', id, {
        name: row.querySelector('.ref-name')?.value || '',
        title: row.querySelector('.ref-title')?.value || '',
        company: comp,
        organization: comp,
        email: row.querySelector('.ref-email')?.value || '',
        phone: row.querySelector('.ref-phone')?.value || ''
      });
    };
    row.querySelectorAll('input').forEach(el => el.oninput = updateRef);
    row.querySelector('.btn-delete-item')?.addEventListener('click', () => {
      appState.deleteItem('references', id);
      renderFormSections();
    });
    row.querySelector('.btn-ref-up')?.addEventListener('click', () => {
      const refs = appState.getProfile().references || [];
      const idx = refs.findIndex(r => r.id === id);
      if (idx > 0) {
        appState.moveItem('references', idx, idx - 1);
        renderFormSections();
      }
    });
    row.querySelector('.btn-ref-down')?.addEventListener('click', () => {
      const refs = appState.getProfile().references || [];
      const idx = refs.findIndex(r => r.id === id);
      if (idx >= 0 && idx < refs.length - 1) {
        appState.moveItem('references', idx, idx + 1);
        renderFormSections();
      }
    });
  });

  // Internships
  document.getElementById('btn-add-internship')?.addEventListener('click', () => {
    appState.addItem('internships', { title: '', company: '', highlights: [] });
    renderFormSections();
  });

  document.querySelectorAll('#internships-items-list [data-id]').forEach(row => {
    const id = row.getAttribute('data-id');
    row.querySelectorAll('input, textarea').forEach(el => el.oninput = () => {
      const hl = (row.querySelector('.int-highlights')?.value || '').split('\n').map(h => h.trim()).filter(Boolean);
      appState.updateItem('internships', id, {
        title: row.querySelector('.int-title')?.value || '',
        company: row.querySelector('.int-company')?.value || '',
        highlights: hl
      });
    });
    row.querySelector('.btn-delete-item')?.addEventListener('click', () => {
      appState.deleteItem('internships', id);
      renderFormSections();
    });
  });
}

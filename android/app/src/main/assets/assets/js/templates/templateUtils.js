/**
 * CVForge - Template Rendering Utilities (Enhanced)
 * Shared sanitization, date formatting, photo rendering, education degree formatting,
 * 6-category skill rendering, and fresh graduate detection across all 10 formats.
 */

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatDate(dateStr, format = 'Month YYYY') {
  if (!dateStr) return '';
  if (/^\d{4}$/.test(dateStr)) return dateStr;

  const parts = dateStr.split('-');
  if (parts.length >= 2) {
    const year = parts[0];
    const monthNum = parseInt(parts[1], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (monthNum >= 1 && monthNum <= 12) {
      if (format === 'MM/YYYY') {
        return `${String(monthNum).padStart(2, '0')}/${year}`;
      } else if (format === 'YYYY') {
        return year;
      } else {
        return `${months[monthNum - 1]} ${year}`;
      }
    }
  }
  return dateStr;
}

export function formatDateRange(startDate, endDate, current, format = 'Month YYYY') {
  const start = formatDate(startDate, format);
  if (current) {
    return `${start} – Present`;
  }
  const end = formatDate(endDate, format);
  if (!start && !end) return '';
  if (!end) return start;
  return `${start} – ${end}`;
}

export function getCleanUrl(url) {
  if (!url) return '';
  return url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '');
}

/**
 * Formats Degree and Subject / Major properly.
 * Example: "Bachelor of Science (BSc) in Mathematics"
 */
export function formatEducationDegree(edu) {
  if (!edu) return '';
  const degree = edu.degree || 'Degree';
  const subject = edu.major || edu.field;
  return subject ? `${escapeHtml(degree)} in ${escapeHtml(subject)}` : escapeHtml(degree);
}

/**
 * Checks if candidate is a fresh graduate with no work experience.
 */
export function isFreshGraduateCandidate(profile) {
  if (!profile) return false;
  return !!profile.isFreshGraduate || (profile.experience || []).length === 0;
}

/**
 * Renders candidate photo respecting showPhoto toggle, aspect-ratio (1:1),
 * photoShape ('circle' vs 'square'/'rounded-rect'), and avoids distortion or empty gap.
 */
export function renderPhotoHtml(profile, defaultSizeClass = 'w-24 h-24', extraClasses = '') {
  const settings = profile?.settings || {};
  const photoUrl = profile?.personal?.photoUrl;
  if (!settings.showPhoto || !photoUrl) return '';

  const sizeClass = settings.photoSize === 'small' ? 'w-20 h-20' :
                    settings.photoSize === 'large' ? 'w-32 h-32' :
                    defaultSizeClass;

  const shapeClass = settings.photoShape === 'circle' ? 'rounded-full' : 'rounded-2xl';
  const borderStyle = settings.primaryColor ? `border: 2.5px solid ${settings.primaryColor};` : 'border: 2px solid #cbd5e1;';
  
  return `
    <div class="inline-block shrink-0 overflow-hidden shadow-xs ${sizeClass} ${shapeClass} ${extraClasses}">
      <img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(profile.personal?.fullName || 'Profile Headshot')}" class="w-full h-full object-cover" style="aspect-ratio: 1 / 1; ${borderStyle}" />
    </div>
  `;
}

/**
 * Checks if a section is enabled in settings and should be rendered.
 */
export function isSectionEnabled(profile, sectionKey) {
  if (profile?.enabledSections && profile.enabledSections[sectionKey] === false) {
    return false;
  }
  return true;
}

/**
 * Helper to retrieve a flat, unified list of skills from profile.
 * Gracefully handles both new flat array structure and legacy categorized objects.
 */
export function getSkillsList(profile) {
  if (!profile || !profile.skills) return [];
  if (Array.isArray(profile.skills)) {
    return profile.skills
      .filter(s => s && (typeof s === 'string' ? s.trim() : (s.name && s.name.trim())))
      .map((s, idx) => {
        if (typeof s === 'string') return { id: `sk_${idx}`, name: s.trim(), level: '' };
        return { id: s.id || `sk_${idx}`, name: s.name.trim(), level: (s.level || '').trim() };
      });
  }

  // Legacy categorized object fallback
  const s = profile.skills;
  const list = [];
  const seen = new Set();
  const addOne = (name, level = '') => {
    const clean = (name || '').trim();
    if (!clean) return;
    const lower = clean.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      list.push({ id: `sk_${list.length}`, name: clean, level: (level || '').trim() });
    }
  };

  (s.technical || []).forEach(x => addOne(x?.name, x?.level));
  (s.tools || []).forEach(t => addOne(typeof t === 'string' ? t : t?.name, t?.level));
  (s.programming || []).forEach(x => addOne(x?.name, x?.level));
  (s.dataAnalysis || []).forEach(x => addOne(x?.name, x?.level));
  (s.professional || s.soft || []).forEach(x => addOne(x?.name, x?.level));
  (s.communication || []).forEach(x => addOne(x?.name, x?.level));
  (s.industry || []).forEach(x => addOne(typeof x === 'string' ? x : x?.name, x?.level));

  return list;
}

/**
 * Renders unified Skills block across CV formats.
 * Displays all skills in a single, clean, organized presentation with optional proficiency.
 */
export function renderCategorizedSkillsHtml(profile, primaryColor = '#1e3a8a') {
  const skills = getSkillsList(profile);
  if (skills.length === 0) return '';

  return `
    <div class="flex flex-wrap gap-2 text-xs text-slate-800">
      ${skills.map(sk => `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
          <span class="w-1.5 h-1.5 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
          <strong class="font-semibold text-slate-900">${escapeHtml(sk.name)}</strong>
          ${sk.level ? `<span class="text-[11px] text-slate-500 font-normal">(${escapeHtml(sk.level)})</span>` : ''}
        </span>
      `).join('')}
    </div>
  `;
}

export const renderSkillsHtml = renderCategorizedSkillsHtml;

/**
 * Renders Professional References block.
 * Only displayed when the user explicitly provides actual referee entries.
 * If no references are entered, the section is completely omitted.
 */
export function renderReferencesHtml(profile, primaryColor = '#1e3a8a') {
  if (!isSectionEnabled(profile, 'references')) return '';
  const rawRefs = profile?.references || [];
  const refs = rawRefs.filter(r => r && (r.name || r.title || r.company || r.organization || r.email || r.phone));

  if (refs.length === 0) return '';

  return `
    <section class="mb-5 page-break-avoid">
      <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
        References
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        ${refs.map(r => {
          const org = r.organization || r.company || '';
          return `
            <div class="p-2 border border-slate-200 rounded">
              ${r.name ? `<div class="font-bold text-slate-900">${escapeHtml(r.name)}</div>` : ''}
              ${(r.title || org) ? `<div class="text-slate-600">${escapeHtml(r.title || '')}${r.title && org ? ' — ' : ''}${escapeHtml(org)}</div>` : ''}
              ${r.email ? `<div class="text-slate-500">${escapeHtml(r.email)}</div>` : ''}
              ${r.phone ? `<div class="text-slate-500">${escapeHtml(r.phone)}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

/**
 * CVForge - Typography & Font Family Customization Modal
 * Controls:
 * 1. 22 Professional Font Families (System & Google Web Fonts)
 * 2. Font Styles (Regular, Medium, Semibold, Bold, Italic, Bold Italic)
 * 3. Granular Target Directives (All Document, Headings Only, Body Only, Name Only)
 * 4. Interactive Live Font Preview Card
 * 5. Independent Point (pt) controls for Name, Headings, Body, and Contact lines
 */

import { appState } from '../models/state.js';

export function openTypographyModal() {
  let modal = document.getElementById('typography-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'typography-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity';
    document.body.appendChild(modal);
  }

  const profile = appState.getProfile();
  const settings = profile.settings || {};
  const currentFont = settings.fontFamily || 'Inter';
  const currentStyle = settings.fontStyle || 'regular';
  const currentTarget = settings.fontTarget || 'all';
  const fontSizes = settings.fontSizes || { name: 24, headings: 13, body: 10, contact: 9.5 };

  const FONT_OPTIONS = [
    {
      group: 'Modern Sans-Serif',
      fonts: [
        { id: 'Inter', name: 'Inter (Modern UI Sans)' },
        { id: 'Roboto', name: 'Roboto (Geometric Sans)' },
        { id: 'Open Sans', name: 'Open Sans (Friendly Corporate)' },
        { id: 'Lato', name: 'Lato (Humanist Sans)' },
        { id: 'Source Sans 3', name: 'Source Sans 3 (Adobe Clean)' },
        { id: 'Montserrat', name: 'Montserrat (Contemporary)' },
        { id: 'Poppins', name: 'Poppins (Geometric Rounded)' },
        { id: 'IBM Plex Sans', name: 'IBM Plex Sans (Industrial Sans)' }
      ]
    },
    {
      group: 'Professional Serif',
      fonts: [
        { id: 'Merriweather', name: 'Merriweather (Academic Serif)' },
        { id: 'Playfair Display', name: 'Playfair Display (Editorial Luxury)' },
        { id: 'IBM Plex Serif', name: 'IBM Plex Serif (Tech Serif)' },
        { id: 'Times New Roman', name: 'Times New Roman (Classic Standard)' },
        { id: 'Georgia', name: 'Georgia (Refined Serif)' },
        { id: 'Cambria', name: 'Cambria (Workplace Serif)' },
        { id: 'Garamond', name: 'Garamond (Literary Elegance)' }
      ]
    },
    {
      group: 'Universal System Fonts',
      fonts: [
        { id: 'Arial', name: 'Arial (Universal Standard)' },
        { id: 'Calibri', name: 'Calibri (Corporate Standard)' },
        { id: 'Aptos', name: 'Aptos (Modern MS Office)' },
        { id: 'Helvetica', name: 'Helvetica (Swiss Clean)' },
        { id: 'Verdana', name: 'Verdana (High-Legibility)' },
        { id: 'Tahoma', name: 'Tahoma (Compact Sans)' },
        { id: 'Trebuchet MS', name: 'Trebuchet MS (Warm Sans)' }
      ]
    }
  ];

  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <i data-lucide="type" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Typography & Font Styling</h3>
            <p class="text-xs text-slate-500">22 international fonts, style variations, and physical point sizes (pt)</p>
          </div>
        </div>
        <button type="button" id="btn-close-typography-modal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg" aria-label="Close">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
        
        <!-- Live Font Preview Card -->
        <div class="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
          <div class="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>Live Typography Preview</span>
            <span id="preview-font-label" class="font-mono text-blue-600 dark:text-blue-400">${currentFont} (${currentStyle})</span>
          </div>
          <div id="live-font-preview-box" class="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-1.5 transition-all">
            <div id="preview-sample-name" class="font-bold text-slate-900 dark:text-white" style="font-size: 16pt;">
              ${profile.personal?.fullName || 'Eleanor Vance, Senior Architect'}
            </div>
            <div id="preview-sample-heading" class="font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide" style="font-size: 11pt;">
              WORK EXPERIENCE & CORE CAPABILITIES
            </div>
            <div id="preview-sample-body" class="text-slate-600 dark:text-slate-300 leading-relaxed" style="font-size: 9.5pt;">
              Directed distributed engineering workflows, improved query performance by 42%, and maintained rigorous international documentation standards.
            </div>
          </div>
        </div>

        <!-- Font Family & Style Configuration -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- Font Family -->
          <div>
            <label class="block font-bold text-slate-900 dark:text-white mb-1">Font Family</label>
            <select id="modal-sel-font" class="w-full form-input text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-2 font-medium">
              ${FONT_OPTIONS.map(grp => `
                <optgroup label="${grp.group}">
                  ${grp.fonts.map(f => `
                    <option value="${f.id}" ${currentFont === f.id ? 'selected' : ''}>${f.name}</option>
                  `).join('')}
                </optgroup>
              `).join('')}
            </select>
          </div>

          <!-- Font Style -->
          <div>
            <label class="block font-bold text-slate-900 dark:text-white mb-1">Font Weight / Style</label>
            <select id="modal-sel-style" class="w-full form-input text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-2 font-medium">
              <option value="regular" ${currentStyle === 'regular' ? 'selected' : ''}>Regular (400)</option>
              <option value="medium" ${currentStyle === 'medium' ? 'selected' : ''}>Medium (500)</option>
              <option value="semibold" ${currentStyle === 'semibold' ? 'selected' : ''}>Semibold (600)</option>
              <option value="bold" ${currentStyle === 'bold' ? 'selected' : ''}>Bold (700)</option>
              <option value="italic" ${currentStyle === 'italic' ? 'selected' : ''}>Italic (400 Italic)</option>
              <option value="bold-italic" ${currentStyle === 'bold-italic' ? 'selected' : ''}>Bold Italic (700 Italic)</option>
            </select>
          </div>

          <!-- Granular Target Directive -->
          <div>
            <label class="block font-bold text-slate-900 dark:text-white mb-1">Apply Font To</label>
            <select id="modal-sel-target" class="w-full form-input text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-2 font-medium">
              <option value="all" ${currentTarget === 'all' ? 'selected' : ''}>All Document Text</option>
              <option value="headings" ${currentTarget === 'headings' ? 'selected' : ''}>Headings & Section Titles</option>
              <option value="body" ${currentTarget === 'body' ? 'selected' : ''}>Body Text & Descriptions</option>
              <option value="name" ${currentTarget === 'name' ? 'selected' : ''}>Candidate Name Only</option>
            </select>
          </div>
        </div>

        <!-- Point-Based Font Sizes -->
        <div class="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div class="font-bold text-slate-900 dark:text-white text-xs">Point-Based Sizing (pt)</div>
          
          <!-- 1. Candidate Full Name -->
          <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-1.5">
            <div class="flex items-center justify-between">
              <div>
                <label class="font-bold text-slate-900 dark:text-white text-xs block">Candidate Name</label>
                <span class="text-[10px] text-slate-400">Header title (Recommended: 20pt – 28pt)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <input type="number" id="inp-size-name" min="14" max="48" step="1" value="${fontSizes.name}" class="w-16 text-center font-bold font-mono text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white py-1 px-1.5" />
                <span class="font-bold text-slate-500 text-xs">pt</span>
              </div>
            </div>
            <input type="range" id="rng-size-name" min="14" max="48" step="1" value="${fontSizes.name}" class="w-full accent-blue-600" />
          </div>

          <!-- 2. Section Headings -->
          <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-1.5">
            <div class="flex items-center justify-between">
              <div>
                <label class="font-bold text-slate-900 dark:text-white text-xs block">Section Headings</label>
                <span class="text-[10px] text-slate-400">Experience, Education, Skills titles (Recommended: 11pt – 15pt)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <input type="number" id="inp-size-headings" min="9" max="24" step="0.5" value="${fontSizes.headings}" class="w-16 text-center font-bold font-mono text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white py-1 px-1.5" />
                <span class="font-bold text-slate-500 text-xs">pt</span>
              </div>
            </div>
            <input type="range" id="rng-size-headings" min="9" max="24" step="0.5" value="${fontSizes.headings}" class="w-full accent-blue-600" />
          </div>

          <!-- 3. Body Text & Bullets -->
          <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-1.5">
            <div class="flex items-center justify-between">
              <div>
                <label class="font-bold text-slate-900 dark:text-white text-xs block">Body Text & Descriptions</label>
                <span class="text-[10px] text-slate-400">Job duties, project descriptions, skills (Recommended: 9.5pt – 11pt)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <input type="number" id="inp-size-body" min="7" max="16" step="0.5" value="${fontSizes.body}" class="w-16 text-center font-bold font-mono text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white py-1 px-1.5" />
                <span class="font-bold text-slate-500 text-xs">pt</span>
              </div>
            </div>
            <input type="range" id="rng-size-body" min="7" max="16" step="0.5" value="${fontSizes.body}" class="w-full accent-blue-600" />
          </div>

          <!-- 4. Contact Information & Dates -->
          <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-1.5">
            <div class="flex items-center justify-between">
              <div>
                <label class="font-bold text-slate-900 dark:text-white text-xs block">Contact Information & Meta Dates</label>
                <span class="text-[10px] text-slate-400">Email, phone, links, employment dates (Recommended: 8.5pt – 10pt)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <input type="number" id="inp-size-contact" min="7" max="14" step="0.5" value="${fontSizes.contact}" class="w-16 text-center font-bold font-mono text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white py-1 px-1.5" />
                <span class="font-bold text-slate-500 text-xs">pt</span>
              </div>
            </div>
            <input type="range" id="rng-size-contact" min="7" max="14" step="0.5" value="${fontSizes.contact}" class="w-full accent-blue-600" />
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
        <button type="button" id="btn-reset-typography" class="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition flex items-center gap-1">
          <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
          <span>Reset to Defaults</span>
        </button>
        <button type="button" id="btn-done-typography" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition shadow-xs">
          Done
        </button>
      </div>

    </div>
  `;

  const closeModal = () => modal.remove();
  document.getElementById('btn-close-typography-modal')?.addEventListener('click', closeModal);
  document.getElementById('btn-done-typography')?.addEventListener('click', closeModal);
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };

  // Live Preview Updating
  const updatePreviewBox = () => {
    const selFont = document.getElementById('modal-sel-font')?.value || 'Inter';
    const selStyle = document.getElementById('modal-sel-style')?.value || 'regular';
    const previewBox = document.getElementById('live-font-preview-box');
    const label = document.getElementById('preview-font-label');

    if (label) label.textContent = `${selFont} (${selStyle})`;
    if (previewBox) {
      previewBox.style.fontFamily = `'${selFont}', sans-serif`;
      if (selStyle === 'regular') {
        previewBox.style.fontWeight = '400';
        previewBox.style.fontStyle = 'normal';
      } else if (selStyle === 'medium') {
        previewBox.style.fontWeight = '500';
        previewBox.style.fontStyle = 'normal';
      } else if (selStyle === 'semibold') {
        previewBox.style.fontWeight = '600';
        previewBox.style.fontStyle = 'normal';
      } else if (selStyle === 'bold') {
        previewBox.style.fontWeight = '700';
        previewBox.style.fontStyle = 'normal';
      } else if (selStyle === 'italic') {
        previewBox.style.fontWeight = '400';
        previewBox.style.fontStyle = 'italic';
      } else if (selStyle === 'bold-italic') {
        previewBox.style.fontWeight = '700';
        previewBox.style.fontStyle = 'italic';
      }
    }
  };

  // Font family change
  document.getElementById('modal-sel-font')?.addEventListener('change', (e) => {
    appState.updateSetting('fontFamily', e.target.value);
    updatePreviewBox();
  });

  // Font style change
  document.getElementById('modal-sel-style')?.addEventListener('change', (e) => {
    appState.setFontStyle(e.target.value);
    updatePreviewBox();
  });

  // Target directive change
  document.getElementById('modal-sel-target')?.addEventListener('change', (e) => {
    appState.setFontTarget(e.target.value);
  });

  // Sync inputs and ranges for point sizes
  const bindPair = (inpId, rngId, key) => {
    const inp = document.getElementById(inpId);
    const rng = document.getElementById(rngId);
    if (!inp || !rng) return;

    const update = (val) => {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        inp.value = num;
        rng.value = num;
        const cur = appState.getProfile().settings.fontSizes || { name: 24, headings: 13, body: 10, contact: 9.5 };
        cur[key] = num;
        appState.setFontSizes(cur);
      }
    };

    inp.oninput = () => update(inp.value);
    rng.oninput = () => update(rng.value);
  };

  bindPair('inp-size-name', 'rng-size-name', 'name');
  bindPair('inp-size-headings', 'rng-size-headings', 'headings');
  bindPair('inp-size-body', 'rng-size-body', 'body');
  bindPair('inp-size-contact', 'rng-size-contact', 'contact');

  // Reset button
  document.getElementById('btn-reset-typography')?.addEventListener('click', () => {
    appState.resetFontSizes();
    appState.updateSetting('fontFamily', 'Inter');
    appState.setFontStyle('regular');
    appState.setFontTarget('all');
    closeModal();
    openTypographyModal();
  });

  updatePreviewBox();
  if (window.lucide) window.lucide.createIcons();
}

/**
 * CVForge - Visual Template Gallery Modal Component (Structured 2-Step Workflow)
 * 
 * Step 1: Select CV Format (10 International Standard Formats)
 * Step 2: Select Template (Only templates for the selected format - 5 per format, never mixed)
 * 
 * Preserves 100% of candidate data across all switches.
 */

import { appState } from '../models/state.js';
import { TEMPLATES, FORMAT_CATEGORIES } from '../templates/index.js';

export function openTemplateGalleryModal() {
  const currentProfile = appState.getProfile();
  const currentFormat = currentProfile.format || 'reverse-chronological';

  let modal = document.getElementById('template-gallery-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'template-gallery-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs transition-opacity';
    document.body.appendChild(modal);
  }

  // Determine initial view: if currentFormat belongs to a category, we can start in Step 1 or Step 2.
  // The user prompt mandates:
  // "Step 1 – Select CV Format: Display the 10 format categories clearly as separate cards or sections"
  // "Step 2 – Select Template: Clicking a format shows ONLY the templates belonging to that format."
  let currentStep = 'formats'; // 'formats' | 'templates'
  let selectedFormatCatId = 'professional';

  // If user opens, check what category current format belongs to
  const currentTmpl = TEMPLATES[currentFormat];
  if (currentTmpl && currentTmpl.formatCategory) {
    selectedFormatCatId = currentTmpl.formatCategory;
  }

  const close = () => {
    modal.remove();
  };

  const render = () => {
    if (currentStep === 'formats') {
      renderStep1Formats();
    } else {
      renderStep2Templates();
    }
  };

  // STEP 1: SELECT CV FORMAT (10 FORMAT CARDS)
  const renderStep1Formats = () => {
    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-slate-800/40">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
              <i data-lucide="layout-grid" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">Step 1 of 2</span>
                <h3 class="text-base font-extrabold text-slate-900 dark:text-white">Select CV Format</h3>
              </div>
              <p class="text-xs text-slate-500">Choose from 10 international CV formats. Each format provides 5 distinct layout templates.</p>
            </div>
          </div>
          <button type="button" id="btn-close-gallery" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg" aria-label="Close Gallery">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Format Categories Grid (10 Cards) -->
        <div class="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 text-xs">
          ${FORMAT_CATEGORIES.map((cat, idx) => {
            const catTemplates = Object.values(TEMPLATES).filter(t => t.formatCategory === cat.id);
            const isCategoryActive = (currentTmpl && currentTmpl.formatCategory === cat.id);
            const schematicHtml = getSchematicThumbnail(cat.schematic);

            return `
              <div class="format-category-card group border-2 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between cursor-pointer bg-white dark:bg-slate-800/50 hover:border-blue-500 hover:shadow-md ${
                isCategoryActive 
                  ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20' 
                  : 'border-slate-200 dark:border-slate-700'
              }" data-cat-id="${cat.id}">
                
                <div>
                  <!-- Schematic Preview Box -->
                  <div class="h-28 w-full rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 mb-3 flex flex-col justify-between overflow-hidden pointer-events-none select-none group-hover:scale-[1.02] transition-transform">
                    ${schematicHtml}
                  </div>

                  <!-- Badge & Number -->
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">#${String(idx + 1).padStart(2, '0')}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      ${catTemplates.length} Templates
                    </span>
                  </div>

                  <!-- Format Title -->
                  <h4 class="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    ${cat.name}
                  </h4>
                  <div class="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-1.5">${cat.subtitle}</div>

                  <!-- Description -->
                  <p class="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    ${cat.description}
                  </p>
                </div>

                <!-- Action Button -->
                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" class="btn-browse-format w-full py-2 px-3 bg-slate-100 group-hover:bg-blue-600 text-slate-700 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-blue-600 dark:group-hover:text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-xs" data-cat-id="${cat.id}">
                    <span>Browse Templates</span>
                    <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Footer -->
        <div class="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <div>Select any format above to explore its dedicated collection of 5 distinct templates.</div>
          <button type="button" id="btn-close-gallery-footer" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
            Cancel
          </button>
        </div>

      </div>
    `;

    attachStep1Handlers();
  };

  // STEP 2: SELECT TEMPLATE (ONLY TEMPLATES FOR SELECTED FORMAT)
  const renderStep2Templates = () => {
    const cat = FORMAT_CATEGORIES.find(c => c.id === selectedFormatCatId) || FORMAT_CATEGORIES[0];
    // Filter templates STRICTLY belonging to this format (no mixing across formats!)
    const templatesList = Object.values(TEMPLATES).filter(t => t.formatCategory === cat.id);

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header with Back Button -->
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-slate-800/40">
          <div class="flex items-center gap-3">
            <button type="button" id="btn-back-to-formats" class="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs" title="Return to All Formats">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
              <span>Back to All Formats</span>
            </button>
            <div class="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">Step 2 of 2</span>
                <h3 class="text-base font-extrabold text-slate-900 dark:text-white">${cat.name} Templates</h3>
              </div>
              <p class="text-xs text-slate-500">Showing 5 templates designed specifically for <strong>${cat.name}</strong>. Never mixed with other formats.</p>
            </div>
          </div>
          <button type="button" id="btn-close-gallery" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg" aria-label="Close Gallery">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Template Cards Grid (Dedicated 5 Templates) -->
        <div class="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 text-xs">
          ${templatesList.map(tmpl => {
            const isSelected = (tmpl.id === currentFormat);
            const schematicHtml = getSchematicThumbnail(tmpl.schematic || cat.schematic);

            return `
              <div class="template-card border-2 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between ${
                isSelected 
                  ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20' 
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-blue-400 hover:shadow-sm'
              }" data-format-id="${tmpl.id}">
                
                <div>
                  <!-- Schematic Preview Box -->
                  <div class="h-32 w-full rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 mb-3 flex flex-col justify-between overflow-hidden pointer-events-none select-none">
                    ${schematicHtml}
                  </div>

                  <!-- Active Badge -->
                  ${isSelected ? `
                    <div class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 mb-2 border border-emerald-200 dark:border-emerald-800">
                      <i data-lucide="check" class="w-3 h-3"></i>
                      <span>Currently Active</span>
                    </div>
                  ` : ''}

                  <!-- Template Name -->
                  <h4 class="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                    ${tmpl.name}
                  </h4>

                  <!-- Key Visual Features Badge -->
                  <div class="mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span class="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Visual Features</span>
                    <p class="text-[11px] text-slate-700 dark:text-slate-300 leading-tight">
                      ${tmpl.features || tmpl.tagline}
                    </p>
                  </div>

                  <!-- Best For -->
                  <div class="mt-2 text-[10px] text-slate-500 leading-normal">
                    <span class="font-bold text-slate-600 dark:text-slate-400">Best for:</span> ${tmpl.bestFor || 'General professional applications'}
                  </div>
                </div>

                <!-- Apply Button -->
                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" class="btn-select-template w-full py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs ${
                    isSelected 
                      ? 'bg-emerald-600 text-white cursor-default' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                  }" data-format-id="${tmpl.id}">
                    <i data-lucide="${isSelected ? 'check-circle' : 'file-check'}" class="w-3.5 h-3.5"></i>
                    <span>${isSelected ? 'Active Template' : 'Apply This Template'}</span>
                  </button>
                </div>

              </div>
            `;
          }).join('')}
        </div>

        <!-- Footer -->
        <div class="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <button type="button" id="btn-footer-back-to-formats" class="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
            <span>Browse Other Formats</span>
          </button>
          <div class="text-[11px] text-slate-500">
            Applying a template updates your live preview immediately. 100% of candidate data is preserved.
          </div>
        </div>

      </div>
    `;

    attachStep2Handlers();
  };

  const attachStep1Handlers = () => {
    document.getElementById('btn-close-gallery')?.addEventListener('click', close);
    document.getElementById('btn-close-gallery-footer')?.addEventListener('click', close);

    // Card click or Browse button click
    modal.querySelectorAll('.format-category-card, .btn-browse-format').forEach(el => {
      el.addEventListener('click', (e) => {
        const catId = el.getAttribute('data-cat-id');
        if (catId) {
          selectedFormatCatId = catId;
          currentStep = 'templates';
          render();
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  };

  const attachStep2Handlers = () => {
    document.getElementById('btn-close-gallery')?.addEventListener('click', close);
    
    // Back to Step 1
    const backToFormats = () => {
      currentStep = 'formats';
      render();
    };
    document.getElementById('btn-back-to-formats')?.addEventListener('click', backToFormats);
    document.getElementById('btn-footer-back-to-formats')?.addEventListener('click', backToFormats);

    // Apply template
    modal.querySelectorAll('.btn-select-template').forEach(btn => {
      btn.addEventListener('click', () => {
        const formatId = btn.getAttribute('data-format-id');
        if (formatId) {
          appState.setFormat(formatId);
          close();
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  };

  // Close on outer backdrop click
  modal.onclick = (e) => {
    if (e.target === modal) close();
  };

  // Initial render
  render();
}

/**
 * Generates schematic SVG/CSS wireframe thumbnails for formats and templates
 */
function getSchematicThumbnail(type) {
  switch (type) {
    case 'academic-green':
      return `
        <div class="flex h-full rounded overflow-hidden border border-[#7aa350]">
          <div class="w-1/3 bg-[#7aa350]/20 p-1 space-y-1">
            <div class="w-4 h-4 rounded-full bg-[#7aa350] mx-auto mb-1"></div>
            <div class="h-1 w-full bg-[#7aa350] rounded-xs"></div>
            <div class="h-1 w-3/4 bg-slate-300 dark:bg-slate-700 rounded-xs"></div>
          </div>
          <div class="w-2/3 p-1.5 space-y-1 bg-white dark:bg-slate-900">
            <div class="h-1.5 w-1/2 bg-[#7aa350] rounded-xs"></div>
            <div class="h-0.5 w-full bg-[#7aa350] my-0.5"></div>
            <div class="h-1 w-full bg-slate-300 dark:bg-slate-700 rounded-xs"></div>
            <div class="h-1 w-4/5 bg-slate-300 dark:bg-slate-700 rounded-xs"></div>
          </div>
        </div>
      `;
    case 'bd-classic':
      return `
        <div class="space-y-1 text-center bg-white dark:bg-slate-900 p-1 border-2 border-emerald-800 dark:border-emerald-600 h-full flex flex-col justify-between">
          <div>
            <div class="h-2 w-3/5 bg-emerald-800 dark:bg-emerald-600 rounded-xs mx-auto"></div>
            <div class="h-1 w-2/3 bg-slate-400 rounded-xs mx-auto mt-0.5"></div>
          </div>
          <div class="border border-emerald-700 p-0.5 rounded-xs space-y-0.5">
            <div class="h-1 w-full bg-emerald-100 dark:bg-emerald-950 rounded-xs"></div>
            <div class="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-xs"></div>
          </div>
          <div class="text-[7px] text-emerald-800 dark:text-emerald-400 font-bold">Bordered Standard</div>
        </div>
      `;
    case 'executive-bluebar':
      return `
        <div class="space-y-1 text-left bg-white dark:bg-slate-900 p-1 border border-slate-300 dark:border-slate-700 h-full">
          <div class="h-2 w-1/2 bg-[#3b5998] rounded-xs"></div>
          <div class="p-1 bg-[#a6c2e2]/60 dark:bg-[#3b5998]/40 rounded-xs text-[7px] font-bold text-slate-800 dark:text-slate-200">BLUE BANNER HEADER</div>
          <div class="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-xs"></div>
          <div class="p-1 bg-[#a6c2e2]/60 dark:bg-[#3b5998]/40 rounded-xs text-[7px] font-bold text-slate-800 dark:text-slate-200">ACADEMIC CREDENTIALS</div>
          <div class="h-1 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-xs"></div>
        </div>
      `;
    case 'ats':
      return `
        <div class="space-y-1 text-left bg-white dark:bg-slate-900 p-1.5 border border-black dark:border-slate-600 h-full">
          <div class="h-1.5 w-1/2 bg-black dark:bg-white rounded-xs"></div>
          <div class="h-0.5 w-full bg-black dark:bg-white my-1"></div>
          <div class="h-1 w-1/3 bg-black dark:bg-slate-300 rounded-xs"></div>
          <div class="h-1 w-full bg-slate-300 dark:bg-slate-700 rounded-xs"></div>
          <div class="h-1 w-5/6 bg-slate-300 dark:bg-slate-700 rounded-xs"></div>
        </div>
      `;
    case 'creative':
      return `
        <div class="flex h-full rounded overflow-hidden border border-slate-300 dark:border-slate-700">
          <div class="w-1/3 bg-purple-700 p-1 flex flex-col items-center justify-between">
            <div class="w-3 h-3 rounded-full bg-white/40 mb-1"></div>
            <div class="w-full space-y-1"><div class="h-1 w-full bg-white/30 rounded-xs"></div><div class="h-1 w-2/3 bg-white/30 rounded-xs"></div></div>
          </div>
          <div class="w-2/3 p-1.5 space-y-1 bg-white dark:bg-slate-900">
            <div class="h-1.5 w-1/2 bg-purple-700 rounded-xs"></div>
            <div class="h-1 w-full bg-slate-300 dark:bg-slate-700 rounded-xs"></div>
            <div class="h-1 w-3/4 bg-slate-300 dark:bg-slate-700 rounded-xs"></div>
          </div>
        </div>
      `;
    case 'academic':
      return `
        <div class="space-y-1 text-center font-serif bg-white dark:bg-slate-900 p-1.5 border border-slate-300 dark:border-slate-700 h-full">
          <div class="h-2 w-1/2 bg-amber-800 rounded-xs mx-auto"></div>
          <div class="h-1 w-1/3 bg-slate-400 rounded-xs mx-auto"></div>
          <div class="border-b border-amber-800 pb-0.5 text-left text-[7px] font-bold text-amber-800">PUBLICATIONS [DOI]</div>
          <div class="h-1 w-full bg-slate-300 dark:bg-slate-700 rounded-xs"></div>
        </div>
      `;
    case 'functional':
      return `
        <div class="space-y-1 bg-white dark:bg-slate-900 p-1.5 border border-slate-300 dark:border-slate-700 h-full">
          <div class="p-1 bg-blue-600 rounded text-white flex justify-between items-center"><div class="h-1 w-1/3 bg-white rounded-xs"></div></div>
          <div class="grid grid-cols-2 gap-1 pt-0.5">
            <div class="border border-slate-300 dark:border-slate-700 p-1 rounded"><div class="h-1 w-2/3 bg-slate-400 rounded-xs"></div></div>
            <div class="border border-slate-300 dark:border-slate-700 p-1 rounded"><div class="h-1 w-2/3 bg-slate-400 rounded-xs"></div></div>
          </div>
        </div>
      `;
    case 'technical':
      return `
        <div class="space-y-1 bg-slate-950 p-1.5 rounded border border-slate-800 text-white font-mono h-full">
          <div class="text-[7px] text-emerald-400 font-bold">$ dev_profile</div>
          <div class="flex gap-1"><div class="h-1 w-1/3 bg-sky-500 rounded-xs"></div><div class="h-1 w-1/4 bg-sky-300 rounded-xs"></div></div>
          <div class="p-1 bg-slate-900 rounded border border-slate-800"><div class="h-1 w-full bg-slate-700 rounded-xs"></div></div>
        </div>
      `;
    case 'entry':
      return `
        <div class="space-y-1 bg-white dark:bg-slate-900 p-1.5 border-t-2 border-blue-600 border-x border-b border-slate-200 dark:border-slate-700 h-full">
          <div class="h-1.5 w-1/2 bg-blue-600 rounded-xs mx-auto"></div>
          <div class="p-1 bg-blue-50 dark:bg-blue-950/60 rounded border border-blue-200 dark:border-blue-800 text-[7px] text-blue-900 dark:text-blue-200 font-bold">
            EDUCATION FIRST
          </div>
          <div class="h-1 w-full bg-slate-300 dark:bg-slate-700 rounded-xs"></div>
        </div>
      `;
    case 'europass':
      return `
        <div class="space-y-1 bg-white dark:bg-slate-900 p-1.5 border-l-2 border-[#0e4194] border-y border-r border-slate-200 dark:border-slate-700 h-full">
          <div class="flex items-center gap-1 border-b border-slate-300 pb-0.5">
            <div class="w-2.5 h-2.5 bg-[#0e4194] rounded-xs text-[6px] text-white flex items-center justify-center font-bold">eu</div>
            <div class="h-1 w-1/3 bg-[#0e4194] rounded-xs"></div>
          </div>
          <div class="grid grid-cols-12 gap-1 pt-0.5">
            <div class="col-span-4 h-1 bg-[#0e4194] rounded-xs"></div>
            <div class="col-span-8 h-1 bg-slate-300 dark:bg-slate-700 rounded-xs"></div>
          </div>
        </div>
      `;
    default:
      return `
        <div class="space-y-1.5 text-center bg-white dark:bg-slate-900 p-1.5 border border-slate-300 dark:border-slate-700 h-full">
          <div class="h-2 w-1/2 bg-blue-600 rounded-xs mx-auto"></div>
          <div class="h-1 w-3/4 bg-slate-300 dark:bg-slate-700 rounded-xs mx-auto"></div>
          <div class="border-t border-slate-200 dark:border-slate-800 pt-1 space-y-1 text-left">
            <div class="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-xs"></div>
            <div class="h-1 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-xs"></div>
          </div>
        </div>
      `;
  }
}

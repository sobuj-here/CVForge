/**
 * CVForge - International Country Guidance & Conventions Modal
 */

import { COUNTRY_RULES } from '../engine/countryRules.js';
import { appState } from '../models/state.js';

export function openCountryModal() {
  const currentCountry = appState.getProfile().country || 'US';

  let modal = document.getElementById('country-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'country-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity';
    document.body.appendChild(modal);
  }

  const renderModalContent = (selectedCode) => {
    const rule = COUNTRY_RULES[selectedCode] || COUNTRY_RULES['US'];

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <i data-lucide="globe" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Target Country Guidelines</h3>
              <p class="text-xs text-slate-500">Recruitment standards and conventions by country</p>
            </div>
          </div>
          <button type="button" id="btn-close-country" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
          
          <!-- Search & Country Pill Selector -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-bold text-slate-800 dark:text-slate-200">Select Target Destination Country:</label>
              <div class="relative w-48">
                <input type="text" id="inp-search-country" placeholder="Search country..." class="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 px-2.5 py-1 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
            <div id="country-pills-container" class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              ${Object.entries(COUNTRY_RULES).map(([code, c]) => {
                const displayName = c.countryName.replace(/\s*\(.*\)/, '');
                return `
                <button type="button" class="btn-select-country-pill p-2 rounded-lg border text-left font-bold transition flex items-center justify-between ${code === selectedCode ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 shadow-xs' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}" data-code="${code}" data-name="${displayName.toLowerCase()}">
                  <span class="truncate">${displayName}</span>
                  <span class="text-[10px] font-mono px-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0 ml-1">${code}</span>
                </button>
              `}).join('')}
            </div>
          </div>

          <!-- Country Details Card -->
          <div class="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/60 pb-2.5">
              <div>
                <span class="text-slate-500 text-[11px]">Standard Term:</span>
                <span class="font-bold text-slate-900 dark:text-white text-sm ml-1">${rule.documentTerm}</span>
              </div>
              <div>
                <span class="text-slate-500 text-[11px]">Recommended Paper:</span>
                <span class="font-bold text-slate-900 dark:text-white ml-1">${rule.paperSize}</span>
              </div>
              <div>
                <span class="text-slate-500 text-[11px]">Photo:</span>
                <span class="font-bold ${rule.photoRecommended ? 'text-emerald-600' : 'text-red-500'} ml-1">
                  ${rule.photoRecommended ? 'Standard / Recommended' : 'Strictly Avoid'}
                </span>
              </div>
            </div>

            <div>
              <div class="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Essential Recruitment Guidelines for ${rule.countryName}:
              </div>
              <ul class="space-y-1.5 list-disc list-outside ml-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                ${rule.guidelines.map(g => `<li>${g}</li>`).join('')}
              </ul>
            </div>

            <div class="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <span class="text-[11px] text-slate-500">Typical Page Length: </span>
                <strong class="text-slate-800 dark:text-slate-200">${rule.typicalLength}</strong>
              </div>
              <button type="button" id="btn-apply-country-rules" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm text-xs transition" data-code="${selectedCode}">
                Apply ${rule.countryName} Conventions
              </button>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button type="button" id="btn-close-country-footer" class="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-bold text-slate-800 dark:text-white transition">
            Close
          </button>
        </div>

      </div>
    `;

    const close = () => modal.classList.add('hidden');
    modal.classList.remove('hidden');

    document.getElementById('btn-close-country')?.addEventListener('click', close);
    document.getElementById('btn-close-country-footer')?.addEventListener('click', close);

    // Search filter
    const searchInp = document.getElementById('inp-search-country');
    if (searchInp) {
      searchInp.oninput = (e) => {
        const query = e.target.value.toLowerCase().trim();
        modal.querySelectorAll('.btn-select-country-pill').forEach(pill => {
          const name = pill.getAttribute('data-name') || '';
          const code = (pill.getAttribute('data-code') || '').toLowerCase();
          if (!query || name.includes(query) || code.includes(query)) {
            pill.classList.remove('hidden');
          } else {
            pill.classList.add('hidden');
          }
        });
      };
    }

    // Pill selectors
    modal.querySelectorAll('.btn-select-country-pill').forEach(btn => {
      btn.onclick = () => {
        const code = btn.getAttribute('data-code');
        renderModalContent(code);
      };
    });

    // Apply button
    document.getElementById('btn-apply-country-rules')?.addEventListener('click', () => {
      appState.setCountry(selectedCode);
      close();
    });

    if (window.lucide) window.lucide.createIcons();
  };

  renderModalContent(currentCountry);
}

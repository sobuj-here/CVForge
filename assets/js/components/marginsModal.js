/**
 * CVForge - Page Margins & Millimeter Control Modal Component
 * Allows independent Top, Bottom, Left, and Right millimeter (mm) margin controls,
 * replacing restrictive 12mm-24mm preset boundaries.
 */

import { appState } from '../models/state.js';

export function openMarginsModal() {
  let modal = document.getElementById('margins-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'margins-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity';
    document.body.appendChild(modal);
  }

  const profile = appState.getProfile();
  const settings = profile.settings || {};
  const margins = settings.marginsCustom || { top: 15, bottom: 15, left: 15, right: 15 };

  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <i data-lucide="maximize-2" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Page Margins</h3>
            <p class="text-xs text-slate-500">Adjust page spacing for print, PDF, and Word exports</p>
          </div>
        </div>
        <button type="button" id="btn-close-margins-modal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
        
        <!-- Quick Preset Pills -->
        <div>
          <label class="block font-bold text-slate-900 dark:text-white text-xs mb-2">Presets:</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button type="button" class="btn-preset-margin py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800 font-semibold text-center transition" data-all="15">
              Standard (15mm)
            </button>
            <button type="button" class="btn-preset-margin py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800 font-semibold text-center transition" data-all="10">
              Compact (10mm)
            </button>
            <button type="button" class="btn-preset-margin py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800 font-semibold text-center transition" data-all="8">
              Narrow (8mm)
            </button>
            <button type="button" class="btn-preset-margin py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800 font-semibold text-center transition" data-all="20">
              Spacious (20mm)
            </button>
          </div>
        </div>

        <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-4">
          <label class="block font-bold text-slate-900 dark:text-white text-xs">Custom Margins (5mm – 50mm):</label>
          
          <div class="grid grid-cols-2 gap-4">
            <!-- Top Margin -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-slate-700 dark:text-slate-300">Top Margin:</span>
                <div class="flex items-center gap-1">
                  <input type="number" id="inp-margin-top" min="5" max="50" step="1" value="${margins.top}" class="w-14 text-center font-bold font-mono text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white py-1" />
                  <span class="text-[11px] font-bold text-slate-500">mm</span>
                </div>
              </div>
              <input type="range" id="rng-margin-top" min="5" max="50" step="1" value="${margins.top}" class="w-full accent-blue-600" />
            </div>

            <!-- Bottom Margin -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-slate-700 dark:text-slate-300">Bottom Margin:</span>
                <div class="flex items-center gap-1">
                  <input type="number" id="inp-margin-bottom" min="5" max="50" step="1" value="${margins.bottom}" class="w-14 text-center font-bold font-mono text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white py-1" />
                  <span class="text-[11px] font-bold text-slate-500">mm</span>
                </div>
              </div>
              <input type="range" id="rng-margin-bottom" min="5" max="50" step="1" value="${margins.bottom}" class="w-full accent-blue-600" />
            </div>

            <!-- Left Margin -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-slate-700 dark:text-slate-300">Left Margin:</span>
                <div class="flex items-center gap-1">
                  <input type="number" id="inp-margin-left" min="5" max="50" step="1" value="${margins.left}" class="w-14 text-center font-bold font-mono text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white py-1" />
                  <span class="text-[11px] font-bold text-slate-500">mm</span>
                </div>
              </div>
              <input type="range" id="rng-margin-left" min="5" max="50" step="1" value="${margins.left}" class="w-full accent-blue-600" />
            </div>

            <!-- Right Margin -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-slate-700 dark:text-slate-300">Right Margin:</span>
                <div class="flex items-center gap-1">
                  <input type="number" id="inp-margin-right" min="5" max="50" step="1" value="${margins.right}" class="w-14 text-center font-bold font-mono text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white py-1" />
                  <span class="text-[11px] font-bold text-slate-500">mm</span>
                </div>
              </div>
              <input type="range" id="rng-margin-right" min="5" max="50" step="1" value="${margins.right}" class="w-full accent-blue-600" />
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
        <button type="button" id="btn-reset-margins" class="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition flex items-center gap-1">
          <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
          <span>Reset to Defaults</span>
        </button>
        <button type="button" id="btn-done-margins" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition shadow-xs">
          Done
        </button>
      </div>

    </div>
  `;

  const closeModal = () => modal.remove();
  document.getElementById('btn-close-margins-modal')?.addEventListener('click', closeModal);
  document.getElementById('btn-done-margins')?.addEventListener('click', closeModal);
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };

  // Sync inputs and ranges
  const bindPair = (inpId, rngId, key) => {
    const inp = document.getElementById(inpId);
    const rng = document.getElementById(rngId);
    if (!inp || !rng) return;

    const update = (val) => {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        inp.value = num;
        rng.value = num;
        const cur = appState.getProfile().settings.marginsCustom || { top: 15, bottom: 15, left: 15, right: 15 };
        cur[key] = num;
        appState.setMarginsCustom(cur);
      }
    };

    inp.oninput = () => update(inp.value);
    rng.oninput = () => update(rng.value);
  };

  bindPair('inp-margin-top', 'rng-margin-top', 'top');
  bindPair('inp-margin-bottom', 'rng-margin-bottom', 'bottom');
  bindPair('inp-margin-left', 'rng-margin-left', 'left');
  bindPair('inp-margin-right', 'rng-margin-right', 'right');

  // Preset buttons
  document.querySelectorAll('.btn-preset-margin').forEach(btn => {
    btn.onclick = () => {
      const allVal = parseFloat(btn.getAttribute('data-all'));
      appState.setMarginsCustom({ top: allVal, bottom: allVal, left: allVal, right: allVal });
      openMarginsModal(); // re-render
    };
  });

  // Reset to default
  document.getElementById('btn-reset-margins')?.addEventListener('click', () => {
    appState.resetMarginsCustom();
    openMarginsModal(); // re-render
  });

  if (window.lucide) window.lucide.createIcons();
}

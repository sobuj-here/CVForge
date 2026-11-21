/**
 * CVForge - Clear Data & Reset Confirmation Modal Component
 * Ensures user safety before clearing candidate information:
 * 1. Offers one-click JSON backup export first
 * 2. Clearly explains what will be cleared vs. what is preserved (settings, themes, custom templates)
 * 3. Requires explicit user confirmation
 */

import { appState } from '../models/state.js';
import { exportProfileToJson } from '../export/jsonExporter.js';

export function openClearDataModal() {
  let modal = document.getElementById('clear-data-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'clear-data-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity';
    document.body.appendChild(modal);
  }

  const profile = appState.getProfile();
  const candidateName = profile.personal?.fullName || 'Candidate Profile';

  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Header -->
      <div class="px-6 py-4 border-b border-red-100 dark:border-red-950/60 bg-red-50/50 dark:bg-red-950/30 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <i data-lucide="alert-triangle" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Clear Candidate Data</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Safely start fresh without losing your layout preferences</p>
          </div>
        </div>
        <button type="button" id="btn-close-clear-modal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg" aria-label="Close">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-4 text-xs text-slate-700 dark:text-slate-300">
        
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Are you sure you want to clear your current candidate information? All personal details, work experience, education, skills, projects, and certifications will be reset to a clean blank state.
        </p>

        <!-- What is preserved card -->
        <div class="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
          <div class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i>
            <span>What Will Be Preserved:</span>
          </div>
          <ul class="text-[11px] text-slate-500 dark:text-slate-400 list-disc list-inside space-y-1">
            <li>Your chosen workspace theme and accent colors</li>
            <li>Typography settings, point sizes (pt), and margin preferences</li>
            <li>All custom imported and built-in templates</li>
            <li>Your destination country and regional formatting rules</li>
          </ul>
        </div>

        <!-- Recommended: Download Backup First -->
        <div class="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-2">
          <div class="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
            <i data-lucide="download" class="w-4 h-4 text-blue-600"></i>
            <span>Recommended: Download Backup First</span>
          </div>
          <p class="text-[11px] text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
            Download your current CV data as a portable JSON file so you can easily restore it at any time.
          </p>
          <div>
            <button type="button" id="btn-backup-before-clear" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5 shadow-xs">
              <i data-lucide="file-json" class="w-3.5 h-3.5"></i>
              <span>Download JSON Backup Now</span>
            </button>
            <span id="backup-success-indicator" class="hidden text-[10px] text-emerald-600 font-bold ml-2">✓ Backup downloaded!</span>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
        <button type="button" id="btn-cancel-clear" class="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition">
          Cancel (Keep My Data)
        </button>
        <button type="button" id="btn-confirm-clear" class="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-xs flex items-center gap-1.5">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          <span>Yes, Clear Candidate Data</span>
        </button>
      </div>

    </div>
  `;

  const close = () => modal.remove();
  document.getElementById('btn-close-clear-modal')?.addEventListener('click', close);
  document.getElementById('btn-cancel-clear')?.addEventListener('click', close);
  modal.onclick = (e) => { if (e.target === modal) close(); };

  // Backup first button
  document.getElementById('btn-backup-before-clear')?.addEventListener('click', () => {
    exportProfileToJson(profile, `CVForge_Backup_${candidateName.replace(/\s+/g, '_')}.json`);
    const ind = document.getElementById('backup-success-indicator');
    if (ind) ind.classList.remove('hidden');
  });

  // Confirm clear button
  document.getElementById('btn-confirm-clear')?.addEventListener('click', () => {
    appState.clearAllCandidateData(true);
    close();
  });

  if (window.lucide) window.lucide.createIcons();
}

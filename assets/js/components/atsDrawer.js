/**
 * CVForge - ATS (Applicant Tracking System) Compatibility Audit Drawer & Modal
 * Rule-based heuristic analysis with individual checks, problem detection, and explicit non-guarantee.
 */

import { runAtsAudit } from '../engine/atsEngine.js';
import { appState } from '../models/state.js';

export function openAtsModal() {
  const profile = appState.getProfile();
  const audit = runAtsAudit(profile);

  let modal = document.getElementById('ats-audit-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'ats-audit-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs transition-opacity';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-xs">
            <i data-lucide="shield-check" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white">ATS Heuristic Audit Engine</h3>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Rule-Based Analysis
              </span>
            </div>
            <p class="text-xs text-slate-500">Heuristic check against parsing architectures (Workday, Taleo, Greenhouse, iCIMS)</p>
          </div>
        </div>
        <button type="button" id="btn-close-ats" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg" aria-label="Close ATS Modal">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
        
        <!-- Score Banner -->
        <div class="p-5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${audit.tierColor}">
          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider">Algorithmic Match Score</div>
            <div class="text-3xl font-black mt-0.5">${audit.score} <span class="text-lg font-normal">/ 100</span></div>
            <div class="text-xs font-semibold mt-1">${audit.tier}</div>
          </div>
          <div class="text-right">
            ${profile.format !== 'ats-friendly' ? `
              <button type="button" id="btn-switch-ats-format" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm text-xs transition flex items-center gap-1.5">
                <i data-lucide="zap" class="w-3.5 h-3.5"></i>
                Switch to ATS-Friendly Format
              </button>
            ` : `
              <span class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800">
                <i data-lucide="check" class="w-4 h-4"></i> Single-Column ATS Format Active
              </span>
            `}
          </div>
        </div>

        <!-- Non-Guarantee Transparency Disclaimer (Mandatory Requirement) -->
        <div class="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
          <strong>Important ATS Disclaimer:</strong> No software can guarantee 100% ATS success or employment interviews, as parsing algorithms vary across company configurations. This checker provides actionable best-practice recommendations to maximize machine parseability and human recruiter clarity.
        </div>

        <!-- Detected Issues & Problems -->
        ${audit.warnings.length > 0 ? `
          <div class="space-y-2">
            <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-600">
              <i data-lucide="alert-triangle" class="w-4 h-4"></i> Detected Issues (${audit.warnings.length})
            </h4>
            <div class="space-y-1.5">
              ${audit.warnings.map(w => `
                <div class="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <span class="text-amber-600 font-bold shrink-0">!</span>
                  <span>${w}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Actionable Suggestions -->
        ${audit.suggestions.length > 0 ? `
          <div class="space-y-2">
            <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-blue-600">
              <i data-lucide="lightbulb" class="w-4 h-4"></i> Actionable Suggestions
            </h4>
            <div class="space-y-1.5">
              ${audit.suggestions.map(s => `
                <div class="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200 flex items-start gap-2">
                  <span class="text-blue-600 font-bold shrink-0">→</span>
                  <span>${s}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Passed Checks -->
        <div class="space-y-2">
          <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-600">
            <i data-lucide="check-circle-2" class="w-4 h-4"></i> Verified Checks (${audit.passed.length})
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            ${audit.passed.map(p => `
              <div class="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                <span class="text-emerald-500 font-bold">✓</span>
                <span>${p}</span>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
        <span class="text-slate-500">Heuristic scores update live as you edit</span>
        <button type="button" id="btn-close-ats-footer" class="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-bold text-slate-800 dark:text-white transition">
          Close Audit
        </button>
      </div>

    </div>
  `;

  const close = () => modal.classList.add('hidden');
  modal.classList.remove('hidden');

  document.getElementById('btn-close-ats')?.addEventListener('click', close);
  document.getElementById('btn-close-ats-footer')?.addEventListener('click', close);

  document.getElementById('btn-switch-ats-format')?.addEventListener('click', () => {
    appState.setFormat('ats-friendly');
    close();
  });

  if (window.lucide) window.lucide.createIcons();
}

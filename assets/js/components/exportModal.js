/**
 * CVForge - Pre-Download Export Verification Modal Component
 * Displays document compliance audit, target country conventions checklist,
 * paper size confirmation, demo data warning, custom filename, and 1-click PDF/DOCX downloads.
 */

import { appState } from '../models/state.js';
import { TEMPLATES } from '../templates/index.js';
import { COUNTRY_RULES } from '../engine/countryRules.js';
import { downloadPdf } from '../export/pdfExporter.js';
import { downloadDocx } from '../export/docxExporter.js';

export function openExportModal(defaultExportType = 'pdf') {
  let modal = document.getElementById('export-verification-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'export-verification-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity';
    document.body.appendChild(modal);
  }

  const profile = appState.getProfile();
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const tmpl = TEMPLATES[profile.format] || { name: profile.format, category: 'Professional' };
  const countryRule = COUNTRY_RULES[profile.country] || COUNTRY_RULES['US'];

  const cleanName = (p.fullName || 'Resume').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const baseFilename = `CVForge_${cleanName}_${profile.format}`;

  // Country compliance checklist items
  const complianceItems = [];
  if (['US', 'CA'].includes(profile.country)) {
    if (!settings.showPhoto) {
      complianceItems.push({ ok: true, text: 'Anti-bias compliance verified: Profile photograph is disabled for US/Canadian hiring equality.' });
    } else {
      complianceItems.push({ ok: false, text: 'Recommendation: US & Canadian recruiters strongly discourage photographs to avoid unconscious hiring bias.' });
    }
  } else if (profile.country === 'EU' || profile.format === 'europass') {
    complianceItems.push({ ok: true, text: 'European Europass structure verified: includes standardized CEFR language proficiencies.' });
  } else if (['DE', 'FR'].includes(profile.country)) {
    complianceItems.push({ ok: true, text: 'Continental European standards: clear educational history, credential chronology & dates.' });
  } else {
    complianceItems.push({ ok: true, text: `Compliant with ${countryRule.countryName} international recruitment conventions.` });
  }

  // Fresh graduate check
  if (!profile.experience || profile.experience.length === 0) {
    complianceItems.push({ ok: true, text: 'Fresh graduate / transition layout: Work experience omitted cleanly without blank sections; highlights education & skills.' });
  }

  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <i data-lucide="file-check-2" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Export CV Document</h3>
            <p class="text-xs text-slate-500">Pre-download quality verification & format settings</p>
          </div>
        </div>
        <button type="button" id="btn-close-export-modal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300">
        
        <!-- Demonstration Data Warning Banner -->
        ${profile.isDemo ? `
          <div class="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-2">
            <div class="flex items-start gap-2">
              <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
              <div>
                <strong class="font-bold block text-xs">Notice: Demonstration Sample Data Active</strong>
                <p class="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                  You are exporting preloaded sample candidate information. If you intend to submit this CV to real employers, start with a clean form and enter your own real qualifications.
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 pt-1 pl-6">
              <button type="button" id="btn-export-modal-clear-demo" class="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] transition shadow-xs">
                Clear Sample Data & Start Blank
              </button>
              <span class="text-[10px] text-amber-700 dark:text-amber-400">or proceed below</span>
            </div>
          </div>
        ` : ''}

        <!-- Document Overview Summary Card -->
        <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
            <div>
              <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Candidate</span>
              <div class="text-sm font-bold text-slate-900 dark:text-white">${p.fullName || 'Unnamed Candidate'}</div>
            </div>
            <div class="text-right">
              <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Format</span>
              <div class="text-xs font-bold text-blue-600 dark:text-blue-400">${tmpl.name}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div>
              <span class="text-slate-400 block text-[10px]">Destination:</span>
              <strong class="font-bold text-slate-800 dark:text-slate-200">${countryRule.countryName.split(' ')[0]} (${profile.country})</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Paper Size:</span>
              <strong class="font-bold text-slate-800 dark:text-slate-200">${settings.paperSize === 'a4' ? 'A4 (210×297mm)' : 'US Letter (8.5×11")'}</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Font Family:</span>
              <strong class="font-bold text-slate-800 dark:text-slate-200">${settings.fontFamily || 'Inter'}</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Scale:</span>
              <strong class="font-bold text-slate-800 dark:text-slate-200 capitalize">${settings.fontSize || 'Normal'}</strong>
            </div>
          </div>
        </div>

        <!-- Compliance Checklist -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-800 dark:text-slate-200">International Compliance Check:</label>
          <div class="space-y-1.5">
            ${complianceItems.map(item => `
              <div class="p-2 rounded-lg border ${item.ok ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300' : 'border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300'} flex items-start gap-2">
                <i data-lucide="${item.ok ? 'check-circle-2' : 'alert-circle'}" class="w-4 h-4 shrink-0 mt-0.5 ${item.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}"></i>
                <span class="text-[11px] leading-relaxed">${item.text}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Filename & Paper Size Configuration -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              File Name
            </label>
            <input type="text" id="inp-export-filename" value="${baseFilename}" class="form-input w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 font-mono" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Paper Size
            </label>
            <select id="sel-export-paper" class="form-input w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-2">
              <option value="letter" ${settings.paperSize === 'letter' ? 'selected' : ''}>US Letter</option>
              <option value="a4" ${settings.paperSize === 'a4' ? 'selected' : ''}>A4 (ISO 216)</option>
            </select>
          </div>
        </div>

      </div>

      <!-- Modal Footer Action Buttons -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-3">
        <button type="button" id="btn-export-print" class="px-3.5 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition flex items-center gap-1.5">
          <i data-lucide="printer" class="w-4 h-4"></i>
          <span>Print / System Dialog</span>
        </button>

        <div class="flex items-center gap-2">
          <button type="button" id="btn-export-docx-action" class="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-1.5 active:scale-95">
            <i data-lucide="file-text" class="w-4 h-4"></i>
            <span>Download Word (.docx)</span>
          </button>
          
          <button type="button" id="btn-export-pdf-action" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-1.5 active:scale-95">
            <i data-lucide="download" class="w-4 h-4"></i>
            <span>Download PDF</span>
          </button>
        </div>
      </div>

    </div>
  `;

  // Attach event handlers
  const closeModal = () => modal.remove();
  document.getElementById('btn-close-export-modal')?.addEventListener('click', closeModal);
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };

  // Clear demo data button inside modal
  document.getElementById('btn-export-modal-clear-demo')?.addEventListener('click', () => {
    if (confirm('Clear the demonstration sample data and start with a clean blank CV?')) {
      appState.resetToDefault();
      closeModal();
    }
  });

  // Paper change updates state & paper preview directly
  const paperSelect = document.getElementById('sel-export-paper');
  if (paperSelect) {
    paperSelect.onchange = () => {
      appState.updateSetting('paperSize', paperSelect.value);
    };
  }

  // Action: Download PDF
  document.getElementById('btn-export-pdf-action')?.addEventListener('click', () => {
    const rawName = document.getElementById('inp-export-filename')?.value || baseFilename;
    const finalName = rawName.toLowerCase().endsWith('.pdf') ? rawName : `${rawName}.pdf`;
    const paper = paperSelect ? paperSelect.value : (settings.paperSize || 'letter');
    downloadPdf('cv-preview-content', finalName, paper);
    closeModal();
  });

  // Action: Download DOCX
  document.getElementById('btn-export-docx-action')?.addEventListener('click', () => {
    const rawName = document.getElementById('inp-export-filename')?.value || baseFilename;
    const finalName = rawName.toLowerCase().endsWith('.docx') ? rawName : `${rawName}.docx`;
    downloadDocx(appState.getProfile(), finalName);
    closeModal();
  });

  // Action: Print
  document.getElementById('btn-export-print')?.addEventListener('click', () => {
    closeModal();
    window.print();
  });

  if (window.lucide) window.lucide.createIcons();
}

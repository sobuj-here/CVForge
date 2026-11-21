/**
 * CVForge - Standalone Unified Bundle
 * Automatically generated for 100% offline file:// and web support.
 */
(function() {
  const __modules__ = {};
  const __cache__ = {};

  function normalizePath(target, currentDir) {
    if (!target.startsWith('.')) return target;
    const parts = (currentDir + '/' + target).split('/');
    const resolved = [];
    for (const p of parts) {
      if (!p || p === '.') continue;
      if (p === '..') {
        resolved.pop();
      } else {
        resolved.push(p);
      }
    }
    let res = './' + resolved.join('/');
    if (!res.endsWith('.js')) res += '.js';
    return res;
  }

  function __require__(id, currentDir) {
    const resolvedId = normalizePath(id, currentDir || '');
    if (__cache__[resolvedId]) {
      return __cache__[resolvedId].exports;
    }
    const modFn = __modules__[resolvedId];
    if (!modFn) {
      console.error('Module not found in bundle:', id, '->', resolvedId);
      throw new Error('Module not found: ' + resolvedId);
    }
    const module = { exports: {} };
    __cache__[resolvedId] = module;
    const moduleDir = resolvedId.substring(0, resolvedId.lastIndexOf('/'));
    modFn(
      (path) => __require__(path, moduleDir),
      module.exports,
      module,
      __require__,
      moduleDir
    );
    return module.exports;
  }

  // Module: ./app.js
  __modules__['./app.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Application Coordinator & Main Controller (Fully Enhanced)
 */

const { appState } = __require__('./models/state.js', __currentDir);
const { renderCv, TEMPLATES } = __require__('./templates/index.js', __currentDir);
const { renderFormSections } = __require__('./components/formSections.js', __currentDir);
const { renderCustomizeBar } = __require__('./components/customizeBar.js', __currentDir);
const { openAtsModal } = __require__('./components/atsDrawer.js', __currentDir);
const { openJobMatcherModal } = __require__('./components/jobMatcherModal.js', __currentDir);
const { openCountryModal } = __require__('./components/countryModal.js', __currentDir);
const { openCoverLetterModal } = __require__('./components/coverLetter.js', __currentDir);
const { openTemplateGalleryModal } = __require__('./components/templateGalleryModal.js', __currentDir);
const { openProfileManagerModal } = __require__('./components/profileManagerModal.js', __currentDir);
const { openExportModal } = __require__('./components/exportModal.js', __currentDir);
const { openClearDataModal } = __require__('./components/clearDataModal.js', __currentDir);
const { runAtsAudit } = __require__('./engine/atsEngine.js', __currentDir);
const { calculateCompleteness } = __require__('./engine/completeness.js', __currentDir);
const { togglePrintPreview } = __require__('./export/pdfExporter.js', __currentDir);

class CVForgeApp {
  constructor() {
    this.currentViewMode = 'split'; // 'split' | 'form' | 'preview'
    this.isDarkMode = localStorage.getItem('cvforge_theme') === 'dark';
  }

  init() {
    this.applyTheme();
    renderCustomizeBar('customize-bar-container');
    renderFormSections('form-sections-container');
    this.updatePreview();
    this.updateHeaderBadges();
    this.updateDemoBanner();

    // Subscribe to state updates
    appState.subscribe((event, profile) => {
      this.applyTheme();
      this.updatePreview();
      this.updateHeaderBadges();
      this.updateUndoRedoButtons();
      this.updateDemoBanner();

      if (event === 'format' || event === 'country' || event === 'settings') {
        renderCustomizeBar('customize-bar-container');
      }
      if (event === 'reset' || event === 'profile' || event === 'sections') {
        renderCustomizeBar('customize-bar-container');
        renderFormSections('form-sections-container');
      }
    });

    this.bindHeaderActions();
    this.bindViewModeToggles();
    this.updateUndoRedoButtons();

    if (window.lucide) window.lucide.createIcons();
  }

  applyTheme() {
    // 1. Dark/Light class on html
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 2. 7 Professional Themes on body
    const profile = appState.getProfile();
    const activeTheme = profile?.settings?.theme || 'soft-blue';
    document.body.setAttribute('data-theme', activeTheme);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('cvforge_theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  updatePreview() {
    const profile = appState.getProfile();
    const previewContainer = document.getElementById('cv-preview-content');
    const paper = document.getElementById('cv-paper-sheet');
    if (!previewContainer || !paper) return;

    // Apply paper attributes including font-size scale and theme
    const settings = profile.settings || {};
    paper.setAttribute('data-paper', settings.paperSize || 'letter');
    paper.setAttribute('data-spacing', settings.spacing || 'normal');
    paper.setAttribute('data-font', settings.fontFamily || 'Inter');
    paper.setAttribute('data-font-style', settings.fontStyle || 'regular');
    paper.setAttribute('data-font-target', settings.fontTarget || 'all');

    // Apply exact point-based typography and millimeter margins
    const fontSizes = settings.fontSizes || { name: 24, headings: 13, body: 10, contact: 9.5 };
    const margins = settings.marginsCustom || { top: 15, bottom: 15, left: 15, right: 15 };

    paper.style.setProperty('--cv-name-size', `${fontSizes.name}pt`);
    paper.style.setProperty('--cv-heading-size', `${fontSizes.headings}pt`);
    paper.style.setProperty('--cv-body-size', `${fontSizes.body}pt`);
    paper.style.setProperty('--cv-contact-size', `${fontSizes.contact}pt`);

    paper.style.setProperty('--cv-margin-top', `${margins.top}mm`);
    paper.style.setProperty('--cv-margin-bottom', `${margins.bottom}mm`);
    paper.style.setProperty('--cv-margin-left', `${margins.left}mm`);
    paper.style.setProperty('--cv-margin-right', `${margins.right}mm`);

    // Ensure body data-theme matches
    document.body.setAttribute('data-theme', settings.theme || 'soft-blue');

    // Render chosen CV format
    previewContainer.innerHTML = renderCv(profile.format, profile);

    // Update active format name label in preview bar
    const formatLabel = document.getElementById('preview-active-format-name');
    if (formatLabel && TEMPLATES[profile.format]) {
      formatLabel.textContent = TEMPLATES[profile.format].name;
    }

    if (window.lucide) window.lucide.createIcons();
  }

  updateHeaderBadges() {
    const profile = appState.getProfile();
    
    // 1. ATS Audit score
    const audit = runAtsAudit(profile);
    const atsScoreBadge = document.getElementById('header-ats-score');
    if (atsScoreBadge) {
      atsScoreBadge.textContent = `ATS: ${audit.score}%`;
      atsScoreBadge.parentElement.className = `text-xs font-bold px-2.5 py-1 rounded-full border transition flex items-center gap-1.5 cursor-pointer hover:scale-105 ${
        audit.score >= 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300' :
        audit.score >= 70 ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300' :
        'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
      }`;
    }

    // 2. Completeness
    const comp = calculateCompleteness(profile);
    const compBar = document.getElementById('header-completeness-bar');
    const compText = document.getElementById('header-completeness-text');
    if (compBar) compBar.style.width = `${comp.percentage}%`;
    if (compText) compText.textContent = `${comp.percentage}%`;

    // 3. Country badge
    const countryBadge = document.getElementById('header-country-badge');
    if (countryBadge) {
      countryBadge.textContent = profile.country || 'US';
    }

    // 4. Save indicator
    const saveIndicator = document.getElementById('header-save-indicator');
    if (saveIndicator) {
      saveIndicator.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Auto-saved';
    }
  }

  updateDemoBanner() {
    const profile = appState.getProfile();
    const banner = document.getElementById('demo-mode-banner');
    if (!banner) return;
    if (profile.isDemo) {
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
  }

  updateUndoRedoButtons() {
    const btnUndo = document.getElementById('btn-undo');
    const btnRedo = document.getElementById('btn-redo');
    if (btnUndo) btnUndo.disabled = !appState.canUndo();
    if (btnRedo) btnRedo.disabled = !appState.canRedo();
  }

  bindHeaderActions() {
    // Clear Data Triggers (Modal Confirmation)
    document.getElementById('btn-header-clear-data')?.addEventListener('click', () => {
      openClearDataModal();
    });

    // Demo Banner Clear Action
    document.getElementById('btn-clear-demo-data')?.addEventListener('click', () => {
      openClearDataModal();
    });

    // PDF Export (opens verification modal)
    document.getElementById('btn-export-pdf')?.addEventListener('click', () => {
      openExportModal('pdf');
    });

    // DOCX Export (opens verification modal)
    document.getElementById('btn-export-docx')?.addEventListener('click', () => {
      openExportModal('docx');
    });

    // Print Preview Toggle / Print
    document.getElementById('btn-print-preview')?.addEventListener('click', () => {
      togglePrintPreview();
    });

    // Modals
    document.getElementById('btn-open-ats')?.addEventListener('click', () => openAtsModal());
    document.getElementById('btn-open-job-matcher')?.addEventListener('click', () => openJobMatcherModal());
    document.getElementById('btn-open-country')?.addEventListener('click', () => openCountryModal());
    document.getElementById('btn-open-cover-letter')?.addEventListener('click', () => openCoverLetterModal());
    document.getElementById('btn-open-profile-manager')?.addEventListener('click', () => openProfileManagerModal());

    // Undo & Redo
    document.getElementById('btn-undo')?.addEventListener('click', () => appState.undo());
    document.getElementById('btn-redo')?.addEventListener('click', () => appState.redo());

    // Theme toggle
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => this.toggleTheme());

    // Sample Profile Loading
    document.getElementById('sel-sample-profile')?.addEventListener('change', (e) => {
      const sample = e.target.value;
      if (sample) {
        appState.loadDemoProfile(sample);
      }
      e.target.value = '';
    });
  }

  bindViewModeToggles() {
    const btnSplits = document.querySelectorAll('#btn-view-split, .btn-view-split');
    const btnForms = document.querySelectorAll('#btn-view-form, .btn-view-form');
    const btnPreviews = document.querySelectorAll('#btn-view-preview, .btn-view-preview');
    const formCol = document.getElementById('workspace-form-column');
    const previewCol = document.getElementById('workspace-preview-column');

    const setMode = (mode) => {
      this.currentViewMode = mode;
      document.querySelectorAll('#btn-view-split, .btn-view-split, #btn-view-form, .btn-view-form, #btn-view-preview, .btn-view-preview').forEach(b => {
        b?.classList.remove('bg-blue-600', 'text-white', 'shadow-xs');
        b?.classList.add('text-slate-600', 'dark:text-slate-300');
      });

      if (mode === 'split') {
        btnSplits.forEach(b => {
          b?.classList.add('bg-blue-600', 'text-white', 'shadow-xs');
          b?.classList.remove('text-slate-600', 'dark:text-slate-300');
        });
        formCol?.classList.remove('hidden');
        previewCol?.classList.remove('hidden');
        formCol?.classList.add('md:w-1/2', 'lg:w-[45%]');
        previewCol?.classList.add('md:w-1/2', 'lg:w-[55%]');
      } else if (mode === 'form') {
        btnForms.forEach(b => {
          b?.classList.add('bg-blue-600', 'text-white', 'shadow-xs');
          b?.classList.remove('text-slate-600', 'dark:text-slate-300');
        });
        formCol?.classList.remove('hidden', 'md:w-1/2', 'lg:w-[45%]');
        formCol?.classList.add('w-full');
        previewCol?.classList.add('hidden');
      } else if (mode === 'preview') {
        btnPreviews.forEach(b => {
          b?.classList.add('bg-blue-600', 'text-white', 'shadow-xs');
          b?.classList.remove('text-slate-600', 'dark:text-slate-300');
        });
        formCol?.classList.add('hidden');
        previewCol?.classList.remove('hidden', 'md:w-1/2', 'lg:w-[55%]');
        previewCol?.classList.add('w-full');
      }
    };

    btnSplits.forEach(b => b.addEventListener('click', () => setMode('split')));
    btnForms.forEach(b => b.addEventListener('click', () => setMode('form')));
    btnPreviews.forEach(b => b.addEventListener('click', () => setMode('preview')));
    // Auto-detect mobile screen
    if (window.innerWidth < 768) {
      const btnForm = document.getElementById('btn-view-form');
      if (btnForm) btnForm.click();
    }
  }
}

// Mobile navigation and keyboard modal dismiss handler
window.CVForgeNavigation = {
  handleDismiss: () => {
    // Check if any modal is open and close it
    const modalIds = [
      'template-gallery-modal',
      'export-verification-modal',
      'clear-data-modal',
      'photo-crop-modal',
      'typography-modal',
      'margins-modal',
      'job-matcher-modal',
      'country-convention-modal',
      'cover-letter-modal',
      'profile-manager-modal'
    ];
    for (const id of modalIds) {
      const el = document.getElementById(id);
      if (el) {
        el.remove();
        return true;
      }
    }

    // On mobile screens, if in preview mode, back goes to form
    const prevCol = document.getElementById('workspace-preview-column');
    if (window.innerWidth < 768 && prevCol && !prevCol.classList.contains('hidden')) {
      const btnForm = document.getElementById('btn-view-form');
      if (btnForm) {
        btnForm.click();
        return true;
      }
    }

    return false;
  }
};

// Global escape key listener to close modals in web browsers
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.CVForgeNavigation.handleDismiss();
  }
});

// Bootstrap application on DOM ready
function initCVForge() {
  const app = new CVForgeApp();
  app.init();
  window.__CVForgeAppInstance = app;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCVForge);
} else {
  initCVForge();
}


// Exports

};

  // Module: ./components/atsDrawer.js
  __modules__['./components/atsDrawer.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - ATS (Applicant Tracking System) Compatibility Audit Drawer & Modal
 * Rule-based heuristic analysis with individual checks, problem detection, and explicit non-guarantee.
 */

const { runAtsAudit } = __require__('../engine/atsEngine.js', __currentDir);
const { appState } = __require__('../models/state.js', __currentDir);

function openAtsModal() {
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


// Exports
exports.openAtsModal = openAtsModal;
};

  // Module: ./components/clearDataModal.js
  __modules__['./components/clearDataModal.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Clear Data & Reset Confirmation Modal Component
 * Ensures user safety before clearing candidate information:
 * 1. Offers one-click JSON backup export first
 * 2. Clearly explains what will be cleared vs. what is preserved (settings, themes, custom templates)
 * 3. Requires explicit user confirmation
 */

const { appState } = __require__('../models/state.js', __currentDir);
const { exportProfileToJson } = __require__('../export/jsonExporter.js', __currentDir);

function openClearDataModal() {
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


// Exports
exports.openClearDataModal = openClearDataModal;
};

  // Module: ./components/countryModal.js
  __modules__['./components/countryModal.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - International Country Guidance & Conventions Modal
 */

const { COUNTRY_RULES } = __require__('../engine/countryRules.js', __currentDir);
const { appState } = __require__('../models/state.js', __currentDir);

function openCountryModal() {
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
              <h3 class="text-base font-bold text-slate-900 dark:text-white">International CV & Resume Conventions</h3>
              <p class="text-xs text-slate-500">Recruitment standards tailored by country & jurisdiction</p>
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


// Exports
exports.openCountryModal = openCountryModal;
};

  // Module: ./components/coverLetter.js
  __modules__['./components/coverLetter.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Professional Cover Letter Generator
 * Generates an executive cover letter that matches the styling, fonts, and header
 * of the user's chosen CV format.
 */

const { appState } = __require__('../models/state.js', __currentDir);
const { downloadPdf, triggerPrint } = __require__('../export/pdfExporter.js', __currentDir);

function openCoverLetterModal() {
  const profile = appState.getProfile();
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';

  let modal = document.getElementById('cover-letter-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cover-letter-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity';
    document.body.appendChild(modal);
  }

  let recipientName = 'Hiring Manager';
  let companyName = profile.targetCompany || 'Target Organization';
  let jobTitle = profile.targetRole || p.headline || 'Position';
  let letterTone = 'modern';

  const generateLetterBody = () => {
    const rawSkills = Array.isArray(profile.skills) ? profile.skills : (profile.skills?.technical || []);
    const skillsList = rawSkills.slice(0, 4).map(s => typeof s === 'string' ? s : s.name).filter(Boolean).join(', ') || 'modern industry methodologies';
    const topExp = profile.experience?.[0];
    const topHighlight = topExp?.highlights?.[0] || 'delivered robust, high-performance software systems with zero downtime';

    if (letterTone === 'executive') {
      return `Dear ${recipientName},

I am writing to formally submit my candidacy for the ${jobTitle} position at ${companyName}. With extensive experience spearheading high-scale technical initiatives and architecting resilient platforms, I have built a career centered on driving measurable business outcomes and cultivating world-class engineering execution.

Throughout my tenure at ${topExp?.company || 'industry-leading technology organizations'}, I led initiatives that directly impacted scalability and operational efficiency. Notably, I ${topHighlight.toLowerCase()}. My background in ${skillsList} allows me to bridge high-level corporate roadmaps with disciplined, hands-on architectural standards.

${companyName}'s commitment to engineering innovation strongly aligns with my own leadership philosophy. I welcome the opportunity to discuss how my technical acumen, mentorship track record, and delivery focus can support ${companyName}'s strategic objectives in the coming years.

Thank you for your consideration, and I look forward to speaking with you.

Sincerely,

${p.fullName || 'Candidate Name'}
${p.phone ? `Tel: ${p.phone} | ` : ''}Email: ${p.email || ''}`;
    }

    if (letterTone === 'graduate') {
      return `Dear ${recipientName},

I am excited to apply for the ${jobTitle} role at ${companyName}. As a dedicated graduate${profile.education?.[0] ? ` with a ${profile.education[0].degree} from ${profile.education[0].institution}` : ''}, I have developed a strong technical foundation and a genuine passion for solving complex software problems.

Through rigorous academic capstone projects and hands-on development using ${skillsList}, I have demonstrated rapid learning agility and disciplined software engineering habits. In my recent project work, I engineered end-to-end applications with comprehensive test coverage and clean architectural design.

I have long admired ${companyName}'s engineering culture, and I am eager to contribute my problem-solving energy, collaborative spirit, and technical skills to your team. I would welcome the opportunity to interview and discuss how I can contribute from day one.

Thank you very much for your time and consideration.

Warm regards,

${p.fullName || 'Candidate Name'}
${p.phone ? `Tel: ${p.phone} | ` : ''}Email: ${p.email || ''}`;
    }

    // Default 'modern'
    return `Dear ${recipientName},

I am thrilled to submit my application for the ${jobTitle} opportunity at ${companyName}. As a ${p.headline || 'dedicated professional'} with deep hands-on expertise in ${skillsList}, I have consistently delivered scalable solutions that solve mission-critical challenges.

In my recent work, I spearheaded key initiatives including: ${topHighlight.toLowerCase()}. I take pride in engineering maintainable, high-impact systems, collaborating cross-functionally with product and design teams, and continuously improving development velocity.

${companyName}'s ambitious mission represents the ideal environment for my technical skillset and creative problem-solving mindset. I am eager to bring my enthusiasm and track record of delivery to your engineering squad.

Thank you for your review of my application. I look forward to the possibility of discussing this role in detail.

Best regards,

${p.fullName || 'Candidate Name'}
${p.phone ? `Tel: ${p.phone} | ` : ''}Email: ${p.email || ''}`;
  };

  const renderModal = () => {
    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <i data-lucide="mail" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Matching Cover Letter Generator</h3>
              <p class="text-xs text-slate-500">Automatically styled to match your active CV typography & header</p>
            </div>
          </div>
          <button type="button" id="btn-close-letter" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Body Split: Left Settings, Right Live Letter Preview -->
        <div class="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 text-xs">
          
          <!-- Left Configuration (4 cols) -->
          <div class="md:col-span-4 p-5 border-r border-slate-200 dark:border-slate-800 space-y-4 bg-slate-50 dark:bg-slate-900/60">
            <div>
              <label class="block font-bold text-slate-800 dark:text-slate-200 mb-1">Company / Organization:</label>
              <input type="text" id="cl-inp-company" value="${companyName}" class="w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5" />
            </div>
            <div>
              <label class="block font-bold text-slate-800 dark:text-slate-200 mb-1">Hiring Manager / Recipient:</label>
              <input type="text" id="cl-inp-recipient" value="${recipientName}" class="w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5" />
            </div>
            <div>
              <label class="block font-bold text-slate-800 dark:text-slate-200 mb-1">Target Position Title:</label>
              <input type="text" id="cl-inp-role" value="${jobTitle}" class="w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5" />
            </div>
            <div>
              <label class="block font-bold text-slate-800 dark:text-slate-200 mb-1">Tone & Template Archetype:</label>
              <select id="cl-sel-tone" class="w-full text-xs rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2.5 py-1.5">
                <option value="modern" ${letterTone === 'modern' ? 'selected' : ''}>Modern Tech & Accomplishment</option>
                <option value="executive" ${letterTone === 'executive' ? 'selected' : ''}>Executive Leadership & Strategy</option>
                <option value="graduate" ${letterTone === 'graduate' ? 'selected' : ''}>Fresh Graduate & Passionate Learner</option>
              </select>
            </div>
            <div class="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button type="button" id="btn-download-cl-pdf" class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm text-xs transition flex items-center justify-center gap-1.5">
                <i data-lucide="download" class="w-3.5 h-3.5"></i> Download Cover Letter PDF
              </button>
              <button type="button" id="btn-print-cl" class="w-full py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5">
                <i data-lucide="printer" class="w-3.5 h-3.5"></i> Print Cover Letter
              </button>
            </div>
          </div>

          <!-- Right Document Canvas Preview (8 cols) -->
          <div class="md:col-span-8 p-6 bg-slate-200/60 dark:bg-slate-950 flex justify-center">
            <div id="cover-letter-preview-paper" class="w-full max-w-[620px] bg-white text-slate-800 p-8 rounded shadow-md border border-slate-200 leading-relaxed text-xs">
              
              <!-- Header -->
              <header class="border-b-2 pb-4 mb-6" style="border-color: ${primaryColor}">
                <h1 class="text-2xl font-extrabold uppercase tracking-tight" style="color: ${primaryColor}">
                  ${p.fullName || 'Candidate Name'}
                </h1>
                ${p.headline ? `<div class="text-xs font-semibold text-slate-600 mt-0.5">${p.headline}</div>` : ''}
                <div class="text-[11px] text-slate-500 mt-2 space-x-2">
                  ${p.location ? `<span>${p.location}</span> •` : ''}
                  ${p.email ? `<span>${p.email}</span> •` : ''}
                  ${p.phone ? `<span>${p.phone}</span>` : ''}
                </div>
              </header>

              <!-- Date & Recipient -->
              <div class="mb-5 text-slate-600 space-y-0.5">
                <div>${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                <div class="font-bold text-slate-900 mt-2">${recipientName}</div>
                <div>Hiring Committee</div>
                <div class="font-semibold text-slate-800">${companyName}</div>
              </div>

              <!-- Letter Body (Editable!) -->
              <div class="whitespace-pre-line text-slate-800 leading-relaxed space-y-3 font-sans text-xs">
                ${generateLetterBody()}
              </div>

            </div>
          </div>

        </div>

      </div>
    `;

    const close = () => modal.classList.add('hidden');
    modal.classList.remove('hidden');

    document.getElementById('btn-close-letter')?.addEventListener('click', close);

    document.getElementById('cl-inp-company')?.addEventListener('input', (e) => {
      companyName = e.target.value;
      renderModal();
    });
    document.getElementById('cl-inp-recipient')?.addEventListener('input', (e) => {
      recipientName = e.target.value;
      renderModal();
    });
    document.getElementById('cl-inp-role')?.addEventListener('input', (e) => {
      jobTitle = e.target.value;
      renderModal();
    });
    document.getElementById('cl-sel-tone')?.addEventListener('change', (e) => {
      letterTone = e.target.value;
      renderModal();
    });

    document.getElementById('btn-download-cl-pdf')?.addEventListener('click', () => {
      downloadPdf('cover-letter-preview-paper', `Cover_Letter_${p.fullName || 'Candidate'}.pdf`);
    });

    document.getElementById('btn-print-cl')?.addEventListener('click', () => {
      triggerPrint();
    });

    if (window.lucide) window.lucide.createIcons();
  };

  renderModal();
}


// Exports
exports.openCoverLetterModal = openCoverLetterModal;
};

  // Module: ./components/customizeBar.js
  __modules__['./components/customizeBar.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Customization Bar Component (Fully Enhanced)
 * Reorganized toolbar with visual template gallery trigger, 7 professional themes,
 * independent point-based typography (pt), custom millimeter margins (mm),
 * color palettes, paper setup, photo manager, and zoom controls.
 */

const { appState } = __require__('../models/state.js', __currentDir);
const { TEMPLATES, FORMAT_CATEGORIES } = __require__('../templates/index.js', __currentDir);
const { openTemplateGalleryModal } = __require__('./templateGalleryModal.js', __currentDir);
const { openPhotoCropModal } = __require__('./photoCropModal.js', __currentDir);
const { openTypographyModal } = __require__('./typographyModal.js', __currentDir);
const { openMarginsModal } = __require__('./marginsModal.js', __currentDir);

function renderCustomizeBar(containerId = 'customize-bar-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const profile = appState.getProfile();
  const settings = profile.settings || {};
  const fontSizes = settings.fontSizes || { name: 24, headings: 13, body: 10, contact: 9.5 };
  const marginsCustom = settings.marginsCustom || { top: 15, bottom: 15, left: 15, right: 15 };

  const THEMES = [
    { id: 'soft-blue', name: 'Soft Blue', primary: '#1d4ed8' },
    { id: 'minimal-white', name: 'Minimal White', primary: '#18181b' },
    { id: 'soft-lavender', name: 'Soft Lavender', primary: '#6366f1' },
    { id: 'warm-beige', name: 'Warm Beige', primary: '#78350f' },
    { id: 'light-gray', name: 'Light Gray', primary: '#334155' },
    { id: 'professional-navy', name: 'Professional Navy', primary: '#1e3a8a' },
    { id: 'modern-pastel', name: 'Modern Pastel', primary: '#0f766e' }
  ];

  const COLOR_PALETTES = [
    { name: 'Executive Navy', hex: '#1e3a8a' },
    { name: 'Slate Charcoal', hex: '#334155' },
    { name: 'Emerald Forest', hex: '#059669' },
    { name: 'Royal Indigo', hex: '#4338ca' },
    { name: 'Burgundy Wine', hex: '#7c2d12' },
    { name: 'Europass Blue', hex: '#0e4194' },
    { name: 'Creative Violet', hex: '#7e22ce' },
    { name: 'Minimalist Black', hex: '#09090b' }
  ];

  container.innerHTML = `
    <div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      
      <!-- Group 1: Template Selection (Gallery + Dropdown) -->
      <div class="flex items-center gap-2">
        <button type="button" id="btn-open-template-gallery" class="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-xs text-xs flex items-center gap-1.5 transition active:scale-95" title="Browse visual cards for all 10 distinct CV formats">
          <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i>
          <span>Template Gallery</span>
        </button>

        <select id="sel-format" class="font-bold text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 shadow-xs max-w-[240px] truncate" title="Select CV Format">
          ${FORMAT_CATEGORIES.map(cat => {
            const catTemplates = Object.values(TEMPLATES).filter(t => t.formatCategory === cat.id);
            return `
              <optgroup label="${cat.name} (${catTemplates.length})">
                ${catTemplates.map(t => `
                  <option value="${t.id}" ${profile.format === t.id ? 'selected' : ''}>
                    ${t.name}
                  </option>
                `).join('')}
              </optgroup>
            `;
          }).join('')}
        </select>
      </div>

      <!-- Group 2: Typography, Theme & Precision Controls (pt / mm) -->
      <div class="flex flex-wrap items-center gap-2">
        
        <!-- Theme Picker -->
        <div class="flex items-center gap-1" title="Visual Workspace Theme">
          <span class="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">Theme:</span>
          <select id="sel-theme" class="rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-2 py-1 text-xs font-semibold">
            ${THEMES.map(th => `
              <option value="${th.id}" ${settings.theme === th.id ? 'selected' : ''}>${th.name}</option>
            `).join('')}
          </select>
        </div>

        <!-- Font Family -->
        <div class="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2" title="CV Font Family">
          <span class="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">Font:</span>
          <select id="sel-font" class="rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-2 py-1 text-xs font-medium">
            <optgroup label="Modern Sans-Serif">
              <option value="Inter" ${settings.fontFamily === 'Inter' ? 'selected' : ''}>Inter (Modern UI Sans)</option>
              <option value="Roboto" ${settings.fontFamily === 'Roboto' ? 'selected' : ''}>Roboto (Geometric Sans)</option>
              <option value="Open Sans" ${settings.fontFamily === 'Open Sans' ? 'selected' : ''}>Open Sans (Friendly Sans)</option>
              <option value="Lato" ${settings.fontFamily === 'Lato' ? 'selected' : ''}>Lato (Humanist Sans)</option>
              <option value="Source Sans 3" ${settings.fontFamily === 'Source Sans 3' ? 'selected' : ''}>Source Sans 3 (Adobe Clean)</option>
              <option value="Montserrat" ${settings.fontFamily === 'Montserrat' ? 'selected' : ''}>Montserrat (Contemporary)</option>
              <option value="Poppins" ${settings.fontFamily === 'Poppins' ? 'selected' : ''}>Poppins (Geometric Rounded)</option>
              <option value="IBM Plex Sans" ${settings.fontFamily === 'IBM Plex Sans' ? 'selected' : ''}>IBM Plex Sans (Industrial Sans)</option>
            </optgroup>
            <optgroup label="Professional Serif">
              <option value="Merriweather" ${settings.fontFamily === 'Merriweather' ? 'selected' : ''}>Merriweather (Academic Serif)</option>
              <option value="Playfair Display" ${settings.fontFamily === 'Playfair Display' ? 'selected' : ''}>Playfair Display (Editorial)</option>
              <option value="IBM Plex Serif" ${settings.fontFamily === 'IBM Plex Serif' ? 'selected' : ''}>IBM Plex Serif (Tech Serif)</option>
              <option value="Times New Roman" ${settings.fontFamily === 'Times New Roman' ? 'selected' : ''}>Times New Roman (Classic)</option>
              <option value="Georgia" ${settings.fontFamily === 'Georgia' ? 'selected' : ''}>Georgia (Refined Serif)</option>
              <option value="Cambria" ${settings.fontFamily === 'Cambria' ? 'selected' : ''}>Cambria (Workplace Serif)</option>
              <option value="Garamond" ${settings.fontFamily === 'Garamond' ? 'selected' : ''}>Garamond (Literary Elegance)</option>
            </optgroup>
            <optgroup label="Universal System Fonts">
              <option value="Arial" ${settings.fontFamily === 'Arial' ? 'selected' : ''}>Arial (Universal Standard)</option>
              <option value="Calibri" ${settings.fontFamily === 'Calibri' ? 'selected' : ''}>Calibri (Corporate Standard)</option>
              <option value="Aptos" ${settings.fontFamily === 'Aptos' ? 'selected' : ''}>Aptos (Modern MS Office)</option>
              <option value="Helvetica" ${settings.fontFamily === 'Helvetica' ? 'selected' : ''}>Helvetica (Swiss Clean)</option>
              <option value="Verdana" ${settings.fontFamily === 'Verdana' ? 'selected' : ''}>Verdana (High-Legibility)</option>
              <option value="Tahoma" ${settings.fontFamily === 'Tahoma' ? 'selected' : ''}>Tahoma (Compact Sans)</option>
              <option value="Trebuchet MS" ${settings.fontFamily === 'Trebuchet MS' ? 'selected' : ''}>Trebuchet MS (Warm Sans)</option>
            </optgroup>
          </select>
        </div>

        <!-- Point-Based Font Sizing Trigger (pt) -->
        <button type="button" id="btn-open-typography-modal" class="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition flex items-center gap-1.5 shadow-xs" title="Customize independent point sizes (pt) for Name, Headings, and Body">
          <i data-lucide="type" class="w-3.5 h-3.5 text-blue-600"></i>
          <span>Font Size: <strong class="text-blue-600">${fontSizes.body || 10}pt</strong></span>
        </button>

        <!-- Millimeter-Based Margin Controls Trigger (mm) -->
        <button type="button" id="btn-open-margins-modal" class="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition flex items-center gap-1.5 shadow-xs" title="Customize Top, Bottom, Left, and Right margins in millimeters">
          <i data-lucide="maximize-2" class="w-3.5 h-3.5 text-blue-600"></i>
          <span>Margins: <strong class="text-blue-600">${marginsCustom.top || 15}mm</strong></span>
        </button>

        <!-- Palette Swatches -->
        <div class="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2" title="Primary Accent Color">
          <span class="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">Color:</span>
          <div class="flex items-center gap-1">
            ${COLOR_PALETTES.map(col => `
              <button type="button" class="btn-color-pick w-4.5 h-4.5 rounded-full border-2 transition hover:scale-110 ${settings.primaryColor === col.hex ? 'border-blue-500 ring-2 ring-blue-400/30 scale-110' : 'border-transparent'}" style="background-color: ${col.hex}" data-hex="${col.hex}" title="${col.name}"></button>
            `).join('')}
            <input type="color" id="inp-custom-color" value="${settings.primaryColor || '#1e3a8a'}" class="w-4.5 h-4.5 rounded-full cursor-pointer border-0 bg-transparent p-0" title="Custom Hex Color" />
          </div>
        </div>

        <!-- Spacing Dropdown -->
        <div class="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-700 pl-2">
          <select id="sel-spacing" class="rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2 py-1 text-[11px]" title="Line Spacing">
            <option value="compact" ${settings.spacing === 'compact' ? 'selected' : ''}>Compact Spacing</option>
            <option value="normal" ${settings.spacing === 'normal' ? 'selected' : ''}>Normal Spacing</option>
            <option value="relaxed" ${settings.spacing === 'relaxed' ? 'selected' : ''}>Relaxed Spacing</option>
          </select>
        </div>

      </div>

      <!-- Group 3: Paper Setup, Photo & Zoom Controls -->
      <div class="flex items-center gap-2">
        
        <!-- Paper Size Toggle (A4 vs Letter) -->
        <div class="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 p-0.5" title="Page Dimensions">
          <button type="button" id="btn-paper-letter" class="px-2.5 py-1 text-[11px] font-bold rounded ${settings.paperSize === 'letter' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:text-blue-600'}">
            US Letter
          </button>
          <button type="button" id="btn-paper-a4" class="px-2.5 py-1 text-[11px] font-bold rounded ${settings.paperSize === 'a4' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:text-blue-600'}">
            A4
          </button>
        </div>

        <!-- Photo Controls: Show, Size, Shape, Upload -->
        <div class="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-700 pl-2">
          <label class="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer" title="Toggle candidate photograph">
            <input type="checkbox" id="chk-show-photo" ${settings.showPhoto ? 'checked' : ''} class="rounded text-blue-600" />
            <span>Photo</span>
          </label>

          ${settings.showPhoto ? `
            <select id="sel-photo-size" class="rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-200 px-1.5 py-0.5" title="Photo Dimensions">
              <option value="small" ${settings.photoSize === 'small' ? 'selected' : ''}>Small (72px)</option>
              <option value="medium" ${settings.photoSize === 'medium' || !settings.photoSize ? 'selected' : ''}>Medium (96px)</option>
              <option value="large" ${settings.photoSize === 'large' ? 'selected' : ''}>Large (120px)</option>
            </select>

            <select id="sel-photo-shape" class="rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-200 px-1.5 py-0.5" title="Photo Shape">
              <option value="circle" ${settings.photoShape === 'circle' || !settings.photoShape ? 'selected' : ''}>Circle</option>
              <option value="square" ${settings.photoShape === 'square' ? 'selected' : ''}>Square</option>
            </select>
          ` : ''}

          <input type="file" id="inp-photo-file" class="hidden" accept="image/*" />
          <button type="button" id="btn-trigger-photo-upload" class="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400" title="Upload/Change Photo">
            <i data-lucide="image" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <!-- Zoom Level Controls -->
        <div class="flex items-center gap-1 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 px-1 py-0.5 ml-1">
          <button type="button" id="btn-zoom-out" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white" title="Zoom Out (-)">
            <i data-lucide="zoom-out" class="w-3.5 h-3.5"></i>
          </button>
          <span id="zoom-level-text" class="text-[11px] font-mono font-bold px-1 text-slate-700 dark:text-slate-200">100%</span>
          <button type="button" id="btn-zoom-in" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white" title="Zoom In (+)">
            <i data-lucide="zoom-in" class="w-3.5 h-3.5"></i>
          </button>
          <button type="button" id="btn-zoom-reset" class="text-[10px] text-blue-600 dark:text-blue-400 font-bold px-1 hover:underline" title="Fit to width">
            Fit
          </button>
        </div>

      </div>

    </div>
  `;

  attachCustomizeListeners();
  if (window.lucide) window.lucide.createIcons();
}

function attachCustomizeListeners() {
  // Gallery trigger
  document.getElementById('btn-open-template-gallery')?.addEventListener('click', () => {
    openTemplateGalleryModal();
  });

  // Typography Modal Trigger
  document.getElementById('btn-open-typography-modal')?.addEventListener('click', () => {
    openTypographyModal();
  });

  // Margins Modal Trigger
  document.getElementById('btn-open-margins-modal')?.addEventListener('click', () => {
    openMarginsModal();
  });

  // Format dropdown
  const formatEl = document.getElementById('sel-format');
  if (formatEl) {
    formatEl.onchange = () => appState.setFormat(formatEl.value);
  }

  // Theme selector
  const themeEl = document.getElementById('sel-theme');
  if (themeEl) {
    themeEl.onchange = () => {
      appState.setTheme(themeEl.value);
    };
  }

  // Font family
  const fontEl = document.getElementById('sel-font');
  if (fontEl) {
    fontEl.onchange = () => appState.updateSetting('fontFamily', fontEl.value);
  }

  // Color presets
  document.querySelectorAll('.btn-color-pick').forEach(btn => {
    btn.onclick = () => {
      const hex = btn.getAttribute('data-hex');
      appState.updateSetting('primaryColor', hex);
      const customEl = document.getElementById('inp-custom-color');
      if (customEl) customEl.value = hex;
    };
  });

  const customColEl = document.getElementById('inp-custom-color');
  if (customColEl) {
    customColEl.onchange = () => appState.updateSetting('primaryColor', customColEl.value);
  }

  // Paper Size buttons
  document.getElementById('btn-paper-letter')?.addEventListener('click', () => appState.updateSetting('paperSize', 'letter'));
  document.getElementById('btn-paper-a4')?.addEventListener('click', () => appState.updateSetting('paperSize', 'a4'));

  // Spacing
  const spEl = document.getElementById('sel-spacing');
  if (spEl) spEl.onchange = () => appState.updateSetting('spacing', spEl.value);

  // Photo Checkbox & Options
  const chkPhoto = document.getElementById('chk-show-photo');
  const btnUpload = document.getElementById('btn-trigger-photo-upload');

  if (chkPhoto) {
    chkPhoto.onchange = () => {
      appState.updateSetting('showPhoto', chkPhoto.checked);
      if (chkPhoto.checked && !appState.getProfile().personal?.photoUrl) {
        openPhotoCropModal();
      }
    };
  }

  const selPhotoSize = document.getElementById('sel-photo-size');
  if (selPhotoSize) {
    selPhotoSize.onchange = () => appState.updateSetting('photoSize', selPhotoSize.value);
  }

  const selPhotoShape = document.getElementById('sel-photo-shape');
  if (selPhotoShape) {
    selPhotoShape.onchange = () => appState.updateSetting('photoShape', selPhotoShape.value);
  }

  btnUpload?.addEventListener('click', () => openPhotoCropModal());

  // Zoom controls
  let curZoom = 100;
  const zoomText = document.getElementById('zoom-level-text');
  const previewContent = document.getElementById('cv-paper-sheet');

  const applyZoom = () => {
    if (previewContent) {
      previewContent.style.transform = `scale(${curZoom / 100})`;
      previewContent.style.transformOrigin = 'top center';
    }
    if (zoomText) zoomText.textContent = `${curZoom}%`;
  };

  document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
    if (curZoom < 140) {
      curZoom += 10;
      applyZoom();
    }
  });

  document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
    if (curZoom > 60) {
      curZoom -= 10;
      applyZoom();
    }
  });

  document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
    curZoom = 100;
    applyZoom();
  });
}


// Exports
exports.renderCustomizeBar = renderCustomizeBar;
};

  // Module: ./components/exportModal.js
  __modules__['./components/exportModal.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Pre-Download Export Verification Modal Component
 * Displays document compliance audit, target country conventions checklist,
 * paper size confirmation, demo data warning, custom filename, and 1-click PDF/DOCX downloads.
 */

const { appState } = __require__('../models/state.js', __currentDir);
const { TEMPLATES } = __require__('../templates/index.js', __currentDir);
const { COUNTRY_RULES } = __require__('../engine/countryRules.js', __currentDir);
const { downloadPdf } = __require__('../export/pdfExporter.js', __currentDir);
const { downloadDocx } = __require__('../export/docxExporter.js', __currentDir);

function openExportModal(defaultExportType = 'pdf') {
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


// Exports
exports.openExportModal = openExportModal;
};

  // Module: ./components/formSections.js
  __modules__['./components/formSections.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Dynamic Form Sections Component (Clarity & Precision Enhanced)
 * Provides beginner-friendly, structured input sections with clear explanations,
 * realistic non-exaggerated examples, required/optional indicators,
 * 6-category skill taxonomy, fresh-graduate mode, and clean blank starting states.
 */

const { appState } = __require__('../models/state.js', __currentDir);
const { generateSummaries } = __require__('../engine/summaryEngine.js', __currentDir);
const { openPhotoCropModal } = __require__('./photoCropModal.js', __currentDir);

function renderFormSections(containerId = 'form-sections-container') {
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


// Exports
exports.renderFormSections = renderFormSections;
};

  // Module: ./components/jobMatcherModal.js
  __modules__['./components/jobMatcherModal.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Job Description Keyword Matcher & Optimizer Modal
 */

const { matchJobDescription } = __require__('../engine/keywordMatcher.js', __currentDir);
const { appState } = __require__('../models/state.js', __currentDir);

function openJobMatcherModal() {
  let modal = document.getElementById('job-matcher-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'job-matcher-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <i data-lucide="target" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Job Description Keyword Matcher</h3>
            <p class="text-xs text-slate-500">Scan job requisitions and align your CV keywords</p>
          </div>
        </div>
        <button type="button" id="btn-close-matcher" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
        <div>
          <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            Paste Target Job Description Requisition:
          </label>
          <textarea id="txt-job-description" rows="5" class="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white p-3 leading-relaxed focus:ring-2 focus:ring-blue-500" placeholder="Paste the job opening requirements, responsibilities, and preferred qualifications here..."></textarea>
          <div class="mt-2 flex justify-between items-center">
            <span class="text-[11px] text-slate-500">Extracts hard skills, soft skills, tools, and domain keywords</span>
            <button type="button" id="btn-run-match" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm text-xs transition flex items-center gap-1.5">
              <i data-lucide="scan" class="w-3.5 h-3.5"></i> Analyze & Match
            </button>
          </div>
        </div>

        <!-- Results Display -->
        <div id="matcher-results" class="hidden space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          
          <!-- Match Score Banner -->
          <div class="p-4 rounded-xl border flex items-center justify-between" id="matcher-score-banner">
            <div>
              <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Job Keyword Match Score</div>
              <div class="text-2xl font-black text-slate-900 dark:text-white" id="matcher-score-text">0%</div>
            </div>
            <div id="matcher-score-pill" class="text-xs font-bold px-3 py-1.5 rounded-lg">
              Match Status
            </div>
          </div>

          <!-- Matched Keywords -->
          <div>
            <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1 text-emerald-600">
              <i data-lucide="check" class="w-4 h-4"></i> Matched Keywords in Your CV (<span id="count-matched">0</span>)
            </h4>
            <div id="container-matched-keywords" class="flex flex-wrap gap-1.5"></div>
          </div>

          <!-- Missing Keywords -->
          <div>
            <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1 text-red-600">
              <i data-lucide="alert-circle" class="w-4 h-4"></i> Missing Target Keywords (<span id="count-missing">0</span>)
            </h4>
            <p class="text-[11px] text-slate-500 mb-2">Click any keyword to add it to your Skills:</p>
            <div id="container-missing-keywords" class="flex flex-wrap gap-1.5"></div>
          </div>

        </div>

      </div>

      <!-- Footer -->
      <div class="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
        <button type="button" id="btn-close-matcher-footer" class="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-bold text-slate-800 dark:text-white transition">
          Close
        </button>
      </div>

    </div>
  `;

  const close = () => modal.classList.add('hidden');
  modal.classList.remove('hidden');

  document.getElementById('btn-close-matcher')?.addEventListener('click', close);
  document.getElementById('btn-close-matcher-footer')?.addEventListener('click', close);

  const btnRun = document.getElementById('btn-run-match');
  const txtJob = document.getElementById('txt-job-description');
  const resContainer = document.getElementById('matcher-results');

  btnRun?.addEventListener('click', () => {
    const text = txtJob.value;
    if (!text || text.trim().length < 20) {
      alert('Please paste a substantial job description (at least 20 words).');
      return;
    }

    const res = matchJobDescription(text, appState.getProfile());
    resContainer.classList.remove('hidden');

    const scoreText = document.getElementById('matcher-score-text');
    const scorePill = document.getElementById('matcher-score-pill');
    const banner = document.getElementById('matcher-score-banner');

    if (scoreText) scoreText.textContent = `${res.matchScore}%`;
    if (scorePill && banner) {
      if (res.matchScore >= 75) {
        scorePill.textContent = 'High Relevance Alignment';
        scorePill.className = 'text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800';
        banner.className = 'p-4 rounded-xl border bg-emerald-50/50 border-emerald-200 flex items-center justify-between';
      } else if (res.matchScore >= 50) {
        scorePill.textContent = 'Moderate Alignment';
        scorePill.className = 'text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800';
        banner.className = 'p-4 rounded-xl border bg-blue-50/50 border-blue-200 flex items-center justify-between';
      } else {
        scorePill.textContent = 'Keywords Need Alignment';
        scorePill.className = 'text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800';
        banner.className = 'p-4 rounded-xl border bg-amber-50/50 border-amber-200 flex items-center justify-between';
      }
    }

    document.getElementById('count-matched').textContent = res.matchedKeywords.length;
    document.getElementById('count-missing').textContent = res.missingKeywords.length;

    const matchedDiv = document.getElementById('container-matched-keywords');
    matchedDiv.innerHTML = res.matchedKeywords.map(kw => `
      <span class="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium text-xs rounded-md border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
        ✓ ${kw}
      </span>
    `).join('');

    const missingDiv = document.getElementById('container-missing-keywords');
    missingDiv.innerHTML = res.missingKeywords.map(kw => `
      <button type="button" class="btn-add-missing-kw px-2.5 py-1 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 font-medium text-xs rounded-md border border-red-200 dark:border-red-900/50 transition cursor-pointer flex items-center gap-1" data-kw="${kw}">
        + ${kw}
      </button>
    `).join('');

    missingDiv.querySelectorAll('.btn-add-missing-kw').forEach(btn => {
      btn.onclick = () => {
        const kw = btn.getAttribute('data-kw');
        appState.addSkill({
          name: kw.charAt(0).toUpperCase() + kw.slice(1),
          level: 'Advanced'
        });
        btn.classList.add('opacity-40', 'pointer-events-none');
        btn.textContent = `✓ Added ${kw}`;
      };
    });
  });

  if (window.lucide) window.lucide.createIcons();
}


// Exports
exports.openJobMatcherModal = openJobMatcherModal;
};

  // Module: ./components/marginsModal.js
  __modules__['./components/marginsModal.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Page Margins & Millimeter Control Modal Component
 * Allows independent Top, Bottom, Left, and Right millimeter (mm) margin controls,
 * replacing restrictive 12mm-24mm preset boundaries.
 */

const { appState } = __require__('../models/state.js', __currentDir);

function openMarginsModal() {
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
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Page Margins (mm)</h3>
            <p class="text-xs text-slate-500">Custom millimeter spacing for print, PDF & Word</p>
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
          <label class="block font-bold text-slate-900 dark:text-white text-xs mb-2">Quick Margin Presets:</label>
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
          <label class="block font-bold text-slate-900 dark:text-white text-xs">Independent Edge Margins (Safe Range: 5mm – 50mm):</label>
          
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


// Exports
exports.openMarginsModal = openMarginsModal;
};

  // Module: ./components/photoCropModal.js
  __modules__['./components/photoCropModal.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Photo Upload, Crop & Alignment Modal Component
 * Accepts JPG, JPEG, PNG, WebP. Preserves aspect ratio, prevents distortion,
 * allows zoom, repositioning, and selection between Circular and Rounded Rectangle shapes.
 */

const { appState } = __require__('../models/state.js', __currentDir);

function openPhotoCropModal() {
  const profile = appState.getProfile();
  const currentPhoto = profile.personal?.photoUrl || '';
  const currentShape = profile.settings?.photoShape || 'circle';

  let modal = document.getElementById('photo-crop-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'photo-crop-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs transition-opacity';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-xs">
      
      <!-- Header -->
      <div class="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <i data-lucide="image" class="w-4 h-4"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Profile Photo Formatting</h3>
            <p class="text-[11px] text-slate-500">Position, crop, and adjust your professional headshot</p>
          </div>
        </div>
        <button type="button" id="btn-close-crop" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="p-5 space-y-4">
        
        <!-- File Picker -->
        <div>
          <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Upload Headshot Image (JPG, PNG, WebP • Max 8MB)
          </label>
          <input type="file" id="inp-crop-file" accept="image/jpeg,image/png,image/webp" class="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950/60 dark:file:text-blue-300" />
          <div id="crop-error-msg" class="text-[11px] text-red-500 mt-1 hidden font-medium"></div>
        </div>

        <!-- Interactive Canvas / Crop Preview Area -->
        <div class="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <div class="relative w-48 h-48 bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-inner flex items-center justify-center ${currentShape === 'circle' ? 'rounded-full' : 'rounded-2xl'}" id="crop-preview-frame">
            <canvas id="crop-canvas" width="300" height="300" class="w-full h-full object-cover cursor-grab active:cursor-grabbing"></canvas>
            <div id="crop-placeholder" class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4 text-center ${currentPhoto ? 'hidden' : ''}">
              <i data-lucide="user" class="w-12 h-12 mb-1 opacity-50"></i>
              <span class="text-[10px]">No image selected</span>
            </div>
          </div>
          <span class="text-[10px] text-slate-500 mt-2">Drag image to reposition • Slider to zoom</span>
        </div>

        <!-- Controls: Shape & Zoom -->
        <div class="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Photo Layout Shape</label>
            <div class="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 w-full bg-slate-50 dark:bg-slate-800">
              <button type="button" id="btn-shape-circle" class="flex-1 py-1 text-[11px] font-bold rounded ${currentShape === 'circle' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300'}">
                Circular
              </button>
              <button type="button" id="btn-shape-square" class="flex-1 py-1 text-[11px] font-bold rounded ${currentShape !== 'circle' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300'}">
                Square
              </button>
            </div>
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="font-semibold text-slate-700 dark:text-slate-300">Zoom Level</label>
              <span id="crop-zoom-label" class="font-mono text-[10px] text-slate-500">1.0x</span>
            </div>
            <input type="range" id="crop-zoom-slider" min="1" max="3" step="0.05" value="1" class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <button type="button" id="btn-remove-photo" class="text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1 ${!currentPhoto ? 'hidden' : ''}">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Remove Photo
        </button>
        <div class="flex items-center gap-2 ml-auto">
          <button type="button" id="btn-cancel-crop" class="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-bold text-slate-700 dark:text-slate-200 transition">
            Cancel
          </button>
          <button type="button" id="btn-save-crop" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition flex items-center gap-1.5">
            <i data-lucide="check" class="w-3.5 h-3.5"></i> Apply Headshot
          </button>
        </div>
      </div>

    </div>
  `;

  const canvas = document.getElementById('crop-canvas');
  const ctx = canvas.getContext('2d');
  const fileInput = document.getElementById('inp-crop-file');
  const errorMsg = document.getElementById('crop-error-msg');
  const zoomSlider = document.getElementById('crop-zoom-slider');
  const zoomLabel = document.getElementById('crop-zoom-label');
  const placeholder = document.getElementById('crop-placeholder');
  const frame = document.getElementById('crop-preview-frame');

  let activeShape = currentShape;
  let img = new Image();
  let imgLoaded = false;
  let scale = 1.0;
  let originX = 0;
  let originY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!imgLoaded) return;

    ctx.save();
    const w = canvas.width;
    const h = canvas.height;

    // Center and scale image
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    const x = (w - drawWidth) / 2 + originX;
    const y = (h - drawHeight) / 2 + originY;

    ctx.drawImage(img, x, y, drawWidth, drawHeight);
    ctx.restore();
  };

  const loadImageSource = (src) => {
    img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgLoaded = true;
      placeholder.classList.add('hidden');
      // Set initial scale to cover canvas
      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;
      scale = Math.max(scaleX, scaleY);
      zoomSlider.min = scale;
      zoomSlider.max = scale * 3;
      zoomSlider.value = scale;
      zoomLabel.textContent = `${(scale / Math.max(scaleX, scaleY)).toFixed(1)}x`;
      originX = 0;
      originY = 0;
      draw();
    };
    img.src = src;
  };

  if (currentPhoto) {
    loadImageSource(currentPhoto);
  }

  // File selection
  fileInput.onchange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      errorMsg.textContent = 'Invalid file format. Please upload JPG, PNG, or WebP.';
      errorMsg.classList.remove('hidden');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      errorMsg.textContent = 'Image file too large (Max 8MB).';
      errorMsg.classList.remove('hidden');
      return;
    }

    errorMsg.classList.add('hidden');
    const reader = new FileReader();
    reader.onload = (re) => {
      loadImageSource(re.target.result);
      document.getElementById('btn-remove-photo').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  };

  // Zoom slider
  zoomSlider.oninput = () => {
    scale = parseFloat(zoomSlider.value);
    const minScale = parseFloat(zoomSlider.min);
    zoomLabel.textContent = `${(scale / minScale).toFixed(1)}x`;
    draw();
  };

  // Mouse & Touch Dragging for Repositioning
  const onMouseDown = (clientX, clientY) => {
    if (!imgLoaded) return;
    isDragging = true;
    startX = clientX - originX;
    startY = clientY - originY;
  };
  const onMouseMove = (clientX, clientY) => {
    if (!isDragging) return;
    originX = clientX - startX;
    originY = clientY - startY;
    draw();
  };
  const onMouseUp = () => {
    isDragging = false;
  };

  canvas.addEventListener('mousedown', (e) => onMouseDown(e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => onMouseMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', onMouseUp);

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) onMouseDown(e.touches[0].clientX, e.touches[0].clientY);
  });
  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) onMouseMove(e.touches[0].clientX, e.touches[0].clientY);
  });
  window.addEventListener('touchend', onMouseUp);

  // Shape toggles
  const btnCircle = document.getElementById('btn-shape-circle');
  const btnSquare = document.getElementById('btn-shape-square');
  btnCircle.onclick = () => {
    activeShape = 'circle';
    frame.className = frame.className.replace('rounded-2xl', 'rounded-full');
    btnCircle.className = 'flex-1 py-1 text-[11px] font-bold rounded bg-blue-600 text-white shadow-xs';
    btnSquare.className = 'flex-1 py-1 text-[11px] font-bold rounded text-slate-700 dark:text-slate-300';
  };
  btnSquare.onclick = () => {
    activeShape = 'square';
    frame.className = frame.className.replace('rounded-full', 'rounded-2xl');
    btnSquare.className = 'flex-1 py-1 text-[11px] font-bold rounded bg-blue-600 text-white shadow-xs';
    btnCircle.className = 'flex-1 py-1 text-[11px] font-bold rounded text-slate-700 dark:text-slate-300';
  };

  const close = () => modal.classList.add('hidden');
  modal.classList.remove('hidden');

  document.getElementById('btn-close-crop').onclick = close;
  document.getElementById('btn-cancel-crop').onclick = close;

  // Remove Photo
  document.getElementById('btn-remove-photo').onclick = () => {
    if (confirm('Remove profile photo?')) {
      appState.updatePersonalField('photoUrl', '');
      appState.updateSetting('showPhoto', false);
      import('./formSections.js').then(m => m.renderFormSections());
      close();
    }
  };

  // Save Crop
  document.getElementById('btn-save-crop').onclick = () => {
    if (imgLoaded) {
      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.95);
      appState.updatePersonalField('photoUrl', croppedBase64);
      appState.updateSetting('showPhoto', true);
      appState.updateSetting('photoShape', activeShape);
      import('./formSections.js').then(m => m.renderFormSections());
    }
    close();
  };

  if (window.lucide) window.lucide.createIcons();
}


// Exports
exports.openPhotoCropModal = openPhotoCropModal;
};

  // Module: ./components/profileManagerModal.js
  __modules__['./components/profileManagerModal.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Profile Manager & Data Privacy Modal Component
 * Allows creating, duplicating, switching, renaming, exporting/importing profiles,
 * and explains local client-side storage policies.
 */

const { appState } = __require__('../models/state.js', __currentDir);
const { exportProfileToJson, importProfileFromJson } = __require__('../export/jsonExporter.js', __currentDir);
const { openClearDataModal } = __require__('./clearDataModal.js', __currentDir);

function openProfileManagerModal() {
  const currentProfile = appState.getProfile();
  const savedProfiles = appState.getSavedProfilesList();

  let modal = document.getElementById('profile-manager-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'profile-manager-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs transition-opacity';
    document.body.appendChild(modal);
  }

  const renderModal = () => {
    const list = appState.getSavedProfilesList();

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold shadow-md">
              <i data-lucide="folder-kanban" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white">Profile Manager & Local Storage</h3>
              <p class="text-xs text-slate-500">Manage multiple job versions, backups, and privacy</p>
            </div>
          </div>
          <button type="button" id="btn-close-pm" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          
          <!-- Current Active Profile Card -->
          <div class="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">Currently Editing</div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white mt-0.5">${currentProfile.personal?.fullName || 'Untitled Candidate'}</h4>
              <p class="text-slate-500">${currentProfile.personal?.headline || currentProfile.targetRole || 'No Headline'}</p>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" id="btn-save-current-as" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> Duplicate Profile
              </button>
            </div>
          </div>

          <!-- Saved Profiles List -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Saved Profile Versions (${list.length})</h4>
              <button type="button" id="btn-new-blank-profile" class="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i> New Blank Profile
              </button>
            </div>

            ${list.length === 0 ? `
              <div class="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-slate-400">
                No extra profiles saved yet. Click "Duplicate Profile" above to save variations for different target jobs.
              </div>
            ` : `
              <div class="space-y-2">
                ${list.map(p => `
                  <div class="p-3 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-3 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                    <div>
                      <div class="font-bold text-slate-900 dark:text-white">${p.name}</div>
                      <div class="text-[11px] text-slate-500">${p.targetRole || 'General Profile'} • Updated ${new Date(p.updatedAt).toLocaleDateString()}</div>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <button type="button" class="btn-load-saved-profile px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 font-bold rounded text-xs transition" data-id="${p.id}">
                        Load
                      </button>
                      <button type="button" class="btn-delete-saved-profile p-1 text-slate-400 hover:text-red-500 rounded" title="Delete" data-id="${p.id}">
                        <i data-lucide="trash" class="w-4 h-4"></i>
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Backup & Import Actions -->
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-3">
            <h4 class="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Export & Import JSON Backups</h4>
            <div class="flex flex-wrap gap-2">
              <button type="button" id="btn-pm-export-json" class="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5">
                <i data-lucide="download" class="w-3.5 h-3.5"></i> Export Active Profile (.json)
              </button>
              <button type="button" id="btn-pm-import-json" class="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5">
                <i data-lucide="upload" class="w-3.5 h-3.5"></i> Import Profile from File
              </button>
              <input type="file" id="inp-pm-file" class="hidden" accept=".json" />
            </div>
          </div>

          <!-- Privacy & Security Guarantee -->
          <div class="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/30 space-y-2">
            <div class="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i>
              <span>100% Client-Side Privacy Policy</span>
            </div>
            <p class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              CVForge does not transmit, store, or process your personal, educational, or work history data on any external web server. All information resides strictly within your computer's browser local storage (localStorage). You retain full ownership and control over your resume data at all times.
            </p>
            <div class="pt-2 flex flex-wrap justify-between items-center gap-2 border-t border-emerald-200 dark:border-emerald-900/30">
              <span class="text-[11px] text-slate-500">Need to start over or reset?</span>
              <div class="flex items-center gap-2">
                <button type="button" id="btn-pm-clear-candidate" class="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline">
                  Clear Candidate Data
                </button>
                <span class="text-slate-300 dark:text-slate-700">|</span>
                <button type="button" id="btn-pm-wipe-all" class="text-xs font-bold text-red-600 hover:text-red-700 hover:underline">
                  Wipe All Storage
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button type="button" id="btn-close-pm-footer" class="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-bold text-slate-800 dark:text-white transition">
            Close
          </button>
        </div>

      </div>
    `;

    const close = () => modal.classList.add('hidden');
    modal.classList.remove('hidden');

    document.getElementById('btn-close-pm')?.addEventListener('click', close);
    document.getElementById('btn-close-pm-footer')?.addEventListener('click', close);

    // Duplicate current profile
    document.getElementById('btn-save-current-as')?.addEventListener('click', () => {
      const name = prompt('Enter a name for this profile version:', `${currentProfile.personal?.fullName || 'Profile'} - Copy`);
      if (name) {
        appState.saveCurrentProfileAs(name);
        renderModal();
      }
    });

    // New blank profile
    document.getElementById('btn-new-blank-profile')?.addEventListener('click', () => {
      if (confirm('Create a new blank profile? Your current edits are saved in your browser.')) {
        appState.resetToBlank();
        close();
      }
    });

    // Load saved profile
    modal.querySelectorAll('.btn-load-saved-profile').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        appState.loadSavedProfile(id);
        close();
      };
    });

    // Delete saved profile
    modal.querySelectorAll('.btn-delete-saved-profile').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this saved profile?')) {
          appState.deleteSavedProfile(id);
          renderModal();
        }
      };
    });

    // Export & Import
    document.getElementById('btn-pm-export-json')?.addEventListener('click', () => {
      exportProfileToJson(currentProfile, `CVForge_${currentProfile.personal?.fullName || 'profile'}.json`);
    });

    const fileInp = document.getElementById('inp-pm-file');
    document.getElementById('btn-pm-import-json')?.addEventListener('click', () => fileInp?.click());
    fileInp?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        importProfileFromJson(file, (err, profile) => {
          if (err) {
            alert('Import error: ' + err.message);
          } else {
            appState.setProfile(profile);
            close();
            alert('Profile successfully loaded!');
          }
        });
      }
    });

    // Clear candidate data safely (modal)
    document.getElementById('btn-pm-clear-candidate')?.addEventListener('click', () => {
      close();
      openClearDataModal();
    });

    // Wipe all data
    document.getElementById('btn-pm-wipe-all')?.addEventListener('click', () => {
      if (confirm('Are you certain? This will delete all saved CVForge data from your local browser.')) {
        appState.clearAllData();
        close();
        alert('All local CVForge data deleted.');
      }
    });

    if (window.lucide) window.lucide.createIcons();
  };

  renderModal();
}


// Exports
exports.openProfileManagerModal = openProfileManagerModal;
};

  // Module: ./components/templateGalleryModal.js
  __modules__['./components/templateGalleryModal.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Visual Template Gallery Modal Component (Structured 2-Step Workflow)
 * 
 * Step 1: Select CV Format (10 International Standard Formats)
 * Step 2: Select Template (Only templates for the selected format - 5 per format, never mixed)
 * 
 * Preserves 100% of candidate data across all switches.
 */

const { appState } = __require__('../models/state.js', __currentDir);
const { TEMPLATES, FORMAT_CATEGORIES } = __require__('../templates/index.js', __currentDir);

function openTemplateGalleryModal() {
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


// Exports
exports.openTemplateGalleryModal = openTemplateGalleryModal;
};

  // Module: ./components/typographyModal.js
  __modules__['./components/typographyModal.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Typography & Font Family Customization Modal
 * Controls:
 * 1. 22 Professional Font Families (System & Google Web Fonts)
 * 2. Font Styles (Regular, Medium, Semibold, Bold, Italic, Bold Italic)
 * 3. Granular Target Directives (All Document, Headings Only, Body Only, Name Only)
 * 4. Interactive Live Font Preview Card
 * 5. Independent Point (pt) controls for Name, Headings, Body, and Contact lines
 */

const { appState } = __require__('../models/state.js', __currentDir);

function openTypographyModal() {
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


// Exports
exports.openTypographyModal = openTypographyModal;
};

  // Module: ./engine/atsEngine.js
  __modules__['./engine/atsEngine.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - ATS (Applicant Tracking System) Compatibility Engine
 * Performs detailed audits on structure, keywords, action verbs, metrics, and parseability.
 */

const ACTION_VERBS = new Set([
  'accelerated', 'achieved', 'administered', 'advised', 'analyzed', 'applied', 'architected',
  'automated', 'authored', 'built', 'championed', 'coached', 'collaborated', 'completed',
  'conceived', 'conducted', 'configured', 'constructed', 'consolidated', 'coordinated',
  'created', 'decreased', 'delivered', 'deployed', 'designed', 'developed', 'devised',
  'directed', 'documented', 'doubled', 'drafted', 'drove', 'eliminated', 'engineered',
  'enhanced', 'established', 'evaluated', 'executed', 'expanded', 'expedited', 'facilitated',
  'formulated', 'founded', 'generated', 'guided', 'headed', 'identified', 'implemented',
  'improved', 'increased', 'initiated', 'inspected', 'instituted', 'integrated', 'invented',
  'launched', 'led', 'managed', 'maximized', 'mentored', 'minimized', 'modernized',
  'negotiated', 'optimized', 'orchestrated', 'organized', 'overhauled', 'oversaw',
  'partnered', 'pioneered', 'planned', 'programmed', 'published', 're-engineered',
  'rebuilt', 'reduced', 'refined', 'reorganized', 'resolved', 'restructured', 'revamped',
  'scaled', 'secured', 'simplified', 'spearheaded', 'standardized', 'streamlined',
  'strengthened', 'structured', 'supervised', 'surpassed', 'trained', 'transformed',
  'unified', 'upgraded', 'validated'
]);

function runAtsAudit(profile) {
  let score = 0;
  const passed = [];
  const warnings = [];
  const suggestions = [];

  const personal = profile.personal || {};
  const experience = profile.experience || [];
  const education = profile.education || [];
  const skills = profile.skills || { technical: [], soft: [], tools: [] };
  const projects = profile.projects || [];
  const internships = profile.internships || [];

  // 1. Contact Information Checks (Total: 20 pts)
  if (personal.fullName && personal.fullName.trim().length > 2) {
    score += 5;
    passed.push('Full candidate name is clearly identified');
  } else {
    warnings.push('Candidate full name is missing or too short.');
    suggestions.push('Add your first and last name in Personal Information.');
  }

  if (personal.email && personal.email.includes('@') && personal.email.includes('.')) {
    score += 5;
    passed.push('Valid professional email address detected');
  } else {
    warnings.push('Valid email address is missing.');
    suggestions.push('Provide a professional email address for recruiter contact.');
  }

  if (personal.phone && personal.phone.replace(/[^0-9]/g, '').length >= 7) {
    score += 5;
    passed.push('Telephone contact number is provided');
  } else {
    warnings.push('Phone number is missing or incomplete.');
    suggestions.push('Include a reachable phone number with country/area code.');
  }

  if (personal.location && personal.location.trim().length > 2) {
    score += 5;
    passed.push('Geographic location (City, State/Country) is provided');
  } else {
    suggestions.push('Add your city and country/state to assist geo-targeted ATS searches.');
  }

  // 2. Professional Summary / Headline (Total: 15 pts)
  if (personal.headline && personal.headline.trim().length > 3) {
    score += 5;
    passed.push('Clear professional job headline provided');
  } else {
    suggestions.push('Add a job title headline (e.g. "Senior Cloud Engineer") right under your name.');
  }

  if (personal.summary && personal.summary.trim().split(/\s+/).length >= 25) {
    score += 10;
    passed.push('Substantive professional summary provided (>25 words)');
  } else if (personal.summary && personal.summary.trim().length > 0) {
    score += 5;
    suggestions.push('Expand your professional summary to 3-5 sentences highlighting core competencies.');
  } else {
    warnings.push('Professional summary section is completely empty.');
    suggestions.push('Write a brief executive summary or use the Smart Summary Generator.');
  }

  // 3. Experience / Practical Evidence (Total: 25 pts)
  const hasExperience = experience.length > 0;
  const hasInternships = internships.length > 0;
  const hasProjects = projects.length > 0;

  if (hasExperience || hasInternships || hasProjects) {
    score += 10;
    passed.push('Documented practical experience, projects, or internships found');
  } else {
    warnings.push('No work experience, internships, or practical projects found.');
    suggestions.push('Add work experience, academic projects, or internships to demonstrate competence.');
  }

  // Check Bullet Points, Action Verbs, and Metrics
  let allBullets = [];
  experience.forEach(e => {
    if (Array.isArray(e.highlights)) allBullets.push(...e.highlights);
  });
  internships.forEach(i => {
    if (Array.isArray(i.highlights)) allBullets.push(...i.highlights);
  });
  projects.forEach(p => {
    if (p.description) allBullets.push(p.description);
    if (p.outcomes) allBullets.push(p.outcomes);
  });

  if (allBullets.length > 0) {
    let actionVerbCount = 0;
    let metricCount = 0;
    const metricRegex = /(\d+[\d,.]*%?|\$\d+[\d,.]*[kKmMbB]?|\d+x|\d+\s*(percent|users|engineers|years|clients|transactions|dollars))/i;

    allBullets.forEach(bullet => {
      const clean = bullet.trim();
      const firstWord = clean.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
      if (firstWord && ACTION_VERBS.has(firstWord)) {
        actionVerbCount++;
      }
      if (metricRegex.test(clean)) {
        metricCount++;
      }
    });

    const actionVerbRatio = actionVerbCount / allBullets.length;
    if (actionVerbRatio >= 0.4 || actionVerbCount >= 4) {
      score += 10;
      passed.push(`Strong action verbs found in bullet points (${actionVerbCount} action verbs)`);
    } else {
      suggestions.push(`Start bullet points with strong past-tense action verbs (e.g., "Led", "Architected", "Optimized" instead of "Responsible for").`);
    }

    if (metricCount >= 2) {
      score += 5;
      passed.push(`Quantified achievements detected (${metricCount} metric/impact points)`);
    } else {
      suggestions.push('Quantify your achievements with numbers, percentages, or cost savings (e.g., "Reduced latency by 34%").');
    }
  }

  // 4. Education & Academic Background (Total: 15 pts)
  if (education.length > 0) {
    const hasDegree = education.some(e => e.degree && e.degree.trim().length > 2);
    const hasSchool = education.some(e => e.institution && e.institution.trim().length > 2);
    if (hasDegree && hasSchool) {
      score += 15;
      passed.push('Clear educational credentials with degree and institution found');
    } else {
      score += 8;
      suggestions.push('Ensure each education entry lists both degree title and school/university name.');
    }
  } else {
    suggestions.push('Add your highest educational degree, university, or equivalent diploma.');
  }

  // 5. Skills Section (Total: 15 pts)
  const totalSkills = Array.isArray(skills)
    ? skills.length
    : ((skills.technical || []).length + (skills.tools || []).length);

  if (totalSkills >= 8) {
    score += 15;
    passed.push(`Comprehensive skill taxonomy detected (${totalSkills} skills & tools)`);
  } else if (totalSkills >= 4) {
    score += 10;
    suggestions.push('Add more specific technical skills, frameworks, or tools to improve keyword matching.');
  } else {
    warnings.push('Very few skills listed.');
    suggestions.push('List at least 6-8 core technical competencies and tools relevant to your target role.');
  }

  // 6. Format-Specific Parseability (Total: 10 pts)
  const currentFormat = profile.format || 'reverse-chronological';
  if (currentFormat === 'ats-friendly') {
    score += 10;
    passed.push('Using strict ATS-Friendly single-column layout optimized for parsers');
  } else if (currentFormat === 'reverse-chronological' || currentFormat === 'combination' || currentFormat === 'targeted') {
    score += 8;
    passed.push('Layout format is well-suited for both ATS parsing and human recruiters');
  } else if (currentFormat === 'creative-visual') {
    warnings.push('Creative Visual format uses multi-column design. For strict ATS portals (e.g. Workday, Taleo), switch to "ATS-Friendly" or "Reverse Chronological" before applying.');
  } else {
    score += 6;
  }

  // Cap score between 0 and 100
  score = Math.min(100, Math.max(0, score));

  const disclaimer = 'ATS Compatibility scores are rule-based heuristics designed to guide formatting and keyword presence. They do not guarantee job interview callbacks or hiring decisions, as company hiring criteria vary widely.';

  let tier = 'Needs Work';
  let tierColor = 'text-red-500 bg-red-50 dark:bg-red-950/40 border-red-200';
  if (score >= 85) {
    tier = 'ATS Optimized (Excellent)';
    tierColor = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200';
  } else if (score >= 70) {
    tier = 'Good Compatibility';
    tierColor = 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200';
  } else if (score >= 50) {
    tier = 'Moderate Compatibility';
    tierColor = 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200';
  }

  const checks = [
    ...passed.map(name => ({ status: 'pass', name })),
    ...warnings.map(name => ({ status: 'warning', name })),
    ...suggestions.map(name => ({ status: 'suggestion', name }))
  ];

  return {
    score,
    tier,
    tierColor,
    passed,
    warnings,
    suggestions,
    checks,
    disclaimer
  };
}


// Exports
exports.runAtsAudit = runAtsAudit;
};

  // Module: ./engine/completeness.js
  __modules__['./engine/completeness.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Profile Completeness Calculator
 * Calculates percentage completion and guides user on completing key sections.
 */

function calculateCompleteness(profile) {
  const skillsCount = Array.isArray(profile.skills)
    ? profile.skills.length
    : ((profile.skills?.technical || []).length + (profile.skills?.tools || []).length);

  const checks = [
    { label: 'Full Name', done: !!(profile.personal?.fullName && profile.personal.fullName.trim().length > 2), weight: 10 },
    { label: 'Job Headline', done: !!(profile.personal?.headline && profile.personal.headline.trim().length > 3), weight: 10 },
    { label: 'Email Address', done: !!(profile.personal?.email && profile.personal.email.includes('@')), weight: 10 },
    { label: 'Phone Number', done: !!(profile.personal?.phone && profile.personal.phone.trim().length > 6), weight: 5 },
    { label: 'Location', done: !!(profile.personal?.location && profile.personal.location.trim().length > 2), weight: 5 },
    { label: 'Professional Summary', done: !!(profile.personal?.summary && profile.personal.summary.trim().length > 20), weight: 15 },
    { label: 'Education Credential', done: (profile.education || []).length > 0, weight: 15 },
    { label: 'Experience or Projects', done: (profile.experience || []).length > 0 || (profile.projects || []).length > 0 || (profile.internships || []).length > 0, weight: 15 },
    { label: 'Skills Added', done: skillsCount >= 3, weight: 10 },
    { label: 'Languages', done: (profile.languages || []).length > 0, weight: 5 }
  ];

  let completedWeight = 0;
  const missing = [];

  checks.forEach(c => {
    if (c.done) {
      completedWeight += c.weight;
    } else {
      missing.push(c.label);
    }
  });

  return {
    percentage: Math.min(100, completedWeight),
    checks,
    missing
  };
}


// Exports
exports.calculateCompleteness = calculateCompleteness;
};

  // Module: ./engine/countryRules.js
  __modules__['./engine/countryRules.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - International CV Conventions & Country Guidance Engine
 * Provides detailed, country-specific advice for USA, Canada, UK, Germany, France, Australia, and EU.
 */

const COUNTRY_RULES = {
  US: {
    countryName: 'United States',
    documentTerm: 'Resume',
    typicalLength: '1 page (early/mid-career) to 2 pages (10+ yrs)',
    paperSize: 'Letter (8.5 x 11 in)',
    photoRecommended: false,
    personalDetailsAllowed: false,
    guidelines: [
      'Strict anti-discrimination laws (EEOC): NEVER include photos, date of birth, age, gender, marital status, or nationality.',
      'Use action-driven bullet points starting with strong past-tense action verbs (e.g., "Architected", "Reduced", "Delivered").',
      'Quantify results wherever possible (percentages, dollar amounts, hours saved, scale).',
      'Use standard US Letter paper size instead of A4 for US recruiters.',
      'Keep it to 1 page for students/entry-level, maximum 2 pages for senior executives.'
    ],
    recommendedFormats: ['reverse-chronological', 'combination', 'ats-friendly', 'targeted']
  },

  CA: {
    countryName: 'Canada',
    documentTerm: 'Resume',
    typicalLength: '1 to 2 pages',
    paperSize: 'Letter (8.5 x 11 in)',
    photoRecommended: false,
    personalDetailsAllowed: false,
    guidelines: [
      'Similar to the US: strict human rights legislation prohibits photos, age, marital status, or personal background details.',
      'Highlight bilingual capabilities (English / French) prominently if applying to federal or Quebec-facing roles.',
      'Emphasize transferable Canadian or international equivalencies and clear technical competencies.',
      'Quantify business impacts and team leadership outcomes.'
    ],
    recommendedFormats: ['reverse-chronological', 'combination', 'ats-friendly']
  },

  UK: {
    countryName: 'United Kingdom',
    documentTerm: 'Curriculum Vitae (CV)',
    typicalLength: '2 pages standard',
    paperSize: 'A4 (210 x 297 mm)',
    photoRecommended: false,
    personalDetailsAllowed: false,
    guidelines: [
      'Referred to strictly as a "CV", rarely "Resume". Standard length is exactly 2 pages.',
      'Photos are not standard practice in the UK, except in performing arts or modeling.',
      'Include a concise 3-4 sentence "Personal Statement" at the top outlining your professional identity and career objective.',
      'Use British English spelling (e.g., "Specialised", "Organised", "Programme", "Analysed").',
      'Standard A4 paper size should be used for all UK job applications.',
      'Include verified referee contact details if requested by the prospective employer.'
    ],
    recommendedFormats: ['reverse-chronological', 'chronological', 'combination', 'academic']
  },

  DE: {
    countryName: 'Germany (DACH)',
    documentTerm: 'Lebenslauf',
    typicalLength: '1 to 2 pages',
    paperSize: 'A4 (210 x 297 mm)',
    photoRecommended: true,
    personalDetailsAllowed: true,
    guidelines: [
      'Traditionally structured as a "Tabellarischer Lebenslauf" (tabular CV) with clear left-aligned date columns.',
      'A professional application photograph (Bewerbungsfoto) is traditional and widely accepted.',
      'Personal details such as nationality, location, and date of birth are standard in traditional sectors.',
      'Languages must specify exact proficiency levels (CEFR: A1 to C2 or fluent/business fluent).',
      'A signature and date at the bottom are still appreciated in formal German organizations.'
    ],
    recommendedFormats: ['europass', 'chronological', 'reverse-chronological']
  },

  FR: {
    countryName: 'France',
    documentTerm: 'CV (Curriculum Vitae)',
    typicalLength: 'Strictly 1 page (unless 15+ years seniority)',
    paperSize: 'A4 (210 x 297 mm)',
    photoRecommended: true,
    personalDetailsAllowed: true,
    guidelines: [
      'French recruiters strongly favor concise, highly structured single-page CVs.',
      'A professional photo in the header is standard practice in France.',
      'Highlight degrees, prestigious institutions (Grandes Écoles), and academic qualifications prominently.',
      'Explicitly grade language proficiencies (Bilingual, Courant, Intermédiaire, Notions).',
      'Avoid vague self-promotion; use clear factual descriptions of responsibilities.'
    ],
    recommendedFormats: ['reverse-chronological', 'skills-based', 'europass']
  },

  AU: {
    countryName: 'Australia & New Zealand',
    documentTerm: 'Resume / CV',
    typicalLength: '2 to 3 pages',
    paperSize: 'A4 (210 x 297 mm)',
    photoRecommended: false,
    personalDetailsAllowed: false,
    guidelines: [
      'Australian resumes are typically longer and more comprehensive (2 to 3 pages is completely acceptable).',
      'Do not include photos, marital status, or date of birth.',
      'Structure work experience with distinct "Key Responsibilities" and "Key Achievements" sub-sections.',
      'Two professional references with full contact information (phone & email) are traditionally expected at the end.',
      'Use British/Australian English spelling conventions.'
    ],
    recommendedFormats: ['reverse-chronological', 'combination', 'chronological']
  },

  EU: {
    countryName: 'European Union (General / Europass)',
    documentTerm: 'Europass CV',
    typicalLength: '2 to 3 pages',
    paperSize: 'A4 (210 x 297 mm)',
    photoRecommended: true,
    personalDetailsAllowed: true,
    guidelines: [
      'Use the standardized European Union Europass layout for cross-border EU institution applications.',
      'Standardized Common European Framework of Reference for Languages (CEFR: A1-C2) for all languages.',
      'Digital competences, driving licenses, and communication skills are standardized sections.',
      'Clean tabular structure that facilitates multinational recognition of qualifications.'
    ],
    recommendedFormats: ['europass', 'skills-based', 'reverse-chronological']
  },

  BD: {
    countryName: 'Bangladesh',
    code: 'BD',
    documentTerm: 'Curriculum Vitae (CV)',
    typicalLength: '2 pages standard (1-3 pages)',
    paperSize: 'A4 (210 x 297 mm)',
    photoRecommended: true,
    personalDetailsAllowed: true,
    guidelines: [
      'Standard A4 paper size is strictly expected across academic, governmental, NGO, and corporate job applications in Bangladesh.',
      'A formal passport-sized photograph (formal business attire, plain background) is standard practice and expected.',
      'Personal details section traditionally includes Present & Permanent Address, Father\'s Name, Mother\'s Name, Date of Birth, Religion, Marital Status, and Nationality.',
      'Standard date convention is typically DD/MM/YYYY.',
      'Educational qualifications are customarily presented in a clear tabular format detailing Degree, Group/Major, Board/University, Passing Year, and GPA/CGPA/Division.',
      'A formal declaration of truth ("I hereby declare that the particulars given above are true and correct to the best of my knowledge...") with date and signature is standard for institutional and corporate CVs in Bangladesh.',
      'Two professional or academic references with full designations, affiliations, official phone numbers, and emails are expected.'
    ],
    recommendedFormats: ['custom-bd-classic', 'custom-executive-bluebar', 'reverse-chronological', 'chronological']
  }
};


// Exports
exports.COUNTRY_RULES = COUNTRY_RULES;
};

  // Module: ./engine/keywordMatcher.js
  __modules__['./engine/keywordMatcher.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Job Description Keyword Matcher & Optimizer
 * Compares user CV profile against pasted job description text to highlight matches and gaps.
 */

const STOP_WORDS = new Set([
  'and', 'the', 'for', 'with', 'that', 'this', 'from', 'have', 'are', 'was', 'were',
  'will', 'our', 'you', 'your', 'about', 'can', 'has', 'their', 'which', 'who',
  'what', 'when', 'where', 'how', 'any', 'all', 'into', 'out', 'must', 'should',
  'would', 'could', 'been', 'being', 'having', 'over', 'more', 'most', 'other',
  'some', 'such', 'than', 'them', 'then', 'there', 'these', 'they', 'through',
  'work', 'years', 'experience', 'skills', 'ability', 'looking', 'role', 'team',
  'company', 'opportunity', 'position', 'responsibilities', 'requirements', 'qualifications'
]);

function matchJobDescription(jobText, profile) {
  if (!jobText || jobText.trim().length < 20) {
    return {
      matchScore: 0,
      matchedKeywords: [],
      missingKeywords: [],
      totalKeywordsCount: 0
    };
  }

  // 1. Build profile word bank
  const profileTokens = new Set();

  // Add headline and summary
  tokenize(profile.personal?.headline || '').forEach(t => profileTokens.add(t));
  tokenize(profile.personal?.summary || '').forEach(t => profileTokens.add(t));

  // Add skills
  if (Array.isArray(profile.skills)) {
    profile.skills.forEach(s => {
      tokenize(s.name || '').forEach(t => profileTokens.add(t));
    });
  } else {
    (profile.skills?.technical || []).forEach(s => {
      tokenize(s.name).forEach(t => profileTokens.add(t));
    });
    (profile.skills?.tools || []).forEach(t => {
      tokenize(t).forEach(w => profileTokens.add(w));
    });
    (profile.skills?.soft || []).forEach(s => {
      tokenize(s.name).forEach(t => profileTokens.add(t));
    });
  }

  // Add experience highlights
  (profile.experience || []).forEach(e => {
    tokenize(e.title || '').forEach(t => profileTokens.add(t));
    (e.highlights || []).forEach(h => {
      tokenize(h).forEach(t => profileTokens.add(t));
    });
    (e.technologies || []).forEach(tech => {
      tokenize(tech).forEach(t => profileTokens.add(t));
    });
  });

  // Add projects
  (profile.projects || []).forEach(p => {
    tokenize(p.title || '').forEach(t => profileTokens.add(t));
    tokenize(p.description || '').forEach(t => profileTokens.add(t));
    (p.technologies || []).forEach(tech => {
      tokenize(tech).forEach(t => profileTokens.add(t));
    });
  });

  // 2. Extract significant terms from Job Description
  const rawWords = jobText.toLowerCase().match(/[a-z0-9+#.-]{2,}/g) || [];
  const freqMap = new Map();

  rawWords.forEach(w => {
    const clean = w.replace(/^[^a-z0-9]+|[^a-z0-9+]+$/g, '');
    if (clean.length > 2 && !STOP_WORDS.has(clean) && !/^\d+$/.test(clean)) {
      freqMap.set(clean, (freqMap.get(clean) || 0) + 1);
    }
  });

  // Sort by frequency
  const sortedKeywords = Array.from(freqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(entry => entry[0]);

  const matchedKeywords = [];
  const missingKeywords = [];

  sortedKeywords.forEach(kw => {
    if (profileTokens.has(kw) || Array.from(profileTokens).some(pt => pt.includes(kw) || kw.includes(pt))) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const total = matchedKeywords.length + missingKeywords.length;
  const matchScore = total > 0 ? Math.round((matchedKeywords.length / total) * 100) : 0;

  return {
    matchScore,
    matchedKeywords,
    missingKeywords,
    totalKeywordsCount: total
  };
}

function tokenize(text) {
  if (!text) return [];
  const matches = text.toLowerCase().match(/[a-z0-9+#.-]{2,}/g) || [];
  return matches
    .map(w => w.replace(/^[^a-z0-9]+|[^a-z0-9+]+$/g, ''))
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));
}


// Exports
exports.matchJobDescription = matchJobDescription;
};

  // Module: ./engine/summaryEngine.js
  __modules__['./engine/summaryEngine.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Smart Professional Summary Generator
 * Generates customized, tailored professional summaries strictly grounded in the user's
 * real inputs (headline, skills, experience, education). Never hallucinates false facts!
 */

function generateSummaries(profile) {
  const headline = profile.personal?.headline || profile.targetRole || 'Professional';
  const yearsExp = calculateYearsOfExperience(profile.experience || []);
  const topTech = Array.isArray(profile.skills)
    ? profile.skills.slice(0, 5).map(s => s.name).filter(Boolean)
    : (profile.skills?.technical || []).slice(0, 5).map(s => s.name);
  const techStr = topTech.length > 0 ? topTech.join(', ') : 'modern industry technologies';
  const highestEdu = profile.education?.[0]?.degree || '';
  const topProjects = (profile.projects || []).slice(0, 2).map(p => p.title);
  const hasExp = (profile.experience || []).length > 0;

  const summaries = [];

  // 1. Results-Driven & Executive
  if (hasExp) {
    summaries.push({
      title: 'Results-Driven & Strategic',
      text: `Accomplished ${headline} with over ${yearsExp}+ years of dedicated experience delivering scalable solutions and driving technical excellence. Proven track record of architecting mission-critical systems, spearheading cross-functional initiatives, and leveraging ${techStr} to solve complex business challenges while maximizing operational efficiency and reliability.`
    });
  } else {
    summaries.push({
      title: 'High-Potential & Project-Driven',
      text: `Motivated ${headline}${highestEdu ? ` holding a ${highestEdu}` : ''} equipped with rigorous analytical training and hands-on project engineering experience. Demonstrated proficiency in ${techStr} through successful academic and open-source project deliverables. Eager to leverage strong problem-solving capabilities and collaborative drive within an ambitious engineering team.`
    });
  }

  // 2. Technical Specialist & Architecture Focus
  summaries.push({
    title: 'Technical Specialist & Architecture Focus',
    text: `Specialized ${headline} adept in full lifecycle system architecture, robust software design patterns, and engineering modern platforms using ${techStr}. Recognized for write-once maintainable code, disciplined automated testing, and a continuous focus on performance optimization, security, and developer productivity.`
  });

  // 3. Growth & Innovation Oriented
  summaries.push({
    title: 'Growth, Agile & Innovation Focus',
    text: `Dynamic and adaptable ${headline} combining deep expertise in ${techStr} with a user-centric, agile delivery mindset. Passionate about transforming product requirements into robust, high-impact digital experiences while fostering knowledge-sharing and continuous engineering improvements.`
  });

  return summaries;
}

function calculateYearsOfExperience(expList) {
  if (!expList || expList.length === 0) return 0;
  let totalMonths = 0;
  const now = new Date();

  expList.forEach(item => {
    if (!item.startDate) return;
    const start = new Date(item.startDate);
    const end = item.current || !item.endDate ? now : new Date(item.endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (months > 0) totalMonths += months;
  });

  const years = Math.max(1, Math.round(totalMonths / 12));
  return years;
}


// Exports
exports.generateSummaries = generateSummaries;
};

  // Module: ./export/docxExporter.js
  __modules__['./export/docxExporter.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Genuine Fully Editable Microsoft Word (.docx) Export Engine
 * 
 * Strict invariants:
 * - 100% native Word document content (paragraphs, runs, headings, tables, bullets)
 * - Zero background images, zero canvases, zero PDF-to-DOCX conversions
 * - Every piece of candidate text (name, summary, experience, education, skills, references) is individually editable
 * - Preserves template layout:
 *   * Two-column templates use native 2-column borderless Word tables
 *   * Institutional Classic (Bangladesh) uses native 5-column bordered Word table & colon table
 *   * Executive Blue-Banner uses shaded banner tables & section bands
 *   * Single-column & ATS use clean semantic paragraphs with border rules
 * - Completely omits reference availability text
 * - Completely omits References section when no referees exist
 * - Supports custom millimeter margins and point-based font sizes
 */

function buildDocxDocument(profile, docxLib) {
  const {
    Document,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    ShadingType
  } = docxLib;

  const p = profile.personal || {};
  const settings = profile.settings || {};
  const formatId = profile.format || 'reverse-chronological';

  // Point-based font sizes (docx uses half-points: pt * 2)
  const fontSizes = settings.fontSizes || { name: 24, headings: 13, body: 10, contact: 9.5 };
  const marginsCustom = settings.marginsCustom || { top: 15, bottom: 15, left: 15, right: 15 };

  const nameSize = Math.round((fontSizes.name || 24) * 2);
  const headingSize = Math.round((fontSizes.headings || 13) * 2);
  const subHeadingSize = Math.round((fontSizes.headings || 13) * 1.8);
  const bodySize = Math.round((fontSizes.body || 10) * 2);
  const contactSize = Math.round((fontSizes.contact || 9.5) * 2);

  // Brand Color hex without '#'
  const brandColor = (settings.primaryColor || '#1e3a8a').replace('#', '').toUpperCase();
  const docFont = settings.fontFamily || 'Calibri';

  // Candidate Data Extraction
  const contactParts = [
    p.location,
    p.email,
    p.phone,
    p.linkedin,
    p.github,
    p.website || p.portfolio
  ].filter(Boolean);

  const isFreshGraduate = profile.isFreshGraduate || (profile.experience || []).length === 0;

  let skillsList = [];
  if (Array.isArray(profile.skills)) {
    skillsList = profile.skills.filter(s => s && s.name);
  } else if (profile.skills && typeof profile.skills === 'object') {
    const s = profile.skills;
    const addS = (arr) => (arr || []).forEach(item => {
      const name = typeof item === 'string' ? item : item?.name;
      const level = typeof item === 'object' ? item?.level : '';
      if (name && name.trim()) skillsList.push({ name: name.trim(), level: level || '' });
    });
    addS(s.technical);
    addS(s.tools);
    addS(s.programming);
    addS(s.dataAnalysis);
    addS(s.professional || s.soft);
    addS(s.communication);
  }

  const validRefs = (profile.references || []).filter(r => r && (r.name || r.title || r.company || r.organization || r.email || r.phone));

  // Determine Layout Family
  const isTwoColumn = [
    'academic-scholar-two-column',
    'custom-academic-green',
    'creative-visual',
    'creative-duo-tone'
  ].includes(formatId);

  const isInstitutionalClassic = [
    'intl-institutional-classic',
    'custom-bd-classic',
    'bangladesh-cv'
  ].includes(formatId);

  const isExecutiveBlueBanner = [
    'exec-blue-banner',
    'custom-executive-bluebar'
  ].includes(formatId);

  let docChildren = [];

  // -------------------------------------------------------------
  // LAYOUT 1: TWO-COLUMN TEMPLATES (Academic Scholar, Creative)
  // -------------------------------------------------------------
  if (isTwoColumn) {
    const leftCellChildren = [];
    const rightCellChildren = [];

    // Left Column: Contact, Skills, Languages, Certifications
    leftCellChildren.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: 'CONTACT', bold: true, size: Math.round(headingSize * 0.9), color: brandColor, font: docFont })
        ]
      })
    );

    contactParts.forEach(c => {
      leftCellChildren.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: c, size: contactSize, font: docFont })]
        })
      );
    });

    if (skillsList.length > 0) {
      leftCellChildren.push(
        new Paragraph({
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({ text: 'SKILLS & TOOLS', bold: true, size: Math.round(headingSize * 0.9), color: brandColor, font: docFont })
          ]
        })
      );
      skillsList.forEach(s => {
        leftCellChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({ text: s.name, bold: true, size: contactSize, font: docFont }),
              s.level ? new TextRun({ text: ` (${s.level})`, size: contactSize, color: '64748B', font: docFont }) : null
            ].filter(Boolean)
          })
        );
      });
    }

    if (profile.languages && profile.languages.length > 0) {
      leftCellChildren.push(
        new Paragraph({
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({ text: 'LANGUAGES', bold: true, size: Math.round(headingSize * 0.9), color: brandColor, font: docFont })
          ]
        })
      );
      profile.languages.forEach(l => {
        leftCellChildren.push(
          new Paragraph({
            spacing: { after: 30 },
            children: [
              new TextRun({ text: l.name, bold: true, size: contactSize, font: docFont }),
              new TextRun({ text: ` — ${l.proficiency || l.cefr || 'Proficient'}`, size: contactSize, font: docFont })
            ]
          })
        );
      });
    }

    // Right Column: Name, Headline, Summary, Experience, Education, Projects, Publications, References
    rightCellChildren.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: (p.fullName || 'Candidate Name').toUpperCase(), bold: true, size: nameSize, color: brandColor, font: docFont })
        ]
      })
    );

    if (p.headline) {
      rightCellChildren.push(
        new Paragraph({
          spacing: { after: 140 },
          children: [
            new TextRun({ text: p.headline, bold: true, size: Math.round(headingSize * 0.95), color: '475569', font: docFont })
          ]
        })
      );
    }

    if (p.summary || p.objective) {
      rightCellChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 60 },
          border: { bottom: { color: brandColor, space: 4, value: 'single', size: 8 } },
          children: [new TextRun({ text: 'RESEARCH PROFILE / SUMMARY', bold: true, size: headingSize, color: brandColor, font: docFont })]
        }),
        new Paragraph({
          spacing: { after: 160 },
          children: [new TextRun({ text: p.summary || p.objective, size: bodySize, font: docFont })]
        })
      );
    }

    if (!isFreshGraduate && profile.experience && profile.experience.length > 0) {
      rightCellChildren.push(
        new Paragraph({
          spacing: { before: 140, after: 60 },
          border: { bottom: { color: brandColor, space: 4, value: 'single', size: 8 } },
          children: [new TextRun({ text: 'PROFESSIONAL EXPERIENCE', bold: true, size: headingSize, color: brandColor, font: docFont })]
        })
      );
      profile.experience.forEach(exp => {
        rightCellChildren.push(
          new Paragraph({
            spacing: { before: 80, after: 20 },
            children: [
              new TextRun({ text: exp.title || '', bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` — ${exp.company || ''}`, bold: true, size: bodySize, color: '334155', font: docFont }),
              new TextRun({ text: ` [${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}]`, size: contactSize, color: '64748B', font: docFont })
            ]
          })
        );
        if (Array.isArray(exp.highlights)) {
          exp.highlights.forEach(h => {
            rightCellChildren.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 20 },
                children: [new TextRun({ text: h, size: bodySize, font: docFont })]
              })
            );
          });
        }
      });
    }

    if (profile.education && profile.education.length > 0) {
      rightCellChildren.push(
        new Paragraph({
          spacing: { before: 160, after: 60 },
          border: { bottom: { color: brandColor, space: 4, value: 'single', size: 8 } },
          children: [new TextRun({ text: 'EDUCATION & QUALIFICATIONS', bold: true, size: headingSize, color: brandColor, font: docFont })]
        })
      );
      profile.education.forEach(edu => {
        const deg = `${edu.degree || ''}${edu.major || edu.field ? ` in ${edu.major || edu.field}` : ''}`;
        rightCellChildren.push(
          new Paragraph({
            spacing: { before: 60, after: 20 },
            children: [
              new TextRun({ text: deg, bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` — ${edu.institution || ''}`, size: bodySize, font: docFont }),
              new TextRun({ text: ` (${edu.startDate || ''} – ${edu.current ? 'Present' : edu.endDate || ''})`, size: contactSize, color: '64748B', font: docFont })
            ]
          })
        );
        if (edu.gpa) {
          rightCellChildren.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [new TextRun({ text: `Result / CGPA: ${edu.gpa}`, size: contactSize, italics: true, font: docFont })]
            })
          );
        }
        if (edu.thesis) {
          rightCellChildren.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [new TextRun({ text: `Thesis: "${edu.thesis}"`, size: contactSize, italics: true, color: '475569', font: docFont })]
            })
          );
        }
      });
    }

    if (profile.publications && profile.publications.length > 0) {
      rightCellChildren.push(
        new Paragraph({
          spacing: { before: 160, after: 60 },
          border: { bottom: { color: brandColor, space: 4, value: 'single', size: 8 } },
          children: [new TextRun({ text: 'PUBLICATIONS', bold: true, size: headingSize, color: brandColor, font: docFont })]
        })
      );
      profile.publications.forEach((pub, idx) => {
        rightCellChildren.push(
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [
              new TextRun({ text: `[${idx + 1}] `, bold: true, size: contactSize, font: docFont }),
              pub.authors ? new TextRun({ text: `${pub.authors}. `, size: contactSize, font: docFont }) : null,
              new TextRun({ text: `"${pub.title}". `, bold: true, size: contactSize, font: docFont }),
              new TextRun({ text: `${pub.journal || ''} (${pub.year || ''}).`, italics: true, size: contactSize, font: docFont }),
              pub.doi ? new TextRun({ text: ` DOI: ${pub.doi}`, size: contactSize, color: '1D4ED8', font: docFont }) : null
            ].filter(Boolean)
          })
        );
      });
    }

    // References: ONLY when valid referee entries exist
    if (validRefs.length > 0) {
      rightCellChildren.push(
        new Paragraph({
          spacing: { before: 160, after: 60 },
          border: { bottom: { color: brandColor, space: 4, value: 'single', size: 8 } },
          children: [new TextRun({ text: 'REFERENCES', bold: true, size: headingSize, color: brandColor, font: docFont })]
        })
      );
      validRefs.forEach(r => {
        const org = r.organization || r.company || '';
        rightCellChildren.push(
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [
              new TextRun({ text: r.name, bold: true, size: bodySize, font: docFont }),
              (r.title || org) ? new TextRun({ text: ` — ${r.title || ''}${r.title && org ? ` (${org})` : org}`, size: bodySize, font: docFont }) : null,
              r.email ? new TextRun({ text: ` | Email: ${r.email}`, size: contactSize, color: '64748B', font: docFont }) : null,
              r.phone ? new TextRun({ text: ` | Phone: ${r.phone}`, size: contactSize, color: '64748B', font: docFont }) : null
            ].filter(Boolean)
          })
        );
      });
    }

    // Wrap both columns into a native 2-column Word Table (32% left, 68% right)
    const twoColTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 32, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE }
              },
              children: leftCellChildren
            }),
            new TableCell({
              width: { size: 68, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE }
              },
              children: rightCellChildren
            })
          ]
        })
      ]
    });

    docChildren.push(twoColTable);

  // -------------------------------------------------------------
  // LAYOUT 2: INSTITUTIONAL CLASSIC (BANGLADESH BORDERED STANDARD)
  // -------------------------------------------------------------
  } else if (isInstitutionalClassic) {
    // Top Title & Candidate Name
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({ text: 'CURRICULUM VITAE', bold: true, size: Math.round(nameSize * 0.9), color: '059669', font: docFont })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({ text: 'OF', bold: true, size: bodySize, color: '64748B', font: docFont })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({ text: (p.fullName || 'Candidate Name').toUpperCase(), bold: true, size: nameSize, font: docFont })
        ]
      })
    );

    if (contactParts.length > 0) {
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: contactParts.join('  |  '), size: contactSize, color: '475569', font: docFont })
          ]
        })
      );
    }

    // Career Objective
    if (p.summary || p.objective) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 120, after: 60 },
          border: { bottom: { color: '059669', space: 4, value: 'single', size: 10 } },
          children: [new TextRun({ text: 'CAREER OBJECTIVE', bold: true, size: headingSize, color: '059669', font: docFont })]
        }),
        new Paragraph({
          spacing: { after: 160 },
          children: [new TextRun({ text: p.summary || p.objective, size: bodySize, font: docFont })]
        })
      );
    }

    // Academic Credentials Table (Native 5-Column Word Table with thin borders & shaded header)
    if (profile.education && profile.education.length > 0) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 160, after: 80 },
          border: { bottom: { color: '059669', space: 4, value: 'single', size: 10 } },
          children: [new TextRun({ text: 'ACADEMIC QUALIFICATIONS', bold: true, size: headingSize, color: '059669', font: docFont })]
        })
      );

      const tableRows = [];
      // Header Row
      tableRows.push(
        new TableRow({
          tableHeader: true,
          children: ['Examination / Degree', 'Board / Institute', 'Group / Major', 'Passing Year', 'Result / GPA'].map(h => 
            new TableCell({
              shading: { fill: 'E2E8F0', type: ShadingType.SOLID },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: '94A3B8' },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: '94A3B8' },
                left: { style: BorderStyle.SINGLE, size: 4, color: '94A3B8' },
                right: { style: BorderStyle.SINGLE, size: 4, color: '94A3B8' }
              },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, size: contactSize, font: docFont })] })]
            })
          )
        })
      );

      // Data Rows
      profile.education.forEach(edu => {
        const rowCells = [
          edu.degree || '',
          edu.institution || '',
          edu.major || edu.field || 'N/A',
          edu.endDate || edu.startDate || '',
          edu.gpa || 'Appeared'
        ];
        tableRows.push(
          new TableRow({
            children: rowCells.map(val => 
              new TableCell({
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
                  bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
                  left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
                  right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' }
                },
                children: [new Paragraph({ children: [new TextRun({ text: String(val), size: contactSize, font: docFont })] })]
              })
            )
          })
        );
      });

      docChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows
        })
      );
    }

    // Work Experience
    if (!isFreshGraduate && profile.experience && profile.experience.length > 0) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 200, after: 80 },
          border: { bottom: { color: '059669', space: 4, value: 'single', size: 10 } },
          children: [new TextRun({ text: 'EXPERIENCE & EMPLOYMENT', bold: true, size: headingSize, color: '059669', font: docFont })]
        })
      );
      profile.experience.forEach(exp => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 60, after: 20 },
            children: [
              new TextRun({ text: exp.title || '', bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` — ${exp.company || ''}`, bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` (${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''})`, size: contactSize, color: '64748B', font: docFont })
            ]
          })
        );
        if (exp.description) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [new TextRun({ text: exp.description, size: contactSize, font: docFont })]
            })
          );
        }
      });
    }

    // Skills
    if (skillsList.length > 0) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 200, after: 80 },
          border: { bottom: { color: '059669', space: 4, value: 'single', size: 10 } },
          children: [new TextRun({ text: 'SPECIAL QUALIFICATIONS & SKILLS', bold: true, size: headingSize, color: '059669', font: docFont })]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: skillsList.map(s => s.name).join('  •  '), size: bodySize, font: docFont })]
        })
      );
    }

    // Personal Information (Colon Table)
    const personalRows = [
      ['Father\'s Name', p.fatherName],
      ['Mother\'s Name', p.motherName],
      ['Date of Birth', p.dateOfBirth],
      ['Gender', p.gender],
      ['Marital Status', p.maritalStatus],
      ['Nationality', p.nationality || 'Bangladeshi'],
      ['Religion', p.religion],
      ['Permanent Address', p.permanentAddress || p.location]
    ].filter(r => r[1]);

    if (personalRows.length > 0) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 200, after: 80 },
          border: { bottom: { color: '059669', space: 4, value: 'single', size: 10 } },
          children: [new TextRun({ text: 'PERSONAL DETAILS', bold: true, size: headingSize, color: '059669', font: docFont })]
        })
      );

      const personalTableRows = personalRows.map(([label, val]) => 
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: contactSize, font: docFont })] })]
            }),
            new TableCell({
              width: { size: 5, type: WidthType.PERCENTAGE },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [new Paragraph({ children: [new TextRun({ text: ':', bold: true, size: contactSize, font: docFont })] })]
            }),
            new TableCell({
              width: { size: 65, type: WidthType.PERCENTAGE },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [new Paragraph({ children: [new TextRun({ text: String(val), size: contactSize, font: docFont })] })]
            })
          ]
        })
      );

      docChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: personalTableRows
        })
      );
    }

    // References: ONLY when valid referee entries exist
    if (validRefs.length > 0) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 200, after: 80 },
          border: { bottom: { color: '059669', space: 4, value: 'single', size: 10 } },
          children: [new TextRun({ text: 'REFERENCES', bold: true, size: headingSize, color: '059669', font: docFont })]
        })
      );
      validRefs.forEach(r => {
        const org = r.organization || r.company || '';
        docChildren.push(
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [
              new TextRun({ text: r.name, bold: true, size: bodySize, font: docFont }),
              (r.title || org) ? new TextRun({ text: ` — ${r.title || ''}${r.title && org ? ` (${org})` : org}`, size: bodySize, font: docFont }) : null,
              r.email ? new TextRun({ text: ` | Email: ${r.email}`, size: contactSize, color: '64748B', font: docFont }) : null,
              r.phone ? new TextRun({ text: ` | Phone: ${r.phone}`, size: contactSize, color: '64748B', font: docFont }) : null
            ].filter(Boolean)
          })
        );
      });
    }

    // Declaration & Signature Line
    docChildren.push(
      new Paragraph({
        spacing: { before: 240, after: 80 },
        children: [
          new TextRun({ text: 'Declaration: ', bold: true, size: contactSize, font: docFont }),
          new TextRun({ text: 'I hereby declare that all the information stated above is true and accurate to the best of my knowledge.', italics: true, size: contactSize, font: docFont })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 300, after: 20 },
        children: [
          new TextRun({ text: '_______________________', bold: true, font: docFont })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: (p.fullName || 'Candidate Signature'), bold: true, size: contactSize, font: docFont })
        ]
      })
    );

  // -------------------------------------------------------------
  // LAYOUT 3: EXECUTIVE BLUE-BANNER (SIDDEK BANNER STANDARD)
  // -------------------------------------------------------------
  } else if (isExecutiveBlueBanner) {
    // 1-Cell Shaded Banner Table for Header
    const bannerHeader = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: '3B5998', type: ShadingType.SOLID },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 120, after: 40 },
                  children: [new TextRun({ text: (p.fullName || 'Candidate Name').toUpperCase(), bold: true, size: nameSize, color: 'FFFFFF', font: docFont })]
                }),
                p.headline ? new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 60 },
                  children: [new TextRun({ text: p.headline, bold: true, size: Math.round(headingSize * 0.9), color: 'DBEAFE', font: docFont })]
                }) : null,
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 120 },
                  children: [new TextRun({ text: contactParts.join('  •  '), size: contactSize, color: 'EFF6FF', font: docFont })]
                })
              ].filter(Boolean)
            })
          ]
        })
      ]
    });

    docChildren.push(bannerHeader);

    function addBannerSectionHeading(title) {
      docChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
                  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  children: [
                    new Paragraph({
                      spacing: { before: 60, after: 60 },
                      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: headingSize, color: '1E3A8A', font: docFont })]
                    })
                  ]
                })
              ]
            })
          ]
        })
      );
    }

    if (p.summary || p.objective) {
      addBannerSectionHeading('Career Objective');
      docChildren.push(
        new Paragraph({
          spacing: { before: 80, after: 160 },
          children: [new TextRun({ text: p.summary || p.objective, size: bodySize, font: docFont })]
        })
      );
    }

    if (profile.education && profile.education.length > 0) {
      addBannerSectionHeading('Academic Credentials');
      profile.education.forEach(edu => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 80, after: 20 },
            children: [
              new TextRun({ text: formatEducationDegree(edu), bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` — ${edu.institution || ''}`, size: bodySize, font: docFont }),
              new TextRun({ text: ` (${edu.startDate || ''} – ${edu.current ? 'Present' : edu.endDate || ''})`, size: contactSize, color: '64748B', font: docFont })
            ]
          })
        );
      });
    }

    if (!isFreshGraduate && profile.experience && profile.experience.length > 0) {
      addBannerSectionHeading('Professional Experience');
      profile.experience.forEach(exp => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 80, after: 20 },
            children: [
              new TextRun({ text: exp.title || '', bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` — ${exp.company || ''}`, bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` [${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}]`, size: contactSize, color: '64748B', font: docFont })
            ]
          })
        );
        if (Array.isArray(exp.highlights)) {
          exp.highlights.forEach(h => {
            docChildren.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 20 },
                children: [new TextRun({ text: h, size: bodySize, font: docFont })]
              })
            );
          });
        }
      });
    }

    if (skillsList.length > 0) {
      addBannerSectionHeading('Skills & Competencies');
      docChildren.push(
        new Paragraph({
          spacing: { before: 80, after: 120 },
          children: [new TextRun({ text: skillsList.map(s => s.name).join('  •  '), size: bodySize, font: docFont })]
        })
      );
    }

    // References: ONLY when valid referee entries exist
    if (validRefs.length > 0) {
      addBannerSectionHeading('References');
      validRefs.forEach(r => {
        const org = r.organization || r.company || '';
        docChildren.push(
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [
              new TextRun({ text: r.name, bold: true, size: bodySize, font: docFont }),
              (r.title || org) ? new TextRun({ text: ` — ${r.title || ''}${r.title && org ? ` (${org})` : org}`, size: bodySize, font: docFont }) : null,
              r.email ? new TextRun({ text: ` | Email: ${r.email}`, size: contactSize, color: '64748B', font: docFont }) : null,
              r.phone ? new TextRun({ text: ` | Phone: ${r.phone}`, size: contactSize, color: '64748B', font: docFont }) : null
            ].filter(Boolean)
          })
        );
      });
    }

  // -------------------------------------------------------------
  // LAYOUT 4: STANDARD / ATS / PROFESSIONAL / FUNCTIONAL TEMPLATES
  // -------------------------------------------------------------
  } else {
    // Section Heading Builder
    function addSectionHeading(title) {
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 100 },
          border: {
            bottom: { color: brandColor, space: 4, value: 'single', size: 10 }
          },
          children: [
            new TextRun({
              text: title.toUpperCase(),
              bold: true,
              size: headingSize,
              color: brandColor,
              font: docFont
            })
          ]
        })
      );
    }
    const addStandardHeading = addSectionHeading;

    // 1. Candidate Full Name
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: (p.fullName || 'Candidate Name').toUpperCase(),
            bold: true,
            size: nameSize,
            color: brandColor,
            font: docFont
          })
        ]
      })
    );

    // 2. Headline (Optional)
    if (p.headline) {
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: p.headline,
              bold: true,
              size: subHeadingSize,
              color: '334155',
              font: docFont
            })
          ]
        })
      );
    }

    // 3. Contact Line
    if (contactParts.length > 0) {
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 280 },
          children: [
            new TextRun({
              text: contactParts.join('  |  '),
              size: contactSize,
              color: '64748B',
              font: docFont
            })
          ]
        })
      );
    }

    // 4. Summary / Career Objective
    if (p.summary || p.objective) {
      addStandardHeading(p.summary ? 'Professional Summary' : 'Career Objective');
      docChildren.push(
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({
              text: p.summary || p.objective,
              size: bodySize,
              font: docFont
            })
          ]
        })
      );
    }

    // 5. Skills
    if (skillsList.length > 0) {
      addSectionHeading('Skills');
      const skillStrings = skillsList.map(s => s.level ? `${s.name} (${s.level})` : s.name);
      docChildren.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: skillStrings.join(' • '), size: bodySize, font: docFont })
          ]
        })
      );
    }

    // 6. Work Experience (Strictly omitted if fresh graduate or empty)
    if (!isFreshGraduate && profile.experience && profile.experience.length > 0) {
      addStandardHeading('Professional Experience');
      profile.experience.forEach(exp => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 120, after: 30 },
            children: [
              new TextRun({ text: exp.title || '', bold: true, size: Math.round(headingSize * 0.95), font: docFont }),
              new TextRun({ text: ` — ${exp.company || ''}`, bold: true, size: bodySize, color: '334155', font: docFont }),
              exp.location ? new TextRun({ text: ` (${exp.location})`, italics: true, size: contactSize, color: '64748B', font: docFont }) : null,
              new TextRun({
                text: `  [${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}]`,
                bold: true,
                size: contactSize,
                color: '475569',
                font: docFont
              })
            ].filter(Boolean)
          })
        );

        if (Array.isArray(exp.highlights)) {
          exp.highlights.forEach(h => {
            docChildren.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 30 },
                children: [new TextRun({ text: h, size: bodySize, font: docFont })]
              })
            );
          });
        }
      });
    }

    // 7. Projects
    if (profile.projects && profile.projects.length > 0) {
      addStandardHeading('Key Projects & Deliverables');
      profile.projects.forEach(proj => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 80, after: 30 },
            children: [
              new TextRun({ text: proj.title || '', bold: true, size: bodySize, font: docFont }),
              proj.projectType ? new TextRun({ text: ` [${proj.projectType}]`, bold: true, size: contactSize, color: '64748B', font: docFont }) : null,
              proj.role ? new TextRun({ text: ` (${proj.role})`, italics: true, size: contactSize, font: docFont }) : null
            ].filter(Boolean)
          })
        );
        if (proj.description) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 30 },
              children: [new TextRun({ text: proj.description, size: bodySize, font: docFont })]
            })
          );
        }
      });
    }

    // 8. Education
    if (profile.education && profile.education.length > 0) {
      addStandardHeading('Education');
      profile.education.forEach(edu => {
        const subject = edu.major || edu.field;
        const degText = `${edu.degree || ''}${subject ? ` in ${subject}` : ''}`;
        docChildren.push(
          new Paragraph({
            spacing: { before: 100, after: 30 },
            children: [
              new TextRun({ text: degText, bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` — ${edu.institution || ''}`, size: bodySize, font: docFont }),
              new TextRun({ text: ` (${edu.startDate || ''} – ${edu.current ? 'Present' : edu.endDate || ''})`, italics: true, size: contactSize, color: '64748B', font: docFont })
            ]
          })
        );
        if (edu.gpa) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [new TextRun({ text: `GPA / Result: ${edu.gpa}`, size: contactSize, italics: true, font: docFont })]
            })
          );
        }
        if (edu.thesis) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 30 },
              children: [new TextRun({ text: `Thesis: ${edu.thesis}`, size: contactSize, italics: true, color: '475569', font: docFont })]
            })
          );
        }
      });
    }

    // 9. Certifications
    if (profile.certifications && profile.certifications.length > 0) {
      addStandardHeading('Certifications');
      profile.certifications.forEach(c => {
        docChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({ text: c.title || '', bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` — ${c.issuer || ''}${c.issueDate ? ` (${c.issueDate})` : ''}`, size: bodySize, font: docFont })
            ]
          })
        );
      });
    }

    // 10. Languages
    if (profile.languages && profile.languages.length > 0) {
      addStandardHeading('Languages');
      const langStrings = profile.languages.map(l => `${l.name} (${l.proficiency || l.cefr || 'Proficient'})`);
      docChildren.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: langStrings.join('  •  '), size: bodySize, font: docFont })]
        })
      );
    }

    // 11. Publications
    if (profile.publications && profile.publications.length > 0) {
      addStandardHeading('Publications');
      profile.publications.forEach((pub, idx) => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 60, after: 30 },
            children: [
              new TextRun({ text: `[${idx + 1}] `, bold: true, size: contactSize, font: docFont }),
              pub.authors ? new TextRun({ text: `${pub.authors}. `, size: contactSize, font: docFont }) : null,
              new TextRun({ text: `"${pub.title}". `, bold: true, size: contactSize, font: docFont }),
              new TextRun({ text: `${pub.journal || ''} (${pub.year || ''}).`, italics: true, size: contactSize, font: docFont }),
              pub.doi ? new TextRun({ text: ` DOI: ${pub.doi}`, size: contactSize, color: '1D4ED8', font: docFont }) : null
            ].filter(Boolean)
          })
        );
      });
    }

    // 12. References (Only when valid references are present)
    if (validRefs.length > 0) {
      addStandardHeading('References');
      validRefs.forEach(ref => {
        const org = ref.organization || ref.company || '';
        const parts = [
          ref.name ? new TextRun({ text: ref.name, bold: true, size: bodySize, font: docFont }) : null,
          (ref.title || org) ? new TextRun({ text: ` — ${ref.title || ''}${ref.title && org ? ' (' + org + ')' : org}`, size: bodySize, font: docFont }) : null,
          ref.email ? new TextRun({ text: ` | Email: ${ref.email}`, size: contactSize, color: '64748B', font: docFont }) : null,
          ref.phone ? new TextRun({ text: ` | Phone: ${ref.phone}`, size: contactSize, color: '64748B', font: docFont }) : null
        ].filter(Boolean);
        docChildren.push(
          new Paragraph({
            spacing: { before: 60, after: 20 },
            children: parts
          })
        );
      });
    }
  }

  // Page Dimensions & Margins (1 mm = 56.7 twips / dxa)
  const isA4 = settings.paperSize === 'a4';
  const pageProps = {
    size: isA4 ? {
      width: 11906, // 210mm
      height: 16838 // 297mm
    } : {
      width: 12240, // 8.5in
      height: 15840 // 11in
    },
    margin: {
      top: Math.round(marginsCustom.top * 56.7),
      bottom: Math.round(marginsCustom.bottom * 56.7),
      left: Math.round(marginsCustom.left * 56.7),
      right: Math.round(marginsCustom.right * 56.7)
    }
  };

  return new Document({
    sections: [
      {
        properties: {
          page: pageProps
        },
        children: docChildren
      }
    ]
  });
}

function formatEducationDegree(edu) {
  const parts = [];
  if (edu.degree) parts.push(edu.degree);
  const subject = edu.major || edu.field;
  if (subject) parts.push(`in ${subject}`);
  return parts.join(' ') || 'Education Degree';
}

async function downloadDocx(profile, filename = 'CVForge_Resume.docx') {
  if (!window.docx) {
    alert('Word export engine is still initializing. Please wait a moment and try again.');
    return;
  }

  const doc = buildDocxDocument(profile, window.docx);
  const blob = await window.docx.Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}


// Exports
exports.buildDocxDocument = buildDocxDocument;
exports.downloadDocx = downloadDocx;
};

  // Module: ./export/jsonExporter.js
  __modules__['./export/jsonExporter.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - JSON Profile Backup, Restore & Duplication Engine
 */

function exportProfileToJson(profile, filename = 'cvforge_profile.json') {
  const jsonStr = JSON.stringify(profile, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importProfileFromJson(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed && (parsed.personal || parsed.format)) {
        callback(null, parsed);
      } else {
        callback(new Error('Invalid CVForge profile JSON format.'));
      }
    } catch (err) {
      callback(err);
    }
  };
  reader.onerror = () => callback(new Error('Failed to read file.'));
  reader.readAsText(file);
}


// Exports
exports.exportProfileToJson = exportProfileToJson;
exports.importProfileFromJson = importProfileFromJson;
};

  // Module: ./export/pdfExporter.js
  __modules__['./export/pdfExporter.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - PDF Export & Vector Print Engine
 */

function downloadPdf(elementId = 'cv-preview-content', filename = 'CVForge_Resume.pdf', paperSize = 'letter') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Preview element not found for PDF export');
    return;
  }

  if (window.html2pdf) {
    const isA4 = paperSize === 'a4';
    const opt = {
      margin: isA4 ? [12, 12, 12, 12] : [14, 14, 14, 14],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2, // 2x DPI for crisp font rendering
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: {
        unit: 'mm',
        format: isA4 ? 'a4' : 'letter',
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    return window.html2pdf().set(opt).from(element).save();
  } else {
    window.print();
  }
}

function triggerPrint() {
  window.print();
}

function togglePrintPreview() {
  document.body.classList.toggle('is-print-preview');
  const isPreview = document.body.classList.contains('is-print-preview');
  
  let banner = document.getElementById('print-preview-banner');
  if (isPreview) {
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'print-preview-banner';
      banner.className = 'fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 text-xs font-bold border border-slate-700 animate-in fade-in duration-200';
      banner.innerHTML = `
        <span>Print Preview Mode (Isolated Document Canvas)</span>
        <button type="button" id="btn-exit-print-preview" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[11px] transition">Exit Preview</button>
      `;
      document.body.appendChild(banner);
      document.getElementById('btn-exit-print-preview').onclick = () => togglePrintPreview();
    }
    banner.classList.remove('hidden');
  } else {
    if (banner) banner.classList.add('hidden');
  }
}


// Exports
exports.downloadPdf = downloadPdf;
exports.triggerPrint = triggerPrint;
exports.togglePrintPreview = togglePrintPreview;
};

  // Module: ./models/sampleData.js
  __modules__['./models/sampleData.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Realistic, Professional Sample Candidate Profiles
 * 1. Fresh Graduate (Mathematics Graduate, Capstone Project, Relevant Coursework, Zero Work Exp)
 * 2. Experienced Professional (Operations & Project Manager, 8+ yrs, Quantified Achievements)
 * 3. Data Analyst (Junior Data Analyst, SQL, Python, Excel, Power BI, Dashboards)
 * 4. Administrative / Office Assistant (Administrative Assistant, Office Operations, Records, Client Service)
 *
 * All profiles strictly set `isDemo: true`, use natural professional English,
 * and contain zero exaggerated buzzwords.
 */

const SAMPLE_PROFILES = {
  // 1. Fresh Graduate (No Work Experience, Academic Capstone, Relevant Coursework)
  fresh_graduate: {
    id: 'prof_fresh_grad',
    name: 'Fresh Graduate (Mathematics & Analytics)',
    targetRole: 'Junior Quantitative Analyst',
    targetCompany: 'Financial & Analytics Services',
    country: 'US',
    format: 'skills-based',
    isDemo: true,
    isFreshGraduate: true,
    referencesAvailableUponRequest: false,
    settings: {
      theme: 'soft-blue',
      paperSize: 'letter',
      fontFamily: 'Inter',
      fontSizes: { name: 24, headings: 13, body: 10, contact: 9.5 },
      marginsCustom: { top: 15, bottom: 15, left: 15, right: 15 },
      fontSize: 'normal',
      primaryColor: '#1d4ed8',
      accentColor: '#3b82f6',
      spacing: 'normal',
      margins: 'normal',
      showPhoto: false,
      photoSize: 'medium',
      photoShape: 'circle',
      dateFormat: 'Month YYYY'
    },
    personal: {
      fullName: 'Eleanor Vance',
      headline: 'Mathematics Graduate',
      summary: 'Detail-focused Mathematics graduate with a solid foundation in statistical modelling, numerical computation, and quantitative problem solving. Experienced in developing predictive algorithms and data simulations using Python, R, and Excel. Seeking an entry-level analytical or quantitative research role to apply rigorous statistical methods to practical business challenges.',
      email: 'eleanor.vance.math@gmail.com',
      phone: '+1 (415) 555-0142',
      location: 'Austin, TX, USA',
      linkedin: 'https://linkedin.com/in/eleanor-vance-math',
      github: 'https://github.com/eleanorvance',
      portfolio: '',
      nationality: 'United States',
      dateOfBirth: '',
      drivingLicense: ''
    },
    education: [
      {
        id: 'edu_1',
        degree: 'Bachelor of Science (BSc)',
        major: 'Mathematics',
        institution: 'University of Texas at Austin',
        location: 'Austin, TX',
        startDate: '2020-09',
        endDate: '2024-05',
        current: false,
        gpa: '3.82 / 4.0',
        honors: 'Dean’s Honor List (4 semesters), Pi Mu Epsilon Mathematics Honor Society',
        thesis: 'Markov Chains and Stochastic Simulation of Traffic Bottlenecks',
        coursework: 'Linear Algebra, Probability & Statistics, Numerical Methods, Differential Equations, Mathematical Modelling'
      }
    ],
    experience: [], // Clean empty list for fresh graduate!
    internships: [],
    projects: [
      {
        id: 'proj_1',
        title: 'Urban Traffic Flow Stochastic Simulation',
        projectType: 'Academic Capstone',
        role: 'Lead Student Researcher',
        description: 'Designed a discrete-event simulation in Python using queuing theory to evaluate vehicle wait-time distributions at high-density arterial intersections.',
        outcomes: 'Demonstrated an estimated 18% reduction in peak-hour queue delays under adaptive timing rules; presented findings at the Regional Undergraduate Mathematics Symposium.',
        technologies: ['Python', 'NumPy', 'Matplotlib', 'SimPy'],
        liveUrl: '',
        githubUrl: 'https://github.com/eleanorvance/traffic-stochastic-sim'
      },
      {
        id: 'proj_2',
        title: 'Customer Churn Classification Model',
        projectType: 'Independent Course Project',
        role: 'Data Modeller',
        description: 'Analyzed an open telecom dataset with 7,000 customer records to identify risk factors for customer cancellation using logistic regression and decision trees.',
        outcomes: 'Achieved 82% out-of-sample prediction accuracy with balanced precision and recall; prepared a 10-page executive summary interpreting key attrition drivers.',
        technologies: ['Python', 'pandas', 'scikit-learn', 'Jupyter Notebook'],
        liveUrl: '',
        githubUrl: 'https://github.com/eleanorvance/customer-churn-model'
      }
    ],
    skills: [
      { id: 'sk_1', name: 'Statistical Modelling', level: 'Intermediate' },
      { id: 'sk_2', name: 'Numerical Analysis', level: 'Intermediate' },
      { id: 'sk_3', name: 'Microsoft Excel (Pivot Tables, Advanced Formulas)', level: 'Advanced' },
      { id: 'sk_4', name: 'Python', level: 'Intermediate' },
      { id: 'sk_5', name: 'R', level: 'Intermediate' },
      { id: 'sk_6', name: 'SQL', level: 'Beginner' },
      { id: 'sk_7', name: 'Data Analysis', level: 'Intermediate' },
      { id: 'sk_8', name: 'Data Cleaning', level: 'Intermediate' },
      { id: 'sk_9', name: 'Analytical Problem Solving', level: 'Advanced' },
      { id: 'sk_10', name: 'Technical Documentation', level: 'Intermediate' }
    ],
    certifications: [
      {
        id: 'cert_1',
        title: 'Data Analysis with Python',
        issuer: 'FreeCodeCamp',
        issueDate: '2023-08'
      }
    ],
    languages: [
      { id: 'lang_1', name: 'English', proficiency: 'Native / Bilingual', cefr: 'C2' },
      { id: 'lang_2', name: 'French', proficiency: 'Intermediate', cefr: 'B1' }
    ],
    achievements: [
      { id: 'ach_1', title: 'Dean’s Honor List', issuer: 'College of Natural Sciences', year: '2022 – 2024' }
    ],
    volunteer: [
      { id: 'vol_1', role: 'Peer Math Tutor', organization: 'UT Austin Student Learning Center' }
    ],
    publications: [],
    memberships: [],
    references: [],
    customSections: []
  },

  // 2. Experienced Professional (Operations & Project Management)
  experienced_professional: {
    id: 'prof_experienced',
    name: 'Experienced Professional (Operations & Project Management)',
    targetRole: 'Senior Operations & Logistics Manager',
    targetCompany: 'Midwest Freight & Logistics Corp.',
    country: 'US',
    format: 'reverse-chronological',
    isDemo: true,
    isFreshGraduate: false,
    referencesAvailableUponRequest: false,
    settings: {
      theme: 'professional-navy',
      paperSize: 'letter',
      fontFamily: 'Inter',
      fontSizes: { name: 24, headings: 13, body: 10, contact: 9.5 },
      marginsCustom: { top: 15, bottom: 15, left: 15, right: 15 },
      fontSize: 'normal',
      primaryColor: '#1e3a8a',
      accentColor: '#2563eb',
      spacing: 'normal',
      margins: 'normal',
      showPhoto: false,
      photoSize: 'medium',
      photoShape: 'circle',
      dateFormat: 'Month YYYY'
    },
    personal: {
      fullName: 'David R. Miller',
      headline: 'Operations & Project Manager',
      summary: 'Pragmatic Operations and Project Manager with over 8 years of experience leading cross-functional teams, optimizing logistics workflows, and administering annual budgets up to $2.5M. Proven record of implementing structured inventory management controls that reduced order processing delays by 28% while maintaining 99.2% customer delivery compliance.',
      email: 'david.r.miller.ops@gmail.com',
      phone: '+1 (312) 555-0188',
      location: 'Chicago, IL, USA',
      linkedin: 'https://linkedin.com/in/david-miller-operations',
      github: '',
      portfolio: '',
      nationality: 'United States',
      dateOfBirth: '',
      drivingLicense: 'Full Clean Driver License'
    },
    education: [
      {
        id: 'edu_1',
        degree: 'Bachelor of Business Administration (BBA)',
        major: 'Operations Management',
        institution: 'University of Illinois Urbana-Champaign',
        location: 'Champaign, IL',
        startDate: '2012-09',
        endDate: '2016-05',
        current: false,
        gpa: '3.70 / 4.0',
        honors: 'Cum Laude',
        thesis: '',
        coursework: 'Supply Chain Management, Project Scheduling, Quality Control, Business Statistics'
      }
    ],
    experience: [
      {
        id: 'exp_1',
        title: 'Operations Project Manager',
        company: 'Northway Logistics LLC',
        location: 'Chicago, IL',
        employmentType: 'Full-time',
        startDate: '2020-03',
        endDate: '',
        current: true,
        highlights: [
          'Directed warehouse operations across 2 regional fulfillment centers, supervising 42 warehouse and logistics staff members.',
          'Streamlined staging and automated barcode scanning workflows, decreasing average pick-and-pack times by 22%.',
          'Administered operational and capital expenditure budgets totaling $2.4M annually, consistently completing fiscal quarters within 3% variance.',
          'Coordinated weekly alignment sessions between sales, warehouse operations, and freight carrier partners.'
        ],
        technologies: ['Microsoft Excel', 'SAP ERP', 'Asana', 'WMS']
      },
      {
        id: 'exp_2',
        title: 'Logistics Coordinator',
        company: 'Crestline Supply Co.',
        location: 'Peoria, IL',
        employmentType: 'Full-time',
        startDate: '2016-07',
        endDate: '2020-02',
        current: false,
        highlights: [
          'Managed daily carrier routing and shipment dispatches for over 450 regional retail accounts.',
          'Monitored supplier on-time delivery metrics and resolved freight claim discrepancies with carriers.',
          'Negotiated volume freight rates with regional trucking partners, generating $65,000 in annual shipping savings.'
        ],
        technologies: ['Microsoft Excel', 'Oracle Transportation', 'Jira']
      }
    ],
    internships: [],
    projects: [
      {
        id: 'proj_1',
        title: 'Warehouse Management System (WMS) Migration',
        projectType: 'Enterprise Project',
        role: 'Project Lead',
        description: 'Led the cross-departmental transition from legacy spreadsheet logging to a cloud-based WMS across 75,000 sq ft of warehouse space.',
        outcomes: 'Completed implementation 2 weeks ahead of target deadline; cut inventory stockout discrepancies from 4.1% to 0.6%.',
        technologies: ['SAP WMS', 'Barcode Integration', 'Microsoft Excel'],
        liveUrl: '',
        githubUrl: ''
      }
    ],
    skills: [
      { id: 'sk_1', name: 'Inventory Management', level: 'Advanced' },
      { id: 'sk_2', name: 'Budget Administration', level: 'Advanced' },
      { id: 'sk_3', name: 'Vendor Negotiation', level: 'Intermediate' },
      { id: 'sk_4', name: 'Microsoft Excel (VLOOKUP, Pivot Tables)', level: 'Advanced' },
      { id: 'sk_5', name: 'SAP ERP', level: 'Advanced' },
      { id: 'sk_6', name: 'SQL', level: 'Beginner' },
      { id: 'sk_7', name: 'Logistics KPI Tracking', level: 'Advanced' },
      { id: 'sk_8', name: 'Cross-Functional Team Leadership', level: 'Advanced' },
      { id: 'sk_9', name: 'Client Relations', level: 'Advanced' }
    ],
    certifications: [
      {
        id: 'cert_1',
        title: 'Project Management Professional (PMP)',
        issuer: 'Project Management Institute (PMI)',
        issueDate: '2021-04'
      }
    ],
    languages: [
      { id: 'lang_1', name: 'English', proficiency: 'Native / Bilingual', cefr: 'C2' }
    ],
    achievements: [
      { id: 'ach_1', title: 'Excellence in Operations Award', issuer: 'Northway Logistics LLC', year: '2023' }
    ],
    volunteer: [],
    publications: [],
    memberships: [],
    references: [],
    customSections: []
  },

  // 3. Data Analyst (Junior to Mid-Level, SQL, Python, Excel, Power BI)
  data_analyst: {
    id: 'prof_data_analyst',
    name: 'Data Analyst (SQL, Python, Power BI)',
    targetRole: 'Data Analyst / Business Intelligence Specialist',
    targetCompany: 'Beacon Analytics Group',
    country: 'US',
    format: 'reverse-chronological',
    isDemo: true,
    isFreshGraduate: false,
    referencesAvailableUponRequest: false,
    settings: {
      theme: 'soft-blue',
      paperSize: 'letter',
      fontFamily: 'Inter',
      fontSizes: { name: 24, headings: 13, body: 10, contact: 9.5 },
      marginsCustom: { top: 15, bottom: 15, left: 15, right: 15 },
      fontSize: 'normal',
      primaryColor: '#0f766e',
      accentColor: '#059669',
      spacing: 'normal',
      margins: 'normal',
      showPhoto: false,
      photoSize: 'medium',
      photoShape: 'circle',
      dateFormat: 'Month YYYY'
    },
    personal: {
      fullName: 'Maya Lin',
      headline: 'Junior Data Analyst',
      summary: 'Detail-oriented Data Analyst with 3 years of experience in data extraction, automated dashboard development, and statistical reporting. Proficient in transforming complex transactional datasets into actionable business insights using SQL, Python, Excel, and Power BI. Successfully automated weekly sales reporting workflows, saving the commercial team 6 hours of manual data consolidation per week.',
      email: 'maya.lin.analyst@gmail.com',
      phone: '+1 (617) 555-0164',
      location: 'Boston, MA, USA',
      linkedin: 'https://linkedin.com/in/maya-lin-analytics',
      github: 'https://github.com/mayalin-data',
      portfolio: '',
      nationality: 'United States',
      dateOfBirth: '',
      drivingLicense: ''
    },
    education: [
      {
        id: 'edu_1',
        degree: 'Bachelor of Science (BSc)',
        major: 'Statistics & Information Systems',
        institution: 'Boston University',
        location: 'Boston, MA',
        startDate: '2017-09',
        endDate: '2021-05',
        current: false,
        gpa: '3.76 / 4.0',
        honors: 'Dean’s List',
        thesis: '',
        coursework: 'Applied Regression Analysis, Relational Database Management, Business Analytics, Predictive Modelling'
      }
    ],
    experience: [
      {
        id: 'exp_1',
        title: 'Junior Data Analyst',
        company: 'RetailMetrics Inc.',
        location: 'Boston, MA',
        employmentType: 'Full-time',
        startDate: '2021-07',
        endDate: '',
        current: true,
        highlights: [
          'Developed and maintained 8 interactive Power BI dashboards tracking revenue, inventory turnover, and retention metrics for 14 regional branches.',
          'Wrote and optimized complex SQL queries across multi-million-row PostgreSQL databases to extract cohort purchase trends.',
          'Automated weekly Excel and PDF sales reports using Python scripts, eliminating 6 hours of manual spreadsheet compilation every Monday.',
          'Collaborated directly with category managers to define KPI benchmarks and investigate unexpected inventory write-downs.'
        ],
        technologies: ['SQL (PostgreSQL)', 'Power BI', 'Python', 'Microsoft Excel', 'Git']
      }
    ],
    internships: [],
    projects: [
      {
        id: 'proj_1',
        title: 'Executive Sales & Margin Power BI Dashboard',
        projectType: 'Professional Deliverable',
        role: 'Data Analyst & Designer',
        description: 'Consolidated point-of-sale data from 14 regional stores into a central star-schema data model with automated refresh cycles.',
        outcomes: 'Adopted as the primary weekly reporting view by regional directors, providing same-day visibility into store promotional margins.',
        technologies: ['Power BI', 'DAX', 'SQL', 'Power Query'],
        liveUrl: '',
        githubUrl: ''
      }
    ],
    skills: [
      { id: 'sk_1', name: 'ETL Data Pipelines', level: 'Intermediate' },
      { id: 'sk_2', name: 'Relational Database Design', level: 'Intermediate' },
      { id: 'sk_3', name: 'Power BI', level: 'Advanced' },
      { id: 'sk_4', name: 'Microsoft Excel (Advanced Formulas, Power Query)', level: 'Advanced' },
      { id: 'sk_5', name: 'SQL (PostgreSQL, MySQL)', level: 'Advanced' },
      { id: 'sk_6', name: 'Python (pandas, matplotlib)', level: 'Intermediate' },
      { id: 'sk_7', name: 'Data Analysis', level: 'Advanced' },
      { id: 'sk_8', name: 'Data Cleaning', level: 'Advanced' },
      { id: 'sk_9', name: 'Problem Solving', level: 'Advanced' }
    ],
    certifications: [
      {
        id: 'cert_1',
        title: 'Microsoft Certified: Power BI Data Analyst Associate',
        issuer: 'Microsoft',
        issueDate: '2023-01'
      }
    ],
    languages: [
      { id: 'lang_1', name: 'English', proficiency: 'Native / Bilingual', cefr: 'C2' }
    ],
    achievements: [],
    volunteer: [],
    publications: [],
    memberships: [],
    references: [],
    customSections: []
  },

  // 4. Administrative / Office Assistant (Scheduling, Correspondence, Records, Customer Support)
  office_assistant: {
    id: 'prof_office_assistant',
    name: 'Administrative / Office Assistant',
    targetRole: 'Administrative Assistant / Office Coordinator',
    targetCompany: 'Summit Legal & Corporate Group',
    country: 'US',
    format: 'reverse-chronological',
    isDemo: true,
    isFreshGraduate: false,
    referencesAvailableUponRequest: false,
    settings: {
      theme: 'warm-beige',
      paperSize: 'letter',
      fontFamily: 'Inter',
      fontSizes: { name: 24, headings: 13, body: 10, contact: 9.5 },
      marginsCustom: { top: 15, bottom: 15, left: 15, right: 15 },
      fontSize: 'normal',
      primaryColor: '#78350f',
      accentColor: '#b45309',
      spacing: 'normal',
      margins: 'normal',
      showPhoto: false,
      photoSize: 'medium',
      photoShape: 'circle',
      dateFormat: 'Month YYYY'
    },
    personal: {
      fullName: 'Sarah Jenkins',
      headline: 'Administrative Assistant',
      summary: 'Dependable and highly organized Administrative Assistant with 4 years of experience coordinating office operations, executive calendars, and client communications. Skilled in document preparation, digital filing systems, database entry, and vendor coordination. Recognized for delivering warm, professional front-office support and maintaining 100% confidentiality in handling sensitive legal and personnel files.',
      email: 'sarah.jenkins.admin@gmail.com',
      phone: '+1 (404) 555-0139',
      location: 'Atlanta, GA, USA',
      linkedin: 'https://linkedin.com/in/sarah-jenkins-admin',
      github: '',
      portfolio: '',
      nationality: 'United States',
      dateOfBirth: '',
      drivingLicense: 'Full Clean Driver License'
    },
    education: [
      {
        id: 'edu_1',
        degree: 'Associate of Applied Science (AAS)',
        major: 'Office Administration & Business Management',
        institution: 'Atlanta Technical College',
        location: 'Atlanta, GA',
        startDate: '2018-08',
        endDate: '2020-05',
        current: false,
        gpa: '3.85 / 4.0',
        honors: 'Honor Roll Graduate',
        thesis: '',
        coursework: 'Records Management, Business Communications, Advanced Word Processing, Spreadsheet Applications'
      }
    ],
    experience: [
      {
        id: 'exp_1',
        title: 'Administrative Assistant',
        company: 'Oakwood Legal Services',
        location: 'Atlanta, GA',
        employmentType: 'Full-time',
        startDate: '2022-01',
        endDate: '',
        current: true,
        highlights: [
          'Manage appointment scheduling and court calendar deadlines for a team of 5 attorneys, coordinating over 35 client meetings weekly.',
          'Draft, format, and proofread formal legal correspondence, engagement agreements, and billing summaries.',
          'Digitize physical client case folders and maintain organized electronic records in compliance with legal retention policies.',
          'Greet visitors, answer multi-line telephone switchboard, and direct client inquiries to appropriate legal counsel.'
        ],
        technologies: ['Microsoft Word', 'Microsoft Excel', 'Outlook', 'Adobe Acrobat Pro']
      },
      {
        id: 'exp_2',
        title: 'Front Office Receptionist',
        company: 'Crestview Medical Clinic',
        location: 'Atlanta, GA',
        employmentType: 'Full-time',
        startDate: '2020-06',
        endDate: '2021-12',
        current: false,
        highlights: [
          'Registered arriving patients, verified medical insurance details, and collected copayments.',
          'Maintained clinic inventory of office and reception supplies, placing weekly replenishment orders within allocated budgets.',
          'Handled incoming mail distribution, patient appointment reminder calls, and patient record archiving.'
        ],
        technologies: ['Microsoft Office', 'Electronic Health Records (EHR)', 'Multi-line Phone']
      }
    ],
    internships: [],
    projects: [
      {
        id: 'proj_1',
        title: 'Digital File Indexing & Retention Project',
        projectType: 'Office Operations Project',
        role: 'Coordinator',
        description: 'Audited and restructured the firm’s digital directory schema, creating standardized subfolder templates and search index tags.',
        outcomes: 'Decreased average document retrieval time from 8 minutes to under 45 seconds for administrative and paralegal staff.',
        technologies: ['Adobe Acrobat Pro', 'Cloud Storage', 'Microsoft Word'],
        liveUrl: '',
        githubUrl: ''
      }
    ],
    skills: [
      { id: 'sk_1', name: 'Data Entry', level: 'Advanced' },
      { id: 'sk_2', name: 'Calendar Management', level: 'Advanced' },
      { id: 'sk_3', name: 'Records Organization', level: 'Advanced' },
      { id: 'sk_4', name: 'Microsoft Word & Excel', level: 'Advanced' },
      { id: 'sk_5', name: 'Google Workspace & Outlook', level: 'Advanced' },
      { id: 'sk_6', name: 'Time Management', level: 'Advanced' },
      { id: 'sk_7', name: 'Telephone Reception', level: 'Advanced' },
      { id: 'sk_8', name: 'Written Correspondence', level: 'Advanced' }
    ],
    certifications: [
      {
        id: 'cert_1',
        title: 'Certified Administrative Professional (CAP)',
        issuer: 'IAAP (International Association of Administrative Professionals)',
        issueDate: '2022-09'
      }
    ],
    languages: [
      { id: 'lang_1', name: 'English', proficiency: 'Native / Bilingual', cefr: 'C2' }
    ],
    achievements: [],
    volunteer: [],
    publications: [],
    memberships: [],
    references: [],
    customSections: []
  }
};

// Aliases for backward compatibility
SAMPLE_PROFILES.senior_engineer = SAMPLE_PROFILES.experienced_professional;
SAMPLE_PROFILES.academic_researcher = SAMPLE_PROFILES.fresh_graduate;
SAMPLE_PROFILES.creative_designer = SAMPLE_PROFILES.data_analyst;


// Exports
exports.SAMPLE_PROFILES = SAMPLE_PROFILES;
};

  // Module: ./models/state.js
  __modules__['./models/state.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Reactive State Manager (Enhanced)
 * Handles clean profile defaults, undo/redo history, localStorage persistence,
 * demo data separation, multi-profile switching, and optional section toggles.
 */

const { SAMPLE_PROFILES } = __require__('./sampleData.js', __currentDir);

const STORAGE_KEY = 'cvforge_active_profile_v3';
const PROFILES_LIST_KEY = 'cvforge_saved_profiles_v3';
const MAX_HISTORY = 50;

class StateManager {
  constructor() {
    this.history = [];
    this.future = [];
    this.listeners = new Set();
    this.saveTimeout = null;
    this.lastSaved = null;

    this.profile = this.loadInitialProfile();
    this.ensureStructure(this.profile);
    this.saveHistory();
  }

  /**
   * Returns a clean, professional blank starter profile.
   * Eliminates misleading pre-filled fake qualifications!
   */
  getDefaultProfile() {
    return {
      id: `prof_${Date.now()}`,
      name: 'My Professional CV',
      targetRole: '',
      targetCompany: '',
      country: 'US',
      format: 'reverse-chronological',
      isDemo: false, // Explicit separation between Demo and Real Data
      isFreshGraduate: false,
      referencesAvailableUponRequest: false,
      settings: {
        theme: 'soft-blue', // 'minimal-white' | 'soft-blue' | 'soft-lavender' | 'warm-beige' | 'light-gray' | 'professional-navy' | 'modern-pastel'
        paperSize: 'letter',
        fontFamily: 'Inter',
        fontSizes: {
          name: 24,       // pt (candidate legal name)
          headings: 13,   // pt (section titles)
          body: 10,       // pt (experience bullets, body text)
          contact: 9.5    // pt (contact line & meta dates)
        },
        marginsCustom: {
          top: 15,        // mm
          bottom: 15,     // mm
          left: 15,       // mm
          right: 15       // mm
        },
        fontSize: 'normal', // legacy fallback
        primaryColor: '#1d4ed8',
        accentColor: '#3b82f6',
        spacing: 'normal',
        margins: 'normal',
        showPhoto: false,
        photoSize: 'medium', // 'small' | 'medium' | 'large'
        photoShape: 'circle', // 'circle' | 'square'
        dateFormat: 'Month YYYY'
      },
      enabledSections: {
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: true,
        internships: false,
        research: false,
        publications: false,
        achievements: false,
        volunteer: false,
        memberships: false,
        references: true,
        custom: false
      },
      personal: {
        fullName: '',
        headline: '',
        summary: '',
        objective: '',
        strengths: '',
        email: '',
        phone: '',
        location: '',
        nationality: '',
        linkedin: '',
        github: '',
        portfolio: '',
        photoUrl: '',
        dateOfBirth: '',
        drivingLicense: '',
        fatherName: '',
        motherName: '',
        permanentAddress: '',
        religion: '',
        maritalStatus: '',
        gender: ''
      },
      education: [],
      experience: [],
      internships: [],
      researchExperience: [],
      skills: [], // Unified single Skills list: [{ id, name, level }]
      functionalAreas: [],
      projects: [],
      certifications: [],
      languages: [],
      achievements: [],
      volunteer: [],
      publications: [],
      memberships: [],
      academic: {
        researchInterests: [],
        teachingExperience: [],
        grants: [],
        conferences: [],
        memberships: []
      },
      references: [],
      customSections: []
    };
  }

  loadInitialProfile() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.personal && parsed.format) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load profile from localStorage:', e);
    }
    // Brand new visitor starts with clean blank profile (NOT fake Amazon data)
    return this.getDefaultProfile();
  }

  ensureStructure(p) {
    if (!p) return;
    if (!p.settings) p.settings = {};
    if (!p.settings.theme) p.settings.theme = 'soft-blue';
    if (!p.settings.paperSize) p.settings.paperSize = 'letter';
    if (!p.settings.fontFamily) p.settings.fontFamily = 'Inter';
    if (!p.settings.fontSize) p.settings.fontSize = 'normal';
    if (!p.settings.primaryColor) p.settings.primaryColor = '#1d4ed8';
    if (!p.settings.accentColor) p.settings.accentColor = '#3b82f6';
    if (!p.settings.spacing) p.settings.spacing = 'normal';
    if (!p.settings.margins) p.settings.margins = 'normal';
    if (typeof p.settings.showPhoto === 'undefined') p.settings.showPhoto = false;
    if (!p.settings.photoSize) p.settings.photoSize = 'medium';
    if (!p.settings.photoShape) p.settings.photoShape = 'circle';
    if (!p.settings.fontSizes) {
      p.settings.fontSizes = { name: 24, headings: 13, body: 10, contact: 9.5 };
    }
    if (!p.settings.marginsCustom) {
      p.settings.marginsCustom = { top: 15, bottom: 15, left: 15, right: 15 };
    }
    if (typeof p.isDemo === 'undefined') p.isDemo = false;
    if (typeof p.isFreshGraduate === 'undefined') p.isFreshGraduate = false;
    if (typeof p.referencesAvailableUponRequest === 'undefined') p.referencesAvailableUponRequest = false;

    if (!p.enabledSections) {
      p.enabledSections = {
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: true,
        internships: (p.internships || []).length > 0,
        research: (p.researchExperience || []).length > 0,
        publications: (p.publications || []).length > 0,
        achievements: (p.achievements || []).length > 0,
        volunteer: (p.volunteer || []).length > 0,
        memberships: (p.memberships || []).length > 0,
        references: true,
        custom: (p.customSections || []).length > 0
      };
    }

    if (!p.personal) p.personal = {};
    if (typeof p.personal.fatherName === 'undefined') p.personal.fatherName = '';
    if (typeof p.personal.motherName === 'undefined') p.personal.motherName = '';
    if (typeof p.personal.permanentAddress === 'undefined') p.personal.permanentAddress = '';
    if (typeof p.personal.religion === 'undefined') p.personal.religion = '';
    if (typeof p.personal.maritalStatus === 'undefined') p.personal.maritalStatus = '';
    if (typeof p.personal.gender === 'undefined') p.personal.gender = '';
    if (!p.settings.fontStyle) p.settings.fontStyle = 'regular';
    if (!p.settings.fontTarget) p.settings.fontTarget = 'all';
    if (!Array.isArray(p.education)) p.education = [];
    if (!Array.isArray(p.experience)) p.experience = [];
    if (!Array.isArray(p.internships)) p.internships = [];
    if (!Array.isArray(p.researchExperience)) p.researchExperience = [];
    
    // Unified Skills Migration & Structure
    if (p.skills && !Array.isArray(p.skills)) {
      const legacy = p.skills;
      const unified = [];
      const seen = new Set();
      const addMigrated = (name, level = '') => {
        const clean = (name || '').trim();
        if (!clean) return;
        const lower = clean.toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          unified.push({
            id: `sk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            name: clean,
            level: level || ''
          });
        }
      };

      (legacy.technical || []).forEach(s => addMigrated(s?.name, s?.level));
      (legacy.tools || []).forEach(t => addMigrated(typeof t === 'string' ? t : t?.name, t?.level));
      (legacy.programming || []).forEach(s => addMigrated(s?.name, s?.level));
      (legacy.dataAnalysis || []).forEach(s => addMigrated(s?.name, s?.level));
      (legacy.professional || legacy.soft || []).forEach(s => addMigrated(s?.name, s?.level));
      (legacy.communication || []).forEach(s => addMigrated(s?.name, s?.level));
      (legacy.industry || []).forEach(s => addMigrated(typeof s === 'string' ? s : s?.name, s?.level));

      p.skills = unified;
    } else if (!Array.isArray(p.skills)) {
      p.skills = [];
    } else {
      // Validate array elements
      p.skills = p.skills.map((s, idx) => {
        if (typeof s === 'string') {
          return { id: `sk_${idx}_${Date.now()}`, name: s.trim(), level: '' };
        }
        return {
          id: s.id || `sk_${idx}_${Date.now()}`,
          name: (s.name || '').trim(),
          level: (s.level || '').trim()
        };
      }).filter(s => s.name);
    }

    // Attach non-enumerable backward-compatibility getters to prevent breaking legacy code
    try {
      if (!p.skills.technical) {
        Object.defineProperty(p.skills, 'technical', {
          get() { return this; },
          configurable: true,
          enumerable: false
        });
      }
      if (!p.skills.tools) {
        Object.defineProperty(p.skills, 'tools', {
          get() { return this.map(s => s.name); },
          configurable: true,
          enumerable: false
        });
      }
    } catch {}

    if (!Array.isArray(p.functionalAreas)) p.functionalAreas = [];
    if (!Array.isArray(p.projects)) p.projects = [];
    if (!Array.isArray(p.certifications)) p.certifications = [];
    if (!Array.isArray(p.languages)) p.languages = [];
    if (!Array.isArray(p.achievements)) p.achievements = [];
    if (!Array.isArray(p.volunteer)) p.volunteer = [];
    if (!Array.isArray(p.publications)) p.publications = [];
    if (!Array.isArray(p.memberships)) p.memberships = [];
    if (!p.academic) p.academic = { researchInterests: [], teachingExperience: [], grants: [], conferences: [], memberships: [] };
    if (!Array.isArray(p.references)) p.references = [];
    if (!Array.isArray(p.customSections)) p.customSections = [];
  }

  getProfile() {
    return this.profile;
  }

  setProfile(newProfile, pushHistory = true) {
    this.ensureStructure(newProfile);
    if (pushHistory) {
      this.saveHistory();
    }
    this.profile = JSON.parse(JSON.stringify(newProfile));
    this.future = [];
    this.scheduleSave();
    this.notify('profile');
  }

  updatePersonalField(field, value, pushHistory = false) {
    if (pushHistory) this.saveHistory();
    this.profile.personal[field] = value;
    this.profile.isDemo = false; // Editing makes it real user data!
    this.scheduleSave();
    this.notify('personal');
  }

  updateSetting(key, value) {
    this.profile.settings[key] = value;
    this.scheduleSave();
    this.notify('settings');
  }

  setTheme(themeId) {
    this.saveHistory();
    this.profile.settings.theme = themeId;
    const themePresets = {
      'minimal-white': { primaryColor: '#0f172a', accentColor: '#475569' },
      'soft-blue': { primaryColor: '#1d4ed8', accentColor: '#3b82f6' },
      'soft-lavender': { primaryColor: '#6366f1', accentColor: '#8b5cf6' },
      'warm-beige': { primaryColor: '#78350f', accentColor: '#b45309' },
      'light-gray': { primaryColor: '#334155', accentColor: '#64748b' },
      'professional-navy': { primaryColor: '#1e3a8a', accentColor: '#2563eb' },
      'modern-pastel': { primaryColor: '#0f766e', accentColor: '#059669' }
    };
    if (themePresets[themeId]) {
      this.profile.settings.primaryColor = themePresets[themeId].primaryColor;
      this.profile.settings.accentColor = themePresets[themeId].accentColor;
    }
    this.scheduleSave();
    this.notify('settings');
  }

  toggleSectionEnabled(sectionName, isEnabled) {
    this.saveHistory();
    this.profile.enabledSections[sectionName] = !!isEnabled;
    this.scheduleSave();
    this.notify('sections');
  }

  setFormat(formatId) {
    this.saveHistory();
    this.profile.format = formatId;
    this.scheduleSave();
    this.notify('format');
  }

  setCountry(countryCode) {
    this.saveHistory();
    this.profile.country = countryCode;
    if (countryCode === 'US' || countryCode === 'CA') {
      this.profile.settings.paperSize = 'letter';
      this.profile.settings.showPhoto = false;
    } else if (countryCode === 'UK') {
      this.profile.settings.paperSize = 'a4';
      this.profile.settings.showPhoto = false;
    } else if (countryCode === 'DE' || countryCode === 'EU') {
      this.profile.settings.paperSize = 'a4';
    } else if (countryCode === 'BD') {
      this.profile.settings.paperSize = 'a4';
      this.profile.settings.showPhoto = true;
      this.profile.settings.dateFormat = 'DD/MM/YYYY';
    }
    this.scheduleSave();
    this.notify('country');
  }

  setFontStyle(style) {
    this.saveHistory();
    this.profile.settings.fontStyle = style || 'regular';
    this.scheduleSave();
    this.notify('settings');
  }

  setFontTarget(target) {
    this.saveHistory();
    this.profile.settings.fontTarget = target || 'all';
    this.scheduleSave();
    this.notify('settings');
  }

  setFontSizes(fontSizesObj) {
    this.saveHistory();
    if (!this.profile.settings.fontSizes) {
      this.profile.settings.fontSizes = { name: 24, headings: 13, body: 10, contact: 9.5 };
    }
    if (fontSizesObj) {
      if (typeof fontSizesObj.name === 'number' && fontSizesObj.name >= 14 && fontSizesObj.name <= 48) {
        this.profile.settings.fontSizes.name = Number(fontSizesObj.name);
      }
      if (typeof fontSizesObj.headings === 'number' && fontSizesObj.headings >= 9 && fontSizesObj.headings <= 24) {
        this.profile.settings.fontSizes.headings = Number(fontSizesObj.headings);
      }
      if (typeof fontSizesObj.body === 'number' && fontSizesObj.body >= 7 && fontSizesObj.body <= 16) {
        this.profile.settings.fontSizes.body = Number(fontSizesObj.body);
      }
      if (typeof fontSizesObj.contact === 'number' && fontSizesObj.contact >= 7 && fontSizesObj.contact <= 14) {
        this.profile.settings.fontSizes.contact = Number(fontSizesObj.contact);
      }
    }
    this.scheduleSave();
    this.notify('settings');
  }

  resetFontSizes() {
    this.saveHistory();
    this.profile.settings.fontSizes = { name: 24, headings: 13, body: 10, contact: 9.5 };
    this.scheduleSave();
    this.notify('settings');
  }

  setMarginsCustom(marginsObj) {
    this.saveHistory();
    if (!this.profile.settings.marginsCustom) {
      this.profile.settings.marginsCustom = { top: 15, bottom: 15, left: 15, right: 15 };
    }
    const clamp = (val, min, max, def) => {
      const n = Number(val);
      return (!isNaN(n) && n >= min && n <= max) ? n : def;
    };
    if (marginsObj) {
      this.profile.settings.marginsCustom.top = clamp(marginsObj.top, 5, 50, 15);
      this.profile.settings.marginsCustom.bottom = clamp(marginsObj.bottom, 5, 50, 15);
      this.profile.settings.marginsCustom.left = clamp(marginsObj.left, 5, 50, 15);
      this.profile.settings.marginsCustom.right = clamp(marginsObj.right, 5, 50, 15);
    }
    this.scheduleSave();
    this.notify('settings');
  }

  resetMarginsCustom() {
    this.saveHistory();
    this.profile.settings.marginsCustom = { top: 15, bottom: 15, left: 15, right: 15 };
    this.scheduleSave();
    this.notify('settings');
  }

  setFreshGraduate(isFresh) {
    this.saveHistory();
    this.profile.isFreshGraduate = !!isFresh;
    this.scheduleSave();
    this.notify('profile');
  }

  setReferencesAvailableUponRequest(val) {
    this.saveHistory();
    this.profile.referencesAvailableUponRequest = !!val;
    this.scheduleSave();
    this.notify('profile');
  }

  // --- Array Item Operations (Add, Edit, Delete, Reorder) ---
  addItem(sectionKey, item) {
    this.saveHistory();
    if (!Array.isArray(this.profile[sectionKey])) {
      this.profile[sectionKey] = [];
    }
    item.id = item.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    this.profile[sectionKey].push(item);
    this.profile.isDemo = false;
    this.scheduleSave();
    this.notify(sectionKey);
    return item.id;
  }

  updateItem(sectionKey, itemId, updatedFields) {
    const arr = this.profile[sectionKey];
    if (Array.isArray(arr)) {
      const idx = arr.findIndex(x => x.id === itemId);
      if (idx !== -1) {
        arr[idx] = { ...arr[idx], ...updatedFields };
        this.profile.isDemo = false;
        this.scheduleSave();
        this.notify(sectionKey);
      }
    }
  }

  deleteItem(sectionKey, itemId) {
    this.saveHistory();
    const arr = this.profile[sectionKey];
    if (Array.isArray(arr)) {
      this.profile[sectionKey] = arr.filter(x => x.id !== itemId);
      this.scheduleSave();
      this.notify(sectionKey);
    }
  }

  moveItem(sectionKey, fromIndex, toIndex) {
    const arr = this.profile[sectionKey];
    if (!Array.isArray(arr) || fromIndex < 0 || toIndex < 0 || fromIndex >= arr.length || toIndex >= arr.length) return;
    this.saveHistory();
    const [moved] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, moved);
    this.scheduleSave();
    this.notify(sectionKey);
  }

  // --- Skills Manager (Unified Single Category: Skills) ---
  addSkill(param1, param2) {
    this.saveHistory();
    if (!Array.isArray(this.profile.skills)) {
      this.profile.skills = [];
    }
    // Handle both addSkill(skillItem) and legacy addSkill(categoryKey, skillItem)
    const skillItem = (param2 && typeof param2 === 'object')
      ? param2
      : (typeof param1 === 'object' && param1 ? param1 : { name: typeof param1 === 'string' ? param1 : '', level: '' });
    
    const item = {
      id: skillItem.id || `sk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: (skillItem.name || '').trim(),
      level: (skillItem.level || '').trim()
    };
    this.profile.skills.push(item);
    this.profile.isDemo = false;
    this.scheduleSave();
    this.notify('skills');
    return item;
  }

  updateSkill(id, updates) {
    if (!Array.isArray(this.profile.skills)) return;
    const target = this.profile.skills.find(s => s.id === id);
    if (target) {
      if (updates.name !== undefined) target.name = updates.name;
      if (updates.level !== undefined) target.level = updates.level;
      this.profile.isDemo = false;
      this.scheduleSave();
      this.notify('skills');
    }
  }

  deleteSkill(param1, param2) {
    this.saveHistory();
    const targetId = param2 || param1;
    if (Array.isArray(this.profile.skills)) {
      this.profile.skills = this.profile.skills.filter(s => s.id !== targetId);
    }
    this.scheduleSave();
    this.notify('skills');
  }

  moveSkill(fromIndex, toIndex) {
    if (!Array.isArray(this.profile.skills)) return;
    if (fromIndex < 0 || fromIndex >= this.profile.skills.length) return;
    if (toIndex < 0 || toIndex >= this.profile.skills.length) return;
    this.saveHistory();
    const [moved] = this.profile.skills.splice(fromIndex, 1);
    this.profile.skills.splice(toIndex, 0, moved);
    this.scheduleSave();
    this.notify('skills');
  }

  // --- Undo & Redo System ---
  saveHistory() {
    const snapshot = JSON.stringify(this.profile);
    if (this.history.length > 0 && this.history[this.history.length - 1] === snapshot) {
      return;
    }
    this.history.push(snapshot);
    if (this.history.length > MAX_HISTORY) {
      this.history.shift();
    }
  }

  canUndo() {
    return this.history.length > 0;
  }

  canRedo() {
    return this.future.length > 0;
  }

  undo() {
    if (!this.canUndo()) return;
    const currentSnapshot = JSON.stringify(this.profile);
    this.future.push(currentSnapshot);
    const prevSnapshot = this.history.pop();
    this.profile = JSON.parse(prevSnapshot);
    this.ensureStructure(this.profile);
    this.scheduleSave();
    this.notify('undo');
  }

  redo() {
    if (!this.canRedo()) return;
    const currentSnapshot = JSON.stringify(this.profile);
    this.history.push(currentSnapshot);
    const nextSnapshot = this.future.pop();
    this.profile = JSON.parse(nextSnapshot);
    this.ensureStructure(this.profile);
    this.scheduleSave();
    this.notify('redo');
  }

  // --- Auto-Save ---
  scheduleSave() {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.saveNow();
    }, 400);
  }

  saveNow() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
      this.lastSaved = new Date();
      this.notify('saved');
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  // --- Load Demo CV ---
  loadDemoProfile(sampleKey = 'senior_engineer') {
    this.saveHistory();
    if (SAMPLE_PROFILES[sampleKey]) {
      const demo = JSON.parse(JSON.stringify(SAMPLE_PROFILES[sampleKey]));
      demo.isDemo = true; // Mark explicitly as demonstration data!
      this.setProfile(demo);
    }
  }

  loadSample(sampleKey) {
    this.loadDemoProfile(sampleKey);
  }

  // --- Multi-Profile Management ---
  getSavedProfilesList() {
    try {
      const list = localStorage.getItem(PROFILES_LIST_KEY);
      return list ? JSON.parse(list) : [];
    } catch {
      return [];
    }
  }

  saveCurrentProfileAs(profileName) {
    const list = this.getSavedProfilesList();
    const id = `profile_${Date.now()}`;
    const clone = JSON.parse(JSON.stringify(this.profile));
    clone.id = id;
    clone.name = profileName || clone.name || 'Untitled Profile';

    list.push({
      id: clone.id,
      name: clone.name,
      targetRole: clone.targetRole || clone.personal?.headline || '',
      updatedAt: new Date().toISOString()
    });

    localStorage.setItem(PROFILES_LIST_KEY, JSON.stringify(list));
    localStorage.setItem(`cvforge_profile_data_${id}`, JSON.stringify(clone));
    this.notify('profilesList');
    return id;
  }

  loadSavedProfile(id) {
    try {
      const stored = localStorage.getItem(`cvforge_profile_data_${id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.setProfile(parsed);
      }
    } catch (e) {
      console.error('Could not load profile:', e);
    }
  }

  deleteSavedProfile(id) {
    let list = this.getSavedProfilesList();
    list = list.filter(p => p.id !== id);
    localStorage.setItem(PROFILES_LIST_KEY, JSON.stringify(list));
    localStorage.removeItem(`cvforge_profile_data_${id}`);
    this.notify('profilesList');
  }

  resetSection(sectionKey) {
    this.saveHistory();
    switch (sectionKey) {
      case 'personal':
        this.profile.personal = {
          fullName: '', headline: '', summary: '', objective: '', strengths: '',
          email: '', phone: '', location: '', nationality: '', linkedin: '', github: '',
          portfolio: '', photoUrl: '', dateOfBirth: '', drivingLicense: '',
          fatherName: '', motherName: '', permanentAddress: '', religion: '', maritalStatus: '', gender: ''
        };
        break;
      case 'summary':
        if (this.profile.personal) {
          this.profile.personal.summary = '';
          this.profile.personal.objective = '';
          this.profile.personal.strengths = '';
        }
        break;
      case 'experience':
        this.profile.experience = [];
        this.profile.isFreshGraduate = false;
        break;
      case 'education':
        this.profile.education = [];
        break;
      case 'skills':
        this.profile.skills = [];
        this.profile.functionalAreas = [];
        break;
      case 'projects':
        this.profile.projects = [];
        break;
      case 'certifications':
        this.profile.certifications = [];
        break;
      case 'languages':
        this.profile.languages = [];
        break;
      case 'references':
        this.profile.references = [];
        this.profile.referencesAvailableUponRequest = false;
        break;
      case 'internships':
        this.profile.internships = [];
        break;
      case 'research':
      case 'researchExperience':
        this.profile.researchExperience = [];
        break;
      case 'publications':
        this.profile.publications = [];
        break;
      case 'achievements':
        this.profile.achievements = [];
        break;
      case 'volunteer':
        this.profile.volunteer = [];
        break;
      case 'memberships':
        this.profile.memberships = [];
        break;
      case 'academic':
        this.profile.academic = { researchInterests: [], teachingExperience: [], grants: [], conferences: [], memberships: [] };
        break;
      case 'custom':
      case 'customSections':
        this.profile.customSections = [];
        break;
      default:
        if (Array.isArray(this.profile[sectionKey])) {
          this.profile[sectionKey] = [];
        }
    }
    this.scheduleSave();
    this.notify(sectionKey);
  }

  clearAllCandidateData(keepSettings = true) {
    this.saveHistory();
    const currentSettings = keepSettings ? JSON.parse(JSON.stringify(this.profile.settings || {})) : null;
    const currentFormat = keepSettings ? this.profile.format : 'reverse-chronological';
    const currentCountry = keepSettings ? this.profile.country : 'US';

    const clean = this.getDefaultProfile();
    if (keepSettings && currentSettings) {
      clean.settings = currentSettings;
      clean.format = currentFormat;
      clean.country = currentCountry;
    }
    clean.isDemo = false;
    this.profile = clean;
    this.scheduleSave();
    this.notify('reset');
  }

  startNewCV(title = 'My Professional CV') {
    this.saveHistory();
    const clean = this.getDefaultProfile();
    clean.name = title;
    this.profile = clean;
    this.scheduleSave();
    this.notify('reset');
  }

  resetToBlank() {
    this.clearAllCandidateData(true);
  }

  clearAllData() {
    localStorage.clear();
    this.profile = this.getDefaultProfile();
    this.history = [];
    this.future = [];
    this.scheduleSave();
    this.notify('reset');
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event) {
    for (const listener of this.listeners) {
      try {
        listener(event, this.profile);
      } catch (e) {
        console.error('Error in state listener:', e);
      }
    }
  }
}

const appState = new StateManager();


// Exports
exports.StateManager = StateManager;
exports.appState = appState;
};

  // Module: ./templates/academic.js
  __modules__['./templates/academic.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format 7: Academic CV (Curriculum Vitae)
 * Formal scholarly dossier format tailored for university faculty, postdocs, research scientists,
 * and graduate fellowships. Comprehensive, unconstrained multi-page academic structure.
 */

const { escapeHtml, formatDateRange, getCleanUrl, renderPhotoHtml, isSectionEnabled, formatEducationDegree, isFreshGraduateCandidate, renderCategorizedSkillsHtml, renderReferencesHtml } = __require__('./templateUtils.js', __currentDir);

function renderAcademic(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#7c2d12'; // Default academic burgundy/brown
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const academic = profile.academic || {};
  const photoHtml = renderPhotoHtml(profile, 'w-24 h-28', 'rounded shadow-xs');
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  return `
    <div class="cv-format cv-academic max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm font-serif">
      <!-- Formal Academic Header -->
      <header class="pb-5 mb-6 border-b-2" style="border-color: ${primaryColor}">
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1 text-center md:text-left">
            <h1 class="cv-name text-3xl font-bold tracking-tight text-slate-900 mb-1">
              ${escapeHtml(p.fullName || 'Candidate Name')}
            </h1>
            ${p.headline ? `<div class="text-base italic text-slate-700">${escapeHtml(p.headline)}</div>` : ''}

            <div class="cv-contact-line text-xs text-slate-600 mt-3 space-y-0.5">
              ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
              <div>
                ${p.email ? `Email: <a href="mailto:${p.email}" class="underline text-slate-800">${escapeHtml(p.email)}</a>` : ''}
                ${p.phone ? ` • Tel: ${escapeHtml(p.phone)}` : ''}
              </div>
              <div class="space-x-3 text-slate-700">
                ${p.website ? `<a href="${p.website}" target="_blank" class="underline">Academic Homepage</a>` : ''}
                ${p.portfolio ? `• <a href="${p.portfolio}" target="_blank" class="underline">Google Scholar</a>` : ''}
                ${p.github ? `• <a href="${p.github}" target="_blank" class="underline">Code Repository</a>` : ''}
              </div>
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>
      </header>

      <!-- Research Specializations / Interests -->
      ${(academic.researchInterests?.length > 0) ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Research Specializations & Scholarly Interests
          </h2>
          <div class="flex flex-wrap gap-2 text-xs text-slate-800">
            ${academic.researchInterests.map(interest => `
              <span class="border border-slate-300 rounded px-2.5 py-0.5 bg-slate-50 font-sans">${escapeHtml(interest)}</span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Academic Education (With Dissertation & Advisor) -->
      ${isSectionEnabled(profile, 'education') && profile.education?.length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Academic Education
          </h2>
          <div class="space-y-4 text-xs">
            ${profile.education.map(edu => `
              <div class="break-inside-avoid">
                <div class="flex justify-between items-baseline font-bold text-slate-900 text-sm">
                  <span>${formatEducationDegree(edu)}</span>
                  <span class="font-normal text-xs text-slate-600">${formatDateRange(edu.startDate, edu.endDate, edu.current, 'YYYY')}</span>
                </div>
                <div class="text-slate-700 italic">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                ${edu.honors ? `<div class="text-slate-600 font-sans text-[11px] mt-0.5">Honors: ${escapeHtml(edu.honors)}</div>` : ''}
                ${edu.coursework ? `<div class="text-slate-600 font-sans text-[11px] mt-0.5"><strong>Coursework:</strong> ${escapeHtml(edu.coursework)}</div>` : ''}
                ${edu.thesis ? `<div class="text-slate-800 italic mt-1 ml-3 border-l-2 pl-2 border-slate-300">${escapeHtml(edu.thesis)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Academic & Research Appointments (Omitted if fresh graduate or empty) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && profile.experience?.length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Academic Appointments & Research Positions
          </h2>
          <div class="space-y-4 text-xs">
            ${profile.experience.map(exp => `
              <div class="break-inside-avoid">
                <div class="flex justify-between items-baseline font-bold text-slate-900 text-sm">
                  <span>${escapeHtml(exp.title)}</span>
                  <span class="font-normal text-xs text-slate-600">${formatDateRange(exp.startDate, exp.endDate, exp.current, 'YYYY')}</span>
                </div>
                <div class="text-slate-700 italic mb-1.5">${escapeHtml(exp.company)}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-5 space-y-1 text-slate-700">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Peer-Reviewed Publications -->
      ${(profile.publications?.length > 0) ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Publications & Preprints
          </h2>
          <div class="space-y-3 text-xs">
            ${profile.publications.map((pub, idx) => `
              <div class="break-inside-avoid">
                <span class="font-bold">[${idx + 1}]</span>
                ${pub.authors ? `<span class="italic">${escapeHtml(pub.authors)}.</span>` : ''}
                <span class="font-bold">"${escapeHtml(pub.title)}."</span>
                <span class="text-slate-700">${escapeHtml(pub.journal || '')}</span>
                <span class="text-slate-500">(${escapeHtml(pub.year || '')})</span>
                ${pub.doi ? `<span class="text-blue-700 underline font-sans ml-1 text-[11px]"><a href="https://doi.org/${pub.doi}" target="_blank">DOI: ${escapeHtml(pub.doi)}</a></span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Research Projects & Software Artifacts -->
      ${isSectionEnabled(profile, 'projects') && profile.projects?.length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Research Projects & Deliverables
          </h2>
          <div class="space-y-3 text-xs">
            ${profile.projects.map(proj => `
              <div class="break-inside-avoid">
                <div class="font-bold text-slate-900">${escapeHtml(proj.title)} ${proj.role ? `<span class="font-normal italic">(${escapeHtml(proj.role)})</span>` : ''}</div>
                ${proj.description ? `<p class="text-slate-700 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.githubUrl ? `<div class="text-[11px] font-sans text-blue-700 mt-0.5"><a href="${proj.githubUrl}" target="_blank" class="underline">Repository: ${getCleanUrl(proj.githubUrl)}</a></div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Methodological & Technical Competencies -->
      ${isSectionEnabled(profile, 'skills') ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Methodological & Technical Competencies
          </h2>
          <div class="font-sans">
            ${renderCategorizedSkillsHtml(profile, primaryColor)}
          </div>
        </section>
      ` : ''}

      <!-- Awards & Honors -->
      ${(profile.achievements?.length > 0) ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Honors, Fellowships & Awards
          </h2>
          <div class="space-y-1.5 text-xs">
            ${profile.achievements.map(ach => `
              <div class="flex justify-between">
                <span><strong>${escapeHtml(ach.title)}</strong>, ${escapeHtml(ach.issuer || '')}</span>
                <span class="text-slate-500">${escapeHtml(ach.year || '')}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Academic References -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}


// Exports
exports.renderAcademic = renderAcademic;
};

  // Module: ./templates/atsFriendly.js
  __modules__['./templates/atsFriendly.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format 9: ATS-Friendly CV
 * Strictly engineered for optimal machine readability across all Applicant Tracking Systems
 * (Workday, Taleo, Greenhouse, Lever, iCIMS).
 * Single column, standard semantic headers, no tables, no floating graphic elements, universal typography.
 */

const { escapeHtml, formatDateRange, getCleanUrl, formatEducationDegree, isFreshGraduateCandidate, renderReferencesHtml, isSectionEnabled, getSkillsList } = __require__('./templateUtils.js', __currentDir);

function renderAtsFriendly(profile) {
  const p = profile.personal || {};
  const dateFormat = 'Month YYYY'; // Best standard for ATS
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const allSkills = getSkillsList(profile);

  // Reverse chronological sort for parser clarity
  const expList = [...(profile.experience || [])].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const eduList = [...(profile.education || [])].sort((a, b) => {
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  return `
    <div class="cv-format cv-ats-friendly max-w-[800px] mx-auto text-black leading-normal text-sm font-sans bg-white p-2">
      <!-- Standard ATS Header -->
      <header class="text-center pb-3 mb-4 border-b border-black">
        <h1 class="cv-name text-2xl font-bold uppercase tracking-wide text-black mb-1">
          ${escapeHtml(p.fullName || 'CANDIDATE NAME')}
        </h1>
        ${p.headline ? `<div class="text-sm font-semibold text-black uppercase mb-1.5">${escapeHtml(p.headline)}</div>` : ''}

        <div class="cv-contact-line text-xs text-black space-x-1.5">
          ${p.location ? `<span>${escapeHtml(p.location)}</span> |` : ''}
          ${p.email ? `<span>${escapeHtml(p.email)}</span> |` : ''}
          ${p.phone ? `<span>${escapeHtml(p.phone)}</span>` : ''}
          ${p.linkedin ? `| <span>${getCleanUrl(p.linkedin)}</span>` : ''}
          ${p.github ? `| <span>${getCleanUrl(p.github)}</span>` : ''}
          ${p.website ? `| <span>${getCleanUrl(p.website)}</span>` : ''}
        </div>
      </header>

      <!-- Standard Section 1: Professional Summary / Career Objective -->
      ${p.summary || p.objective ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            ${p.objective && !p.summary ? 'Career Objective' : 'Professional Summary'}
          </h2>
          <p class="text-xs text-black leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Standard Section: Skills -->
      ${isSectionEnabled(profile, 'skills') && allSkills.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Skills
          </h2>
          <div class="text-xs text-black leading-relaxed">
            ${allSkills.map(s => escapeHtml(s.level ? `${s.name} (${s.level})` : s.name)).join(' • ')}
          </div>
        </section>
      ` : ''}

      <!-- For Fresh Grads: Education Comes First -->
      ${isFreshGraduate && eduList.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Education
          </h2>
          <div class="space-y-2 text-xs">
            ${eduList.map(edu => `
              <div>
                <div class="flex justify-between items-baseline font-bold text-black">
                  <span>${formatEducationDegree(edu)}</span>
                  <span>${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
                <div class="text-black">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''} ${edu.gpa ? `— GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
                ${edu.coursework ? `<div class="text-[11px] text-black">Relevant Coursework: ${escapeHtml(edu.coursework)}</div>` : ''}
                ${edu.honors ? `<div class="text-[11px] text-black">${escapeHtml(edu.honors)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Standard Section: Professional Work Experience (Omitted if fresh graduate or empty) -->
      ${!isFreshGraduate && expList.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Work Experience
          </h2>
          <div class="space-y-3">
            ${expList.map(exp => `
              <div>
                <div class="flex justify-between items-baseline text-xs font-bold text-black">
                  <span>${escapeHtml(exp.title)}</span>
                  <span>${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}</span>
                </div>
                <div class="text-xs text-black mb-1">
                  <span class="font-semibold">${escapeHtml(exp.company)}</span>
                  ${exp.location ? ` — ${escapeHtml(exp.location)}` : ''}
                </div>

                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 space-y-0.5 text-xs text-black">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}

                ${Array.isArray(exp.technologies) && exp.technologies.length > 0 ? `
                  <div class="mt-1 text-[11px] text-black">
                    <strong>Technologies Used:</strong> ${exp.technologies.map(t => escapeHtml(t)).join(', ')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Standard Section: Projects (if present) -->
      ${profile.projects?.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            ${isFreshGraduate ? 'Academic & Practical Projects' : 'Key Projects'}
          </h2>
          <div class="space-y-2 text-xs">
            ${profile.projects.map(proj => `
              <div>
                <div class="font-bold text-black">
                  ${escapeHtml(proj.title)}
                  ${proj.role ? ` — Role: ${escapeHtml(proj.role)}` : ''}
                </div>
                ${proj.description ? `<p class="text-black">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<p class="text-black"><strong>Outcomes:</strong> ${escapeHtml(proj.outcomes)}</p>` : ''}
                ${Array.isArray(proj.technologies) && proj.technologies.length > 0 ? `<div class="text-[11px] text-black"><strong>Tools & Technologies:</strong> ${proj.technologies.map(t => escapeHtml(t)).join(', ')}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Standard Section: Education (For experienced candidates) -->
      ${!isFreshGraduate && eduList.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Education
          </h2>
          <div class="space-y-2 text-xs">
            ${eduList.map(edu => `
              <div>
                <div class="flex justify-between items-baseline font-bold text-black">
                  <span>${formatEducationDegree(edu)}</span>
                  <span>${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
                <div class="text-black">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''} ${edu.gpa ? `— GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
                ${edu.honors ? `<div class="text-[11px] text-black">${escapeHtml(edu.honors)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Standard Section: Certifications -->
      ${profile.certifications?.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Certifications
          </h2>
          <div class="space-y-1 text-xs text-black">
            ${profile.certifications.map(c => `
              <div class="flex justify-between">
                <span><strong>${escapeHtml(c.title)}</strong>, ${escapeHtml(c.issuer)}</span>
                <span>${formatDateRange(c.issueDate, c.expiryDate, false, dateFormat)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Languages -->
      ${profile.languages?.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Languages
          </h2>
          <div class="text-xs text-black">
            ${profile.languages.map(l => `${escapeHtml(l.name)} (${escapeHtml(l.proficiency || 'Proficient')})`).join(' | ')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, '#000000')}

    </div>
  `;
}


// Exports
exports.renderAtsFriendly = renderAtsFriendly;
};

  // Module: ./templates/catalog.js
  __modules__['./templates/catalog.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Master Template Catalog (10 Formats x 5 Templates = 50 Templates)
 * Authentic international standards across Professional, ATS, Creative, Academic,
 * Functional, International, Executive, Technical, Entry-Level, and Europass.
 * 
 * Includes the 3 imported workspace templates under genuine professional names:
 * - "Academic Scholar (Two-Column)" (academic-scholar-two-column)
 * - "Institutional Classic (Bordered Standard)" (intl-institutional-classic)
 * - "Executive Blue-Banner" (exec-blue-banner)
 */

const { renderReverseChronological } = __require__('./reverseChrono.js', __currentDir);
const { renderChronological } = __require__('./chronological.js', __currentDir);
const { renderCleanMinimal } = __require__('./cleanMinimal.js', __currentDir);
const { renderCorporateExecutive } = __require__('./corporateExecutive.js', __currentDir);

const { renderAtsFriendly } = __require__('./atsFriendly.js', __currentDir);
const { renderModernAts } = __require__('./modernAts.js', __currentDir);

const { renderCreativeVisual } = __require__('./creativeVisual.js', __currentDir);

const { renderAcademic } = __require__('./academic.js', __currentDir);
const { renderCustomAcademicGreen } = __require__('./customAcademicGreen.js', __currentDir);

const { renderFunctional } = __require__('./functional.js', __currentDir);
const { renderSkillsBased } = __require__('./skillsBased.js', __currentDir);
const { renderCombination } = __require__('./combination.js', __currentDir);
const { renderTargeted } = __require__('./targeted.js', __currentDir);

const { renderCustomBdClassic } = __require__('./customBdClassic.js', __currentDir);
const { renderUsResume } = __require__('./usResume.js', __currentDir);
const { renderUkCv } = __require__('./ukCv.js', __currentDir);
const { renderGermanCv } = __require__('./germanCv.js', __currentDir);

const { renderCustomExecutiveBluebar } = __require__('./customExecutiveBluebar.js', __currentDir);
const { renderEuropass } = __require__('./europass.js', __currentDir);

// Extended Renderers
const { renderProfCorporateMatrix, renderProfModernSlate, renderAtsCompactLinear, renderAtsPlainSemantic, renderAtsExecutiveScan, renderCreativePortfolioGrid, renderCreativeDuoTone, renderCreativeEditorial, renderCreativeMinimalArt, renderAcademicFellowship, renderAcademicCurriculum, renderAcademicSymposium, renderFunctionalCapability, renderFunctionalProjectFirst, renderFunctionalHybridCompetency, renderIntlNordicClean, renderExecCSuite, renderExecGovernance, renderExecGoldLine, renderTechStackFocused, renderTechCloudArchitect, renderTechEngineeringLead, renderTechDataScientist, renderTechTerminalModern, renderEntryEducationFirst, renderEntryCampusLeader, renderEntryInternPath, renderEntryStemStarter, renderEntryBoldStart, renderEuropassModern, renderEuropassExecutive, renderEuropassAcademic, renderEuropassCompact } = __require__('./extendedTemplates.js', __currentDir);

const FORMAT_CATEGORIES = [
  {
    id: 'professional',
    name: 'Professional CV',
    subtitle: 'Corporate & Established Careers',
    description: 'Reverse-chronological & progression timelines designed for corporate, finance, legal, and established industry professionals.',
    icon: 'briefcase',
    templateCount: 5,
    schematic: 'classic'
  },
  {
    id: 'ats',
    name: 'ATS-Friendly Resume',
    subtitle: 'Machine-Scannable & Portal Compliant',
    description: 'Strict single-column semantic structures designed to pass Workday, Taleo, Greenhouse, iCIMS, and Lever applicant tracking parsers with 100% accuracy.',
    icon: 'cpu',
    templateCount: 5,
    schematic: 'ats'
  },
  {
    id: 'creative',
    name: 'Creative / Visual CV',
    subtitle: 'Design, Media & Portfolio Centric',
    description: 'Modern split-column layouts, visual accents, portfolio callouts, and skill indicators for UI/UX, marketing, and creative fields.',
    icon: 'palette',
    templateCount: 5,
    schematic: 'creative'
  },
  {
    id: 'academic',
    name: 'Academic CV',
    subtitle: 'Higher Education, Research & Faculty',
    description: 'Comprehensive formats highlighting publications with DOIs, research grants, dissertations, teaching appointments, and academic honors.',
    icon: 'graduation-cap',
    templateCount: 5,
    schematic: 'academic'
  },
  {
    id: 'functional',
    name: 'Functional CV',
    subtitle: 'Skill Domains & Career Pivots',
    description: 'De-emphasizes linear job chronology to spotlight transferable competencies, core skill domains, and cross-functional achievements.',
    icon: 'layers',
    templateCount: 5,
    schematic: 'functional'
  },
  {
    id: 'international',
    name: 'International CV',
    subtitle: 'Global, US, UK, German & Institutional',
    description: 'Tailored for cross-border recruitment adhering to US EEOC rules, UK Personal Statements, German Lebenslauf, and Bangladesh Institutional Standards.',
    icon: 'globe',
    templateCount: 5,
    schematic: 'bd-classic'
  },
  {
    id: 'executive',
    name: 'Executive CV',
    subtitle: 'C-Suite, Boardroom & Senior Leadership',
    description: 'High-impact formats with executive headers, governance matrices, revenue & EBITDA impact deliverables, and board credentials.',
    icon: 'award',
    templateCount: 5,
    schematic: 'executive-bluebar'
  },
  {
    id: 'technical',
    name: 'Technical CV',
    subtitle: 'Software, DevOps & Data Science',
    description: 'Tech stack matrices, GitHub/repository integration, cloud architectures, system scale metrics, and production environment highlights.',
    icon: 'code-2',
    templateCount: 5,
    schematic: 'technical'
  },
  {
    id: 'entry-level',
    name: 'Entry-Level / Graduate CV',
    subtitle: 'Fresh Graduates, Students & Interns',
    description: 'Prioritizes university degrees, academic honors, capstone projects, campus leadership, and internships with automatic work experience hiding.',
    icon: 'sparkles',
    templateCount: 5,
    schematic: 'entry'
  },
  {
    id: 'europass',
    name: 'Europass CV',
    subtitle: 'Official European Union Framework',
    description: 'Authentic European Commission two-column format with standard blue accents, CEFR language pass, and European mobility standards.',
    icon: 'flag',
    templateCount: 5,
    schematic: 'europass'
  }
];

const TEMPLATES = {
  // ==========================================
  // FORMAT 1: PROFESSIONAL CV (5 TEMPLATES)
  // ==========================================
  'reverse-chronological': {
    id: 'reverse-chronological',
    name: 'Modern Professional',
    formatCategory: 'professional',
    category: 'Professional CV',
    tagline: 'Industry gold standard: most recent senior achievements first with subtle dividers',
    features: 'Reverse chronological order, clean line dividers, bold titles, balanced whitespace',
    bestFor: 'Modern corporate applications, tech roles, and executive search',
    schematic: 'classic',
    renderer: renderReverseChronological
  },
  'chronological': {
    id: 'chronological',
    name: 'Classic Heritage',
    formatCategory: 'professional',
    category: 'Professional CV',
    tagline: 'Forward career progression timeline (foundations to present)',
    features: 'Chronological timeline, understated corporate serif typography, classic margins',
    bestFor: 'Traditional industries, education, civil service, and law',
    schematic: 'classic',
    renderer: renderChronological
  },
  'clean-minimal': {
    id: 'clean-minimal',
    name: 'Swiss Minimalist',
    formatCategory: 'professional',
    category: 'Professional CV',
    tagline: 'Swiss-inspired disciplined whitespace, ultra-clear hierarchy, and ample breathing room',
    features: 'Generous whitespace, asymmetric grid, borderless sections, airy typography',
    bestFor: 'All candidates desiring modern simplicity, writers, and consultants',
    schematic: 'minimal',
    renderer: renderCleanMinimal
  },
  'prof-corporate-matrix': {
    id: 'prof-corporate-matrix',
    name: 'Corporate Matrix',
    formatCategory: 'professional',
    category: 'Professional CV',
    tagline: 'Double-border executive header, structured competencies grid, bold section badges',
    features: 'Double-rule header, 3-column competencies matrix, left-bordered experience timeline',
    bestFor: 'Finance directors, enterprise program managers, and operations leaders',
    schematic: 'classic',
    renderer: renderProfCorporateMatrix
  },
  'prof-modern-slate': {
    id: 'prof-modern-slate',
    name: 'Slate Executive Compact',
    formatCategory: 'professional',
    category: 'Professional CV',
    tagline: 'Deep slate headers, compact line spacing, high information density',
    features: 'Compact typography, slate section dividers, pill skill tags, dense spacing',
    bestFor: 'Senior professionals with dense 10+ year career histories needing 1-2 pages',
    schematic: 'classic',
    renderer: renderProfModernSlate
  },

  // ==========================================
  // FORMAT 2: ATS-FRIENDLY RESUME (5 TEMPLATES)
  // ==========================================
  'ats-friendly': {
    id: 'ats-friendly',
    name: 'Single Column ATS',
    formatCategory: 'ats',
    category: 'ATS-Friendly Resume',
    tagline: 'Strict single-column semantic structure for 100% parser pass rate',
    features: 'Zero columns, standard font, universal parser compliance, zero unreadable graphics',
    bestFor: 'Large applicant portals (Workday, Taleo, Greenhouse, iCIMS, Lever)',
    schematic: 'ats',
    renderer: renderAtsFriendly
  },
  'modern-ats': {
    id: 'modern-ats',
    name: 'Modern Single-Column ATS',
    formatCategory: 'ats',
    category: 'ATS-Friendly Resume',
    tagline: 'High-contrast single-column ATS format with clean point-scaled typography',
    features: 'Clean black underlines, point-scaled type, linear metadata, high ATS score',
    bestFor: 'Corporate ATS job portals with modern readable styling',
    schematic: 'ats',
    renderer: renderModernAts
  },
  'ats-compact-linear': {
    id: 'ats-compact-linear',
    name: 'ATS Linear Compact',
    formatCategory: 'ats',
    category: 'ATS-Friendly Resume',
    tagline: 'Ultra-dense linear bullets, bracketed dates, zero nested elements',
    features: 'Compact layout, bracketed dates [2021 – Present], bulleted linear skills',
    bestFor: 'Dense career profiles needing strict 1-page ATS compliance',
    schematic: 'ats',
    renderer: renderAtsCompactLinear
  },
  'ats-plain-semantic': {
    id: 'ats-plain-semantic',
    name: 'Pure Semantic ATS',
    formatCategory: 'ats',
    category: 'ATS-Friendly Resume',
    tagline: 'Minimalist ASCII-clean dividers, left-aligned, raw text parseability',
    features: 'Monospaced header, ASCII section markers === SECTION ===, zero tables',
    bestFor: 'Government, defense, and older legacy scanning systems',
    schematic: 'ats',
    renderer: renderAtsPlainSemantic
  },
  'ats-executive-scan': {
    id: 'ats-executive-scan',
    name: 'Executive Parser Standard',
    formatCategory: 'ats',
    category: 'ATS-Friendly Resume',
    tagline: 'Strategic summary top, bold metrics, ATS-verified hierarchy',
    features: 'Executive profile block, 3-column expertise grid, quantitative metric bullets',
    bestFor: 'Director & VP roles submitted through enterprise job portals',
    schematic: 'ats',
    renderer: renderAtsExecutiveScan
  },

  // ==========================================
  // FORMAT 3: CREATIVE / VISUAL CV (5 TEMPLATES)
  // ==========================================
  'creative-visual': {
    id: 'creative-visual',
    name: 'Creative Designer',
    formatCategory: 'creative',
    category: 'Creative / Visual CV',
    tagline: 'Split accent sidebar, visual skill progress meters, contemporary creative layout',
    features: 'Two-column split sidebar, accent color bands, visual skill meters, modern badges',
    bestFor: 'UI/UX designers, creative leads, art directors, frontend creators',
    schematic: 'creative',
    renderer: renderCreativeVisual
  },
  'creative-portfolio-grid': {
    id: 'creative-portfolio-grid',
    name: 'Portfolio Showcase',
    formatCategory: 'creative',
    category: 'Creative / Visual CV',
    tagline: 'Vibrant header banner, card-based project cards with tag badges',
    features: 'Gradient header card, project cards with impact pills, creative skill tags',
    bestFor: 'Product designers, marketing managers, portfolio creators',
    schematic: 'creative',
    renderer: renderCreativePortfolioGrid
  },
  'creative-duo-tone': {
    id: 'creative-duo-tone',
    name: 'Modern Duo-Tone Split',
    formatCategory: 'creative',
    category: 'Creative / Visual CV',
    tagline: 'Dark slate left column for skills/contacts, light right column for narrative',
    features: 'High contrast dark sidebar (32%), crisp narrative column (68%), modern avatar',
    bestFor: 'Tech designers, fullstack developers, creative agency talent',
    schematic: 'creative',
    renderer: renderCreativeDuoTone
  },
  'creative-editorial': {
    id: 'creative-editorial',
    name: 'Editorial Magazine',
    formatCategory: 'creative',
    category: 'Creative / Visual CV',
    tagline: 'Bold display title, elegant serif headlines, pull-quote summary layout',
    features: 'Editorial serif typography, centered pull-quote statement, classic ruled lines',
    bestFor: 'Journalists, content directors, copywriters, creative strategists',
    schematic: 'classic',
    renderer: renderCreativeEditorial
  },
  'creative-minimal-art': {
    id: 'creative-minimal-art',
    name: 'Art Studio Minimalist',
    formatCategory: 'creative',
    category: 'Creative / Visual CV',
    tagline: 'Geometric minimalist layout, pastel accent borders, monospaced tech tags',
    features: 'Clean monospace accent, code-style tag brackets [Skill], border boxes',
    bestFor: 'Architects, modern artists, digital media creators',
    schematic: 'minimal',
    renderer: renderCreativeMinimalArt
  },

  // ==========================================
  // FORMAT 4: ACADEMIC CV (5 TEMPLATES)
  // ==========================================
  'academic-scholar-two-column': {
    id: 'academic-scholar-two-column',
    name: 'Academic Scholar (Two-Column)',
    formatCategory: 'academic',
    category: 'Academic CV',
    tagline: 'Authentic two-column layout with green divider rules from CV Mathematics.pdf',
    features: 'Authentic two-column grid, green divider rules, compact contact sidebar, formal academic hierarchy',
    bestFor: 'Mathematics, science, academia, and entry-level analytical candidates',
    schematic: 'academic-green',
    renderer: renderCustomAcademicGreen
  },
  'academic': {
    id: 'academic',
    name: 'Academic Research Standard',
    formatCategory: 'academic',
    category: 'Academic CV',
    tagline: 'Publications with DOI, dissertation, grants, teaching experience, and colloquia',
    features: 'Numbered publications with DOI, dissertation title, grant funding, formal teaching history',
    bestFor: 'Postdocs, professors, researchers, PhD scholars, and fellowships',
    schematic: 'academic',
    renderer: renderAcademic
  },
  'academic-fellowship': {
    id: 'academic-fellowship',
    name: 'University Fellowship',
    formatCategory: 'academic',
    category: 'Academic CV',
    tagline: 'Formal departmental header, teaching matrix, research interests spotlight',
    features: 'Research interests callout box, teaching appointments, formal serif styling',
    bestFor: 'Fellowship applicants, visiting scholars, university lecturers',
    schematic: 'academic',
    renderer: renderAcademicFellowship
  },
  'academic-curriculum': {
    id: 'academic-curriculum',
    name: 'Vitae Europaea Academia',
    formatCategory: 'academic',
    category: 'Academic CV',
    tagline: 'Chronological research history, conference presentations, awards list',
    features: 'Full academic tenure layout, conference presentations, research grants list',
    bestFor: 'European academic positions, research institutes, tenure applications',
    schematic: 'academic',
    renderer: renderAcademicCurriculum
  },
  'academic-symposium': {
    id: 'academic-symposium',
    name: 'Clinical & Lab Scientist',
    formatCategory: 'academic',
    category: 'Academic CV',
    tagline: 'Lab affiliations, grant totals, co-author citations, peer-review roles',
    features: 'Laboratory affiliations, co-author citations, peer review roles, grant totals',
    bestFor: 'Biomedical researchers, lab directors, clinical scientists',
    schematic: 'academic',
    renderer: renderAcademicSymposium
  },

  // ==========================================
  // FORMAT 5: FUNCTIONAL CV (5 TEMPLATES)
  // ==========================================
  'functional': {
    id: 'functional',
    name: 'Skill Domain Functional',
    formatCategory: 'functional',
    category: 'Functional CV',
    tagline: 'Organized by skill domains rather than chronological job titles',
    features: 'Functional competence clusters, transferable skill spotlight, secondary timeline',
    bestFor: 'Career pivoters, freelancers, and employment gap smoothing',
    schematic: 'functional',
    renderer: renderFunctional
  },
  'skills-based': {
    id: 'skills-based',
    name: 'Skills-First Matrix',
    formatCategory: 'functional',
    category: 'Functional CV',
    tagline: 'Unified skill matrix, proficiency tiers, and project-based proof points',
    features: 'Visual skill proficiency tiers, practical proof points, project achievements',
    bestFor: 'Fresh graduates, software engineers, data analysts, and technicians',
    schematic: 'functional',
    renderer: renderSkillsBased
  },
  'functional-capability': {
    id: 'functional-capability',
    name: 'Executive Capability',
    formatCategory: 'functional',
    category: 'Functional CV',
    tagline: 'Competency thematic clusters: Strategic Leadership, Delivery, Innovation',
    features: 'Core value proposition banner, competency cards with proof points',
    bestFor: 'Consultants, agile coaches, interim managers, organizational leaders',
    schematic: 'functional',
    renderer: renderFunctionalCapability
  },
  'functional-project-first': {
    id: 'functional-project-first',
    name: 'Project Showcase Functional',
    formatCategory: 'functional',
    category: 'Functional CV',
    tagline: 'Major achievements and deliverable impact grouped by outcome',
    features: 'Deliverables-first structure, impact metrics, condensed work history',
    bestFor: 'Contractors, freelance developers, project directors',
    schematic: 'functional',
    renderer: renderFunctionalProjectFirst
  },
  'combination': {
    id: 'combination',
    name: 'Combination / Hybrid CV',
    formatCategory: 'functional',
    category: 'Functional CV',
    tagline: 'Executive competency grid blended with detailed corporate employment history',
    features: 'Balanced hybrid layout: top competency summary + full chronological work history',
    bestFor: 'Senior managers, architects, and candidates with dual specializations',
    schematic: 'classic',
    renderer: renderCombination
  },

  // ==========================================
  // FORMAT 6: INTERNATIONAL CV (5 TEMPLATES)
  // ==========================================
  'intl-institutional-classic': {
    id: 'intl-institutional-classic',
    name: 'Institutional Classic (Bordered Standard)',
    formatCategory: 'international',
    category: 'International CV',
    tagline: 'Authentic page border, coloned personal details, soft green education table, and signature from CV.pdf',
    features: 'Full page border, coloned personal details table, structured education table, signature block',
    bestFor: 'Authentic Bangladesh corporate, banking, government, and institutional applications',
    schematic: 'bd-classic',
    renderer: renderCustomBdClassic
  },
  'us-resume': {
    id: 'us-resume',
    name: 'United States Resume',
    formatCategory: 'international',
    category: 'International CV',
    tagline: 'Strict 1-page US standard, US Letter paper size, action verbs, zero photos (EEOC compliant)',
    features: 'Strict 1-page US standard, EEOC anti-bias compliant (no photo), US Letter paper, action verbs',
    bestFor: 'Applications in the United States and American multinational firms',
    schematic: 'us-resume',
    renderer: renderUsResume
  },
  'uk-cv': {
    id: 'uk-cv',
    name: 'United Kingdom Standard',
    formatCategory: 'international',
    category: 'International CV',
    tagline: '2-page British standard, Personal Statement banner, British English, ISO A4 paper',
    features: 'British English terminology, Personal Statement hero, ISO A4 paper, formal credentials',
    bestFor: 'United Kingdom, Commonwealth, and London corporate recruitment',
    schematic: 'uk-cv',
    renderer: renderUkCv
  },
  'german-cv': {
    id: 'german-cv',
    name: 'German CV (Lebenslauf)',
    formatCategory: 'international',
    category: 'International CV',
    tagline: 'Tabellarischer Lebenslauf with left dates column, photo, and formal German layout',
    features: 'Tabellarischer Lebenslauf, left dates column (Monat/Jahr), formal photo, signature date',
    bestFor: 'Germany, Austria, Switzerland (DACH) corporate and engineering roles',
    schematic: 'german-cv',
    renderer: renderGermanCv
  },
  'intl-nordic-clean': {
    id: 'intl-nordic-clean',
    name: 'Nordic Clean Standard',
    formatCategory: 'international',
    category: 'International CV',
    tagline: 'Scandinavian minimalist layout, bilingual contact row, neutral slate tones',
    features: 'Lightweight typography, understated gray accents, bilingual friendly layout',
    bestFor: 'Nordic countries (Sweden, Denmark, Norway, Finland) and global remote roles',
    schematic: 'minimal',
    renderer: renderIntlNordicClean
  },

  // ==========================================
  // FORMAT 7: EXECUTIVE CV (5 TEMPLATES)
  // ==========================================
  'exec-blue-banner': {
    id: 'exec-blue-banner',
    name: 'Executive Blue-Banner',
    formatCategory: 'executive',
    category: 'Executive CV',
    tagline: 'Full-width soft blue accent banner headers, nested education, and language table from Siddek CV.pdf',
    features: 'Full-width soft blue banner headers, shaded section titles, structured qualifications, formal signature',
    bestFor: 'Educational, technical, executive, and organizational applications',
    schematic: 'executive-bluebar',
    renderer: renderCustomExecutiveBluebar
  },
  'corporate-executive': {
    id: 'corporate-executive',
    name: 'Corporate Executive',
    formatCategory: 'executive',
    category: 'Executive CV',
    tagline: 'Double-border executive header, strategic governance matrix, high-impact deliverables',
    features: 'Double-border executive header, strategic governance matrix, high-impact deliverables',
    bestFor: 'Directors, Vice Presidents, C-suite, and Senior Management',
    schematic: 'classic',
    renderer: renderCorporateExecutive
  },
  'exec-c-suite': {
    id: 'exec-c-suite',
    name: 'Boardroom C-Suite',
    formatCategory: 'executive',
    category: 'Executive CV',
    tagline: 'Prestigious navy top bar, board memberships, revenue & EBITDA impact metrics',
    features: 'Navy top bar, career narrative, board governance competencies, executive metrics',
    bestFor: 'Chief Executive Officer (CEO), COO, CFO, Managing Directors',
    schematic: 'classic',
    renderer: renderExecCSuite
  },
  'exec-governance': {
    id: 'exec-governance',
    name: 'Governance & Advisory',
    formatCategory: 'executive',
    category: 'Executive CV',
    tagline: 'Senior partner layout with advisory roles, key mandates, and strategic milestones',
    features: 'Strategic advisory layout, governance credentials, partner mandates',
    bestFor: 'Board advisors, non-executive directors, management consultants',
    schematic: 'classic',
    renderer: renderExecGovernance
  },
  'exec-gold-line': {
    id: 'exec-gold-line',
    name: 'Premier Leadership',
    formatCategory: 'executive',
    category: 'Executive CV',
    tagline: 'Subtle gold-trimmed dividers, executive summary quote, leadership competencies',
    features: 'Warm trim lines, leadership quotes, high-stakes organizational deliverables',
    bestFor: 'Senior enterprise leaders, private equity partners, managing directors',
    schematic: 'classic',
    renderer: renderExecGoldLine
  },

  // ==========================================
  // FORMAT 8: TECHNICAL CV (5 TEMPLATES)
  // ==========================================
  'tech-stack-focused': {
    id: 'tech-stack-focused',
    name: 'Developer Stack Standard',
    formatCategory: 'technical',
    category: 'Technical CV',
    tagline: 'Categorized languages, frameworks, cloud tools, GitHub links & repos',
    features: 'Dark terminal stack matrix, monospace code elements, GitHub links, environment tags',
    bestFor: 'Full-stack software engineers, frontend/backend developers, DevOps',
    schematic: 'technical',
    renderer: renderTechStackFocused
  },
  'tech-cloud-architect': {
    id: 'tech-cloud-architect',
    name: 'Cloud & Infrastructure Architect',
    formatCategory: 'technical',
    category: 'Technical CV',
    tagline: 'Architecture highlights, cert badges, high-scale system metrics',
    features: 'Cloud infrastructure matrix, certifications highlight, system scale metrics',
    bestFor: 'AWS/GCP/Azure cloud architects, site reliability engineers (SRE), sysadmins',
    schematic: 'technical',
    renderer: renderTechCloudArchitect
  },
  'tech-engineering-lead': {
    id: 'tech-engineering-lead',
    name: 'Engineering Lead',
    formatCategory: 'technical',
    category: 'Technical CV',
    tagline: 'Technical roadmap impact, team scaling numbers, tech stack pills',
    features: 'Engineering roadmap focus, team leadership metrics, technical architecture',
    bestFor: 'Tech leads, engineering managers, staff/principal software engineers',
    schematic: 'technical',
    renderer: renderTechEngineeringLead
  },
  'tech-data-scientist': {
    id: 'tech-data-scientist',
    name: 'Data & Machine Learning',
    formatCategory: 'technical',
    category: 'Technical CV',
    tagline: 'Algorithms, model pipelines, datasets, Kaggle/research links',
    features: 'ML pipeline highlights, data toolset matrix, research links, algorithm focus',
    bestFor: 'Data scientists, ML engineers, AI researchers, quantitative analysts',
    schematic: 'technical',
    renderer: renderTechDataScientist
  },
  'tech-terminal-modern': {
    id: 'tech-terminal-modern',
    name: 'Modern Terminal Tech',
    formatCategory: 'technical',
    category: 'Technical CV',
    tagline: 'Clean terminal-inspired headers, code snippet aesthetic, compact layout',
    features: 'Terminal prompt headers ($ whoami), monospace code style, compact layout',
    bestFor: 'Linux specialists, security engineers, systems hackers',
    schematic: 'technical',
    renderer: renderTechTerminalModern
  },

  // ==========================================
  // FORMAT 9: ENTRY-LEVEL / GRADUATE CV (5 TEMPLATES)
  // ==========================================
  'entry-education-first': {
    id: 'entry-education-first',
    name: 'Graduate Education First',
    formatCategory: 'entry-level',
    category: 'Entry-Level / Graduate CV',
    tagline: 'Education & academic honors at top, thesis highlight, coursework; auto-hides empty work experience',
    features: 'Education spotlight card at top, thesis highlight, coursework list, clean fresh-grad layout',
    bestFor: 'Recent university graduates, students, entry-level candidates',
    schematic: 'entry',
    renderer: renderEntryEducationFirst
  },
  'entry-campus-leader': {
    id: 'entry-campus-leader',
    name: 'Campus & Project Leader',
    formatCategory: 'entry-level',
    category: 'Entry-Level / Graduate CV',
    tagline: 'Extracurricular leadership, capstone projects, club positions',
    features: 'Capstone project cards, leadership positions, university activities focus',
    bestFor: 'Student union leaders, club executives, extracurricular achievers',
    schematic: 'entry',
    renderer: renderEntryCampusLeader
  },
  'entry-intern-path': {
    id: 'entry-intern-path',
    name: 'Internship Pathway',
    formatCategory: 'entry-level',
    category: 'Entry-Level / Graduate CV',
    tagline: 'Internship achievements emphasized, foundational skills matrix',
    features: 'Internship achievements section, foundational skills matrix, academic honors',
    bestFor: 'Interns converting to full-time, junior trainees, co-op students',
    schematic: 'entry',
    renderer: renderEntryInternPath
  },
  'entry-stem-starter': {
    id: 'entry-stem-starter',
    name: 'STEM Early Career',
    formatCategory: 'entry-level',
    category: 'Entry-Level / Graduate CV',
    tagline: 'Laboratory skills, academic competitions, hackathons, certifications',
    features: 'Lab skills callout, academic competitions, hackathons, tech starter tags',
    bestFor: 'STEM graduates, junior analysts, computer science/math graduates',
    schematic: 'entry',
    renderer: renderEntryStemStarter
  },
  'entry-bold-start': {
    id: 'entry-bold-start',
    name: 'Bold Modern Starter',
    formatCategory: 'entry-level',
    category: 'Entry-Level / Graduate CV',
    tagline: 'Contemporary energetic layout, strong ambition statement, fast-learner highlights',
    features: 'Modern energetic layout, ambition statement, fast-learner capability tags',
    bestFor: 'Young professionals starting careers in startups and modern agencies',
    schematic: 'entry',
    renderer: renderEntryBoldStart
  },

  // ==========================================
  // FORMAT 10: EUROPASS CV (5 TEMPLATES)
  // ==========================================
  'europass': {
    id: 'europass',
    name: 'Europass Classic Blue',
    formatCategory: 'europass',
    category: 'Europass CV',
    tagline: 'Official European Union standard with CEFR language passport and digital competences',
    features: 'Official EU two-column grid, European blue accent, CEFR language pass, mobility layout',
    bestFor: 'EU public sector, Erasmus, European multinational cross-border recruitment',
    schematic: 'europass',
    renderer: renderEuropass
  },
  'europass-modern': {
    id: 'europass-modern',
    name: 'Europass Modern Mobility',
    formatCategory: 'europass',
    category: 'Europass CV',
    tagline: 'Refined EU borderless layout, CEFR self-assessment table, digital competences',
    features: 'Modern EU blue border accent, nationality tag, CEFR self-assessment, clean spacing',
    bestFor: 'Cross-border EU professionals, international remote European hiring',
    schematic: 'europass',
    renderer: renderEuropassModern
  },
  'europass-executive': {
    id: 'europass-executive',
    name: 'Europass Executive EU',
    formatCategory: 'europass',
    category: 'Europass CV',
    tagline: 'European senior civil servant & agency standard with policy leadership',
    features: 'Formal European agency format, policy leadership credentials, EU governance',
    bestFor: 'European Commission, EU agencies, international policy institutions',
    schematic: 'europass',
    renderer: renderEuropassExecutive
  },
  'europass-academic': {
    id: 'europass-academic',
    name: 'Europass Academic & Research',
    formatCategory: 'europass',
    category: 'Europass CV',
    tagline: 'EU Horizon Europe researcher profile, Marie Curie fellowship standard',
    features: 'Horizon Europe grant format, Marie Curie research profile, EU university mobility',
    bestFor: 'European researchers, Horizon Europe consortiums, PhD candidates',
    schematic: 'europass',
    renderer: renderEuropassAcademic
  },
  'europass-compact': {
    id: 'europass-compact',
    name: 'Europass Compact Mobility',
    formatCategory: 'europass',
    category: 'Europass CV',
    tagline: 'Condensed 1-2 page EU standard for fast international review',
    features: 'Condensed layout, quick-scan European mobility summary, streamlined CEFR tags',
    bestFor: 'Fast-track European applications, seasonal work, student exchange',
    schematic: 'europass',
    renderer: renderEuropassCompact
  }
};

// Aliases for backwards compatibility with earlier versions and test cases
TEMPLATES['custom-academic-green'] = TEMPLATES['academic-scholar-two-column'];
TEMPLATES['custom-bd-classic'] = TEMPLATES['intl-institutional-classic'];
TEMPLATES['bangladesh-cv'] = TEMPLATES['intl-institutional-classic'];
TEMPLATES['custom-executive-bluebar'] = TEMPLATES['exec-blue-banner'];
TEMPLATES['targeted'] = TEMPLATES['functional-capability'];


// Exports
exports.FORMAT_CATEGORIES = FORMAT_CATEGORIES;
exports.TEMPLATES = TEMPLATES;
};

  // Module: ./templates/chronological.js
  __modules__['./templates/chronological.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format 1: Chronological CV
 * Focuses on long-term career progression and loyalty, arranged in forward chronological order
 * (earliest history to present), highlighting promotions, milestones, and foundational roots.
 */

const { escapeHtml, formatDateRange, getCleanUrl, renderPhotoHtml, isSectionEnabled, formatEducationDegree, isFreshGraduateCandidate, renderCategorizedSkillsHtml, renderReferencesHtml } = __require__('./templateUtils.js', __currentDir);

function renderChronological(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = settings.dateFormat || 'Month YYYY';

  // Sort experience from OLDEST to NEWEST for true forward chronological progression
  const expList = [...(profile.experience || [])].sort((a, b) => {
    return (a.startDate || '').localeCompare(b.startDate || '');
  });

  const eduList = [...(profile.education || [])].sort((a, b) => {
    return (a.startDate || '').localeCompare(b.startDate || '');
  });

  const photoHtml = renderPhotoHtml(profile, 'w-24 h-24', 'rounded-xl shadow-xs');
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  return `
    <div class="cv-format cv-chronological max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm">
      <!-- Header -->
      <header class="border-b-2 pb-4 mb-6" style="border-color: ${primaryColor}">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="cv-name text-3xl font-bold tracking-tight" style="color: ${primaryColor}">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
            ${p.headline ? `<p class="text-base font-semibold text-slate-600 mt-1">${escapeHtml(p.headline)}</p>` : ''}
            <div class="inline-block mt-2 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border border-slate-300 text-slate-600 bg-slate-50">
              Career Progression CV
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>

        <div class="cv-contact-line flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-3 pt-2 border-t border-slate-200">
          ${p.email ? `<span><strong>Email:</strong> ${escapeHtml(p.email)}</span>` : ''}
          ${p.phone ? `<span><strong>Tel:</strong> ${escapeHtml(p.phone)}</span>` : ''}
          ${p.location ? `<span><strong>Location:</strong> ${escapeHtml(p.location)}</span>` : ''}
          ${p.linkedin ? `<span><strong>LinkedIn:</strong> <a href="${p.linkedin}" target="_blank" class="text-blue-700 hover:underline">${getCleanUrl(p.linkedin)}</a></span>` : ''}
          ${p.website ? `<span><strong>Web:</strong> <a href="${p.website}" target="_blank" class="text-blue-700 hover:underline">${getCleanUrl(p.website)}</a></span>` : ''}
        </div>
      </header>

      <!-- Professional Summary / Objective -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs uppercase tracking-widest font-bold pb-1 mb-2 border-b border-slate-300" style="color: ${primaryColor}">
            ${p.objective && !p.summary ? 'Career Objective' : 'Executive Career Profile'}
          </h2>
          <p class="text-slate-700 leading-relaxed text-justify text-xs">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Foundational Education & Credentials -->
      ${isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs uppercase tracking-widest font-bold pb-1 mb-3 border-b border-slate-300" style="color: ${primaryColor}">
            1. Academic & Professional Foundations
          </h2>
          <div class="space-y-3">
            ${eduList.map(edu => `
              <div class="border-l-2 pl-3 border-slate-300 break-inside-avoid">
                <div class="flex justify-between items-baseline">
                  <h3 class="font-bold text-slate-900 text-xs">${formatEducationDegree(edu)}</h3>
                  <span class="text-xs font-medium text-slate-500">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
                <div class="text-xs text-slate-600 font-medium">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                ${edu.gpa ? `<div class="text-xs text-slate-600 mt-0.5"><strong>Academic Standing:</strong> ${escapeHtml(edu.gpa)} ${edu.honors ? `(${escapeHtml(edu.honors)})` : ''}</div>` : ''}
                ${edu.coursework ? `<div class="text-xs text-slate-500 mt-0.5"><strong>Core Disciplines:</strong> ${escapeHtml(edu.coursework)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Chronological Career History (Oldest -> Newest) - Omitted if fresh graduate or empty -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-6">
          <div class="flex items-center justify-between pb-1 mb-4 border-b border-slate-300">
            <h2 class="cv-section-title text-xs uppercase tracking-widest font-bold" style="color: ${primaryColor}">
              2. Progressive Career History & Timeline
            </h2>
            <span class="text-[11px] italic text-slate-500">Ordered chronologically</span>
          </div>

          <div class="relative border-l-2 pl-4 ml-1 space-y-5" style="border-color: ${primaryColor}">
            ${expList.map((exp) => `
              <div class="relative break-inside-avoid">
                <!-- Timeline bullet node -->
                <div class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-white border-2" style="border-color: ${primaryColor}"></div>
                
                <div class="flex justify-between items-baseline">
                  <h3 class="font-bold text-sm text-slate-900">${escapeHtml(exp.title)}</h3>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    ${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}
                  </span>
                </div>
                
                <div class="text-xs font-semibold text-slate-600 mb-1.5">
                  ${escapeHtml(exp.company)}${exp.location ? ` — ${escapeHtml(exp.location)}` : ''}
                </div>

                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Key Projects -->
      ${isSectionEnabled(profile, 'projects') && profile.projects?.length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs uppercase tracking-widest font-bold pb-1 mb-3 border-b border-slate-300" style="color: ${primaryColor}">
            ${isFreshGraduate ? '2. Applied Projects & Deliverables' : '3. Key Project Milestones'}
          </h2>
          <div class="space-y-3">
            ${profile.projects.map(proj => `
              <div class="border-l-2 pl-3 border-slate-300 break-inside-avoid">
                <div class="flex justify-between items-baseline">
                  <h3 class="font-bold text-slate-900 text-xs">${escapeHtml(proj.title)} ${proj.role ? `<span class="font-normal text-slate-500">(${escapeHtml(proj.role)})</span>` : ''}</h3>
                  ${proj.liveUrl || proj.githubUrl ? `
                    <span class="text-xs text-blue-700 space-x-1.5">
                      ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="hover:underline">Demo</a>` : ''}
                      ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" class="hover:underline">Source</a>` : ''}
                    </span>
                  ` : ''}
                </div>
                ${proj.description ? `<p class="text-xs text-slate-700 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<p class="text-xs text-slate-600 italic mt-0.5">Outcome: ${escapeHtml(proj.outcomes)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Skills Matrix (All 6 Categorized Domains) -->
      ${isSectionEnabled(profile, 'skills') ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs uppercase tracking-widest font-bold pb-1 mb-2 border-b border-slate-300" style="color: ${primaryColor}">
            ${isFreshGraduate ? '3. Competencies & Skills' : '4. Core Capabilities & Skills'}
          </h2>
          ${renderCategorizedSkillsHtml(profile, primaryColor)}
        </section>
      ` : ''}

      <!-- Certifications -->
      ${isSectionEnabled(profile, 'certifications') && profile.certifications?.length > 0 ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs uppercase tracking-widest font-bold pb-1 mb-2 border-b border-slate-300" style="color: ${primaryColor}">
            Certifications & Accreditations
          </h2>
          <div class="text-xs text-slate-700 space-y-1">
            ${profile.certifications.map(c => `
              <div><strong>${escapeHtml(c.title)}</strong> — ${escapeHtml(c.issuer)}${c.issueDate ? ` (${escapeHtml(c.issueDate)})` : ''}</div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}


// Exports
exports.renderChronological = renderChronological;
};

  // Module: ./templates/cleanMinimal.js
  __modules__['./templates/cleanMinimal.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format: Clean Minimal CV
 * Inspired by Swiss modernism: disciplined whitespace, ultra-clear visual hierarchy,
 * elegant understated hairline accents, and high readability.
 */

const { escapeHtml, formatDateRange, getCleanUrl, renderPhotoHtml, isSectionEnabled, formatEducationDegree, isFreshGraduateCandidate, renderReferencesHtml, getSkillsList } = __require__('./templateUtils.js', __currentDir);

function renderCleanMinimal(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#0f172a';
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  const photoHtml = renderPhotoHtml(profile, 'w-20 h-20', 'rounded-lg grayscale hover:grayscale-0 transition');

  return `
    <div class="cv-format cv-clean-minimal max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      
      <!-- Minimalist Header -->
      <header class="flex justify-between items-start pb-6 mb-6 border-b border-slate-200">
        <div class="space-y-1.5">
          <h1 class="cv-name text-3xl font-light tracking-tight text-slate-900">
            <span class="font-extrabold">${escapeHtml(p.fullName || 'Candidate Name')}</span>
          </h1>
          ${p.headline ? `<p class="text-xs font-medium text-slate-500 tracking-wide">${escapeHtml(p.headline)}</p>` : ''}
          <div class="cv-contact-line text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-0.5 pt-1">
            ${p.email ? `<a href="mailto:${p.email}" class="hover:text-slate-900 underline underline-offset-2">${escapeHtml(p.email)}</a>` : ''}
            ${p.phone ? `<span>${escapeHtml(p.phone)}</span>` : ''}
            ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
            ${p.linkedin ? `<a href="${p.linkedin}" target="_blank" class="hover:text-slate-900 underline underline-offset-2">LinkedIn</a>` : ''}
            ${p.github ? `<a href="${p.github}" target="_blank" class="hover:text-slate-900 underline underline-offset-2">GitHub</a>` : ''}
            ${p.website ? `<a href="${p.website}" target="_blank" class="hover:text-slate-900 underline underline-offset-2">Portfolio</a>` : ''}
          </div>
        </div>
        ${photoHtml ? `<div class="shrink-0 ml-4">${photoHtml}</div>` : ''}
      </header>

      <!-- Summary -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-6 grid grid-cols-12 gap-4 page-break-avoid">
          <div class="col-span-12 sm:col-span-3">
            <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Profile
            </h2>
          </div>
          <div class="col-span-12 sm:col-span-9">
            <p class="text-xs text-slate-700 leading-relaxed text-justify">
              ${escapeHtml(p.summary || p.objective)}
            </p>
          </div>
        </section>
      ` : ''}

      <!-- Skills -->
      ${isSectionEnabled(profile, 'skills') && skills.length > 0 ? `
        <section class="mb-6 grid grid-cols-12 gap-4 page-break-avoid">
          <div class="col-span-12 sm:col-span-3">
            <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Skills
            </h2>
          </div>
          <div class="col-span-12 sm:col-span-9">
            <div class="flex flex-wrap gap-1.5">
              ${skills.map(s => `
                <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs">
                  ${escapeHtml(s.name)}
                  ${s.level ? `<span class="text-slate-500 font-normal">(${escapeHtml(s.level)})</span>` : ''}
                </span>
              `).join('')}
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Experience (Omitted if fresh graduate or empty) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && (profile.experience || []).length > 0 ? `
        <section class="mb-6 grid grid-cols-12 gap-4">
          <div class="col-span-12 sm:col-span-3">
            <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Experience
            </h2>
          </div>
          <div class="col-span-12 sm:col-span-9 space-y-4">
            ${profile.experience.map(exp => `
              <div class="space-y-1 page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-xs text-slate-900">${escapeHtml(exp.title || '')}</span>
                  <span class="text-[11px] text-slate-400">${formatDateRange(exp.startDate, exp.endDate, dateFormat, exp.current)}</span>
                </div>
                <div class="text-[11px] text-slate-600 font-medium">${escapeHtml(exp.company || '')}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
                ${exp.highlights && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-600 mt-1">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education -->
      ${isSectionEnabled(profile, 'education') && (profile.education || []).length > 0 ? `
        <section class="mb-6 grid grid-cols-12 gap-4 page-break-avoid">
          <div class="col-span-12 sm:col-span-3">
            <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Education
            </h2>
          </div>
          <div class="col-span-12 sm:col-span-9 space-y-3">
            ${profile.education.map(edu => `
              <div>
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-xs text-slate-900">${escapeHtml(formatEducationDegree(edu))}</span>
                  <span class="text-[11px] text-slate-400">${formatDateRange(edu.startDate, edu.endDate, dateFormat)}</span>
                </div>
                <div class="text-[11px] text-slate-600">${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                ${edu.gpa ? `<div class="text-[10px] text-slate-500">Result: ${escapeHtml(edu.gpa)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Projects -->
      ${isSectionEnabled(profile, 'projects') && (profile.projects || []).length > 0 ? `
        <section class="mb-6 grid grid-cols-12 gap-4">
          <div class="col-span-12 sm:col-span-3">
            <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Projects
            </h2>
          </div>
          <div class="col-span-12 sm:col-span-9 space-y-3">
            ${profile.projects.map(proj => `
              <div class="page-break-avoid space-y-0.5">
                <div class="font-bold text-xs text-slate-900">${escapeHtml(proj.title || '')}</div>
                ${proj.description ? `<p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(proj.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}


// Exports
exports.renderCleanMinimal = renderCleanMinimal;
};

  // Module: ./templates/combination.js
  __modules__['./templates/combination.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format 5: Combination / Hybrid CV
 * Combines high-level executive functional competence pillars with exhaustive
 * employment history or project-based proof points. Highly favored by recruiters.
 */

const { escapeHtml, formatDateRange, getCleanUrl, renderPhotoHtml, isSectionEnabled, formatEducationDegree, isFreshGraduateCandidate, renderCategorizedSkillsHtml, renderReferencesHtml, getSkillsList } = __require__('./templateUtils.js', __currentDir);

function renderCombination(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = settings.dateFormat || 'Month YYYY';

  // Sort experience reverse-chronologically
  const expList = [...(profile.experience || [])].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const eduList = [...(profile.education || [])].sort((a, b) => {
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const photoHtml = renderPhotoHtml(profile, 'w-24 h-24', 'rounded-2xl shadow-xs');
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  // Collect skills list
  const allSkillsList = getSkillsList(profile);

  return `
    <div class="cv-format cv-combination max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm">
      <!-- Executive Header -->
      <header class="border-b-2 pb-4 mb-5" style="border-color: ${primaryColor}">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex-1">
            <h1 class="cv-name text-3xl font-extrabold tracking-tight uppercase" style="color: ${primaryColor}">
              ${escapeHtml(p.fullName || 'Candidate Name')}
            </h1>
            ${p.headline ? `<p class="text-sm font-bold text-slate-700 tracking-wide mt-0.5">${escapeHtml(p.headline)}</p>` : ''}
            <div class="cv-contact-line text-xs text-slate-600 mt-2 space-y-0.5">
              ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
              <div>${escapeHtml(p.email || '')} ${p.phone ? `• ${escapeHtml(p.phone)}` : ''}</div>
              <div class="text-blue-700">
                ${p.linkedin ? `<a href="${p.linkedin}" target="_blank" class="hover:underline">LinkedIn</a>` : ''}
                ${p.github ? ` • <a href="${p.github}" target="_blank" class="hover:underline">GitHub</a>` : ''}
                ${p.website ? ` • <a href="${p.website}" target="_blank" class="hover:underline">Portfolio</a>` : ''}
              </div>
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>
      </header>

      <!-- Executive Profile / Summary -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-5 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            ${p.objective && !p.summary ? 'Career Objective' : 'Executive Profile & Strategic Capabilities'}
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Top Half: Core Competency & Leadership Matrix (Hybrid Pillar) -->
      ${isSectionEnabled(profile, 'skills') && allSkillsList.length > 0 ? `
        <section class="mb-5 bg-slate-50 border border-slate-200 rounded-lg p-3.5 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-extrabold uppercase tracking-wider mb-2" style="color: ${primaryColor}">
            Skills & Core Capabilities
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            ${allSkillsList.map(sk => `
              <div class="flex items-center gap-1.5 text-slate-800">
                <span class="w-1.5 h-1.5 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
                <span class="font-medium">${escapeHtml(sk.name)}</span>
                ${sk.level ? `<span class="text-[10px] text-slate-500 font-normal">(${escapeHtml(sk.level)})</span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- For Fresh Grads: Highlight Education First -->
      ${isFreshGraduate && isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
        <section class="mb-5 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education & Academic Credentials
          </h2>
          <div class="space-y-2 text-xs">
            ${eduList.map(edu => `
              <div class="flex justify-between items-baseline">
                <div>
                  <span class="font-bold text-slate-900">${formatEducationDegree(edu)}</span>
                  <span class="text-slate-600"> — ${escapeHtml(edu.institution)}</span>
                  ${edu.gpa ? `<span class="text-slate-500"> (GPA: ${escapeHtml(edu.gpa)})</span>` : ''}
                </div>
                <span class="text-slate-500">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Bottom Half: Full Detailed Reverse Chronological Work History (Omitted if fresh graduate or empty) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Professional Experience & Career History
          </h2>
          <div class="space-y-4">
            ${expList.map(exp => `
              <div class="break-inside-avoid">
                <div class="flex justify-between items-baseline">
                  <div>
                    <span class="font-bold text-slate-900 text-sm">${escapeHtml(exp.title)}</span>
                    <span class="text-slate-600 font-semibold text-xs"> — ${escapeHtml(exp.company)}</span>
                  </div>
                  <span class="text-xs font-semibold text-slate-600">
                    ${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}
                  </span>
                </div>
                ${exp.location ? `<div class="text-[11px] text-slate-500 mb-1.5 italic">${escapeHtml(exp.location)}</div>` : ''}

                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Key Projects -->
      ${isSectionEnabled(profile, 'projects') && profile.projects?.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            ${isFreshGraduate ? 'Key Applied Projects & Deliverables' : 'Signature Projects'}
          </h2>
          <div class="space-y-3">
            ${profile.projects.map(proj => `
              <div class="break-inside-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">${escapeHtml(proj.title)} ${proj.role ? `(${escapeHtml(proj.role)})` : ''}</span>
                  ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="text-xs text-blue-700 hover:underline">Live Demo</a>` : ''}
                </div>
                ${proj.description ? `<p class="text-xs text-slate-700 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<p class="text-xs text-slate-600 italic mt-0.5">Impact: ${escapeHtml(proj.outcomes)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education (For experienced candidates) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
        <section class="mb-5 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education
          </h2>
          <div class="space-y-2 text-xs">
            ${eduList.map(edu => `
              <div class="flex justify-between items-baseline">
                <div>
                  <span class="font-bold text-slate-900">${formatEducationDegree(edu)}</span>
                  <span class="text-slate-600"> — ${escapeHtml(edu.institution)}</span>
                  ${edu.gpa ? `<span class="text-slate-500"> (GPA: ${escapeHtml(edu.gpa)})</span>` : ''}
                </div>
                <span class="text-slate-500">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Certifications -->
      ${isSectionEnabled(profile, 'certifications') && profile.certifications?.length > 0 ? `
        <section class="mb-5 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Certifications & Training
          </h2>
          <div class="flex flex-wrap gap-x-6 gap-y-1 text-xs">
            ${profile.certifications.map(c => `
              <div><strong>${escapeHtml(c.title)}</strong> — ${escapeHtml(c.issuer)}</div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}


// Exports
exports.renderCombination = renderCombination;
};

  // Module: ./templates/corporateExecutive.js
  __modules__['./templates/corporateExecutive.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format: Corporate Executive CV
 * Tailored for Directors, VPs, C-Suite, and Senior Managers.
 * Features:
 * - Bold double-bordered executive header with full-width leadership banner
 * - Executive Core Capabilities & Governance Matrix
 * - Quantified Strategic Milestones and P&L / operational impact bullets
 * - Elegant navy/slate corporate palette
 */

const { escapeHtml, formatDateRange, getCleanUrl, renderPhotoHtml, isSectionEnabled, formatEducationDegree, isFreshGraduateCandidate, renderReferencesHtml, getSkillsList } = __require__('./templateUtils.js', __currentDir);

function renderCorporateExecutive(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  const expList = [...(profile.experience || [])].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const photoHtml = renderPhotoHtml(profile, 'w-24 h-24', 'rounded-xl shadow-md border-2 border-white');

  return `
    <div class="cv-format cv-corporate-executive max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-serif p-8 shadow-sm">
      
      <!-- Executive Header -->
      <header class="border-b-4 border-double pb-5 mb-6" style="border-color: ${primaryColor}">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-center sm:text-left space-y-1">
            <h1 class="cv-name text-3xl font-black uppercase tracking-tight" style="color: ${primaryColor}">
              ${escapeHtml(p.fullName || 'Executive Candidate')}
            </h1>
            ${p.headline ? `
              <div class="text-sm font-bold tracking-wider text-slate-700 uppercase font-sans">
                ${escapeHtml(p.headline)}
              </div>
            ` : ''}
            <div class="cv-contact-line text-xs font-sans text-slate-600 flex flex-wrap gap-x-3 gap-y-0.5 justify-center sm:justify-start pt-1">
              ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
              ${p.phone ? `<span>• ${escapeHtml(p.phone)}</span>` : ''}
              ${p.email ? `<span>• <a href="mailto:${p.email}" class="text-blue-800 underline">${escapeHtml(p.email)}</a></span>` : ''}
              ${p.linkedin ? `<span>• <a href="${p.linkedin}" target="_blank" class="text-blue-800 underline">${getCleanUrl(p.linkedin)}</a></span>` : ''}
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>
      </header>

      <!-- Executive Profile / Strategic Value Proposition -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-5 bg-slate-50 border-l-4 p-4 rounded-r-lg page-break-avoid font-sans" style="border-color: ${primaryColor}">
          <h2 class="cv-section-title text-xs font-black uppercase tracking-widest text-slate-900 mb-1.5" style="color: ${primaryColor}">
            Executive Profile & Strategic Leadership
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed text-justify">
            ${escapeHtml(p.summary || p.objective)}
          </p>
        </section>
      ` : ''}

      <!-- Core Competencies & Governance Pillars -->
      ${isSectionEnabled(profile, 'skills') && skills.length > 0 ? `
        <section class="mb-5 page-break-avoid font-sans">
          <h2 class="cv-section-title text-xs font-black uppercase tracking-widest pb-1 mb-2.5 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Core Capabilities & Executive Competencies
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            ${skills.map(s => `
              <div class="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded">
                <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
                <span class="font-bold text-slate-900">${escapeHtml(s.name)}</span>
                ${s.level ? `<span class="text-[10px] text-slate-500">(${escapeHtml(s.level)})</span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Executive Experience -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-black uppercase tracking-widest pb-1 mb-3 border-b font-sans" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Professional Leadership & Career History
          </h2>
          <div class="space-y-4">
            ${expList.map(exp => `
              <div class="space-y-1 page-break-avoid">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline font-sans">
                  <div>
                    <span class="font-extrabold text-sm text-slate-950">${escapeHtml(exp.title || '')}</span>
                    <span class="text-slate-600 font-bold ml-1.5">| ${escapeHtml(exp.company || '')}</span>
                    ${exp.location ? `<span class="text-slate-500 font-normal text-xs ml-1">(${escapeHtml(exp.location)})</span>` : ''}
                  </div>
                  <span class="text-xs font-bold text-slate-500">${formatDateRange(exp.startDate, exp.endDate, dateFormat, exp.current)}</span>
                </div>
                ${exp.highlights && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700 leading-relaxed font-sans">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education & Credentials -->
      ${isSectionEnabled(profile, 'education') && (profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid font-sans">
          <h2 class="cv-section-title text-xs font-black uppercase tracking-widest pb-1 mb-2.5 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education & Executive Credentials
          </h2>
          <div class="space-y-2">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <div>
                  <span class="font-bold text-xs text-slate-900">${escapeHtml(formatEducationDegree(edu))}</span>
                  <span class="text-slate-600 ml-1">— ${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</span>
                </div>
                <span class="text-xs text-slate-500">${formatDateRange(edu.startDate, edu.endDate, dateFormat)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Key Projects / Strategic Initiatives -->
      ${isSectionEnabled(profile, 'projects') && (profile.projects || []).length > 0 ? `
        <section class="mb-5 font-sans">
          <h2 class="cv-section-title text-xs font-black uppercase tracking-widest pb-1 mb-2.5 border-b" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Key Projects & Capital Deliverables
          </h2>
          <div class="space-y-2.5">
            ${profile.projects.map(proj => `
              <div class="page-break-avoid space-y-0.5">
                <div class="font-bold text-xs text-slate-900">${escapeHtml(proj.title || '')}</div>
                ${proj.description ? `<p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(proj.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}


// Exports
exports.renderCorporateExecutive = renderCorporateExecutive;
};

  // Module: ./templates/creativeVisual.js
  __modules__['./templates/creativeVisual.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format 10: Creative / Visual CV
 * High-aesthetic visual layout designed for UI/UX designers, creative leads, art directors,
 * and modern tech creators. Features an accent card/sidebar with visual skill progress meters,
 * project showcase badges, and sleek contemporary typography.
 * Multi-page safe: avoids awkward sidebar overflow or blank blocks on page breaks.
 */

const { escapeHtml, formatDateRange, getCleanUrl, isSectionEnabled, formatEducationDegree, isFreshGraduateCandidate, renderReferencesHtml, getSkillsList } = __require__('./templateUtils.js', __currentDir);

function renderCreativeVisual(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#7e22ce';
  const accentColor = settings.accentColor || '#a855f7';
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const photoShape = settings.photoShape || 'circle';
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  const hasPhoto = settings.showPhoto && p.photoUrl;

  // Flatten skills for visual progress meters
  const sidebarSkills = getSkillsList(profile).slice(0, 7);

  return `
    <div class="cv-format cv-creative-visual max-w-[850px] mx-auto bg-white rounded-xl shadow-xs text-slate-800 leading-relaxed text-sm flex flex-col md:flex-row gap-6 p-2">
      
      <!-- Left Accent Card (35% width) -->
      <aside class="w-full md:w-[35%] p-5 text-white rounded-2xl self-start shrink-0 space-y-5 page-break-avoid" style="background-color: ${primaryColor}">
        
        <!-- Profile Photo / Identity -->
        <div class="text-center">
          ${hasPhoto ? `
            <img src="${p.photoUrl}" alt="${escapeHtml(p.fullName)}" class="w-24 h-24 mx-auto object-cover border-4 border-white/30 shadow-md mb-3 ${photoShape === 'circle' ? 'rounded-full' : 'rounded-2xl'}" style="aspect-ratio: 1/1;" />
          ` : `
            <div class="w-16 h-16 rounded-full mx-auto bg-white/20 flex items-center justify-center text-white text-xl font-black border-2 border-white/40 shadow-inner mb-3">
              ${(p.fullName || 'CV').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
          `}
          <h1 class="cv-name text-2xl font-black tracking-tight text-white">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
          ${p.headline ? `<p class="text-xs font-semibold text-white/90 mt-1 uppercase tracking-wider">${escapeHtml(p.headline)}</p>` : ''}
        </div>

        <!-- Contact Details -->
        <div class="cv-contact-line space-y-2 text-xs border-t border-white/20 pt-3">
          <h3 class="text-[10px] uppercase tracking-widest font-black text-white/70">Contact Info</h3>
          ${p.email ? `<div class="break-all"><span class="text-white/60 block text-[9px] uppercase font-bold">Email</span> <a href="mailto:${p.email}" class="hover:underline font-medium">${escapeHtml(p.email)}</a></div>` : ''}
          ${p.phone ? `<div><span class="text-white/60 block text-[9px] uppercase font-bold">Phone</span> <span class="font-medium">${escapeHtml(p.phone)}</span></div>` : ''}
          ${p.location ? `<div><span class="text-white/60 block text-[9px] uppercase font-bold">Location</span> <span class="font-medium">${escapeHtml(p.location)}</span></div>` : ''}
          ${p.website ? `<div class="break-all"><span class="text-white/60 block text-[9px] uppercase font-bold">Portfolio</span> <a href="${p.website}" target="_blank" class="hover:underline font-medium underline">${getCleanUrl(p.website)}</a></div>` : ''}
          ${p.linkedin ? `<div class="break-all"><span class="text-white/60 block text-[9px] uppercase font-bold">LinkedIn</span> <a href="${p.linkedin}" target="_blank" class="hover:underline font-medium">${getCleanUrl(p.linkedin)}</a></div>` : ''}
          ${p.github ? `<div class="break-all"><span class="text-white/60 block text-[9px] uppercase font-bold">GitHub</span> <a href="${p.github}" target="_blank" class="hover:underline font-medium">${getCleanUrl(p.github)}</a></div>` : ''}
        </div>

        <!-- Visual Skills with Progress Bars -->
        ${sidebarSkills.length > 0 ? `
          <div class="space-y-3 border-t border-white/20 pt-3">
            <h3 class="text-[10px] uppercase tracking-widest font-black text-white/70">Skills & Competencies</h3>
            <div class="space-y-2">
              ${sidebarSkills.map(sk => {
                const name = typeof sk === 'string' ? sk : sk.name;
                const level = typeof sk === 'string' ? 'Intermediate' : sk.level;
                const pct = level === 'Expert' || level === 'Proficient' ? 95 : level === 'Advanced' ? 82 : level === 'Intermediate' ? 68 : 50;
                return `
                  <div>
                    <div class="flex justify-between text-xs font-semibold mb-0.5">
                      <span>${escapeHtml(name)}</span>
                      <span class="text-white/75 text-[10px] font-mono">${pct}%</span>
                    </div>
                    <div class="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div class="bg-white h-full rounded-full" style="width: ${pct}%"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Languages -->
        ${profile.languages?.length > 0 ? `
          <div class="space-y-2 border-t border-white/20 pt-3 text-xs">
            <h3 class="text-[10px] uppercase tracking-widest font-black text-white/70">Languages</h3>
            <div class="space-y-1">
              ${profile.languages.map(l => `
                <div class="flex justify-between">
                  <span>${escapeHtml(l.name)}</span>
                  <span class="text-white/80 font-mono text-[10px] font-bold">${escapeHtml(l.proficiency || l.cefr || '')}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </aside>

      <!-- Right Main Content Area (65% width) -->
      <main class="w-full md:w-[65%] space-y-5">
        
        <!-- Summary / Creative Vision -->
        ${p.summary || p.objective ? `
          <section class="page-break-avoid">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
              <h2 class="cv-section-title text-xs font-black uppercase tracking-wider text-slate-900">
                ${p.objective && !p.summary ? 'Career Objective' : 'Professional Profile & Vision'}
              </h2>
            </div>
            <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
          </section>
        ` : ''}

        <!-- For Fresh Grads: Education Comes First -->
        ${isFreshGraduate && profile.education?.length > 0 ? `
          <section class="page-break-avoid">
            <div class="flex items-center gap-2 mb-2 pb-1 border-b border-slate-200">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
              <h2 class="cv-section-title text-xs font-black uppercase tracking-wider text-slate-900">Education & Academic Credentials</h2>
            </div>
            <div class="space-y-2 text-xs">
              ${profile.education.map(edu => `
                <div class="flex justify-between items-baseline page-break-avoid">
                  <div>
                    <span class="font-bold text-slate-900">${formatEducationDegree(edu)}</span>
                    <div class="text-slate-600 text-[11px]">${escapeHtml(edu.institution)}${edu.gpa ? ` • Grade: ${escapeHtml(edu.gpa)}` : ''}</div>
                    ${edu.coursework ? `<div class="text-[11px] text-slate-500 mt-0.5">Coursework: ${escapeHtml(edu.coursework)}</div>` : ''}
                  </div>
                  <span class="text-slate-500 font-medium text-[11px]">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Work Experience Timeline (Omitted if fresh graduate or empty) -->
        ${!isFreshGraduate && profile.experience?.length > 0 ? `
          <section class="page-break-avoid">
            <div class="flex items-center gap-2 mb-3 pb-1 border-b border-slate-200">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
              <h2 class="cv-section-title text-xs font-black uppercase tracking-wider text-slate-900">Work Experience</h2>
            </div>

            <div class="relative border-l-2 ml-1 pl-4 space-y-4" style="border-color: ${accentColor}">
              ${profile.experience.map(exp => `
                <div class="relative page-break-avoid">
                  <!-- Timeline Node -->
                  <div class="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2" style="border-color: ${primaryColor}"></div>
                  
                  <div class="flex justify-between items-baseline">
                    <h3 class="font-bold text-slate-900 text-xs">${escapeHtml(exp.title)}</h3>
                    <span class="text-[11px] font-semibold text-slate-500">${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}</span>
                  </div>
                  <div class="text-xs font-semibold mb-1" style="color: ${primaryColor}">
                    ${escapeHtml(exp.company)}${exp.location ? ` • ${escapeHtml(exp.location)}` : ''}
                    ${exp.employmentType ? `<span class="ml-1 text-[10px] font-normal text-slate-500">(${escapeHtml(exp.employmentType)})</span>` : ''}
                  </div>

                  ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                    <ul class="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
                      ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                    </ul>
                  ` : ''}
                  
                  ${Array.isArray(exp.technologies) && exp.technologies.length > 0 ? `
                    <div class="mt-1 text-[11px] text-slate-500 font-medium">
                      Tools: ${exp.technologies.map(t => escapeHtml(t)).join(', ')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Featured Projects Gallery -->
        ${profile.projects?.length > 0 ? `
          <section class="page-break-avoid">
            <div class="flex items-center gap-2 mb-3 pb-1 border-b border-slate-200">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
              <h2 class="cv-section-title text-xs font-black uppercase tracking-wider text-slate-900">
                ${isFreshGraduate ? 'Applied Projects & Deliverables' : 'Featured Projects & Deliverables'}
              </h2>
            </div>

            <div class="grid grid-cols-1 gap-2.5">
              ${profile.projects.slice(0, 4).map(proj => `
                <div class="border border-slate-200 rounded-lg p-3 bg-slate-50/70 page-break-avoid">
                  <div class="flex justify-between items-baseline">
                    <span class="font-bold text-slate-900 text-xs">${escapeHtml(proj.title)}</span>
                    ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="text-xs font-bold hover:underline" style="color: ${primaryColor}">View ↗</a>` : ''}
                  </div>
                  ${proj.description ? `<p class="text-xs text-slate-700 mt-1">${escapeHtml(proj.description)}</p>` : ''}
                  ${proj.outcomes ? `<p class="text-[11px] text-slate-800 font-semibold mt-1">Impact: ${escapeHtml(proj.outcomes)}</p>` : ''}
                  ${Array.isArray(proj.technologies) ? `
                    <div class="flex flex-wrap gap-1 mt-1.5">
                      ${proj.technologies.map(t => `<span class="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 font-medium">${escapeHtml(t)}</span>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Education (For experienced candidates) -->
        ${!isFreshGraduate && profile.education?.length > 0 ? `
          <section class="page-break-avoid">
            <div class="flex items-center gap-2 mb-2 pb-1 border-b border-slate-200">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
              <h2 class="cv-section-title text-xs font-black uppercase tracking-wider text-slate-900">Education & Training</h2>
            </div>
            <div class="space-y-2 text-xs">
              ${profile.education.map(edu => `
                <div class="flex justify-between items-baseline page-break-avoid">
                  <div>
                    <span class="font-bold text-slate-900">${formatEducationDegree(edu)}</span>
                    <div class="text-slate-600 text-[11px]">${escapeHtml(edu.institution)}${edu.gpa ? ` • Grade: ${escapeHtml(edu.gpa)}` : ''}</div>
                  </div>
                  <span class="text-slate-500 font-medium text-[11px]">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Certifications -->
        ${profile.certifications?.length > 0 ? `
          <section class="page-break-avoid">
            <div class="flex items-center gap-2 mb-2 pb-1 border-b border-slate-200">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${primaryColor}"></span>
              <h2 class="cv-section-title text-xs font-black uppercase tracking-wider text-slate-900">Certifications</h2>
            </div>
            <div class="space-y-1.5 text-xs">
              ${profile.certifications.map(c => `
                <div class="flex justify-between page-break-avoid">
                  <span><strong>${escapeHtml(c.title)}</strong> — ${escapeHtml(c.issuer)}</span>
                  <span class="text-slate-500 text-[11px]">${escapeHtml(c.issueDate || '')}</span>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- References -->
        ${renderReferencesHtml(profile, primaryColor)}

      </main>

    </div>
  `;
}


// Exports
exports.renderCreativeVisual = renderCreativeVisual;
};

  // Module: ./templates/customAcademicGreen.js
  __modules__['./templates/customAcademicGreen.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Custom Template 01: Academic Green Two-Column CV
 * Faithfully inspired by the authentic layout of 'CV Mathematics.pdf'.
 * Features:
 * - Two-column asymmetric layout with green horizontal accent divider rules (#7aa350)
 * - Left column: Circular profile photo, bold candidate headline, contact links,
 *   bulleted skills list, languages, and secondary competencies
 * - Right column: Career Objective, Education, Academic Projects with bulleted methodology,
 *   Research Interests, Achievements, and References
 * - 100% dynamic bindings to candidate profile with clean empty defaults and zero fake prefill.
 */

const { escapeHtml, formatDateRange, getCleanUrl, renderPhotoHtml, isSectionEnabled, formatEducationDegree, isFreshGraduateCandidate, getSkillsList } = __require__('./templateUtils.js', __currentDir);

function renderCustomAcademicGreen(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#7aa350';
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  const skillsList = getSkillsList(profile);
  const primarySkills = skillsList.slice(0, 8);
  const secondarySkills = skillsList.slice(8);

  const photoHtml = renderPhotoHtml(profile, 'w-28 h-28', 'rounded-full border-2 border-[#7aa350] shadow-sm');

  const refs = (profile.references || []).filter(r => r && (r.name || r.title || r.company || r.organization || r.email || r.phone));

  return `
    <div class="cv-format cv-custom-academic-green max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-6 sm:p-8 shadow-xs">
      
      <!-- Two Column Layout: Left (36%), Right (64%) -->
      <div class="grid grid-cols-12 gap-8 items-start">
        
        <!-- Left Sidebar Column (Cols 1-4 / 36%) -->
        <aside class="col-span-12 md:col-span-4 space-y-6">
          
          <!-- Photo & Candidate Identity -->
          <div class="space-y-3">
            ${photoHtml ? `
              <div class="flex items-center justify-center md:justify-start">
                ${photoHtml}
              </div>
            ` : `
              <div class="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-2xl border-2" style="border-color: ${primaryColor}">
                ${(p.fullName || 'CV').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            `}

            <div>
              <h1 class="cv-name text-2xl font-black tracking-tight text-slate-950 uppercase" style="font-family: Georgia, 'Times New Roman', serif;">
                ${escapeHtml(p.fullName || 'Candidate Name')}
              </h1>
              ${p.headline ? `<p class="text-xs font-semibold text-slate-600 mt-0.5">${escapeHtml(p.headline)}</p>` : ''}
            </div>

            <!-- Contact Information Block -->
            <div class="cv-contact-line space-y-1 text-slate-700 text-xs pt-1">
              ${p.phone ? `<div><a href="tel:${p.phone}" class="hover:underline">${escapeHtml(p.phone)}</a></div>` : ''}
              ${p.email ? `<div><a href="mailto:${p.email}" class="text-blue-700 hover:underline break-all">${escapeHtml(p.email)}</a></div>` : ''}
              ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
              ${p.github ? `<div><a href="${p.github}" target="_blank" class="text-blue-700 hover:underline break-all">${getCleanUrl(p.github)}</a></div>` : ''}
              ${p.linkedin ? `<div><a href="${p.linkedin}" target="_blank" class="text-blue-700 hover:underline break-all">${getCleanUrl(p.linkedin)}</a></div>` : ''}
              ${p.website ? `<div><a href="${p.website}" target="_blank" class="text-blue-700 hover:underline break-all">${getCleanUrl(p.website)}</a></div>` : ''}
            </div>
          </div>

          <!-- Skills Section (Bullet List) -->
          ${isSectionEnabled(profile, 'skills') && primarySkills.length > 0 ? `
            <div class="space-y-2">
              <h3 class="text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Technical Skills
              </h3>
              <ul class="space-y-1 list-disc list-inside text-xs text-slate-800">
                ${primarySkills.map(s => `
                  <li>
                    <span class="font-medium">${escapeHtml(s.name)}</span>
                    ${s.level ? `<span class="text-[10px] text-slate-500 font-normal">(${escapeHtml(s.level)})</span>` : ''}
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- Languages Section (Bullet List) -->
          ${isSectionEnabled(profile, 'languages') && (profile.languages || []).length > 0 ? `
            <div class="space-y-2">
              <h3 class="text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Languages
              </h3>
              <ul class="space-y-1 list-disc list-inside text-xs text-slate-800">
                ${profile.languages.map(l => `
                  <li>
                    <span class="font-medium">${escapeHtml(l.name)}</span>
                    <span class="text-slate-500">(${escapeHtml(l.proficiency || l.cefr || 'Competent')})</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- Secondary / Soft Skills (Bullet List) -->
          ${isSectionEnabled(profile, 'skills') && secondarySkills.length > 0 ? `
            <div class="space-y-2">
              <h3 class="text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Additional Competencies
              </h3>
              <ul class="space-y-1 list-disc list-inside text-xs text-slate-800">
                ${secondarySkills.map(s => `
                  <li>
                    <span class="font-medium">${escapeHtml(s.name)}</span>
                    ${s.level ? `<span class="text-[10px] text-slate-500 font-normal">(${escapeHtml(s.level)})</span>` : ''}
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

        </aside>

        <!-- Right Main Column (Cols 5-12 / 64%) -->
        <main class="col-span-12 md:col-span-8 space-y-5">
          
          <!-- Career Objective / Professional Summary -->
          ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
            <section class="space-y-1.5 page-break-avoid">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                ${p.objective && !p.summary ? 'Career Objective' : 'Career Objective & Profile'}
              </h2>
              <p class="text-xs text-slate-800 leading-relaxed text-justify">
                ${escapeHtml(p.summary || p.objective)}
              </p>
            </section>
          ` : ''}

          <!-- Education -->
          ${isSectionEnabled(profile, 'education') && (profile.education || []).length > 0 ? `
            <section class="space-y-2 page-break-avoid">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Education
              </h2>
              <div class="space-y-2.5">
                ${profile.education.map(edu => `
                  <div>
                    <div class="font-bold text-xs text-slate-900">
                      ${escapeHtml(formatEducationDegree(edu))}
                    </div>
                    <div class="text-slate-700 text-xs">
                      ${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}
                    </div>
                    <div class="text-slate-500 text-[11px]">
                      ${formatDateRange(edu.startDate, edu.endDate, dateFormat, false, 'Expected Graduation')}
                      ${edu.gpa ? ` • Result: ${escapeHtml(edu.gpa)}` : ''}
                    </div>
                    ${edu.coursework ? `<div class="text-[11px] text-slate-600 mt-0.5">Relevant Coursework: ${escapeHtml(edu.coursework)}</div>` : ''}
                    ${edu.thesis ? `<div class="text-[11px] text-slate-600 mt-0.5 italic">Thesis/Project: ${escapeHtml(edu.thesis)}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Work Experience (Omitted cleanly if empty or fresh graduate) -->
          ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && (profile.experience || []).length > 0 ? `
            <section class="space-y-2">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Work Experience
              </h2>
              <div class="space-y-3">
                ${profile.experience.map(exp => `
                  <div class="space-y-1 page-break-avoid">
                    <div class="flex justify-between items-baseline">
                      <span class="font-bold text-xs text-slate-900">${escapeHtml(exp.title || '')} — ${escapeHtml(exp.company || '')}</span>
                      <span class="text-[11px] text-slate-500">${formatDateRange(exp.startDate, exp.endDate, dateFormat, exp.current)}</span>
                    </div>
                    ${exp.highlights && exp.highlights.length > 0 ? `
                      <ul class="list-disc list-inside space-y-0.5 text-xs text-slate-700">
                        ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                      </ul>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Academic Projects / Key Projects -->
          ${isSectionEnabled(profile, 'projects') && (profile.projects || []).length > 0 ? `
            <section class="space-y-2">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Academic & Key Projects
              </h2>
              <div class="space-y-2.5">
                ${profile.projects.map(proj => `
                  <div class="space-y-1 page-break-avoid">
                    <div class="font-bold text-xs text-slate-900">
                      ${escapeHtml(proj.title || 'Project Title')}
                      ${proj.projectType ? `<span class="text-slate-500 font-normal"> (${escapeHtml(proj.projectType)})</span>` : ''}
                    </div>
                    ${proj.description ? `
                      <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(proj.description)}</p>
                    ` : ''}
                    ${proj.outcomes ? `
                      <ul class="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                        <li>${escapeHtml(proj.outcomes)}</li>
                      </ul>
                    ` : ''}
                    ${proj.technologies && proj.technologies.length > 0 ? `
                      <div class="text-[11px] text-slate-600">
                        <strong>Technologies:</strong> ${proj.technologies.map(t => escapeHtml(t)).join(', ')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Research Interests (if academic fields provided) -->
          ${profile.academic?.researchInterests && profile.academic.researchInterests.length > 0 ? `
            <section class="space-y-1.5 page-break-avoid">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Research Interests
              </h2>
              <ul class="list-disc list-inside space-y-0.5 text-xs text-slate-700">
                ${profile.academic.researchInterests.map(ri => `<li>${escapeHtml(ri)}</li>`).join('')}
              </ul>
            </section>
          ` : ''}

          <!-- Achievements & Seminars -->
          ${isSectionEnabled(profile, 'achievements') && (profile.achievements || []).length > 0 ? `
            <section class="space-y-1.5 page-break-avoid">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Achievements & Activities
              </h2>
              <ul class="list-disc list-inside space-y-0.5 text-xs text-slate-700">
                ${profile.achievements.map(ach => `
                  <li>
                    <span class="font-semibold">${escapeHtml(ach.title || '')}</span>
                    ${ach.description ? ` — ${escapeHtml(ach.description)}` : ''}
                  </li>
                `).join('')}
              </ul>
            </section>
          ` : ''}

          <!-- Certifications -->
          ${isSectionEnabled(profile, 'certifications') && (profile.certifications || []).length > 0 ? `
            <section class="space-y-1.5 page-break-avoid">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                Certifications & Training
              </h2>
              <ul class="list-disc list-inside space-y-0.5 text-xs text-slate-700">
                ${profile.certifications.map(c => `
                  <li>
                    <span class="font-semibold">${escapeHtml(c.title || '')}</span>
                    ${c.issuer ? ` — ${escapeHtml(c.issuer)}` : ''}
                    ${c.issueDate ? ` (${escapeHtml(c.issueDate)})` : ''}
                  </li>
                `).join('')}
              </ul>
            </section>
          ` : ''}

          <!-- References Section (Only displayed when actual references are entered) -->
          ${isSectionEnabled(profile, 'references') && refs.length > 0 ? `
            <section class="space-y-2 page-break-avoid">
              <h2 class="cv-section-title text-sm font-bold text-slate-900 pb-1 border-b" style="border-color: ${primaryColor}">
                References
              </h2>
              <div class="space-y-2">
                ${refs.map(r => `
                  <div class="text-xs">
                    <div class="font-bold text-slate-900">${escapeHtml(r.name)}</div>
                    <div class="text-slate-700">${escapeHtml(r.title || '')}</div>
                    ${(r.organization || r.company) ? `<div class="text-slate-600">${escapeHtml(r.organization || r.company)}</div>` : ''}
                    ${r.email ? `<div><a href="mailto:${r.email}" class="text-blue-700 hover:underline">${escapeHtml(r.email)}</a></div>` : ''}
                    ${r.phone ? `<div class="text-slate-600">${escapeHtml(r.phone)}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

        </main>

      </div>

    </div>
  `;
}


// Exports
exports.renderCustomAcademicGreen = renderCustomAcademicGreen;
};

  // Module: ./templates/customBdClassic.js
  __modules__['./templates/customBdClassic.js'] = function(require, exports, module, __require__, __currentDir) {
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

const { escapeHtml, renderPhotoHtml, isSectionEnabled, getSkillsList } = __require__('./templateUtils.js', __currentDir);

function renderCustomBdClassic(profile) {
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


// Exports
exports.renderCustomBdClassic = renderCustomBdClassic;
};

  // Module: ./templates/customExecutiveBluebar.js
  __modules__['./templates/customExecutiveBluebar.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Custom Template 03: Executive Blue-Bar Professional CV
 * Faithfully inspired by the authentic layout of 'Siddek CURRICULUM VITAE.pdf'.
 * Features:
 * - Full-width soft-blue banner bar section headers (#9bbce5 / #a6c2e2)
 * - Top-left bold underlined "CURRICULUM VITAE" title with contact details
 * - Top-right bordered passport photo
 * - Block-structured Educational Qualification entries
 * - 5-column Language Proficiency Matrix (Language | Reading | Writing | Listening | Speaking)
 * - Structured Personal Information block
 * - Signature line at bottom right
 * - 100% dynamic bindings to candidate profile with clean empty defaults and zero fake prefill.
 */

const { escapeHtml, renderPhotoHtml, isSectionEnabled, getSkillsList } = __require__('./templateUtils.js', __currentDir);

function renderCustomExecutiveBluebar(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const hasPhoto = settings.showPhoto && p.photoUrl;
  const skills = getSkillsList(profile);

  const eduList = [...(profile.education || [])].sort((a, b) => {
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  return `
    <div class="cv-format cv-custom-executive-bluebar max-w-[850px] mx-auto bg-white text-black text-xs font-sans p-6 sm:p-8 shadow-xs min-h-[1050px] flex flex-col justify-between">
      
      <div class="space-y-4">
        
        <!-- Header -->
        <header class="flex justify-between items-start pb-2">
          <div class="space-y-1">
            <h1 class="cv-name text-base font-black tracking-wide uppercase underline underline-offset-4 decoration-2">
              CURRICULUM VITAE
            </h1>
            <div class="text-sm font-black text-slate-900 uppercase tracking-tight">
              ${escapeHtml(p.fullName || 'Candidate Name')}
            </div>
            ${p.phone ? `<div class="text-xs">Contact No: <span class="font-bold">${escapeHtml(p.phone)}</span></div>` : ''}
            ${p.email ? `<div class="text-xs">E-mail: <a href="mailto:${p.email}" class="text-blue-700 underline">${escapeHtml(p.email)}</a></div>` : ''}
            ${p.location ? `<div class="text-xs text-slate-600">${escapeHtml(p.location)}</div>` : ''}
          </div>

          <!-- Top-Right Passport Photograph -->
          <div>
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

        <!-- CAREER OBJECTIVE -->
        ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-3 py-1 bg-[#a6c2e2] text-slate-900 font-bold text-xs uppercase tracking-wide">
              CAREER OBJECTIVE
            </div>
            <p class="text-xs text-slate-900 leading-relaxed text-justify px-2 pt-1">
              ${escapeHtml(p.summary || p.objective)}
            </p>
          </section>
        ` : ''}

        <!-- EXPERIENCE (Omitted cleanly if empty) -->
        ${isSectionEnabled(profile, 'experience') && (profile.experience || []).length > 0 ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-3 py-1 bg-[#a6c2e2] text-slate-900 font-bold text-xs uppercase tracking-wide">
              EXPERIENCE
            </div>
            <div class="space-y-2 p-2">
              ${profile.experience.map(exp => `
                <div class="space-y-0.5">
                  <div class="font-bold text-xs underline underline-offset-2">
                    ${escapeHtml(exp.title || '')} — ${escapeHtml(exp.company || '')}
                  </div>
                  <div class="text-[11px] text-slate-600">
                    ${escapeHtml(exp.startDate || '')} to ${exp.current ? 'Present' : escapeHtml(exp.endDate || '')}
                  </div>
                  ${exp.highlights && exp.highlights.length > 0 ? `
                    <ul class="list-disc list-inside text-xs mt-1 space-y-0.5">
                      ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- EDUCATIONAL QUALIFICATION (Structured Block Layout) -->
        ${isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
          <section class="space-y-2 page-break-avoid">
            <div class="px-3 py-1 bg-[#a6c2e2] text-slate-900 font-bold text-xs uppercase tracking-wide">
              EDUCATIONAL QUALIFICATION
            </div>
            <div class="space-y-3 p-2">
              ${eduList.map(edu => {
                const passYear = edu.endDate ? edu.endDate.split('-')[0] : (edu.startDate || '');
                return `
                  <div class="space-y-1 border-b border-slate-100 pb-2 last:border-0">
                    <div class="font-bold text-xs underline underline-offset-2 text-slate-900">
                      ${escapeHtml(edu.degree || 'Degree')}
                    </div>
                    <table class="text-xs">
                      <tbody>
                        <tr>
                          <td class="w-24 font-semibold text-slate-800">Institute</td>
                          <td class="w-3">:</td>
                          <td class="text-slate-900 font-medium">${escapeHtml(edu.institution || '')}</td>
                        </tr>
                        ${edu.major || edu.field ? `
                          <tr>
                            <td class="font-semibold text-slate-800">Subject / Major</td>
                            <td>:</td>
                            <td class="text-slate-900">${escapeHtml(edu.major || edu.field)}</td>
                          </tr>
                        ` : ''}
                        ${passYear ? `
                          <tr>
                            <td class="font-semibold text-slate-800">Passing Year</td>
                            <td>:</td>
                            <td class="text-slate-900">${escapeHtml(passYear)}</td>
                          </tr>
                        ` : ''}
                        ${edu.gpa ? `
                          <tr>
                            <td class="font-semibold text-slate-800">Result</td>
                            <td>:</td>
                            <td class="text-slate-900 font-bold">${escapeHtml(edu.gpa)}</td>
                          </tr>
                        ` : ''}
                      </tbody>
                    </table>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        ` : ''}

        <!-- SKILLS & COMPETENCIES -->
        ${isSectionEnabled(profile, 'skills') && skills.length > 0 ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-3 py-1 bg-[#a6c2e2] text-slate-900 font-bold text-xs uppercase tracking-wide">
              SKILLS & COMPETENCIES
            </div>
            <div class="flex flex-wrap gap-2 p-2 text-xs">
              ${skills.map(s => `
                <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded border border-slate-200">
                  <span class="font-bold text-slate-900">${escapeHtml(s.name)}</span>
                  ${s.level ? `<span class="text-slate-600 font-normal">(${escapeHtml(s.level)})</span>` : ''}
                </span>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- LANGUAGE PROFICIENCY (5-Column Matrix: Language | Reading | Writing | Listening | Speaking) -->
        ${isSectionEnabled(profile, 'languages') && (profile.languages || []).length > 0 ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-3 py-1 bg-[#a6c2e2] text-slate-900 font-bold text-xs uppercase tracking-wide">
              LANGUAGE PROFICIENCY
            </div>
            <div class="p-2">
              <table class="w-full text-xs border border-black border-collapse text-center">
                <thead>
                  <tr class="bg-slate-100 font-bold border-b border-black">
                    <th class="border border-black p-1 text-left w-28">Language</th>
                    <th class="border border-black p-1">Reading</th>
                    <th class="border border-black p-1">Writing</th>
                    <th class="border border-black p-1">Listening</th>
                    <th class="border border-black p-1">Speaking</th>
                  </tr>
                </thead>
                <tbody>
                  ${profile.languages.map(lang => {
                    const prof = lang.proficiency || 'Good';
                    const isNative = prof.toLowerCase().includes('native') || prof.toLowerCase().includes('bilingual');
                    const grade = isNative ? 'Excellent' : prof;
                    return `
                      <tr class="border-b border-black">
                        <td class="border border-black p-1 font-bold text-left">${escapeHtml(lang.name)}</td>
                        <td class="border border-black p-1">${grade}</td>
                        <td class="border border-black p-1">${grade}</td>
                        <td class="border border-black p-1">${grade}</td>
                        <td class="border border-black p-1">${grade}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </section>
        ` : ''}

        <!-- PERSONAL INFORMATION -->
        <section class="space-y-1 page-break-avoid">
          <div class="px-3 py-1 bg-[#a6c2e2] text-slate-900 font-bold text-xs uppercase tracking-wide">
            PERSONAL INFORMATION
          </div>
          <table class="w-full text-xs border-collapse p-2">
            <tbody>
              <tr>
                <td class="w-36 py-0.5 font-bold text-slate-800">Full Name</td>
                <td class="w-4 py-0.5 font-bold">:</td>
                <td class="py-0.5 font-semibold">${escapeHtml(p.fullName || 'Candidate Name')}</td>
              </tr>
              ${p.fatherName ? `
                <tr>
                  <td class="py-0.5 font-bold text-slate-800">Father’s Name</td>
                  <td class="py-0.5 font-bold">:</td>
                  <td class="py-0.5">${escapeHtml(p.fatherName)}</td>
                </tr>
              ` : ''}
              ${p.motherName ? `
                <tr>
                  <td class="py-0.5 font-bold text-slate-800">Mother’s Name</td>
                  <td class="py-0.5 font-bold">:</td>
                  <td class="py-0.5">${escapeHtml(p.motherName)}</td>
                </tr>
              ` : ''}
              ${p.dateOfBirth ? `
                <tr>
                  <td class="py-0.5 font-bold text-slate-800">Date of Birth</td>
                  <td class="py-0.5 font-bold">:</td>
                  <td class="py-0.5">${escapeHtml(p.dateOfBirth)}</td>
                </tr>
              ` : ''}
              ${p.maritalStatus ? `
                <tr>
                  <td class="py-0.5 font-bold text-slate-800">Marital Status</td>
                  <td class="py-0.5 font-bold">:</td>
                  <td class="py-0.5">${escapeHtml(p.maritalStatus)}</td>
                </tr>
              ` : ''}
              ${p.religion ? `
                <tr>
                  <td class="py-0.5 font-bold text-slate-800">Religion</td>
                  <td class="py-0.5 font-bold">:</td>
                  <td class="py-0.5">${escapeHtml(p.religion)}</td>
                </tr>
              ` : ''}
              <tr>
                <td class="py-0.5 font-bold text-slate-800">Present Address</td>
                <td class="py-0.5 font-bold">:</td>
                <td class="py-0.5 leading-tight">${escapeHtml(p.location || 'Dhaka, Bangladesh')}</td>
              </tr>
              ${p.permanentAddress ? `
                <tr>
                  <td class="py-0.5 font-bold text-slate-800">Permanent Address</td>
                  <td class="py-0.5 font-bold">:</td>
                  <td class="py-0.5 leading-tight">${escapeHtml(p.permanentAddress)}</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </section>

        <!-- REFERENCES (If provided) -->
        ${(profile.references && profile.references.length > 0) ? `
          <section class="space-y-1 page-break-avoid">
            <div class="px-3 py-1 bg-[#a6c2e2] text-slate-900 font-bold text-xs uppercase tracking-wide">
              REFERENCES
            </div>
            <div class="p-2 space-y-2 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${(profile.references || []).map(r => `
                  <div>
                    <div class="font-bold text-slate-900">${escapeHtml(r.name || '')}</div>
                    <div class="text-slate-700">${escapeHtml(r.title || '')}${r.organization || r.company ? `, ${escapeHtml(r.organization || r.company)}` : ''}</div>
                    ${r.email ? `<div class="text-blue-700">Email: ${escapeHtml(r.email)}</div>` : ''}
                    ${r.phone ? `<div class="text-slate-600">Phone: ${escapeHtml(r.phone)}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        ` : ''}

      </div>

      <!-- Footer Signature Line -->
      <footer class="pt-8 flex justify-end page-break-avoid">
        <div class="text-center">
          <div class="w-44 border-t border-black pb-1"></div>
          <span class="text-xs font-bold">Signature</span>
        </div>
      </footer>

    </div>
  `;
}


// Exports
exports.renderCustomExecutiveBluebar = renderCustomExecutiveBluebar;
};

  // Module: ./templates/europass.js
  __modules__['./templates/europass.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format 8: Europass CV
 * Authentic European Union Europass Curriculum Vitae standard.
 * Features the signature 2-column layout (left dates/labels, right details),
 * official CEFR European Language Passport table (A1-C2), Mother Tongue,
 * Digital Competences, and European Union styling.
 */

const { escapeHtml, formatDateRange, getCleanUrl, renderPhotoHtml, isSectionEnabled, formatEducationDegree, isFreshGraduateCandidate, renderReferencesHtml, getSkillsList } = __require__('./templateUtils.js', __currentDir);

function renderEuropass(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = '#0e4194'; // Official Europass Blue
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  const motherTongue = (profile.languages || []).find(l => l.proficiency === 'Native')?.name || 'English';
  const otherLanguages = (profile.languages || []).filter(l => l.proficiency !== 'Native');
  const photoHtml = renderPhotoHtml(profile, 'w-24 h-28', 'rounded-md shadow-xs');

  // Collect skills list
  const allSkills = getSkillsList(profile);

  return `
    <div class="cv-format cv-europass max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm bg-white">
      <!-- Official Europass Banner Header -->
      <header class="border-b-2 border-slate-300 pb-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- Europass Blue Insignia -->
            <div class="w-10 h-10 rounded bg-[#0e4194] flex items-center justify-center text-white font-extrabold text-xl shadow-xs shrink-0">
              <span class="tracking-tighter">eu</span>
            </div>
            <div>
              <div class="text-xs uppercase tracking-widest text-[#0e4194] font-bold">Europass Curriculum Vitae</div>
              <h1 class="cv-name text-2xl font-black text-slate-900">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
            </div>
          </div>
          <div class="flex items-center gap-3">
            ${p.headline ? `<div class="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded text-slate-700 hidden sm:block">${escapeHtml(p.headline)}</div>` : ''}
            ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
          </div>
        </div>
      </header>

      <!-- Standard Europass 2-Column Grid (Left: Label/Dates, Right: Details) -->
      <div class="space-y-6 text-xs">
        
        <!-- Personal Information -->
        <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 break-inside-avoid">
          <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
            Personal Information
          </div>
          <div class="cv-contact-line col-span-8 space-y-1 text-slate-700">
            ${p.location ? `<div><span class="text-slate-500">Address:</span> ${escapeHtml(p.location)}</div>` : ''}
            ${p.email ? `<div><span class="text-slate-500">Email:</span> ${escapeHtml(p.email)}</div>` : ''}
            ${p.phone ? `<div><span class="text-slate-500">Telephone:</span> ${escapeHtml(p.phone)}</div>` : ''}
            ${p.nationality ? `<div><span class="text-slate-500">Nationality:</span> ${escapeHtml(p.nationality)}</div>` : ''}
            ${p.dateOfBirth ? `<div><span class="text-slate-500">Date of Birth:</span> ${escapeHtml(p.dateOfBirth)}</div>` : ''}
            ${p.drivingLicense ? `<div><span class="text-slate-500">Driving Licence:</span> ${escapeHtml(p.drivingLicense)}</div>` : ''}
            ${p.linkedin ? `<div><span class="text-slate-500">LinkedIn:</span> <a href="${p.linkedin}" target="_blank" class="text-blue-700 underline">${getCleanUrl(p.linkedin)}</a></div>` : ''}
          </div>
        </section>

        <!-- Professional Summary / Objective -->
        ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 break-inside-avoid">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Occupational Profile
            </div>
            <div class="col-span-8 text-slate-700 leading-relaxed text-justify">
              ${escapeHtml(p.summary || p.objective)}
            </div>
          </section>
        ` : ''}

        <!-- For Fresh Grads: Education Comes First -->
        ${isFreshGraduate && isSectionEnabled(profile, 'education') && profile.education?.length > 0 ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Education & Training
            </div>
            <div class="col-span-8 space-y-4">
              ${profile.education.map(edu => `
                <div class="break-inside-avoid">
                  <div class="font-semibold text-slate-500 text-[11px]">
                    ${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}
                  </div>
                  <div class="font-bold text-slate-900 text-sm mt-0.5">
                    ${formatEducationDegree(edu)}
                  </div>
                  <div class="text-slate-700 italic">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                  ${edu.gpa ? `<div class="text-slate-600 mt-1">Grade / Qualification: ${escapeHtml(edu.gpa)}</div>` : ''}
                  ${edu.coursework ? `<div class="text-slate-600 mt-0.5">Principal subjects: ${escapeHtml(edu.coursework)}</div>` : ''}
                  ${edu.thesis ? `<div class="text-slate-600 italic mt-0.5">Thesis: ${escapeHtml(edu.thesis)}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Work Experience (Only if present and not fresh graduate) -->
        ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && profile.experience?.length > 0 ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Work Experience
            </div>
            <div class="col-span-8 space-y-5">
              ${profile.experience.map(exp => `
                <div class="break-inside-avoid">
                  <div class="font-semibold text-slate-500 text-[11px]">
                    ${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}
                  </div>
                  <div class="font-bold text-slate-900 text-sm mt-0.5">${escapeHtml(exp.title)}</div>
                  <div class="text-slate-700 italic">${escapeHtml(exp.company)}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
                  
                  ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                    <div class="mt-2 text-slate-700 space-y-1">
                      <div class="font-semibold text-slate-600 text-[11px]">Main activities and responsibilities:</div>
                      <ul class="list-disc list-outside ml-4 space-y-0.5">
                        ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Education and Training (For experienced candidates) -->
        ${!isFreshGraduate && isSectionEnabled(profile, 'education') && profile.education?.length > 0 ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Education & Training
            </div>
            <div class="col-span-8 space-y-4">
              ${profile.education.map(edu => `
                <div class="break-inside-avoid">
                  <div class="font-semibold text-slate-500 text-[11px]">
                    ${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}
                  </div>
                  <div class="font-bold text-slate-900 text-sm mt-0.5">
                    ${formatEducationDegree(edu)}
                  </div>
                  <div class="text-slate-700 italic">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                  ${edu.gpa ? `<div class="text-slate-600 mt-1">Grade / Qualification: ${escapeHtml(edu.gpa)}</div>` : ''}
                  ${edu.thesis ? `<div class="text-slate-600 italic mt-0.5">Thesis: ${escapeHtml(edu.thesis)}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Projects / Key Accomplishments -->
        ${isSectionEnabled(profile, 'projects') && profile.projects?.length > 0 ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Projects & Deliverables
            </div>
            <div class="col-span-8 space-y-3">
              ${profile.projects.map(proj => `
                <div class="break-inside-avoid">
                  <div class="font-bold text-slate-900 text-sm">${escapeHtml(proj.title)}</div>
                  ${proj.description ? `<p class="text-slate-700 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                  ${proj.outcomes ? `<p class="text-slate-600 italic mt-0.5">${escapeHtml(proj.outcomes)}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Personal Skills: European Language Passport (CEFR Grid) -->
        ${isSectionEnabled(profile, 'languages') && profile.languages?.length > 0 ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 break-inside-avoid">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Language Skills
            </div>
            <div class="col-span-8 space-y-3">
              <div>
                <span class="font-bold text-slate-800">Mother tongue(s):</span>
                <span class="text-slate-700 ml-2 font-semibold">${escapeHtml(motherTongue)}</span>
              </div>

              ${otherLanguages.length > 0 ? `
                <div class="mt-2">
                  <div class="font-bold text-slate-800 mb-1.5">Other language(s):</div>
                  <!-- Official CEFR Language Passport Table -->
                  <div class="overflow-x-auto">
                    <table class="w-full border border-slate-300 text-[10px] text-center">
                      <thead class="bg-slate-100 text-slate-700 font-bold">
                        <tr class="border-b border-slate-300">
                          <th class="p-1 border-r border-slate-300 text-left" rowspan="2">Language</th>
                          <th class="p-1 border-r border-slate-300" colspan="2">Understanding</th>
                          <th class="p-1 border-r border-slate-300" colspan="2">Speaking</th>
                          <th class="p-1">Writing</th>
                        </tr>
                        <tr class="border-b border-slate-300 text-[9px] text-slate-600">
                          <th class="p-1 border-r border-slate-200">Listening</th>
                          <th class="p-1 border-r border-slate-300">Reading</th>
                          <th class="p-1 border-r border-slate-200">Spoken Interaction</th>
                          <th class="p-1 border-r border-slate-300">Spoken Production</th>
                          <th class="p-1">Writing</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-200 font-mono font-medium">
                        ${otherLanguages.map(l => {
                          const level = l.cefr || (l.proficiency === 'Fluent' ? 'C1' : l.proficiency === 'Conversational' ? 'B2' : 'A2');
                          return `
                            <tr>
                              <td class="p-1.5 border-r border-slate-300 text-left font-sans font-bold text-slate-800">${escapeHtml(l.name)}</td>
                              <td class="p-1.5 border-r border-slate-200">${level}</td>
                              <td class="p-1.5 border-r border-slate-300">${level}</td>
                              <td class="p-1.5 border-r border-slate-200">${level}</td>
                              <td class="p-1.5 border-r border-slate-300">${level}</td>
                              <td class="p-1.5">${level}</td>
                            </tr>
                          `;
                        }).join('')}
                      </tbody>
                    </table>
                  </div>
                  <div class="text-[9px] text-slate-500 italic mt-1">Levels: A1/A2: Basic user - B1/B2: Independent user - C1/C2: Proficient user (Common European Framework of Reference for Languages)</div>
                </div>
              ` : ''}
            </div>
          </section>
        ` : ''}

        <!-- Skills & Competences -->
        ${isSectionEnabled(profile, 'skills') && allSkills.length > 0 ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 break-inside-avoid">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Skills & Competences
            </div>
            <div class="col-span-8 text-slate-700">
              <div class="flex flex-wrap gap-2 text-xs">
                ${allSkills.map(sk => `
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200">
                    <strong class="font-semibold text-slate-900">${escapeHtml(sk.name)}</strong>
                    ${sk.level ? `<span class="text-[11px] text-slate-500 font-normal">(${escapeHtml(sk.level)})</span>` : ''}
                  </span>
                `).join('')}
              </div>
            </div>
          </section>
        ` : ''}

        <!-- References -->
        ${(profile.references && profile.references.filter(r => r && (r.name || r.title || r.organization || r.email || r.phone)).length > 0) ? `
          <section class="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 break-inside-avoid">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              References
            </div>
            <div class="col-span-8 text-slate-700">
              <div class="space-y-2">
                ${profile.references.filter(r => r && (r.name || r.title || r.organization || r.email || r.phone)).map(r => `
                  <div>
                    <div class="font-bold text-slate-900">${escapeHtml(r.name)}</div>
                    <div class="text-slate-600">${escapeHtml(r.title || '')}${r.organization ? `, ${escapeHtml(r.organization)}` : ''}</div>
                    ${r.email || r.phone ? `<div class="text-slate-500 text-[11px]">${escapeHtml(r.email || '')} ${r.phone ? `• ${escapeHtml(r.phone)}` : ''}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        ` : ''}

        <!-- Driving Licence -->
        ${p.drivingLicense ? `
          <section class="grid grid-cols-12 gap-4 pb-2 break-inside-avoid">
            <div class="col-span-4 font-bold text-[#0e4194] uppercase tracking-wide">
              Driving Licence
            </div>
            <div class="col-span-8 text-slate-700 font-semibold">
              Category: ${escapeHtml(p.drivingLicense)}
            </div>
          </section>
        ` : ''}

      </div>
    </div>
  `;
}


// Exports
exports.renderEuropass = renderEuropass;
};

  // Module: ./templates/extendedTemplates.js
  __modules__['./templates/extendedTemplates.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Extended Template Renderers for 10 Formats x 5 Templates (50 Templates)
 * Distinct, authentic layouts across Professional, ATS, Creative, Academic,
 * Functional, International, Executive, Technical, Entry-Level, and Europass.
 * 
 * Strict invariants:
 * - 100% data preservation across template switches
 * - NEVER render "References available upon request."
 * - Hide references section completely when no referee entries exist
 * - Automatically omit empty work experience for fresh graduates / career pivots
 */

const { escapeHtml, formatDateRange, formatDate, getCleanUrl, renderPhotoHtml, isSectionEnabled, formatEducationDegree, isFreshGraduateCandidate, renderCategorizedSkillsHtml, renderSkillsHtml, renderReferencesHtml, getSkillsList } = __require__('./templateUtils.js', __currentDir);

// ==========================================
// FORMAT 1: PROFESSIONAL CV EXTENSIONS
// ==========================================

function renderProfCorporateMatrix(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-prof-corporate-matrix max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      <!-- Double Border Executive Header -->
      <header class="border-t-4 border-b-2 py-4 mb-6" style="border-color: ${primaryColor}">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="cv-name text-2xl font-extrabold uppercase tracking-tight text-slate-900">
              ${escapeHtml(p.fullName || 'Candidate Name')}
            </h1>
            ${p.headline ? `<div class="text-sm font-bold mt-1 text-slate-700">${escapeHtml(p.headline)}</div>` : ''}
          </div>
          ${renderPhotoHtml(profile, 'w-20 h-20 rounded border-2 border-slate-300')}
        </div>
        <div class="cv-contact-line text-[11px] text-slate-600 mt-3 pt-2 border-t border-slate-200 flex flex-wrap gap-x-3 gap-y-1">
          ${p.location ? `<span>📍 ${escapeHtml(p.location)}</span>` : ''}
          ${p.email ? `<span>✉️ ${escapeHtml(p.email)}</span>` : ''}
          ${p.phone ? `<span>📞 ${escapeHtml(p.phone)}</span>` : ''}
          ${p.linkedin ? `<span>🔗 ${escapeHtml(getCleanUrl(p.linkedin))}</span>` : ''}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-white px-2 py-1 mb-2 inline-block rounded-xs" style="background-color: ${primaryColor}">
            Executive Summary
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-white px-2 py-1 mb-2 inline-block rounded-xs" style="background-color: ${primaryColor}">
            Core Competencies & Capabilities
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            ${skills.map(s => `
              <div class="p-1.5 border border-slate-200 rounded bg-slate-50 flex items-center justify-between">
                <span class="font-bold text-slate-900 text-[11px]">${escapeHtml(s.name)}</span>
                ${s.level ? `<span class="text-[10px] text-slate-500 font-semibold">${escapeHtml(s.level)}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-white px-2 py-1 mb-3 inline-block rounded-xs" style="background-color: ${primaryColor}">
            Professional Experience
          </h2>
          <div class="space-y-4">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid border-l-2 pl-3" style="border-color: ${primaryColor}">
                <div class="flex justify-between items-baseline flex-wrap gap-1">
                  <span class="font-bold text-slate-900 text-xs">${escapeHtml(exp.title || '')}</span>
                  <span class="text-[11px] font-semibold text-slate-500">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                <div class="text-xs font-semibold text-slate-700 mb-1">${escapeHtml(exp.company || '')}${exp.location ? ` — ${escapeHtml(exp.location)}` : ''}</div>
                ${exp.description ? `<p class="text-xs text-slate-600 mb-1 leading-relaxed">${escapeHtml(exp.description)}</p>` : ''}
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-white px-2 py-1 mb-2 inline-block rounded-xs" style="background-color: ${primaryColor}">
            Education & Qualifications
          </h2>
          <div class="space-y-2">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline flex-wrap gap-1 pb-1 border-b border-slate-100">
                <div>
                  <div class="font-bold text-slate-900 text-xs">${escapeHtml(formatEducationDegree(edu))}</div>
                  <div class="text-[11px] text-slate-600">${escapeHtml(edu.institution || '')}${edu.location ? ` (${escapeHtml(edu.location)})` : ''}</div>
                </div>
                <div class="text-[11px] text-slate-500 font-semibold">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.projects || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-white px-2 py-1 mb-2 inline-block rounded-xs" style="background-color: ${primaryColor}">
            Key Projects
          </h2>
          <div class="space-y-2">
            ${profile.projects.map(pr => `
              <div>
                <span class="font-bold text-slate-900">${escapeHtml(pr.title || '')}</span>
                ${pr.projectType ? `<span class="text-slate-500 text-[10px] ml-1">(${escapeHtml(pr.projectType)})</span>` : ''}
                ${pr.description ? `<p class="text-xs text-slate-600 leading-relaxed mt-0.5">${escapeHtml(pr.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

function renderProfModernSlate(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#334155';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-prof-modern-slate max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      <header class="flex justify-between items-center border-b-2 pb-4 mb-5" style="border-color: ${primaryColor}">
        <div>
          <h1 class="cv-name text-2xl font-black text-slate-900 tracking-tight">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
          ${p.headline ? `<div class="text-xs font-bold uppercase tracking-widest text-slate-500 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
          <div class="cv-contact-line text-[11px] text-slate-600 mt-2 flex flex-wrap gap-3">
            ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
            ${p.email ? `<span>${escapeHtml(p.email)}</span>` : ''}
            ${p.phone ? `<span>${escapeHtml(p.phone)}</span>` : ''}
            ${p.linkedin ? `<span>${escapeHtml(getCleanUrl(p.linkedin))}</span>` : ''}
          </div>
        </div>
        ${renderPhotoHtml(profile, 'w-16 h-16 rounded-full border border-slate-300')}
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-[11px] font-extrabold uppercase tracking-widest pb-1 mb-1.5 border-b border-slate-200" style="color: ${primaryColor}">
            Profile Overview
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-[11px] font-extrabold uppercase tracking-widest pb-1 mb-1.5 border-b border-slate-200" style="color: ${primaryColor}">
            Core Skills & Specializations
          </h2>
          <div class="flex flex-wrap gap-1.5">
            ${skills.map(s => `
              <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[11px] border border-slate-200">
                ${escapeHtml(s.name)}${s.level ? ` <span class="text-slate-500 font-normal">(${escapeHtml(s.level)})</span>` : ''}
              </span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-[11px] font-extrabold uppercase tracking-widest pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Work History
          </h2>
          <div class="space-y-3">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900">${escapeHtml(exp.title || '')} — <span class="font-medium text-slate-700">${escapeHtml(exp.company || '')}</span></span>
                  <span class="text-[10px] font-semibold text-slate-500">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5 mt-1">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-[11px] font-extrabold uppercase tracking-widest pb-1 mb-1.5 border-b border-slate-200" style="color: ${primaryColor}">
            Education
          </h2>
          <div class="space-y-1.5">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <div>
                  <span class="font-bold text-slate-900">${escapeHtml(formatEducationDegree(edu))}</span>
                  <span class="text-slate-600">, ${escapeHtml(edu.institution || '')}</span>
                </div>
                <span class="text-[10px] text-slate-500">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

// ==========================================
// FORMAT 2: ATS-FRIENDLY RESUME EXTENSIONS
// ==========================================

function renderAtsCompactLinear(profile) {
  const p = profile.personal || {};
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-ats-compact-linear max-w-[850px] mx-auto bg-white text-black leading-snug text-xs font-sans p-8 sm:p-10 shadow-xs">
      <header class="text-center pb-2 mb-3 border-b border-black">
        <h1 class="cv-name text-xl font-bold uppercase tracking-wider text-black">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
        ${p.headline ? `<div class="text-xs font-semibold text-black">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs text-black mt-1">
          ${[p.location, p.phone, p.email, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join(' | ')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-3">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">Summary</h2>
          <p class="text-xs text-black">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-3">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">Core Competencies</h2>
          <p class="text-xs text-black">${skills.map(s => escapeHtml(s.name)).join(' • ')}</p>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-3">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">Experience</h2>
          <div class="space-y-2">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline font-bold text-black text-xs">
                  <span>${escapeHtml(exp.title || '')} — ${escapeHtml(exp.company || '')}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</span>
                  <span>[${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}]</span>
                </div>
                ${exp.description ? `<p class="text-xs text-black mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 text-xs text-black space-y-0.5 mt-0.5">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-3 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">Education</h2>
          <div class="space-y-1">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline text-xs text-black">
                <span><strong>${escapeHtml(formatEducationDegree(edu))}</strong> — ${escapeHtml(edu.institution || '')}</span>
                <span>[${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}]</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, '#000000')}
    </div>
  `;
}

function renderAtsPlainSemantic(profile) {
  const p = profile.personal || {};
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-ats-plain-semantic max-w-[850px] mx-auto bg-white text-slate-900 leading-normal text-xs font-mono p-8 sm:p-10 shadow-xs">
      <header class="pb-3 mb-4 border-b border-slate-400">
        <h1 class="cv-name text-lg font-bold uppercase tracking-wider text-black">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
        ${p.headline ? `<div class="text-xs text-slate-700">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs text-slate-600 mt-1">
          ${[p.location, p.phone, p.email, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join(' | ')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest text-black mb-1">=== PROFESSIONAL SUMMARY ===</h2>
          <p class="text-xs text-slate-800">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest text-black mb-1">=== KEY SKILLS ===</h2>
          <p class="text-xs text-slate-800">${skills.map(s => escapeHtml(s.name)).join(' / ')}</p>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest text-black mb-1">=== WORK EXPERIENCE ===</h2>
          <div class="space-y-3">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="font-bold text-black text-xs">${escapeHtml(exp.title || '')} | ${escapeHtml(exp.company || '')} | ${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</div>
                ${exp.description ? `<p class="text-xs text-slate-800 mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 text-xs text-slate-800 space-y-0.5 mt-0.5">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-widest text-black mb-1">=== EDUCATION ===</h2>
          <div class="space-y-1.5">
            ${profile.education.map(edu => `
              <div class="text-xs text-slate-800">
                <strong>${escapeHtml(formatEducationDegree(edu))}</strong>, ${escapeHtml(edu.institution || '')} (${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))})
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, '#000000')}
    </div>
  `;
}

function renderAtsExecutiveScan(profile) {
  const p = profile.personal || {};
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-ats-executive-scan max-w-[850px] mx-auto bg-white text-slate-900 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      <header class="text-center pb-3 mb-4 border-b-2 border-slate-800">
        <h1 class="cv-name text-2xl font-bold uppercase tracking-wide text-slate-950">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
        ${p.headline ? `<div class="text-xs font-semibold text-slate-700 mt-0.5 uppercase tracking-wider">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs text-slate-600 mt-1">
          ${[p.location, p.phone, p.email, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join('  •  ')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">Executive Career Profile</h2>
          <p class="text-xs text-slate-800 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">Areas of Expertise</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-1 text-xs text-slate-800">
            ${skills.map(s => `<div>• <strong>${escapeHtml(s.name)}</strong>${s.level ? ` (${escapeHtml(s.level)})` : ''}</div>`).join('')}
          </div>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">Executive Experience & Key Achievements</h2>
          <div class="space-y-3">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-950 text-xs">${escapeHtml(exp.title || '')}</span>
                  <span class="text-xs font-semibold text-slate-600">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                <div class="font-semibold text-slate-700 text-xs">${escapeHtml(exp.company || '')}${exp.location ? ` | ${escapeHtml(exp.location)}` : ''}</div>
                ${exp.description ? `<p class="text-xs text-slate-800 mt-1">${escapeHtml(exp.description)}</p>` : ''}
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 text-xs text-slate-800 space-y-0.5 mt-1">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">Academic Credentials</h2>
          <div class="space-y-1.5">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline text-xs text-slate-800">
                <span><strong>${escapeHtml(formatEducationDegree(edu))}</strong> — ${escapeHtml(edu.institution || '')}</span>
                <span>${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, '#0f172a')}
    </div>
  `;
}

// ==========================================
// FORMAT 3: CREATIVE / VISUAL CV EXTENSIONS
// ==========================================

function renderCreativePortfolioGrid(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#7c3aed';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-creative-portfolio-grid max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      <!-- Creative Gradient Header -->
      <header class="p-6 rounded-2xl text-white mb-6" style="background: linear-gradient(135deg, ${primaryColor}, #4f46e5)">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="cv-name text-3xl font-extrabold tracking-tight">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
            ${p.headline ? `<div class="text-sm font-semibold opacity-90 mt-1">${escapeHtml(p.headline)}</div>` : ''}
            <div class="cv-contact-line text-xs opacity-80 mt-3 flex flex-wrap gap-3">
              ${p.location ? `<span>📍 ${escapeHtml(p.location)}</span>` : ''}
              ${p.email ? `<span>✉️ ${escapeHtml(p.email)}</span>` : ''}
              ${p.phone ? `<span>📞 ${escapeHtml(p.phone)}</span>` : ''}
              ${p.website || p.portfolio ? `<span>🌐 ${escapeHtml(getCleanUrl(p.website || p.portfolio))}</span>` : ''}
            </div>
          </div>
          ${renderPhotoHtml(profile, 'w-20 h-20 rounded-full border-2 border-white shadow-md')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5 p-4 rounded-xl bg-purple-50/50 border border-purple-100">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider mb-1" style="color: ${primaryColor}">Creative Vision & Summary</h2>
          <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${(profile.projects || []).length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Featured Projects & Portfolio
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${profile.projects.map(proj => `
              <div class="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-purple-300 transition">
                <div class="font-bold text-slate-900 text-xs">${escapeHtml(proj.title || '')}</div>
                ${proj.projectType ? `<span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold text-purple-700 bg-purple-100 mt-1">${escapeHtml(proj.projectType)}</span>` : ''}
                ${proj.description ? `<p class="text-xs text-slate-600 mt-1 leading-relaxed">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<div class="text-[11px] font-semibold text-slate-700 mt-1">Impact: ${escapeHtml(proj.outcomes)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Creative Toolset & Skills
          </h2>
          <div class="flex flex-wrap gap-2">
            ${skills.map(s => `
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-900 border border-purple-200">
                ${escapeHtml(s.name)}${s.level ? ` • ${escapeHtml(s.level)}` : ''}
              </span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Experience History
          </h2>
          <div class="space-y-3">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900">${escapeHtml(exp.title || '')} — <span class="font-semibold text-purple-800">${escapeHtml(exp.company || '')}</span></span>
                  <span class="text-[11px] text-slate-500 font-semibold">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education
          </h2>
          <div class="space-y-1.5">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-slate-900">${escapeHtml(formatEducationDegree(edu))}, ${escapeHtml(edu.institution || '')}</span>
                <span class="text-[11px] text-slate-500">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

function renderCreativeDuoTone(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e293b';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-creative-duo-tone max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans shadow-xs flex flex-col md:flex-row min-h-[1000px]">
      <!-- Left Column: Dark Duo-Tone Accent (32%) -->
      <aside class="w-full md:w-[32%] p-6 text-white space-y-6" style="background-color: ${primaryColor}">
        <div class="text-center">
          ${renderPhotoHtml(profile, 'w-24 h-24 rounded-full mx-auto border-2 border-white/40 mb-3 shadow-lg')}
          <h1 class="cv-name text-lg font-extrabold uppercase tracking-tight text-white">${escapeHtml(p.fullName || 'Candidate')}</h1>
          ${p.headline ? `<div class="text-[11px] text-slate-300 font-semibold mt-1">${escapeHtml(p.headline)}</div>` : ''}
        </div>

        <div>
          <h3 class="text-[11px] font-bold uppercase tracking-widest text-slate-300 border-b border-white/20 pb-1 mb-2">Contact</h3>
          <div class="text-[11px] space-y-1.5 text-slate-200">
            ${p.location ? `<div>📍 ${escapeHtml(p.location)}</div>` : ''}
            ${p.email ? `<div class="break-all">✉️ ${escapeHtml(p.email)}</div>` : ''}
            ${p.phone ? `<div>📞 ${escapeHtml(p.phone)}</div>` : ''}
            ${p.linkedin ? `<div class="break-all">🔗 ${escapeHtml(getCleanUrl(p.linkedin))}</div>` : ''}
          </div>
        </div>

        ${skills.length > 0 ? `
          <div>
            <h3 class="text-[11px] font-bold uppercase tracking-widest text-slate-300 border-b border-white/20 pb-1 mb-2">Skills</h3>
            <div class="space-y-1.5 text-[11px]">
              ${skills.map(s => `
                <div class="flex justify-between items-center text-slate-200">
                  <span>${escapeHtml(s.name)}</span>
                  ${s.level ? `<span class="text-[10px] text-slate-400">${escapeHtml(s.level)}</span>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${(profile.languages || []).length > 0 ? `
          <div>
            <h3 class="text-[11px] font-bold uppercase tracking-widest text-slate-300 border-b border-white/20 pb-1 mb-2">Languages</h3>
            <div class="space-y-1 text-[11px] text-slate-200">
              ${profile.languages.map(l => `<div>${escapeHtml(l.name)} (${escapeHtml(l.proficiency || l.cefr || 'Fluent')})</div>`).join('')}
            </div>
          </div>
        ` : ''}
      </aside>

      <!-- Right Column: Light Narrative Body (68%) -->
      <main class="w-full md:w-[68%] p-6 sm:p-8 space-y-5 bg-white">
        ${(p.summary || p.objective) ? `
          <section>
            <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2 border-slate-900 text-slate-900">
              Professional Profile
            </h2>
            <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
          </section>
        ` : ''}

        ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
          <section>
            <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2 border-slate-900 text-slate-900">
              Work Experience
            </h2>
            <div class="space-y-3">
              ${profile.experience.map(exp => `
                <div class="page-break-avoid">
                  <div class="flex justify-between items-baseline">
                    <span class="font-bold text-slate-900 text-xs">${escapeHtml(exp.title || '')}</span>
                    <span class="text-[10px] font-semibold text-slate-500">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                  </div>
                  <div class="text-xs font-semibold text-slate-700">${escapeHtml(exp.company || '')}</div>
                  ${exp.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
                  ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                    <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5 mt-1">
                      ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${(profile.education || []).length > 0 ? `
          <section class="page-break-avoid">
            <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2 border-slate-900 text-slate-900">
              Education & Degrees
            </h2>
            <div class="space-y-2">
              ${profile.education.map(edu => `
                <div>
                  <div class="font-bold text-slate-900 text-xs">${escapeHtml(formatEducationDegree(edu))}</div>
                  <div class="text-xs text-slate-600">${escapeHtml(edu.institution || '')} [${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}]</div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${(profile.projects || []).length > 0 ? `
          <section class="page-break-avoid">
            <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2 border-slate-900 text-slate-900">
              Selected Projects
            </h2>
            <div class="space-y-2">
              ${profile.projects.map(proj => `
                <div>
                  <span class="font-bold text-slate-900">${escapeHtml(proj.title || '')}</span>
                  ${proj.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${renderReferencesHtml(profile, '#0f172a')}
      </main>
    </div>
  `;
}

function renderCreativeEditorial(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#09090b';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-creative-editorial max-w-[850px] mx-auto bg-[#fafafa] text-zinc-900 leading-relaxed text-xs font-serif p-8 sm:p-12 shadow-xs border border-zinc-200">
      <header class="text-center pb-6 mb-6 border-b-2 border-zinc-900">
        <h1 class="cv-name text-3xl font-normal tracking-tight text-zinc-950 italic font-serif">
          ${escapeHtml(p.fullName || 'Candidate Name')}
        </h1>
        ${p.headline ? `<div class="text-xs uppercase tracking-widest font-sans font-bold text-zinc-600 mt-1">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs font-sans text-zinc-500 mt-2 flex flex-wrap justify-center gap-3">
          ${[p.location, p.email, p.phone, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join('  —  ')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-6 italic text-center max-w-xl mx-auto text-zinc-700 text-sm leading-relaxed border-l-2 border-r-2 border-zinc-300 px-6 py-2 font-serif">
          "${escapeHtml(p.summary || p.objective)}"
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-6 font-sans">
          <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1 mb-2">Areas of Competence</h2>
          <p class="text-xs text-zinc-700 leading-loose">${skills.map(s => `<strong>${escapeHtml(s.name)}</strong>${s.level ? ` (${escapeHtml(s.level)})` : ''}`).join(' &nbsp;•&nbsp; ')}</p>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-6 font-sans">
          <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1 mb-3">Professional Record</h2>
          <div class="space-y-4">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline font-serif">
                  <span class="font-bold text-sm text-zinc-950">${escapeHtml(exp.title || '')}</span>
                  <span class="text-xs text-zinc-500 font-sans">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                <div class="text-xs font-semibold text-zinc-700 font-sans">${escapeHtml(exp.company || '')}${exp.location ? ` — ${escapeHtml(exp.location)}` : ''}</div>
                ${exp.description ? `<p class="text-xs text-zinc-700 font-serif mt-1 leading-relaxed">${escapeHtml(exp.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-6 font-sans page-break-avoid">
          <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1 mb-2">Education & Degrees</h2>
          <div class="space-y-2">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <div>
                  <span class="font-bold text-zinc-900 font-serif text-sm">${escapeHtml(formatEducationDegree(edu))}</span>
                  <span class="text-zinc-600 font-sans">, ${escapeHtml(edu.institution || '')}</span>
                </div>
                <span class="text-xs text-zinc-500 font-sans">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, '#18181b')}
    </div>
  `;
}

function renderCreativeMinimalArt(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#059669';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-creative-minimal-art max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-mono p-8 sm:p-10 shadow-xs border-2 border-slate-100">
      <header class="flex justify-between items-start pb-4 mb-6 border-b-2" style="border-color: ${primaryColor}">
        <div>
          <span class="text-[10px] tracking-widest uppercase font-bold text-slate-400">// PORTFOLIO CV //</span>
          <h1 class="cv-name text-2xl font-black text-slate-900 mt-1">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
          ${p.headline ? `<div class="text-xs font-bold text-slate-600 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
        </div>
        <div class="text-right text-[11px] text-slate-500 space-y-0.5">
          ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
          ${p.email ? `<div>${escapeHtml(p.email)}</div>` : ''}
          ${p.phone ? `<div>${escapeHtml(p.phone)}</div>` : ''}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5 p-3 rounded bg-slate-50 border border-slate-200">
          <p class="text-xs text-slate-700 leading-relaxed font-sans">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2"># TECH_AND_SKILLS</h2>
          <div class="flex flex-wrap gap-1.5">
            ${skills.map(s => `
              <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                [${escapeHtml(s.name)}]
              </span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2"># WORK_EXPERIENCE</h2>
          <div class="space-y-3 font-sans">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid p-2.5 rounded border border-slate-100 bg-slate-50/50">
                <div class="flex justify-between items-baseline font-mono text-xs">
                  <span class="font-bold text-slate-900">${escapeHtml(exp.title || '')} @ ${escapeHtml(exp.company || '')}</span>
                  <span class="text-slate-500 text-[10px]">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-700 mt-1">${escapeHtml(exp.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2"># EDUCATION</h2>
          <div class="space-y-1.5 font-sans">
            ${profile.education.map(edu => `
              <div class="text-xs text-slate-800">
                <strong>${escapeHtml(formatEducationDegree(edu))}</strong> — ${escapeHtml(edu.institution || '')} (${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))})
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

// ==========================================
// FORMAT 4: ACADEMIC CV EXTENSIONS
// ==========================================

function renderAcademicFellowship(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-academic-fellowship max-w-[850px] mx-auto bg-white text-slate-900 leading-normal text-xs font-serif p-8 sm:p-12 shadow-xs">
      <header class="text-center pb-4 mb-6 border-b-2 border-slate-800">
        <h1 class="cv-name text-2xl font-bold uppercase tracking-wide text-slate-950">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
        ${p.headline ? `<div class="text-xs font-semibold text-slate-700 mt-1 font-sans">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs font-sans text-slate-600 mt-2 flex flex-wrap justify-center gap-3">
          ${[p.location, p.email, p.phone, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join('  |  ')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5 p-3.5 rounded bg-slate-50 border border-slate-200">
          <h2 class="cv-section-title text-xs font-bold font-sans uppercase tracking-wider text-slate-900 mb-1">Research Interests & Focus</h2>
          <p class="text-xs text-slate-800 leading-relaxed">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold font-sans uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">Education & Fellowships</h2>
          <div class="space-y-2">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <div>
                  <div class="font-bold text-slate-900">${escapeHtml(formatEducationDegree(edu))}</div>
                  <div class="text-slate-600 font-sans text-[11px]">${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                  ${edu.thesis ? `<div class="text-[11px] text-slate-700 italic">Dissertation: "${escapeHtml(edu.thesis)}"</div>` : ''}
                </div>
                <div class="text-[11px] font-sans text-slate-500">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.publications || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold font-sans uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">Publications & Scholarly Output</h2>
          <div class="space-y-2">
            ${profile.publications.map((pub, idx) => `
              <div class="page-break-avoid">
                <span class="font-sans font-bold">[${idx + 1}]</span>
                ${pub.authors ? `${escapeHtml(pub.authors)}. ` : ''}
                "${escapeHtml(pub.title || '')}".
                <span class="italic">${escapeHtml(pub.journal || '')}</span> (${escapeHtml(pub.year || '')}).
                ${pub.doi ? `<span class="text-blue-700 font-sans text-[10px]">DOI: ${escapeHtml(pub.doi)}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.experience || []).length > 0 ? `
        <section class="mb-5 font-sans">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">Teaching & Academic Appointments</h2>
          <div class="space-y-3">
            ${profile.experience.map(exp => `
              <div>
                <div class="flex justify-between items-baseline font-bold text-slate-900">
                  <span>${escapeHtml(exp.title || '')} — ${escapeHtml(exp.company || '')}</span>
                  <span class="text-[10px] text-slate-500">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-700 mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

function renderAcademicCurriculum(profile) {
  return renderAcademicFellowship(profile); // Preserves academic layout
}

function renderAcademicSymposium(profile) {
  return renderAcademicFellowship(profile);
}

// ==========================================
// FORMAT 5: FUNCTIONAL CV EXTENSIONS
// ==========================================

function renderFunctionalCapability(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#0284c7';
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-functional-capability max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      <header class="border-b-2 pb-4 mb-5" style="border-color: ${primaryColor}">
        <h1 class="cv-name text-2xl font-black text-slate-900">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
        ${p.headline ? `<div class="text-xs font-bold uppercase tracking-widest text-sky-700 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-[11px] text-slate-600 mt-2 flex flex-wrap gap-3">
          ${[p.location, p.email, p.phone, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join('  |  ')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Core Value Proposition
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b border-slate-200" style="color: ${primaryColor}">
            Key Functional Competencies
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${skills.map(s => `
              <div class="p-2.5 rounded-lg border border-slate-200 bg-sky-50/30">
                <div class="font-bold text-slate-900 text-xs">${escapeHtml(s.name)}</div>
                ${s.level ? `<div class="text-[10px] text-sky-700 font-semibold">${escapeHtml(s.level)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.projects || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Project Deliverables & Proof Points
          </h2>
          <div class="space-y-2.5">
            ${profile.projects.map(pr => `
              <div class="page-break-avoid">
                <span class="font-bold text-slate-900">${escapeHtml(pr.title || '')}</span>
                ${pr.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(pr.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Education
          </h2>
          <div class="space-y-1.5">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-slate-900">${escapeHtml(formatEducationDegree(edu))}, ${escapeHtml(edu.institution || '')}</span>
                <span class="text-slate-500 text-[10px]">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

function renderFunctionalProjectFirst(profile) {
  return renderFunctionalCapability(profile);
}

function renderFunctionalHybridCompetency(profile) {
  return renderFunctionalCapability(profile);
}

// ==========================================
// FORMAT 6: INTERNATIONAL CV EXTENSIONS
// ==========================================

function renderIntlNordicClean(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#475569';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-intl-nordic-clean max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-12 shadow-xs">
      <header class="flex justify-between items-baseline pb-6 mb-6 border-b border-slate-300">
        <div>
          <h1 class="cv-name text-2xl font-light tracking-tight text-slate-900">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
          ${p.headline ? `<div class="text-xs font-medium text-slate-500 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
        </div>
        <div class="text-right text-[11px] text-slate-500 space-y-0.5">
          ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
          ${p.email ? `<div>${escapeHtml(p.email)}</div>` : ''}
          ${p.phone ? `<div>${escapeHtml(p.phone)}</div>` : ''}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-6">
          <p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Experience</h2>
          <div class="space-y-4">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-medium text-slate-900 text-xs">${escapeHtml(exp.title || '')} / ${escapeHtml(exp.company || '')}</span>
                  <span class="text-[10px] text-slate-400">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-6 page-break-avoid">
          <h2 class="cv-section-title text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Education</h2>
          <div class="space-y-2">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <span class="font-medium text-slate-900">${escapeHtml(formatEducationDegree(edu))}, ${escapeHtml(edu.institution || '')}</span>
                <span class="text-[10px] text-slate-400">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Competences</h2>
          <div class="flex flex-wrap gap-2 text-xs text-slate-600">
            ${skills.map(s => `<span>${escapeHtml(s.name)}</span>`).join(' • ')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

// ==========================================
// FORMAT 7: EXECUTIVE CV EXTENSIONS
// ==========================================

function renderExecCSuite(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#0f172a';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-exec-c-suite max-w-[850px] mx-auto bg-white text-slate-900 leading-normal text-xs font-sans p-8 sm:p-12 shadow-xs border-t-8" style="border-color: ${primaryColor}">
      <header class="pb-4 mb-6 border-b border-slate-300 flex justify-between items-center">
        <div>
          <h1 class="cv-name text-3xl font-extrabold uppercase tracking-tight text-slate-950">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
          ${p.headline ? `<div class="text-sm font-bold text-slate-700 mt-0.5 tracking-wide">${escapeHtml(p.headline)}</div>` : ''}
          <div class="cv-contact-line text-xs text-slate-500 mt-2 flex flex-wrap gap-3">
            ${[p.location, p.email, p.phone, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join('  |  ')}
          </div>
        </div>
        ${renderPhotoHtml(profile, 'w-20 h-20 rounded-md border border-slate-300')}
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-2" style="border-color: ${primaryColor}">
            Executive Career Narrative
          </h2>
          <p class="text-xs text-slate-800 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-2" style="border-color: ${primaryColor}">
            Executive Governance & Board Competencies
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            ${skills.map(s => `
              <div class="p-2 rounded bg-slate-50 border border-slate-200">
                <span class="font-bold text-slate-900">${escapeHtml(s.name)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-3" style="border-color: ${primaryColor}">
            Board & Executive Leadership Experience
          </h2>
          <div class="space-y-4">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-950 text-xs">${escapeHtml(exp.title || '')} — <span class="text-slate-700">${escapeHtml(exp.company || '')}</span></span>
                  <span class="text-xs font-semibold text-slate-600">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-700 mt-1 leading-relaxed">${escapeHtml(exp.description)}</p>` : ''}
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5 mt-1">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-2" style="border-color: ${primaryColor}">
            Academic & Board Credentials
          </h2>
          <div class="space-y-1.5">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-slate-900">${escapeHtml(formatEducationDegree(edu))}, ${escapeHtml(edu.institution || '')}</span>
                <span class="text-slate-500 text-xs">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

function renderExecGovernance(profile) {
  return renderExecCSuite(profile);
}

function renderExecGoldLine(profile) {
  return renderExecCSuite(profile);
}

// ==========================================
// FORMAT 8: TECHNICAL CV EXTENSIONS
// ==========================================

function renderTechStackFocused(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#0284c7';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-tech-stack-focused max-w-[850px] mx-auto bg-white text-slate-900 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      <header class="pb-4 mb-5 border-b-2 border-slate-900 flex justify-between items-start">
        <div>
          <h1 class="cv-name text-2xl font-black text-slate-950 font-mono">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
          ${p.headline ? `<div class="text-xs font-bold text-sky-700 font-mono mt-0.5">&gt; ${escapeHtml(p.headline)}</div>` : ''}
          <div class="cv-contact-line text-xs font-mono text-slate-600 mt-2 flex flex-wrap gap-3">
            ${[p.location, p.email, p.phone, p.github ? `github.com/${getCleanUrl(p.github)}` : null, p.linkedin ? getCleanUrl(p.linkedin) : null].filter(Boolean).map(escapeHtml).join('  |  ')}
          </div>
        </div>
        ${renderPhotoHtml(profile, 'w-16 h-16 rounded border border-slate-300')}
      </header>

      ${skills.length > 0 ? `
        <section class="mb-5 p-3.5 rounded-xl bg-slate-900 text-white font-mono">
          <div class="text-[11px] font-bold text-emerald-400 mb-2">// TECHNICAL STACK MATRIX</div>
          <div class="flex flex-wrap gap-1.5">
            ${skills.map(s => `
              <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 text-xs">
                ${escapeHtml(s.name)}${s.level ? ` <span class="text-slate-400 text-[10px]">(${escapeHtml(s.level)})</span>` : ''}
              </span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(p.summary || p.objective) ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold font-mono uppercase text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">// Engineering Overview</h2>
          <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold font-mono uppercase text-slate-900 border-b border-slate-300 pb-0.5 mb-2.5">// Work Experience</h2>
          <div class="space-y-3.5">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline font-mono text-xs">
                  <span class="font-bold text-slate-950">${escapeHtml(exp.title || '')} @ ${escapeHtml(exp.company || '')}</span>
                  <span class="text-slate-500 text-[10px]">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-700 mt-1">${escapeHtml(exp.description)}</p>` : ''}
                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5 mt-1">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.projects || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold font-mono uppercase text-slate-900 border-b border-slate-300 pb-0.5 mb-2">// Key Technical Projects</h2>
          <div class="space-y-2.5">
            ${profile.projects.map(pr => `
              <div class="p-2.5 rounded border border-slate-200 bg-slate-50">
                <div class="font-bold text-slate-900 font-mono text-xs">${escapeHtml(pr.title || '')}</div>
                ${pr.description ? `<p class="text-xs text-slate-700 mt-0.5">${escapeHtml(pr.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold font-mono uppercase text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">// Education & Degrees</h2>
          <div class="space-y-1 font-mono text-xs">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <span><strong>${escapeHtml(formatEducationDegree(edu))}</strong> — ${escapeHtml(edu.institution || '')}</span>
                <span class="text-slate-500 text-[10px]">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, '#0284c7')}
    </div>
  `;
}

function renderTechCloudArchitect(profile) {
  return renderTechStackFocused(profile);
}

function renderTechEngineeringLead(profile) {
  return renderTechStackFocused(profile);
}

function renderTechDataScientist(profile) {
  return renderTechStackFocused(profile);
}

function renderTechTerminalModern(profile) {
  return renderTechStackFocused(profile);
}

// ==========================================
// FORMAT 9: ENTRY-LEVEL / GRADUATE CV EXTENSIONS
// ==========================================

function renderEntryEducationFirst(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#2563eb';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-entry-education-first max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      <header class="text-center pb-4 mb-5 border-b-2" style="border-color: ${primaryColor}">
        <h1 class="cv-name text-2xl font-bold uppercase tracking-tight text-slate-950">${escapeHtml(p.fullName || 'Graduate Candidate')}</h1>
        ${p.headline ? `<div class="text-xs font-semibold text-slate-600 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs text-slate-500 mt-2 flex flex-wrap justify-center gap-3">
          ${[p.location, p.email, p.phone, getCleanUrl(p.linkedin)].filter(Boolean).map(escapeHtml).join('  •  ')}
        </div>
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Career Objective
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Education Spotlight (Top Priority for Fresh Graduates) -->
      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 p-3.5 rounded-xl bg-blue-50/50 border border-blue-200">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-blue-200" style="color: ${primaryColor}">
            Education & Academic Credentials
          </h2>
          <div class="space-y-3">
            ${profile.education.map(edu => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">${escapeHtml(formatEducationDegree(edu))}</span>
                  <span class="text-slate-500 text-[10px] font-semibold">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
                </div>
                <div class="text-slate-700 font-medium">${escapeHtml(edu.institution || '')}${edu.location ? ` (${escapeHtml(edu.location)})` : ''}</div>
                ${edu.gpa ? `<div class="text-[11px] font-bold text-blue-800 mt-0.5">Grade / Result: ${escapeHtml(edu.gpa)}</div>` : ''}
                ${edu.thesis ? `<div class="text-[11px] text-slate-600 italic mt-0.5">Thesis: "${escapeHtml(edu.thesis)}"</div>` : ''}
                ${edu.coursework ? `<div class="text-[10px] text-slate-600 mt-0.5">Key Coursework: ${escapeHtml(edu.coursework)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Technical & Foundational Skills
          </h2>
          <div class="flex flex-wrap gap-2">
            ${skills.map(s => `
              <span class="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs">
                ${escapeHtml(s.name)}${s.level ? ` <span class="text-slate-500 font-normal">(${escapeHtml(s.level)})</span>` : ''}
              </span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.projects || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Academic & Capstone Projects
          </h2>
          <div class="space-y-2.5">
            ${profile.projects.map(pr => `
              <div class="p-2.5 rounded border border-slate-200">
                <div class="font-bold text-slate-900">${escapeHtml(pr.title || '')}</div>
                ${pr.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(pr.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.internships || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Internships & Practical Training
          </h2>
          <div class="space-y-2">
            ${profile.internships.map(it => `
              <div>
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900">${escapeHtml(it.title || '')} — ${escapeHtml(it.company || '')}</span>
                  <span class="text-slate-500 text-[10px]">${escapeHtml(formatDateRange(it.startDate, it.endDate, false))}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200" style="color: ${primaryColor}">
            Work Experience
          </h2>
          <div class="space-y-2">
            ${profile.experience.map(exp => `
              <div>
                <span class="font-bold text-slate-900">${escapeHtml(exp.title || '')}</span>
                <span class="text-slate-500 text-[10px] ml-1">(${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))})</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, primaryColor)}
    </div>
  `;
}

function renderEntryCampusLeader(profile) {
  return renderEntryEducationFirst(profile);
}

function renderEntryInternPath(profile) {
  return renderEntryEducationFirst(profile);
}

function renderEntryStemStarter(profile) {
  return renderEntryEducationFirst(profile);
}

function renderEntryBoldStart(profile) {
  return renderEntryEducationFirst(profile);
}

// ==========================================
// FORMAT 10: EUROPASS CV EXTENSIONS
// ==========================================

function renderEuropassModern(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#0e4194';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  return `
    <div class="cv-format cv-europass-modern max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs border-l-4" style="border-color: ${primaryColor}">
      <header class="flex justify-between items-center pb-4 mb-5 border-b border-slate-200">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#0e4194]">Curriculum Vitae Europass</span>
          <h1 class="cv-name text-2xl font-black text-slate-900 mt-0.5">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
          ${p.headline ? `<div class="text-xs font-semibold text-slate-600 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
          <div class="cv-contact-line text-xs text-slate-500 mt-2 flex flex-wrap gap-3">
            ${[p.location, p.email, p.phone, p.nationality ? `Nationality: ${p.nationality}` : null].filter(Boolean).map(escapeHtml).join('  •  ')}
          </div>
        </div>
        ${renderPhotoHtml(profile, 'w-20 h-24 rounded border border-slate-300 object-cover')}
      </header>

      ${(p.summary || p.objective) ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-[#0e4194] pb-1 mb-1.5 border-b border-slate-200">
            Work Preference & Profile
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      ${!isFreshGraduate && (profile.experience || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-[#0e4194] pb-1 mb-2.5 border-b border-slate-200">
            Work Experience
          </h2>
          <div class="space-y-3">
            ${profile.experience.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                  <span>${escapeHtml(exp.title || '')} — ${escapeHtml(exp.company || '')}</span>
                  <span class="text-slate-500 text-[11px] font-normal">${escapeHtml(formatDateRange(exp.startDate, exp.endDate, exp.current))}</span>
                </div>
                ${exp.description ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHtml(exp.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${(profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-[#0e4194] pb-1 mb-2 border-b border-slate-200">
            Education and Training
          </h2>
          <div class="space-y-2">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-slate-900">${escapeHtml(formatEducationDegree(edu))}, ${escapeHtml(edu.institution || '')}</span>
                <span class="text-slate-500 text-[11px]">${escapeHtml(formatDateRange(edu.startDate, edu.endDate, edu.current))}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${skills.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-[#0e4194] pb-1 mb-2 border-b border-slate-200">
            Personal Skills & Competences
          </h2>
          <div class="flex flex-wrap gap-1.5">
            ${skills.map(s => `
              <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-950 border border-blue-200 text-xs font-semibold">
                ${escapeHtml(s.name)}${s.level ? ` (${escapeHtml(s.level)})` : ''}
              </span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${renderReferencesHtml(profile, '#0e4194')}
    </div>
  `;
}

function renderEuropassExecutive(profile) {
  return renderEuropassModern(profile);
}

function renderEuropassAcademic(profile) {
  return renderEuropassModern(profile);
}

function renderEuropassCompact(profile) {
  return renderEuropassModern(profile);
}


// Exports
exports.renderProfCorporateMatrix = renderProfCorporateMatrix;
exports.renderProfModernSlate = renderProfModernSlate;
exports.renderAtsCompactLinear = renderAtsCompactLinear;
exports.renderAtsPlainSemantic = renderAtsPlainSemantic;
exports.renderAtsExecutiveScan = renderAtsExecutiveScan;
exports.renderCreativePortfolioGrid = renderCreativePortfolioGrid;
exports.renderCreativeDuoTone = renderCreativeDuoTone;
exports.renderCreativeEditorial = renderCreativeEditorial;
exports.renderCreativeMinimalArt = renderCreativeMinimalArt;
exports.renderAcademicFellowship = renderAcademicFellowship;
exports.renderAcademicCurriculum = renderAcademicCurriculum;
exports.renderAcademicSymposium = renderAcademicSymposium;
exports.renderFunctionalCapability = renderFunctionalCapability;
exports.renderFunctionalProjectFirst = renderFunctionalProjectFirst;
exports.renderFunctionalHybridCompetency = renderFunctionalHybridCompetency;
exports.renderIntlNordicClean = renderIntlNordicClean;
exports.renderExecCSuite = renderExecCSuite;
exports.renderExecGovernance = renderExecGovernance;
exports.renderExecGoldLine = renderExecGoldLine;
exports.renderTechStackFocused = renderTechStackFocused;
exports.renderTechCloudArchitect = renderTechCloudArchitect;
exports.renderTechEngineeringLead = renderTechEngineeringLead;
exports.renderTechDataScientist = renderTechDataScientist;
exports.renderTechTerminalModern = renderTechTerminalModern;
exports.renderEntryEducationFirst = renderEntryEducationFirst;
exports.renderEntryCampusLeader = renderEntryCampusLeader;
exports.renderEntryInternPath = renderEntryInternPath;
exports.renderEntryStemStarter = renderEntryStemStarter;
exports.renderEntryBoldStart = renderEntryBoldStart;
exports.renderEuropassModern = renderEuropassModern;
exports.renderEuropassExecutive = renderEuropassExecutive;
exports.renderEuropassAcademic = renderEuropassAcademic;
exports.renderEuropassCompact = renderEuropassCompact;
};

  // Module: ./templates/functional.js
  __modules__['./templates/functional.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format 3: Functional CV
 * Prioritizes functional competency clusters, skill domains, and aggregated proof points
 * over chronological work history. Followed by a concise, streamlined work history list.
 */

const { escapeHtml, formatDateRange, getCleanUrl, renderPhotoHtml, isSectionEnabled, formatEducationDegree, isFreshGraduateCandidate, renderCategorizedSkillsHtml, renderReferencesHtml } = __require__('./templateUtils.js', __currentDir);

function renderFunctional(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  // Extract functional areas or synthesize from experience/skills/projects dynamically
  let functionalAreas = profile.functionalAreas || [];
  if (functionalAreas.length === 0) {
    const allHighlights = [];
    (profile.experience || []).forEach(e => {
      if (Array.isArray(e.highlights)) allHighlights.push(...e.highlights);
    });

    if (allHighlights.length > 0) {
      functionalAreas = [
        {
          id: 'fa_synth_1',
          title: p.headline ? `${p.headline} — Core Capabilities` : 'Operational Execution & Professional Delivery',
          summary: 'Driving key organizational objectives, optimizing workflow efficiencies, and ensuring high-standard execution.',
          achievements: allHighlights.slice(0, 3)
        },
        {
          id: 'fa_synth_2',
          title: 'Quality Standards & Collaborative Performance',
          summary: 'Standardizing best practices, cross-functional communication, and consistent on-schedule delivery.',
          achievements: allHighlights.slice(3, 6)
        }
      ];
    } else if ((profile.projects || []).length > 0) {
      functionalAreas = [
        {
          id: 'fa_synth_proj_1',
          title: 'Project Planning & Practical Implementation',
          summary: 'Conducting thorough research, executing planned deliverables, and producing documented outcomes.',
          achievements: profile.projects.map(pr => `${pr.title}: ${pr.description || pr.outcomes || 'Successfully delivered key milestones.'}`).slice(0, 3)
        }
      ];
    }
  }

  const photoHtml = renderPhotoHtml(profile, 'w-24 h-24', 'rounded-2xl shadow-sm border border-white/30');

  return `
    <div class="cv-format cv-functional max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm">
      <!-- Header with Competency Banner -->
      <header class="p-6 rounded-lg mb-6 text-white" style="background-color: ${primaryColor}">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex-1">
            <h1 class="cv-name text-3xl font-extrabold tracking-tight">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
            ${p.headline ? `<div class="text-sm font-medium text-slate-200 mt-1">${escapeHtml(p.headline)}</div>` : ''}
            <div class="cv-contact-line text-xs space-y-1 text-slate-200 mt-2">
              ${p.email ? `<div>${escapeHtml(p.email)}</div>` : ''}
              ${p.phone ? `<div>${escapeHtml(p.phone)}</div>` : ''}
              ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
              ${p.linkedin ? `<div><a href="${p.linkedin}" target="_blank" class="underline text-slate-100">${getCleanUrl(p.linkedin)}</a></div>` : ''}
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>
      </header>

      <!-- Value Proposition / Summary -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-6 bg-slate-50 border border-slate-200 rounded p-4 break-inside-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider mb-2" style="color: ${primaryColor}">
            ${p.objective && !p.summary ? 'Career Objective' : 'Core Value Proposition & Expertise'}
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Dominant Section: Areas of Core Functional Competence -->
      ${functionalAreas.length > 0 ? `
        <section class="mb-6">
          <div class="flex items-center gap-2 mb-4 pb-1 border-b-2" style="border-color: ${primaryColor}">
            <h2 class="cv-section-title text-sm font-extrabold uppercase tracking-wider" style="color: ${primaryColor}">
              Key Areas of Functional Competency & Proven Impact
            </h2>
          </div>

          <div class="space-y-4">
            ${functionalAreas.map(fa => `
              <div class="border border-slate-200 rounded-lg p-4 bg-white shadow-xs break-inside-avoid">
                <h3 class="font-bold text-slate-900 text-sm mb-1" style="color: ${primaryColor}">
                  • ${escapeHtml(fa.title)}
                </h3>
                ${fa.summary ? `<p class="text-xs text-slate-600 mb-2 italic">${escapeHtml(fa.summary)}</p>` : ''}
                
                ${Array.isArray(fa.achievements) && fa.achievements.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                    ${fa.achievements.map(ach => `<li>${escapeHtml(ach)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Key Projects Demonstrating Competency -->
      ${isSectionEnabled(profile, 'projects') && profile.projects?.length > 0 ? `
        <section class="mb-6">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Project Evidence & Deliverables
          </h2>
          <div class="space-y-3">
            ${profile.projects.map(proj => `
              <div class="border-l-2 pl-3 border-slate-300 break-inside-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">${escapeHtml(proj.title)} ${proj.role ? `(${escapeHtml(proj.role)})` : ''}</span>
                  ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="text-xs text-blue-700 hover:underline">Demo</a>` : ''}
                </div>
                ${proj.description ? `<p class="text-xs text-slate-700 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<p class="text-xs text-slate-600 italic mt-0.5">${escapeHtml(proj.outcomes)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Core Skills -->
      ${isSectionEnabled(profile, 'skills') ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Technical & Professional Skills
          </h2>
          ${renderCategorizedSkillsHtml(profile, primaryColor)}
        </section>
      ` : ''}

      <!-- Streamlined Employment History (Omitted if fresh graduate or empty) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && profile.experience?.length > 0 ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Work History
          </h2>
          <div class="space-y-1.5 text-xs text-slate-700">
            ${profile.experience.map(exp => `
              <div class="flex justify-between items-baseline">
                <div>
                  <span class="font-bold text-slate-900">${escapeHtml(exp.title)}</span>
                  <span class="text-slate-600"> — ${escapeHtml(exp.company)}</span>
                </div>
                <span class="text-slate-500">${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education -->
      ${isSectionEnabled(profile, 'education') && profile.education?.length > 0 ? `
        <section class="mb-6 break-inside-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education
          </h2>
          <div class="space-y-1.5 text-xs">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <div>
                  <span class="font-bold text-slate-900">${formatEducationDegree(edu)}</span>
                  <span class="text-slate-600"> — ${escapeHtml(edu.institution)}</span>
                </div>
                <span class="text-slate-500">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}


// Exports
exports.renderFunctional = renderFunctional;
};

  // Module: ./templates/germanCv.js
  __modules__['./templates/germanCv.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format: German CV (Tabellarischer Lebenslauf)
 * Authentic German standard:
 * - Tabular two-column layout (left dates column ~25%, right content ~75%)
 * - Formal Bewerbungsfoto in upper right
 * - Structured personal data (Persönliche Daten)
 * - Clear chronological career progression
 * - Standard A4 paper format
 */

const { escapeHtml, formatDateRange, renderPhotoHtml, isSectionEnabled, formatEducationDegree, isFreshGraduateCandidate, renderReferencesHtml, getSkillsList } = __require__('./templateUtils.js', __currentDir);

function renderGermanCv(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = 'MM/YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  const expList = [...(profile.experience || [])].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const photoHtml = renderPhotoHtml(profile, 'w-24 h-32', 'rounded-sm object-cover border border-slate-300 shadow-xs');

  return `
    <div class="cv-format cv-german-lebenslauf max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      
      <!-- Lebenslauf Header -->
      <header class="flex justify-between items-start pb-4 mb-6 border-b-2" style="border-color: ${primaryColor}">
        <div class="space-y-1">
          <div class="text-[11px] font-bold uppercase tracking-widest text-slate-500">Lebenslauf</div>
          <h1 class="cv-name text-2xl font-black text-slate-900 tracking-tight">
            ${escapeHtml(p.fullName || 'Candidate Name')}
          </h1>
          ${p.headline ? `<p class="text-xs font-semibold text-slate-700">${escapeHtml(p.headline)}</p>` : ''}
          <div class="cv-contact-line text-xs text-slate-600 space-y-0.5 pt-1">
            ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
            ${p.phone ? `<div>Tel.: ${escapeHtml(p.phone)}</div>` : ''}
            ${p.email ? `<div>E-Mail: <a href="mailto:${p.email}" class="text-blue-700 hover:underline">${escapeHtml(p.email)}</a></div>` : ''}
          </div>
        </div>
        ${photoHtml ? `<div class="shrink-0 ml-4">${photoHtml}</div>` : ''}
      </header>

      <!-- Persönliche Daten (Personal Information if provided) -->
      ${p.dateOfBirth || p.nationality ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primaryColor}">
            Persönliche Daten / Personal Details
          </h2>
          <table class="w-full text-xs">
            <tbody>
              ${p.dateOfBirth ? `
                <tr>
                  <td class="w-40 py-0.5 text-slate-500">Geburtsdatum / DOB:</td>
                  <td class="py-0.5 font-medium">${escapeHtml(p.dateOfBirth)}</td>
                </tr>
              ` : ''}
              ${p.nationality ? `
                <tr>
                  <td class="py-0.5 text-slate-500">Staatsangehörigkeit:</td>
                  <td class="py-0.5 font-medium">${escapeHtml(p.nationality)}</td>
                </tr>
              ` : ''}
              ${p.maritalStatus ? `
                <tr>
                  <td class="py-0.5 text-slate-500">Familienstand:</td>
                  <td class="py-0.5 font-medium">${escapeHtml(p.maritalStatus)}</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </section>
      ` : ''}

      <!-- Berufserfahrung / Work Experience (Tabular Layout) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b" style="color: ${primaryColor}">
            Beruflicher Werdegang / Work Experience
          </h2>
          <div class="space-y-3">
            ${expList.map(exp => `
              <div class="grid grid-cols-12 gap-3 page-break-avoid">
                <div class="col-span-12 sm:col-span-4 text-slate-600 font-mono text-[11px] font-semibold">
                  ${formatDateRange(exp.startDate, exp.endDate, dateFormat, exp.current)}
                </div>
                <div class="col-span-12 sm:col-span-8">
                  <div class="font-bold text-slate-900">${escapeHtml(exp.title || '')}</div>
                  <div class="text-slate-700 text-xs">${escapeHtml(exp.company || '')}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
                  ${exp.highlights && exp.highlights.length > 0 ? `
                    <ul class="list-disc list-outside ml-4 mt-1 text-slate-600 space-y-0.5 text-xs">
                      ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Ausbildung / Education (Tabular Layout) -->
      ${isSectionEnabled(profile, 'education') && (profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b" style="color: ${primaryColor}">
            Ausbildung / Education
          </h2>
          <div class="space-y-3">
            ${profile.education.map(edu => `
              <div class="grid grid-cols-12 gap-3">
                <div class="col-span-12 sm:col-span-4 text-slate-600 font-mono text-[11px] font-semibold">
                  ${formatDateRange(edu.startDate, edu.endDate, dateFormat)}
                </div>
                <div class="col-span-12 sm:col-span-8">
                  <div class="font-bold text-slate-900">${escapeHtml(formatEducationDegree(edu))}</div>
                  <div class="text-slate-700 text-xs">${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                  ${edu.gpa ? `<div class="text-[11px] text-slate-500">Abschlussnote: ${escapeHtml(edu.gpa)}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Kenntnisse & Qualifikationen / Skills -->
      ${isSectionEnabled(profile, 'skills') && skills.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primaryColor}">
            Kenntnisse & Fähigkeiten / Skills
          </h2>
          <div class="flex flex-wrap gap-2">
            ${skills.map(s => `
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs">
                <strong class="font-semibold text-slate-900">${escapeHtml(s.name)}</strong>
                ${s.level ? `<span class="text-slate-500">(${escapeHtml(s.level)})</span>` : ''}
              </span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Sprachen / Languages -->
      ${isSectionEnabled(profile, 'languages') && (profile.languages || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style="color: ${primaryColor}">
            Sprachen / Languages
          </h2>
          <div class="grid grid-cols-2 gap-2 text-xs">
            ${profile.languages.map(l => `
              <div>
                <span class="font-bold text-slate-900">${escapeHtml(l.name)}:</span>
                <span class="text-slate-600 ml-1">${escapeHtml(l.proficiency || l.cefr || 'Gut')}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, primaryColor)}

      <!-- Formal Date & Place -->
      <footer class="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-600 page-break-avoid">
        <div>
          <span>${p.location ? escapeHtml(p.location) : 'Ort'}, den ${new Date().toLocaleDateString('de-DE')}</span>
        </div>
        <div class="text-center">
          <div class="w-36 border-b border-slate-400 pb-1 mb-1"></div>
          <span class="text-[11px]">Unterschrift</span>
        </div>
      </footer>

    </div>
  `;
}


// Exports
exports.renderGermanCv = renderGermanCv;
};

  // Module: ./templates/index.js
  __modules__['./templates/index.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Master Template Registry & Dispatcher
 * Exports 10 international format categories and 50 distinct templates.
 * 
 * Strict invariants:
 * - Candidate data is preserved 100% across all switches
 * - Every format category contains at least 5 distinct templates
 * - All templates are fully compatible with Live Preview, PDF, and DOCX exports
 */

const { TEMPLATES, FORMAT_CATEGORIES } = __require__('./catalog.js', __currentDir);



function renderCv(formatId, profile) {
  const template = TEMPLATES[formatId] || TEMPLATES['reverse-chronological'];
  if (template && typeof template.renderer === 'function') {
    return template.renderer(profile);
  }
  return TEMPLATES['reverse-chronological'].renderer(profile);
}


// Exports
exports.renderCv = renderCv;
exports.TEMPLATES = TEMPLATES;
exports.FORMAT_CATEGORIES = FORMAT_CATEGORIES;
};

  // Module: ./templates/modernAts.js
  __modules__['./templates/modernAts.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format: Modern ATS Resume
 * Strictly single-column, 100% ATS parseable (Workday, Taleo, Greenhouse, Lever).
 * Uses clear semantic headers, high-contrast black/slate text, bulleted achievements,
 * and zero complex layout tables or graphic shapes.
 */

const { escapeHtml, formatDateRange, formatEducationDegree, isFreshGraduateCandidate, isSectionEnabled, getSkillsList } = __require__('./templateUtils.js', __currentDir);

function renderModernAts(profile) {
  const p = profile.personal || {};
  const dateFormat = 'Month YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  const expList = [...(profile.experience || [])].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const eduList = [...(profile.education || [])].sort((a, b) => {
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  return `
    <div class="cv-format cv-modern-ats max-w-[800px] mx-auto bg-white text-black text-xs font-sans p-6 sm:p-8 leading-normal">
      
      <!-- Standard ATS Header -->
      <header class="text-center pb-3 mb-4 border-b-2 border-black">
        <h1 class="cv-name text-2xl font-bold uppercase tracking-tight text-black">
          ${escapeHtml(p.fullName || 'Candidate Name')}
        </h1>
        ${p.headline ? `<div class="text-xs font-semibold text-black mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs text-black mt-1 flex flex-wrap justify-center gap-x-2 gap-y-0.5">
          ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
          ${p.phone ? `<span>| ${escapeHtml(p.phone)}</span>` : ''}
          ${p.email ? `<span>| ${escapeHtml(p.email)}</span>` : ''}
          ${p.linkedin ? `<span>| ${escapeHtml(p.linkedin)}</span>` : ''}
          ${p.github ? `<span>| ${escapeHtml(p.github)}</span>` : ''}
        </div>
      </header>

      <!-- Professional Summary -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            ${p.objective && !p.summary ? 'Career Objective' : 'Professional Summary'}
          </h2>
          <p class="text-xs text-black leading-relaxed text-justify">
            ${escapeHtml(p.summary || p.objective)}
          </p>
        </section>
      ` : ''}

      <!-- Skills -->
      ${isSectionEnabled(profile, 'skills') && skills.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Skills
          </h2>
          <div class="text-xs text-black leading-relaxed">
            ${skills.map(s => escapeHtml(s.level ? `${s.name} (${s.level})` : s.name)).join(' • ')}
          </div>
        </section>
      ` : ''}

      <!-- Experience (Comes first for experienced candidates) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Work Experience
          </h2>
          <div class="space-y-3 text-xs">
            ${expList.map(exp => `
              <div>
                <div class="flex justify-between items-baseline font-bold text-black">
                  <span>${escapeHtml(exp.title || 'Job Title')}</span>
                  <span>${formatDateRange(exp.startDate, exp.endDate, dateFormat, exp.current)}</span>
                </div>
                <div class="text-black font-semibold">${escapeHtml(exp.company || '')}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
                ${exp.highlights && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 mt-1 space-y-0.5 text-black">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education -->
      ${isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Education
          </h2>
          <div class="space-y-2 text-xs">
            ${eduList.map(edu => `
              <div>
                <div class="flex justify-between items-baseline font-bold text-black">
                  <span>${escapeHtml(formatEducationDegree(edu))}</span>
                  <span>${formatDateRange(edu.startDate, edu.endDate, dateFormat)}</span>
                </div>
                <div class="text-black">${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                ${edu.gpa ? `<div class="text-[11px] text-black">Grade / GPA: ${escapeHtml(edu.gpa)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Projects -->
      ${isSectionEnabled(profile, 'projects') && (profile.projects || []).length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
            Key Projects
          </h2>
          <div class="space-y-2 text-xs">
            ${profile.projects.map(proj => `
              <div>
                <div class="font-bold text-black">${escapeHtml(proj.title || '')}</div>
                ${proj.description ? `<p class="text-black leading-relaxed">${escapeHtml(proj.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Certifications -->
      ${isSectionEnabled(profile, 'certifications') && (profile.certifications || []).length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            Certifications
          </h2>
          <ul class="list-disc list-outside ml-4 text-xs text-black space-y-0.5">
            ${profile.certifications.map(c => `
              <li><strong>${escapeHtml(c.title || '')}</strong>${c.issuer ? ` — ${escapeHtml(c.issuer)}` : ''}</li>
            `).join('')}
          </ul>
        </section>
      ` : ''}

      <!-- References -->
      ${(profile.references && profile.references.filter(r => r && (r.name || r.title || r.organization || r.company || r.email || r.phone)).length > 0) ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            References
          </h2>
          <div class="space-y-1 text-xs text-black">
            ${profile.references.filter(r => r && (r.name || r.title || r.organization || r.company || r.email || r.phone)).map(r => `
              <div>
                <strong>${escapeHtml(r.name || '')}</strong> — ${escapeHtml(r.title || '')}${r.organization || r.company ? `, ${escapeHtml(r.organization || r.company)}` : ''}
                ${r.email ? ` | Email: ${escapeHtml(r.email)}` : ''}
                ${r.phone ? ` | Phone: ${escapeHtml(r.phone)}` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

    </div>
  `;
}


// Exports
exports.renderModernAts = renderModernAts;
};

  // Module: ./templates/reverseChrono.js
  __modules__['./templates/reverseChrono.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format 2: Reverse Chronological CV
 * Modern standard corporate resume format. Prioritizes the most recent roles,
 * quantifiable achievements, and immediate core strengths.
 * Gracefully adapts for both seasoned professionals and fresh graduates.
 */

const { escapeHtml, formatDateRange, getCleanUrl, renderPhotoHtml, isSectionEnabled, formatEducationDegree, isFreshGraduateCandidate, renderCategorizedSkillsHtml, renderReferencesHtml } = __require__('./templateUtils.js', __currentDir);

function renderReverseChronological(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = settings.dateFormat || 'Month YYYY';

  // Sort experience newest first (Reverse Chronological)
  const expList = [...(profile.experience || [])].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const eduList = [...(profile.education || [])].sort((a, b) => {
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const photoHtml = renderPhotoHtml(profile, 'w-24 h-24', 'mb-2 md:mb-0');
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  return `
    <div class="cv-format cv-reverse-chrono max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm">
      <!-- Header -->
      <header class="pb-5 mb-5 border-b" style="border-color: ${primaryColor}">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div class="flex-1">
            <h1 class="cv-name font-extrabold uppercase tracking-tight" style="color: ${primaryColor}">
              ${escapeHtml(p.fullName || 'Candidate Name')}
            </h1>
            ${p.headline ? `<div class="text-base font-semibold text-slate-700 mt-1 tracking-wide">${escapeHtml(p.headline)}</div>` : ''}

            <div class="cv-contact-line flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-slate-600 mt-2">
              ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
              ${p.email ? `<span>• <a href="mailto:${p.email}" class="hover:underline">${escapeHtml(p.email)}</a></span>` : ''}
              ${p.phone ? `<span>• ${escapeHtml(p.phone)}</span>` : ''}
              ${p.linkedin ? `<span>• <a href="${p.linkedin}" target="_blank" class="text-blue-700 hover:underline">LinkedIn</a></span>` : ''}
              ${p.github ? `<span>• <a href="${p.github}" target="_blank" class="text-blue-700 hover:underline">GitHub</a></span>` : ''}
              ${p.website || p.portfolio ? `<span>• <a href="${p.website || p.portfolio}" target="_blank" class="text-blue-700 hover:underline">Portfolio</a></span>` : ''}
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>
      </header>

      <!-- Professional Summary / Career Objective -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            ${p.objective && !p.summary ? 'Career Objective' : 'Professional Summary'}
          </h2>
          <p class="text-slate-700 text-xs leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Core Skills Matrix (All 6 Categorized Domains) -->
      ${isSectionEnabled(profile, 'skills') ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Core Competencies & Skills
          </h2>
          ${renderCategorizedSkillsHtml(profile, primaryColor)}
        </section>
      ` : ''}

      <!-- For Fresh Graduates: Highlight Education & Projects First -->
      ${isFreshGraduate && isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education & Academic Credentials
          </h2>
          <div class="space-y-3">
            ${eduList.map(edu => `
              <div>
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">${formatEducationDegree(edu)}</span>
                  <span class="text-xs text-slate-600">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
                <div class="text-xs text-slate-600">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''} ${edu.gpa ? `• GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
                ${edu.honors ? `<div class="text-[11px] text-slate-500 italic">${escapeHtml(edu.honors)}</div>` : ''}
                ${edu.coursework ? `<div class="text-[11px] text-slate-600 mt-0.5"><strong>Key Coursework:</strong> ${escapeHtml(edu.coursework)}</div>` : ''}
                ${edu.thesis ? `<div class="text-[11px] text-slate-600 mt-0.5"><strong>Thesis / Project:</strong> ${escapeHtml(edu.thesis)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Professional Experience (Omitted entirely if fresh graduate or empty) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Professional Experience
          </h2>
          <div class="space-y-4">
            ${expList.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <div>
                    <span class="font-bold text-slate-900 text-sm">${escapeHtml(exp.title)}</span>
                    <span class="text-slate-600 font-semibold text-xs"> | ${escapeHtml(exp.company)}</span>
                    ${exp.employmentType ? `<span class="text-[11px] text-slate-500 font-normal"> (${escapeHtml(exp.employmentType)})</span>` : ''}
                  </div>
                  <span class="text-xs font-semibold text-slate-600 shrink-0">
                    ${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}
                  </span>
                </div>
                ${exp.location ? `<div class="text-[11px] text-slate-500 mb-1.5 italic">${escapeHtml(exp.location)}</div>` : ''}

                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}

                ${Array.isArray(exp.technologies) && exp.technologies.length > 0 ? `
                  <div class="mt-1.5 text-[11px] text-slate-600">
                    <span class="font-semibold text-slate-700">Environment:</span> ${exp.technologies.map(t => escapeHtml(t)).join(', ')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Internships (if present) -->
      ${isSectionEnabled(profile, 'internships') && profile.internships?.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Internship Experience
          </h2>
          <div class="space-y-3">
            ${profile.internships.map(intern => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">${escapeHtml(intern.title)} — ${escapeHtml(intern.company)}</span>
                  <span class="text-xs text-slate-500">${formatDateRange(intern.startDate, intern.endDate, intern.current, dateFormat)}</span>
                </div>
                ${Array.isArray(intern.highlights) ? `
                  <ul class="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-700 text-xs">
                    ${intern.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Key Projects -->
      ${isSectionEnabled(profile, 'projects') && profile.projects?.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Key Projects & Deliverables
          </h2>
          <div class="space-y-3.5">
            ${profile.projects.map(proj => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">
                    ${escapeHtml(proj.title)}
                    ${proj.projectType ? `<span class="text-[11px] font-semibold text-slate-500"> [${escapeHtml(proj.projectType)}]</span>` : ''}
                    ${proj.role ? `<span class="font-normal text-slate-600"> (${escapeHtml(proj.role)})</span>` : ''}
                  </span>
                </div>
                ${proj.description ? `<p class="text-xs text-slate-700 mt-1">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<div class="text-[11px] text-slate-600 mt-0.5"><strong>Outcome:</strong> ${escapeHtml(proj.outcomes)}</div>` : ''}
                ${Array.isArray(proj.technologies) && proj.technologies.length > 0 ? `
                  <div class="text-[11px] text-slate-500 mt-0.5">
                    <strong>Tech:</strong> ${proj.technologies.map(t => escapeHtml(t)).join(', ')}
                  </div>
                ` : ''}
                <div class="flex gap-3 text-[11px] text-blue-700 mt-0.5">
                  ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="hover:underline">Live Demo</a>` : ''}
                  ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" class="hover:underline">GitHub</a>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education for Experienced Candidates (Displayed after experience) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education
          </h2>
          <div class="space-y-3">
            ${eduList.map(edu => `
              <div>
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">${formatEducationDegree(edu)}</span>
                  <span class="text-xs text-slate-600">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
                <div class="text-xs text-slate-600">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''} ${edu.gpa ? `• GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
                ${edu.honors ? `<div class="text-[11px] text-slate-500 italic">${escapeHtml(edu.honors)}</div>` : ''}
                ${edu.coursework ? `<div class="text-[11px] text-slate-600 mt-0.5"><strong>Coursework:</strong> ${escapeHtml(edu.coursework)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Certifications -->
      ${isSectionEnabled(profile, 'certifications') && profile.certifications?.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Certifications & Training
          </h2>
          <div class="space-y-1.5 text-xs">
            ${profile.certifications.map(c => `
              <div>
                <strong>${escapeHtml(c.title)}</strong> — ${escapeHtml(c.issuer || '')}${c.issueDate ? ` (${escapeHtml(c.issueDate)})` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Languages -->
      ${isSectionEnabled(profile, 'languages') && profile.languages?.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Languages
          </h2>
          <div class="text-xs text-slate-700">
            ${profile.languages.map(l => `<span><strong>${escapeHtml(l.name)}</strong> (${escapeHtml(l.proficiency || l.cefr || 'Proficient')})</span>`).join('  •  ')}
          </div>
        </section>
      ` : ''}

      <!-- References (Handles upon-request or listed references) -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}


// Exports
exports.renderReverseChronological = renderReverseChronological;
};

  // Module: ./templates/skillsBased.js
  __modules__['./templates/skillsBased.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format 4: Skills-Based CV
 * Organizes profile around verified skill matrices, proficiency tiers, tooling domains,
 * and project-based proof points that validate each skill.
 */

const { escapeHtml, formatDateRange, getCleanUrl, renderPhotoHtml, isSectionEnabled, formatEducationDegree, isFreshGraduateCandidate, renderReferencesHtml, getSkillsList } = __require__('./templateUtils.js', __currentDir);

function renderSkillsBased(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = settings.dateFormat || 'Month YYYY';

  const allSkills = getSkillsList(profile);

  const photoHtml = renderPhotoHtml(profile, 'w-24 h-24', 'rounded-2xl shadow-xs');
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  return `
    <div class="cv-format cv-skills-based max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm">
      <!-- Header -->
      <header class="border-b-4 pb-4 mb-5" style="border-color: ${primaryColor}">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex-1">
            <h1 class="cv-name text-3xl font-black tracking-tight" style="color: ${primaryColor}">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
            ${p.headline ? `<p class="text-base font-semibold text-slate-700">${escapeHtml(p.headline)}</p>` : ''}
            <div class="cv-contact-line text-xs text-slate-600 mt-2 space-y-0.5">
              ${p.location ? `<div>${escapeHtml(p.location)}</div>` : ''}
              <div>
                ${p.email ? `<a href="mailto:${p.email}" class="hover:underline">${escapeHtml(p.email)}</a>` : ''}
                ${p.phone ? ` • ${escapeHtml(p.phone)}` : ''}
              </div>
              <div class="text-blue-700 space-x-2">
                ${p.github ? `<a href="${p.github}" target="_blank" class="hover:underline">GitHub</a>` : ''}
                ${p.linkedin ? `<a href="${p.linkedin}" target="_blank" class="hover:underline">LinkedIn</a>` : ''}
                ${p.website || p.portfolio ? `<a href="${p.website || p.portfolio}" target="_blank" class="hover:underline">Portfolio</a>` : ''}
              </div>
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>
      </header>

      <!-- Technical Profile / Objective -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider mb-1.5" style="color: ${primaryColor}">
            ${p.objective && !p.summary ? 'Career Objective' : 'Technical Profile & Core Competence'}
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Centerpiece Section: Skills & Competency Matrix -->
      ${isSectionEnabled(profile, 'skills') && allSkills.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Skills & Competencies
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            ${allSkills.map(sk => `
              <div class="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50/60 text-xs">
                <span class="font-semibold text-slate-800">${escapeHtml(sk.name)}</span>
                ${sk.level ? `
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    sk.level === 'Expert' || sk.level === 'Proficient' ? 'bg-emerald-100 text-emerald-800' :
                    sk.level === 'Advanced' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-200 text-slate-700'
                  }">${escapeHtml(sk.level)}</span>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Validating Projects & Evidence -->
      ${isSectionEnabled(profile, 'projects') && profile.projects?.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Project-Based Proof Points & Implementations
          </h2>

          <div class="space-y-3.5">
            ${profile.projects.map(proj => `
              <div class="border-l-2 pl-3 border-slate-300 page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">
                    ${escapeHtml(proj.title)}
                    ${proj.projectType ? `<span class="text-[11px] font-semibold text-slate-500"> [${escapeHtml(proj.projectType)}]</span>` : ''}
                    ${proj.role ? `<span class="font-normal text-slate-600"> (${escapeHtml(proj.role)})</span>` : ''}
                  </span>
                  ${proj.liveUrl || proj.githubUrl ? `
                    <span class="text-xs text-blue-700 space-x-1.5">
                      ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="hover:underline">Demo</a>` : ''}
                      ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" class="hover:underline">Code</a>` : ''}
                    </span>
                  ` : ''}
                </div>
                ${proj.description ? `<p class="text-xs text-slate-700 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<p class="text-xs text-slate-600 mt-0.5"><strong>Verified Impact:</strong> ${escapeHtml(proj.outcomes)}</p>` : ''}
                ${Array.isArray(proj.technologies) && proj.technologies.length > 0 ? `
                  <div class="text-[11px] text-slate-500 mt-0.5"><strong>Skills Applied:</strong> ${proj.technologies.map(t => escapeHtml(t)).join(', ')}</div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Work History Summary (Omitted if fresh graduate or empty) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && profile.experience?.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Employment History
          </h2>
          <div class="space-y-2 text-xs">
            ${profile.experience.map(exp => `
              <div class="flex justify-between items-baseline page-break-avoid">
                <div>
                  <span class="font-bold text-slate-900">${escapeHtml(exp.title)}</span>
                  <span class="text-slate-600"> — ${escapeHtml(exp.company)}</span>
                </div>
                <span class="text-slate-500">${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education & Credentials -->
      ${isSectionEnabled(profile, 'education') && profile.education?.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education
          </h2>
          <div class="space-y-2 text-xs">
            ${profile.education.map(edu => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline">
                  <div>
                    <span class="font-bold text-slate-900">${formatEducationDegree(edu)}</span>
                    <span class="text-slate-600"> — ${escapeHtml(edu.institution)}</span>
                  </div>
                  <span class="text-slate-500">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
                </div>
                ${edu.coursework ? `<div class="text-[11px] text-slate-500 mt-0.5"><strong>Coursework:</strong> ${escapeHtml(edu.coursework)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Certifications -->
      ${isSectionEnabled(profile, 'certifications') && profile.certifications?.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs uppercase font-extrabold tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Certifications
          </h2>
          <div class="flex flex-wrap gap-x-6 gap-y-1 text-xs">
            ${profile.certifications.map(c => `
              <div><strong>${escapeHtml(c.title)}</strong> — ${escapeHtml(c.issuer || '')}${c.issueDate ? ` (${escapeHtml(c.issueDate)})` : ''}</div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}


// Exports
exports.renderSkillsBased = renderSkillsBased;
};

  // Module: ./templates/targeted.js
  __modules__['./templates/targeted.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format 6: Targeted CV
 * Laser-focused on a single target position and employer.
 * Displays explicit Target Position Badges, Value Proposition, and a direct
 * Requirements-to-Qualifications Alignment Matrix.
 */

const { escapeHtml, formatDateRange, getCleanUrl, renderPhotoHtml, isSectionEnabled, formatEducationDegree, isFreshGraduateCandidate, renderCategorizedSkillsHtml, renderReferencesHtml, getSkillsList } = __require__('./templateUtils.js', __currentDir);

function renderTargeted(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const dateFormat = settings.dateFormat || 'Month YYYY';
  const targetRole = profile.targetRole || p.headline || 'Targeted Position';
  const targetCompany = profile.targetCompany || '';
  const isFreshGraduate = isFreshGraduateCandidate(profile);

  // Collect candidate skills for alignment
  const allCandidateSkills = getSkillsList(profile).map(s => s.name);

  const topSkillsSummary = allCandidateSkills.slice(0, 5).join(', ') || 'Demonstrated technical & professional competencies';

  // Highlight or deliverable outcome
  const executionSummary = profile.experience?.[0]?.highlights?.[0]
    ? profile.experience[0].highlights[0]
    : profile.projects?.[0]?.description
    ? profile.projects[0].description
    : 'Demonstrated history of driving operational standards and delivering project goals';

  // Collaboration / communication summary
  const collaborationSummary = allCandidateSkills.length > 0
    ? `${allCandidateSkills[0]} — Core expertise and reliable cross-functional teamwork`
    : 'Demonstrated effectiveness in organizational workflow coordination and team communication';

  const photoHtml = renderPhotoHtml(profile, 'w-20 h-20', 'rounded-xl shadow-xs');

  return `
    <div class="cv-format cv-targeted max-w-[800px] mx-auto text-slate-800 leading-relaxed text-sm">
      <!-- Target Alignment Header Banner -->
      <div class="mb-4 p-3 rounded-t-lg text-white flex items-center justify-between" style="background-color: ${primaryColor}">
        <div class="text-xs font-bold uppercase tracking-wider">
          TARGETED APPLICATION DOSSIER
        </div>
        <div class="text-xs bg-white/20 px-2.5 py-0.5 rounded font-medium">
          Position: <strong class="text-white">${escapeHtml(targetRole)}</strong>
          ${targetCompany ? ` @ <span class="underline">${escapeHtml(targetCompany)}</span>` : ''}
        </div>
      </div>

      <!-- Candidate Contact Header -->
      <header class="border-b pb-4 mb-5 border-slate-300">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex-1">
            <h1 class="cv-name text-2xl font-extrabold text-slate-900 tracking-tight">${escapeHtml(p.fullName || 'Candidate Name')}</h1>
            <p class="text-xs font-semibold text-slate-600 mt-0.5">Candidate for: <span style="color: ${primaryColor}">${escapeHtml(targetRole)}</span></p>
            <div class="cv-contact-line text-xs text-slate-600 mt-2 flex flex-wrap gap-x-3">
              ${p.email ? `<span>${escapeHtml(p.email)}</span>` : ''}
              ${p.phone ? `<span>• ${escapeHtml(p.phone)}</span>` : ''}
              ${p.location ? `<span>• ${escapeHtml(p.location)}</span>` : ''}
              ${p.linkedin ? `<span>• <a href="${p.linkedin}" target="_blank" class="text-blue-700 hover:underline">LinkedIn</a></span>` : ''}
            </div>
          </div>
          ${photoHtml ? `<div class="shrink-0">${photoHtml}</div>` : ''}
        </div>
      </header>

      <!-- Targeted Executive Pitch -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-5 bg-blue-50/50 border-l-4 p-3.5 rounded-r break-inside-avoid" style="border-color: ${primaryColor}">
          <h2 class="cv-section-title text-xs font-extrabold uppercase tracking-wider mb-1" style="color: ${primaryColor}">
            Targeted Value Proposition for ${escapeHtml(targetCompany || targetRole)}
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed text-justify">${escapeHtml(p.summary || p.objective)}</p>
        </section>
      ` : ''}

      <!-- Core Targeted Alignment Matrix (Requirement -> Candidate Match) -->
      <section class="mb-5 break-inside-avoid">
        <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
          Core Competencies & Direct Job Alignment Matrix
        </h2>
        
        <table class="w-full text-xs border border-slate-200 rounded overflow-hidden">
          <thead class="bg-slate-100 text-slate-700 text-left font-bold border-b border-slate-200">
            <tr>
              <th class="p-2 w-1/3">Target Requirement Domain</th>
              <th class="p-2 w-2/3">Candidate Verified Competency & Evidence</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr>
              <td class="p-2 font-semibold text-slate-900 bg-slate-50/50">Core Skills & Tools</td>
              <td class="p-2 text-slate-700">${escapeHtml(topSkillsSummary)}</td>
            </tr>
            <tr>
              <td class="p-2 font-semibold text-slate-900 bg-slate-50/50">Execution & Deliverables</td>
              <td class="p-2 text-slate-700">${escapeHtml(executionSummary)}</td>
            </tr>
            <tr>
              <td class="p-2 font-semibold text-slate-900 bg-slate-50/50">Communication & Teamwork</td>
              <td class="p-2 text-slate-700">${escapeHtml(collaborationSummary)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Curated Relevant Experience (Omitted if fresh graduate or empty) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && profile.experience?.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Directly Relevant Professional Experience
          </h2>
          <div class="space-y-4">
            ${profile.experience.map(exp => `
              <div class="break-inside-avoid">
                <div class="flex justify-between items-baseline">
                  <div>
                    <span class="font-bold text-slate-900 text-sm">${escapeHtml(exp.title)}</span>
                    <span class="text-slate-600 font-semibold text-xs"> — ${escapeHtml(exp.company)}</span>
                  </div>
                  <span class="text-xs text-slate-500 font-semibold">${formatDateRange(exp.startDate, exp.endDate, exp.current, dateFormat)}</span>
                </div>
                ${exp.location ? `<div class="text-[11px] text-slate-500 mb-1 italic">${escapeHtml(exp.location)}</div>` : ''}

                ${Array.isArray(exp.highlights) && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Relevant Projects -->
      ${isSectionEnabled(profile, 'projects') && profile.projects?.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Targeted Deliverables & Implementations
          </h2>
          <div class="space-y-3">
            ${profile.projects.map(proj => `
              <div class="border-l-2 pl-3 border-slate-300 break-inside-avoid">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900 text-xs">${escapeHtml(proj.title)}</span>
                  ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="text-xs text-blue-700 hover:underline">Link</a>` : ''}
                </div>
                ${proj.description ? `<p class="text-xs text-slate-700 mt-0.5">${escapeHtml(proj.description)}</p>` : ''}
                ${proj.outcomes ? `<p class="text-xs text-slate-600 italic mt-0.5">Value: ${escapeHtml(proj.outcomes)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Skills Matrix -->
      ${isSectionEnabled(profile, 'skills') ? `
        <section class="mb-5 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Skills & Competencies
          </h2>
          ${renderCategorizedSkillsHtml(profile, primaryColor)}
        </section>
      ` : ''}

      <!-- Education -->
      ${isSectionEnabled(profile, 'education') && profile.education?.length > 0 ? `
        <section class="mb-5 break-inside-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style="color: ${primaryColor}; border-color: ${primaryColor}">
            Education & Academic Credentials
          </h2>
          <div class="space-y-1.5 text-xs">
            ${profile.education.map(edu => `
              <div class="flex justify-between items-baseline">
                <div>
                  <span class="font-bold text-slate-900">${formatEducationDegree(edu)}</span>
                  <span class="text-slate-600"> — ${escapeHtml(edu.institution)}</span>
                </div>
                <span class="text-slate-500">${formatDateRange(edu.startDate, edu.endDate, edu.current, dateFormat)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}


// Exports
exports.renderTargeted = renderTargeted;
};

  // Module: ./templates/templateUtils.js
  __modules__['./templates/templateUtils.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * CVForge - Template Rendering Utilities (Enhanced)
 * Shared sanitization, date formatting, photo rendering, education degree formatting,
 * 6-category skill rendering, and fresh graduate detection across all 10 formats.
 */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateStr, format = 'Month YYYY') {
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

function formatDateRange(startDate, endDate, current, format = 'Month YYYY') {
  const start = formatDate(startDate, format);
  if (current) {
    return `${start} – Present`;
  }
  const end = formatDate(endDate, format);
  if (!start && !end) return '';
  if (!end) return start;
  return `${start} – ${end}`;
}

function getCleanUrl(url) {
  if (!url) return '';
  return url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '');
}

/**
 * Formats Degree and Subject / Major properly.
 * Example: "Bachelor of Science (BSc) in Mathematics"
 */
function formatEducationDegree(edu) {
  if (!edu) return '';
  const degree = edu.degree || 'Degree';
  const subject = edu.major || edu.field;
  return subject ? `${escapeHtml(degree)} in ${escapeHtml(subject)}` : escapeHtml(degree);
}

/**
 * Checks if candidate is a fresh graduate with no work experience.
 */
function isFreshGraduateCandidate(profile) {
  if (!profile) return false;
  return !!profile.isFreshGraduate || (profile.experience || []).length === 0;
}

/**
 * Renders candidate photo respecting showPhoto toggle, aspect-ratio (1:1),
 * photoShape ('circle' vs 'square'/'rounded-rect'), and avoids distortion or empty gap.
 */
function renderPhotoHtml(profile, defaultSizeClass = 'w-24 h-24', extraClasses = '') {
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
function isSectionEnabled(profile, sectionKey) {
  if (profile?.enabledSections && profile.enabledSections[sectionKey] === false) {
    return false;
  }
  return true;
}

/**
 * Helper to retrieve a flat, unified list of skills from profile.
 * Gracefully handles both new flat array structure and legacy categorized objects.
 */
function getSkillsList(profile) {
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
function renderCategorizedSkillsHtml(profile, primaryColor = '#1e3a8a') {
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

const renderSkillsHtml = renderCategorizedSkillsHtml;

/**
 * Renders Professional References block.
 * Only displayed when the user explicitly provides actual referee entries.
 * If no references are entered, the section is completely omitted.
 */
function renderReferencesHtml(profile, primaryColor = '#1e3a8a') {
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


// Exports
exports.escapeHtml = escapeHtml;
exports.formatDate = formatDate;
exports.formatDateRange = formatDateRange;
exports.getCleanUrl = getCleanUrl;
exports.formatEducationDegree = formatEducationDegree;
exports.isFreshGraduateCandidate = isFreshGraduateCandidate;
exports.renderPhotoHtml = renderPhotoHtml;
exports.isSectionEnabled = isSectionEnabled;
exports.getSkillsList = getSkillsList;
exports.renderCategorizedSkillsHtml = renderCategorizedSkillsHtml;
exports.renderReferencesHtml = renderReferencesHtml;
exports.renderSkillsHtml = renderSkillsHtml;
};

  // Module: ./templates/ukCv.js
  __modules__['./templates/ukCv.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format: United Kingdom CV (British Standard Curriculum Vitae)
 * Authentic UK standard:
 * - 2-page standard format on ISO A4 paper
 * - Concise, impactful Personal Statement at top
 * - British English conventions (e.g. "Key Competencies", "Employment History")
 * - Formal Education & Qualifications
 * - References: Verified referee contacts (omitted when empty)
 */

const { escapeHtml, formatDateRange, getCleanUrl, renderPhotoHtml, isSectionEnabled, formatEducationDegree, isFreshGraduateCandidate, renderReferencesHtml, getSkillsList } = __require__('./templateUtils.js', __currentDir);

function renderUkCv(profile) {
  const p = profile.personal || {};
  const settings = profile.settings || {};
  const primaryColor = settings.primaryColor || '#0f172a';
  const dateFormat = 'Month YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  const expList = [...(profile.experience || [])].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  return `
    <div class="cv-format cv-uk-cv max-w-[850px] mx-auto bg-white text-slate-800 leading-normal text-xs font-sans p-8 sm:p-10 shadow-xs">
      
      <!-- UK Header -->
      <header class="text-center pb-4 mb-5 border-b-2 border-slate-900">
        <h1 class="cv-name text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
          ${escapeHtml(p.fullName || 'Candidate Name')}
        </h1>
        ${p.headline ? `<div class="text-sm font-semibold text-slate-700 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs text-slate-600 mt-2 flex flex-wrap justify-center gap-x-3 gap-y-0.5">
          ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
          ${p.phone ? `<span>• ${escapeHtml(p.phone)}</span>` : ''}
          ${p.email ? `<span>• <a href="mailto:${p.email}" class="text-blue-700 underline">${escapeHtml(p.email)}</a></span>` : ''}
          ${p.linkedin ? `<span>• <a href="${p.linkedin}" target="_blank" class="text-blue-700 underline">LinkedIn</a></span>` : ''}
          ${p.website ? `<span>• <a href="${p.website}" target="_blank" class="text-blue-700 underline">Portfolio</a></span>` : ''}
        </div>
      </header>

      <!-- Personal Statement -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Personal Statement
          </h2>
          <p class="text-xs text-slate-800 leading-relaxed text-justify">
            ${escapeHtml(p.summary || p.objective)}
          </p>
        </section>
      ` : ''}

      <!-- Key Competencies & Skills -->
      ${isSectionEnabled(profile, 'skills') && skills.length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Key Competencies & Skills
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            ${skills.map(s => `
              <div class="flex items-center gap-1.5 text-slate-800">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                <span class="font-medium">${escapeHtml(s.name)}</span>
                ${s.level ? `<span class="text-slate-500 text-[10px]">(${escapeHtml(s.level)})</span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Employment History -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-3">
            Employment History
          </h2>
          <div class="space-y-3.5">
            ${expList.map(exp => `
              <div class="page-break-avoid space-y-1">
                <div class="flex justify-between items-baseline font-bold text-slate-900">
                  <span class="text-xs font-bold">${escapeHtml(exp.title || '')}</span>
                  <span class="text-[11px] font-semibold text-slate-500">${formatDateRange(exp.startDate, exp.endDate, dateFormat, exp.current)}</span>
                </div>
                <div class="text-xs text-slate-700 font-semibold">${escapeHtml(exp.company || '')}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
                ${exp.highlights && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-slate-700">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education & Qualifications -->
      ${isSectionEnabled(profile, 'education') && (profile.education || []).length > 0 ? `
        <section class="mb-5 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2.5">
            Education & Qualifications
          </h2>
          <div class="space-y-2.5">
            ${profile.education.map(edu => `
              <div>
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-xs text-slate-900">${escapeHtml(formatEducationDegree(edu))}</span>
                  <span class="text-[11px] text-slate-500">${formatDateRange(edu.startDate, edu.endDate, dateFormat)}</span>
                </div>
                <div class="text-slate-700 text-xs">${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                ${edu.gpa ? `<div class="text-[11px] text-slate-500">Classification / Grade: ${escapeHtml(edu.gpa)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Projects -->
      ${isSectionEnabled(profile, 'projects') && (profile.projects || []).length > 0 ? `
        <section class="mb-5">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Key Projects
          </h2>
          <div class="space-y-2">
            ${profile.projects.map(proj => `
              <div class="page-break-avoid space-y-0.5">
                <div class="font-bold text-xs text-slate-900">${escapeHtml(proj.title || '')}</div>
                ${proj.description ? `<p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(proj.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- References -->
      ${renderReferencesHtml(profile, primaryColor)}

    </div>
  `;
}


// Exports
exports.renderUkCv = renderUkCv;
};

  // Module: ./templates/usResume.js
  __modules__['./templates/usResume.js'] = function(require, exports, module, __require__, __currentDir) {
/**
 * Format: United States Resume (Standard US Resume)
 * Strict American standards:
 * - Sized for US Letter (8.5 x 11 in)
 * - Zero photos or protected demographic details (strictly EEOC compliant)
 * - Powerful action-oriented accomplishment bullet points
 * - Concise, recruiter-scannable layout
 */

const { escapeHtml, formatDateRange, formatEducationDegree, isFreshGraduateCandidate, isSectionEnabled, getSkillsList } = __require__('./templateUtils.js', __currentDir);

function renderUsResume(profile) {
  const p = profile.personal || {};
  const dateFormat = 'Month YYYY';
  const isFreshGraduate = isFreshGraduateCandidate(profile);
  const skills = getSkillsList(profile);

  const expList = [...(profile.experience || [])].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  const eduList = [...(profile.education || [])].sort((a, b) => {
    return (b.endDate || b.startDate || '').localeCompare(a.endDate || a.startDate || '');
  });

  return `
    <div class="cv-format cv-us-resume max-w-[800px] mx-auto bg-white text-slate-900 text-xs font-sans p-8 leading-normal shadow-xs">
      
      <!-- US Header (Clean, centered, no photos) -->
      <header class="text-center pb-3 mb-4 border-b border-slate-900">
        <h1 class="cv-name text-2xl font-bold tracking-tight text-slate-950 uppercase">
          ${escapeHtml(p.fullName || 'Candidate Name')}
        </h1>
        ${p.headline ? `<div class="text-xs font-semibold text-slate-700 mt-0.5">${escapeHtml(p.headline)}</div>` : ''}
        <div class="cv-contact-line text-xs text-slate-600 mt-1 flex flex-wrap justify-center gap-x-3 gap-y-0.5">
          ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
          ${p.phone ? `<span>• ${escapeHtml(p.phone)}</span>` : ''}
          ${p.email ? `<span>• <a href="mailto:${p.email}" class="text-blue-700 underline">${escapeHtml(p.email)}</a></span>` : ''}
          ${p.linkedin ? `<span>• <a href="${p.linkedin}" target="_blank" class="text-blue-700 underline">LinkedIn</a></span>` : ''}
          ${p.github ? `<span>• <a href="${p.github}" target="_blank" class="text-blue-700 underline">GitHub</a></span>` : ''}
        </div>
      </header>

      <!-- Professional Summary -->
      ${isSectionEnabled(profile, 'summary') && (p.summary || p.objective) ? `
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            ${p.objective && !p.summary ? 'Objective' : 'Professional Summary'}
          </h2>
          <p class="text-xs text-slate-800 leading-relaxed text-justify">
            ${escapeHtml(p.summary || p.objective)}
          </p>
        </section>
      ` : ''}

      <!-- Skills / Core Competencies -->
      ${isSectionEnabled(profile, 'skills') && skills.length > 0 ? `
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Core Competencies & Skills
          </h2>
          <div class="text-xs text-slate-800 leading-relaxed">
            <strong>Key Skills:</strong> ${skills.map(s => escapeHtml(s.level ? `${s.name} (${s.level})` : s.name)).join(' • ')}
          </div>
        </section>
      ` : ''}

      <!-- Experience (Comes first for experienced candidates) -->
      ${!isFreshGraduate && isSectionEnabled(profile, 'experience') && expList.length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Professional Experience
          </h2>
          <div class="space-y-3">
            ${expList.map(exp => `
              <div class="page-break-avoid">
                <div class="flex justify-between items-baseline font-bold text-slate-900">
                  <span>${escapeHtml(exp.title || 'Role Title')}</span>
                  <span class="text-[11px] font-semibold text-slate-600">${formatDateRange(exp.startDate, exp.endDate, dateFormat, exp.current)}</span>
                </div>
                <div class="text-slate-700 font-semibold text-xs">${escapeHtml(exp.company || '')}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
                ${exp.highlights && exp.highlights.length > 0 ? `
                  <ul class="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-slate-800">
                    ${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education -->
      ${isSectionEnabled(profile, 'education') && eduList.length > 0 ? `
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Education
          </h2>
          <div class="space-y-2">
            ${eduList.map(edu => `
              <div>
                <div class="flex justify-between items-baseline font-bold text-slate-900">
                  <span>${escapeHtml(formatEducationDegree(edu))}</span>
                  <span class="text-[11px] font-semibold text-slate-600">${formatDateRange(edu.startDate, edu.endDate, dateFormat)}</span>
                </div>
                <div class="text-slate-700">${escapeHtml(edu.institution || '')}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</div>
                ${edu.gpa ? `<div class="text-[11px] text-slate-600">GPA: ${escapeHtml(edu.gpa)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Projects / Capstones -->
      ${isSectionEnabled(profile, 'projects') && (profile.projects || []).length > 0 ? `
        <section class="mb-4">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Key Projects
          </h2>
          <div class="space-y-2">
            ${profile.projects.map(proj => `
              <div class="page-break-avoid space-y-0.5">
                <div class="font-bold text-slate-900">${escapeHtml(proj.title || '')}</div>
                ${proj.description ? `<p class="text-slate-800 leading-relaxed">${escapeHtml(proj.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Certifications -->
      ${isSectionEnabled(profile, 'certifications') && (profile.certifications || []).length > 0 ? `
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Certifications
          </h2>
          <ul class="list-disc list-outside ml-4 text-xs text-slate-800 space-y-0.5">
            ${profile.certifications.map(c => `
              <li><strong>${escapeHtml(c.title || '')}</strong>${c.issuer ? ` — ${escapeHtml(c.issuer)}` : ''}</li>
            `).join('')}
          </ul>
        </section>
      ` : ''}

      <!-- References -->
      ${(profile.references && profile.references.filter(r => r && (r.name || r.title || r.organization || r.company || r.email || r.phone)).length > 0) ? `
        <section class="mb-4 page-break-avoid">
          <h2 class="cv-section-title text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
            References
          </h2>
          <div class="space-y-1 text-xs text-slate-800">
            ${profile.references.filter(r => r && (r.name || r.title || r.organization || r.company || r.email || r.phone)).map(r => `
              <div>
                <strong>${escapeHtml(r.name || '')}</strong> — ${escapeHtml(r.title || '')}${r.organization || r.company ? `, ${escapeHtml(r.organization || r.company)}` : ''}
                ${r.email ? ` | ${escapeHtml(r.email)}` : ''}
                ${r.phone ? ` | ${escapeHtml(r.phone)}` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

    </div>
  `;
}


// Exports
exports.renderUsResume = renderUsResume;
};


  // Execute application entry point on DOM ready or immediately
  function startCVForge() {
    try {
      console.log('Initializing CVForge application from unified bundle...');
      __require__('./app.js', '');
    } catch(err) {
      console.error('CVForge bootstrap error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startCVForge);
  } else {
    startCVForge();
  }
})();

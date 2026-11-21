/**
 * CVForge - Application Coordinator & Main Controller (Fully Enhanced)
 */

import { appState } from './models/state.js';
import { renderCv, TEMPLATES } from './templates/index.js';
import { renderFormSections } from './components/formSections.js';
import { renderCustomizeBar } from './components/customizeBar.js';
import { openAtsModal } from './components/atsDrawer.js';
import { openJobMatcherModal } from './components/jobMatcherModal.js';
import { openCountryModal } from './components/countryModal.js';
import { openCoverLetterModal } from './components/coverLetter.js';
import { openTemplateGalleryModal } from './components/templateGalleryModal.js';
import { openProfileManagerModal } from './components/profileManagerModal.js';
import { openExportModal } from './components/exportModal.js';
import { openClearDataModal } from './components/clearDataModal.js';
import { runAtsAudit } from './engine/atsEngine.js';
import { calculateCompleteness } from './engine/completeness.js';
import { togglePrintPreview } from './export/pdfExporter.js';

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

// Expose Android Native Bridge & Mobile Navigation Handler
window.CVForgeMobile = {
  handleBack: () => {
    // Check if any modal is open
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
        return true; // Handled modal close
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

    return false; // Allow native Android exit
  }
};

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

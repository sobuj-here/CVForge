/**
 * CVForge - Customization Bar Component (Fully Enhanced)
 * Reorganized toolbar with visual template gallery trigger, 7 professional themes,
 * independent point-based typography (pt), custom millimeter margins (mm),
 * color palettes, paper setup, photo manager, and zoom controls.
 */

import { appState } from '../models/state.js';
import { TEMPLATES, FORMAT_CATEGORIES } from '../templates/index.js';
import { openTemplateGalleryModal } from './templateGalleryModal.js';
import { openPhotoCropModal } from './photoCropModal.js';
import { openTypographyModal } from './typographyModal.js';
import { openMarginsModal } from './marginsModal.js';

export function renderCustomizeBar(containerId = 'customize-bar-container') {
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
        <button type="button" id="btn-open-template-gallery" class="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-xs text-xs flex items-center gap-1.5 transition active:scale-95" title="Browse all CV templates">
          <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i>
          <span>Template Gallery</span>
        </button>

        <select id="sel-format" class="font-bold text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 shadow-xs max-w-[240px] truncate" title="Select Template">
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
        <div class="flex items-center gap-1" title="Theme">
          <span class="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">Theme:</span>
          <select id="sel-theme" class="rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-2 py-1 text-xs font-semibold">
            ${THEMES.map(th => `
              <option value="${th.id}" ${settings.theme === th.id ? 'selected' : ''}>${th.name}</option>
            `).join('')}
          </select>
        </div>

        <!-- Font Family -->
        <div class="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2" title="Font">
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
        <button type="button" id="btn-open-typography-modal" class="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition flex items-center gap-1.5 shadow-xs" title="Font Sizes">
          <i data-lucide="type" class="w-3.5 h-3.5 text-blue-600"></i>
          <span>Font Size: <strong class="text-blue-600">${fontSizes.body || 10}pt</strong></span>
        </button>

        <!-- Millimeter-Based Margin Controls Trigger (mm) -->
        <button type="button" id="btn-open-margins-modal" class="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition flex items-center gap-1.5 shadow-xs" title="Page Margins">
          <i data-lucide="maximize-2" class="w-3.5 h-3.5 text-blue-600"></i>
          <span>Margins: <strong class="text-blue-600">${marginsCustom.top || 15}mm</strong></span>
        </button>

        <!-- Palette Swatches -->
        <div class="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2" title="Accent Color">
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
            <option value="compact" ${settings.spacing === 'compact' ? 'selected' : ''}>Compact</option>
            <option value="normal" ${settings.spacing === 'normal' ? 'selected' : ''}>Normal</option>
            <option value="relaxed" ${settings.spacing === 'relaxed' ? 'selected' : ''}>Relaxed</option>
          </select>
        </div>

      </div>

      <!-- Group 3: Paper Setup, Photo & Zoom Controls -->
      <div class="flex items-center gap-2">
        
        <!-- Paper Size Toggle (A4 vs Letter) -->
        <div class="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 p-0.5" title="Paper Size">
          <button type="button" id="btn-paper-letter" class="px-2.5 py-1 text-[11px] font-bold rounded ${settings.paperSize === 'letter' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:text-blue-600'}">
            US Letter
          </button>
          <button type="button" id="btn-paper-a4" class="px-2.5 py-1 text-[11px] font-bold rounded ${settings.paperSize === 'a4' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:text-blue-600'}">
            A4
          </button>
        </div>

        <!-- Photo Controls: Show, Size, Shape, Upload -->
        <div class="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-700 pl-2">
          <label class="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer" title="Toggle Photo">
            <input type="checkbox" id="chk-show-photo" ${settings.showPhoto ? 'checked' : ''} class="rounded text-blue-600" />
            <span>Photo</span>
          </label>

          ${settings.showPhoto ? `
            <select id="sel-photo-size" class="rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-200 px-1.5 py-0.5" title="Photo Size">
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
          <button type="button" id="btn-trigger-photo-upload" class="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400" title="Upload Photo">
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
          <button type="button" id="btn-zoom-reset" class="text-[10px] text-blue-600 dark:text-blue-400 font-bold px-1 hover:underline" title="Fit to Width">
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

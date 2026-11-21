/**
 * CVForge - Photo Upload, Crop & Alignment Modal Component
 * Accepts JPG, JPEG, PNG, WebP. Preserves aspect ratio, prevents distortion,
 * allows zoom, repositioning, and selection between Circular and Rounded Rectangle shapes.
 */

import { appState } from '../models/state.js';

export function openPhotoCropModal() {
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

/**
 * CVForge - Profile Manager & Data Privacy Modal Component
 * Allows creating, duplicating, switching, renaming, exporting/importing profiles,
 * and explains local client-side storage policies.
 */

import { appState } from '../models/state.js';
import { exportProfileToJson, importProfileFromJson } from '../export/jsonExporter.js';
import { openClearDataModal } from './clearDataModal.js';

export function openProfileManagerModal() {
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
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white">Profile Manager</h3>
              <p class="text-xs text-slate-500">Manage multiple CV versions and backups</p>
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
              <h4 class="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Saved Profiles (${list.length})</h4>
              <button type="button" id="btn-new-blank-profile" class="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i> New Blank Profile
              </button>
            </div>

            ${list.length === 0 ? `
              <div class="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-slate-400">
                No saved profiles yet. Click "Duplicate Profile" to save variations for different jobs.
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
            <h4 class="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Backup & Restore</h4>
            <div class="flex flex-wrap gap-2">
              <button type="button" id="btn-pm-export-json" class="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5">
                <i data-lucide="download" class="w-3.5 h-3.5"></i> Export Backup (.json)
              </button>
              <button type="button" id="btn-pm-import-json" class="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5">
                <i data-lucide="upload" class="w-3.5 h-3.5"></i> Import from Backup
              </button>
              <input type="file" id="inp-pm-file" class="hidden" accept=".json" />
            </div>
          </div>

          <!-- Privacy & Security Guarantee -->
          <div class="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/30 space-y-2">
            <div class="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i>
              <span>Your data stays on this device</span>
            </div>
            <p class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Your information is saved in your browser's local storage. Nothing is sent to external servers.
            </p>
            <div class="pt-2 flex flex-wrap justify-between items-center gap-2 border-t border-emerald-200 dark:border-emerald-900/30">
              <span class="text-[11px] text-slate-500">Need to start over?</span>
              <div class="flex items-center gap-2">
                <button type="button" id="btn-pm-clear-candidate" class="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline">
                  Clear Candidate Data
                </button>
                <span class="text-slate-300 dark:text-slate-700">|</span>
                <button type="button" id="btn-pm-wipe-all" class="text-xs font-bold text-red-600 hover:text-red-700 hover:underline">
                  Reset All Data
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
      const name = prompt('Enter a profile name:', `${currentProfile.personal?.fullName || 'Profile'} - Copy`);
      if (name) {
        appState.saveCurrentProfileAs(name);
        renderModal();
      }
    });

    // New blank profile
    document.getElementById('btn-new-blank-profile')?.addEventListener('click', () => {
      if (confirm('Create a new blank profile? Your current changes are saved in your browser.')) {
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
      if (confirm('Are you sure? This will delete all saved profiles and reset CVForge.')) {
        appState.clearAllData();
        close();
        alert('All local data cleared.');
      }
    });

    if (window.lucide) window.lucide.createIcons();
  };

  renderModal();
}

/**
 * CVForge - Job Description Keyword Matcher & Optimizer Modal
 */

import { matchJobDescription } from '../engine/keywordMatcher.js';
import { appState } from '../models/state.js';

export function openJobMatcherModal() {
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
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Job Keyword Matcher</h3>
            <p class="text-xs text-slate-500">Match keywords in your CV against a job description</p>
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
            Paste Job Description:
          </label>
          <textarea id="txt-job-description" rows="5" class="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white p-3 leading-relaxed focus:ring-2 focus:ring-blue-500" placeholder="Paste the job requirements, responsibilities, or qualifications here..."></textarea>
          <div class="mt-2 flex justify-between items-center">
            <span class="text-[11px] text-slate-500">Identifies matching skills and relevant terms</span>
            <button type="button" id="btn-run-match" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm text-xs transition flex items-center gap-1.5">
              <i data-lucide="scan" class="w-3.5 h-3.5"></i> Match Keywords
            </button>
          </div>
        </div>

        <!-- Results Display -->
        <div id="matcher-results" class="hidden space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          
          <!-- Match Score Banner -->
          <div class="p-4 rounded-xl border flex items-center justify-between" id="matcher-score-banner">
            <div>
              <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Keyword Match Score</div>
              <div class="text-2xl font-black text-slate-900 dark:text-white" id="matcher-score-text">0%</div>
            </div>
            <div id="matcher-score-pill" class="text-xs font-bold px-3 py-1.5 rounded-lg">
              Match Status
            </div>
          </div>

          <!-- Matched Keywords -->
          <div>
            <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1 text-emerald-600">
              <i data-lucide="check" class="w-4 h-4"></i> Matched in Your CV (<span id="count-matched">0</span>)
            </h4>
            <div id="container-matched-keywords" class="flex flex-wrap gap-1.5"></div>
          </div>

          <!-- Missing Keywords -->
          <div>
            <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1 text-red-600">
              <i data-lucide="alert-circle" class="w-4 h-4"></i> Missing Keywords (<span id="count-missing">0</span>)
            </h4>
            <p class="text-[11px] text-slate-500 mb-2">Click a keyword to add it to your skills:</p>
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

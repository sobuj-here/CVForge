/**
 * CVForge - Professional Cover Letter Generator
 * Generates an executive cover letter that matches the styling, fonts, and header
 * of the user's chosen CV format.
 */

import { appState } from '../models/state.js';
import { downloadPdf, triggerPrint } from '../export/pdfExporter.js';

export function openCoverLetterModal() {
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

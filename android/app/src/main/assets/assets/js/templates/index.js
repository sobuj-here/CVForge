/**
 * CVForge - Master Template Registry & Dispatcher
 * Exports 10 international format categories and 50 distinct templates.
 * 
 * Strict invariants:
 * - Candidate data is preserved 100% across all switches
 * - Every format category contains at least 5 distinct templates
 * - All templates are fully compatible with Live Preview, PDF, and DOCX exports
 */

import { TEMPLATES, FORMAT_CATEGORIES } from './catalog.js';

export { TEMPLATES, FORMAT_CATEGORIES };

export function renderCv(formatId, profile) {
  const template = TEMPLATES[formatId] || TEMPLATES['reverse-chronological'];
  if (template && typeof template.renderer === 'function') {
    return template.renderer(profile);
  }
  return TEMPLATES['reverse-chronological'].renderer(profile);
}

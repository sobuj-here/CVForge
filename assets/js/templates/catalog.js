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

import { renderReverseChronological } from './reverseChrono.js';
import { renderChronological } from './chronological.js';
import { renderCleanMinimal } from './cleanMinimal.js';
import { renderCorporateExecutive } from './corporateExecutive.js';

import { renderAtsFriendly } from './atsFriendly.js';
import { renderModernAts } from './modernAts.js';

import { renderCreativeVisual } from './creativeVisual.js';

import { renderAcademic } from './academic.js';
import { renderCustomAcademicGreen } from './customAcademicGreen.js';

import { renderFunctional } from './functional.js';
import { renderSkillsBased } from './skillsBased.js';
import { renderCombination } from './combination.js';
import { renderTargeted } from './targeted.js';

import { renderCustomBdClassic } from './customBdClassic.js';
import { renderUsResume } from './usResume.js';
import { renderUkCv } from './ukCv.js';
import { renderGermanCv } from './germanCv.js';

import { renderCustomExecutiveBluebar } from './customExecutiveBluebar.js';
import { renderEuropass } from './europass.js';

// Extended Renderers
import {
  renderProfCorporateMatrix,
  renderProfModernSlate,
  renderAtsCompactLinear,
  renderAtsPlainSemantic,
  renderAtsExecutiveScan,
  renderCreativePortfolioGrid,
  renderCreativeDuoTone,
  renderCreativeEditorial,
  renderCreativeMinimalArt,
  renderAcademicFellowship,
  renderAcademicCurriculum,
  renderAcademicSymposium,
  renderFunctionalCapability,
  renderFunctionalProjectFirst,
  renderFunctionalHybridCompetency,
  renderIntlNordicClean,
  renderExecCSuite,
  renderExecGovernance,
  renderExecGoldLine,
  renderTechStackFocused,
  renderTechCloudArchitect,
  renderTechEngineeringLead,
  renderTechDataScientist,
  renderTechTerminalModern,
  renderEntryEducationFirst,
  renderEntryCampusLeader,
  renderEntryInternPath,
  renderEntryStemStarter,
  renderEntryBoldStart,
  renderEuropassModern,
  renderEuropassExecutive,
  renderEuropassAcademic,
  renderEuropassCompact
} from './extendedTemplates.js';

export const FORMAT_CATEGORIES = [
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

export const TEMPLATES = {
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

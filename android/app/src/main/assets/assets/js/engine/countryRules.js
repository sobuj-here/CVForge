/**
 * CVForge - International CV Conventions & Country Guidance Engine
 * Provides detailed, country-specific advice for USA, Canada, UK, Germany, France, Australia, and EU.
 */

export const COUNTRY_RULES = {
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

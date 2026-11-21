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

export const SAMPLE_PROFILES = {
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

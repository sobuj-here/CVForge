/**
 * CVForge - Genuine Fully Editable Microsoft Word (.docx) Export Engine
 * 
 * Strict invariants:
 * - 100% native Word document content (paragraphs, runs, headings, tables, bullets)
 * - Zero background images, zero canvases, zero PDF-to-DOCX conversions
 * - Every piece of candidate text (name, summary, experience, education, skills, references) is individually editable
 * - Preserves template layout:
 *   * Two-column templates use native 2-column borderless Word tables
 *   * Institutional Classic (Bangladesh) uses native 5-column bordered Word table & colon table
 *   * Executive Blue-Banner uses shaded banner tables & section bands
 *   * Single-column & ATS use clean semantic paragraphs with border rules
 * - Completely omits reference availability text
 * - Completely omits References section when no referees exist
 * - Supports custom millimeter margins and point-based font sizes
 */

export function buildDocxDocument(profile, docxLib) {
  const {
    Document,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    ShadingType
  } = docxLib;

  const p = profile.personal || {};
  const settings = profile.settings || {};
  const formatId = profile.format || 'reverse-chronological';

  // Point-based font sizes (docx uses half-points: pt * 2)
  const fontSizes = settings.fontSizes || { name: 24, headings: 13, body: 10, contact: 9.5 };
  const marginsCustom = settings.marginsCustom || { top: 15, bottom: 15, left: 15, right: 15 };

  const nameSize = Math.round((fontSizes.name || 24) * 2);
  const headingSize = Math.round((fontSizes.headings || 13) * 2);
  const subHeadingSize = Math.round((fontSizes.headings || 13) * 1.8);
  const bodySize = Math.round((fontSizes.body || 10) * 2);
  const contactSize = Math.round((fontSizes.contact || 9.5) * 2);

  // Brand Color hex without '#'
  const brandColor = (settings.primaryColor || '#1e3a8a').replace('#', '').toUpperCase();
  const docFont = settings.fontFamily || 'Calibri';

  // Candidate Data Extraction
  const contactParts = [
    p.location,
    p.email,
    p.phone,
    p.linkedin,
    p.github,
    p.website || p.portfolio
  ].filter(Boolean);

  const isFreshGraduate = profile.isFreshGraduate || (profile.experience || []).length === 0;

  let skillsList = [];
  if (Array.isArray(profile.skills)) {
    skillsList = profile.skills.filter(s => s && s.name);
  } else if (profile.skills && typeof profile.skills === 'object') {
    const s = profile.skills;
    const addS = (arr) => (arr || []).forEach(item => {
      const name = typeof item === 'string' ? item : item?.name;
      const level = typeof item === 'object' ? item?.level : '';
      if (name && name.trim()) skillsList.push({ name: name.trim(), level: level || '' });
    });
    addS(s.technical);
    addS(s.tools);
    addS(s.programming);
    addS(s.dataAnalysis);
    addS(s.professional || s.soft);
    addS(s.communication);
  }

  const validRefs = (profile.references || []).filter(r => r && (r.name || r.title || r.company || r.organization || r.email || r.phone));

  // Determine Layout Family
  const isTwoColumn = [
    'academic-scholar-two-column',
    'custom-academic-green',
    'creative-visual',
    'creative-duo-tone'
  ].includes(formatId);

  const isInstitutionalClassic = [
    'intl-institutional-classic',
    'custom-bd-classic',
    'bangladesh-cv'
  ].includes(formatId);

  const isExecutiveBlueBanner = [
    'exec-blue-banner',
    'custom-executive-bluebar'
  ].includes(formatId);

  let docChildren = [];

  // -------------------------------------------------------------
  // LAYOUT 1: TWO-COLUMN TEMPLATES (Academic Scholar, Creative)
  // -------------------------------------------------------------
  if (isTwoColumn) {
    const leftCellChildren = [];
    const rightCellChildren = [];

    // Left Column: Contact, Skills, Languages, Certifications
    leftCellChildren.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: 'CONTACT', bold: true, size: Math.round(headingSize * 0.9), color: brandColor, font: docFont })
        ]
      })
    );

    contactParts.forEach(c => {
      leftCellChildren.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: c, size: contactSize, font: docFont })]
        })
      );
    });

    if (skillsList.length > 0) {
      leftCellChildren.push(
        new Paragraph({
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({ text: 'SKILLS & TOOLS', bold: true, size: Math.round(headingSize * 0.9), color: brandColor, font: docFont })
          ]
        })
      );
      skillsList.forEach(s => {
        leftCellChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({ text: s.name, bold: true, size: contactSize, font: docFont }),
              s.level ? new TextRun({ text: ` (${s.level})`, size: contactSize, color: '64748B', font: docFont }) : null
            ].filter(Boolean)
          })
        );
      });
    }

    if (profile.languages && profile.languages.length > 0) {
      leftCellChildren.push(
        new Paragraph({
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({ text: 'LANGUAGES', bold: true, size: Math.round(headingSize * 0.9), color: brandColor, font: docFont })
          ]
        })
      );
      profile.languages.forEach(l => {
        leftCellChildren.push(
          new Paragraph({
            spacing: { after: 30 },
            children: [
              new TextRun({ text: l.name, bold: true, size: contactSize, font: docFont }),
              new TextRun({ text: ` — ${l.proficiency || l.cefr || 'Proficient'}`, size: contactSize, font: docFont })
            ]
          })
        );
      });
    }

    // Right Column: Name, Headline, Summary, Experience, Education, Projects, Publications, References
    rightCellChildren.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: (p.fullName || 'Candidate Name').toUpperCase(), bold: true, size: nameSize, color: brandColor, font: docFont })
        ]
      })
    );

    if (p.headline) {
      rightCellChildren.push(
        new Paragraph({
          spacing: { after: 140 },
          children: [
            new TextRun({ text: p.headline, bold: true, size: Math.round(headingSize * 0.95), color: '475569', font: docFont })
          ]
        })
      );
    }

    if (p.summary || p.objective) {
      rightCellChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 60 },
          border: { bottom: { color: brandColor, space: 4, value: 'single', size: 8 } },
          children: [new TextRun({ text: 'RESEARCH PROFILE / SUMMARY', bold: true, size: headingSize, color: brandColor, font: docFont })]
        }),
        new Paragraph({
          spacing: { after: 160 },
          children: [new TextRun({ text: p.summary || p.objective, size: bodySize, font: docFont })]
        })
      );
    }

    if (!isFreshGraduate && profile.experience && profile.experience.length > 0) {
      rightCellChildren.push(
        new Paragraph({
          spacing: { before: 140, after: 60 },
          border: { bottom: { color: brandColor, space: 4, value: 'single', size: 8 } },
          children: [new TextRun({ text: 'PROFESSIONAL EXPERIENCE', bold: true, size: headingSize, color: brandColor, font: docFont })]
        })
      );
      profile.experience.forEach(exp => {
        rightCellChildren.push(
          new Paragraph({
            spacing: { before: 80, after: 20 },
            children: [
              new TextRun({ text: exp.title || '', bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` — ${exp.company || ''}`, bold: true, size: bodySize, color: '334155', font: docFont }),
              new TextRun({ text: ` [${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}]`, size: contactSize, color: '64748B', font: docFont })
            ]
          })
        );
        if (Array.isArray(exp.highlights)) {
          exp.highlights.forEach(h => {
            rightCellChildren.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 20 },
                children: [new TextRun({ text: h, size: bodySize, font: docFont })]
              })
            );
          });
        }
      });
    }

    if (profile.education && profile.education.length > 0) {
      rightCellChildren.push(
        new Paragraph({
          spacing: { before: 160, after: 60 },
          border: { bottom: { color: brandColor, space: 4, value: 'single', size: 8 } },
          children: [new TextRun({ text: 'EDUCATION & QUALIFICATIONS', bold: true, size: headingSize, color: brandColor, font: docFont })]
        })
      );
      profile.education.forEach(edu => {
        const deg = `${edu.degree || ''}${edu.major || edu.field ? ` in ${edu.major || edu.field}` : ''}`;
        rightCellChildren.push(
          new Paragraph({
            spacing: { before: 60, after: 20 },
            children: [
              new TextRun({ text: deg, bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` — ${edu.institution || ''}`, size: bodySize, font: docFont }),
              new TextRun({ text: ` (${edu.startDate || ''} – ${edu.current ? 'Present' : edu.endDate || ''})`, size: contactSize, color: '64748B', font: docFont })
            ]
          })
        );
        if (edu.gpa) {
          rightCellChildren.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [new TextRun({ text: `Result / CGPA: ${edu.gpa}`, size: contactSize, italics: true, font: docFont })]
            })
          );
        }
        if (edu.thesis) {
          rightCellChildren.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [new TextRun({ text: `Thesis: "${edu.thesis}"`, size: contactSize, italics: true, color: '475569', font: docFont })]
            })
          );
        }
      });
    }

    if (profile.publications && profile.publications.length > 0) {
      rightCellChildren.push(
        new Paragraph({
          spacing: { before: 160, after: 60 },
          border: { bottom: { color: brandColor, space: 4, value: 'single', size: 8 } },
          children: [new TextRun({ text: 'PUBLICATIONS', bold: true, size: headingSize, color: brandColor, font: docFont })]
        })
      );
      profile.publications.forEach((pub, idx) => {
        rightCellChildren.push(
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [
              new TextRun({ text: `[${idx + 1}] `, bold: true, size: contactSize, font: docFont }),
              pub.authors ? new TextRun({ text: `${pub.authors}. `, size: contactSize, font: docFont }) : null,
              new TextRun({ text: `"${pub.title}". `, bold: true, size: contactSize, font: docFont }),
              new TextRun({ text: `${pub.journal || ''} (${pub.year || ''}).`, italics: true, size: contactSize, font: docFont }),
              pub.doi ? new TextRun({ text: ` DOI: ${pub.doi}`, size: contactSize, color: '1D4ED8', font: docFont }) : null
            ].filter(Boolean)
          })
        );
      });
    }

    // References: ONLY when valid referee entries exist
    if (validRefs.length > 0) {
      rightCellChildren.push(
        new Paragraph({
          spacing: { before: 160, after: 60 },
          border: { bottom: { color: brandColor, space: 4, value: 'single', size: 8 } },
          children: [new TextRun({ text: 'REFERENCES', bold: true, size: headingSize, color: brandColor, font: docFont })]
        })
      );
      validRefs.forEach(r => {
        const org = r.organization || r.company || '';
        rightCellChildren.push(
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [
              new TextRun({ text: r.name, bold: true, size: bodySize, font: docFont }),
              (r.title || org) ? new TextRun({ text: ` — ${r.title || ''}${r.title && org ? ` (${org})` : org}`, size: bodySize, font: docFont }) : null,
              r.email ? new TextRun({ text: ` | Email: ${r.email}`, size: contactSize, color: '64748B', font: docFont }) : null,
              r.phone ? new TextRun({ text: ` | Phone: ${r.phone}`, size: contactSize, color: '64748B', font: docFont }) : null
            ].filter(Boolean)
          })
        );
      });
    }

    // Wrap both columns into a native 2-column Word Table (32% left, 68% right)
    const twoColTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 32, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE }
              },
              children: leftCellChildren
            }),
            new TableCell({
              width: { size: 68, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE }
              },
              children: rightCellChildren
            })
          ]
        })
      ]
    });

    docChildren.push(twoColTable);

  // -------------------------------------------------------------
  // LAYOUT 2: INSTITUTIONAL CLASSIC (BANGLADESH BORDERED STANDARD)
  // -------------------------------------------------------------
  } else if (isInstitutionalClassic) {
    // Top Title & Candidate Name
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({ text: 'CURRICULUM VITAE', bold: true, size: Math.round(nameSize * 0.9), color: '059669', font: docFont })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({ text: 'OF', bold: true, size: bodySize, color: '64748B', font: docFont })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({ text: (p.fullName || 'Candidate Name').toUpperCase(), bold: true, size: nameSize, font: docFont })
        ]
      })
    );

    if (contactParts.length > 0) {
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: contactParts.join('  |  '), size: contactSize, color: '475569', font: docFont })
          ]
        })
      );
    }

    // Career Objective
    if (p.summary || p.objective) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 120, after: 60 },
          border: { bottom: { color: '059669', space: 4, value: 'single', size: 10 } },
          children: [new TextRun({ text: 'CAREER OBJECTIVE', bold: true, size: headingSize, color: '059669', font: docFont })]
        }),
        new Paragraph({
          spacing: { after: 160 },
          children: [new TextRun({ text: p.summary || p.objective, size: bodySize, font: docFont })]
        })
      );
    }

    // Academic Credentials Table (Native 5-Column Word Table with thin borders & shaded header)
    if (profile.education && profile.education.length > 0) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 160, after: 80 },
          border: { bottom: { color: '059669', space: 4, value: 'single', size: 10 } },
          children: [new TextRun({ text: 'ACADEMIC QUALIFICATIONS', bold: true, size: headingSize, color: '059669', font: docFont })]
        })
      );

      const tableRows = [];
      // Header Row
      tableRows.push(
        new TableRow({
          tableHeader: true,
          children: ['Examination / Degree', 'Board / Institute', 'Group / Major', 'Passing Year', 'Result / GPA'].map(h => 
            new TableCell({
              shading: { fill: 'E2E8F0', type: ShadingType.SOLID },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: '94A3B8' },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: '94A3B8' },
                left: { style: BorderStyle.SINGLE, size: 4, color: '94A3B8' },
                right: { style: BorderStyle.SINGLE, size: 4, color: '94A3B8' }
              },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, size: contactSize, font: docFont })] })]
            })
          )
        })
      );

      // Data Rows
      profile.education.forEach(edu => {
        const rowCells = [
          edu.degree || '',
          edu.institution || '',
          edu.major || edu.field || 'N/A',
          edu.endDate || edu.startDate || '',
          edu.gpa || 'Appeared'
        ];
        tableRows.push(
          new TableRow({
            children: rowCells.map(val => 
              new TableCell({
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
                  bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
                  left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
                  right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' }
                },
                children: [new Paragraph({ children: [new TextRun({ text: String(val), size: contactSize, font: docFont })] })]
              })
            )
          })
        );
      });

      docChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows
        })
      );
    }

    // Work Experience
    if (!isFreshGraduate && profile.experience && profile.experience.length > 0) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 200, after: 80 },
          border: { bottom: { color: '059669', space: 4, value: 'single', size: 10 } },
          children: [new TextRun({ text: 'EXPERIENCE & EMPLOYMENT', bold: true, size: headingSize, color: '059669', font: docFont })]
        })
      );
      profile.experience.forEach(exp => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 60, after: 20 },
            children: [
              new TextRun({ text: exp.title || '', bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` — ${exp.company || ''}`, bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` (${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''})`, size: contactSize, color: '64748B', font: docFont })
            ]
          })
        );
        if (exp.description) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [new TextRun({ text: exp.description, size: contactSize, font: docFont })]
            })
          );
        }
      });
    }

    // Skills
    if (skillsList.length > 0) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 200, after: 80 },
          border: { bottom: { color: '059669', space: 4, value: 'single', size: 10 } },
          children: [new TextRun({ text: 'SPECIAL QUALIFICATIONS & SKILLS', bold: true, size: headingSize, color: '059669', font: docFont })]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: skillsList.map(s => s.name).join('  •  '), size: bodySize, font: docFont })]
        })
      );
    }

    // Personal Information (Colon Table)
    const personalRows = [
      ['Father\'s Name', p.fatherName],
      ['Mother\'s Name', p.motherName],
      ['Date of Birth', p.dateOfBirth],
      ['Gender', p.gender],
      ['Marital Status', p.maritalStatus],
      ['Nationality', p.nationality || 'Bangladeshi'],
      ['Religion', p.religion],
      ['Permanent Address', p.permanentAddress || p.location]
    ].filter(r => r[1]);

    if (personalRows.length > 0) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 200, after: 80 },
          border: { bottom: { color: '059669', space: 4, value: 'single', size: 10 } },
          children: [new TextRun({ text: 'PERSONAL DETAILS', bold: true, size: headingSize, color: '059669', font: docFont })]
        })
      );

      const personalTableRows = personalRows.map(([label, val]) => 
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: contactSize, font: docFont })] })]
            }),
            new TableCell({
              width: { size: 5, type: WidthType.PERCENTAGE },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [new Paragraph({ children: [new TextRun({ text: ':', bold: true, size: contactSize, font: docFont })] })]
            }),
            new TableCell({
              width: { size: 65, type: WidthType.PERCENTAGE },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [new Paragraph({ children: [new TextRun({ text: String(val), size: contactSize, font: docFont })] })]
            })
          ]
        })
      );

      docChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: personalTableRows
        })
      );
    }

    // References: ONLY when valid referee entries exist
    if (validRefs.length > 0) {
      docChildren.push(
        new Paragraph({
          spacing: { before: 200, after: 80 },
          border: { bottom: { color: '059669', space: 4, value: 'single', size: 10 } },
          children: [new TextRun({ text: 'REFERENCES', bold: true, size: headingSize, color: '059669', font: docFont })]
        })
      );
      validRefs.forEach(r => {
        const org = r.organization || r.company || '';
        docChildren.push(
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [
              new TextRun({ text: r.name, bold: true, size: bodySize, font: docFont }),
              (r.title || org) ? new TextRun({ text: ` — ${r.title || ''}${r.title && org ? ` (${org})` : org}`, size: bodySize, font: docFont }) : null,
              r.email ? new TextRun({ text: ` | Email: ${r.email}`, size: contactSize, color: '64748B', font: docFont }) : null,
              r.phone ? new TextRun({ text: ` | Phone: ${r.phone}`, size: contactSize, color: '64748B', font: docFont }) : null
            ].filter(Boolean)
          })
        );
      });
    }

    // Declaration & Signature Line
    docChildren.push(
      new Paragraph({
        spacing: { before: 240, after: 80 },
        children: [
          new TextRun({ text: 'Declaration: ', bold: true, size: contactSize, font: docFont }),
          new TextRun({ text: 'I hereby declare that all the information stated above is true and accurate to the best of my knowledge.', italics: true, size: contactSize, font: docFont })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 300, after: 20 },
        children: [
          new TextRun({ text: '_______________________', bold: true, font: docFont })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: (p.fullName || 'Candidate Signature'), bold: true, size: contactSize, font: docFont })
        ]
      })
    );

  // -------------------------------------------------------------
  // LAYOUT 3: EXECUTIVE BLUE-BANNER (SIDDEK BANNER STANDARD)
  // -------------------------------------------------------------
  } else if (isExecutiveBlueBanner) {
    // 1-Cell Shaded Banner Table for Header
    const bannerHeader = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: '3B5998', type: ShadingType.SOLID },
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 120, after: 40 },
                  children: [new TextRun({ text: (p.fullName || 'Candidate Name').toUpperCase(), bold: true, size: nameSize, color: 'FFFFFF', font: docFont })]
                }),
                p.headline ? new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 60 },
                  children: [new TextRun({ text: p.headline, bold: true, size: Math.round(headingSize * 0.9), color: 'DBEAFE', font: docFont })]
                }) : null,
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 120 },
                  children: [new TextRun({ text: contactParts.join('  •  '), size: contactSize, color: 'EFF6FF', font: docFont })]
                })
              ].filter(Boolean)
            })
          ]
        })
      ]
    });

    docChildren.push(bannerHeader);

    function addBannerSectionHeading(title) {
      docChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
                  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  children: [
                    new Paragraph({
                      spacing: { before: 60, after: 60 },
                      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: headingSize, color: '1E3A8A', font: docFont })]
                    })
                  ]
                })
              ]
            })
          ]
        })
      );
    }

    if (p.summary || p.objective) {
      addBannerSectionHeading('Career Objective');
      docChildren.push(
        new Paragraph({
          spacing: { before: 80, after: 160 },
          children: [new TextRun({ text: p.summary || p.objective, size: bodySize, font: docFont })]
        })
      );
    }

    if (profile.education && profile.education.length > 0) {
      addBannerSectionHeading('Academic Credentials');
      profile.education.forEach(edu => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 80, after: 20 },
            children: [
              new TextRun({ text: formatEducationDegree(edu), bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` — ${edu.institution || ''}`, size: bodySize, font: docFont }),
              new TextRun({ text: ` (${edu.startDate || ''} – ${edu.current ? 'Present' : edu.endDate || ''})`, size: contactSize, color: '64748B', font: docFont })
            ]
          })
        );
      });
    }

    if (!isFreshGraduate && profile.experience && profile.experience.length > 0) {
      addBannerSectionHeading('Professional Experience');
      profile.experience.forEach(exp => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 80, after: 20 },
            children: [
              new TextRun({ text: exp.title || '', bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` — ${exp.company || ''}`, bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` [${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}]`, size: contactSize, color: '64748B', font: docFont })
            ]
          })
        );
        if (Array.isArray(exp.highlights)) {
          exp.highlights.forEach(h => {
            docChildren.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 20 },
                children: [new TextRun({ text: h, size: bodySize, font: docFont })]
              })
            );
          });
        }
      });
    }

    if (skillsList.length > 0) {
      addBannerSectionHeading('Skills & Competencies');
      docChildren.push(
        new Paragraph({
          spacing: { before: 80, after: 120 },
          children: [new TextRun({ text: skillsList.map(s => s.name).join('  •  '), size: bodySize, font: docFont })]
        })
      );
    }

    // References: ONLY when valid referee entries exist
    if (validRefs.length > 0) {
      addBannerSectionHeading('References');
      validRefs.forEach(r => {
        const org = r.organization || r.company || '';
        docChildren.push(
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [
              new TextRun({ text: r.name, bold: true, size: bodySize, font: docFont }),
              (r.title || org) ? new TextRun({ text: ` — ${r.title || ''}${r.title && org ? ` (${org})` : org}`, size: bodySize, font: docFont }) : null,
              r.email ? new TextRun({ text: ` | Email: ${r.email}`, size: contactSize, color: '64748B', font: docFont }) : null,
              r.phone ? new TextRun({ text: ` | Phone: ${r.phone}`, size: contactSize, color: '64748B', font: docFont }) : null
            ].filter(Boolean)
          })
        );
      });
    }

  // -------------------------------------------------------------
  // LAYOUT 4: STANDARD / ATS / PROFESSIONAL / FUNCTIONAL TEMPLATES
  // -------------------------------------------------------------
  } else {
    // Section Heading Builder
    function addSectionHeading(title) {
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 100 },
          border: {
            bottom: { color: brandColor, space: 4, value: 'single', size: 10 }
          },
          children: [
            new TextRun({
              text: title.toUpperCase(),
              bold: true,
              size: headingSize,
              color: brandColor,
              font: docFont
            })
          ]
        })
      );
    }
    const addStandardHeading = addSectionHeading;

    // 1. Candidate Full Name
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: (p.fullName || 'Candidate Name').toUpperCase(),
            bold: true,
            size: nameSize,
            color: brandColor,
            font: docFont
          })
        ]
      })
    );

    // 2. Headline (Optional)
    if (p.headline) {
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: p.headline,
              bold: true,
              size: subHeadingSize,
              color: '334155',
              font: docFont
            })
          ]
        })
      );
    }

    // 3. Contact Line
    if (contactParts.length > 0) {
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 280 },
          children: [
            new TextRun({
              text: contactParts.join('  |  '),
              size: contactSize,
              color: '64748B',
              font: docFont
            })
          ]
        })
      );
    }

    // 4. Summary / Career Objective
    if (p.summary || p.objective) {
      addStandardHeading(p.summary ? 'Professional Summary' : 'Career Objective');
      docChildren.push(
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({
              text: p.summary || p.objective,
              size: bodySize,
              font: docFont
            })
          ]
        })
      );
    }

    // 5. Skills
    if (skillsList.length > 0) {
      addSectionHeading('Skills');
      const skillStrings = skillsList.map(s => s.level ? `${s.name} (${s.level})` : s.name);
      docChildren.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: skillStrings.join(' • '), size: bodySize, font: docFont })
          ]
        })
      );
    }

    // 6. Work Experience (Strictly omitted if fresh graduate or empty)
    if (!isFreshGraduate && profile.experience && profile.experience.length > 0) {
      addStandardHeading('Professional Experience');
      profile.experience.forEach(exp => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 120, after: 30 },
            children: [
              new TextRun({ text: exp.title || '', bold: true, size: Math.round(headingSize * 0.95), font: docFont }),
              new TextRun({ text: ` — ${exp.company || ''}`, bold: true, size: bodySize, color: '334155', font: docFont }),
              exp.location ? new TextRun({ text: ` (${exp.location})`, italics: true, size: contactSize, color: '64748B', font: docFont }) : null,
              new TextRun({
                text: `  [${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}]`,
                bold: true,
                size: contactSize,
                color: '475569',
                font: docFont
              })
            ].filter(Boolean)
          })
        );

        if (Array.isArray(exp.highlights)) {
          exp.highlights.forEach(h => {
            docChildren.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 30 },
                children: [new TextRun({ text: h, size: bodySize, font: docFont })]
              })
            );
          });
        }
      });
    }

    // 7. Projects
    if (profile.projects && profile.projects.length > 0) {
      addStandardHeading('Key Projects & Deliverables');
      profile.projects.forEach(proj => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 80, after: 30 },
            children: [
              new TextRun({ text: proj.title || '', bold: true, size: bodySize, font: docFont }),
              proj.projectType ? new TextRun({ text: ` [${proj.projectType}]`, bold: true, size: contactSize, color: '64748B', font: docFont }) : null,
              proj.role ? new TextRun({ text: ` (${proj.role})`, italics: true, size: contactSize, font: docFont }) : null
            ].filter(Boolean)
          })
        );
        if (proj.description) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 30 },
              children: [new TextRun({ text: proj.description, size: bodySize, font: docFont })]
            })
          );
        }
      });
    }

    // 8. Education
    if (profile.education && profile.education.length > 0) {
      addStandardHeading('Education');
      profile.education.forEach(edu => {
        const subject = edu.major || edu.field;
        const degText = `${edu.degree || ''}${subject ? ` in ${subject}` : ''}`;
        docChildren.push(
          new Paragraph({
            spacing: { before: 100, after: 30 },
            children: [
              new TextRun({ text: degText, bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` — ${edu.institution || ''}`, size: bodySize, font: docFont }),
              new TextRun({ text: ` (${edu.startDate || ''} – ${edu.current ? 'Present' : edu.endDate || ''})`, italics: true, size: contactSize, color: '64748B', font: docFont })
            ]
          })
        );
        if (edu.gpa) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [new TextRun({ text: `GPA / Result: ${edu.gpa}`, size: contactSize, italics: true, font: docFont })]
            })
          );
        }
        if (edu.thesis) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 30 },
              children: [new TextRun({ text: `Thesis: ${edu.thesis}`, size: contactSize, italics: true, color: '475569', font: docFont })]
            })
          );
        }
      });
    }

    // 9. Certifications
    if (profile.certifications && profile.certifications.length > 0) {
      addStandardHeading('Certifications');
      profile.certifications.forEach(c => {
        docChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({ text: c.title || '', bold: true, size: bodySize, font: docFont }),
              new TextRun({ text: ` — ${c.issuer || ''}${c.issueDate ? ` (${c.issueDate})` : ''}`, size: bodySize, font: docFont })
            ]
          })
        );
      });
    }

    // 10. Languages
    if (profile.languages && profile.languages.length > 0) {
      addStandardHeading('Languages');
      const langStrings = profile.languages.map(l => `${l.name} (${l.proficiency || l.cefr || 'Proficient'})`);
      docChildren.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: langStrings.join('  •  '), size: bodySize, font: docFont })]
        })
      );
    }

    // 11. Publications
    if (profile.publications && profile.publications.length > 0) {
      addStandardHeading('Publications');
      profile.publications.forEach((pub, idx) => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 60, after: 30 },
            children: [
              new TextRun({ text: `[${idx + 1}] `, bold: true, size: contactSize, font: docFont }),
              pub.authors ? new TextRun({ text: `${pub.authors}. `, size: contactSize, font: docFont }) : null,
              new TextRun({ text: `"${pub.title}". `, bold: true, size: contactSize, font: docFont }),
              new TextRun({ text: `${pub.journal || ''} (${pub.year || ''}).`, italics: true, size: contactSize, font: docFont }),
              pub.doi ? new TextRun({ text: ` DOI: ${pub.doi}`, size: contactSize, color: '1D4ED8', font: docFont }) : null
            ].filter(Boolean)
          })
        );
      });
    }

    // 12. References (Only when valid references are present)
    if (validRefs.length > 0) {
      addStandardHeading('References');
      validRefs.forEach(ref => {
        const org = ref.organization || ref.company || '';
        const parts = [
          ref.name ? new TextRun({ text: ref.name, bold: true, size: bodySize, font: docFont }) : null,
          (ref.title || org) ? new TextRun({ text: ` — ${ref.title || ''}${ref.title && org ? ' (' + org + ')' : org}`, size: bodySize, font: docFont }) : null,
          ref.email ? new TextRun({ text: ` | Email: ${ref.email}`, size: contactSize, color: '64748B', font: docFont }) : null,
          ref.phone ? new TextRun({ text: ` | Phone: ${ref.phone}`, size: contactSize, color: '64748B', font: docFont }) : null
        ].filter(Boolean);
        docChildren.push(
          new Paragraph({
            spacing: { before: 60, after: 20 },
            children: parts
          })
        );
      });
    }
  }

  // Page Dimensions & Margins (1 mm = 56.7 twips / dxa)
  const isA4 = settings.paperSize === 'a4';
  const pageProps = {
    size: isA4 ? {
      width: 11906, // 210mm
      height: 16838 // 297mm
    } : {
      width: 12240, // 8.5in
      height: 15840 // 11in
    },
    margin: {
      top: Math.round(marginsCustom.top * 56.7),
      bottom: Math.round(marginsCustom.bottom * 56.7),
      left: Math.round(marginsCustom.left * 56.7),
      right: Math.round(marginsCustom.right * 56.7)
    }
  };

  return new Document({
    sections: [
      {
        properties: {
          page: pageProps
        },
        children: docChildren
      }
    ]
  });
}

function formatEducationDegree(edu) {
  const parts = [];
  if (edu.degree) parts.push(edu.degree);
  const subject = edu.major || edu.field;
  if (subject) parts.push(`in ${subject}`);
  return parts.join(' ') || 'Education Degree';
}

export async function downloadDocx(profile, filename = 'CVForge_Resume.docx') {
  if (!window.docx) {
    alert('Word export engine is still initializing. Please wait a moment and try again.');
    return;
  }

  const doc = buildDocxDocument(profile, window.docx);
  const blob = await window.docx.Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

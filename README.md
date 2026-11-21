# CVForge – 10-in-1 Professional CV Generator

**CVForge** is a modern, responsive, 100% client-side web application designed to allow candidates to enter their professional background once and instantly generate **10 genuinely distinct, professional CV formats** suitable for USA, Canada, UK, Germany, France, Australia, and European Union job markets.

---

## 🌟 Key Capabilities

### 1. 10 Genuinely Distinct CV Formats
Every format features its own authentic layout, section hierarchy, and typography—not just color or font changes:

1. **Chronological CV**: Tells the forward progression career story (earliest education/jobs up to present), highlighting stability, foundational roots, and promotions.
2. **Reverse Chronological CV**: Corporate industry standard; highlights most recent senior accomplishments first with quantified metrics.
3. **Functional CV**: Focuses on core competency domains rather than job titles, followed by a streamlined, compact employment chronology table.
4. **Skills-Based CV**: Built around verified skill matrices, proficiency tiers (Expert, Advanced, Intermediate), and project-based proof points.
5. **Combination / Hybrid CV**: Blends an executive competency grid at the top with full, detailed reverse-chronological work experience beneath.
6. **Targeted CV**: Laser-focused on a target job opening with an explicit Target Position Banner, Value Proposition, and Requirement-to-Qualification Match Matrix.
7. **Academic CV (Curriculum Vitae)**: Comprehensive multi-page scholarly dossier featuring research interests, dissertation title & advisor, peer-reviewed publications with DOI links, research grants, teaching appointments, and academic referees.
8. **Europass CV**: Faithful implementation of the European Union Europass standard, including the European Language Passport (CEFR A1–C2 grid), mother tongue, digital competences, and driving licences.
9. **ATS-Friendly CV**: Strict single-column, standard semantic hierarchy, universal typography, zero floating tables or graphics for 100% Applicant Tracking System machine parseability.
10. **Creative / Visual CV**: Designer-forward split layout featuring an accent sidebar with photo, visual skill progress meters, project showcase cards, and timeline accents.

---

## 🚀 Getting Started

### Option A: One-Click Runner (Windows)
Double-click `run.bat` in the project root folder.

### Option B: Python HTTP Server (Cross-Platform)
```bash
python server.py
# or
py server.py
```
Open **`http://localhost:8080`** in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option C: Standalone Offline File
Because all vendor libraries (`tailwind`, `lucide`, `docx`, `html2pdf`) are bundled locally in `assets/js/vendor/`, you can also open `index.html` directly or host it on any static web host (GitHub Pages, Vercel, Netlify).

---

## 📂 Project Architecture

```
CV/
├── index.html                           # Main application single-page interface
├── server.py                            # Lightweight Python HTTP server
├── run.bat                              # One-click Windows runner
├── README.md                            # Complete documentation
└── assets/
    ├── favicon.svg                      # Clean SVG favicon
    ├── css/
    │   ├── styles.css                   # Core layout, split-screen, print stylesheets
    │   └── templates.css                # Layout-specific styling for the 10 formats
    └── js/
        ├── app.js                       # Master application coordinator
        ├── vendor/                      # Offline vendored libraries
        │   ├── docx.min.js              # Native Microsoft Word (.docx) generator
        │   ├── html2pdf.bundle.min.js   # Client-side PDF generator
        │   ├── lucide.min.js            # SVG icons system
        │   └── tailwind.min.js          # Tailwind CSS compiler
        ├── models/
        │   ├── state.js                 # Reactive state manager with undo/redo & storage
        │   └── sampleData.js            # 4 realistic sample profiles
        ├── engine/
        │   ├── atsEngine.js             # Rule-based ATS heuristic auditor
        │   ├── countryRules.js          # USA, CA, UK, DE, FR, AU, EU conventions
        │   ├── summaryEngine.js         # Smart professional summary generator
        │   ├── keywordMatcher.js        # Job description keyword matcher
        │   └── completeness.js          # Profile completeness percentage
        ├── templates/
        │   ├── index.js                 # Template registry & dispatcher
        │   ├── templateUtils.js         # Shared date & HTML sanitization helpers
        │   ├── chronological.js         # Format 1
        │   ├── reverseChrono.js         # Format 2
        │   ├── functional.js            # Format 3
        │   ├── skillsBased.js           # Format 4
        │   ├── combination.js           # Format 5
        │   ├── targeted.js              # Format 6
        │   ├── academic.js              # Format 7
        │   ├── europass.js              # Format 8
        │   ├── atsFriendly.js           # Format 9
        │   └── creativeVisual.js        # Format 10
        ├── export/
        │   ├── pdfExporter.js           # High-DPI PDF & vector print engine
        │   ├── docxExporter.js          # Word .docx generator
        │   └── jsonExporter.js          # JSON backup & restore
        └── components/
            ├── formSections.js          # 16 dynamic input form sections with optional section toggles
            ├── photoCropModal.js        # Canvas-based photo cropping, zoom (1x-3x), pan & shape controls
            ├── customizeBar.js          # Toolbar: fonts, colors, spacing, paper, zoom
            ├── templateGalleryModal.js  # Interactive Visual Template Gallery with schematics
            ├── atsDrawer.js             # Rule-based ATS Audit with actionable checks & disclaimer
            ├── jobMatcherModal.js       # Job Description Keyword Matcher modal
            ├── countryModal.js          # International conventions modal (US, CA, UK, DE, FR, AU, EU)
            ├── coverLetter.js           # Matching Cover Letter generator (Executive & Graduate tones)
            └── profileManagerModal.js   # Multiple profile versions, JSON backup/restore & privacy wipe
```

---

## 🔒 100% Client-Side Privacy & Security
- **Zero Cloud Upload**: All personal information entered is stored strictly in your browser's local storage (`localStorage`).
- **No Tracking**: No external telemetry, tracking cookies, or analytics.
- **Privacy Purge**: The Profile Manager includes a "Wipe All Local Data" feature to immediately purge all candidate data from the device.

---

## 📜 International Recruitment Guidelines
- **USA & Canada**: Concise 1–2 pages, strictly anti-discrimination (no photo, no age, no marital status), active action verbs, US Letter dimensions.
- **United Kingdom**: 2 pages standard, British spelling, personal statement, A4 paper.
- **Germany (DACH)**: *Tabellarischer Lebenslauf*, professional photo standard, structured dates, CEFR language ratings.
- **France**: Concise 1 page preferred, diploma credentials prominent, photo accepted.
- **Australia**: Comprehensive 2–3 pages, distinct responsibilities and achievements, referee contacts expected.
- **European Union**: Standard Europass structure and European Language Passport.

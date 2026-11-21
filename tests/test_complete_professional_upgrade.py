import os
import re
import sys
import json

CV_DIR = r"c:\Users\SOBUJ\Documents\CV"

def test_references_enhancement():
    print("Testing 1: References enhancement (Removed availability sentence completely)...")
    template_utils_path = os.path.join(CV_DIR, "assets", "js", "templates", "templateUtils.js")
    with open(template_utils_path, "r", encoding="utf-8") as f:
        code = f.read()
    
    assert "References available upon request." not in code, "Must completely omit 'References available upon request.'"
    assert "Additional reference" not in code, "Must NOT contain old wording 'Additional reference'"

    form_sec_path = os.path.join(CV_DIR, "assets", "js", "components", "formSections.js")
    with open(form_sec_path, "r", encoding="utf-8") as f:
        form_code = f.read()
    
    assert "ref-name" in form_code, "Must have referee name field"
    assert "ref-title" in form_code, "Must have referee title field"
    assert "ref-company" in form_code, "Must have referee organization field"
    assert "ref-email" in form_code, "Must have referee email field"
    assert "ref-phone" in form_code, "Must have referee phone field"
    assert "btn-ref-up" in form_code and "btn-ref-down" in form_code, "Must allow reordering referees"

    docx_path = os.path.join(CV_DIR, "assets", "js", "export", "docxExporter.js")
    with open(docx_path, "r", encoding="utf-8") as f:
        docx_code = f.read()
    assert "References available upon request." not in docx_code, "DOCX export must NOT contain upon request sentence"
    print("  -> References test passed!")

def test_data_management_and_clear_options():
    print("Testing 2: Data management & clear options...")
    state_path = os.path.join(CV_DIR, "assets", "js", "models", "state.js")
    with open(state_path, "r", encoding="utf-8") as f:
        state_code = f.read()
    
    assert "clearAllCandidateData" in state_code, "Must implement clearAllCandidateData"
    assert "resetSection" in state_code, "Must implement resetSection"
    assert "startNewCV" in state_code, "Must implement startNewCV"

    clear_modal_path = os.path.join(CV_DIR, "assets", "js", "components", "clearDataModal.js")
    assert os.path.exists(clear_modal_path), "clearDataModal.js must exist"
    with open(clear_modal_path, "r", encoding="utf-8") as f:
        modal_code = f.read()
    assert "Download JSON Backup" in modal_code, "Clear modal must offer JSON backup before clearing"
    assert "Cancel" in modal_code and "Clear Candidate Data" in modal_code, "Must have Cancel and Confirm buttons"

    form_sec_path = os.path.join(CV_DIR, "assets", "js", "components", "formSections.js")
    with open(form_sec_path, "r", encoding="utf-8") as f:
        form_code = f.read()
    assert "btn-reset-section" in form_code, "Must have reset section buttons on accordions"

    index_path = os.path.join(CV_DIR, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        index_code = f.read()
    assert "btn-header-clear-data" in index_code, "Header must provide clear data button"
    print("  -> Data management test passed!")

def test_template_gallery_and_custom_templates():
    print("Testing 3 & 4: Template gallery & custom imported templates...")
    templates_index_path = os.path.join(CV_DIR, "assets", "js", "templates", "index.js")
    templates_index_path = os.path.join(CV_DIR, "assets", "js", "templates", "index.js")
    catalog_path = os.path.join(CV_DIR, "assets", "js", "templates", "catalog.js")
    with open(templates_index_path, "r", encoding="utf-8") as f:
        t_code = f.read()
    if os.path.exists(catalog_path):
        with open(catalog_path, "r", encoding="utf-8") as f:
            t_code += f.read()
    
    required_templates = [
        "reverse-chronological",
        "chronological",
        "corporate-executive",
        "clean-minimal",
        "ats-friendly",
        "modern-ats",
        "creative-visual",
        "academic",
        "skills-based",
        "functional",
        "combination",
        "targeted",
        "us-resume",
        "uk-cv",
        "europass",
        "german-cv",
        "bangladesh-cv",
        "custom-academic-green",
        "custom-bd-classic",
        "custom-executive-bluebar"
    ]

    for tid in required_templates:
        assert f"'{tid}'" in t_code or f'"{tid}"' in t_code, f"Template {tid} must be registered in index.js/catalog.js"
    
    # Check custom imported template files
    custom_files = [
        "customAcademicGreen.js",
        "customBdClassic.js",
        "customExecutiveBluebar.js",
        "corporateExecutive.js",
        "cleanMinimal.js",
        "modernAts.js",
        "germanCv.js",
        "usResume.js",
        "ukCv.js"
    ]
    for cfile in custom_files:
        full_p = os.path.join(CV_DIR, "assets", "js", "templates", cfile)
        assert os.path.exists(full_p), f"Template file {cfile} must exist"

    # Verify templateGalleryModal.js (2-step workflow with 10 format categories and dedicated templates)
    gallery_path = os.path.join(CV_DIR, "assets", "js", "components", "templateGalleryModal.js")
    with open(gallery_path, "r", encoding="utf-8") as f:
        g_code = f.read()
    assert "format-category-card" in g_code or "btn-browse-format" in g_code, "Must have format category selection cards in Step 1"
    assert "btn-back-to-formats" in g_code, "Must have Back to All Formats button in Step 2"
    assert "btn-select-template" in g_code, "Must have Apply Template button in Step 2"
    print("  -> Template gallery 2-step workflow & custom templates test passed!")

def test_bangladesh_international_settings():
    print("Testing 5: Bangladesh (BD) international CV settings...")
    country_rules_path = os.path.join(CV_DIR, "assets", "js", "engine", "countryRules.js")
    with open(country_rules_path, "r", encoding="utf-8") as f:
        c_code = f.read()
    
    assert "BD:" in c_code, "Must have BD country definition in countryRules.js"
    assert "Bangladesh" in c_code, "Must have Bangladesh country name"
    assert "A4" in c_code, "BD must use A4 paper size"

    state_path = os.path.join(CV_DIR, "assets", "js", "models", "state.js")
    with open(state_path, "r", encoding="utf-8") as f:
        state_code = f.read()
    assert "countryCode === 'BD'" in state_code, "state.js must handle BD country selection"
    assert "fatherName" in state_code and "motherName" in state_code, "state.js must have fatherName and motherName"
    assert "permanentAddress" in state_code, "state.js must have permanentAddress"
    assert "religion" in state_code and "maritalStatus" in state_code, "state.js must have religion and maritalStatus"

    form_sec_path = os.path.join(CV_DIR, "assets", "js", "components", "formSections.js")
    with open(form_sec_path, "r", encoding="utf-8") as f:
        form_code = f.read()
    assert "inp-father-name" in form_code, "formSections.js must have father's name field"
    assert "inp-mother-name" in form_code, "formSections.js must have mother's name field"
    assert "inp-permanent-address" in form_code, "formSections.js must have permanent address field"
    assert "inp-religion" in form_code, "formSections.js must have religion field"
    print("  -> Bangladesh international settings test passed!")

def test_typography_and_22_fonts():
    print("Testing 6: 22 font families and typography options...")
    fonts_22 = [
        "Arial", "Calibri", "Aptos", "Times New Roman", "Georgia", "Cambria",
        "Garamond", "Helvetica", "Verdana", "Tahoma", "Trebuchet MS",
        "Inter", "Roboto", "Open Sans", "Lato", "Source Sans 3",
        "Merriweather", "Playfair Display", "Montserrat", "Poppins",
        "IBM Plex Sans", "IBM Plex Serif"
    ]

    styles_path = os.path.join(CV_DIR, "assets", "css", "styles.css")
    with open(styles_path, "r", encoding="utf-8") as f:
        css = f.read()

    for font in fonts_22:
        assert f'data-font="{font}"' in css, f"styles.css must support data-font='{font}'"

    assert 'data-font-style="regular"' in css, "styles.css must support font styles"
    assert 'data-font-style="bold"' in css, "styles.css must support bold font style"
    assert 'data-font-target="headings"' in css, "styles.css must support granular heading targets"

    typo_modal_path = os.path.join(CV_DIR, "assets", "js", "components", "typographyModal.js")
    with open(typo_modal_path, "r", encoding="utf-8") as f:
        t_modal = f.read()
    assert "live-font-preview-box" in t_modal, "typographyModal must have live font preview card"
    assert "modal-sel-font" in t_modal, "typographyModal must have font selector"
    assert "modal-sel-style" in t_modal, "typographyModal must have font style selector"
    assert "modal-sel-target" in t_modal, "typographyModal must have target selector"

    index_path = os.path.join(CV_DIR, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        idx = f.read()
    assert "fonts.googleapis.com" in idx, "index.html must load Google Fonts"
    print("  -> 22 fonts and typography test passed!")

def test_english_ui_compliance():
    print("Testing 7: Professional English UI compliance (no Bangla in interface)...")
    # Verify no Bangla script characters (\u0980-\u09FF) in app JS / HTML UI
    ui_files = [
        os.path.join(CV_DIR, "assets", "js", "components", "countryModal.js"),
        os.path.join(CV_DIR, "assets", "js", "components", "formSections.js"),
        os.path.join(CV_DIR, "assets", "js", "components", "templateGalleryModal.js"),
        os.path.join(CV_DIR, "assets", "js", "components", "typographyModal.js"),
        os.path.join(CV_DIR, "assets", "js", "engine", "countryRules.js"),
        os.path.join(CV_DIR, "index.html")
    ]
    bangla_pattern = re.compile(r'[\u0980-\u09FF]')
    for fpath in ui_files:
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
        matches = bangla_pattern.findall(content)
        assert len(matches) == 0, f"File {fpath} contains Bangla characters in UI: {matches[:5]}"
    print("  -> English UI compliance passed (0 Bangla characters in UI)!")

if __name__ == "__main__":
    test_references_enhancement()
    test_data_management_and_clear_options()
    test_template_gallery_and_custom_templates()
    test_bangladesh_international_settings()
    test_typography_and_22_fonts()
    test_english_ui_compliance()
    print("\n==============================================")
    print("ALL COMPLETE PROFESSIONAL UPGRADE TESTS PASSED!")
    print("==============================================")

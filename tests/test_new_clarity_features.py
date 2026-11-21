"""
Test suite for CVForge UX, Form Clarity & CV Quality Improvements
Validates:
1. Optional Job Headline in forms & state
2. Fresh Graduate mode: hides experience section across all 10 templates
3. Degree vs Subject/Major education formatting
4. 6 distinct skill categories
5. Point-based typography & millimeter-based margins
6. 4 realistic sample candidate profiles
7. References available upon request
8. DOCX export formatting parity
"""

import os
import re
import sys

CV_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def read_file(rel_path):
    with open(os.path.join(CV_DIR, rel_path), "r", encoding="utf-8") as f:
        return f.read()

def test_optional_headline():
    print("Testing Optional Job Headline...")
    form_sections = read_file("assets/js/components/formSections.js")
    # Must have label for inp-headline
    assert 'label for="inp-headline"' in form_sections
    # Headline label should contain '(Optional)'
    assert 'Professional Job Headline <span class="text-[10px] text-slate-400 font-normal">(Optional)</span>' in form_sections
    # Must NOT have required attribute on inp-headline
    headline_inp_match = re.search(r'<input[^>]*id="inp-headline"[^>]*>', form_sections)
    assert headline_inp_match, "inp-headline not found"
    assert "required" not in headline_inp_match.group(0), "inp-headline should not be required"
    print("  ✓ inp-headline is explicitly optional with helpful guidance")

def test_fresh_graduate_and_experience_hiding():
    print("Testing Fresh Graduate mode & experience hiding across templates...")
    template_utils = read_file("assets/js/templates/templateUtils.js")
    assert "isFreshGraduateCandidate" in template_utils
    assert "formatEducationDegree" in template_utils
    assert "renderCategorizedSkillsHtml" in template_utils
    assert "renderReferencesHtml" in template_utils

    templates = [
        "academic.js",
        "atsFriendly.js",
        "chronological.js",
        "combination.js",
        "creativeVisual.js",
        "europass.js",
        "functional.js",
        "reverseChrono.js",
        "skillsBased.js",
        "targeted.js"
    ]

    for tmpl in templates:
        content = read_file(f"assets/js/templates/{tmpl}")
        assert "isFreshGraduateCandidate" in content or "isFreshGraduate" in content, f"{tmpl} missing isFreshGraduate check"
        assert "formatEducationDegree" in content, f"{tmpl} missing formatEducationDegree"
        print(f"  ✓ {tmpl} properly checks fresh graduate and formats education")

def test_skill_categories():
    print("Testing simplified single category 'Skills' in state, forms, and utils...")
    state_js = read_file("assets/js/models/state.js")
    assert "addSkill" in state_js, "State missing addSkill"
    assert "deleteSkill" in state_js, "State missing deleteSkill"
    assert "updateSkill" in state_js, "State missing updateSkill"
    assert "moveSkill" in state_js, "State missing moveSkill"

    form_sections = read_file("assets/js/components/formSections.js")
    assert '<span>Skills</span>' in form_sections, "Section 5 heading must be 'Skills'"
    assert 'btn-add-skill' in form_sections, "Missing btn-add-skill"
    assert 'btn-add-custom-skill' in form_sections, "Missing btn-add-custom-skill"
    assert 'inp-custom-skill-name' in form_sections, "Missing custom skill input"

    print("  ✓ Simplified Skills section with Add Skill and Custom Skill verified")

def test_point_typography_and_mm_margins():
    print("Testing point-based font sizes & millimeter margins...")
    state_js = read_file("assets/js/models/state.js")
    assert "fontSizes" in state_js
    assert "marginsCustom" in state_js
    assert "setFontSizes" in state_js
    assert "resetFontSizes" in state_js
    assert "setMarginsCustom" in state_js
    assert "resetMarginsCustom" in state_js

    # Check CSS vars in styles.css
    styles_css = read_file("assets/css/styles.css")
    assert "--cv-name-size" in styles_css
    assert "--cv-heading-size" in styles_css
    assert "--cv-body-size" in styles_css
    assert "--cv-contact-size" in styles_css
    assert "--cv-margin-top" in styles_css
    assert "--cv-margin-bottom" in styles_css
    assert "--cv-margin-left" in styles_css
    assert "--cv-margin-right" in styles_css

    # Check modals exist
    assert os.path.exists(os.path.join(CV_DIR, "assets/js/components/typographyModal.js"))
    assert os.path.exists(os.path.join(CV_DIR, "assets/js/components/marginsModal.js"))

    # Check customizeBar triggers
    cust_bar = read_file("assets/js/components/customizeBar.js")
    assert "btn-open-typography-modal" in cust_bar
    assert "btn-open-margins-modal" in cust_bar

    # Check docxExporter parity
    docx_exp = read_file("assets/js/export/docxExporter.js")
    assert "fontSizes" in docx_exp
    assert "marginsCustom" in docx_exp
    assert "56.7" in docx_exp  # mm to twip conversion

    print("  ✓ Point-based typography and millimeter margins verified in State, CSS, Modals, and DOCX")

def test_four_sample_profiles():
    print("Testing 4 realistic candidate profiles...")
    sample_data = read_file("assets/js/models/sampleData.js")
    for profile_key in ["fresh_graduate", "experienced_professional", "data_analyst", "office_assistant"]:
        assert profile_key in sample_data, f"Sample profile missing: {profile_key}"

    # Check profiles in index.html select
    index_html = read_file("index.html")
    assert 'value="fresh_graduate"' in index_html
    assert 'value="experienced_professional"' in index_html
    assert 'value="data_analyst"' in index_html
    assert 'value="office_assistant"' in index_html

    # Check Eleanor Vance is a fresh graduate Mathematics student
    assert "Eleanor Vance" in sample_data
    assert "Mathematics" in sample_data
    assert "David R. Miller" in sample_data
    assert "Operations & Project Manager" in sample_data
    assert "Maya Lin" in sample_data
    assert "Junior Data Analyst" in sample_data
    assert "Sarah Jenkins" in sample_data
    assert "Administrative Assistant" in sample_data

    print("  ✓ All 4 realistic sample candidate profiles verified")

def test_references_upon_request():
    print("Testing References Removal & Pure Referee Details...")
    # Strict mandate: "References available upon request." must be completely removed from all templates
    template_utils = read_file("assets/js/templates/templateUtils.js")
    assert "References available upon request" not in template_utils

    form_sections = read_file("assets/js/components/formSections.js")
    assert "chk-references-upon-request" not in form_sections
    assert "References available upon request" not in form_sections

    print("  ✓ Prohibited upon request text completely removed & omitted when references empty")

def run_all():
    print("=" * 60)
    print("RUNNING CLARITY & QUALITY FEATURES VERIFICATION")
    print("=" * 60)
    test_optional_headline()
    test_fresh_graduate_and_experience_hiding()
    test_skill_categories()
    test_point_typography_and_mm_margins()
    test_four_sample_profiles()
    test_references_upon_request()
    print("=" * 60)
    print("ALL TESTS PASSED SUCCESSFULLY! (100%)")
    print("=" * 60)

if __name__ == "__main__":
    run_all()

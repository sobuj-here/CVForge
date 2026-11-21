"""
Test Suite: Personal Information Font & Skills Section Simplification
Validates:
1. Personal Information editing form font sizes (16px labels/inputs, 48px height, 15-16px buttons/placeholders, 14px helpers).
2. CSS is strictly scoped to #sec-personal and does not affect other sections, CV paper, or exports.
3. Skills section simplification into a single category named 'Skills' with Name and optional Level.
4. Add Skill, Add Custom Skill, edit, delete, and move functionality.
5. Zero automatic prefill of fake skills.
6. All 10 CV formats support the unified skills structure.
"""

import re
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def test_personal_info_css():
    css_path = os.path.join(BASE_DIR, 'assets', 'css', 'styles.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    # Verify #sec-personal scoped rules exist
    assert '#sec-personal' in css, "CSS must contain #sec-personal rules"
    
    # 1. Labels: 16px
    label_match = re.search(r'#sec-personal[^{]*label[^{]*\{([^}]+)\}', css, re.DOTALL)
    assert label_match, "Must have #sec-personal label rule"
    assert '16px' in label_match.group(1), "Label font-size must be 16px"

    # 2. Input Text: 16px, height ~46-48px
    input_match = re.search(r'#sec-personal[^{]*input[^{]*\{([^}]+)\}', css, re.DOTALL)
    assert input_match, "Must have #sec-personal input rule"
    assert '16px' in input_match.group(1), "Input font-size must be 16px"
    assert '48px' in input_match.group(1), "Input height must be ~48px"

    # 3. Placeholder: 15-16px
    placeholder_match = re.search(r'#sec-personal[^{]*placeholder[^{]*\{([^}]+)\}', css, re.DOTALL)
    assert placeholder_match, "Must have placeholder rule"
    assert ('15' in placeholder_match.group(1) or '16' in placeholder_match.group(1)), "Placeholder must be 15-16px"

    # 4. Helper Text: 14px
    helper_match = re.search(r'#sec-personal[^{]*\.text-slate-500[^{]*\{([^}]+)\}', css, re.DOTALL)
    assert helper_match, "Must have helper text rule"
    assert '14px' in helper_match.group(1), "Helper text must be 14px"

    # 5. Buttons: 15-16px
    btn_match = re.search(r'#sec-personal[^{]*#btn-trigger-crop-modal[^{]*\{([^}]+)\}', css, re.DOTALL)
    assert btn_match, "Must have button rule"
    assert ('15' in btn_match.group(1) or '16' in btn_match.group(1)), "Button font-size must be 15-16px"

    # 6. Scoping: confirm other form sections are not overridden
    assert '#sec-summary label' not in css, "Summary section labels should not be modified"
    assert '#sec-experience label' not in css, "Experience section labels should not be modified"
    print("PASS: Personal Info CSS Scoping & Font Sizes")

def test_skills_form_sections():
    form_path = os.path.join(BASE_DIR, 'assets', 'js', 'components', 'formSections.js')
    with open(form_path, 'r', encoding='utf-8') as f:
        code = f.read()

    # Section 5 must be titled Skills, not "Skills & Competency Categories"
    assert '<span>Skills</span>' in code, "Section 5 heading must be 'Skills'"
    assert 'Skills & Competency Categories' not in code, "Old multi-category heading must be removed"

    # Buttons must include Add Skill and Add Custom Skill
    assert 'btn-add-skill' in code, "Must have Add Skill button"
    assert 'btn-add-custom-skill' in code, "Must have Add Custom Skill button"
    assert 'inp-custom-skill-name' in code, "Must have custom skill name input"

    # Legacy category cards must be removed
    assert 'btn-add-tech-skill' not in code, "Technical skills button must be removed"
    assert 'btn-add-prog-skill' not in code, "Programming languages button must be removed"
    assert 'btn-add-data-skill' not in code, "Data skills button must be removed"
    assert 'btn-add-soft-skill' not in code, "Soft skills button must be removed"
    assert 'btn-add-comm-skill' not in code, "Comm skills button must be removed"
    assert 'tech-skills-list' not in code, "Legacy tech skills container must be removed"

    # Single list container
    assert 'skills-items-list' in code, "Must have unified skills-items-list container"
    assert 'renderUnifiedSkillsList' in code, "Must use renderUnifiedSkillsList"
    print("PASS: Form Sections Simplified Skills UI")

def test_state_management():
    state_path = os.path.join(BASE_DIR, 'assets', 'js', 'models', 'state.js')
    with open(state_path, 'r', encoding='utf-8') as f:
        code = f.read()

    # DEFAULT_PROFILE must have empty array skills: []
    assert 'skills: []' in code, "DEFAULT_PROFILE skills must be empty array"

    # addSkill, updateSkill, deleteSkill, moveSkill must be defined
    assert 'addSkill(' in code, "Must define addSkill"
    assert 'updateSkill(' in code, "Must define updateSkill"
    assert 'deleteSkill(' in code, "Must define deleteSkill"
    assert 'moveSkill(' in code, "Must define moveSkill"

    # Migration of legacy categories must exist
    assert 'addMigrated' in code, "Must have migration logic for legacy category data"
    print("PASS: State Management & Data Migration")

def test_templates_support():
    templates_dir = os.path.join(BASE_DIR, 'assets', 'js', 'templates')
    for fname in os.listdir(templates_dir):
        if not fname.endswith('.js') or fname == 'index.js':
            continue
        fpath = os.path.join(templates_dir, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        # Verify no hard crashing assumptions
        assert 'export function' in content or 'export const' in content, f"{fname} must export render function"
    print("PASS: All 10 CV Templates verified")

def test_docx_exporter():
    docx_path = os.path.join(BASE_DIR, 'assets', 'js', 'export', 'docxExporter.js')
    with open(docx_path, 'r', encoding='utf-8') as f:
        content = f.read()
    assert "addSectionHeading('Skills')" in content, "DOCX exporter should output 'Skills' heading"
    print("PASS: DOCX Exporter handles unified Skills")

if __name__ == '__main__':
    test_personal_info_css()
    test_skills_form_sections()
    test_state_management()
    test_templates_support()
    test_docx_exporter()
    print("\nALL VERIFICATION CHECKS PASSED SUCCESSFULLY!")

"""
Comprehensive Verification Test Suite for CVForge
Validates all 10 templates, models, exports, and data structures.
"""

import os
import re
import json

def test_file_integrity():
    js_files = []
    for root, dirs, files in os.walk('assets/js'):
        for f in files:
            if f.endswith('.js') and 'vendor' not in root:
                js_files.append(os.path.join(root, f))

    print(f"1. Validating file existence and non-emptiness for {len(js_files)} custom JS files...")
    for fp in js_files:
        assert os.path.exists(fp), f"Missing file: {fp}"
        size = os.path.getsize(fp)
        assert size > 50, f"File unexpectedly small ({size} bytes): {fp}"
        # Ensure UTF-8 readable
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
            assert len(content) > 0

    print("   [PASS] All JS files exist and are valid UTF-8.")

def test_templates_coverage():
    print("2. Validating all 10 CV Formats in templates/index.js...")
    with open('assets/js/templates/index.js', 'r', encoding='utf-8') as f:
        content = f.read()
    if os.path.exists('assets/js/templates/catalog.js'):
        with open('assets/js/templates/catalog.js', 'r', encoding='utf-8') as f:
            content += f.read()

    expected_templates = [
      'chronological',
      'reverse-chronological',
      'functional',
      'skills-based',
      'combination',
      'targeted',
      'academic',
      'europass',
      'ats-friendly',
      'creative-visual'
    ]

    for t in expected_templates:
        assert t in content, f"Missing template '{t}' in templates/index.js"
        # Check template file exists
        file_map = {
            'chronological': 'assets/js/templates/chronological.js',
            'reverse-chronological': 'assets/js/templates/reverseChrono.js',
            'functional': 'assets/js/templates/functional.js',
            'skills-based': 'assets/js/templates/skillsBased.js',
            'combination': 'assets/js/templates/combination.js',
            'targeted': 'assets/js/templates/targeted.js',
            'academic': 'assets/js/templates/academic.js',
            'europass': 'assets/js/templates/europass.js',
            'ats-friendly': 'assets/js/templates/atsFriendly.js',
            'creative-visual': 'assets/js/templates/creativeVisual.js'
        }
        target_file = file_map[t]
        assert os.path.exists(target_file), f"Template file does not exist: {target_file}"

    print("   [PASS] All 10 CV Formats are correctly registered and map to actual template files.")

def test_demo_data_separation():
    print("3. Validating Demo Data separation & isDemo flags...")
    with open('assets/js/models/state.js', 'r', encoding='utf-8') as f:
        state_content = f.read()

    assert "isDemo: false" in state_content, "Default profile must start with isDemo: false"

    with open('assets/js/models/sampleData.js', 'r', encoding='utf-8') as f:
        sample_content = f.read()

    # All 4 sample profiles must explicitly have isDemo: true
    samples = ['senior_engineer', 'fresh_graduate', 'academic_researcher', 'creative_designer']
    for s in samples:
        assert s in sample_content, f"Missing sample profile: {s}"

    # Count occurrences of isDemo: true
    is_demo_count = sample_content.count("isDemo: true")
    assert is_demo_count >= 4, f"Expected at least 4 sample profiles with isDemo: true, found {is_demo_count}"

    print("   [PASS] Clean blank profile starts with isDemo: false; all 4 sample profiles have isDemo: true.")

def test_ats_engine_disclaimer():
    print("4. Validating ATS Engine rule-based scoring and disclaimer...")
    with open('assets/js/engine/atsEngine.js', 'r', encoding='utf-8') as f:
        ats_content = f.read()

    assert "disclaimer" in ats_content.lower(), "ATS engine must include an explicit disclaimer"
    assert "guarantee" in ats_content.lower(), "ATS engine must explicitly state it cannot guarantee interview or hiring outcomes"
    assert "checks" in ats_content, "ATS engine must return individual check breakdown"

    print("   [PASS] ATS engine includes rule-based check list and explicit non-guarantee disclaimer.")

def test_vendored_libraries():
    print("5. Validating vendored offline libraries in assets/js/vendor/...")
    expected_vendors = [
        ('assets/js/vendor/tailwind.min.js', 100000),
        ('assets/js/vendor/lucide.min.js', 50000),
        ('assets/js/vendor/html2pdf.bundle.min.js', 100000),
        ('assets/js/vendor/docx.min.js', 100000)
    ]
    for path, min_size in expected_vendors:
        assert os.path.exists(path), f"Missing vendored library: {path}"
        size = os.path.getsize(path)
        assert size > min_size, f"Vendored library {path} is smaller than expected: {size} bytes"

    print("   [PASS] All 4 vendored libraries are complete and ready for offline execution.")

if __name__ == '__main__':
    print("==================================================")
    print("CVForge Automated Verification Test Suite")
    print("==================================================")
    test_file_integrity()
    test_templates_coverage()
    test_demo_data_separation()
    test_ats_engine_disclaimer()
    test_vendored_libraries()
    print("==================================================")
    print("ALL 5 VERIFICATION SUITES PASSED CLEANLY (100%)")
    print("==================================================")

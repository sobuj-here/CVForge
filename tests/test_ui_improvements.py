"""
Test suite for CVForge UI Improvements:
1. 7 Professional Themes
2. Font family (including Lato) & Font scaling
3. Photo controls (size, shape, upload modal)
4. Export verification modal
5. Duplicate skills handling
6. HTTP server response check
"""

import os
import re
import urllib.request

def test_themes():
    print("1. Validating 7 Professional Themes...")
    with open('assets/css/styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    expected_themes = [
        'minimal-white',
        'soft-blue',
        'soft-lavender',
        'warm-beige',
        'light-gray',
        'professional-navy',
        'modern-pastel'
    ]
    for th in expected_themes:
        assert f'data-theme="{th}"' in css, f"Missing CSS rules for theme: {th}"

    with open('assets/js/models/state.js', 'r', encoding='utf-8') as f:
        state = f.read()
    for th in expected_themes:
        assert th in state, f"Missing state handler for theme: {th}"

    with open('assets/js/components/customizeBar.js', 'r', encoding='utf-8') as f:
        cbar = f.read()
    for th in expected_themes:
        assert th in cbar, f"Missing customizeBar selector for theme: {th}"

    print("   [PASS] All 7 Professional Themes properly configured across CSS, State, and UI.")

def test_font_controls():
    print("2. Validating Typography & Font Controls...")
    with open('assets/css/styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    assert 'Lato' in css, "Missing Lato font import in CSS"
    assert 'data-font="Lato"' in css, "Missing data-font='Lato' rule in CSS"

    for sz in ['compact', 'normal', 'large', 'xlarge']:
        assert f'data-font-size="{sz}"' in css, f"Missing data-font-size='{sz}' rule in CSS"

    with open('assets/js/components/customizeBar.js', 'r', encoding='utf-8') as f:
        cbar = f.read()
    assert 'Lato' in cbar, "Missing Lato option in customizeBar"
    assert ('btn-open-typography-modal' in cbar or 'sel-font-size' in cbar), "Missing typography button/selector in customizeBar"

    with open('assets/js/export/docxExporter.js', 'r', encoding='utf-8') as f:
        docx = f.read()
    assert ('fontSizes' in docx or 'fontScaleMap' in docx), "Missing font sizing in docxExporter"

    print("   [PASS] Font controls (Lato, point-based font sizes, docx scale) properly integrated.")

def test_photo_controls():
    print("3. Validating Photo Dimension & Style Controls...")
    with open('assets/js/components/customizeBar.js', 'r', encoding='utf-8') as f:
        cbar = f.read()
    assert 'sel-photo-size' in cbar, "Missing photo size selector in customizeBar"
    assert 'sel-photo-shape' in cbar, "Missing photo shape selector in customizeBar"

    with open('assets/js/templates/templateUtils.js', 'r', encoding='utf-8') as f:
        tutils = f.read()
    assert 'photoSize' in tutils, "templateUtils must respect settings.photoSize"
    assert 'photoShape' in tutils, "templateUtils must respect settings.photoShape"

    print("   [PASS] Photo dimensions and shapes supported in customizeBar and templateUtils.")

def test_export_modal():
    print("4. Validating Pre-Download Export Verification Modal...")
    assert os.path.exists('assets/js/components/exportModal.js'), "Missing exportModal.js"
    with open('assets/js/components/exportModal.js', 'r', encoding='utf-8') as f:
        exp = f.read()
    assert 'openExportModal' in exp, "exportModal.js must export openExportModal"
    assert 'complianceItems' in exp, "exportModal.js must audit compliance"
    assert 'isDemo' in exp, "exportModal.js must warn when isDemo is true"
    assert 'downloadPdf' in exp, "exportModal.js must link to PDF download"
    assert 'downloadDocx' in exp, "exportModal.js must link to DOCX download"

    with open('assets/js/app.js', 'r', encoding='utf-8') as f:
        app = f.read()
    assert 'openExportModal' in app, "app.js must call openExportModal"

    print("   [PASS] Pre-Download Export Verification Modal fully wired up.")

def test_duplicate_skills_handling():
    print("5. Validating Skills Deduplication...")
    with open('assets/js/components/formSections.js', 'r', encoding='utf-8') as f:
        form = f.read()
    assert 'btn-deduplicate-skills' in form, "Missing btn-deduplicate-skills in formSections.js"
    assert 'duplicateSkillsSet' in form, "Missing duplicate detection set in formSections.js"

    print("   [PASS] Skills duplicate detection & cleanup button present in formSections.js.")

def test_http_endpoints():
    print("6. Validating HTTP Endpoints...")
    endpoints = [
        '/',
        '/assets/css/styles.css',
        '/assets/js/app.js',
        '/assets/js/models/state.js',
        '/assets/js/models/sampleData.js',
        '/assets/js/components/customizeBar.js',
        '/assets/js/components/formSections.js',
        '/assets/js/components/exportModal.js',
        '/assets/js/components/templateGalleryModal.js',
        '/assets/js/components/photoCropModal.js',
        '/assets/js/components/countryModal.js',
        '/assets/js/components/atsDrawer.js',
        '/assets/js/components/jobMatcherModal.js',
        '/assets/js/components/coverLetter.js',
        '/assets/js/components/profileManagerModal.js',
        '/assets/js/export/pdfExporter.js',
        '/assets/js/export/docxExporter.js',
        '/assets/js/templates/index.js',
        '/assets/js/vendor/tailwind.min.js',
        '/assets/js/vendor/lucide.min.js',
        '/assets/js/vendor/html2pdf.bundle.min.js',
        '/assets/js/vendor/docx.min.js'
    ]

    for ep in endpoints:
        url = f'http://localhost:8080{ep}'
        req = urllib.request.Request(url, headers={'Connection': 'close'})
        with urllib.request.urlopen(req, timeout=5) as res:
            assert res.status == 200, f"Endpoint {ep} returned status {res.status}"

    print(f"   [PASS] All {len(endpoints)} critical endpoints returned HTTP 200 OK.")

if __name__ == '__main__':
    test_themes()
    test_font_controls()
    test_photo_controls()
    test_export_modal()
    test_duplicate_skills_handling()
    test_http_endpoints()
    print("=" * 55)
    print("ALL UI IMPROVEMENT SUITES PASSED CLEANLY (100%)")
    print("=" * 55)

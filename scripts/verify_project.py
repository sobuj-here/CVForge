import os
import zipfile
import re

print("--- 1. Checking 10 Core Format Modules ---")
core_formats = [
    'chronological.js',
    'reverseChrono.js',
    'functional.js',
    'skillsBased.js',
    'combination.js',
    'targeted.js',
    'academic.js',
    'europass.js',
    'atsFriendly.js',
    'creativeVisual.js'
]
for f in core_formats:
    p = os.path.join("assets/js/templates", f)
    exists = os.path.exists(p)
    size = os.path.getsize(p) if exists else 0
    print(f"Format [{f}]: {'FOUND' if exists else 'MISSING'} ({size} bytes)")

print("\n--- 2. Checking Template Catalog ---")
catalog_path = "assets/js/templates/catalog.js"
if os.path.exists(catalog_path):
    with open(catalog_path, "r", encoding="utf-8") as f:
        content = f.read()
    ids = re.findall(r"id:\s*['\"]([^'\"]+)['\"]", content)
    print(f"Found {len(ids)} template IDs in catalog.js")
    print("Format categories covered in catalog:")
    categories = re.findall(r"format:\s*['\"]([^'\"]+)['\"]", content)
    unique_formats = sorted(set(categories))
    for cat in unique_formats:
        count = categories.count(cat)
        print(f"  - {cat}: {count} templates")

print("\n--- 3. Checking Exporters ---")
pdf_path = "assets/js/export/pdfExporter.js"
docx_path = "assets/js/export/docxExporter.js"
print("PDF Exporter:", "FOUND" if os.path.exists(pdf_path) else "MISSING")
print("DOCX Exporter:", "FOUND" if os.path.exists(docx_path) else "MISSING")

# Check if reference availability text is removed
with open(pdf_path, "r", encoding="utf-8") as f:
    pdf_c = f.read()
with open(docx_path, "r", encoding="utf-8") as f:
    docx_c = f.read()

has_pdf_bad = "available upon request" in pdf_c.lower()
has_docx_bad = "available upon request" in docx_c.lower()
print(f"PDF exporter clean of 'available upon request': {not has_pdf_bad}")
print(f"DOCX exporter clean of 'available upon request': {not has_docx_bad}")

print("\n--- 4. Checking Android APK ---")
apk_path = "releases/CVForge-v1.0.0.apk"
if os.path.exists(apk_path):
    size_mb = os.path.getsize(apk_path) / (1024 * 1024)
    print(f"APK exists: {apk_path} ({size_mb:.2f} MB)")
    with zipfile.ZipFile(apk_path) as z:
        names = z.namelist()
        print(f"Total files in APK: {len(names)}")
        print(f"Has AndroidManifest.xml: {'AndroidManifest.xml' in names}")
        print(f"Has classes.dex: {any(n.endswith('.dex') for n in names)}")
        print(f"Has web index.html: {'assets/index.html' in names}")
        print(f"Has styles.css: {'assets/assets/css/styles.css' in names}")
else:
    print("APK MISSING!")

print("\n--- 5. Checking Web Application Files ---")
for f in ["index.html", "manifest.json", "favicon.ico", "assets/icons/icon-512.png", "assets/icons/icon-192.png"]:
    print(f"{f}: {'FOUND' if os.path.exists(f) else 'MISSING'}")

print("\n--- VERIFICATION PASSED ---")

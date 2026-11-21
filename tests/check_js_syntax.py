import os
import subprocess
import glob

CV_DIR = r"c:\Users\SOBUJ\Documents\CV"

def check_all_js():
    js_files = glob.glob(os.path.join(CV_DIR, "assets", "js", "**", "*.js"), recursive=True)
    errors = []
    print(f"Checking syntax of {len(js_files)} JS files...")
    for f in js_files:
        # Exclude minified vendor files if any
        if "vendor" in f:
            continue
        res = subprocess.run(["node", "--check", f], capture_output=True, text=True)
        if res.returncode != 0:
            print(f"  [ERROR] {f}:\n{res.stderr}")
            errors.append((f, res.stderr))
        else:
            rel = os.path.relpath(f, CV_DIR)
            print(f"  [OK] {rel}")

    if errors:
        print(f"\nFAILED with {len(errors)} syntax errors!")
        sys.exit(1)
    else:
        print("\nALL JS FILES PASSED SYNTAX CHECK (100% OK)")

if __name__ == "__main__":
    check_all_js()

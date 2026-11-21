import os
import sys
import json
import subprocess
import urllib.request
import urllib.error

def run(cmd, cwd=None):
    res = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error ({cmd}): {res.stderr.strip()}", flush=True)
    else:
        print(f"Success ({cmd})", flush=True)
    return res.stdout.strip()

def api(url, token, method="GET", data=None, ctype="application/json"):
    req = urllib.request.Request(url, method=method)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    req.add_header("User-Agent", "CVForge-Deployer")
    if ctype:
        req.add_header("Content-Type", ctype)
    
    body = None
    if data is not None:
        if isinstance(data, (dict, list)):
            body = json.dumps(data).encode("utf-8")
        elif isinstance(data, (bytes, bytearray)):
            body = data
        elif isinstance(data, str):
            body = data.encode("utf-8")

    try:
        with urllib.request.urlopen(req, data=body) as resp:
            content = resp.read()
            if resp.headers.get_content_type() == "application/json":
                return resp.status, json.loads(content.decode("utf-8"))
            return resp.status, content
    except urllib.error.HTTPError as err:
        return err.code, err.read().decode("utf-8", errors="ignore")

def main():
    token_file = "temp_token.txt"
    if not os.path.exists(token_file):
        print("Missing token file", flush=True)
        return
    with open(token_file, "r") as f:
        token = f.read().strip()

    owner = "sobuj-here"
    repo = "CVForge"

    # Step 1: Create LICENSE
    lic_text = (
        "MIT License\n\n"
        "Copyright (c) 2026 SOBUJ\n\n"
        "Permission is hereby granted, free of charge, to any person obtaining a copy "
        "of this software and associated documentation files (the \"Software\"), to deal "
        "in the Software without restriction, including without limitation the rights "
        "to use, copy, modify, merge, publish, distribute, sublicense, and/or sell "
        "copies of the Software, and to permit persons to whom the Software is "
        "furnished to do so, subject to the following conditions:\n\n"
        "The above copyright notice and this permission notice shall be included in all "
        "copies or substantial portions of the Software.\n\n"
        "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR "
        "IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, "
        "FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE "
        "AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER "
        "LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, "
        "OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE "
        "SOFTWARE.\n"
    )
    with open("LICENSE", "w", encoding="utf-8") as f:
        f.write(lic_text)
    print("Created LICENSE", flush=True)

    # Step 2: Ensure README has comprehensive documentation
    readme_path = "README.md"
    if os.path.exists(readme_path):
        with open(readme_path, "r", encoding="utf-8") as f:
            curr_readme = f.read()
    else:
        curr_readme = ""

    header_section = (
        "# CVForge – 10-in-1 Professional & International CV Generator\n\n"
        "[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)\n"
        "[![Android](https://img.shields.io/badge/Android-7.0%2B%20(API%2024%2B)-3DDC84?logo=android&logoColor=white)](releases)\n"
        "[![Web App](https://img.shields.io/badge/Web%20App-Responsive%20Split--Screen-0078D4?logo=googlechrome&logoColor=white)](index.html)\n"
        "[![Export](https://img.shields.io/badge/Export-DOCX%20%7C%20PDF-success)](releases)\n"
        "[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Offline-107C41)](releases)\n\n"
        "CVForge is a comprehensive international CV and resume builder designed for global job applications across the USA, Canada, UK, Europe, Australia, and Asia. It generates 10 distinct CV formats with 50+ templates, real-time split-screen preview, and true editable Microsoft Word (.docx) and high-resolution PDF exports.\n\n"
    )
    if not curr_readme.startswith("# CVForge"):
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(header_section + curr_readme)
        print("Updated README.md", flush=True)

    # Step 3: Git setup, commit, and push
    run("git config user.name \"sobuj-here\"")
    run("git config user.email \"sobuj.developer@gmail.com\"")
    run("git add .")
    run("git commit -m \"Initial release: CVForge 10-in-1 Professional CV Generator for Android and Desktop\"")
    
    remote_url = f"https://{owner}:{token}@github.com/{owner}/{repo}.git"
    run(f"git remote set-url origin {remote_url}")
    print("Pushing to GitHub...", flush=True)
    push_res = run("git push -u origin main --force")
    print(f"Push result: {push_res}", flush=True)

    # Step 4: GitHub Release v1.0.0
    print("Checking release...", flush=True)
    st, rel = api(f"https://api.github.com/repos/{owner}/{repo}/releases/tags/v1.0.0", token)
    upload_url = None
    if st == 200:
        upload_url = rel.get("upload_url", "").split("{")[0]
    else:
        create_rel = {
            "tag_name": "v1.0.0",
            "name": "CVForge v1.0.0 — 10-in-1 Professional CV Generator for Android & Desktop",
            "body": "Official release of CVForge with installable Android APK, live split-screen web application, 10 international CV formats, 50 templates, and editable DOCX & PDF exports.",
            "draft": False,
            "prerelease": False
        }
        st2, rel2 = api(f"https://api.github.com/repos/{owner}/{repo}/releases", token, method="POST", data=create_rel)
        if st2 in (200, 201):
            upload_url = rel2.get("upload_url", "").split("{")[0]
            print("Created release v1.0.0", flush=True)

    # Upload APK asset
    apk_file = "releases/CVForge-v1.0.0.apk"
    if upload_url and os.path.exists(apk_file):
        print(f"Uploading APK asset ({os.path.getsize(apk_file)} bytes)...", flush=True)
        with open(apk_file, "rb") as f:
            apk_bytes = f.read()
        asset_url = f"{upload_url}?name=CVForge-v1.0.0.apk"
        up_st, up_res = api(asset_url, token, method="POST", data=apk_bytes, ctype="application/vnd.android.package-archive")
        print(f"Asset upload status: {up_st}", flush=True)

    # Step 5: Update profile README sobuj-here/sobuj-here
    print("Updating profile README...", flush=True)
    p_st, p_data = api(f"https://api.github.com/repos/{owner}/{owner}/contents/README.md", token)
    if p_st == 200:
        import base64
        sha = p_data.get("sha")
        content_b64 = p_data.get("content", "")
        profile_content = base64.b64decode(content_b64).decode("utf-8")
        
        # Check if CVForge already in profile
        if "CVForge" not in profile_content:
            cvforge_featured_card = (
                "  <!-- CVForge Card -->\n"
                "  <tr>\n"
                "    <td width=\"32%\" align=\"center\" valign=\"middle\">\n"
                "      <a href=\"https://github.com/sobuj-here/CVForge\">\n"
                "        <img src=\"https://raw.githubusercontent.com/sobuj-here/CVForge/main/assets/icons/icon-512.png\" width=\"100%\" style=\"border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.25);\" alt=\"CVForge 10-in-1 Generator\" />\n"
                "      </a>\n"
                "    </td>\n"
                "    <td width=\"68%\" valign=\"top\">\n"
                "      <h3>💼 <a href=\"https://github.com/sobuj-here/CVForge\">CVForge — 10-in-1 Professional CV & Resume Generator</a></h3>\n"
                "      <p>A modern international CV and Resume builder supporting 10 global formats, 50 professional templates, genuine editable Word (.docx) export, and high-resolution PDF generation for Android and Desktop.</p>\n"
                "      <ul>\n"
                "        <li><b>10 Formats:</b> Chronological, Reverse Chronological, Functional, Skills-Based, Hybrid, Targeted, Academic, Europass, ATS-Friendly, and Creative.</li>\n"
                "        <li><b>Genuine DOCX & PDF Export:</b> Native editable Microsoft Word documents with structured tables and recruiter-approved vector PDFs.</li>\n"
                "        <li><b>Cross-Platform:</b> Installable Android APK with MediaStore downloads & sharing, plus full desktop browser split-screen preview.</li>\n"
                "        <li><b>100% Private & Offline:</b> Local storage persistence with JSON profile backups, zero cloud dependencies, and zero tracking.</li>\n"
                "      </ul>\n"
                "      <p>\n"
                "        <img src=\"https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black\" />\n"
                "        <img src=\"https://img.shields.io/badge/Android-APK%20(SDK%2034)-3DDC84?style=flat-square&logo=android&logoColor=white\" />\n"
                "        <img src=\"https://img.shields.io/badge/Export-DOCX%20%7C%20PDF-0078D4?style=flat-square&logo=microsoftword&logoColor=white\" />\n"
                "        <img src=\"https://img.shields.io/badge/Privacy-100%25%20Offline-107C41?style=flat-square\" />\n"
                "        <img src=\"https://img.shields.io/badge/License-MIT-blue?style=flat-square\" />\n"
                "      </p>\n"
                "      <p>\n"
                "        <a href=\"https://github.com/sobuj-here/CVForge\"><b>📂 Source Code</b></a> • \n"
                "        <a href=\"https://github.com/sobuj-here/CVForge/releases/tag/v1.0.0\"><b>📥 Download APK (v1.0.0)</b></a>\n"
                "      </p>\n"
                "    </td>\n"
                "  </tr>\n\n"
            )
            
            # Insert after <table> in Featured Projects
            if "## 🚀 Featured Projects\n\n<table>\n" in profile_content:
                profile_content = profile_content.replace(
                    "## 🚀 Featured Projects\n\n<table>\n",
                    "## 🚀 Featured Projects\n\n<table>\n" + cvforge_featured_card,
                    1
                )
            
            # Insert into Public Repositories Catalog table
            catalog_row = "| [**CVForge**](https://github.com/sobuj-here/CVForge) | Mobile & Web Application | JavaScript, Android SDK 34, HTML5/CSS3 | [**Source Code**](https://github.com/sobuj-here/CVForge) • [**APK (v1.0.0)**](https://github.com/sobuj-here/CVForge/releases/tag/v1.0.0) |\n"
            if "## 📂 Public Repositories Catalog" in profile_content:
                header_marker = "| :--- | :--- | :--- | :--- |\n"
                if header_marker in profile_content:
                    profile_content = profile_content.replace(
                        header_marker,
                        header_marker + catalog_row,
                        1
                    )

            # Update file via API
            update_payload = {
                "message": "Add CVForge to Featured Projects and Repositories Catalog",
                "content": base64.b64encode(profile_content.encode("utf-8")).decode("utf-8"),
                "sha": sha
            }
            u_st, u_data = api(
                f"https://api.github.com/repos/{owner}/{owner}/contents/README.md",
                token,
                method="PUT",
                data=update_payload
            )
            print(f"Profile README updated: {u_st}", flush=True)
        else:
            print("CVForge already in profile README.", flush=True)

    # Clean up token file
    if os.path.exists(token_file):
        os.remove(token_file)
        print("Removed temp_token.txt", flush=True)

    print("ALL DEPLOYMENT STEPS COMPLETED SUCCESSFULLY!", flush=True)

if __name__ == "__main__":
    main()

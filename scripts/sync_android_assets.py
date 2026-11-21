"""
Synchronizes the CVForge web assets into the Android project's assets directory.
Ensures the Android app is 100% self-contained, offline-capable, and private.
"""

import os
import shutil

def sync_assets():
    src_root = '.'
    dest_root = 'android/app/src/main/assets'

    if os.path.exists(dest_root):
        shutil.rmtree(dest_root)
    os.makedirs(dest_root, exist_ok=True)

    # 1. Copy index.html, manifest.json, favicon.ico
    for f in ['index.html', 'manifest.json', 'favicon.ico']:
        if os.path.exists(f):
            shutil.copyfile(f, os.path.join(dest_root, f))
            print(f" [✓] Copied {f} to assets/")

    # 2. Copy assets directory (css, js, icons, vendor)
    dest_assets = os.path.join(dest_root, 'assets')
    shutil.copytree('assets', dest_assets)
    print(" [✓] Copied assets/ directory recursively to Android assets/")

    print("\nAndroid assets synchronized successfully!")

if __name__ == '__main__':
    sync_assets()

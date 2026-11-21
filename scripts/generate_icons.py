"""
Script to generate CVForge professional branding & launcher icon assets.
Generates:
1. High-resolution Play Store icon (512x512 PNG)
2. Android adaptive icon foreground & background XML
3. Android mipmaps (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) in both standard squircle and round
4. Web favicon.ico, icon-192.png, icon-512.png, and icon.svg
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont

def create_cvforge_icon(size=512, is_round=False):
    # High-quality RGBA image
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    scale = size / 512.0
    padding = 24 * scale

    # 1. Base Shape / Background
    if is_round:
        # Circular mask
        draw.ellipse([padding, padding, size - padding, size - padding], fill=(11, 19, 43, 255))
    else:
        # Premium squircle (continuous curvature rounded rect)
        radius = int(110 * scale)
        draw.rounded_rectangle([padding, padding, size - padding, size - padding], radius=radius, fill=(11, 19, 43, 255))

    # Inner subtle radial border
    inner_pad = padding + 4 * scale
    if is_round:
        draw.ellipse([inner_pad, inner_pad, size - inner_pad, size - inner_pad], outline=(56, 189, 248, 60), width=int(3 * scale))
    else:
        draw.rounded_rectangle([inner_pad, inner_pad, size - inner_pad, size - inner_pad], radius=int(104 * scale), outline=(56, 189, 248, 60), width=int(3 * scale))

    # 2. Geometric Emblem: Precision Document Shield + "CV" Monogram + Forge Star
    cx, cy = size / 2.0, (size / 2.0) - (12 * scale)

    # Document Shield polygon points (subtle background plate for the emblem)
    plate_w = 110 * scale
    plate_h = 130 * scale
    shield_pts = [
        (cx - plate_w, cy - plate_h + (20 * scale)),
        (cx, cy - plate_h),
        (cx + plate_w, cy - plate_h + (20 * scale)),
        (cx + plate_w, cy + plate_h - (40 * scale)),
        (cx, cy + plate_h + (15 * scale)),
        (cx - plate_w, cy + plate_h - (40 * scale))
    ]
    draw.polygon(shield_pts, fill=(15, 23, 42, 230), outline=(37, 99, 235, 120))

    # Intersecting "C" Ribbon (Electric Sky Blue #38BDF8)
    c_w = 26 * scale
    # Outer arc bounding box
    arc_box = [cx - (95 * scale), cy - (85 * scale), cx + (35 * scale), cy + (75 * scale)]
    draw.arc(arc_box, start=55, end=305, fill=(56, 189, 248, 255), width=int(c_w))

    # "C" Finials (rounded caps on top & bottom right)
    t_finial_x = cx + (25 * scale)
    t_finial_y = cy - (70 * scale)
    b_finial_x = cx + (25 * scale)
    b_finial_y = cy + (60 * scale)
    draw.ellipse([t_finial_x - c_w/2, t_finial_y - c_w/2, t_finial_x + c_w/2, t_finial_y + c_w/2], fill=(56, 189, 248, 255))
    draw.ellipse([b_finial_x - c_w/2, b_finial_y - c_w/2, b_finial_x + c_w/2, b_finial_y + c_w/2], fill=(56, 189, 248, 255))

    # Intersecting "V" Quill / Chisel (Royal Cobalt #2563EB to #60A5FA)
    # Left arm of V
    v_left_top = (cx - (35 * scale), cy - (60 * scale))
    v_bottom = (cx + (15 * scale), cy + (70 * scale))
    draw.line([v_left_top, v_bottom], fill=(96, 165, 250, 255), width=int(24 * scale))

    # Right arm of V
    v_right_top = (cx + (65 * scale), cy - (60 * scale))
    draw.line([v_bottom, v_right_top], fill=(37, 99, 235, 255), width=int(24 * scale))

    # Rounded vertex at bottom of V
    draw.ellipse([v_bottom[0] - 12*scale, v_bottom[1] - 12*scale, v_bottom[0] + 12*scale, v_bottom[1] + 12*scale], fill=(37, 99, 235, 255))

    # Document Rule Lines inside the emblem (Subtle white/slate)
    rule_y1 = cy - (20 * scale)
    rule_y2 = cy + (5 * scale)
    draw.line([(cx - 45 * scale), rule_y1, (cx - 15 * scale), rule_y1], fill=(226, 232, 240, 180), width=int(4 * scale))
    draw.line([(cx - 45 * scale), rule_y2, (cx - 5 * scale), rule_y2], fill=(226, 232, 240, 180), width=int(4 * scale))

    # 3. Precision Radiant Forge Spark (Warm Amber / Gold #F59E0B)
    # 4-point diamond star at (cx + 50*scale, cy - 85*scale)
    star_x = cx + (52 * scale)
    star_y = cy - (88 * scale)
    star_r_long = 24 * scale
    star_r_short = 7 * scale

    star_pts = [
        (star_x, star_y - star_r_long),
        (star_x + star_r_short, star_y - star_r_short),
        (star_x + star_r_long, star_y),
        (star_x + star_r_short, star_y + star_r_short),
        (star_x, star_y + star_r_long),
        (star_x - star_r_short, star_y + star_r_short),
        (star_x - star_r_long, star_y),
        (star_x - star_r_short, star_y - star_r_short)
    ]
    draw.polygon(star_pts, fill=(245, 158, 11, 255))
    # Small center highlight
    draw.ellipse([star_x - 3*scale, star_y - 3*scale, star_x + 3*scale, star_y + 3*scale], fill=(254, 240, 138, 255))

    # 4. Brand Text "CVFORGE" at bottom
    if size >= 128:
        text_y = cy + (155 * scale)
        # Using default geometric rendering for text if true font unavailable
        text = "CVFORGE"
        char_w = 14 * scale
        total_w = len(text) * char_w + (len(text) - 1) * (6 * scale)
        start_x = cx - (total_w / 2.0)
        
        # Try loading Arial/Calibri, or draw crisp letterforms
        font = None
        try:
            font = ImageFont.truetype("arialbd.ttf", int(26 * scale))
        except:
            try:
                font = ImageFont.truetype("calibrib.ttf", int(26 * scale))
            except:
                font = ImageFont.load_default()

        if font:
            # Measure and center
            draw.text((cx, text_y), text, font=font, fill=(241, 245, 249, 240), anchor="mm")
            # Subtle sub-label
            if size >= 256:
                try:
                    sub_font = ImageFont.truetype("arial.ttf", int(11 * scale))
                    draw.text((cx, text_y + (22 * scale)), "10-IN-1 PROFESSIONAL BUILDER", font=sub_font, fill=(148, 163, 184, 200), anchor="mm")
                except:
                    pass

    return img

def main():
    print("Generating CVForge Professional Icon Assets...")

    os.makedirs('assets/icons', exist_ok=True)
    os.makedirs('android/app/src/main/res/mipmap-mdpi', exist_ok=True)
    os.makedirs('android/app/src/main/res/mipmap-hdpi', exist_ok=True)
    os.makedirs('android/app/src/main/res/mipmap-xhdpi', exist_ok=True)
    os.makedirs('android/app/src/main/res/mipmap-xxhdpi', exist_ok=True)
    os.makedirs('android/app/src/main/res/mipmap-xxxhdpi', exist_ok=True)

    # 1. Play Store 512x512
    icon512 = create_cvforge_icon(512, is_round=False)
    icon512.save('assets/icons/icon-512.png', 'PNG')
    icon512.save('android/app/src/main/play_store_512.png', 'PNG')
    print(" [✓] Play Store & Web 512x512 icon generated")

    # 2. Web 192x192
    icon192 = create_cvforge_icon(192, is_round=False)
    icon192.save('assets/icons/icon-192.png', 'PNG')
    print(" [✓] Web 192x192 icon generated")

    # 3. Favicon.ico (contains 16, 32, 48)
    fav16 = create_cvforge_icon(16, is_round=False)
    fav32 = create_cvforge_icon(32, is_round=False)
    fav48 = create_cvforge_icon(48, is_round=False)
    fav48.save('assets/icons/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    fav48.save('favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    print(" [✓] Multi-size favicon.ico generated")

    # 4. Android Mipmap standard & round icons
    densities = {
        'mdpi': 48,
        'hdpi': 72,
        'xhdpi': 96,
        'xxhdpi': 144,
        'xxxhdpi': 192
    }

    for name, sz in densities.items():
        std = create_cvforge_icon(sz, is_round=False)
        rnd = create_cvforge_icon(sz, is_round=True)
        dir_p = f'android/app/src/main/res/mipmap-{name}'
        std.save(os.path.join(dir_p, 'ic_launcher.png'), 'PNG')
        rnd.save(os.path.join(dir_p, 'ic_launcher_round.png'), 'PNG')
        print(f" [✓] Android mipmap-{name} ({sz}x{sz}) standard and round icons generated")

    # 5. Clean vector SVG icon for web & repo documentation
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B132B" />
      <stop offset="100%" stop-color="#1C2541" />
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
  </defs>
  <!-- Background Squircle -->
  <rect x="24" y="24" width="464" height="464" rx="110" fill="url(#bgGrad)" stroke="#38BDF8" stroke-opacity="0.25" stroke-width="3" />
  
  <!-- Shield Backplate -->
  <polygon points="146,164 256,126 366,164 366,350 256,412 146,350" fill="#0F172A" fill-opacity="0.85" stroke="#2563EB" stroke-opacity="0.45" stroke-width="3" />
  
  <!-- Intertwined C Ribbon (Cyan) -->
  <path d="M 285,175 A 85,85 0 1,0 285,315" fill="none" stroke="url(#cyanGrad)" stroke-width="26" stroke-linecap="round" />
  
  <!-- Intertwined V Chisel (Royal Blue) -->
  <path d="M 220,185 L 270,320 L 325,185" fill="none" stroke="url(#blueGrad)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" />
  
  <!-- Document Lines -->
  <line x1="210" y1="230" x2="242" y2="230" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round" stroke-opacity="0.8" />
  <line x1="210" y1="255" x2="252" y2="255" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round" stroke-opacity="0.8" />
  
  <!-- Radiant Forge Spark (Gold) -->
  <path d="M 308,136 L 315,152 L 331,159 L 315,166 L 308,182 L 301,166 L 285,159 L 301,152 Z" fill="#F59E0B" />
  <circle cx="308" cy="159" r="3" fill="#FEF08A" />
  
  <!-- Wordmark -->
  <text x="256" y="420" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" fill="#F8FAFC" text-anchor="middle" letter-spacing="4">CVFORGE</text>
  <text x="256" y="442" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#94A3B8" text-anchor="middle" letter-spacing="2">10-IN-1 PROFESSIONAL BUILDER</text>
</svg>'''
    with open('assets/icons/icon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(" [✓] Scalable vector SVG icon generated")

if __name__ == '__main__':
    main()

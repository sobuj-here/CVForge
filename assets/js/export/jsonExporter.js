/**
 * CVForge - JSON Profile Backup, Restore & Duplication Engine
 */

export function exportProfileToJson(profile, filename = 'cvforge_profile.json') {
  const jsonStr = JSON.stringify(profile, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importProfileFromJson(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed && (parsed.personal || parsed.format)) {
        callback(null, parsed);
      } else {
        callback(new Error('Invalid CVForge profile JSON format.'));
      }
    } catch (err) {
      callback(err);
    }
  };
  reader.onerror = () => callback(new Error('Failed to read file.'));
  reader.readAsText(file);
}

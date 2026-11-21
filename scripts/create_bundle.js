const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const jsDir = path.join(rootDir, 'assets', 'js');

// Convert ES module to CommonJS-style registered function
function transformModule(content, filePath) {
  let transformed = content;

  // 1. Transform import statements
  transformed = transformed.replace(
    /import\s+\*\s+as\s+([a-zA-Z0-9_$]+)\s+from\s+['"]([^'"]+)['"];?/g,
    (match, id, importPath) => `const ${id} = __require__('${importPath}', __currentDir);`
  );

  transformed = transformed.replace(
    /import\s+([a-zA-Z0-9_$]+)\s+from\s+['"]([^'"]+)['"];?/g,
    (match, id, importPath) => `const ${id} = (__require__('${importPath}', __currentDir).default || __require__('${importPath}', __currentDir));`
  );

  transformed = transformed.replace(
    /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/g,
    (match, names, importPath) => {
      const destructured = names.split(',').map(n => {
        const parts = n.trim().split(/\s+as\s+/);
        if (parts.length === 2) {
          return `${parts[0].trim()}: ${parts[1].trim()}`;
        }
        return parts[0].trim();
      }).filter(Boolean).join(', ');
      return `const { ${destructured} } = __require__('${importPath}', __currentDir);`;
    }
  );

  // 2. Collect exported names before replacing keywords
  const exportNames = [];
  const fnMatches = content.matchAll(/export\s+(?:async\s+)?function\s+([a-zA-Z0-9_$]+)/g);
  for (const m of fnMatches) exportNames.push(m[1]);

  const classMatches = content.matchAll(/export\s+class\s+([a-zA-Z0-9_$]+)/g);
  for (const m of classMatches) exportNames.push(m[1]);

  const constMatches = content.matchAll(/export\s+(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=/g);
  for (const m of constMatches) exportNames.push(m[1]);

  const namedExportsMatches = content.matchAll(/export\s*\{([^}]+)\};?/g);
  for (const m of namedExportsMatches) {
    const list = m[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
    exportNames.push(...list);
  }

  // 3. Transform exports
  transformed = transformed.replace(
    /export\s+default\s+/g,
    'exports.default = '
  );

  transformed = transformed.replace(
    /export\s+async\s+function\s+([a-zA-Z0-9_$]+)/g,
    (match, name) => `async function ${name}`
  );

  transformed = transformed.replace(
    /export\s+function\s+([a-zA-Z0-9_$]+)/g,
    (match, name) => `function ${name}`
  );

  transformed = transformed.replace(
    /export\s+class\s+([a-zA-Z0-9_$]+)/g,
    (match, name) => `class ${name}`
  );

  transformed = transformed.replace(
    /export\s+const\s+([a-zA-Z0-9_$]+)\s*=/g,
    (match, name) => `const ${name} =`
  );

  transformed = transformed.replace(
    /export\s+let\s+([a-zA-Z0-9_$]+)\s*=/g,
    (match, name) => `let ${name} =`
  );

  // Remove standalone export { a, b };
  transformed = transformed.replace(/export\s*\{[^}]+\};?/g, '');

  let exportAssignments = [...new Set(exportNames)].map(n => `exports.${n} = ${n};`).join('\n');

  return `function(require, exports, module, __require__, __currentDir) {
${transformed}

// Exports
${exportAssignments}
}`;
}

// Collect all JS files
function getAllFiles(dir, baseDir = dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'vendor') {
        files = files.concat(getAllFiles(full, baseDir));
      }
    } else if (entry.name.endsWith('.js') && entry.name !== 'bundle.js') {
      const rel = path.relative(baseDir, full).replace(/\\/g, '/');
      files.push({ full, rel });
    }
  }
  return files;
}

const files = getAllFiles(jsDir);
console.log(`Found ${files.length} modules to bundle.`);

let bundleCode = `/**
 * CVForge - Standalone Unified Bundle
 * Automatically generated for 100% offline file:// and web support.
 */
(function() {
  const __modules__ = {};
  const __cache__ = {};

  function normalizePath(target, currentDir) {
    if (!target.startsWith('.')) return target;
    const parts = (currentDir + '/' + target).split('/');
    const resolved = [];
    for (const p of parts) {
      if (!p || p === '.') continue;
      if (p === '..') {
        resolved.pop();
      } else {
        resolved.push(p);
      }
    }
    let res = './' + resolved.join('/');
    if (!res.endsWith('.js')) res += '.js';
    return res;
  }

  function __require__(id, currentDir) {
    const resolvedId = normalizePath(id, currentDir || '');
    if (__cache__[resolvedId]) {
      return __cache__[resolvedId].exports;
    }
    const modFn = __modules__[resolvedId];
    if (!modFn) {
      console.error('Module not found in bundle:', id, '->', resolvedId);
      throw new Error('Module not found: ' + resolvedId);
    }
    const module = { exports: {} };
    __cache__[resolvedId] = module;
    const moduleDir = resolvedId.substring(0, resolvedId.lastIndexOf('/'));
    modFn(
      (path) => __require__(path, moduleDir),
      module.exports,
      module,
      __require__,
      moduleDir
    );
    return module.exports;
  }

`;

for (const { full, rel } of files) {
  const content = fs.readFileSync(full, 'utf-8');
  const transformed = transformModule(content, full);
  const key = './' + rel;
  bundleCode += `  // Module: ${key}\n  __modules__['${key}'] = ${transformed};\n\n`;
}

// Bootstrap app.js
bundleCode += `
  // Execute application entry point on DOM ready or immediately
  function startCVForge() {
    try {
      console.log('Initializing CVForge application from unified bundle...');
      __require__('./app.js', '');
    } catch(err) {
      console.error('CVForge bootstrap error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startCVForge);
  } else {
    startCVForge();
  }
})();
`;

const bundlePath = path.join(jsDir, 'bundle.js');
fs.writeFileSync(bundlePath, bundleCode, 'utf-8');
console.log(`Bundle successfully generated at: ${bundlePath} (${(fs.statSync(bundlePath).size / 1024).toFixed(1)} KB)`);

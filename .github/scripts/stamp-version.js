// Usage: node stamp-version.js <sha>
const fs = require('fs');
const path = require('path');

const sha = process.argv[2] || Date.now().toString();

const isLocal = (url) => {
  if (!url) return false;
  // ignore absolute/external: http(s)://, //cdn, mailto:, tel:, data:
  if (/^(https?:)?\/\//i.test(url)) return false;
  if (/^(mailto:|tel:|data:)/i.test(url)) return false;
  // ignore anchors
  if (url.startsWith('#')) return false;
  return true;
};

// append ?v=sha (or &v=sha) and avoid double-stamping
const stamp = (url) => {
  if (!isLocal(url)) return url;
  const [basePlusQ, hash = ''] = url.split('#');
  const [base, query = ''] = basePlusQ.split('?');
  if (/([&?]v=)/i.test(url)) {
    const newQ = query.replace(/(^|&)v=[^&]*/i, `$1v=${sha}`);
    return `${base}?${newQ}${hash ? '#' + hash : ''}`;
  }
  const joined = query ? `${base}?${query}&v=${sha}` : `${base}?v=${sha}`;
  return `${joined}${hash ? '#' + hash : ''}`;
};

const walk = (dir, files = []) => {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      // skip .git, node_modules, .github/workflows artifacts
      if (f === '.git' || f === 'node_modules') continue;
      walk(p, files);
    } else {
      files.push(p);
    }
  }
  return files;
};

// Process all .html files at deploy time (artifact only)
const htmlFiles = walk('.').filter((f) => f.endsWith('.html'));

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');

  // Match href=... and src=... values (quoted or bare)
  html = html.replace(
    /(href|src)\s*=\s*("([^"]+)"|'([^']+)'|([^\s>]+))/gi,
    (m, attr, whole, dq, sq, bare) => {
      const url = dq ?? sq ?? bare;
      const stamped = stamp(url);
      const quoted = dq ? `"${stamped}"` : sq ? `'${stamped}'` : stamped;
      return `${attr}=${quoted}`;
    }
  );

  fs.writeFileSync(file, html);
  console.log(`Stamped: ${file}`);
}

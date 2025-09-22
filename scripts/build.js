#!/usr/bin/env node
/*
  Simple build script:
  - Reads version from package.json -> writes version.js
  - Copies site into docs/
  - Fingerprints CSS/JS into hashed filenames
  - Rewrites HTML references
  - Generates precache-manifest.json for the service worker
*/

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public');

function readJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function ensureDir(p){ if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function copyFile(src, dest){ ensureDir(path.dirname(dest)); fs.copyFileSync(src, dest); }
function hashContent(buf){ return crypto.createHash('md5').update(buf).digest('hex').slice(0,8); }

// 1) Set version.js from package.json
const pkg = readJSON(path.join(root, 'package.json'));
const version = pkg.version || '0.0.0-dev';
require('./set-version'); // rewrites version.js at project root

// 2) Clean docs/
function emptyDir(dir){
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)){
    const p = path.join(dir, entry);
    fs.rmSync(p, { recursive: true, force: true });
  }
}
ensureDir(outDir); emptyDir(outDir);

// 3) Copy everything first (except node_modules, tests, .git, scripts)
function shouldCopy(rel){
  return !rel.startsWith('node_modules') &&
         !rel.startsWith('.git') &&
         !rel.startsWith('tests') &&
         !rel.startsWith('scripts') &&
         !rel.startsWith('.codex') &&
         !rel.startsWith('.agent-os') &&
         !rel.startsWith('.claude') &&
         !rel.startsWith('.husky') &&
         !rel.startsWith('.github') &&
         rel !== 'server.log';
}

function copyTree(srcDir, dstDir){
  for (const entry of fs.readdirSync(srcDir)){
    const srcPath = path.join(srcDir, entry);
    const rel = path.relative(root, srcPath);
    if (!shouldCopy(rel)) continue;
    // Avoid copying the output directory into itself
    if (srcPath === outDir) continue;
    const dstPath = path.join(dstDir, entry);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()){
      ensureDir(dstPath);
      copyTree(srcPath, dstPath);
    } else {
      copyFile(srcPath, dstPath);
    }
  }
}
copyTree(root, outDir);

// 4) Fingerprint CSS/JS
const toFingerprint = [];
function enqueueIfExists(p){ if (fs.existsSync(p)) toFingerprint.push(p); }

// CSS
enqueueIfExists(path.join(outDir, 'css', 'styles.css'));
enqueueIfExists(path.join(outDir, 'css', 'fallbacks.css'));
enqueueIfExists(path.join(outDir, 'assets', 'css', 'components', 'table.css'));

// JS: all files under js/
const jsDir = path.join(outDir, 'js');
if (fs.existsSync(jsDir)){
  for (const f of fs.readdirSync(jsDir)){
    if (f.endsWith('.js')) enqueueIfExists(path.join(jsDir, f));
  }
}

const manifest = [];
const renameMap = new Map();
for (const p of toFingerprint){
  const buf = fs.readFileSync(p);
  const h = hashContent(buf);
  const dir = path.dirname(p);
  const base = path.basename(p);
  const ext = path.extname(base);
  const name = base.slice(0, -ext.length);
  const newName = `${name}.${h}${ext}`;
  const newPath = path.join(dir, newName);
  fs.renameSync(p, newPath);
  const relOld = '/' + path.relative(outDir, p).replace(/\\/g, '/');
  const relNew = '/' + path.relative(outDir, newPath).replace(/\\/g, '/');
  renameMap.set(relOld, relNew);
  // Also add relative (no leading slash) variants
  renameMap.set(relOld.slice(1), relNew.slice(1));
  manifest.push(relNew);
}

// 5) Rewrite HTML references in docs/index.html and docs/winners.html
function rewriteHTML(file){
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  for (const [from,to] of renameMap.entries()){
    const fromEsc = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Replace both with and without query strings
    html = html.replace(new RegExp(fromEsc + '(\?[^"\']*)?', 'g'), to);
  }
  // Remove old ?v=... from local css/js
  html = html.replace(/(href|src)=("|')(\/[^"']+\.(?:css|js))\?v=[^"']+("|')/g, '$1=$2$3$4');
  fs.writeFileSync(file, html);
}
rewriteHTML(path.join(outDir, 'index.html'));
rewriteHTML(path.join(outDir, 'winners.html'));

// 6) Generate precache-manifest.json (add html + root too)
manifest.push('/');
if (fs.existsSync(path.join(outDir, 'index.html'))) manifest.push('/index.html');
if (fs.existsSync(path.join(outDir, 'winners.html'))) manifest.push('/winners.html');
fs.writeFileSync(path.join(outDir, 'precache-manifest.json'), JSON.stringify(manifest, null, 2));

console.log('Build complete. Version:', version);

#!/usr/bin/env node
const https = require('https');
const fs = require('fs');
const path = require('path');

const CODES = process.argv.slice(2);
if (!CODES.length) {
  console.log('Usage: node scripts/fetch-twemoji.js <hex-codepoint> [more codes...]');
  console.log('Example: node scripts/fetch-twemoji.js 1f4dc 1f4dd');
  process.exit(1);
}

const base = 'https://twemoji.maxcdn.com/v/latest/svg/';
const outDir = path.join(__dirname, '..', 'assets', 'twemoji', 'svg');
fs.mkdirSync(outDir, { recursive: true });

function download(code) {
  return new Promise((resolve, reject) => {
    const url = base + code.toLowerCase() + '.svg';
    const dest = path.join(outDir, code.toLowerCase() + '.svg');
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          fs.unlink(dest, () => {});
          return reject(new Error('HTTP ' + res.statusCode + ' for ' + url));
        }
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve(dest)));
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

(async () => {
  for (const code of CODES) {
    try {
      const p = await download(code);
      console.log('Downloaded', code, '->', p);
    } catch (e) {
      console.error('Failed to download', code, e.message);
    }
  }
})();


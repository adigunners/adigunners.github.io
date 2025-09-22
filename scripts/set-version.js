#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const version = pkg.version || '0.0.0-dev';

const content = `// Shared version constant for both window (pages) and worker scope
(function(global){
  var v = '${version}';
  try {
    if (typeof window !== 'undefined') window.SITE_VERSION = v;
    if (typeof global !== 'undefined') global.SITE_VERSION = v;
  } catch (_) {}
})(typeof self !== 'undefined' ? self : this);
`;

fs.writeFileSync(path.join(__dirname, '..', 'version.js'), content);
console.log('version.js updated to', version);


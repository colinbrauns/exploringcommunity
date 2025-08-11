#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const root = path.resolve(__dirname, '..');
const outPath = path.resolve(root, '..', 'exploringcommunity.zip');

try { fs.unlinkSync(outPath); } catch (e) {}

const output = fs.createWriteStream(outPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Created ${outPath} (${archive.pointer()} bytes)`);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOTFOUND') {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => { throw err; });

archive.pipe(output);

// Include all files except excluded
const excludes = [
  'node_modules',
  '.git',
  'package-lock.json',
  'scripts/zip-theme.js',
  '../exploringcommunity.zip'
];

function shouldExclude(filePath) {
  return excludes.some((ex) => filePath === ex || filePath.startsWith(ex + path.sep));
}

function addDir(dir, base = '') {
  const abs = path.join(root, dir);
  for (const entry of fs.readdirSync(abs)) {
    const rel = path.join(dir, entry);
    if (shouldExclude(rel)) continue;
    const stat = fs.statSync(path.join(root, rel));
    if (stat.isDirectory()) {
      addDir(rel, base);
    } else {
      archive.file(path.join(root, rel), { name: rel });
    }
  }
}

addDir('.');
archive.finalize();



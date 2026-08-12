#!/usr/bin/env node
// Build script: packages navi-bookmarks-chrome into dist/ as a ZIP.
// Usage: node scripts/build.js [--crx]

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'navi-bookmarks-chrome');
const DIST_DIR = path.join(ROOT, 'dist');

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function getAllFiles(dir, basePath) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(basePath, fullPath);
        if (entry.isDirectory()) {
            files.push(...getAllFiles(fullPath, basePath));
        } else {
            files.push(relativePath);
        }
    }
    return files;
}

function buildZip(version) {
    ensureDir(DIST_DIR);
    const zipName = 'navi-bookmarks-chrome-v' + version + '.zip';
    const zipPath = path.join(DIST_DIR, zipName);

    const zip = new AdmZip();
    const files = getAllFiles(SRC_DIR, SRC_DIR);
    for (const file of files) {
        const fullPath = path.join(SRC_DIR, file);
        zip.addLocalFile(fullPath, path.dirname(file).replace(/\\/g, '/'));
    }
    zip.writeZip(zipPath);

    console.log('\u2705 Packaged: ' + zipPath);
    return zipPath;
}

function validateManifest() {
    const manifestPath = path.join(SRC_DIR, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
        throw new Error('manifest.json not found at ' + manifestPath);
    }
    const manifest = readJson(manifestPath);
    const required = ['manifest_version', 'name', 'version', 'description', 'default_locale'];
    for (const key of required) {
        if (!manifest[key]) {
            throw new Error('manifest.json missing required field: ' + key);
        }
    }
    if (manifest.manifest_version !== 3) {
        throw new Error('manifest_version must be 3');
    }
    return manifest.version;
}

function run() {
    const args = process.argv.slice(2);
    const makeCrx = args.includes('--crx');

    console.log('Building from: ' + SRC_DIR);
    const version = validateManifest();
    console.log('Extension version: ' + version);

    const zipPath = buildZip(version);

    if (makeCrx) {
        const keyPath = path.join(ROOT, 'navi-bookmarks-chrome.pem');
        if (!fs.existsSync(keyPath)) {
            console.warn('\u26a0️  Private key not found: ' + keyPath + '. Skipping CRX generation.');
            console.warn('   Generate one with: openssl genrsa 2048 > navi-bookmarks-chrome.pem');
        } else {
            console.warn('\u26a0️  CRX generation requires chrome --pack-extension. This script does not implement CRX signing yet.');
            console.warn('   You can manually run: chrome --pack-extension=' + SRC_DIR + ' --pack-extension-key=' + keyPath);
        }
    }

    console.log('\nDone.');
}

run();

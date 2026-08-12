#!/usr/bin/env node
// i18n key consistency validator
// Ensures every _locales/*/messages.json has the same set of keys.

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'navi-bookmarks-chrome', '_locales');

function loadMessages(locale) {
    const file = path.join(LOCALES_DIR, locale, 'messages.json');
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function main() {
    if (!fs.existsSync(LOCALES_DIR)) {
        console.error('Locales directory not found: ' + LOCALES_DIR);
        process.exit(1);
    }

    const locales = fs.readdirSync(LOCALES_DIR).filter(function(name) {
        return fs.statSync(path.join(LOCALES_DIR, name)).isDirectory();
    });

    if (locales.length === 0) {
        console.error('No locale directories found.');
        process.exit(1);
    }

    const referenceLocale = 'en';
    if (!locales.includes(referenceLocale)) {
        console.error('Reference locale "' + referenceLocale + '" not found.');
        process.exit(1);
    }

    const referenceKeys = Object.keys(loadMessages(referenceLocale)).sort();
    let hasError = false;

    for (const locale of locales.sort()) {
        if (locale === referenceLocale) continue;

        const messages = loadMessages(locale);
        const keys = Object.keys(messages);
        const missing = referenceKeys.filter(function(k) { return !keys.includes(k); });
        const extra = keys.filter(function(k) { return !referenceKeys.includes(k); });

        if (missing.length > 0 || extra.length > 0) {
            hasError = true;
            console.error('\u274c Locale "' + locale + '" is inconsistent with "' + referenceLocale + '":');
            if (missing.length > 0) {
                console.error('   Missing keys (' + missing.length + '):');
                missing.forEach(function(k) { console.error('     - ' + k); });
            }
            if (extra.length > 0) {
                console.error('   Extra keys (' + extra.length + '):');
                extra.forEach(function(k) { console.error('     - ' + k); });
            }
        } else {
            console.log('\u2705 Locale "' + locale + '" is consistent.');
        }
    }

    if (hasError) {
        console.error('\nPlease fix the inconsistent locale files before releasing.');
        process.exit(1);
    } else {
        console.log('\n\u2705 All locales are consistent with "en".');
    }
}

main();

# Contributing to Navi Bookmarks

Thank you for your interest in contributing! This document will help you get started.

## Getting Started

1. Fork the repository.
2. Clone your fork locally.
3. Run `npm install` to install development dependencies.
4. Load the `navi-bookmarks-chrome` folder as an unpacked extension in Chrome.

## Development Workflow

1. Create a new branch for your feature or bug fix.
2. Make your changes.
3. Run `npm run lint:i18n` to ensure all language files are consistent.
4. Run `npm run build` to verify the package builds correctly.
5. Commit your changes with a clear message.
6. Open a pull request.

## Commit Message Convention

Use prefixes in your commit messages:

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation update
- `style:` — Code style change (formatting, no logic change)
- `refactor:` — Code refactoring
- `perf:` — Performance improvement
- `test:` — Adding or updating tests
- `chore:` — Build process or auxiliary tool changes

## Adding a New Language

1. Create a new folder under `navi-bookmarks-chrome/_locales/` using the correct locale code (e.g. `es` for Spanish).
2. Copy `en/messages.json` as a starting point.
3. Translate all `message` values.
4. Run `npm run lint:i18n` to verify consistency.
5. Update the language list in this README and in `newtab.html`.

## Code Style

- Use 4 spaces for indentation in JavaScript, CSS, and HTML.
- Prefer `const` and `let` over `var` for new code.
- Avoid inline event handlers; use `addEventListener`.
- Escape any user input before inserting it into HTML.

## Reporting Issues

When reporting bugs, please include:

- Browser and version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Security

If you discover a security issue, please email the maintainer directly instead of opening a public issue.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

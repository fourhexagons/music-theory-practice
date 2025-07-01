# music-theory-practice

A web-based music theory practice application for chord and accidental normalization.

## Live

- **Site**: [learning.lightbath.com](https://learning.lightbath.com)
- **App**: [learning.lightbath.com/practice](https://learning.lightbath.com/practice)

## Beta Testing

Currently in beta testing with students.

- NEW chord normalization with case-sensitive pattern matching
- NEW accidental normalization for double accidentals and mixed notation
- NEW comprehensive test framework with keyboard shortcuts (Ctrl+Shift+Q)
- FIX chord quality detection conflicts between m7 and M7
- TEST 100% pass rate for all normalization functions

## 🚨 CRITICAL: Learning Path Protection

**Before making any changes to the app, read the [Learning Path Protection Protocol](docs/LEARNING_PATH_PROTECTION.md).**

The learning path logic is working correctly and follows a predictable pattern:
- **Key progression**: C → G → D → A → E → B → F# → C#
- **Chapter progression**: accCount → accNotes → scale → triads → sevenths
- **Special cases**: C major skips accNotes (intentional behavior)

**Any modifications to learning path logic require explicit permission and must follow the mandatory protocol.**

## Usage

- **Test Mode**: Press Ctrl+Shift+Q (Mac: Cmd+Shift+Q)
- **Version**: Displayed in top-right corner of app
- **Feedback**: Include version number when reporting issues

## Development Commands (Phase 1+)

### Development
- `npm run dev` - Start Vite development server (current system)
- `npm run serve:new` - Build and preview production version

### Testing
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:accessibility` - Run accessibility tests only
- `npm run test:performance` - Run performance tests only
- `npm run test:headless` - Run automated learning path test
- `npm run validate:urls` - Verify clean URLs are working correctly

### Building
- `npm run build` - Build for production
- `npm run preview` - Preview built version
- `npm run verify` - Verify everything works (lint + test + build)

### Code Quality
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix auto-fixable issues
- `npm run format` - Format code with Prettier

## Development

**🔍 ALL development work must follow our [Systematic Research Methodology](docs/SYSTEMATIC_RESEARCH_METHODOLOGY.md)**

**Quick Start**: See [Documentation Index](docs/DOCUMENTATION_INDEX.md) for organized guides by role.

```bash
git clone https://github.com/fourhexagons/music-theory-practice.git
cd music-theory-practice
npm run dev  # Start development server (port 5173)
# Visit http://localhost:5173/practice
```

## Architecture

- `learning.lightbath.com` - Landing page (future: course marketing)
- `learning.lightbath.com/practice` - Music theory practice app
- `learning.lightbath.com/dashboard` - Future student dashboards

## Local Development: Running the Development Server

For local development, use the Vite development server:

### Start the Development Server

```sh
npm run dev
```

This will:
- Start the Vite development server on port 5173
- Enable hot module reloading for instant updates
- Serve the current system from the `src/` directory

### Development URLs (OFFICIAL - DO NOT CHANGE)
- **Practice App**: http://localhost:5173/practice
- **Landing Page**: http://localhost:5173/

**⚠️ CRITICAL**: These are the ONLY correct URLs. Never reference `/src/` paths or `.html` extensions in documentation or tests.

### Troubleshooting
- If you see port conflicts, kill any running processes:
  ```sh
  pkill -f "vite"
  ```
- For a clean restart:
  ```sh
  npm run dev
  ```

### Protocol for Agents and Developers
- **Always use `npm run dev` for development.**
- The development server automatically handles file changes and updates.
- This protocol should be followed by all agents and developers working on this project.

## Testing Strategy

### Node-Compatible Tests (CI-friendly)
- Run with:
  ```sh
  npm test
  ```
- Runs all unit and Node-compatible performance tests in Node.js (no browser required).
- Skips integration and accessibility tests that require a browser/DOM.

### Full Suite / Browser-Only Tests
- Run with:
  ```sh
  npm run test:browser
  ```
- Opens the comprehensive test suite in your browser.
- Includes all integration, accessibility, UI, and DOM-dependent tests.

### Why this split?
- **Node-compatible tests** are fast, reliable, and run automatically in CI/CD.
- **Browser-only tests** cover UI, accessibility, and integration scenarios that require a real DOM.

See comments in the test files and scripts for more details.

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
- `npm run dev` - Start Vite development server (new system)
- `npm run serve:old` - Start Firebase development server (old system)
- `npm run serve:new` - Build and preview new system

### Testing
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:accessibility` - Run accessibility tests only
- `npm run test:performance` - Run performance tests only

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
npm run dev  # Start development server (port 5003)
# Visit http://localhost:5003/src/practice.html
```

## Architecture

- `learning.lightbath.com` - Landing page (future: course marketing)
- `learning.lightbath.com/practice` - Music theory practice app
- `learning.lightbath.com/dashboard` - Future student dashboards

## Local Development: Running the Firebase Server

To ensure you never have multiple Firebase servers running at once (which can cause port conflicts and confusion), **always use the provided script**:

### Start or Restart the Server (Best Practice)

```sh
./serve-clean.sh
```

This script will:
- Kill any running `firebase serve` processes
- Start a new Firebase hosting server

### Why?
- Running multiple servers at once is a common source of bugs and confusion.
- This script guarantees only one server is running at a time.
- It works for both human developers and AI agents.

### First Time Setup
Make the script executable:
```sh
chmod +x serve-clean.sh
```

### Troubleshooting
- If you ever see errors about ports in use, or the site doesn't load as expected, run:
  ```sh
  ./serve-clean.sh
  ```
- If you want to check for running servers manually:
  ```sh
  ps aux | grep firebase
  ```
- To kill all running servers manually:
  ```sh
  pkill -f "firebase serve"
  ```

### Protocol for Agents and Developers
- **Always use `./serve-clean.sh` to start or restart the server.**
- Do not run `firebase serve` directly unless you are sure no other instance is running.
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
- Opens the comprehensive test suite in your browser (via `public/tests/index.html`).
- Includes all integration, accessibility, UI, and DOM-dependent tests.

### Why this split?
- **Node-compatible tests** are fast, reliable, and run automatically in CI/CD.
- **Browser-only tests** cover UI, accessibility, and integration scenarios that require a real DOM.

See comments in the test files and scripts for more details.

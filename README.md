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

## Usage

- **Test Mode**: Press Ctrl+Shift+Q (Mac: Cmd+Shift+Q)
- **Version**: Displayed in top-right corner of app
- **Feedback**: Include version number when reporting issues

## Development

```bash
git clone https://github.com/fourhexagons/music-theory-practice.git
cd music-theory-practice
python3 -m http.server 8000
# Visit http://localhost:8000/practice
```

## Architecture

- `learning.lightbath.com` - Landing page (future: course marketing)
- `learning.lightbath.com/practice` - Music theory practice app
- `learning.lightbath.com/dashboard` - Future student dashboards
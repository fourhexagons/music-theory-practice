# Development Guide

## 🚨 CRITICAL: LEARNING PATH LOGIC PROTECTION PROTOCOL 🚨

**BEFORE making ANY changes to learning path logic, you MUST follow this protocol:**

### Step 1: STOP and READ
If you're about to modify any of these files/functions, STOP immediately:
- `public/js/state/learningState.js` - `advanceLearningPath()` function
- `public/js/state/learningState.js` - `getCurrentChapter()` function  
- `public/js/state/learningState.js` - `getCurrentKey()` function
- `public/js/state/learningState.js` - `getCurrentGroup()` function
- `public/js/utils/helpers.js` - `generateQuestion()` function
- Any file containing learning path progression logic

### Step 2: ASK PERMISSION
**You MUST ask the user explicitly:**
> "I'm about to modify the learning path logic in [specific file/function]. This could break the app's progression. Do you want me to proceed, or should I find an alternative solution?"

### Step 3: ALTERNATIVE SOLUTIONS FIRST
Before modifying learning path logic, consider these alternatives:
- **UI/UX changes**: Modify the interface, not the logic
- **Question generation**: Change how questions are asked, not how progression works
- **Validation logic**: Modify answer checking, not progression
- **State display**: Change how progress is shown, not how it's tracked
- **Error handling**: Improve error messages, not core logic

### Step 4: IF PERMISSION GRANTED
- Create a backup branch first: `git checkout -b backup-learning-path-[date]`
- Make minimal, targeted changes only
- Test thoroughly before committing
- Document exactly what was changed and why

### Step 5: REMEMBER
The learning path logic is **WORKING CORRECTLY** and follows a predictable pattern:
- C major → G major → D major → A major → E major → B major → F# major → C# major
- Each key: accCount → accNotes → scale → triads → sevenths
- C major skips accNotes (intentional behavior)
- Triads/sevenths require 3 correct answers, others advance immediately

**This protocol is MANDATORY for all assistants and developers.**

---

This guide is for developers who want to set up the project locally, contribute to development, or understand the technical architecture.

## 🛠️ Prerequisites

- **Python 3.x** (for local development server)
- **Modern web browser** with JavaScript enabled
- **Git** (for version control)

## 🚀 Local Setup

### Quick Start
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd music-theory-practice
   ```

2. **Start the development server**
   ```bash
   python3 -m http.server 8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Alternative Ports
If port 8000 is in use, try a different port:
```bash
python3 -m http.server 8001
```
Then visit: `http://localhost:8001`

## 🏗️ Project Structure

```
music-theory-practice/
├── public/
│   ├── index.html          # Main application
│   ├── css/
│   │   └── style.css       # Styling
│   ├── js/
│   │   ├── main.js         # Core application logic
│   │   └── tests.js        # Testing framework
│   ├── images/             # App assets
│   └── manifest.json       # PWA configuration
├── DEVELOPMENT.md          # This file
├── TESTING.md              # Testing documentation
├── CONTRIBUTING.md         # Contribution guidelines
└── README.md               # User-facing documentation
```

## 🔧 Key Functions

### Chord Normalization
```javascript
normalizeChord(chordString)
```
Handles various chord notation formats:
- Converts "Bb-" to "Bbm" (minor)
- Converts "C∆" to "CM7" (major 7th)
- Converts "d dim" to "Ddim" (diminished)
- Preserves proper capitalization

### Accidental Normalization
```javascript
normalizeAccidental(noteString)
```
Standardizes accidental notation:
- Converts flats to sharps or vice versa
- Maintains consistent notation across the app

## 🧪 Testing

The project includes a comprehensive testing framework. See [docs/TESTING.md](docs/TESTING.md) for detailed information about:

- Running tests
- Adding new tests
- Debugging procedures
- Test configuration

## 🐛 Troubleshooting

### Common Development Issues

#### Port Already in Use
```bash
# Find and kill process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
python3 -m http.server 8001
```

#### Tests Not Running
- Check browser console for JavaScript errors
- Ensure `tests.js` is properly loaded
- Verify test configuration settings

#### Chord Recognition Issues
- Check chord normalization function
- Verify test cases cover edge cases
- Review console for detailed error messages

### Debug Mode
Enable debug mode for detailed logging:
```javascript
// In browser console
toggleDebugMode()
```

## 🎯 Best Practices

### Code Quality
- **Follow consistent naming conventions**
- **Add comments for complex logic**
- **Validate user input** thoroughly
- **Handle errors gracefully**

### Performance
- **Minimize DOM queries** in loops
- **Use efficient algorithms** for chord normalization
- **Cache frequently used values**
- **Optimize test execution** for large test suites

### Testing
- **Run tests frequently** during development
- **Add tests for new features** before implementation
- **Use descriptive test names** for better debugging
- **Test edge cases** and error conditions

## 📚 Additional Resources

- **Browser Console**: Real-time debugging information
- **Test Reports**: Detailed HTML test results
- **PWA Documentation**: Progressive Web App features

## 🔮 Future Development

### Planned Features
- Cloud deployment
- User accounts and progress tracking
- Advanced chord progressions
- Mobile app versions

### Architecture Considerations
- Modular design for easy feature addition
- Comprehensive testing for reliability
- Performance optimization for mobile devices
- Accessibility compliance

### Testing Your Changes
```bash
# Start the development server
python3 -m http.server 8000

# Open in browser and run tests
# Press Ctrl+Shift+Q (or Cmd+Shift+Q on Mac) to run tests
```

---

*This development guide is maintained by the development team. For user support, see the main [README.md](../README.md).* 
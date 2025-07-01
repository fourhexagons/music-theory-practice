# Development Guide

## 🔍 **MANDATORY: Systematic Research Methodology**

**ALL development work involving existing code MUST follow the [Systematic Research Methodology](SYSTEMATIC_RESEARCH_METHODOLOGY.md).**

### Quick Start
1. **Use the [Research Template](RESEARCH_TEMPLATE.md)** for any task involving existing code
2. **Never make assumptions** - always verify with actual code first
3. **Research systematically** - break problems into specific questions and investigate each one
4. **Document findings** - capture evidence and reasoning for future reference

### Why This Matters
This methodology successfully identified and fixed complex bugs that traditional debugging missed:
- Architecture conflicts between old and new systems
- Test configuration issues masking real problems  
- Root cause vs. symptom confusion
- Integration points that weren't obvious

**Bottom line: Research first, implement second. Always verify through code.**

---

## 🚨 CRITICAL: LEARNING PATH LOGIC PROTECTION PROTOCOL 🚨

**BEFORE making ANY changes to learning path logic, you MUST follow this protocol:**

### Step 1: STOP and READ
If you're about to modify any of these files/functions, STOP immediately:
- `src/state/learningState.js` - `advanceLearningPath()` function
- `src/modules/business/services/StateManager.js` - `getCurrentChapter()` function  
- `src/modules/business/services/StateManager.js` - `getCurrentKey()` function
- `src/modules/business/services/StateManager.js` - `getCurrentGroup()` function
- `src/modules/business/services/QuestionGenerator.js` - Question generation logic
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

## 🔍 SYSTEMATIC DEBUGGING PROTOCOL

**CRITICAL: This is how we should approach ALL debugging problems. Perspective is everything!**

### The Problem with Narrow Perspectives
Assistants often make their biggest mistakes when they:
- Assume they understand the problem immediately
- Jump to conclusions without thorough investigation
- Focus on the first potential solution they see
- Ignore alternative explanations or root causes

### The Systematic Approach (Proven Method)

#### Step 1: STOP and INVESTIGATE
**DO NOT** start coding immediately. Instead:

1. **Examine the complete codebase evolution**
   ```bash
   git log --oneline -15  # See recent commits
   git show <commit-hash> --name-only  # See what files changed
   ```

2. **Understand the baseline (working state)**
   - Find the last known working commit
   - Examine what the code looked like before the problem
   - Understand the original design intent

3. **Trace the problem's introduction**
   - Look at each commit that might have introduced the issue
   - Compare before/after states
   - Identify what changed and why

#### Step 2: CONSIDER MULTIPLE PERSPECTIVES
**DO NOT** assume you have the complete picture. Ask:

1. **Where else could this problem be occurring?**
   - Search the entire codebase for similar patterns
   - Look for multiple places where the same logic might be applied
   - Consider different execution paths

2. **What are the alternative explanations?**
   - Could the problem be in a different function?
   - Could it be a data structure issue?
   - Could it be a timing/initialization problem?

3. **What are the edge cases?**
   - Different modes of operation
   - Different user flows
   - Different data states

#### Step 3: CREATE A COMPREHENSIVE PLAN
**DO NOT** proceed without a complete plan:

1. **Document your understanding**
   - Write down what you think the problem is
   - List all the places you've investigated
   - Note any assumptions you're making

2. **Test your assumptions**
   - Verify each piece of your understanding
   - Look for evidence that contradicts your theory
   - Consider what would disprove your hypothesis

3. **Plan the complete solution**
   - Address all identified root causes
   - Ensure no new problems are introduced
   - Plan how to verify the fix works

#### Step 4: IMPLEMENT CAREFULLY
**DO NOT** make changes until you're certain:

1. **Make minimal, targeted changes**
   - Change only what's necessary
   - Preserve working functionality
   - Document what you're changing and why

2. **Test thoroughly**
   - Test the specific issue
   - Test related functionality
   - Test edge cases

3. **Verify the fix**
   - Confirm the problem is resolved
   - Ensure no regressions
   - Document the solution

### Real Example: Seventh Chord Key Mismatch Issue

**Problem**: Keys shown in question text didn't match keys used in validation for seventh chord spelling questions.

**Initial Assumption**: The problem was in the main `askQuestion()` function.

**Systematic Investigation**:

1. **Examined code evolution**:
   - Found the "original fix" commit that introduced special handling
   - Compared before/after states of `askQuestion()` function
   - Identified that the special handling was unnecessary

2. **Considered multiple perspectives**:
   - Checked if the problem occurred in normal learning path vs advanced practice
   - Found that `startAdvancedPractice()` had multiple random key selections
   - Discovered the real root cause was inconsistent key selection

3. **Created comprehensive plan**:
   - Revert unnecessary special handling in `askQuestion()`
   - Fix key selection consistency in `startAdvancedPractice()`
   - Ensure validation logic remains correct

4. **Implemented carefully**:
   - Made minimal changes to restore original working behavior
   - Fixed the actual root cause (multiple random selections)
   - Verified the fix resolved the issue

**Result**: Complete resolution of the key mismatch issue with no regressions.

### Key Lessons

1. **Never assume you understand the problem immediately**
2. **Always investigate the complete codebase evolution**
3. **Consider multiple execution paths and edge cases**
4. **Look for patterns that might indicate broader issues**
5. **Make minimal, targeted changes based on thorough understanding**
6. **Document your process for future reference**

**This systematic approach prevents the most common debugging mistakes and leads to more reliable solutions.**

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
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:5173/practice
   ```

### Alternative Servers
For different development needs:
```bash
npm run preview      # Production build testing (port 4173)
npm run serve:old    # Legacy Firebase system (port 5002)
```

## 🏗️ Project Structure

```
music-theory-practice/
├── src/                    # Current system
│   ├── practice.html       # Main application
│   ├── index.html          # Landing page
│   ├── styles/             # Styling (modern CSS architecture)
│   ├── modules/            # Modular business logic
│   │   ├── business/       # Core services and utilities
│   │   └── ui/             # UI components and controllers
│   ├── data/               # Quiz data and constants
│   └── utils/              # Shared utilities
├── tests/                  # Modern test system
├── docs/                   # Documentation
├── archive/                # Legacy files (tests, debug scripts)
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
# Find and kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Or restart the development server
npm run dev
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
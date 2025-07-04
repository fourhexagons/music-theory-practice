# AI Assistant Contribution Protocol

## 🔍 **MANDATORY: Systematic Research Methodology**

**ALL contributions involving existing code MUST follow our [Systematic Research Methodology](SYSTEMATIC_RESEARCH_METHODOLOGY.md).**

### Before You Start ANY Task
1. **Use the [Research Template](RESEARCH_TEMPLATE.md)** - Copy it and fill it out as you work
2. **Never make assumptions** - Always verify behavior through actual code
3. **Research systematically** - Break problems into specific questions and investigate each one
4. **Document your findings** - Capture evidence and reasoning for future contributors

### Why This Matters
This methodology successfully identified complex bugs that traditional approaches missed. It ensures:
- ✅ **Root causes addressed** (not just symptoms)
- ✅ **Architectural consistency maintained**
- ✅ **No unintended side effects**
- ✅ **Knowledge shared with team**

**Bottom line: Research first, contribute second. Always verify through code.**

---

## 📝 **MANDATORY: Documentation Requirements**

**Every contribution MUST include documentation updates. Following the [Documentation Maintenance Protocol](DOCUMENTATION_MAINTENANCE_PROTOCOL.md):**

### Pre-Contribution Documentation Checklist
- [ ] **Research findings documented** - Key insights captured for future developers
- [ ] **Decision rationale recorded** - Why this approach was chosen over alternatives
- [ ] **Code documentation updated** - Comments, README, function docs as needed
- [ ] **User guides updated** - Any behavior changes reflected in user documentation
- [ ] **Examples verified** - All documentation examples still work correctly
- [ ] **Cross-references checked** - Links and references are still accurate

### Documentation Quality Standards
- ✅ **Accurate** - Reflects actual current behavior
- ✅ **Complete** - No missing steps or information
- ✅ **Clear** - Understandable by intended audience  
- ✅ **Current** - Updated with every relevant change

**Remember: Documentation updates are NOT optional. They're as required as tests passing.**

---

## 🔧 **Development Standards**

### Making Changes
1. **Follow systematic research methodology** - Use [Research Template](RESEARCH_TEMPLATE.md)
2. **Research existing code** before making any modifications
3. **Make targeted changes** addressing root causes (not symptoms)
4. **Add tests** for new functionality
5. **Run the test suite** to ensure everything works
6. **Update documentation** following maintenance protocol

### JavaScript Standards
- **Use consistent naming** (camelCase for variables/functions)
- **Add comments** for complex logic
- **Follow existing patterns** in the codebase
- **Validate inputs** thoroughly

### CSS Standards
- **Use Tailwind utility classes** for most styling needs
- **Follow the design system** for semantic colors and spacing
- **Apply classes directly in templates** rather than separate CSS files
- **Use responsive prefixes** (`md:`, `lg:`) for mobile-first design
- **Maintain accessibility** with proper focus states and screen reader support

### HTML Standards
- **Use semantic elements**
- **Ensure accessibility**
- **Validate markup**

---

## 🧪 **Testing Requirements**

### Before Submitting Changes
- **All tests must pass**
- **Add tests for new features**
- **Test on multiple browsers**
- **Test responsive design**

### Running Tests
- **Automatic**: Tests run on page load in development
- **Manual**: Use `Ctrl+Shift+Q` keyboard shortcut
- **Console**: Use `runAllTests()` function

---

## 📋 **Change Documentation Template**

### Research Documentation Required
**Include key findings from your systematic research:**

#### Problem Analysis
- **Root cause identified:** [Evidence-based analysis]
- **Code locations examined:** [Specific files and functions]
- **Alternative solutions considered:** [Other approaches evaluated]

#### Solution Implementation
- **Approach chosen:** [Why this solution was selected]
- **Changes made:** [Specific modifications]
- **Evidence supporting solution:** [How you verified it works]

#### Documentation Updates
- **Research findings:** [Key insights for future reference]
- **Behavior changes:** [What users will notice]
- **Code documentation:** [Comments and explanations added]
- **Cross-references:** [Links and related docs updated]

### Systematic Research Applied
- [ ] Used [Research Template](RESEARCH_TEMPLATE.md) for investigation
- [ ] Researched existing code before making changes
- [ ] Identified root cause (not just symptoms)
- [ ] Documented findings and rationale

### Testing Verification
- [ ] All tests pass
- [ ] Added tests for new functionality
- [ ] Verified no regressions in related functionality
- [ ] Tested edge cases and different modes

### Documentation Quality Verification
- [ ] Examples work when followed exactly
- [ ] Information is consistent across documents
- [ ] New developers could understand updates
- [ ] Links and references are accurate

---

## 🛡️ **Critical Protections**

### Learning Path Logic
**NEVER modify learning path logic without explicit permission.** See [Learning Path Protection](LEARNING_PATH_PROTECTION.md) for full protocol.

### URL Configuration
**ALWAYS use [URL Configuration](URL_CONFIGURATION.md)** as single source of truth for app URLs.

### Documentation Maintenance
**ALWAYS follow [Documentation Maintenance Protocol](DOCUMENTATION_MAINTENANCE_PROTOCOL.md)** with every change.

---

*All contributions must follow the systematic research methodology. Evidence-based approach required.*
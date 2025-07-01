# Systematic Research Methodology for Development

## Overview

This methodology emerged from successfully identifying and fixing a complex bug through systematic codebase research rather than making assumptions. It emphasizes **verification through code** over speculation, leading to accurate diagnosis and efficient fixes.

## Core Principles

### 1. **Never Make Assumptions**
- Always verify implementation details by reading the actual code
- Question apparent behaviors - they may reveal deeper issues
- When something "seems obvious," investigate to confirm

### 2. **Break Down Complex Problems**
- Transform vague issues into specific, answerable questions
- Research each question systematically
- Build understanding incrementally

### 3. **Research Before Implementation**
- Understand existing systems before modifying them
- Map out code relationships and dependencies
- Identify the actual vs. expected behavior

### 4. **Document Findings**
- Capture exact code locations and implementations
- Create reference maps for future work
- Record decision rationale with evidence

## Methodology Steps

### Phase 1: Problem Decomposition
1. **Identify the specific issue**
   - What exact behavior is observed?
   - What behavior is expected?
   - When/where does the discrepancy occur?

2. **Break into research questions**
   - What components are involved?
   - How do they interact?
   - Where might the logic diverge?

### Phase 2: Systematic Code Research
1. **Map the execution flow**
   - Trace from entry point to problem area
   - Identify all functions/classes involved
   - Document the actual call chain

2. **Examine each component**
   - Read the actual implementation
   - Understand the logic and data flow
   - Note any inconsistencies or red flags

3. **Use targeted searches**
   - `codebase_search` for semantic understanding
   - `grep_search` for exact pattern matching
   - `read_file` for detailed implementation review

### Phase 3: Evidence-Based Analysis
1. **Compare expected vs. actual logic**
   - Document what the code actually does
   - Identify where it deviates from requirements
   - Trace the root cause systematically

2. **Validate findings**
   - Create minimal test cases
   - Verify behavior empirically
   - Confirm the diagnosis before fixing

### Phase 4: Targeted Resolution
1. **Fix at the root cause**
   - Address the actual problem, not symptoms
   - Ensure consistency across related components
   - Verify the fix doesn't break other functionality

2. **Test comprehensively**
   - Automated testing to verify the fix
   - Regression testing for related functionality
   - Document the verification process

### Phase 5: **Documentation and Knowledge Sharing**

**MANDATORY: Follow [Documentation Maintenance Protocol](DOCUMENTATION_MAINTENANCE_PROTOCOL.md)**

#### Document Everything
- **Research findings** - Capture insights for future developers
- **Decision rationale** - Why this approach over alternatives
- **Code changes** - Comments, README updates, architecture docs
- **User impact** - Update user-facing guides if behavior changed
- **Lessons learned** - Common pitfalls and best practices

#### Documentation Quality Standards
- **Accurate** - Reflects current behavior exactly
- **Complete** - No missing steps or information
- **Clear** - Understandable by intended audience
- **Current** - Updated with every change

**Remember: Documentation updates are as mandatory as code quality and testing.**

---

## ✅ **Research Methodology Checklist**

### **Phase 1: Problem Definition**
- [ ] Problem clearly defined with specific behaviors
- [ ] Research questions formulated  
- [ ] Success criteria established

### **Phase 2: Systematic Investigation**  
- [ ] Execution flow mapped from entry to problem area
- [ ] All components in the flow examined
- [ ] Search strategy documented

### **Phase 3: Evidence Analysis**
- [ ] Root cause identified with code evidence  
- [ ] Alternative explanations considered
- [ ] Solution approach validated

### **Phase 4: Implementation**
- [ ] Changes target actual root cause
- [ ] Consistency maintained across codebase
- [ ] Testing plan covers original issue + regressions

### **Phase 5: Documentation** 
- [ ] Research findings documented for future reference
- [ ] Decision rationale captured with evidence
- [ ] Code documentation updated
- [ ] User guides updated if needed
- [ ] Documentation follows [Documentation Maintenance Protocol](DOCUMENTATION_MAINTENANCE_PROTOCOL.md)

## Research Tools & Techniques

### Code Investigation Tools
- **`codebase_search`**: Semantic searches for concepts, patterns, usage
- **`grep_search`**: Exact pattern matching, function calls, specific strings
- **`read_file`**: Detailed examination of implementations
- **`file_search`**: Locating files by name patterns

### Research Strategies
- **Follow the execution path**: Start from entry point, trace through to problem
- **Map dependencies**: Understand what calls what, and in what order
- **Compare implementations**: Look for inconsistencies between related functions
- **Verify assumptions**: Always check what the code actually does

### Documentation Approach
- **Code reference citations**: Use exact line numbers and file paths
- **Decision rationale**: Record why choices were made with evidence
- **Research findings**: Capture both what works and what doesn't
- **Implementation patterns**: Document architectural insights

## Case Study: AccNotes Skipping Bug Fix

### Problem
G major incorrectly skipped accNotes questions, showing accCount → scale → scale instead of accCount → accNotes → scale.

### Research Questions Generated
1. How are questions generated and what controls progression?
2. What logic determines when to skip accNotes?
3. Are there multiple systems that might conflict?
4. Why do tests fail at specific progression points?

### Systematic Investigation
1. **Traced execution flow**: Test → AppController → QuestionGenerator → StateManager
2. **Identified architecture conflict**: Old global functions vs. new modular system
3. **Found root cause**: QuestionGenerator calling buggy global functions instead of StateManager
4. **Located exact bug**: Global `getCurrentChapter()` skipped ALL accNotes, not just C major

### Research Findings
- NEW StateManager had correct logic (C-major-only skipping)
- OLD global functions had buggy logic (skip ALL accNotes)
- QuestionGenerator was calling OLD system instead of NEW
- Test configuration issues masked the problem initially

### Resolution
- Fixed QuestionGenerator to use StateManager methods consistently
- Removed conflicting global function to prevent confusion
- Updated test configuration to use development server
- Verified fix with comprehensive automated testing

## Development Workflow Integration

### Before Making Changes
1. **Research the current implementation**
   - Understand what exists and how it works
   - Map out the components you'll be affecting
   - Identify potential integration points

2. **Plan the change systematically**
   - Define exactly what needs to change and why
   - Consider ripple effects and dependencies
   - Design the change to be consistent with existing patterns

### During Implementation
1. **Follow established patterns**
   - Use existing architectural approaches where possible
   - Maintain consistency with the broader codebase
   - Document any deviations and their rationale

2. **Test incrementally**
   - Verify each component as it's modified
   - Use automated testing to catch regressions
   - Test integration points thoroughly

### After Implementation
1. **Validate the complete solution**
   - Comprehensive testing of the fixed functionality
   - Regression testing of related features
   - Documentation of the changes and their impact

2. **Document learnings**
   - Capture insights about the codebase architecture
   - Record any gotchas or non-obvious behaviors
   - Update architectural documentation as needed

## Templates and Checklists

### Research Phase Checklist
- [ ] Problem clearly defined with specific behaviors
- [ ] Execution flow mapped from entry to problem area
- [ ] All involved components identified and examined
- [ ] Root cause identified with code evidence
- [ ] Alternative solutions considered

### Implementation Checklist
- [ ] Changes target the actual root cause
- [ ] Consistency maintained across related components
- [ ] No assumptions made without code verification
- [ ] Comprehensive testing plan created
- [ ] Documentation updated

### Quality Assurance Checklist
- [ ] Original issue completely resolved
- [ ] No new issues introduced
- [ ] Related functionality still works correctly
- [ ] Changes are maintainable and well-documented
- [ ] Future developers can understand the reasoning

## Benefits of This Approach

### Accuracy
- Fixes address root causes, not symptoms
- Reduces debugging cycles and false starts
- Prevents introducing new issues

### Efficiency
- Targeted research saves time vs. trial-and-error
- Systematic approach reduces rabbit holes
- Documentation prevents re-researching the same issues

### Code Quality
- Maintains architectural consistency
- Reduces technical debt
- Creates maintainable solutions

### Team Knowledge
- Documented research helps other developers
- Shared understanding of system behavior
- Collective learning from systematic investigation

## When to Apply This Methodology

### Always Apply For:
- Bug fixes (especially complex or non-obvious ones)
- Feature additions that integrate with existing systems
- Performance optimizations
- Architectural changes or refactoring

### Especially Critical For:
- Issues that seem simple but have complex symptoms
- Problems that affect core functionality
- Changes to shared components or utilities
- Anything involving state management or data flow

### Less Critical For:
- Pure CSS/styling changes
- Simple text updates
- Adding completely new, isolated features
- Minor configuration changes

## Conclusion

This systematic research methodology transforms development from guesswork into a scientific process. By following these principles and practices, we can:

- Solve problems more accurately and efficiently
- Build more maintainable and robust code
- Create shared understanding across the team
- Continuously improve our codebase knowledge

The key is to always **verify through code** rather than assume, and to **document the journey** so future work can build on these insights.

### **Systematic Research Workflow** (Copy this checklist)
- [ ] Research questions formulated
- [ ] Execution flow mapped  
- [ ] All components examined
- [ ] Root cause identified with evidence
- [ ] Solution targets root cause
- [ ] Comprehensive testing completed
- [ ] **Documentation updated** following [Documentation Maintenance Protocol](DOCUMENTATION_MAINTENANCE_PROTOCOL.md) 
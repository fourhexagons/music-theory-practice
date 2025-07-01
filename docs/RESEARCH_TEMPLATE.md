# Systematic Research Template

*Use this template for any development task that involves existing code*

## Problem Definition

### Issue Description
**What exact behavior is observed?**
- [ ] 

**What behavior is expected?**
- [ ] 

**When/where does the discrepancy occur?**
- [ ] 

### Research Questions
*Break the problem into specific, answerable questions*

1. **Question 1:** 
   - [ ] Researched ✓ 
   - **Finding:** 

2. **Question 2:** 
   - [ ] Researched ✓ 
   - **Finding:** 

3. **Question 3:** 
   - [ ] Researched ✓ 
   - **Finding:** 

## Code Investigation

### Execution Flow Mapping
*Trace from entry point to problem area*

**Entry Point:** `file:line` → **Problem Area:** `file:line`

**Call Chain:**
1. `function/method` in `file:line`
2. `function/method` in `file:line`
3. `function/method` in `file:line`

### Component Analysis
*Examine each component in the flow*

**Component 1:** `ComponentName` in `file:line`
- **Purpose:** 
- **Logic:** 
- **Issues Found:** 

**Component 2:** `ComponentName` in `file:line`
- **Purpose:** 
- **Logic:** 
- **Issues Found:** 

### Search Commands Used
*Document searches for future reference*

```bash
# Semantic searches
codebase_search: "search query"

# Pattern searches  
grep_search: "pattern"

# File examination
read_file: "file:start-end"
```

## Root Cause Analysis

### Expected vs. Actual Logic
**Expected Behavior:**
- 

**Actual Implementation:**
- 

**Root Cause:**
- 

### Evidence
**Code References:**
- `file:line` - Description
- `file:line` - Description

## Solution Design

### Proposed Fix
**Target Changes:**
- [ ] `file:line` - What will change
- [ ] `file:line` - What will change

**Rationale:**
- 

### Consistency Check
- [ ] Change is consistent with existing patterns
- [ ] No conflicts with other components
- [ ] Maintains architectural integrity

## Implementation Checklist

### Pre-Implementation
- [ ] Problem clearly defined with specific behaviors
- [ ] Execution flow mapped from entry to problem area
- [ ] All involved components identified and examined
- [ ] Root cause identified with code evidence
- [ ] Alternative solutions considered

### Implementation
- [ ] Changes target the actual root cause
- [ ] Consistency maintained across related components
- [ ] No assumptions made without code verification
- [ ] Comprehensive testing plan created

### Verification
- [ ] Original issue completely resolved
- [ ] No new issues introduced
- [ ] Related functionality still works correctly
- [ ] Changes are maintainable and well-documented

## Testing Plan

### Test Cases
1. **Original Issue:** 
   - **Test:** 
   - **Expected Result:** 

2. **Regression Test:** 
   - **Test:** 
   - **Expected Result:** 

3. **Integration Test:** 
   - **Test:** 
   - **Expected Result:** 

### Test Results
- [ ] All tests pass
- [ ] Manual verification completed
- [ ] Performance impact assessed (if applicable)

## Documentation Updates

### Code Changes
- [ ] Implementation documented with comments
- [ ] Function/class documentation updated
- [ ] README updated (if applicable)

### Research Documentation
- [ ] Key findings documented for future reference
- [ ] Architectural insights captured
- [ ] Common pitfalls noted

## Lessons Learned

### Insights About Codebase
- 

### Process Improvements
- 

### Future Considerations
- 

---

## Quick Reference Commands

```bash
# Research Tools
codebase_search query="semantic search" target_directories=["src/"]
grep_search query="exact_pattern" include_pattern="*.js"
read_file target_file="path" start_line_one_indexed=1 end_line_one_indexed=50

# Testing
npm run test:headless  # Run automated tests
npm run dev           # Development server (port 5173)
npm run preview       # Preview server (port 4173)
```

## Methodology Reminders

🔍 **Never assume** - always verify with actual code
📋 **Break it down** - complex problems → specific questions  
🗺️ **Map the flow** - trace execution from entry to problem
📝 **Document everything** - findings, rationale, evidence
🎯 **Fix the root cause** - not just symptoms
✅ **Test thoroughly** - automated + manual + regression 
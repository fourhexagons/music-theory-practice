# Git Workflow Protocol

## Branch Hygiene Rules

### Branch Naming Convention
- `feature/short-description` - New features
- `bugfix/short-description` - Bug fixes  
- `hotfix/short-description` - Critical fixes
- `docs/short-description` - Documentation only
- `refactor/short-description` - Code refactoring

### Branch Lifecycle
1. **Create**: Branch from latest main
2. **Work**: Make commits with descriptive messages
3. **Merge**: Merge back to main when complete
4. **Delete**: Remove branch immediately after merge

### Cleanup Schedule
- **Weekly**: Review and delete merged branches
- **Before major work**: Clean workspace of stale branches
- **Never**: Keep branches "just in case" - git history preserves work

### Protected Branches
- `main` - Primary development branch
- `feature/learning-path-improvements` - Current active work

## Commands

### Assistant Workflow (Automated)
```bash
npm run git:verify         # Analyze git state and get recommendations
npm run git:workflow       # Alias for git:verify
```

### Branch Management
```bash
npm run git:cleanup        # Interactive branch cleanup
npm run git:status         # Quick branch overview
```

### Manual Commands (Advanced)
```bash
git branch --merged main    # See merged branches
git branch -d branch-name   # Delete merged branch
git branch -D branch-name   # Force delete unmerged branch
```

### Best Practices
- **One feature per branch**
- **Delete after merge**
- **Keep names short and descriptive**
- **Don't hoard branches**

## Assistant Protocol Integration

### Automated Decision Making
The `git:verify` command provides automated recommendations:
- **COMMIT_CHANGES**: Automatically commits unstaged work with intelligent messages
- **CHECK_MERGE_READY**: Analyzes if feature work is complete
- **MERGE_TO_MAIN**: (Future) Automated merging when appropriate
- **CLEAN_STATE**: Confirms repository is ready for new work

### Chaos Prevention Rules
1. **Maximum 10 commits** on feature branch before requiring merge consideration
2. **Intelligent commit messages** based on file analysis
3. **Automated branch lifecycle** management
4. **Protection of main branch** stability

### Integration with Development Workflow
- **Mandatory verification** before investigation (Assistant Prompt Step 5)
- **Evidence-based decisions** using git history analysis
- **Automated cleanup** of assistant-created branch chaos
- **Deploy-from-main** safety protocols

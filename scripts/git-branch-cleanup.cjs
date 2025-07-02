#!/usr/bin/env node

/**
 * Git Branch Cleanup Script
 * 
 * Safely cleans up stale and merged branches while preserving active work.
 * Based on evidence-based analysis of current repository state.
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Branch cleanup categories based on evidence
const BRANCH_CATEGORIES = {
  // 100% safe - already merged into main
  SAFE_DELETE: [
    'feature/fix-menu-difficulty-modes',
    'feature/investigate-scale-validation-comprehensive', 
    'feature/practice-menu-overlay',
    'hotfix/restore-stability',
    'phase1-infrastructure',
    'phase1-migration',
    'phase2-architecture',
    'seventh-chord-fixes-20250627',
    'test-suite-reorg'
  ],
  
  // Assistant-created clutter
  ASSISTANT_CLUTTER: [
    'backup-before-complete-cleanup-20250630-210607'
  ],
  
  // Need user confirmation
  CONFIRM_DELETE: [
    'dev',
    'bugfix/seventh-chord-validation',
    'hotfix/restore-pre-merge-stability', 
    'remove-advanced-section',
    'test-suite-expansion'
  ],
  
  // Never delete
  PROTECTED: [
    'main',
    'feature/learning-path-improvements'
  ]
};

function run(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    return null;
  }
}

function getCurrentBranch() {
  return run('git rev-parse --abbrev-ref HEAD');
}

function branchExists(branchName) {
  const branches = run('git branch --format="%(refname:short)"');
  return branches && branches.split('\n').includes(branchName);
}

function isBranchMerged(branchName) {
  const mergedBranches = run('git branch --merged main --format="%(refname:short)"');
  return mergedBranches && mergedBranches.split('\n').includes(branchName);
}

function deleteBranch(branchName, force = false) {
  const flag = force ? '-D' : '-d';
  return run(`git branch ${flag} "${branchName}"`);
}

function askConfirmation(question) {
  return new Promise((resolve) => {
    rl.question(`${question} (y/N): `, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function showBranchStatus() {
  console.log('\n🔍 Current Branch Status:');
  console.log('═'.repeat(80));
  
  const branches = run('git for-each-ref --format="%(refname:short)|%(committerdate:relative)|%(subject)" refs/heads');
  const branchList = branches.split('\n');
  
  console.log('📊 Branch Overview:');
  branchList.forEach(line => {
    const [branch, date, subject] = line.split('|');
    const status = getCurrentBranch() === branch ? '👈 CURRENT' : '';
    console.log(`  ${branch.padEnd(40)} ${date.padEnd(15)} ${status}`);
  });
  
  console.log('\n🎯 Cleanup Plan:');
  console.log(`✅ Safe to delete: ${BRANCH_CATEGORIES.SAFE_DELETE.length} branches`);
  console.log(`🗑️  Assistant clutter: ${BRANCH_CATEGORIES.ASSISTANT_CLUTTER.length} branches`);
  console.log(`❓ Need confirmation: ${BRANCH_CATEGORIES.CONFIRM_DELETE.length} branches`);
  console.log(`🛡️  Protected: ${BRANCH_CATEGORIES.PROTECTED.length} branches`);
}

async function cleanupSafeBranches() {
  console.log('\n🧹 Cleaning Up Safe Branches:');
  console.log('═'.repeat(50));
  
  const allSafe = [...BRANCH_CATEGORIES.SAFE_DELETE, ...BRANCH_CATEGORIES.ASSISTANT_CLUTTER];
  
  for (const branch of allSafe) {
    if (!branchExists(branch)) {
      console.log(`⏭️  ${branch} - Already deleted`);
      continue;
    }
    
    if (deleteBranch(branch)) {
      console.log(`✅ ${branch} - Deleted`);
    } else {
      console.log(`❌ ${branch} - Failed to delete`);
    }
  }
}

async function cleanupConfirmBranches() {
  console.log('\n❓ Branches Needing Confirmation:');
  console.log('═'.repeat(50));
  
  for (const branch of BRANCH_CATEGORIES.CONFIRM_DELETE) {
    if (!branchExists(branch)) {
      console.log(`⏭️  ${branch} - Already deleted`);
      continue;
    }
    
    const lastCommit = run(`git log -1 --format="%s" ${branch}`);
    const isMerged = isBranchMerged(branch);
    
    console.log(`\n🔍 Branch: ${branch}`);
    console.log(`   Last commit: ${lastCommit}`);
    console.log(`   Merged status: ${isMerged ? '✅ Merged' : '⚠️  Not merged'}`);
    
    const shouldDelete = await askConfirmation(`Delete ${branch}?`);
    
    if (shouldDelete) {
      const force = !isMerged;
      if (deleteBranch(branch, force)) {
        console.log(`✅ ${branch} - Deleted`);
      } else {
        console.log(`❌ ${branch} - Failed to delete`);
      }
    } else {
      console.log(`⏭️  ${branch} - Skipped`);
    }
  }
}

async function createGitWorkflow() {
  console.log('\n📋 Creating Git Workflow Documentation:');
  console.log('═'.repeat(50));
  
  const workflowContent = `# Git Workflow Protocol

## Branch Hygiene Rules

### Branch Naming Convention
- \`feature/short-description\` - New features
- \`bugfix/short-description\` - Bug fixes  
- \`hotfix/short-description\` - Critical fixes
- \`docs/short-description\` - Documentation only
- \`refactor/short-description\` - Code refactoring

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
- \`main\` - Primary development branch
- \`feature/learning-path-improvements\` - Current active work

## Commands

### Daily Cleanup
\`\`\`bash
npm run git:cleanup
\`\`\`

### Manual Branch Management
\`\`\`bash
git branch --merged main    # See merged branches
git branch -d branch-name   # Delete merged branch
git branch -D branch-name   # Force delete unmerged branch
\`\`\`

### Best Practices
- **One feature per branch**
- **Delete after merge**
- **Keep names short and descriptive**
- **Don't hoard branches**
`;

  // Write workflow to docs
  require('fs').writeFileSync('docs/GIT_WORKFLOW.md', workflowContent);
  console.log('✅ Created docs/GIT_WORKFLOW.md');
}

async function updatePackageScripts() {
  console.log('\n📦 Adding NPM Scripts:');
  console.log('═'.repeat(30));
  
  const packagePath = 'package.json';
  const packageContent = JSON.parse(require('fs').readFileSync(packagePath, 'utf8'));
  
  packageContent.scripts = packageContent.scripts || {};
  packageContent.scripts['git:cleanup'] = 'node scripts/git-branch-cleanup.cjs';
  packageContent.scripts['git:status'] = 'git branch -v && echo "\n🧹 Run: npm run git:cleanup"';
  
  require('fs').writeFileSync(packagePath, JSON.stringify(packageContent, null, 2) + '\n');
  console.log('✅ Added git:cleanup and git:status scripts');
}

async function main() {
  console.log('🚀 Git Branch Cleanup Tool');
  console.log('═'.repeat(80));
  
  // Safety check - ensure we're in the right branch
  const currentBranch = getCurrentBranch();
  if (currentBranch !== 'feature/learning-path-improvements') {
    console.log(`⚠️  Current branch: ${currentBranch}`);
    console.log('🛡️  This script is designed to run from feature/learning-path-improvements');
    
    const proceed = await askConfirmation('Continue anyway?');
    if (!proceed) {
      console.log('👋 Exiting safely');
      rl.close();
      return;
    }
  }
  
  await showBranchStatus();
  
  const startCleanup = await askConfirmation('\n🧹 Start branch cleanup?');
  if (!startCleanup) {
    console.log('👋 Cleanup cancelled');
    rl.close();
    return;
  }
  
  await cleanupSafeBranches();
  await cleanupConfirmBranches();
  await createGitWorkflow();
  await updatePackageScripts();
  
  console.log('\n🎉 Branch Cleanup Complete!');
  console.log('═'.repeat(40));
  console.log('✅ Stale branches removed');
  console.log('✅ Git workflow documentation created');
  console.log('✅ NPM scripts added');
  console.log('\n📚 Next steps:');
  console.log('   - Review docs/GIT_WORKFLOW.md');
  console.log('   - Use "npm run git:status" to check branch health');
  console.log('   - Use "npm run git:cleanup" for future cleanups');
  
  rl.close();
}

if (require.main === module) {
  main().catch(console.error);
} 
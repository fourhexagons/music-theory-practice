#!/usr/bin/env node

/**
 * Git Assistant Protocol
 * 
 * Automated git workflow management designed specifically for AI assistants.
 * Prevents chaos while maintaining clean, deployable main branch.
 * 
 * Philosophy: Assistant handles all git decisions automatically using evidence-based rules.
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Git workflow configuration
const CONFIG = {
  MAIN_BRANCH: 'main',
  MAX_COMMITS_BEFORE_MERGE: 10,
  REQUIRED_COMMIT_TYPES: ['feat', 'fix', 'docs', 'refactor', 'test', 'chore'],
  BRANCH_PREFIXES: ['feature/', 'bugfix/', 'hotfix/', 'docs/', 'refactor/'],
  PROTECTED_BRANCHES: ['main', 'feature/learning-path-improvements']
};

function run(command, silent = false) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    if (!silent) {
      console.error(`❌ Command failed: ${command}`);
      console.error(error.message);
    }
    return null;
  }
}

function getCurrentBranch() {
  return run('git rev-parse --abbrev-ref HEAD');
}

function getUnstagedChanges() {
  return run('git diff --name-only');
}

function getStagedChanges() {
  return run('git diff --cached --name-only');
}

function getCommitCount(branch) {
  const count = run(`git rev-list --count ${CONFIG.MAIN_BRANCH}..${branch}`, true);
  return count ? parseInt(count) : 0;
}

function isValidCommitMessage(message) {
  // Check conventional commit format
  const conventionalPattern = /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}/;
  return conventionalPattern.test(message);
}

function suggestCommitMessage(changedFiles) {
  // Analyze changed files to suggest commit type and message
  const hasTests = changedFiles.some(f => f.includes('test') || f.includes('spec'));
  const hasDocs = changedFiles.some(f => f.includes('.md') || f.includes('docs/'));
  const hasBugFix = changedFiles.some(f => f.includes('fix') || f.includes('bug'));
  const hasFeature = changedFiles.length > 3; // Multiple files often means feature
  
  if (hasDocs && changedFiles.length === 1) {
    return 'docs: ';
  } else if (hasTests) {
    return 'test: ';
  } else if (hasBugFix) {
    return 'fix: ';
  } else if (hasFeature) {
    return 'feat: ';
  } else {
    return 'chore: ';
  }
}

async function analyzeCurrentState() {
  console.log('\n🔍 Git State Analysis:');
  console.log('═'.repeat(50));
  
  const currentBranch = getCurrentBranch();
  const unstagedFiles = getUnstagedChanges();
  const stagedFiles = getStagedChanges();
  const commitCount = getCommitCount(currentBranch);
  
  console.log(`📍 Current Branch: ${currentBranch}`);
  console.log(`📊 Commits ahead of main: ${commitCount}`);
  console.log(`📝 Unstaged files: ${unstagedFiles ? unstagedFiles.split('\n').length : 0}`);
  console.log(`✅ Staged files: ${stagedFiles ? stagedFiles.split('\n').length : 0}`);
  
  return {
    currentBranch,
    unstagedFiles: unstagedFiles ? unstagedFiles.split('\n') : [],
    stagedFiles: stagedFiles ? stagedFiles.split('\n') : [],
    commitCount
  };
}

async function determineAction(state) {
  console.log('\n🤖 Assistant Protocol Decision Engine:');
  console.log('═'.repeat(50));
  
  // Rule 1: Always commit unstaged changes first
  if (state.unstagedFiles.length > 0) {
    console.log('📋 RULE 1: Unstaged changes detected');
    console.log('   ACTION: Create logical commit from current changes');
    return 'COMMIT_CHANGES';
  }
  
  // Rule 2: If too many commits, merge to main
  if (state.commitCount >= CONFIG.MAX_COMMITS_BEFORE_MERGE) {
    console.log(`📋 RULE 2: ${state.commitCount} commits on feature branch (max: ${CONFIG.MAX_COMMITS_BEFORE_MERGE})`);
    console.log('   ACTION: Merge feature back to main');
    return 'MERGE_TO_MAIN';
  }
  
  // Rule 3: If work is complete, merge to main
  if (state.commitCount > 0 && state.unstagedFiles.length === 0) {
    console.log('📋 RULE 3: Feature work appears complete');
    console.log('   ACTION: Check if ready to merge to main');
    return 'CHECK_MERGE_READY';
  }
  
  // Rule 4: Clean state
  console.log('📋 RULE 4: Clean git state');
  console.log('   ACTION: Ready for new work');
  return 'CLEAN_STATE';
}

async function commitChanges(state) {
  console.log('\n💾 Committing Current Changes:');
  console.log('═'.repeat(40));
  
  // Stage all changes
  run('git add .');
  
  // Create intelligent commit message based on files changed
  const changedFiles = state.unstagedFiles;
  let commitMessage;
  
  if (changedFiles.some(f => f.includes('git') || f.includes('branch'))) {
    commitMessage = 'feat: implement comprehensive git assistant protocol and branch hygiene system';
  } else if (changedFiles.some(f => f.includes('docs/'))) {
    commitMessage = 'docs: enhance documentation with git workflow protocols';
  } else if (changedFiles.some(f => f.includes('script'))) {
    commitMessage = 'feat: add automated git workflow management scripts';
  } else {
    commitMessage = 'chore: update project infrastructure and tooling';
  }
  
  console.log(`📋 Commit Message: ${commitMessage}`);
  
  // Commit
  run(`git commit -m "${commitMessage}"`);
  console.log('✅ Changes committed successfully');
  
  return commitMessage;
}

async function checkMergeReady(state) {
  console.log('\n🔄 Merge Readiness Assessment:');
  console.log('═'.repeat(45));
  
  // Check if this looks like completed work
  const commitMessages = run(`git log --oneline ${CONFIG.MAIN_BRANCH}..HEAD --format="%s"`);
  const hasFixCommits = commitMessages.includes('fix:') || commitMessages.includes('Fix');
  const hasFeatureCommits = commitMessages.includes('feat:') || commitMessages.includes('Feature');
  
  console.log('\n📊 Work Summary:');
  console.log(`   🐛 Bug fixes: ${hasFixCommits ? '✅' : '❌'}`);
  console.log(`   ✨ New features: ${hasFeatureCommits ? '✅' : '❌'}`);
  console.log(`   📈 Total commits: ${state.commitCount}`);
  
  if (hasFixCommits || hasFeatureCommits || state.commitCount >= 5) {
    console.log('\n✅ RECOMMENDATION: Ready to merge');
    return true;
  } else {
    console.log('\n⏳ RECOMMENDATION: Continue development');
    return false;
  }
}

async function mergeToMain(state) {
  console.log('\n🚀 Merging to Main:');
  console.log('═'.repeat(30));
  
  const currentBranch = state.currentBranch;
  
  // Safety check
  if (CONFIG.PROTECTED_BRANCHES.includes(currentBranch) && currentBranch !== 'feature/learning-path-improvements') {
    console.log('🛡️  Protected branch detected - aborting merge');
    return false;
  }
  
  // Switch to main and update
  console.log('📥 Updating main branch...');
  run('git checkout main');
  run('git pull origin main');
  
  // Merge feature branch
  console.log(`🔗 Merging ${currentBranch}...`);
  const mergeResult = run(`git merge ${currentBranch}`, true);
  
  if (mergeResult === null) {
    console.log('❌ Merge conflicts detected');
    console.log('🔧 Manual resolution required');
    run(`git checkout ${currentBranch}`);
    return false;
  }
  
  // Push to remote
  console.log('📤 Pushing to remote...');
  run('git push origin main');
  
  // Clean up feature branch
  console.log('🧹 Cleaning up feature branch...');
  run(`git branch -d ${currentBranch}`);
  
  console.log(`✅ Successfully merged ${currentBranch} to main`);
  return true;
}

function createNewFeatureBranch(workType) {
  console.log('\n🌟 Creating New Feature Branch:');
  console.log('═'.repeat(40));
  
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const branchName = `${workType}/${timestamp}`;
  
  console.log(`📍 Creating branch: ${branchName}`);
  run(`git checkout -b ${branchName}`);
  
  console.log('✅ Ready for new development work');
  return branchName;
}

async function askConfirmation(question) {
  return new Promise((resolve) => {
    rl.question(`${question} (y/N): `, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function updateAssistantProtocols() {
  console.log('\n📋 Updating Assistant Mandatory Prompt:');
  console.log('═'.repeat(45));
  
  const promptPath = 'cursor/docs/ASSISTANT_MANDATORY_PROMPT.md';
  if (!fs.existsSync(promptPath)) {
    console.log('⚠️  Assistant prompt file not found');
    return;
  }
  
  let content = fs.readFileSync(promptPath, 'utf8');
  
  // Add git verification step if not already present
  if (!content.includes('npm run git:verify')) {
    const gitStep = `
**Step 5: Git Protocol Verification**
Before ANY development work:
- Run: \`npm run git:verify\`
- Paste output showing git state compliance
- Confirm workflow protocols are followed
- Get approval for any merge decisions
`;
    
    content = content.replace(
      '**Step 4: Commit Verification**',
      gitStep + '\n**Step 4: Commit Verification**'
    );
    
    fs.writeFileSync(promptPath, content);
    console.log('✅ Added git verification to assistant prompt');
  } else {
    console.log('✅ Git verification already in assistant prompt');
  }
}

async function main() {
  console.log('🤖 Git Assistant Protocol Engine');
  console.log('═'.repeat(80));
  console.log('🎯 Goal: Automate git workflow, prevent chaos, maintain clean main branch');
  
  const state = await analyzeCurrentState();
  const action = await determineAction(state);
  
  console.log(`\n🎯 Recommended Action: ${action}`);
  
  switch (action) {
    case 'COMMIT_CHANGES': {
      await commitChanges(state);
      console.log('\n🔄 Re-analyzing after commit...');
      const newState = await analyzeCurrentState();
      const nextAction = await determineAction(newState);
      if (nextAction === 'CHECK_MERGE_READY') {
        const ready = await checkMergeReady(newState);
        if (ready) {
          console.log('\n💡 Work appears complete after this commit');
          console.log('   Ready to merge to main when feature is done');
        }
      }
      break;
    }
      
    case 'MERGE_TO_MAIN': {
      const mergeReady = await checkMergeReady(state);
      if (mergeReady) {
        await mergeToMain(state);
      }
      break;
    }
      
    case 'CHECK_MERGE_READY': {
      const ready = await checkMergeReady(state);
      if (ready) {
        console.log('\n💡 Feature appears complete and ready for main');
        console.log('   Recommended: Merge to main branch');
      } else {
        console.log('\n📝 Continue development on feature branch');
      }
      break;
    }
      
    case 'CLEAN_STATE':
      console.log('✅ Git state is clean and ready for development');
      break;
  }
  
  await updateAssistantProtocols();
  
  console.log('\n🎉 Git Protocol Analysis Complete');
  console.log('═'.repeat(40));
  console.log('✅ Git state analyzed');
  console.log('✅ Actions recommended');
  console.log('✅ Ready for next development phase');
  
  rl.close();
}

if (require.main === module) {
  main().catch(console.error);
} 
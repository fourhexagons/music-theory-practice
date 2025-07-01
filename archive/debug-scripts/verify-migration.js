#!/usr/bin/env node
// Migration verification script
const { execSync } = require('child_process');
console.log('🔍 VERIFYING PHASE 1 MIGRATION...\n');
const checks = [
  {
    name: 'Build System',
    command: 'npm run build',
    description: 'Testing build process'
  },
  {
    name: 'Linting',
    command: 'npm run lint',
    description: 'Checking code quality'
  },
  {
    name: 'Tests',
    command: 'npm test',
    description: 'Running test suite'
  }
];
let passed = 0;
let failed = 0;
for (const check of checks) {
  try {
    console.log(`📋 ${check.description}...`);
    execSync(check.command, { stdio: 'pipe' });
    console.log(`✅ ${check.name}: PASSED\n`);
    passed++;
  } catch (error) {
    console.log(`❌ ${check.name}: FAILED`);
    console.log(`   Error: ${error.message}\n`);
    failed++;
  }
}
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(30));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
if (failed === 0) {
  console.log('\n🎉 Phase 1 migration SUCCESSFUL!');
  console.log('\nNext steps:');
  console.log('1. Test both old and new versions side by side');
  console.log('2. Deploy new version when ready');
  console.log('3. Monitor for any issues');
  console.log('4. Proceed to Phase 2 when confident');
} else {
  console.log('\n🚨 Migration issues detected. Please fix before proceeding.');
  process.exit(1);
} 
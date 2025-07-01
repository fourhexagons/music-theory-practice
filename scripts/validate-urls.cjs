#!/usr/bin/env node

/**
 * URL Validation Script
 * Verifies that clean URLs are working correctly
 * Prevents future URL configuration issues
 */

const http = require('http');

// Official URLs from docs/URL_CONFIGURATION.md
const URLS_TO_TEST = [
  {
    url: 'http://localhost:5173/',
    name: 'Landing Page',
    description: 'Root URL should serve landing page'
  },
  {
    url: 'http://localhost:5173/practice',
    name: 'Practice App', 
    description: 'Clean URL should serve practice app'
  }
];

// URLs that should NOT work (to prevent regression)
const URLS_SHOULD_404 = [
  {
    url: 'http://localhost:5173/src/index.html',
    name: 'Src Index (should 404)',
    description: 'Direct src access should be discouraged'
  },
  {
    url: 'http://localhost:5173/src/practice.html', 
    name: 'Src Practice (should 404)',
    description: 'Direct src access should be discouraged'
  }
];

function testUrl(urlConfig, expectedStatus = 200) {
  return new Promise((resolve) => {
    const request = http.get(urlConfig.url, (res) => {
      const success = res.statusCode === expectedStatus;
      resolve({
        ...urlConfig,
        status: res.statusCode,
        expected: expectedStatus,
        success
      });
    });

    request.on('error', (err) => {
      resolve({
        ...urlConfig,
        status: 'ERROR',
        expected: expectedStatus,
        success: false,
        error: err.message
      });
    });

    request.setTimeout(5000, () => {
      request.abort();
      resolve({
        ...urlConfig,
        status: 'TIMEOUT',
        expected: expectedStatus,
        success: false,
        error: 'Request timeout'
      });
    });
  });
}

async function main() {
  console.log('🔍 URL VALIDATION TEST');
  console.log('Checking official URLs from docs/URL_CONFIGURATION.md\n');

  let allPassed = true;

  // Test URLs that should work (200)
  console.log('✅ Testing Official URLs (should return 200):');
  for (const urlConfig of URLS_TO_TEST) {
    const result = await testUrl(urlConfig, 200);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}: ${result.status} (${result.url})`);
    if (!result.success) {
      console.log(`   Expected: ${result.expected}, Error: ${result.error || 'Status mismatch'}`);
      allPassed = false;
    }
  }

  console.log('\n❌ Testing Legacy URLs (should return 404):');
  for (const urlConfig of URLS_SHOULD_404) {
    const result = await testUrl(urlConfig, 404);
    const status = result.success ? '✅' : '⚠️';
    console.log(`${status} ${result.name}: ${result.status} (${result.url})`);
    if (!result.success && result.status === 200) {
      console.log(`   ⚠️  Legacy URL still accessible - consider blocking direct access`);
    }
  }

  console.log('\n📊 VALIDATION SUMMARY');
  console.log('='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 All official URLs working correctly!');
    console.log('\n📝 Official URLs verified:');
      console.log('   Landing: http://localhost:5173/');
  console.log('   Practice: http://localhost:5173/practice');
    console.log('\n💡 These URLs are documented in docs/URL_CONFIGURATION.md');
  } else {
    console.log('❌ Some official URLs are not working correctly.');
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure dev server is running: npm run dev');
    console.log('   2. Check that index.html and practice.html exist at root level');
    console.log('   3. Verify Vite configuration in vite.config.js');
    console.log('   4. See docs/URL_CONFIGURATION.md for details');
    process.exit(1);
  }
}

// Handle unhandled errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error.message);
  process.exit(1);
});

main().catch(console.error); 
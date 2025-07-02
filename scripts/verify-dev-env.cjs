#!/usr/bin/env node

/**
 * Development Environment Verification Script
 * 
 * Checks that development environment complies with URL_CONFIGURATION.md protocols:
 * - Port 5173 should have active Vite server
 * - Ports 5174, 5175 should be clear (no conflicting servers)
 * - URLs should be accessible
 */

const { exec } = require('child_process');
const http = require('http');

const isWindows = process.platform === 'win32';

// Cross-platform port checking
function checkPort(port) {
  return new Promise((resolve) => {
    const cmd = isWindows 
      ? `netstat -an | findstr :${port}` 
      : `lsof -i :${port}`;
    
    exec(cmd, (error, stdout) => {
      if (error || !stdout) {
        resolve({ port, status: 'INACTIVE', output: '' });
      } else {
        const output = stdout.trim();
        const isViteServer = output.includes('vite') || output.includes('node');
        resolve({ 
          port, 
          status: 'ACTIVE', 
          output: output.split('\n')[0], // First line only
          isViteServer 
        });
      }
    });
  });
}

// Test URL accessibility
function testUrl(url) {
  return new Promise((resolve) => {
    const request = http.get(url, (res) => {
      resolve({ url, status: res.statusCode, accessible: res.statusCode === 200 });
    });

    request.on('error', () => {
      resolve({ url, status: 'ERROR', accessible: false });
    });

    request.setTimeout(3000, () => {
      request.abort();
      resolve({ url, status: 'TIMEOUT', accessible: false });
    });
  });
}

async function main() {
  console.log('🔍 DEVELOPMENT ENVIRONMENT VERIFICATION');
  console.log('Per URL_CONFIGURATION.md protocols\n');

  // Check ports
  console.log('📋 Port Status:');
  const portChecks = await Promise.all([5173, 5174, 5175].map(checkPort));
  
  let serverCompliant = true;
  let primaryServerFound = false;

  portChecks.forEach(({ port, status, output, isViteServer }) => {
    if (port === 5173) {
      if (status === 'ACTIVE' && isViteServer) {
        console.log(`✅ Port ${port}: ACTIVE (Vite development server)`);
        primaryServerFound = true;
      } else if (status === 'ACTIVE') {
        console.log(`⚠️  Port ${port}: ACTIVE (unknown process)`);
        console.log(`   ${output}`);
        serverCompliant = false;
      } else {
        console.log(`❌ Port ${port}: INACTIVE (should have Vite server)`);
        serverCompliant = false;
      }
    } else {
      // Ports 5174, 5175 should be clear
      if (status === 'ACTIVE') {
        console.log(`❌ Port ${port}: ACTIVE (should be clear)`);
        console.log(`   ${output}`);
        serverCompliant = false;
      } else {
        console.log(`✅ Port ${port}: INACTIVE (correct)`);
      }
    }
  });

  // Test URL accessibility if primary server found
  if (primaryServerFound) {
    console.log('\n📋 URL Accessibility:');
    const urlChecks = await Promise.all([
      testUrl('http://localhost:5173/'),
      testUrl('http://localhost:5173/practice')
    ]);

    urlChecks.forEach(({ url, status, accessible }) => {
      if (accessible) {
        console.log(`✅ ${url}: ACCESSIBLE (${status})`);
      } else {
        console.log(`❌ ${url}: NOT ACCESSIBLE (${status})`);
        serverCompliant = false;
      }
    });
  }

  // Final verdict
  console.log('\n📊 COMPLIANCE SUMMARY:');
  console.log('='.repeat(50));
  
  if (serverCompliant && primaryServerFound) {
    console.log('🎉 ENVIRONMENT COMPLIANT with URL_CONFIGURATION.md');
    console.log('\n✅ Development server running on correct port (5173)');
    console.log('✅ No conflicting servers detected');
    console.log('✅ Official URLs accessible');
    console.log('\n🚀 Ready for development work!');
  } else {
    console.log('❌ ENVIRONMENT NOT COMPLIANT');
    console.log('\n🔧 Required fixes:');
    
    if (!primaryServerFound) {
      console.log('   • Start development server: npm run dev');
    }
    
    if (!serverCompliant) {
      console.log('   • Kill conflicting servers: lsof -ti:5174 -ti:5175 | xargs kill -9');
      console.log('   • Restart clean: npm run dev');
    }
    
    console.log('\n📖 See docs/URL_CONFIGURATION.md for details');
    process.exit(1);
  }
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('❌ Verification error:', error.message);
  process.exit(1);
});

main().catch((error) => {
  console.error('❌ Verification failed:', error.message);
  process.exit(1);
}); 
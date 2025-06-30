// Main test runner that can be executed with Node.js or in browser
import { runUnitTests } from './unit/index.js';
import { runIntegrationTests } from './integration/index.js';
import { runAccessibilityTests } from './accessibility/index.js';
import { runPerformanceTests } from './performance/index.js';

class TestRunner {
  constructor() {
    this.results = {
      unit: null,
      integration: null,
      accessibility: null,
      performance: null
    };
  }
  async runAllTests() {
    console.log('🧪 Running comprehensive test suite...\n');
    const startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    try {
      // Run all test categories
      console.log('Running unit tests...');
      this.results.unit = await runUnitTests();
      // Only run integration and accessibility tests in browser
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        console.log('Running integration tests...');
        this.results.integration = await runIntegrationTests();
        console.log('Running accessibility tests...');
        this.results.accessibility = await runAccessibilityTests();
      } else {
        console.log('Skipping integration and accessibility tests (Node.js environment)');
      }
      console.log('Running performance tests...');
      this.results.performance = await runPerformanceTests();
      const endTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      this.generateSummaryReport(duration);
      return this.results;
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      throw error;
    }
  }
  generateSummaryReport(duration) {
    const categories = Object.keys(this.results);
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    console.log('\n📊 TEST SUMMARY REPORT');
    console.log('='.repeat(50));
    categories.forEach(category => {
      const result = this.results[category];
      if (result) {
        totalTests += result.total || 0;
        totalPassed += result.passed || 0;
        totalFailed += result.failed || 0;
        const emoji = result.failed === 0 ? '✅' : '❌';
        console.log(`${emoji} ${category.toUpperCase()}: ${result.passed}/${result.total} passed`);
      }
    });
    console.log('='.repeat(50));
    console.log(`🎯 OVERALL: ${totalPassed}/${totalTests} tests passed (${((totalPassed/totalTests)*100).toFixed(1)}%)`);
    console.log(`⏱️  Duration: ${duration}s`);
    if (totalFailed > 0) {
      console.log(`\n❌ ${totalFailed} tests failed. Check individual category results above.`);
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed!');
    }
  }
}
// Export for module use
export { TestRunner };
// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const runner = new TestRunner();
  runner.runAllTests().catch(console.error);
} 
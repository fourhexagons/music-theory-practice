// Integration test coordinator
export async function runIntegrationTests() {
  const tests = [
    {
      name: 'Learning Path Progression',
      test: testLearningPathProgression
    },
    {
      name: 'User Workflow Simulation', 
      test: testUserWorkflow
    },
    {
      name: 'Menu System Integration',
      test: testMenuSystem
    }
  ];
  let passed = 0;
  let failed = 0;
  const failures = [];
  for (const test of tests) {
    try {
      console.log(`    Testing ${test.name}...`);
      const result = await test.test();
      if (result.success) {
        passed++;
      } else {
        failed++;
        failures.push(`${test.name}: ${result.error}`);
      }
    } catch (error) {
      failed++;
      failures.push(`${test.name}: ${error.message}`);
    }
  }
  return {
    passed,
    failed,
    total: tests.length,
    failures
  };
}
// Integration test implementations
async function testLearningPathProgression() {
  try {
    if (typeof window.learningState === 'undefined') {
      return { success: false, error: 'Learning state not available' };
    }
    const originalState = { ...window.learningState };
    window.resetLearningState();
    for (let i = 0; i < 3; i++) {
      const question = window.generateQuestion();
      if (!question) {
        return { success: false, error: 'Failed to generate question' };
      }
    }
    Object.assign(window.learningState, originalState);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
async function testUserWorkflow() {
  try {
    const originalQuestion = window.learningState.currentQuestion;
    const testAnswer = '0';
    const isCorrect = window.checkAnswer(testAnswer);
    if (typeof isCorrect !== 'boolean') {
      return { success: false, error: 'Answer checking failed' };
    }
    window.learningState.currentQuestion = originalQuestion;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
async function testMenuSystem() {
  try {
    const menuButton = document.getElementById('practice-menu-button');
    const menuOverlay = document.getElementById('practice-menu-overlay');
    if (!menuButton || !menuOverlay) {
      return { success: false, error: 'Menu elements not found' };
    }
    const beforeState = menuOverlay.classList.contains('open');
    menuButton.click();
    const afterState = menuOverlay.classList.contains('open');
    if (beforeState === afterState) {
      return { success: false, error: 'Menu toggle not working' };
    }
    if (afterState) {
      menuButton.click();
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
} 
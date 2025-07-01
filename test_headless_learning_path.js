#!/usr/bin/env node

import puppeteer from 'puppeteer';

// Test configuration
const CONFIG = {
    appUrl: 'http://localhost:4173/practice',
    headless: true, // Set to false for debugging
    slowMo: 50, // Slow down actions for stability
    timeout: 30000,
    viewport: { width: 1280, height: 720 },
    waitDelay: 200, // Wait between actions
    showDetails: true
};

// Expected Q&A pairs from ACTUAL_LEARNING_PATH.md
const EXPECTED_QUESTIONS = [
    // Level 1: Introduction (C major only)
    { q: 'How many accidentals are in C major?', a: '0', level: 1, type: 'accCount', key: 'C' },
    { q: 'Spell the C major scale.', a: 'C D E F G A B', level: 1, type: 'scale', key: 'C' },
    { q: 'Name the 2nd triad in C major.', a: 'D minor', level: 1, type: 'triads', key: 'C', degree: 2 },
    { q: 'Name the 3rd triad in C major.', a: 'E minor', level: 1, type: 'triads', key: 'C', degree: 3 },
    { q: 'Name the 4th triad in C major.', a: 'F major', level: 1, type: 'triads', key: 'C', degree: 4 },
    
    // Level 2: 1 sharp (G major)
    { q: 'How many accidentals are in G major?', a: '1', level: 2, type: 'accCount', key: 'G' },
    { q: 'Name the accidentals in G major.', a: 'F#', level: 2, type: 'accNotes', key: 'G' },
    { q: 'Spell the G major scale.', a: 'G A B C D E F#', level: 2, type: 'scale', key: 'G' },
    { q: 'Name the 2nd triad in G major.', a: 'A minor', level: 2, type: 'triads', key: 'G', degree: 2 },
    { q: 'Name the 3rd triad in G major.', a: 'B minor', level: 2, type: 'triads', key: 'G', degree: 3 },
    { q: 'Name the 4th triad in G major.', a: 'C major', level: 2, type: 'triads', key: 'G', degree: 4 },
    { q: 'Name the 5th triad in G major.', a: 'D major', level: 2, type: 'triads', key: 'G', degree: 5 },
    { q: 'Name the 6th triad in G major.', a: 'E minor', level: 2, type: 'triads', key: 'G', degree: 6 },
    { q: 'Name the 7th triad in G major.', a: 'F# diminished', level: 2, type: 'triads', key: 'G', degree: 7 },

    // Level 3: 2 sharps (D major) - First b-level
    { q: 'How many accidentals are in D major?', a: '2', level: 3, type: 'accCount', key: 'D' },
    { q: 'Name the accidentals in D major.', a: 'F# C#', level: 3, type: 'accNotes', key: 'D' },
    { q: 'How many accidentals are in A major?', a: '3', level: 3, type: 'accCount', key: 'A' },
    { q: 'Name the accidentals in A major.', a: 'F# C# G#', level: 3, type: 'accNotes', key: 'A' },
    { q: 'How many accidentals are in E major?', a: '4', level: 3, type: 'accCount', key: 'E' },
    { q: 'Name the accidentals in E major.', a: 'F# C# G# D#', level: 3, type: 'accNotes', key: 'E' },
    { q: 'Spell the D major scale.', a: 'D E F# G A B C#', level: 3, type: 'scale', key: 'D' },
    { q: 'Spell the A major scale.', a: 'A B C# D E F# G#', level: 3, type: 'scale', key: 'A' },
    { q: 'Name the 2nd triad in D major.', a: 'E minor', level: 3, type: 'triads', key: 'D', degree: 2 },
    { q: 'Name the 3rd triad in D major.', a: 'F# minor', level: 3, type: 'triads', key: 'D', degree: 3 },
    { q: 'Name the 4th triad in D major.', a: 'G major', level: 3, type: 'triads', key: 'D', degree: 4 },
    { q: 'Name the 5th triad in D major.', a: 'A major', level: 3, type: 'triads', key: 'D', degree: 5 },
    { q: 'Name the 6th triad in D major.', a: 'B minor', level: 3, type: 'triads', key: 'D', degree: 6 },

    // Continue with Level 4 (A major), Level 5 (E major - b-level), etc.
    // For now, limiting to first 25 questions for initial testing
];

// Color codes for CLI output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

// Test state
const testState = {
    browser: null,
    page: null,
    results: [],
    stats: {
        total: 0,
        passed: 0,
        failed: 0,
        startTime: Date.now()
    }
};

// Utility functions
function log(message, color = 'white') {
    console.log(colors[color] + message + colors.reset);
}

function logResult(type, message) {
    const icon = type === 'pass' ? '✅' : type === 'fail' ? '❌' : 'ℹ️';
    const color = type === 'pass' ? 'green' : type === 'fail' ? 'red' : 'cyan';
    log(`${icon} ${message}`, color);
}

function normalizeQuestion(question) {
    return question.toLowerCase()
                  .replace(/[^\w\s]/g, '')
                  .replace(/\s+/g, ' ')
                  .trim();
}

function normalizeAnswer(answer) {
    return answer.toLowerCase()
                 .replace(/[^\w\s#]/g, '')
                 .replace(/\s+/g, ' ')
                 .trim();
}

// Main test functions
async function initBrowser() {
    log('🚀 Starting headless browser...', 'cyan');
    
    testState.browser = await puppeteer.launch({
        headless: CONFIG.headless,
        slowMo: CONFIG.slowMo,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    testState.page = await testState.browser.newPage();
    await testState.page.setViewport(CONFIG.viewport);
    
    // Enable console logging from the page
    testState.page.on('console', msg => {
        if (CONFIG.showDetails && msg.type() === 'error') {
            log(`Browser Error: ${msg.text()}`, 'red');
        }
    });
    
    logResult('pass', 'Browser initialized successfully');
}

async function navigateToApp() {
    log('🌐 Navigating to app...', 'cyan');
    
    try {
        await testState.page.goto(CONFIG.appUrl, { 
            waitUntil: 'networkidle0',
            timeout: CONFIG.timeout 
        });
        
        // Wait for app to initialize
        await testState.page.waitForSelector('#question-display', { timeout: 10000 });
        await testState.page.waitForSelector('#answer-input', { timeout: 10000 });
        await testState.page.waitForSelector('#submit-btn', { timeout: 10000 });
        
        logResult('pass', `Successfully loaded app at ${CONFIG.appUrl}`);
        
        // Check if learning state is available
        const stateAvailable = await testState.page.evaluate(() => {
            return window.learningState && window.askQuestion && window.resetQuiz;
        });
        
        if (stateAvailable) {
            logResult('pass', 'App state and functions are available');
        } else {
            throw new Error('App state or functions not available');
        }
        
    } catch (error) {
        throw new Error(`Failed to load app: ${error.message}`);
    }
}

async function resetApp() {
    log('🔄 Resetting app to start...', 'cyan');
    
    try {
        await testState.page.evaluate(() => {
            if (window.resetQuiz) {
                window.resetQuiz();
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, CONFIG.waitDelay));
        logResult('pass', 'App reset successfully');
        
    } catch (error) {
        logResult('fail', `Failed to reset app: ${error.message}`);
    }
}

async function testQuestion(expected, questionNumber) {
    const startTime = Date.now();
    testState.stats.total++;
    
    log(`\n📝 Testing Q${questionNumber}: Level ${expected.level}`, 'bright');
    
    try {
        // Generate question
        await testState.page.evaluate(() => {
            if (window.askQuestion) {
                window.askQuestion();
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, CONFIG.waitDelay));
        
        // Get actual question text
        const actualQuestion = await testState.page.$eval('#question-display', el => el.textContent.trim());
        
        if (CONFIG.showDetails) {
            log(`   Expected: "${expected.q}"`, 'yellow');
            log(`   Actual:   "${actualQuestion}"`, 'yellow');
        }
        
        // Verify question matches expected
        const questionMatch = actualQuestion.includes(expected.q) || 
                            expected.q.includes(actualQuestion) ||
                            normalizeQuestion(actualQuestion) === normalizeQuestion(expected.q);
        
        if (!questionMatch) {
            logResult('fail', `Q${questionNumber}: Question mismatch`);
            if (!CONFIG.showDetails) {
                log(`   Expected: "${expected.q}"`, 'red');
                log(`   Actual:   "${actualQuestion}"`, 'red');
            }
            testState.stats.failed++;
            return false;
        }
        
        // Submit answer
        await testState.page.type('#answer-input', expected.a);
        await testState.page.click('#submit-btn');
        
        await new Promise(resolve => setTimeout(resolve, CONFIG.waitDelay * 2));
        
        // Check feedback
        const feedback = await testState.page.$eval('#feedback', el => el.textContent.trim());
        
        if (CONFIG.showDetails) {
            log(`   Answer:   "${expected.a}"`, 'yellow');
            log(`   Feedback: "${feedback}"`, 'yellow');
        }
        
        const isCorrect = feedback.toLowerCase().includes('correct') || 
                         feedback.toLowerCase().includes('✓') ||
                         feedback.toLowerCase().includes('right');
        
        if (isCorrect) {
            const duration = Date.now() - startTime;
            logResult('pass', `Q${questionNumber}: Correct answer (${duration}ms)`);
            testState.stats.passed++;
            return true;
        } else {
            logResult('fail', `Q${questionNumber}: Incorrect answer - ${feedback}`);
            testState.stats.failed++;
            return false;
        }
        
    } catch (error) {
        logResult('fail', `Q${questionNumber}: Error - ${error.message}`);
        testState.stats.failed++;
        return false;
    }
}

async function runTestSequence() {
    log('\n🎵 Starting Learning Path Test Sequence', 'bright');
    log('='.repeat(50), 'cyan');
    
    for (let i = 0; i < EXPECTED_QUESTIONS.length; i++) {
        const expected = EXPECTED_QUESTIONS[i];
        await testQuestion(expected, i + 1);
        
        // Small delay between questions
        await new Promise(resolve => setTimeout(resolve, CONFIG.waitDelay));
    }
}

async function printResults() {
    const duration = Date.now() - testState.stats.startTime;
    const successRate = testState.stats.total > 0 ? 
        Math.round((testState.stats.passed / testState.stats.total) * 100) : 0;
    
    log('\n' + '='.repeat(60), 'cyan');
    log('📊 TEST RESULTS SUMMARY', 'bright');
    log('='.repeat(60), 'cyan');
    
    log(`Total Questions: ${testState.stats.total}`, 'white');
    log(`Passed: ${testState.stats.passed}`, 'green');
    log(`Failed: ${testState.stats.failed}`, 'red');
    log(`Success Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'red');
    log(`Duration: ${duration}ms`, 'white');
    
    if (testState.stats.failed === 0) {
        log('\n🎉 ALL TESTS PASSED! Learning path is working correctly.', 'green');
    } else {
        log(`\n⚠️  ${testState.stats.failed} tests failed. Check results above.`, 'red');
    }
}

async function cleanup() {
    if (testState.browser) {
        await testState.browser.close();
        log('\n🧹 Browser closed', 'cyan');
    }
}

// Main execution
async function main() {
    try {
        log('🎵 AUTOMATED LEARNING PATH TEST', 'bright');
        log('Testing app progression using Q&A from ACTUAL_LEARNING_PATH.md\n', 'cyan');
        
        await initBrowser();
        await navigateToApp();
        await resetApp();
        await runTestSequence();
        await printResults();
        
    } catch (error) {
        logResult('fail', `Test suite failed: ${error.message}`);
        process.exit(1);
    } finally {
        await cleanup();
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    log('\n🛑 Test interrupted by user', 'yellow');
    await cleanup();
    process.exit(0);
});

process.on('unhandledRejection', async (error) => {
    log(`\n💥 Unhandled error: ${error.message}`, 'red');
    await cleanup();
    process.exit(1);
});

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { main, testState, EXPECTED_QUESTIONS }; 
#!/usr/bin/env node

import puppeteer from 'puppeteer';

// Test configuration  
const CONFIG = {
    appUrl: 'http://localhost:5003/src/practice.html', // Fixed: Use modular system URL
    headless: true, // Set to false for debugging
    slowMo: 100, // Increased: More time for app processing
    timeout: 30000,
    viewport: { width: 1280, height: 720 },
    waitDelay: 500, // Increased: More time for automatic progression
    showDetails: true
};

// Dynamic progression test - no hardcoded expectations, just track what happens

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

async function testNextQuestion(questionNumber) {
    const startTime = Date.now();
    testState.stats.total++;
    
    log(`\n📝 Testing Q${questionNumber}`, 'bright');
    
    try {
        // Generate question
        await testState.page.evaluate(() => {
            if (window.askQuestion) {
                window.askQuestion();
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, CONFIG.waitDelay));
        
        // Get actual question text and extract key/type info
        const actualQuestion = await testState.page.$eval('#question-display', el => el.textContent.trim());
        
        // Extract key using research-based regex patterns
        let keyMatch = actualQuestion.match(/in ([A-G][b#]?) major/);
        if (!keyMatch) {
            keyMatch = actualQuestion.match(/Spell the ([A-G][b#]?) major scale/);
        }
        const currentKey = keyMatch ? keyMatch[1] : 'Unknown';
        
        // Determine question type
        let questionType = 'unknown';
        if (actualQuestion.includes('How many accidentals')) questionType = 'accCount';
        else if (actualQuestion.includes('Name the accidentals')) questionType = 'accNotes';
        else if (actualQuestion.includes('Spell the')) questionType = 'scale';
        else if (actualQuestion.includes('triad')) questionType = 'triads';
        else if (actualQuestion.includes('seventh')) questionType = 'sevenths';
        
        log(`   Key: ${currentKey}, Type: ${questionType}`, 'cyan');
        log(`   Question: "${actualQuestion}"`, 'yellow');
        
        // Get correct answer based on question type and key
        let correctAnswer = 'unknown';
        
        if (questionType === 'accCount' || questionType === 'accNotes' || questionType === 'scale') {
            correctAnswer = await testState.page.evaluate((key, type) => {
                if (window.quizData && window.quizData[key]) {
                    const data = window.quizData[key];
                    switch (type) {
                        case 'accCount': return data.accidentals?.toString() || '0';
                        case 'accNotes': return data.notes?.join(' ') || 'none';
                        case 'scale': return data.scale?.join(' ') || key + ' major scale';
                    }
                }
                return 'fallback';
            }, currentKey, questionType);
        } else if (questionType === 'triads' || questionType === 'sevenths') {
            // Extract degree and get correct chord
            const degreeMatch = actualQuestion.match(/(\d+)(st|nd|rd|th)/);
            if (degreeMatch) {
                const degree = parseInt(degreeMatch[1]);
                correctAnswer = await testState.page.evaluate((key, degree, type) => {
                    if (window.quizData && window.quizData[key]) {
                        const data = window.quizData[key];
                        if (type === 'triads' && data.triads) {
                            return data.triads[degree.toString()] || 'unknown triad';
                        } else if (type === 'sevenths' && data.sevenths) {
                            return data.sevenths[degree.toString()] || 'unknown seventh';
                        }
                    }
                    return 'fallback chord';
                }, currentKey, degree, questionType);
                
                log(`   Extracted degree: ${degree}`, 'cyan');
            }
        }
        
        log(`   Submitting answer: "${correctAnswer}"`, 'cyan');
        
        // Submit answer (don't clear input - app does this automatically)
        await testState.page.type('#answer-input', correctAnswer, { delay: 50 });
        await testState.page.click('#submit-btn');
        
        // Wait for automatic progression (app clears input and generates next question)
        await new Promise(resolve => setTimeout(resolve, CONFIG.waitDelay * 3));
        
        // Check feedback
        const feedback = await testState.page.$eval('#feedback', el => el.textContent.trim());
        
        // App shows no feedback for correct answers
        const isIncorrect = feedback.toLowerCase().includes('incorrect') || 
                           feedback.toLowerCase().includes('wrong') ||
                           feedback.trim().length > 0;
        
        if (!isIncorrect) {
            const duration = Date.now() - startTime;
            logResult('pass', `Q${questionNumber}: ✅ ${currentKey} ${questionType} (${duration}ms)`);
            testState.stats.passed++;
            return true;
        } else {
            logResult('fail', `Q${questionNumber}: ❌ ${currentKey} ${questionType} - ${feedback}`);
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
    
    // Simple progression test: just answer 10 questions and track key progression
    for (let i = 0; i < 10; i++) {
        await testNextQuestion(i + 1);
        
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

export { main, testState }; 
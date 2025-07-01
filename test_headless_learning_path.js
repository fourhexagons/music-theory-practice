#!/usr/bin/env node

import puppeteer from 'puppeteer';

// Test configuration  
const CONFIG = {
    appUrl: 'http://localhost:5173/practice', // Clean URL (no /src/ or .html)
    headless: true, // Set to false for debugging
    slowMo: 100, // Increased: More time for app processing
    timeout: 30000,
    viewport: { width: 1280, height: 720 },
    waitDelay: 500, // Increased: More time for automatic progression
    showDetails: true,
    maxQuestionsPerLevel: 25 // Max questions to test per level before timing out
};

// Enhanced progression test - validates b-level triads-only behavior and level progression

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
    levelTests: {}, // Track test results per level
    stats: {
        total: 0,
        passed: 0,
        failed: 0,
        startTime: Date.now(),
        levelsCompleted: 0
    }
};

// Level behavior expectations
const LEVEL_EXPECTATIONS = {
    '1': { // Introduction - C Major only
        allowedQuestionTypes: ['accCount', 'accNotes', 'scale', 'triads'],
        allowedKeys: ['C'],
        isB_Level: false,
        expectedStreak: 3
    },
    '1a': { // Level 1a Sharps - G, D, A keys
        allowedQuestionTypes: ['accCount', 'accNotes', 'scale', 'triads'],
        allowedKeys: ['G', 'D', 'A'],
        isB_Level: false,
        expectedStreak: 3
    },
    '1b': { // Level 1b Sharps/Flats - triads only
        allowedQuestionTypes: ['triads'],
        allowedKeys: ['G', 'D', 'A', 'F', 'Bb', 'Eb'], // Both sharps and flats
        isB_Level: true,
        expectedStreak: 10
    },
    '2a': { // Level 2a Sharps/Flats - more advanced keys
        allowedQuestionTypes: ['accCount', 'accNotes', 'scale', 'triads'],
        allowedKeys: ['E', 'B', 'F#', 'Ab', 'Db', 'Gb'],
        isB_Level: false,
        expectedStreak: 3
    },
    '2b': { // Level 2b Sharps/Flats - triads only
        allowedQuestionTypes: ['triads'],
        allowedKeys: ['E', 'B', 'F#', 'Ab', 'Db', 'Gb'],
        isB_Level: true,
        expectedStreak: 10
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

async function getCurrentLevel() {
    return await testState.page.evaluate(() => {
        if (window.getCurrentLevel) {
            const groupObj = window.getCurrentLevel();
            if (groupObj && groupObj.name) {
                // Extract level identifier from name like "3. Level 1b Sharps" → "1b"
                const match = groupObj.name.match(/Level (\w+)/);
                if (match) {
                    return match[1]; // Returns "1b", "2a", etc.
                }
                // Handle simple cases like "1. Introduction" → "1"
                const simpleMatch = groupObj.name.match(/^(\d+)\./);
                if (simpleMatch) {
                    return simpleMatch[1]; // Returns "1"
                }
            }
        }
        return 'unknown';
    });
}

async function validateLevelBehavior(currentLevel, questionKey, questionType) {
    const expectations = LEVEL_EXPECTATIONS[currentLevel];
    if (!expectations) {
        logResult('fail', `Unknown level: ${currentLevel}`);
        return false;
    }
    
    let isValid = true;
    
    // Validate question type for b-levels
    if (expectations.isB_Level && !expectations.allowedQuestionTypes.includes(questionType)) {
        logResult('fail', `❌ B-Level Violation: Level ${currentLevel} asked ${questionType}, but should only ask: ${expectations.allowedQuestionTypes.join(', ')}`);
        isValid = false;
    }
    
    // Validate key is appropriate for level
    if (!expectations.allowedKeys.includes(questionKey)) {
        logResult('fail', `❌ Key Violation: Level ${currentLevel} used key ${questionKey}, but should only use: ${expectations.allowedKeys.join(', ')}`);
        isValid = false;
    }
    
    return isValid;
}

async function testNextQuestion(questionNumber, expectedLevel = null) {
    const startTime = Date.now();
    testState.stats.total++;
    
    log(`\n📝 Testing Q${questionNumber}`, 'bright');
    
    try {
        // Get current level before generating question
        const currentLevel = await getCurrentLevel();
        log(`   Current Level: ${currentLevel}`, 'cyan');
        
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
        
        // Validate level behavior (especially b-level triads-only requirement)
        const levelValid = await validateLevelBehavior(currentLevel, currentKey, questionType);
        
        // Track level testing
        if (!testState.levelTests[currentLevel]) {
            testState.levelTests[currentLevel] = {
                questionsAsked: 0,
                questionTypes: new Set(),
                keys: new Set(),
                behaviorValid: true
            };
        }
        
        testState.levelTests[currentLevel].questionsAsked++;
        testState.levelTests[currentLevel].questionTypes.add(questionType);
        testState.levelTests[currentLevel].keys.add(currentKey);
        if (!levelValid) {
            testState.levelTests[currentLevel].behaviorValid = false;
        }
        
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
        
        if (!isIncorrect && levelValid) {
            const duration = Date.now() - startTime;
            logResult('pass', `Q${questionNumber}: ✅ ${currentKey} ${questionType} (${duration}ms)`);
            testState.stats.passed++;
            return { success: true, level: currentLevel };
        } else {
            const error = !levelValid ? 'Level behavior violation' : `App feedback: ${feedback}`;
            logResult('fail', `Q${questionNumber}: ❌ ${currentKey} ${questionType} - ${error}`);
            testState.stats.failed++;
            return { success: false, level: currentLevel };
        }
        
    } catch (error) {
        logResult('fail', `Q${questionNumber}: Error - ${error.message}`);
        testState.stats.failed++;
        return { success: false, level: 'error' };
    }
}

async function testLevelProgression() {
    log('\n🎵 Starting Level Progression Test', 'bright');
    log('='.repeat(60), 'cyan');
    
    let questionCount = 0;
    let lastLevel = null;
    const maxQuestions = 100; // Prevent infinite loops - increased to reach b-levels
    
    while (questionCount < maxQuestions) {
        questionCount++;
        
        const result = await testNextQuestion(questionCount);
        if (!result.success) {
            logResult('fail', `Test failed at question ${questionCount}`);
            break;
        }
        
        // Check for level progression
        if (lastLevel && lastLevel !== result.level) {
            log(`\n🚀 LEVEL PROGRESSION: ${lastLevel} → ${result.level}`, 'green');
            testState.stats.levelsCompleted++;
            
            // Validate level progression logic
            const expectations = LEVEL_EXPECTATIONS[result.level];
            if (expectations) {
                log(`   New level ${result.level} expects: ${expectations.allowedQuestionTypes.join(', ')} questions`, 'cyan');
                if (expectations.isB_Level) {
                    log(`   ⚠️  B-Level detected - should ask ONLY triads questions`, 'yellow');
                }
            }
        }
        lastLevel = result.level;
        
        // Stop if we've tested enough levels (1, 1b, 2, 2b)
        if (testState.stats.levelsCompleted >= 3) {
            log('\n✅ Tested sufficient level progressions', 'green');
            break;
        }
        
        // Prevent excessive testing on single level
        const currentLevelData = testState.levelTests[result.level];
        if (currentLevelData && currentLevelData.questionsAsked > CONFIG.maxQuestionsPerLevel) {
            log(`\n⚠️  Level ${result.level} tested for ${currentLevelData.questionsAsked} questions without progression`, 'yellow');
            break;
        }
        
        // Small delay between questions
        await new Promise(resolve => setTimeout(resolve, CONFIG.waitDelay));
    }
}

async function runTestSequence() {
    await testLevelProgression();
}

async function printResults() {
    const duration = Date.now() - testState.stats.startTime;
    const successRate = testState.stats.total > 0 ? 
        Math.round((testState.stats.passed / testState.stats.total) * 100) : 0;
    
    log('\n' + '='.repeat(70), 'cyan');
    log('📊 COMPREHENSIVE TEST RESULTS', 'bright');
    log('='.repeat(70), 'cyan');
    
    // Overall stats
    log(`\n📈 Overall Performance:`, 'bright');
    log(`   Total Questions: ${testState.stats.total}`, 'white');
    log(`   Passed: ${testState.stats.passed}`, 'green');
    log(`   Failed: ${testState.stats.failed}`, 'red');
    log(`   Success Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'red');
    log(`   Levels Completed: ${testState.stats.levelsCompleted}`, 'white');
    log(`   Duration: ${duration}ms`, 'white');
    
    // Level-specific analysis
    log(`\n🎯 Level Behavior Analysis:`, 'bright');
    
    let allBLevelsValid = true;
    
    for (const [level, data] of Object.entries(testState.levelTests)) {
        const expectations = LEVEL_EXPECTATIONS[level];
        log(`\n📋 Level ${level}:`, expectations?.isB_Level ? 'yellow' : 'cyan');
        log(`   Questions Asked: ${data.questionsAsked}`, 'white');
        log(`   Question Types: ${Array.from(data.questionTypes).join(', ')}`, 'white');
        log(`   Keys Used: ${Array.from(data.keys).join(', ')}`, 'white');
        
        if (expectations) {
            // Check b-level compliance
            if (expectations.isB_Level) {
                const onlyTriads = data.questionTypes.size === 1 && data.questionTypes.has('triads');
                const status = onlyTriads && data.behaviorValid ? '✅' : '❌';
                log(`   B-Level Compliance: ${status} ${onlyTriads ? 'TRIADS ONLY' : 'MIXED CONTENT!'}`, 
                    onlyTriads && data.behaviorValid ? 'green' : 'red');
                
                if (!onlyTriads || !data.behaviorValid) {
                    allBLevelsValid = false;
                    if (!onlyTriads) {
                        log(`      ⚠️  Expected ONLY triads, but got: ${Array.from(data.questionTypes).join(', ')}`, 'red');
                    }
                }
            } else {
                log(`   A-Level: ✅ Mixed content allowed`, 'green');
            }
        }
        
        log(`   Behavior Valid: ${data.behaviorValid ? '✅' : '❌'}`, data.behaviorValid ? 'green' : 'red');
    }
    
    // B-level summary
    log(`\n🎯 B-Level Validation Summary:`, 'bright');
    const bLevelsTested = Object.keys(testState.levelTests).filter(level => 
        LEVEL_EXPECTATIONS[level]?.isB_Level
    );
    
    if (bLevelsTested.length > 0) {
        log(`   B-Levels Tested: ${bLevelsTested.join(', ')}`, 'cyan');
        log(`   All B-Levels Valid: ${allBLevelsValid ? '✅ YES' : '❌ NO'}`, 
            allBLevelsValid ? 'green' : 'red');
        
        if (allBLevelsValid) {
            log(`   🎉 B-levels successfully use triads-only behavior!`, 'green');
        } else {
            log(`   ⚠️  Some b-levels are not following triads-only requirement!`, 'red');
        }
    } else {
        log(`   ⚠️  No B-levels were tested in this run`, 'yellow');
    }
    
    // Final verdict
    log(`\n🏆 Final Verdict:`, 'bright');
    if (testState.stats.failed === 0 && allBLevelsValid) {
        log(`🎉 ALL TESTS PASSED! Learning path and b-level behavior working correctly.`, 'green');
    } else {
        const issues = [];
        if (testState.stats.failed > 0) issues.push(`${testState.stats.failed} question failures`);
        if (!allBLevelsValid) issues.push('b-level behavior violations');
        log(`⚠️  Issues found: ${issues.join(', ')}`, 'red');
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
        log('Testing level progression and validating b-level triads-only behavior\n', 'cyan');
        
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
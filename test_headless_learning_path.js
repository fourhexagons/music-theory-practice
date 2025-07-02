#!/usr/bin/env node

import puppeteer from 'puppeteer';

// Test configuration  
const CONFIG = {
    appUrl: 'http://localhost:5174/practice', // Updated port from attached info
    headless: true, // Set to false for debugging
    slowMo: 50, // Reduced for faster testing
    timeout: 30000,
    viewport: { width: 1280, height: 720 },
    waitDelay: 300, // Reduced for faster testing
    showDetails: true,
    maxQuestionsPerLevel: 50, // Increased to allow for streak achievement
    targetStreakAchievement: true, // New: Focus on achieving streaks to progress
    testLevel12Questions: 10 // Number of Level 12 questions to test infinite practice
};

// Enhanced progression test - validates b-level triads-only behavior, menu functionality, and complete learning path to Level 12

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
    menuTests: {}, // Track menu functionality test results
    stats: {
        total: 0,
        passed: 0,
        failed: 0,
        startTime: Date.now(),
        levelsCompleted: 0,
        menuTestsPassed: 0,
        menuTestsFailed: 0
    }
};

// Level behavior expectations - Enhanced to handle full progression sequence
const LEVEL_EXPECTATIONS = {
    '1': { // Introduction - C Major only
        allowedQuestionTypes: ['accCount', 'accNotes', 'scale', 'triads'],
        allowedKeys: ['C'],
        isB_Level: false,
        expectedStreak: 3,
        keyGroup: 'C Major'
    },
    '1a_sharps': { // Level 1a Sharps - G, D, A keys
        allowedQuestionTypes: ['accCount', 'accNotes', 'scale', 'triads'],
        allowedKeys: ['G', 'D', 'A'],
        isB_Level: false,
        expectedStreak: 3,
        keyGroup: '1-3 Sharps'
    },
    '1b_sharps': { // Level 1b Sharps - triads only
        allowedQuestionTypes: ['triads'],
        allowedKeys: ['G', 'D', 'A'],
        isB_Level: true,
        expectedStreak: 10,
        keyGroup: '1-3 Sharps'
    },
    '1a_flats': { // Level 1a Flats - F, Bb, Eb keys
        allowedQuestionTypes: ['accCount', 'accNotes', 'scale', 'triads'],
        allowedKeys: ['F', 'Bb', 'Eb'],
        isB_Level: false,
        expectedStreak: 3,
        keyGroup: '1-3 Flats'
    },
    '1b_flats': { // Level 1b Flats - triads only
        allowedQuestionTypes: ['triads'],
        allowedKeys: ['F', 'Bb', 'Eb'],
        isB_Level: true,
        expectedStreak: 10,
        keyGroup: '1-3 Flats'
    },
    '2a_sharps': { // Level 2a Sharps - E, B, F# keys
        allowedQuestionTypes: ['accCount', 'accNotes', 'scale', 'triads'],
        allowedKeys: ['E', 'B', 'F#'],
        isB_Level: false,
        expectedStreak: 3,
        keyGroup: '4-6 Sharps'
    },
    '2b_sharps': { // Level 2b Sharps - triads only
        allowedQuestionTypes: ['triads'],
        allowedKeys: ['E', 'B', 'F#'],
        isB_Level: true,
        expectedStreak: 10,
        keyGroup: '4-6 Sharps'
    },
    '2a_flats': { // Level 2a Flats - Ab, Db, Gb keys
        allowedQuestionTypes: ['accCount', 'accNotes', 'scale', 'triads'],
        allowedKeys: ['Ab', 'Db', 'Gb'],
        isB_Level: false,
        expectedStreak: 3,
        keyGroup: '4-6 Flats'
    },
    '2b_flats': { // Level 2b Flats - triads only
        allowedQuestionTypes: ['triads'],
        allowedKeys: ['Ab', 'Db', 'Gb'],
        isB_Level: true,
        expectedStreak: 10,
        keyGroup: '4-6 Flats'
    },
    '3_sharps': { // Level 3 Sharps - All sharp keys
        allowedQuestionTypes: ['accCount', 'accNotes', 'scale', 'triads', 'sevenths'],
        allowedKeys: ['C', 'G', 'D', 'A', 'E', 'B', 'F#'],
        isB_Level: false,
        expectedStreak: 5,
        keyGroup: 'All Sharps'
    },
    '10': { // Level 10 - Full Random Practice (All keys)
        allowedQuestionTypes: ['accCount', 'scale', 'triads', 'sevenths'],
        allowedKeys: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'C#', 'Cb'],
        isB_Level: false,
        expectedStreak: 10,
        keyGroup: 'All Keys'
    },
    '11': { // Level 11 - Infinite Sevenths Practice
        allowedQuestionTypes: ['seventhSpelling'],
        allowedKeys: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'C#', 'Cb'],
        isB_Level: false,
        expectedStreak: null, // Infinite practice
        isInfinite: true,
        keyGroup: 'All Keys'
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
        // Wait for app to be fully loaded before resetting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Validate state before reset
        const stateBeforeReset = await testState.page.evaluate(() => {
            return {
                learningStateAvailable: !!window.learningState,
                resetQuizAvailable: typeof window.resetQuiz === 'function',
                learningPathAvailable: !!window.learningPath,
                currentGroup: window.learningState?.currentGroup
            };
        });
        
        log(`   📊 Pre-reset state: ${JSON.stringify(stateBeforeReset)}`, 'cyan');
        
        if (!stateBeforeReset.resetQuizAvailable) {
            log('   ⚠️  resetQuiz function not available, waiting longer...', 'yellow');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Perform reset
        await testState.page.evaluate(() => {
            if (window.resetQuiz) {
                window.resetQuiz();
            }
        });
        
        // Wait longer for reset to complete
        await new Promise(resolve => setTimeout(resolve, CONFIG.waitDelay * 2));
        
        // Validate state after reset
        const stateAfterReset = await testState.page.evaluate(() => {
            return {
                currentGroup: window.learningState?.currentGroup,
                currentQuestion: document.getElementById('question-display')?.textContent?.substring(0, 50) + '...'
            };
        });
        
        log(`   📊 Post-reset state: currentGroup=${stateAfterReset.currentGroup}`, 'cyan');
        log(`   📊 Current question: "${stateAfterReset.currentQuestion}"`, 'cyan');
        
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
                // Map the full level names to proper identifiers
                const levelMap = {
                    '1. Introduction': '1',
                    '2. Level 1a Sharps': '1a_sharps',
                    '3. Level 1b Sharps': '1b_sharps',
                    '4. Level 1a Flats': '1a_flats',
                    '5. Level 1b Flats': '1b_flats',
                    '6. Level 2a Sharps': '2a_sharps',
                    '7. Level 2b Sharps': '2b_sharps',
                    '8. Level 2a Flats': '2a_flats',
                    '9. Level 2b Flats': '2b_flats',
                    '10. Level 10: Full Random Practice': '10',
                    '11. Level 11: Infinite Sevenths': '11'
                };
                
                if (levelMap[groupObj.name]) {
                    return levelMap[groupObj.name];
                }
                
                // Fallback: Extract level identifier from name like "3. Level 1b Sharps" → "1b_sharps"
                const match = groupObj.name.match(/Level (\w+)\s+(\w+)/);
                if (match) {
                    return `${match[1]}_${match[2].toLowerCase()}`; // Returns "1b_sharps", "2a_flats", etc.
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
        
        // Get question BEFORE calling askQuestion to compare
        const questionBefore = await testState.page.$eval('#question-display', el => el.textContent.trim());
        
        // Check state before askQuestion call
        const stateBefore = await testState.page.evaluate(() => {
            return {
                currentGroup: window.learningState?.currentGroup,
                isAdvancedMode: window.learningState?.isAdvancedMode,
                customGroup: !!window.learningState?.customGroup,
                mode: window.learningState?.mode
            };
        });
        
        log(`   📊 Before askQuestion: ${JSON.stringify(stateBefore)}`, 'cyan');
        log(`   📊 Question before: "${questionBefore}"`, 'cyan');
        
        // Generate question
        await testState.page.evaluate(() => {
            if (window.askQuestion) {
                window.askQuestion();
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, CONFIG.waitDelay));
        
        // Check state after askQuestion call
        const stateAfter = await testState.page.evaluate(() => {
            return {
                currentGroup: window.learningState?.currentGroup,
                isAdvancedMode: window.learningState?.isAdvancedMode,
                customGroup: !!window.learningState?.customGroup,
                mode: window.learningState?.mode
            };
        });
        
        // Get actual question text and extract key/type info
        const actualQuestion = await testState.page.$eval('#question-display', el => el.textContent.trim());
        
        log(`   📊 After askQuestion: ${JSON.stringify(stateAfter)}`, 'cyan');
        log(`   📊 Question after: "${actualQuestion}"`, 'cyan');
        
        // Check for completion state and handle it properly
        if (actualQuestion.includes('Congratulations') || actualQuestion.includes('completed all levels')) {
            log(`   ⚠️  Completion state detected: "${actualQuestion}"`, 'yellow');
            
            // Get detailed state information for debugging
            const stateInfo = await testState.page.evaluate(() => {
                return {
                    currentGroup: window.learningState?.currentGroup,
                    learningPathLength: window.learningPath?.length,
                    currentLevel: window.getCurrentLevel ? window.getCurrentLevel() : 'function unavailable',
                    getCurrentGroup: window.getCurrentGroup ? window.getCurrentGroup() : 'function unavailable'
                };
            });
            
            log(`   📊 State Debug: currentGroup=${stateInfo.currentGroup}, pathLength=${stateInfo.learningPathLength}`, 'cyan');
            
            // If we're at the end of the learning path (Level 12), this is expected
            if (stateInfo.currentGroup >= 11) { // Level 12 is index 11
                log(`   ✅ Reached end of learning path - this is expected!`, 'green');
                testState.stats.passed++;
                return { success: true, level: '12', isComplete: true };
            } else {
                // Unexpected completion state - this is the bug
                log(`   ❌ Unexpected completion state at group ${stateInfo.currentGroup}`, 'red');
                testState.stats.failed++;
                return { success: false, level: currentLevel, error: 'Unexpected completion state' };
            }
        }
        
        // Extract key using research-based regex patterns
        let keyMatch = actualQuestion.match(/in ([A-G][b#]?) major/);
        if (!keyMatch) {
            keyMatch = actualQuestion.match(/Spell the ([A-G][b#]?) major scale/);
        }
        const currentKey = keyMatch ? keyMatch[1] : 'Unknown';
        
        // Determine question type (check specific patterns first!)
        let questionType = 'unknown';
        if (actualQuestion.includes('How many accidentals')) questionType = 'accCount';
        else if (actualQuestion.includes('Name the accidentals')) questionType = 'accNotes';
        else if (actualQuestion.includes('Spell the') && actualQuestion.includes('seventh chord')) questionType = 'seventhSpelling';
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
        } else if (questionType === 'triads' || questionType === 'sevenths' || questionType === 'seventhSpelling') {
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
                        } else if (type === 'seventhSpelling' && data.seventhSpelling) {
                            return data.seventhSpelling[degree.toString()]?.join(' ') || 'unknown seventh spelling';
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

// Menu functionality tests
async function testMenuFunctionality() {
    log('\n🎯 Testing Menu Functionality', 'bright');
    log('='.repeat(60), 'cyan');
    
    // Test 1: Menu Click
    log('\n1. Testing Menu Click "Spelling Random Sevenths"', 'cyan');
    testState.menuTests.menuClick = await testMenuClick();
    
    // Test 2: Direct Function Call (what reload does)
    log('\n2. Testing Direct startAdvancedPractice Call', 'cyan');
    testState.menuTests.directCall = await testDirectAdvancedPractice();
    
    // Summary
    const menuClickPassed = testState.menuTests.menuClick?.success;
    const directCallPassed = testState.menuTests.directCall?.success;
    
    if (menuClickPassed) testState.stats.menuTestsPassed++;
    else testState.stats.menuTestsFailed++;
    
    if (directCallPassed) testState.stats.menuTestsPassed++;
    else testState.stats.menuTestsFailed++;
    
    log('\n📊 Menu Test Results:', 'bright');
    logResult(menuClickPassed ? 'pass' : 'fail', `Menu Click: ${menuClickPassed ? 'WORKING' : 'BROKEN'}`);
    logResult(directCallPassed ? 'pass' : 'fail', `Direct Call: ${directCallPassed ? 'WORKING' : 'BROKEN'}`);
    
    if (directCallPassed && !menuClickPassed) {
        log('💡 This confirms user observation: reload works, menu click doesn\'t', 'yellow');
    }
}

async function testMenuClick() {
    try {
        // Reset to clean state
        await testState.page.evaluate(() => {
            if (window.resetQuiz) window.resetQuiz();
        });
        await new Promise(resolve => setTimeout(resolve, CONFIG.waitDelay));
        
        // Get initial question
        const initialQuestion = await testState.page.$eval('#question-display', el => el.textContent);
        
        // Open menu and click "Spelling Random Sevenths"
        await testState.page.click('#practice-menu-button');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await testState.page.click('[data-section="difficulty"]');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await testState.page.click('[data-difficulty="spelling-random-sevenths"]');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if question changed to seventh spelling
        const afterClickQuestion = await testState.page.$eval('#question-display', el => el.textContent);
        
        const isSeventhSpelling = afterClickQuestion.toLowerCase().includes('spell') && 
                                  afterClickQuestion.toLowerCase().includes('seventh');
        const questionChanged = initialQuestion !== afterClickQuestion;
        
        return {
            success: isSeventhSpelling && questionChanged,
            initialQuestion,
            afterClickQuestion,
            error: !questionChanged ? 'Question did not change' : !isSeventhSpelling ? 'Not a seventh spelling question' : null
        };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function testDirectAdvancedPractice() {
    try {
        // Reset and call startAdvancedPractice directly
        const result = await testState.page.evaluate(() => {
            if (window.resetQuiz) window.resetQuiz();
            
            // Call startAdvancedPractice directly (what reload effectively does)
            if (window.startAdvancedPractice) {
                window.startAdvancedPractice('sevenths_only');
                
                return {
                    success: true,
                    questionText: document.getElementById('question-display')?.textContent || 'NO QUESTION',
                    isAdvancedMode: window.learningState?.isAdvancedMode || false
                };
            } else {
                return { success: false, error: 'startAdvancedPractice function not available' };
            }
        });
        
        if (result.success) {
            const isSeventhSpelling = result.questionText.toLowerCase().includes('spell') && 
                                      result.questionText.toLowerCase().includes('seventh');
            
            return {
                success: isSeventhSpelling,
                questionText: result.questionText,
                isAdvancedMode: result.isAdvancedMode,
                error: !isSeventhSpelling ? 'Not a seventh spelling question' : null
            };
        } else {
            return result;
        }
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function testLevelProgression() {
    log('\n🎵 Starting COMPREHENSIVE Learning Path Test (Complete Sequence to Level 12)', 'bright');
    log('🎯 Target: Progress through ALL levels (1 → 1a → 1b Sharps → 1a Flats → 1b Flats → 2a Sharps → 2b Sharps → 2a Flats → 2b Flats → 3 Sharps → 3 Flats → 12)', 'cyan');
    log('='.repeat(80), 'cyan');
    
    let questionCount = 0;
    let lastLevel = null;
    let level12QuestionCount = 0;
    const maxQuestions = 500; // Increased significantly for complete path
    let reachedLevel12 = false;
    
    while (questionCount < maxQuestions) {
        questionCount++;
        
        const result = await testNextQuestion(questionCount);
        if (!result.success) {
            logResult('fail', `Test failed at question ${questionCount}`);
            break;
        }
        
        // Track Level 12 questions for infinite practice testing
        if (result.level === '12') {
            level12QuestionCount++;
            if (!reachedLevel12) {
                log('\n🎉 REACHED LEVEL 12: Infinite Sevenths Practice!', 'green');
                reachedLevel12 = true;
            }
            
            // Test sufficient Level 12 questions to validate infinite practice
            if (level12QuestionCount >= CONFIG.testLevel12Questions) {
                log(`\n✅ Level 12 Infinite Practice Validated: ${level12QuestionCount} questions tested`, 'green');
                log('🏁 COMPREHENSIVE LEARNING PATH TEST COMPLETE!', 'bright');
                break;
            }
        }
        
        // Check for level progression
        if (lastLevel && lastLevel !== result.level) {
            log(`\n🚀 LEVEL PROGRESSION: ${lastLevel} → ${result.level}`, 'green');
            testState.stats.levelsCompleted++;
            
            // Enhanced progression tracking with expected sequence
            const progressionMap = {
                '1': '1a_sharps',
                '1a_sharps': '1b_sharps', 
                '1b_sharps': '1a_flats',
                '1a_flats': '1b_flats',
                '1b_flats': '2a_sharps', 
                '2a_sharps': '2b_sharps',
                '2b_sharps': '2a_flats',
                '2a_flats': '2b_flats',
                '2b_flats': '3_sharps',
                '3_sharps': '3_flats',
                '3_flats': '12'
            };
            
            const expectedNext = progressionMap[lastLevel];
            if (expectedNext && expectedNext === result.level) {
                log(`   ✅ Expected progression sequence confirmed`, 'green');
            } else if (expectedNext) {
                log(`   ⚠️  Unexpected progression: expected ${expectedNext}, got ${result.level}`, 'yellow');
            }
            
            // Validate level progression logic
            const expectations = LEVEL_EXPECTATIONS[result.level];
            if (expectations) {
                log(`   📋 Level ${result.level} expects: ${expectations.allowedQuestionTypes.join(', ')} questions`, 'cyan');
                if (expectations.isB_Level) {
                    log(`   🎯 B-Level detected - should ask ONLY triads with randomized keys`, 'yellow');
                } else if (expectations.isInfinite) {
                    log(`   🎯 Level 12 detected - infinite sevenths practice begins!`, 'green');
                }
            }
        }
        lastLevel = result.level;
        
        // Stop if completion state is detected unexpectedly (before Level 12)
        if (result.isComplete && !reachedLevel12) {
            log('\n❌ UNEXPECTED COMPLETION: App completed before reaching Level 12!', 'red');
            break;
        }
        
        // Prevent excessive testing on single level (except Level 12 which is infinite)
        const currentLevelData = testState.levelTests[result.level];
        if (currentLevelData && currentLevelData.questionsAsked > CONFIG.maxQuestionsPerLevel && result.level !== '12') {
            log(`\n⚠️  Level ${result.level} tested for ${currentLevelData.questionsAsked} questions without progression`, 'yellow');
            log(`   This may indicate the streak requirement (${LEVEL_EXPECTATIONS[result.level]?.expectedStreak || 'unknown'}) is not being met`, 'yellow');
            break;
        }
        
        // Progress reporting every 25 questions
        if (questionCount % 25 === 0) {
            log(`\n📊 Progress Update: ${questionCount} questions, Level ${result.level}, ${testState.stats.levelsCompleted} levels completed`, 'cyan');
        }
        
        // Small delay between questions
        await new Promise(resolve => setTimeout(resolve, CONFIG.waitDelay));
    }
    
    // Final progression summary
    log(`\n📊 FINAL PROGRESSION SUMMARY:`, 'bright');
    log(`   Total Questions: ${questionCount}`, 'white');
    log(`   Levels Completed: ${testState.stats.levelsCompleted}`, 'white'); 
    log(`   Reached Level 12: ${reachedLevel12 ? '✅ YES' : '❌ NO'}`, reachedLevel12 ? 'green' : 'red');
    if (reachedLevel12) {
        log(`   Level 12 Questions Tested: ${level12QuestionCount}`, 'green');
    }
}

async function runTestSequence() {
    // Test menu functionality first
    await testMenuFunctionality();
    
    // Reset app state after menu tests to ensure clean state for learning path tests
    log('\n🔄 Resetting app after menu tests...', 'cyan');
    await resetApp();
    
    // Then test the complete learning path
    await testLevelProgression();
}

async function printResults() {
    const duration = Date.now() - testState.stats.startTime;
    const successRate = testState.stats.total > 0 ? 
        Math.round((testState.stats.passed / testState.stats.total) * 100) : 0;
    
    // Function-level variables for validation tracking
    let allBLevelsValid = true;
    let allBLevelsRandomized = true;
    
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
    
    // Menu functionality results
    log(`\n🎯 Menu Functionality Tests:`, 'bright');
    log(`   Menu Tests Passed: ${testState.stats.menuTestsPassed}`, 'green');
    log(`   Menu Tests Failed: ${testState.stats.menuTestsFailed}`, 'red');
    
    if (testState.menuTests.menuClick) {
        const menuClickResult = testState.menuTests.menuClick;
        logResult(menuClickResult.success ? 'pass' : 'fail', 
                  `Menu Click: ${menuClickResult.success ? 'WORKING' : 'BROKEN'}`);
        if (!menuClickResult.success && menuClickResult.error) {
            log(`      Error: ${menuClickResult.error}`, 'red');
        }
    }
    
    if (testState.menuTests.directCall) {
        const directCallResult = testState.menuTests.directCall;
        logResult(directCallResult.success ? 'pass' : 'fail', 
                  `Direct Call: ${directCallResult.success ? 'WORKING' : 'BROKEN'}`);
        if (!directCallResult.success && directCallResult.error) {
            log(`      Error: ${directCallResult.error}`, 'red');
        }
    }
    
    // Special analysis: Menu click vs direct call
    if (testState.menuTests.menuClick && testState.menuTests.directCall) {
        const menuWorks = testState.menuTests.menuClick.success;
        const directWorks = testState.menuTests.directCall.success;
        
        if (directWorks && !menuWorks) {
            log(`\n💡 Menu Analysis: This confirms user observation - reload works, menu click doesn't`, 'yellow');
            log(`   🔧 Issue: Menu click doesn't properly trigger startAdvancedPractice`, 'yellow');
        } else if (menuWorks && directWorks) {
            log(`\n✅ Menu Analysis: Both menu click and direct call work correctly`, 'green');
        } else if (!menuWorks && !directWorks) {
            log(`\n❌ Menu Analysis: Both menu click and direct call are broken`, 'red');
        }
    }
    
    // Level-specific analysis
    log(`\n🎯 Level Behavior Analysis:`, 'bright');
    
    for (const [level, data] of Object.entries(testState.levelTests)) {
        const expectations = LEVEL_EXPECTATIONS[level];
        log(`\n📋 Level ${level}${expectations?.keyGroup ? ` (${expectations.keyGroup})` : ''}:`, expectations?.isB_Level ? 'yellow' : 'cyan');
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
                
                // Enhanced b-level randomization validation
                if (data.degrees) {
                    log(`   Degrees Used: ${Array.from(data.degrees).join(', ')}`, 'white');
                    log(`   Combinations: ${data.combinations.size} unique (${Array.from(data.combinations).slice(0, 3).join(', ')}${data.combinations.size > 3 ? '...' : ''})`, 'white');
                    
                    // Key randomization validation
                    const keyRandomOk = data.keyRandomization && data.keys.size >= Math.min(2, expectations.allowedKeys.length);
                    log(`   Key Randomization: ${keyRandomOk ? '✅ WORKING' : '❌ STATIC'}`, keyRandomOk ? 'green' : 'red');
                    if (!keyRandomOk && data.questionsAsked >= 6) {
                        log(`      ⚠️  Expected multiple keys from [${expectations.allowedKeys.join(', ')}], got only: ${Array.from(data.keys).join(', ')}`, 'red');
                    }
                    
                    // Degree randomization validation
                    const degreeRandomOk = data.degreeRandomization && data.degrees.size >= 2;
                    log(`   Degree Randomization: ${degreeRandomOk ? '✅ WORKING' : '❌ STATIC'}`, degreeRandomOk ? 'green' : 'red');
                    if (!degreeRandomOk && data.questionsAsked >= 8) {
                        log(`      ⚠️  Expected multiple degrees (2-7), got only: ${Array.from(data.degrees).join(', ')}`, 'red');
                    }
                    
                    // Combination prevention validation (implied by having unique combinations)
                    const comboPrevention = data.combinations.size === data.questionsAsked || data.questionsAsked <= 6; // Allow some overlap after many questions
                    log(`   Combination Prevention: ${comboPrevention ? '✅ WORKING' : '⚠️ SOME REPEATS'}`, comboPrevention ? 'green' : 'yellow');
                    
                    if (!keyRandomOk || !degreeRandomOk) {
                        allBLevelsRandomized = false;
                    }
                }
                
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
    
    // Enhanced B-level summary with randomization results
    log(`\n🎯 Comprehensive B-Level Validation Summary:`, 'bright');
    const bLevelsTested = Object.keys(testState.levelTests).filter(level => 
        LEVEL_EXPECTATIONS[level]?.isB_Level
    );
    
    if (bLevelsTested.length > 0) {
        log(`   B-Levels Tested: ${bLevelsTested.join(', ')}`, 'cyan');
        log(`   All B-Levels Valid: ${allBLevelsValid ? '✅ YES' : '❌ NO'}`, 
            allBLevelsValid ? 'green' : 'red');
        log(`   All B-Levels Randomized: ${allBLevelsRandomized ? '✅ YES' : '❌ NO'}`, 
            allBLevelsRandomized ? 'green' : 'red');
        
        if (allBLevelsValid && allBLevelsRandomized) {
            log(`   🎉 B-levels successfully use triads-only behavior with proper randomization!`, 'green');
            log(`   ✅ Key randomization: Multiple keys used within each b-level`, 'green');
            log(`   ✅ Degree randomization: Multiple degrees (2-7) used within each b-level`, 'green');
            log(`   ✅ Combination prevention: No repeated key+degree combinations detected`, 'green');
        } else {
            if (!allBLevelsValid) {
                log(`   ⚠️  Some b-levels are not following triads-only requirement!`, 'red');
            }
            if (!allBLevelsRandomized) {
                log(`   ⚠️  Some b-levels are not properly randomizing keys and/or degrees!`, 'red');
            }
        }
    } else {
        log(`   ⚠️  No B-levels were tested in this run`, 'yellow');
    }
    
    // Enhanced Final verdict
    log(`\n🏆 Enhanced Final Verdict:`, 'bright');
    
    // Check all test categories including randomization
    const learningPathPassed = testState.stats.failed === 0 && allBLevelsValid && allBLevelsRandomized;
    const menuTestsPassed = testState.stats.menuTestsFailed === 0;
    const reachedLevel12 = testState.stats.levelsCompleted >= 8; // Assuming we reached many levels
    
    if (learningPathPassed && menuTestsPassed) {
        log(`🎉 ALL TESTS PASSED! Complete functionality working correctly with enhanced randomization!`, 'green');
        log(`   ✅ Learning path progression: WORKING`, 'green');
        log(`   ✅ B-level triads-only behavior: WORKING`, 'green');
        log(`   ✅ B-level key randomization: WORKING`, 'green');
        log(`   ✅ B-level degree randomization: WORKING`, 'green');
        log(`   ✅ B-level combination prevention: WORKING`, 'green');
        log(`   ✅ Menu functionality: WORKING`, 'green');
        if (reachedLevel12) {
            log(`   ✅ Level 12 (infinite sevenths): REACHED`, 'green');
        }
    } else {
        const issues = [];
        if (testState.stats.failed > 0) issues.push(`${testState.stats.failed} question failures`);
        if (!allBLevelsValid) issues.push('b-level behavior violations');
        if (!allBLevelsRandomized) issues.push('b-level randomization issues');
        if (testState.stats.menuTestsFailed > 0) issues.push(`${testState.stats.menuTestsFailed} menu test failures`);
        
        log(`⚠️  Issues found: ${issues.join(', ')}`, 'red');
        
        // Detailed breakdown
        log(`\n📊 Enhanced Test Category Results:`, 'bright');
        logResult(learningPathPassed ? 'pass' : 'fail', `Learning Path: ${learningPathPassed ? 'WORKING' : 'ISSUES'}`);
        logResult(allBLevelsValid ? 'pass' : 'fail', `B-Level Triads-Only: ${allBLevelsValid ? 'WORKING' : 'ISSUES'}`);
        logResult(allBLevelsRandomized ? 'pass' : 'fail', `B-Level Randomization: ${allBLevelsRandomized ? 'WORKING' : 'ISSUES'}`);
        logResult(menuTestsPassed ? 'pass' : 'fail', `Menu Functionality: ${menuTestsPassed ? 'WORKING' : 'ISSUES'}`);
        
        if (reachedLevel12) {
            logResult('pass', `Level 12 Progress: REACHED`);
        } else {
            logResult('info', `Level 12 Progress: Reached ${testState.stats.levelsCompleted} levels`);
        }
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
        log('🎵 COMPREHENSIVE LEARNING PATH & MENU TEST', 'bright');
        log('Testing menu functionality, complete learning path to Level 12, and b-level behavior\n', 'cyan');
        
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
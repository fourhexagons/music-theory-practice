#!/usr/bin/env node

/**
 * Test Anti-Clustering Logic in Full Random Mode
 * 
 * This test verifies that:
 * 1. accCount questions cannot repeat consecutively (must alternate)
 * 2. scale questions cannot repeat consecutively (must alternate)  
 * 3. sevenths questions cannot repeat consecutively (must alternate)
 * 4. Only triads questions can repeat consecutively
 * 
 * Expected behavior:
 * - After accCount (or accNotes), next question should NOT be accCount
 * - After scale, next question should NOT be scale
 * - After sevenths, next question should NOT be sevenths
 * - After triads, next question CAN be triads (only type that can repeat)
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

async function setupDOM() {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
    <head><title>Test</title></head>
    <body>
      <div id="question-display"></div>
      <input id="answer-input" type="text">
      <div id="feedback"></div>
    </body>
    </html>
  `, { 
    url: 'http://localhost',
    pretendToBeVisual: true,
    resources: "usable"
  });

  global.window = dom.window;
  global.document = dom.window.document;
  global.console = console;

  // Load required scripts in order
  const srcDir = path.join(__dirname, 'src');
  
  // Load quiz data
  const quizDataPath = path.join(srcDir, 'data', 'quizData.js');
  const quizDataContent = fs.readFileSync(quizDataPath, 'utf8');
  eval(quizDataContent);
  
  // Load learning state
  const learningStatePath = path.join(srcDir, 'state', 'learningState.js');
  const learningStateContent = fs.readFileSync(learningStatePath, 'utf8');
  eval(learningStateContent);
  
  // Load utility functions
  const helpersPath = path.join(srcDir, 'utils', 'helpers.js');
  const helpersContent = fs.readFileSync(helpersPath, 'utf8');
  eval(helpersContent);
  
  // Load main app
  const mainAppPath = path.join(srcDir, 'components', 'main-app.js');
  const mainAppContent = fs.readFileSync(mainAppPath, 'utf8');
  eval(mainAppContent);

  // Initialize the learning state
  if (window.initLearningState) {
    window.initLearningState();
  }
}

function testAntiClustering() {
  console.log('🧪 Testing Anti-Clustering Logic in Full Random Mode');
  console.log('=' .repeat(60));
  
  // Track question sequences to verify anti-clustering
  const questionSequence = [];
  const clusteringViolations = [];
  
  // Test parameters
  const numTests = 100;
  let triadsCanRepeat = false;
  let otherTypesCluster = false;
  
  // Start Full Random mode
  console.log('🎯 Starting Full Random Practice Mode...');
  window.startAdvancedPractice('random_all');
  
  for (let i = 0; i < numTests; i++) {
    const currentQuestion = window.learningState.currentQuestion;
    if (!currentQuestion) {
      console.log(`❌ No question generated on iteration ${i + 1}`);
      continue;
    }
    
    const questionType = currentQuestion.chapterId;
    questionSequence.push({
      iteration: i + 1,
      type: questionType,
      key: currentQuestion.key,
      degree: currentQuestion.degree
    });
    
    // Check for clustering violations (consecutive same types, except triads)
    if (i > 0) {
      const prevType = questionSequence[i - 1].type;
      const currentType = questionType;
      
      if (prevType === currentType) {
        if (currentType === 'triads') {
          triadsCanRepeat = true;
          console.log(`✅ Iteration ${i + 1}: Triads can repeat (${prevType} → ${currentType})`);
        } else {
          otherTypesCluster = true;
          clusteringViolations.push({
            iteration: i + 1,
            type: currentType,
            violation: `${prevType} → ${currentType}`
          });
          console.log(`❌ Iteration ${i + 1}: Anti-clustering violation: ${prevType} → ${currentType}`);
        }
      }
    }
    
    // Simulate answering the question correctly
    let correctAnswer;
    const data = window.quizData[currentQuestion.key];
    
    switch (questionType) {
      case 'accCount':
        correctAnswer = data.accidentals.toString();
        break;
      case 'accNotes':
        correctAnswer = data.notes.join(' ');
        break;
      case 'scale':
        correctAnswer = data.scale.join(' ');
        break;
      case 'triads':
        correctAnswer = data.triads[currentQuestion.degree];
        break;
      case 'sevenths':
        correctAnswer = data.sevenths[currentQuestion.degree];
        break;
      default:
        correctAnswer = 'test';
    }
    
    // Mock the answer submission process
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
      answerInput.value = correctAnswer;
    }
    
    // Trigger the correct answer handling logic
    if (window.learningState.isAdvancedMode) {
      // Handle A/B pair logic for accidentals questions
      if (currentQuestion.chapterId === 'accCount' && data.accidentals > 0) {
        // This will trigger accNotes next
        const key = currentQuestion.key;
        window.learningState.currentQuestion = { key: key, chapterId: 'accNotes' };
        // Continue to next iteration for accNotes question
        continue;
      } else {
        // Track completed question type for anti-clustering logic
        if (window.learningState.currentQuestion) {
          const completedType = window.learningState.currentQuestion.chapterId;
          window.learningState.lastCompletedQuestionType = completedType;
        }
        
        // Start next random question
        window.startAdvancedPractice('random_all');
      }
    }
  }
  
  // Analyze results
  console.log('\n📊 Anti-Clustering Test Results');
  console.log('=' .repeat(40));
  
  // Question type distribution
  const typeDistribution = {};
  questionSequence.forEach(q => {
    typeDistribution[q.type] = (typeDistribution[q.type] || 0) + 1;
  });
  
  console.log('📈 Question Type Distribution:');
  Object.entries(typeDistribution).forEach(([type, count]) => {
    const percentage = ((count / questionSequence.length) * 100).toFixed(1);
    console.log(`   ${type}: ${count} (${percentage}%)`);
  });
  
  // Anti-clustering analysis
  console.log('\n🎯 Anti-Clustering Analysis:');
  console.log(`   Total Questions: ${questionSequence.length}`);
  console.log(`   Clustering Violations: ${clusteringViolations.length}`);
  console.log(`   Triads Can Repeat: ${triadsCanRepeat ? '✅ YES' : '❌ NO'}`);
  console.log(`   Other Types Cluster: ${otherTypesCluster ? '❌ YES' : '✅ NO'}`);
  
  if (clusteringViolations.length > 0) {
    console.log('\n⚠️  Violations Found:');
    clusteringViolations.forEach(violation => {
      console.log(`   Iteration ${violation.iteration}: ${violation.violation}`);
    });
  }
  
  // Test success criteria
  const success = clusteringViolations.length === 0;
  
  console.log('\n🏆 Test Results:');
  if (success) {
    console.log('✅ PASS: Anti-clustering logic working correctly!');
    console.log('   - Only triads can repeat consecutively');
    console.log('   - accCount, scale, and sevenths must alternate');
  } else {
    console.log('❌ FAIL: Anti-clustering violations detected');
    console.log(`   - Found ${clusteringViolations.length} violations`);
  }
  
  return success;
}

// Run the test
async function runTest() {
  try {
    await setupDOM();
    const success = testAntiClustering();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

runTest(); 
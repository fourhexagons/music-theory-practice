// PRECISE FORM LAYOUT INVESTIGATION
// Copy and paste this into the browser console on http://localhost:5173/practice

console.clear();
console.log('🔍 PRECISE FORM LAYOUT INVESTIGATION');
console.log('====================================');

// Step 1: Check if the correct layout was rendered
function checkFormLayout() {
    const form = document.getElementById('answer-form');
    const input = document.getElementById('answer-input');
    const button = document.getElementById('submit-btn');
    
    console.log('\n📋 FORM ELEMENT ANALYSIS:');
    console.log('Form exists:', !!form);
    console.log('Input exists:', !!input);
    console.log('Button exists:', !!button);
    
    if (form) {
        console.log('\n🏗️ FORM STRUCTURE:');
        console.log('Form classes:', form.className);
        console.log('Form HTML (first 300 chars):', form.outerHTML.substring(0, 300) + '...');
        
        // Check for expected Tailwind classes
        const expectedFormClasses = ['w-full', 'flex', 'flex-col', 'md:flex-row', 'gap-2'];
        const hasExpectedClasses = expectedFormClasses.every(cls => form.className.includes(cls));
        console.log('Has expected form classes:', hasExpectedClasses);
        
        if (!hasExpectedClasses) {
            console.log('❌ MISSING FORM CLASSES:');
            expectedFormClasses.forEach(cls => {
                if (!form.className.includes(cls)) {
                    console.log(`   Missing: ${cls}`);
                }
            });
        }
    }
    
    if (input) {
        console.log('\n📝 INPUT ANALYSIS:');
        console.log('Input classes:', input.className);
        
        const expectedInputClasses = ['flex-1', 'min-w-0', 'w-full', 'md:w-auto'];
        const hasExpectedInputClasses = expectedInputClasses.every(cls => input.className.includes(cls));
        console.log('Has expected input classes:', hasExpectedInputClasses);
        
        if (!hasExpectedInputClasses) {
            console.log('❌ MISSING INPUT CLASSES:');
            expectedInputClasses.forEach(cls => {
                if (!input.className.includes(cls)) {
                    console.log(`   Missing: ${cls}`);
                }
            });
        }
        
        // Check computed styles
        const computedStyles = window.getComputedStyle(input);
        console.log('\n💻 INPUT COMPUTED STYLES:');
        console.log('flex:', computedStyles.flex);
        console.log('width:', computedStyles.width);
        console.log('min-width:', computedStyles.minWidth);
        console.log('max-width:', computedStyles.maxWidth);
        console.log('flex-grow:', computedStyles.flexGrow);
        console.log('flex-shrink:', computedStyles.flexShrink);
        console.log('flex-basis:', computedStyles.flexBasis);
    }
    
    if (button) {
        console.log('\n🔘 BUTTON ANALYSIS:');
        console.log('Button classes:', button.className);
        
        const expectedButtonClasses = ['w-full', 'md:w-40', 'shrink-0'];
        const hasExpectedButtonClasses = expectedButtonClasses.every(cls => button.className.includes(cls));
        console.log('Has expected button classes:', hasExpectedButtonClasses);
        
        if (!hasExpectedButtonClasses) {
            console.log('❌ MISSING BUTTON CLASSES:');
            expectedButtonClasses.forEach(cls => {
                if (!button.className.includes(cls)) {
                    console.log(`   Missing: ${cls}`);
                }
            });
        }
        
        const computedStyles = window.getComputedStyle(button);
        console.log('\n💻 BUTTON COMPUTED STYLES:');
        console.log('width:', computedStyles.width);
        console.log('flex-shrink:', computedStyles.flexShrink);
    }
}

// Step 2: Test if Tailwind classes work at all
function testTailwindClasses() {
    console.log('\n🎨 TAILWIND FUNCTIONALITY TEST:');
    
    const testDiv = document.createElement('div');
    testDiv.className = 'flex-1 min-w-0 w-full bg-red-500';
    testDiv.style.height = '20px';
    testDiv.textContent = 'TAILWIND TEST';
    document.body.appendChild(testDiv);
    
    const computedStyles = window.getComputedStyle(testDiv);
    console.log('Test element flex:', computedStyles.flex);
    console.log('Test element min-width:', computedStyles.minWidth);
    console.log('Test element width:', computedStyles.width);
    console.log('Test element background:', computedStyles.backgroundColor);
    
    const isTailwindWorking = computedStyles.backgroundColor === 'rgb(239, 68, 68)'; // red-500
    console.log('Tailwind is working:', isTailwindWorking);
    
    // Clean up
    setTimeout(() => document.body.removeChild(testDiv), 3000);
    
    return isTailwindWorking;
}

// Step 3: Check CSS loading
function checkCSSLoading() {
    console.log('\n📄 CSS LOADING ANALYSIS:');
    
    const stylesheets = Array.from(document.styleSheets);
    console.log('Total stylesheets loaded:', stylesheets.length);
    
    let tailwindFound = false;
    let totalRules = 0;
    
    stylesheets.forEach((sheet, index) => {
        try {
            const rules = sheet.cssRules || [];
            totalRules += rules.length;
            console.log(`Sheet ${index}: ${sheet.href || 'inline'} (${rules.length} rules)`);
            
            // Check for Tailwind utilities
            for (let rule of rules) {
                if (rule.cssText && rule.cssText.includes('flex-1')) {
                    tailwindFound = true;
                    console.log('   ✅ Found Tailwind utilities in this sheet');
                    break;
                }
            }
        } catch (e) {
            console.log(`Sheet ${index}: ${sheet.href || 'inline'} (CORS blocked)`);
        }
    });
    
    console.log('Total CSS rules loaded:', totalRules);
    console.log('Tailwind utilities found:', tailwindFound);
    
    return { totalRules, tailwindFound };
}

// Step 4: Check for CSS conflicts
function checkCSSConflicts() {
    console.log('\n⚔️ CSS CONFLICTS ANALYSIS:');
    
    const input = document.getElementById('answer-input');
    if (!input) {
        console.log('No input element found');
        return;
    }
    
    // Get all CSS rules that might affect the input
    const matchingRules = [];
    const stylesheets = Array.from(document.styleSheets);
    
    stylesheets.forEach(sheet => {
        try {
            const rules = sheet.cssRules || [];
            for (let rule of rules) {
                if (rule.selectorText) {
                    // Check if rule might apply to our input
                    if (rule.selectorText.includes('input') || 
                        rule.selectorText.includes('#answer-input') ||
                        rule.selectorText.includes('.flex-1') ||
                        rule.selectorText.includes('[type="text"]')) {
                        matchingRules.push({
                            selector: rule.selectorText,
                            cssText: rule.cssText,
                            href: sheet.href || 'inline'
                        });
                    }
                }
            }
        } catch (e) {
            // CORS blocked
        }
    });
    
    console.log('CSS rules that might affect input:', matchingRules.length);
    matchingRules.forEach((rule, index) => {
        console.log(`Rule ${index}: ${rule.selector}`);
        console.log(`   From: ${rule.href}`);
        console.log(`   CSS: ${rule.cssText.substring(0, 100)}...`);
    });
}

// Step 5: Check initialization order
function checkInitializationOrder() {
    console.log('\n🚀 INITIALIZATION ORDER CHECK:');
    
    console.log('AppController exists:', !!window.appController);
    console.log('QuizService exists:', !!window.quizService);
    console.log('learningState exists:', !!window.learningState);
    console.log('quizData exists:', !!window.quizData);
    
    if (window.appController) {
        console.log('AppController.layout exists:', !!window.appController.layout);
        console.log('AppController.isInitialized:', window.appController.isInitialized);
    }
}

// Run the complete investigation
function runCompleteInvestigation() {
    console.log('🔍 STARTING COMPLETE INVESTIGATION...\n');
    
    checkInitializationOrder();
    checkFormLayout();
    const tailwindWorking = testTailwindClasses();
    const cssInfo = checkCSSLoading();
    checkCSSConflicts();
    
    console.log('\n📊 INVESTIGATION SUMMARY:');
    console.log('========================');
    console.log('Tailwind working:', tailwindWorking);
    console.log('CSS rules loaded:', cssInfo.totalRules);
    console.log('Tailwind utilities found:', cssInfo.tailwindFound);
    
    const form = document.getElementById('answer-form');
    const input = document.getElementById('answer-input');
    
    if (form && input) {
        const hasCorrectClasses = form.className.includes('flex') && input.className.includes('flex-1');
        console.log('Form has correct structure:', hasCorrectClasses);
        
        if (!hasCorrectClasses) {
            console.log('\n❌ PROBLEM IDENTIFIED: Form does not have correct Tailwind classes');
            console.log('This suggests AppLayout.renderPracticeLayout() was not called or was overridden');
        } else {
            console.log('\n✅ Form structure looks correct');
            console.log('Problem might be CSS specificity or conflicting styles');
        }
    } else {
        console.log('\n❌ CRITICAL PROBLEM: Form elements not found');
    }
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Check if AppLayout.renderPracticeLayout() is being called');
    console.log('2. Check if something is overriding the layout after rendering');
    console.log('3. Inspect the Elements tab to see actual HTML structure');
    console.log('4. Check for JavaScript errors in Console tab');
}

// Auto-run the investigation
runCompleteInvestigation();

// Make functions available for manual testing
window.debugFormLayout = {
    checkFormLayout,
    testTailwindClasses,
    checkCSSLoading,
    checkCSSConflicts,
    checkInitializationOrder,
    runCompleteInvestigation
}; 
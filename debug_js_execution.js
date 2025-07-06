// JavaScript Execution Flow Debugger
// Add this to the browser console to trace layout rendering

console.log('🚀 STARTING JAVASCRIPT EXECUTION FLOW DEBUG');
console.log('=============================================');

// 1. Intercept AppLayout.renderPracticeLayout calls
if (window.AppLayout) {
    const originalRender = window.AppLayout.prototype.renderPracticeLayout;
    window.AppLayout.prototype.renderPracticeLayout = function() {
        console.log('📐 AppLayout.renderPracticeLayout() CALLED');
        console.log('   Container:', this.container);
        const result = originalRender.call(this);
        console.log('   Layout rendered, checking form...');
        const form = document.getElementById('answer-form');
        if (form) {
            console.log('   ✅ Form found after render:', form.outerHTML.substring(0, 200) + '...');
            console.log('   ✅ Form classes:', form.className);
        } else {
            console.log('   ❌ No form found after render!');
        }
        return result;
    };
}

// 2. Monitor DOM mutations to see when form is added/modified
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    if (node.id === 'answer-form' || node.querySelector('#answer-form')) {
                        console.log('🔄 FORM ADDED TO DOM:', node.outerHTML?.substring(0, 200) + '...');
                        const form = node.id === 'answer-form' ? node : node.querySelector('#answer-form');
                        console.log('   Form classes:', form?.className);
                    }
                    if (node.id === 'app-container' || node.querySelector('#app-container')) {
                        console.log('📦 APP CONTAINER MODIFIED');
                        const container = node.id === 'app-container' ? node : node.querySelector('#app-container');
                        console.log('   Container innerHTML length:', container?.innerHTML?.length || 0);
                    }
                }
            });
        }
        if (mutation.type === 'attributes' && mutation.target.id === 'answer-form') {
            console.log('🔧 FORM ATTRIBUTES CHANGED:', mutation.attributeName, '=', mutation.target.getAttribute(mutation.attributeName));
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
});

// 3. Track when scripts load
const originalAppend = Document.prototype.appendChild;
Document.prototype.appendChild = function(child) {
    if (child.tagName === 'SCRIPT') {
        console.log('📜 SCRIPT LOADING:', child.src || 'inline');
    }
    return originalAppend.call(this, child);
};

// 4. Track function calls that might render layout
const functionsToTrack = [
    'renderPracticeLayout',
    'renderAppLayout', 
    'updateQuestionUI',
    'askQuestion',
    'generateAndDisplayQuestion'
];

functionsToTrack.forEach(funcName => {
    if (window[funcName]) {
        const original = window[funcName];
        window[funcName] = function(...args) {
            console.log(`🎯 FUNCTION CALLED: ${funcName}`, args);
            const result = original.apply(this, args);
            console.log(`   ${funcName} completed`);
            return result;
        };
    }
});

// 5. Check current state
setTimeout(() => {
    console.log('📊 CURRENT STATE CHECK (after 2 seconds):');
    const form = document.getElementById('answer-form');
    const input = document.getElementById('answer-input');
    const container = document.getElementById('app-container');
    
    console.log('   Container exists:', !!container);
    console.log('   Container content length:', container?.innerHTML?.length || 0);
    console.log('   Form exists:', !!form);
    console.log('   Input exists:', !!input);
    
    if (form) {
        console.log('   Form classes:', form.className);
        console.log('   Form HTML preview:', form.outerHTML.substring(0, 300) + '...');
    }
    
    if (input) {
        console.log('   Input classes:', input.className);
        const styles = window.getComputedStyle(input);
        console.log('   Input computed flex:', styles.flex);
        console.log('   Input computed width:', styles.width);
    }
}, 2000);

// 6. Specific check for our target classes
setTimeout(() => {
    console.log('🎨 TAILWIND CLASSES CHECK:');
    const form = document.getElementById('answer-form');
    const input = document.getElementById('answer-input');
    
    if (form) {
        const hasFlexClasses = form.className.includes('flex');
        const hasGapClass = form.className.includes('gap-');
        console.log('   Form has flex classes:', hasFlexClasses);
        console.log('   Form has gap class:', hasGapClass);
    }
    
    if (input) {
        const hasFlexOne = input.className.includes('flex-1');
        const hasMinWidth = input.className.includes('min-w-0');
        const hasWidthFull = input.className.includes('w-full');
        console.log('   Input has flex-1:', hasFlexOne);
        console.log('   Input has min-w-0:', hasMinWidth);
        console.log('   Input has w-full:', hasWidthFull);
        
        if (!hasFlexOne || !hasMinWidth || !hasWidthFull) {
            console.log('   ❌ MISSING EXPECTED TAILWIND CLASSES!');
            console.log('   Actual input classes:', input.className);
        } else {
            console.log('   ✅ All expected Tailwind classes present');
        }
    }
}, 3000);

console.log('✅ Debug monitoring active. Check console for updates...'); 
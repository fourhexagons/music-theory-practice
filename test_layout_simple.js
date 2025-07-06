import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

async function testLayoutSimple() {
    console.log('🚀 Starting simple layout analysis...');
    
    try {
        // Test 1: Check if the app is running
        console.log('\n🔍 Test 1: Checking if app is running...');
        
        const appUrl = 'http://localhost:5173/src/practice.html';
        console.log(`📱 Checking app at: ${appUrl}`);
        
        const response = await fetch(appUrl);
        if (!response.ok) {
            throw new Error(`App not accessible: ${response.status} ${response.statusText}`);
        }
        
        const html = await response.text();
        console.log('✅ App is accessible');
        
        // Test 2: Check HTML structure
        console.log('\n🔍 Test 2: Analyzing HTML structure...');
        
        // Check for form elements
        const hasAnswerForm = html.includes('id="answer-form"');
        const hasAnswerInput = html.includes('id="answer-input"');
        const hasSubmitBtn = html.includes('id="submit-btn"');
        
        console.log(`📋 Form elements found:`);
        console.log(`   Answer form: ${hasAnswerForm ? '✅' : '❌'}`);
        console.log(`   Answer input: ${hasAnswerInput ? '✅' : '❌'}`);
        console.log(`   Submit button: ${hasSubmitBtn ? '✅' : '❌'}`);
        
        if (!hasAnswerForm || !hasAnswerInput || !hasSubmitBtn) {
            console.log('❌ Missing required form elements');
            return;
        }
        
        // Test 3: Check for Tailwind classes
        console.log('\n🔍 Test 3: Checking Tailwind classes...');
        
        const expectedFormClasses = ['w-full', 'block', 'flex', 'flex-col', 'md:flex-row', 'gap-2', 'mb-6'];
        const expectedInputClasses = ['flex-1', 'min-w-0', 'w-full', 'md:w-auto'];
        const expectedButtonClasses = ['w-full', 'md:w-40', 'shrink-0'];
        
        const formClassesFound = expectedFormClasses.filter(cls => html.includes(`class="${cls}"`) || html.includes(`class='${cls}'`) || html.includes(` ${cls} `));
        const inputClassesFound = expectedInputClasses.filter(cls => html.includes(`class="${cls}"`) || html.includes(`class='${cls}'`) || html.includes(` ${cls} `));
        const buttonClassesFound = expectedButtonClasses.filter(cls => html.includes(`class="${cls}"`) || html.includes(`class='${cls}'`) || html.includes(` ${cls} `));
        
        console.log('\n📋 Form classes:');
        console.log(`   Expected: ${expectedFormClasses.join(', ')}`);
        console.log(`   Found: ${formClassesFound.join(', ')}`);
        console.log(`   Missing: ${expectedFormClasses.filter(cls => !formClassesFound.includes(cls)).join(', ')}`);
        
        console.log('\n📝 Input classes:');
        console.log(`   Expected: ${expectedInputClasses.join(', ')}`);
        console.log(`   Found: ${inputClassesFound.join(', ')}`);
        console.log(`   Missing: ${expectedInputClasses.filter(cls => !inputClassesFound.includes(cls)).join(', ')}`);
        
        console.log('\n🔘 Button classes:');
        console.log(`   Expected: ${expectedButtonClasses.join(', ')}`);
        console.log(`   Found: ${buttonClassesFound.join(', ')}`);
        console.log(`   Missing: ${expectedButtonClasses.filter(cls => !buttonClassesFound.includes(cls)).join(', ')}`);
        
        // Test 4: Check for CSS imports
        console.log('\n🔍 Test 4: Checking CSS imports...');
        
        const cssImports = html.match(/<link[^>]*href="[^"]*\.css[^"]*"[^>]*>/g) || [];
        const styleTags = html.match(/<style[^>]*>[\s\S]*?<\/style>/g) || [];
        
        console.log(`📦 CSS imports found: ${cssImports.length}`);
        cssImports.forEach((link, index) => {
            console.log(`   ${index + 1}. ${link}`);
        });
        
        console.log(`📦 Style tags found: ${styleTags.length}`);
        styleTags.forEach((style, index) => {
            const content = style.substring(0, 100) + '...';
            console.log(`   ${index + 1}. ${content}`);
        });
        
        // Test 5: Check for potential CSS conflicts
        console.log('\n🔍 Test 5: Checking for potential CSS conflicts...');
        
        const allStyleContent = styleTags.join(' ');
        const potentialConflicts = [];
        
        // Check for form, input, button selectors
        const formSelectors = allStyleContent.match(/form[^}]*{[^}]*}/g) || [];
        const inputSelectors = allStyleContent.match(/input[^}]*{[^}]*}/g) || [];
        const buttonSelectors = allStyleContent.match(/button[^}]*{[^}]*}/g) || [];
        const idSelectors = allStyleContent.match(/#answer-form[^}]*{[^}]*}|#answer-input[^}]*{[^}]*}|#submit-btn[^}]*{[^}]*}/g) || [];
        
        if (formSelectors.length > 0) {
            potentialConflicts.push(...formSelectors.map(s => `Form selector: ${s.substring(0, 100)}...`));
        }
        if (inputSelectors.length > 0) {
            potentialConflicts.push(...inputSelectors.map(s => `Input selector: ${s.substring(0, 100)}...`));
        }
        if (buttonSelectors.length > 0) {
            potentialConflicts.push(...buttonSelectors.map(s => `Button selector: ${s.substring(0, 100)}...`));
        }
        if (idSelectors.length > 0) {
            potentialConflicts.push(...idSelectors.map(s => `ID selector: ${s.substring(0, 100)}...`));
        }
        
        if (potentialConflicts.length > 0) {
            console.log('⚠️  Potential CSS conflicts found:');
            potentialConflicts.forEach((conflict, index) => {
                console.log(`   ${index + 1}. ${conflict}`);
            });
        } else {
            console.log('✅ No obvious CSS conflicts found in inline styles');
        }
        
        // Test 6: Check for Tailwind CSS
        console.log('\n🔍 Test 6: Checking for Tailwind CSS...');
        
        const hasTailwindBase = html.includes('tailwindcss.com') || html.includes('tailwind') || html.includes('@tailwind');
        const hasTailwindClasses = html.includes('w-full') || html.includes('flex') || html.includes('md:');
        
        console.log(`   Tailwind CDN or import: ${hasTailwindBase ? '✅' : '❌'}`);
        console.log(`   Tailwind classes present: ${hasTailwindClasses ? '✅' : '❌'}`);
        
        // Summary and diagnosis
        console.log('\n📋 DIAGNOSIS SUMMARY:');
        
        const allFormClassesPresent = expectedFormClasses.every(cls => formClassesFound.includes(cls));
        const allInputClassesPresent = expectedInputClasses.every(cls => inputClassesFound.includes(cls));
        const allButtonClassesPresent = expectedButtonClasses.every(cls => buttonClassesFound.includes(cls));
        
        if (!allFormClassesPresent || !allInputClassesPresent || !allButtonClassesPresent) {
            console.log('❌ TAILWIND ISSUE: Missing expected classes in HTML');
            console.log('   This suggests the classes are not being rendered by the JavaScript');
        } else {
            console.log('✅ All expected Tailwind classes are present in HTML');
        }
        
        if (potentialConflicts.length > 0) {
            console.log('⚠️  CSS CONFLICTS: Found potential conflicting CSS rules');
        } else {
            console.log('✅ No obvious CSS conflicts detected');
        }
        
        if (!hasTailwindBase) {
            console.log('❌ TAILWIND MISSING: No Tailwind CSS detected');
        } else {
            console.log('✅ Tailwind CSS is present');
        }
        
        console.log('\n🎯 RECOMMENDED NEXT STEPS:');
        
        if (!allFormClassesPresent || !allInputClassesPresent || !allButtonClassesPresent) {
            console.log('1. Check AppLayout.js to ensure classes are being rendered');
            console.log('2. Verify the JavaScript is loading and executing properly');
            console.log('3. Check browser console for JavaScript errors');
        }
        
        if (potentialConflicts.length > 0) {
            console.log('4. Remove or fix conflicting CSS rules');
        }
        
        if (!hasTailwindBase) {
            console.log('5. Ensure Tailwind CSS is properly imported');
        }
        
        console.log('\n💡 QUICK FIX ATTEMPT:');
        console.log('Try opening the browser DevTools and checking:');
        console.log('1. Are the Tailwind classes present on the elements?');
        console.log('2. Are there any computed styles overriding the width/flex?');
        console.log('3. Are there any JavaScript errors in the console?');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n💡 Make sure your development server is running:');
        console.log('   npm run dev');
    }
}

// Run the test
testLayoutSimple().catch(console.error); 
import fs from 'fs';
import path from 'path';

function testLayoutBasic() {
    console.log('🚀 Starting basic layout analysis...');
    
    try {
        // Test 1: Check AppLayout.js file
        console.log('\n🔍 Test 1: Analyzing AppLayout.js...');
        
        const appLayoutPath = 'src/modules/ui/components/AppLayout.js';
        if (!fs.existsSync(appLayoutPath)) {
            throw new Error(`AppLayout.js not found at ${appLayoutPath}`);
        }
        
        const appLayoutContent = fs.readFileSync(appLayoutPath, 'utf8');
        console.log('✅ AppLayout.js found and readable');
        
        // Test 2: Check for form structure
        console.log('\n🔍 Test 2: Checking form structure...');
        
        const hasFormElement = appLayoutContent.includes('<form');
        const hasAnswerFormId = appLayoutContent.includes('id="answer-form"');
        const hasAnswerInputId = appLayoutContent.includes('id="answer-input"');
        const hasSubmitBtnId = appLayoutContent.includes('id="submit-btn"');
        
        console.log(`📋 Form structure:`);
        console.log(`   Form element: ${hasFormElement ? '✅' : '❌'}`);
        console.log(`   Answer form ID: ${hasAnswerFormId ? '✅' : '❌'}`);
        console.log(`   Answer input ID: ${hasAnswerInputId ? '✅' : '❌'}`);
        console.log(`   Submit button ID: ${hasSubmitBtnId ? '✅' : '❌'}`);
        
        if (!hasFormElement || !hasAnswerFormId || !hasAnswerInputId || !hasSubmitBtnId) {
            console.log('❌ Missing required form elements in AppLayout.js');
            return;
        }
        
        // Test 3: Check for Tailwind classes
        console.log('\n🔍 Test 3: Checking Tailwind classes in AppLayout.js...');
        
        const expectedFormClasses = ['w-full', 'block', 'flex', 'flex-col', 'md:flex-row', 'gap-2', 'mb-6'];
        const expectedInputClasses = ['flex-1', 'min-w-0', 'w-full', 'md:w-auto'];
        const expectedButtonClasses = ['w-full', 'md:w-40', 'shrink-0'];
        
        const formClassesFound = expectedFormClasses.filter(cls => appLayoutContent.includes(cls));
        const inputClassesFound = expectedInputClasses.filter(cls => appLayoutContent.includes(cls));
        const buttonClassesFound = expectedButtonClasses.filter(cls => appLayoutContent.includes(cls));
        
        console.log('\n📋 Form classes in AppLayout.js:');
        console.log(`   Expected: ${expectedFormClasses.join(', ')}`);
        console.log(`   Found: ${formClassesFound.join(', ')}`);
        console.log(`   Missing: ${expectedFormClasses.filter(cls => !formClassesFound.includes(cls)).join(', ')}`);
        
        console.log('\n📝 Input classes in AppLayout.js:');
        console.log(`   Expected: ${expectedInputClasses.join(', ')}`);
        console.log(`   Found: ${inputClassesFound.join(', ')}`);
        console.log(`   Missing: ${expectedInputClasses.filter(cls => !inputClassesFound.includes(cls)).join(', ')}`);
        
        console.log('\n🔘 Button classes in AppLayout.js:');
        console.log(`   Expected: ${expectedButtonClasses.join(', ')}`);
        console.log(`   Found: ${buttonClassesFound.join(', ')}`);
        console.log(`   Missing: ${expectedButtonClasses.filter(cls => !buttonClassesFound.includes(cls)).join(', ')}`);
        
        // Test 4: Check for container structure
        console.log('\n🔍 Test 4: Checking container structure...');
        
        const hasContainer = appLayoutContent.includes('max-w-2xl');
        const hasSection = appLayoutContent.includes('<section');
        const hasMain = appLayoutContent.includes('<main');
        
        console.log(`📦 Container structure:`);
        console.log(`   Container with max-w-2xl: ${hasContainer ? '✅' : '❌'}`);
        console.log(`   Section element: ${hasSection ? '✅' : '❌'}`);
        console.log(`   Main element: ${hasMain ? '✅' : '❌'}`);
        
        // Test 5: Check for potential issues
        console.log('\n🔍 Test 5: Checking for potential issues...');
        
        const hasInlineStyles = appLayoutContent.includes('style=');
        const hasLegacyClasses = appLayoutContent.includes('class="btn"') || appLayoutContent.includes('class=\'btn\'');
        const hasDisplayNone = appLayoutContent.includes('display: none') || appLayoutContent.includes('display: \'none\'');
        
        console.log(`⚠️  Potential issues:`);
        console.log(`   Inline styles: ${hasInlineStyles ? '⚠️' : '✅'}`);
        console.log(`   Legacy btn classes: ${hasLegacyClasses ? '⚠️' : '✅'}`);
        console.log(`   Display none: ${hasDisplayNone ? '⚠️' : '✅'}`);
        
        // Test 6: Check CSS files
        console.log('\n🔍 Test 6: Checking CSS files...');
        
        const cssFiles = [
            'src/styles/style.css',
            'src/styles/design-system.css',
            'src/styles/components/layout.css'
        ];
        
        const cssConflicts = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const cssContent = fs.readFileSync(cssFile, 'utf8');
                
                // Check for form, input, button selectors
                const formSelectors = cssContent.match(/form[^}]*{[^}]*}/g) || [];
                const inputSelectors = cssContent.match(/input[^}]*{[^}]*}/g) || [];
                const buttonSelectors = cssContent.match(/button[^}]*{[^}]*}/g) || [];
                const idSelectors = cssContent.match(/#answer-form[^}]*{[^}]*}|#answer-input[^}]*{[^}]*}|#submit-btn[^}]*{[^}]*}/g) || [];
                
                if (formSelectors.length > 0 || inputSelectors.length > 0 || buttonSelectors.length > 0 || idSelectors.length > 0) {
                    cssConflicts.push({
                        file: cssFile,
                        formSelectors: formSelectors.length,
                        inputSelectors: inputSelectors.length,
                        buttonSelectors: buttonSelectors.length,
                        idSelectors: idSelectors.length
                    });
                }
            }
        });
        
        if (cssConflicts.length > 0) {
            console.log('⚠️  Potential CSS conflicts found:');
            cssConflicts.forEach(conflict => {
                console.log(`   ${conflict.file}:`);
                console.log(`     Form selectors: ${conflict.formSelectors}`);
                console.log(`     Input selectors: ${conflict.inputSelectors}`);
                console.log(`     Button selectors: ${conflict.buttonSelectors}`);
                console.log(`     ID selectors: ${conflict.idSelectors}`);
            });
        } else {
            console.log('✅ No obvious CSS conflicts found');
        }
        
        // Test 7: Check Tailwind config
        console.log('\n🔍 Test 7: Checking Tailwind configuration...');
        
        const tailwindConfigPath = 'tailwind.config.js';
        if (fs.existsSync(tailwindConfigPath)) {
            const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
            console.log('✅ Tailwind config found');
            
            const hasSrcContent = tailwindConfig.includes('src/');
            const hasPublicContent = tailwindConfig.includes('public/');
            
            console.log(`   Includes src/ content: ${hasSrcContent ? '✅' : '❌'}`);
            console.log(`   Includes public/ content: ${hasPublicContent ? '✅' : '❌'}`);
            
            if (!hasSrcContent) {
                console.log('⚠️  Tailwind config may not include src/ directory');
            }
        } else {
            console.log('❌ Tailwind config not found');
        }
        
        // Summary and diagnosis
        console.log('\n📋 DIAGNOSIS SUMMARY:');
        
        const allFormClassesPresent = expectedFormClasses.every(cls => formClassesFound.includes(cls));
        const allInputClassesPresent = expectedInputClasses.every(cls => inputClassesFound.includes(cls));
        const allButtonClassesPresent = expectedButtonClasses.every(cls => buttonClassesFound.includes(cls));
        
        if (!allFormClassesPresent || !allInputClassesPresent || !allButtonClassesPresent) {
            console.log('❌ TAILWIND ISSUE: Missing expected classes in AppLayout.js');
            console.log('   This suggests the classes need to be added to the template');
        } else {
            console.log('✅ All expected Tailwind classes are present in AppLayout.js');
        }
        
        if (cssConflicts.length > 0) {
            console.log('⚠️  CSS CONFLICTS: Found potential conflicting CSS rules');
        } else {
            console.log('✅ No obvious CSS conflicts detected');
        }
        
        if (hasLegacyClasses) {
            console.log('⚠️  LEGACY CLASSES: Found legacy btn classes that may conflict');
        }
        
        console.log('\n🎯 RECOMMENDED NEXT STEPS:');
        
        if (!allFormClassesPresent || !allInputClassesPresent || !allButtonClassesPresent) {
            console.log('1. Add missing Tailwind classes to AppLayout.js');
            console.log('2. Ensure the form template has all required classes');
        }
        
        if (cssConflicts.length > 0) {
            console.log('3. Review and remove conflicting CSS rules');
        }
        
        if (hasLegacyClasses) {
            console.log('4. Remove legacy btn classes from AppLayout.js');
        }
        
        console.log('\n💡 QUICK FIX ATTEMPT:');
        console.log('If classes are present in AppLayout.js but not working:');
        console.log('1. Check if Tailwind is properly configured for src/ directory');
        console.log('2. Restart the development server');
        console.log('3. Clear browser cache and hard refresh');
        console.log('4. Check browser DevTools for any JavaScript errors');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testLayoutBasic(); 
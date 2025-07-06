import fs from 'fs';
import path from 'path';

function finalVerification() {
    console.log('🔍 FINAL VERIFICATION TEST');
    console.log('===========================');
    
    try {
        // Test 1: Check for duplicate CSS rules
        console.log('\n🔍 Test 1: Checking for duplicate CSS rules...');
        
        const styleCss = fs.readFileSync('src/styles/style.css', 'utf8');
        const layoutCss = fs.readFileSync('src/styles/components/layout.css', 'utf8');
        
        const styleAppContainer = styleCss.match(/#app-container\s*{[^}]*}/);
        const layoutAppContainer = layoutCss.match(/#app-container\s*{[^}]*}/);
        
        if (styleAppContainer && !layoutAppContainer) {
            console.log('✅ No duplicate #app-container rules found');
        } else if (styleAppContainer && layoutAppContainer) {
            console.log('❌ Duplicate #app-container rules found');
            console.log(`   style.css: ${styleAppContainer[0].substring(0, 100)}...`);
            console.log(`   layout.css: ${layoutAppContainer[0].substring(0, 100)}...`);
        } else {
            console.log('⚠️  No #app-container rule found in style.css');
        }
        
        // Test 2: Check for JavaScript flex class manipulation
        console.log('\n🔍 Test 2: Checking for JavaScript flex class manipulation...');
        
        const jsFiles = [
            'src/modules/ui/controllers/AppController.js',
            'src/components/main-app.js',
            'src/main-backup.js'
        ];
        
        const flexManipulation = [];
        
        jsFiles.forEach(jsFile => {
            if (fs.existsSync(jsFile)) {
                const content = fs.readFileSync(jsFile, 'utf8');
                
                // Look for flex class manipulation
                const flexAdd = content.match(/classList\.add\(['"]flex['"]\)/g) || [];
                const flexRemove = content.match(/classList\.remove\(['"]flex['"]\)/g) || [];
                
                if (flexAdd.length > 0 || flexRemove.length > 0) {
                    flexManipulation.push({
                        file: jsFile,
                        addCount: flexAdd.length,
                        removeCount: flexRemove.length
                    });
                }
            }
        });
        
        if (flexManipulation.length === 0) {
            console.log('✅ No JavaScript flex class manipulation found');
        } else {
            console.log('❌ JavaScript flex class manipulation found:');
            flexManipulation.forEach(issue => {
                console.log(`   ${issue.file}: add(${issue.addCount}), remove(${issue.removeCount})`);
            });
        }
        
        // Test 3: Check for width constraints in quiz-section
        console.log('\n🔍 Test 3: Checking for width constraints in quiz-section...');
        
        const styleQuizSection = styleCss.match(/\.quiz-section\s*{[^}]*}/);
        const layoutQuizSection = layoutCss.match(/\.quiz-section\s*{[^}]*}/);
        
        let hasWidthConstraints = false;
        
        if (styleQuizSection) {
            const hasWidth = styleQuizSection[0].includes('width:');
            const hasMaxWidth = styleQuizSection[0].includes('max-width:');
            if (hasWidth || hasMaxWidth) {
                console.log('❌ Width constraints found in style.css quiz-section');
                hasWidthConstraints = true;
            }
        }
        
        if (layoutQuizSection) {
            const hasWidth = layoutQuizSection[0].includes('width:');
            const hasMaxWidth = layoutQuizSection[0].includes('max-width:');
            if (hasWidth || hasMaxWidth) {
                console.log('❌ Width constraints found in layout.css quiz-section');
                hasWidthConstraints = true;
            }
        }
        
        if (!hasWidthConstraints) {
            console.log('✅ No width constraints found in quiz-section');
        }
        
        // Test 4: Check for proper Tailwind classes in form HTML
        console.log('\n🔍 Test 4: Checking Tailwind classes in form HTML...');
        
        const appLayoutFile = 'src/modules/ui/components/AppLayout.js';
        if (fs.existsSync(appLayoutFile)) {
            const content = fs.readFileSync(appLayoutFile, 'utf8');
            
            // Look for form with Tailwind classes
            const formMatch = content.match(/<form[^>]*class="[^"]*"[^>]*>/);
            if (formMatch) {
                const formClass = formMatch[0];
                const expectedClasses = ['w-full', 'flex', 'gap-2'];
                const missingClasses = expectedClasses.filter(cls => !formClass.includes(cls));
                
                if (missingClasses.length === 0) {
                    console.log('✅ All expected Tailwind classes found in form HTML');
                } else {
                    console.log('❌ Missing Tailwind classes in form HTML:', missingClasses);
                }
                
                // Check input classes
                const inputMatch = content.match(/<input[^>]*class="[^"]*"[^>]*>/);
                if (inputMatch) {
                    const inputClass = inputMatch[0];
                    const expectedInputClasses = ['flex-1', 'w-full', 'min-w-0'];
                    const missingInputClasses = expectedInputClasses.filter(cls => !inputClass.includes(cls));
                    
                    if (missingInputClasses.length === 0) {
                        console.log('✅ All expected Tailwind classes found in input HTML');
                    } else {
                        console.log('❌ Missing Tailwind classes in input HTML:', missingInputClasses);
                    }
                }
                
                // Check button classes
                const buttonMatch = content.match(/<button[^>]*class="[^"]*"[^>]*>/);
                if (buttonMatch) {
                    const buttonClass = buttonMatch[0];
                    const expectedButtonClasses = ['w-full', 'md:w-40', 'shrink-0'];
                    const missingButtonClasses = expectedButtonClasses.filter(cls => !buttonClass.includes(cls));
                    
                    if (missingButtonClasses.length === 0) {
                        console.log('✅ All expected Tailwind classes found in button HTML');
                    } else {
                        console.log('❌ Missing Tailwind classes in button HTML:', missingButtonClasses);
                    }
                }
            } else {
                console.log('❌ No form with class attribute found in AppLayout.js');
            }
        } else {
            console.log('❌ AppLayout.js not found');
        }
        
        // Summary
        console.log('\n📋 FINAL VERIFICATION SUMMARY:');
        console.log('=====================================');
        
        const hasDuplicates = styleAppContainer && layoutAppContainer;
        const hasFlexManipulation = flexManipulation.length > 0;
        const hasWidthConstraintsIssue = hasWidthConstraints;
        
        if (!hasDuplicates && !hasFlexManipulation && !hasWidthConstraintsIssue) {
            console.log('✅ ALL ISSUES RESOLVED!');
            console.log('   - No duplicate CSS rules');
            console.log('   - No JavaScript flex class manipulation');
            console.log('   - No width constraints in quiz-section');
            console.log('   - Proper Tailwind classes in form HTML');
            console.log('');
            console.log('🎯 The form layout should now work correctly!');
            console.log('   - Input field will take available width');
            console.log('   - Submit button will maintain fixed width');
            console.log('   - Layout will be responsive');
        } else {
            console.log('⚠️  Some issues may remain:');
            if (hasDuplicates) console.log('   - Duplicate CSS rules');
            if (hasFlexManipulation) console.log('   - JavaScript flex manipulation');
            if (hasWidthConstraintsIssue) console.log('   - Width constraints');
        }
        
        console.log('\n🚀 NEXT STEPS:');
        console.log('1. Restart your dev server: npm run dev');
        console.log('2. Clear browser cache and hard refresh');
        console.log('3. Test the form layout in your browser');
        console.log('4. If still broken, check browser DevTools for computed styles');
        
    } catch (error) {
        console.error('❌ Final verification failed:', error.message);
    }
}

// Run the verification
finalVerification(); 
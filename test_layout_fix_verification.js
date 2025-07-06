import fs from 'fs';
import path from 'path';

function testLayoutFixVerification() {
    console.log('🔍 Layout Fix Verification Test');
    console.log('=====================================');
    
    try {
        // Test 1: Verify width constraints removed from quiz-section
        console.log('\n🔍 Test 1: Checking if width constraints removed from quiz-section...');
        
        const styleCss = fs.readFileSync('src/styles/style.css', 'utf8');
        const layoutCss = fs.readFileSync('src/styles/components/layout.css', 'utf8');
        
        // Check for remaining width constraints in quiz-section
        const styleQuizSection = styleCss.match(/\.quiz-section\s*{[^}]*}/);
        const layoutQuizSection = layoutCss.match(/\.quiz-section\s*{[^}]*}/);
        
        if (styleQuizSection) {
            const hasWidth = styleQuizSection[0].includes('width:');
            const hasMaxWidth = styleQuizSection[0].includes('max-width:');
            
            console.log('   src/styles/style.css quiz-section:');
            console.log(`     Has width: ${hasWidth}`);
            console.log(`     Has max-width: ${hasMaxWidth}`);
            console.log(`     Content: ${styleQuizSection[0].substring(0, 100)}...`);
            
            if (!hasWidth && !hasMaxWidth) {
                console.log('   ✅ Width constraints successfully removed from style.css');
            } else {
                console.log('   ❌ Width constraints still present in style.css');
            }
        }
        
        if (layoutQuizSection) {
            const hasWidth = layoutQuizSection[0].includes('width:');
            const hasMaxWidth = layoutQuizSection[0].includes('max-width:');
            
            console.log('   src/styles/components/layout.css quiz-section:');
            console.log(`     Has width: ${hasWidth}`);
            console.log(`     Has max-width: ${hasMaxWidth}`);
            console.log(`     Content: ${layoutQuizSection[0].substring(0, 100)}...`);
            
            if (!hasWidth && !hasMaxWidth) {
                console.log('   ✅ Width constraints successfully removed from layout.css');
            } else {
                console.log('   ❌ Width constraints still present in layout.css');
            }
        }
        
        // Test 2: Check for any remaining width constraints that might affect forms
        console.log('\n🔍 Test 2: Checking for any remaining width constraints...');
        
        const allCssFiles = [
            'src/styles/style.css',
            'src/styles/components/layout.css',
            'src/styles/design-system.css'
        ];
        
        const remainingConstraints = [];
        
        allCssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                // Look for any rules that might constrain form width
                const formConstraints = content.match(/\.(?:form|input|button|answer)[^}]*{[^}]*}/g) || [];
                const widthConstraints = formConstraints.filter(rule => 
                    rule.includes('width:') || rule.includes('max-width:') || rule.includes('min-width:')
                );
                
                if (widthConstraints.length > 0) {
                    remainingConstraints.push({
                        file: cssFile,
                        constraints: widthConstraints
                    });
                }
            }
        });
        
        if (remainingConstraints.length > 0) {
            console.log('⚠️  Remaining width constraints found:');
            remainingConstraints.forEach(issue => {
                console.log(`   ${issue.file}:`);
                issue.constraints.forEach(constraint => {
                    console.log(`     ${constraint.substring(0, 80)}...`);
                });
            });
        } else {
            console.log('✅ No remaining width constraints found');
        }
        
        // Test 3: Verify Tailwind classes are still present in the form
        console.log('\n🔍 Test 3: Verifying Tailwind classes in form components...');
        
        const formFiles = [
            'src/modules/ui/components/AppLayout.js',
            'src/components/main-app.js'
        ];
        
        const tailwindClasses = [];
        
        formFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                
                // Look for Tailwind classes on form elements
                const classMatches = content.match(/className="[^"]*"/g) || [];
                const formClasses = classMatches.filter(match => 
                    match.includes('w-') || match.includes('flex') || match.includes('gap')
                );
                
                if (formClasses.length > 0) {
                    tailwindClasses.push({
                        file: file,
                        classes: formClasses
                    });
                }
            }
        });
        
        if (tailwindClasses.length > 0) {
            console.log('✅ Tailwind classes found in form components:');
            tailwindClasses.forEach(issue => {
                console.log(`   ${issue.file}:`);
                issue.classes.forEach(cls => {
                    console.log(`     ${cls}`);
                });
            });
        } else {
            console.log('⚠️  No Tailwind classes found in form components');
        }
        
        // Test 4: Check for any inline styles that might still interfere
        console.log('\n🔍 Test 4: Checking for inline styles...');
        
        const jsFiles = [
            'src/modules/ui/controllers/AppController.js',
            'src/components/main-app.js',
            'src/main-backup.js'
        ];
        
        const inlineStyleIssues = [];
        
        jsFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                
                // Look for inline style assignments
                const styleAssignments = content.match(/\.style\.[a-zA-Z]+\s*=\s*['"][^'"]*['"]/g) || [];
                const widthStyles = styleAssignments.filter(style => 
                    style.includes('width') || style.includes('display')
                );
                
                if (widthStyles.length > 0) {
                    inlineStyleIssues.push({
                        file: file,
                        styles: widthStyles
                    });
                }
            }
        });
        
        if (inlineStyleIssues.length > 0) {
            console.log('⚠️  Inline styles found that might interfere:');
            inlineStyleIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                issue.styles.forEach(style => {
                    console.log(`     ${style}`);
                });
            });
        } else {
            console.log('✅ No interfering inline styles found');
        }
        
        // Summary
        console.log('\n📋 FIX VERIFICATION SUMMARY:');
        console.log('=====================================');
        
        const styleFixed = styleQuizSection && !styleQuizSection[0].includes('width:') && !styleQuizSection[0].includes('max-width:');
        const layoutFixed = layoutQuizSection && !layoutQuizSection[0].includes('width:') && !layoutQuizSection[0].includes('max-width:');
        const noRemainingConstraints = remainingConstraints.length === 0;
        const tailwindPresent = tailwindClasses.length > 0;
        const noInlineStyles = inlineStyleIssues.length === 0;
        
        if (styleFixed && layoutFixed && noRemainingConstraints && tailwindPresent && noInlineStyles) {
            console.log('✅ ALL ISSUES RESOLVED!');
            console.log('   - Width constraints removed from quiz-section');
            console.log('   - No remaining width constraints');
            console.log('   - Tailwind classes present');
            console.log('   - No interfering inline styles');
            console.log('');
            console.log('🎯 The form should now display correctly with:');
            console.log('   - Input field taking available width');
            console.log('   - Submit button maintaining fixed width');
            console.log('   - Proper responsive layout');
        } else {
            console.log('⚠️  Some issues may remain:');
            if (!styleFixed) console.log('   - Style.css quiz-section still has width constraints');
            if (!layoutFixed) console.log('   - Layout.css quiz-section still has width constraints');
            if (!noRemainingConstraints) console.log('   - Other width constraints found');
            if (!tailwindPresent) console.log('   - Tailwind classes missing');
            if (!noInlineStyles) console.log('   - Inline styles still interfering');
        }
        
        console.log('\n🚀 NEXT STEPS:');
        console.log('1. Restart your dev server: npm run dev');
        console.log('2. Clear browser cache and hard refresh');
        console.log('3. Test the form layout');
        console.log('4. If still broken, check browser DevTools for computed styles');
        
    } catch (error) {
        console.error('❌ Verification test failed:', error.message);
    }
}

// Run the test
testLayoutFixVerification(); 
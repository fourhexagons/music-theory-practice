import fs from 'fs';
import path from 'path';

function testLayoutDeep() {
    console.log('🔍 Starting deep layout investigation...');
    
    try {
        // Test 1: Check all JavaScript files for style manipulation
        console.log('\n🔍 Test 1: Checking JavaScript files for style manipulation...');
        
        const jsFiles = [
            'src/modules/ui/components/AppLayout.js',
            'src/modules/ui/components/AnswerForm.js',
            'src/modules/ui/controllers/AppController.js',
            'src/main.js',
            'src/components/main-app.js'
        ];
        
        const styleManipulations = [];
        
        jsFiles.forEach(jsFile => {
            if (fs.existsSync(jsFile)) {
                const content = fs.readFileSync(jsFile, 'utf8');
                
                // Check for inline style manipulation
                const inlineStyleMatches = content.match(/\.style\.\w+\s*=/g) || [];
                const setAttributeMatches = content.match(/setAttribute\(['"]style['"]/g) || [];
                const classNameManipulations = content.match(/\.className\s*=/g) || [];
                const classListManipulations = content.match(/\.classList\./g) || [];
                
                if (inlineStyleMatches.length > 0 || setAttributeMatches.length > 0 || 
                    classNameManipulations.length > 0 || classListManipulations.length > 0) {
                    styleManipulations.push({
                        file: jsFile,
                        inlineStyles: inlineStyleMatches.length,
                        setAttribute: setAttributeMatches.length,
                        className: classNameManipulations.length,
                        classList: classListManipulations.length
                    });
                }
            }
        });
        
        if (styleManipulations.length > 0) {
            console.log('⚠️  JavaScript style manipulations found:');
            styleManipulations.forEach(manipulation => {
                console.log(`   ${manipulation.file}:`);
                console.log(`     Inline styles: ${manipulation.inlineStyles}`);
                console.log(`     setAttribute: ${manipulation.setAttribute}`);
                console.log(`     className: ${manipulation.className}`);
                console.log(`     classList: ${manipulation.classList}`);
            });
        } else {
            console.log('✅ No JavaScript style manipulations found');
        }
        
        // Test 2: Check for CSS specificity issues
        console.log('\n🔍 Test 2: Checking CSS specificity and cascade...');
        
        const cssFiles = [
            'src/styles/style.css',
            'src/styles/design-system.css',
            'src/styles/components/layout.css'
        ];
        
        const specificityIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                // Check for high specificity selectors
                const idSelectors = content.match(/#[a-zA-Z-]+/g) || [];
                const importantDeclarations = content.match(/!important/g) || [];
                const universalSelectors = content.match(/\*/g) || [];
                const elementSelectors = content.match(/^(form|input|button|div|section|main)\s*{/gm) || [];
                
                if (idSelectors.length > 0 || importantDeclarations.length > 0 || 
                    universalSelectors.length > 0 || elementSelectors.length > 0) {
                    specificityIssues.push({
                        file: cssFile,
                        idSelectors: idSelectors.length,
                        importantDeclarations: importantDeclarations.length,
                        universalSelectors: universalSelectors.length,
                        elementSelectors: elementSelectors.length
                    });
                }
            }
        });
        
        if (specificityIssues.length > 0) {
            console.log('⚠️  Potential CSS specificity issues:');
            specificityIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                console.log(`     ID selectors: ${issue.idSelectors}`);
                console.log(`     !important declarations: ${issue.importantDeclarations}`);
                console.log(`     Universal selectors (*): ${issue.universalSelectors}`);
                console.log(`     Element selectors: ${issue.elementSelectors}`);
            });
        } else {
            console.log('✅ No obvious CSS specificity issues');
        }
        
        // Test 3: Check for CSS custom properties that might interfere
        console.log('\n🔍 Test 3: Checking CSS custom properties...');
        
        const cssFiles2 = [
            'src/styles/style.css',
            'src/styles/design-system.css',
            'src/styles/variables.css'
        ];
        
        const customProperties = [];
        
        cssFiles2.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                // Check for width, flex, display related custom properties
                const widthProps = content.match(/--[a-zA-Z-]*width[a-zA-Z-]*:/g) || [];
                const flexProps = content.match(/--[a-zA-Z-]*flex[a-zA-Z-]*:/g) || [];
                const displayProps = content.match(/--[a-zA-Z-]*display[a-zA-Z-]*:/g) || [];
                const layoutProps = content.match(/--[a-zA-Z-]*layout[a-zA-Z-]*:/g) || [];
                
                if (widthProps.length > 0 || flexProps.length > 0 || 
                    displayProps.length > 0 || layoutProps.length > 0) {
                    customProperties.push({
                        file: cssFile,
                        widthProps: widthProps,
                        flexProps: flexProps,
                        displayProps: displayProps,
                        layoutProps: layoutProps
                    });
                }
            }
        });
        
        if (customProperties.length > 0) {
            console.log('⚠️  CSS custom properties that might affect layout:');
            customProperties.forEach(prop => {
                console.log(`   ${prop.file}:`);
                if (prop.widthProps.length > 0) console.log(`     Width props: ${prop.widthProps.join(', ')}`);
                if (prop.flexProps.length > 0) console.log(`     Flex props: ${prop.flexProps.join(', ')}`);
                if (prop.displayProps.length > 0) console.log(`     Display props: ${prop.displayProps.join(', ')}`);
                if (prop.layoutProps.length > 0) console.log(`     Layout props: ${prop.layoutProps.join(', ')}`);
            });
        } else {
            console.log('✅ No layout-affecting custom properties found');
        }
        
        // Test 4: Check for CSS imports and order
        console.log('\n🔍 Test 4: Checking CSS import order and structure...');
        
        const htmlFiles = [
            'src/index.html',
            'src/practice.html'
        ];
        
        const importIssues = [];
        
        htmlFiles.forEach(htmlFile => {
            if (fs.existsSync(htmlFile)) {
                const content = fs.readFileSync(htmlFile, 'utf8');
                
                // Check CSS import order
                const cssLinks = content.match(/<link[^>]*href="[^"]*\.css[^"]*"[^>]*>/g) || [];
                const styleTags = content.match(/<style[^>]*>[\s\S]*?<\/style>/g) || [];
                const tailwindImport = content.includes('tailwindcss.com') || content.includes('@tailwind');
                
                if (cssLinks.length > 0 || styleTags.length > 0) {
                    importIssues.push({
                        file: htmlFile,
                        cssLinks: cssLinks.length,
                        styleTags: styleTags.length,
                        hasTailwind: tailwindImport,
                        cssLinksContent: cssLinks.map(link => link.substring(0, 100) + '...')
                    });
                }
            }
        });
        
        if (importIssues.length > 0) {
            console.log('📦 CSS import analysis:');
            importIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                console.log(`     CSS links: ${issue.cssLinks}`);
                console.log(`     Style tags: ${issue.styleTags}`);
                console.log(`     Has Tailwind: ${issue.hasTailwind ? '✅' : '❌'}`);
                if (issue.cssLinksContent.length > 0) {
                    console.log(`     CSS links: ${issue.cssLinksContent.join(', ')}`);
                }
            });
        } else {
            console.log('✅ No CSS import issues found');
        }
        
        // Test 5: Check for potential CSS conflicts in specific selectors
        console.log('\n🔍 Test 5: Checking for specific CSS conflicts...');
        
        const conflictPatterns = [
            { pattern: /form\s*{[^}]*width[^}]*}/g, name: 'Form width rules' },
            { pattern: /input\s*{[^}]*width[^}]*}/g, name: 'Input width rules' },
            { pattern: /button\s*{[^}]*width[^}]*}/g, name: 'Button width rules' },
            { pattern: /\.w-full\s*{[^}]*}/g, name: 'w-full class overrides' },
            { pattern: /\.flex\s*{[^}]*}/g, name: 'flex class overrides' },
            { pattern: /\.flex-1\s*{[^}]*}/g, name: 'flex-1 class overrides' },
            { pattern: /\.shrink-0\s*{[^}]*}/g, name: 'shrink-0 class overrides' }
        ];
        
        const specificConflicts = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                conflictPatterns.forEach(pattern => {
                    const matches = content.match(pattern.pattern) || [];
                    if (matches.length > 0) {
                        specificConflicts.push({
                            file: cssFile,
                            pattern: pattern.name,
                            matches: matches.length,
                            content: matches.map(match => match.substring(0, 100) + '...')
                        });
                    }
                });
            }
        });
        
        if (specificConflicts.length > 0) {
            console.log('⚠️  Specific CSS conflicts found:');
            specificConflicts.forEach(conflict => {
                console.log(`   ${conflict.file} - ${conflict.pattern}: ${conflict.matches} matches`);
                conflict.content.forEach(content => {
                    console.log(`     ${content}`);
                });
            });
        } else {
            console.log('✅ No specific CSS conflicts found');
        }
        
        // Test 6: Check for CSS reset/normalize issues
        console.log('\n🔍 Test 6: Checking for CSS reset/normalize issues...');
        
        const resetPatterns = [
            { pattern: /\*\s*{[^}]*box-sizing[^}]*}/g, name: 'Universal box-sizing' },
            { pattern: /\*\s*{[^}]*margin[^}]*}/g, name: 'Universal margin reset' },
            { pattern: /\*\s*{[^}]*padding[^}]*}/g, name: 'Universal padding reset' },
            { pattern: /form\s*{[^}]*margin[^}]*}/g, name: 'Form margin reset' },
            { pattern: /input\s*{[^}]*margin[^}]*}/g, name: 'Input margin reset' },
            { pattern: /button\s*{[^}]*margin[^}]*}/g, name: 'Button margin reset' }
        ];
        
        const resetIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                resetPatterns.forEach(pattern => {
                    const matches = content.match(pattern.pattern) || [];
                    if (matches.length > 0) {
                        resetIssues.push({
                            file: cssFile,
                            pattern: pattern.name,
                            matches: matches.length,
                            content: matches.map(match => match.substring(0, 100) + '...')
                        });
                    }
                });
            }
        });
        
        if (resetIssues.length > 0) {
            console.log('⚠️  CSS reset/normalize issues found:');
            resetIssues.forEach(issue => {
                console.log(`   ${issue.file} - ${issue.pattern}: ${issue.matches} matches`);
                issue.content.forEach(content => {
                    console.log(`     ${content}`);
                });
            });
        } else {
            console.log('✅ No CSS reset/normalize issues found');
        }
        
        // Test 7: Check for Tailwind configuration issues
        console.log('\n🔍 Test 7: Checking Tailwind configuration...');
        
        const tailwindConfigPath = 'tailwind.config.js';
        if (fs.existsSync(tailwindConfigPath)) {
            const config = fs.readFileSync(tailwindConfigPath, 'utf8');
            
            const hasSrcContent = config.includes('src/');
            const hasPublicContent = config.includes('public/');
            const hasPurge = config.includes('purge') || config.includes('content');
            const hasSafelist = config.includes('safelist');
            const hasImportant = config.includes('important');
            
            console.log('📋 Tailwind config analysis:');
            console.log(`   Includes src/ content: ${hasSrcContent ? '✅' : '❌'}`);
            console.log(`   Includes public/ content: ${hasPublicContent ? '✅' : '❌'}`);
            console.log(`   Has purge/content config: ${hasPurge ? '✅' : '❌'}`);
            console.log(`   Has safelist: ${hasSafelist ? '✅' : '❌'}`);
            console.log(`   Has important config: ${hasImportant ? '✅' : '❌'}`);
            
            if (!hasSrcContent) {
                console.log('⚠️  Tailwind may not be scanning src/ directory');
            }
            
            if (hasImportant) {
                console.log('⚠️  Tailwind has important config that might cause conflicts');
            }
        } else {
            console.log('❌ Tailwind config not found');
        }
        
        // Summary and recommendations
        console.log('\n📋 DEEP DIAGNOSIS SUMMARY:');
        
        const hasJsManipulation = styleManipulations.length > 0;
        const hasSpecificityIssues = specificityIssues.length > 0;
        const hasCustomProps = customProperties.length > 0;
        const hasSpecificConflicts = specificConflicts.length > 0;
        const hasResetIssues = resetIssues.length > 0;
        
        if (hasJsManipulation) {
            console.log('❌ JAVASCRIPT INTERFERENCE: Found style manipulations that could override Tailwind');
        }
        
        if (hasSpecificityIssues) {
            console.log('❌ CSS SPECIFICITY: Found high-specificity selectors that could override Tailwind');
        }
        
        if (hasCustomProps) {
            console.log('⚠️  CUSTOM PROPERTIES: Found CSS custom properties that might affect layout');
        }
        
        if (hasSpecificConflicts) {
            console.log('❌ SPECIFIC CONFLICTS: Found CSS rules that directly conflict with Tailwind classes');
        }
        
        if (hasResetIssues) {
            console.log('⚠️  RESET ISSUES: Found CSS reset rules that might interfere with layout');
        }
        
        if (!hasJsManipulation && !hasSpecificityIssues && !hasSpecificConflicts) {
            console.log('✅ No obvious conflicts found in deep analysis');
            console.log('💡 The issue might be:');
            console.log('   1. Browser cache not cleared');
            console.log('   2. Tailwind build not regenerated');
            console.log('   3. CSS loading order issue');
            console.log('   4. JavaScript not executing properly');
        }
        
        console.log('\n🎯 RECOMMENDED NEXT STEPS:');
        
        if (hasJsManipulation) {
            console.log('1. Review JavaScript files for style manipulations');
        }
        
        if (hasSpecificityIssues) {
            console.log('2. Remove high-specificity CSS selectors');
        }
        
        if (hasSpecificConflicts) {
            console.log('3. Remove conflicting CSS rules');
        }
        
        console.log('4. Clear browser cache and restart dev server');
        console.log('5. Check browser DevTools for any JavaScript errors');
        console.log('6. Verify Tailwind is properly building CSS');
        
    } catch (error) {
        console.error('❌ Deep test failed:', error.message);
    }
}

// Run the test
testLayoutDeep(); 
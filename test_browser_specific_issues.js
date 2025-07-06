import fs from 'fs';
import path from 'path';

function checkBrowserSpecificIssues() {
    console.log('🔍 Browser-Specific Issues Check');
    console.log('=================================');
    
    try {
        // Test 1: Check for CSS @import statements
        console.log('\n🔍 Test 1: Checking for CSS @import statements...');
        
        const cssFiles = [
            'src/styles/style.css',
            'src/styles/components/layout.css',
            'src/styles/design-system.css'
        ];
        
        const importIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                const imports = content.match(/@import[^;]+;/g) || [];
                
                if (imports.length > 0) {
                    importIssues.push({
                        file: cssFile,
                        imports: imports
                    });
                }
            }
        });
        
        if (importIssues.length > 0) {
            console.log('⚠️  CSS @import statements found:');
            importIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                issue.imports.forEach(imp => {
                    console.log(`     ${imp}`);
                });
            });
        } else {
            console.log('✅ No CSS @import statements found');
        }
        
        // Test 2: Check for !important declarations
        console.log('\n🔍 Test 2: Checking for !important declarations...');
        
        const importantIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                const importantRules = content.match(/[^}]*!important[^}]*}/g) || [];
                const widthImportant = importantRules.filter(rule => 
                    rule.includes('width') || rule.includes('display') || rule.includes('flex')
                );
                
                if (widthImportant.length > 0) {
                    importantIssues.push({
                        file: cssFile,
                        rules: widthImportant
                    });
                }
            }
        });
        
        if (importantIssues.length > 0) {
            console.log('⚠️  !important declarations found that might override Tailwind:');
            importantIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                issue.rules.forEach(rule => {
                    console.log(`     ${rule.substring(0, 100)}...`);
                });
            });
        } else {
            console.log('✅ No !important declarations found');
        }
        
        // Test 3: Check for complex selectors with high specificity
        console.log('\n🔍 Test 3: Checking for complex selectors...');
        
        const complexSelectorIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                // Look for complex selectors
                const complexSelectors = [
                    /[^}]*:not\([^)]*\)[^}]*{[^}]*}/g,  // :not() selectors
                    /[^}]*:nth-[^}]*{[^}]*}/g,  // :nth-* selectors
                    /[^}]*:first-[^}]*{[^}]*}/g,  // :first-* selectors
                    /[^}]*:last-[^}]*{[^}]*}/g,  // :last-* selectors
                    /[^}]*:only-[^}]*{[^}]*}/g,  // :only-* selectors
                    /[^}]*\[[^\]]*\][^}]*{[^}]*}/g,  // Attribute selectors
                    /[^}]*>[^}]*{[^}]*}/g,  // Child selectors
                    /[^}]*\+[^}]*{[^}]*}/g,  // Adjacent sibling selectors
                    /[^}]*~[^}]*{[^}]*}/g   // General sibling selectors
                ];
                
                complexSelectors.forEach((pattern, index) => {
                    const matches = content.match(pattern) || [];
                    const widthMatches = matches.filter(match => 
                        match.includes('width') || match.includes('display') || match.includes('flex')
                    );
                    
                    if (widthMatches.length > 0) {
                        complexSelectorIssues.push({
                            file: cssFile,
                            pattern: pattern.toString(),
                            matches: widthMatches
                        });
                    }
                });
            }
        });
        
        if (complexSelectorIssues.length > 0) {
            console.log('⚠️  Complex selectors with high specificity found:');
            complexSelectorIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                console.log(`     Pattern: ${issue.pattern}`);
                issue.matches.forEach(match => {
                    console.log(`       ${match.substring(0, 80)}...`);
                });
            });
        } else {
            console.log('✅ No complex selectors found');
        }
        
        // Test 4: Check for CSS Grid usage
        console.log('\n🔍 Test 4: Checking for CSS Grid usage...');
        
        const gridIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                const gridProperties = [
                    'display: grid',
                    'grid-template-columns',
                    'grid-template-rows',
                    'grid-column',
                    'grid-row',
                    'grid-area',
                    'grid-gap',
                    'grid-template-areas'
                ];
                
                const foundGrid = gridProperties.filter(prop => content.includes(prop));
                
                if (foundGrid.length > 0) {
                    gridIssues.push({
                        file: cssFile,
                        properties: foundGrid
                    });
                }
            }
        });
        
        if (gridIssues.length > 0) {
            console.log('⚠️  CSS Grid properties found:');
            gridIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                issue.properties.forEach(prop => {
                    console.log(`     ${prop}`);
                });
            });
        } else {
            console.log('✅ No CSS Grid properties found');
        }
        
        // Test 5: Check for undefined CSS custom properties
        console.log('\n🔍 Test 5: Checking for CSS custom properties...');
        
        const customPropertyIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                // Find all CSS custom properties used
                const usedProps = content.match(/var\(--[^)]+\)/g) || [];
                const uniqueProps = [...new Set(usedProps.map(prop => prop.match(/--[^)]+/)[0]))];
                
                // Check if they're defined in variables.css
                const variablesFile = 'src/styles/variables.css';
                if (fs.existsSync(variablesFile)) {
                    const variablesContent = fs.readFileSync(variablesFile, 'utf8');
                    const undefinedProps = uniqueProps.filter(prop => !variablesContent.includes(prop));
                    
                    if (undefinedProps.length > 0) {
                        customPropertyIssues.push({
                            file: cssFile,
                            undefinedProps: undefinedProps
                        });
                    }
                }
            }
        });
        
        if (customPropertyIssues.length > 0) {
            console.log('⚠️  Undefined CSS custom properties found:');
            customPropertyIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                issue.undefinedProps.forEach(prop => {
                    console.log(`     ${prop}`);
                });
            });
        } else {
            console.log('✅ All CSS custom properties are defined');
        }
        
        // Test 6: Check for CSS that might be loaded after Tailwind
        console.log('\n🔍 Test 6: Checking for CSS loading order...');
        
        const htmlFiles = ['src/practice.html', 'src/index.html'];
        const cssAfterTailwind = [];
        
        htmlFiles.forEach(htmlFile => {
            if (fs.existsSync(htmlFile)) {
                const content = fs.readFileSync(htmlFile, 'utf8');
                
                // Look for <style> tags that might override Tailwind
                const styleTags = content.match(/<style[^>]*>[\s\S]*?<\/style>/g) || [];
                const inlineStyles = styleTags.filter(style => 
                    style.includes('width') || style.includes('display') || style.includes('flex')
                );
                
                if (inlineStyles.length > 0) {
                    cssAfterTailwind.push({
                        file: htmlFile,
                        styles: inlineStyles
                    });
                }
            }
        });
        
        if (cssAfterTailwind.length > 0) {
            console.log('⚠️  Inline styles found that might override Tailwind:');
            cssAfterTailwind.forEach(issue => {
                console.log(`   ${issue.file}:`);
                issue.styles.forEach(style => {
                    console.log(`     ${style.substring(0, 100)}...`);
                });
            });
        } else {
            console.log('✅ No inline styles found');
        }
        
        // Summary
        console.log('\n📋 BROWSER-SPECIFIC ISSUES SUMMARY:');
        console.log('=====================================');
        
        const totalIssues = importIssues.length + importantIssues.length + 
                           complexSelectorIssues.length + gridIssues.length + 
                           customPropertyIssues.length + cssAfterTailwind.length;
        
        if (totalIssues === 0) {
            console.log('✅ No browser-specific issues found');
            console.log('');
            console.log('💡 The issue might be:');
            console.log('   1. Browser-specific CSS rendering differences');
            console.log('   2. CSS cascade order not captured in static analysis');
            console.log('   3. JavaScript execution timing differences');
            console.log('   4. Browser cache or dev tools showing stale data');
            console.log('   5. Different screen size or zoom level');
        } else {
            console.log(`⚠️  Found ${totalIssues} potential browser-specific issues:`);
            if (importIssues.length > 0) console.log(`   - ${importIssues.length} CSS import issues`);
            if (importantIssues.length > 0) console.log(`   - ${importantIssues.length} !important issues`);
            if (complexSelectorIssues.length > 0) console.log(`   - ${complexSelectorIssues.length} complex selector issues`);
            if (gridIssues.length > 0) console.log(`   - ${gridIssues.length} CSS Grid issues`);
            if (customPropertyIssues.length > 0) console.log(`   - ${customPropertyIssues.length} custom property issues`);
            if (cssAfterTailwind.length > 0) console.log(`   - ${cssAfterTailwind.length} CSS loading order issues`);
        }
        
        console.log('\n🎯 NEXT STEPS:');
        console.log('1. Check browser DevTools for computed styles');
        console.log('2. Compare different browsers (Chrome, Firefox, Safari)');
        console.log('3. Check if issue is screen-size specific');
        console.log('4. Verify Tailwind is actually loaded in browser');
        console.log('5. Check for any JavaScript errors in console');
        
    } catch (error) {
        console.error('❌ Browser-specific check failed:', error.message);
    }
}

// Run the check
checkBrowserSpecificIssues(); 
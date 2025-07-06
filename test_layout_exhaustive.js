import fs from 'fs';
import path from 'path';

function testLayoutExhaustive() {
    console.log('🔍 EXHAUSTIVE Layout Investigation');
    console.log('=====================================');
    
    try {
        // Test 1: Check for CSS inheritance and parent container issues
        console.log('\n🔍 Test 1: Checking CSS inheritance and parent containers...');
        
        const cssFiles = [
            'src/styles/style.css',
            'src/styles/design-system.css',
            'src/styles/components/layout.css'
        ];
        
        const inheritanceIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                // Check for parent container styles that might constrain children
                const containerSelectors = [
                    /\.main-content\s*{[^}]*}/g,
                    /\.quiz-section\s*{[^}]*}/g,
                    /\.answer-container\s*{[^}]*}/g,
                    /#app-container\s*{[^}]*}/g,
                    /section\s*{[^}]*}/g,
                    /main\s*{[^}]*}/g,
                    /div\s*{[^}]*}/g
                ];
                
                containerSelectors.forEach((pattern, index) => {
                    const matches = content.match(pattern) || [];
                    matches.forEach(match => {
                        // Check if these containers have width, max-width, or flex constraints
                        if (match.includes('width') || match.includes('max-width') || 
                            match.includes('flex') || match.includes('display')) {
                            inheritanceIssues.push({
                                file: cssFile,
                                selector: pattern.toString(),
                                content: match.substring(0, 150) + '...',
                                hasWidth: match.includes('width'),
                                hasMaxWidth: match.includes('max-width'),
                                hasFlex: match.includes('flex'),
                                hasDisplay: match.includes('display')
                            });
                        }
                    });
                });
            }
        });
        
        if (inheritanceIssues.length > 0) {
            console.log('⚠️  Parent container constraints found:');
            inheritanceIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                console.log(`     Selector: ${issue.selector}`);
                console.log(`     Has width: ${issue.hasWidth}`);
                console.log(`     Has max-width: ${issue.hasMaxWidth}`);
                console.log(`     Has flex: ${issue.hasFlex}`);
                console.log(`     Has display: ${issue.hasDisplay}`);
                console.log(`     Content: ${issue.content}`);
            });
        } else {
            console.log('✅ No obvious parent container constraints');
        }
        
        // Test 2: Check for CSS custom properties that might be affecting layout
        console.log('\n🔍 Test 2: Checking CSS custom properties usage...');
        
        const customPropertyIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                // Find all CSS custom properties
                const customProps = content.match(/--[a-zA-Z-]+/g) || [];
                const uniqueProps = [...new Set(customProps)];
                
                // Check if any are used in width, flex, or display contexts
                const widthProps = uniqueProps.filter(prop => 
                    content.includes(`${prop}:`) && 
                    (content.includes('width') || content.includes('flex') || content.includes('display'))
                );
                
                if (widthProps.length > 0) {
                    customPropertyIssues.push({
                        file: cssFile,
                        props: widthProps,
                        allProps: uniqueProps
                    });
                }
            }
        });
        
        if (customPropertyIssues.length > 0) {
            console.log('⚠️  CSS custom properties that might affect layout:');
            customPropertyIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                console.log(`     Layout-affecting props: ${issue.props.join(', ')}`);
                console.log(`     All props: ${issue.allProps.slice(0, 10).join(', ')}...`);
            });
        } else {
            console.log('✅ No layout-affecting custom properties found');
        }
        
        // Test 3: Check for CSS calc() functions that might be constraining width
        console.log('\n🔍 Test 3: Checking CSS calc() functions...');
        
        const calcIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                const calcFunctions = content.match(/calc\([^)]*\)/g) || [];
                const widthCalcs = calcFunctions.filter(calc => 
                    calc.includes('width') || calc.includes('100%') || calc.includes('vw')
                );
                
                if (widthCalcs.length > 0) {
                    calcIssues.push({
                        file: cssFile,
                        calcFunctions: widthCalcs
                    });
                }
            }
        });
        
        if (calcIssues.length > 0) {
            console.log('⚠️  CSS calc() functions that might constrain width:');
            calcIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                issue.calcFunctions.forEach(calc => {
                    console.log(`     ${calc}`);
                });
            });
        } else {
            console.log('✅ No constraining calc() functions found');
        }
        
        // Test 4: Check for CSS Grid or other layout systems that might interfere
        console.log('\n🔍 Test 4: Checking for CSS Grid or other layout systems...');
        
        const layoutSystemIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                const hasGrid = content.includes('display: grid') || content.includes('grid-');
                const hasTable = content.includes('display: table') || content.includes('table-');
                const hasInlineBlock = content.includes('display: inline-block');
                const hasInline = content.includes('display: inline');
                
                if (hasGrid || hasTable || hasInlineBlock || hasInline) {
                    layoutSystemIssues.push({
                        file: cssFile,
                        hasGrid,
                        hasTable,
                        hasInlineBlock,
                        hasInline
                    });
                }
            }
        });
        
        if (layoutSystemIssues.length > 0) {
            console.log('⚠️  Other layout systems found that might interfere:');
            layoutSystemIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                console.log(`     Grid: ${issue.hasGrid}`);
                console.log(`     Table: ${issue.hasTable}`);
                console.log(`     Inline-block: ${issue.hasInlineBlock}`);
                console.log(`     Inline: ${issue.hasInline}`);
            });
        } else {
            console.log('✅ No conflicting layout systems found');
        }
        
        // Test 5: Check for CSS transforms that might affect layout
        console.log('\n🔍 Test 5: Checking for CSS transforms...');
        
        const transformIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                const transforms = content.match(/transform\s*:\s*[^;]+/g) || [];
                const scaleTransforms = transforms.filter(t => t.includes('scale'));
                const translateTransforms = transforms.filter(t => t.includes('translate'));
                
                if (scaleTransforms.length > 0 || translateTransforms.length > 0) {
                    transformIssues.push({
                        file: cssFile,
                        scaleTransforms,
                        translateTransforms,
                        allTransforms: transforms
                    });
                }
            }
        });
        
        if (transformIssues.length > 0) {
            console.log('⚠️  CSS transforms found that might affect layout:');
            transformIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                if (issue.scaleTransforms.length > 0) {
                    console.log(`     Scale transforms: ${issue.scaleTransforms.join(', ')}`);
                }
                if (issue.translateTransforms.length > 0) {
                    console.log(`     Translate transforms: ${issue.translateTransforms.join(', ')}`);
                }
            });
        } else {
            console.log('✅ No layout-affecting transforms found');
        }
        
        // Test 6: Check for CSS position absolute/fixed that might break layout
        console.log('\n🔍 Test 6: Checking for CSS positioning issues...');
        
        const positioningIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                const absolutePos = content.match(/position\s*:\s*absolute/g) || [];
                const fixedPos = content.match(/position\s*:\s*fixed/g) || [];
                const relativePos = content.match(/position\s*:\s*relative/g) || [];
                
                if (absolutePos.length > 0 || fixedPos.length > 0) {
                    positioningIssues.push({
                        file: cssFile,
                        absolute: absolutePos.length,
                        fixed: fixedPos.length,
                        relative: relativePos.length
                    });
                }
            }
        });
        
        if (positioningIssues.length > 0) {
            console.log('⚠️  CSS positioning that might break layout:');
            positioningIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                console.log(`     Absolute: ${issue.absolute}`);
                console.log(`     Fixed: ${issue.fixed}`);
                console.log(`     Relative: ${issue.relative}`);
            });
        } else {
            console.log('✅ No positioning issues found');
        }
        
        // Test 7: Check for CSS overflow that might hide content
        console.log('\n🔍 Test 7: Checking for CSS overflow issues...');
        
        const overflowIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                const overflowHidden = content.match(/overflow\s*:\s*hidden/g) || [];
                const overflowScroll = content.match(/overflow\s*:\s*scroll/g) || [];
                const overflowAuto = content.match(/overflow\s*:\s*auto/g) || [];
                
                if (overflowHidden.length > 0 || overflowScroll.length > 0 || overflowAuto.length > 0) {
                    overflowIssues.push({
                        file: cssFile,
                        hidden: overflowHidden.length,
                        scroll: overflowScroll.length,
                        auto: overflowAuto.length
                    });
                }
            }
        });
        
        if (overflowIssues.length > 0) {
            console.log('⚠️  CSS overflow that might hide content:');
            overflowIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                console.log(`     Hidden: ${issue.hidden}`);
                console.log(`     Scroll: ${issue.scroll}`);
                console.log(`     Auto: ${issue.auto}`);
            });
        } else {
            console.log('✅ No overflow issues found');
        }
        
        // Test 8: Check for CSS z-index stacking context issues
        console.log('\n🔍 Test 8: Checking for CSS z-index issues...');
        
        const zIndexIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                const zIndexRules = content.match(/z-index\s*:\s*[^;]+/g) || [];
                const highZIndex = zIndexRules.filter(rule => {
                    const value = rule.match(/z-index\s*:\s*([^;]+)/);
                    if (value) {
                        const num = parseInt(value[1]);
                        return !isNaN(num) && num > 100;
                    }
                    return false;
                });
                
                if (highZIndex.length > 0) {
                    zIndexIssues.push({
                        file: cssFile,
                        highZIndex: highZIndex
                    });
                }
            }
        });
        
        if (zIndexIssues.length > 0) {
            console.log('⚠️  High z-index values found:');
            zIndexIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                issue.highZIndex.forEach(rule => {
                    console.log(`     ${rule}`);
                });
            });
        } else {
            console.log('✅ No z-index issues found');
        }
        
        // Test 9: Check for CSS min-width/max-width constraints
        console.log('\n🔍 Test 9: Checking for width constraints...');
        
        const widthConstraintIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                const minWidthRules = content.match(/min-width\s*:\s*[^;]+/g) || [];
                const maxWidthRules = content.match(/max-width\s*:\s*[^;]+/g) || [];
                const widthRules = content.match(/width\s*:\s*[^;]+/g) || [];
                
                if (minWidthRules.length > 0 || maxWidthRules.length > 0 || widthRules.length > 0) {
                    widthConstraintIssues.push({
                        file: cssFile,
                        minWidth: minWidthRules,
                        maxWidth: maxWidthRules,
                        width: widthRules
                    });
                }
            }
        });
        
        if (widthConstraintIssues.length > 0) {
            console.log('⚠️  Width constraints found:');
            widthConstraintIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                if (issue.minWidth.length > 0) {
                    console.log(`     Min-width: ${issue.minWidth.join(', ')}`);
                }
                if (issue.maxWidth.length > 0) {
                    console.log(`     Max-width: ${issue.maxWidth.join(', ')}`);
                }
                if (issue.width.length > 0) {
                    console.log(`     Width: ${issue.width.join(', ')}`);
                }
            });
        } else {
            console.log('✅ No width constraints found');
        }
        
        // Test 10: Check for CSS flex-basis, flex-grow, flex-shrink issues
        console.log('\n🔍 Test 10: Checking for flex property issues...');
        
        const flexIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                const flexBasisRules = content.match(/flex-basis\s*:\s*[^;]+/g) || [];
                const flexGrowRules = content.match(/flex-grow\s*:\s*[^;]+/g) || [];
                const flexShrinkRules = content.match(/flex-shrink\s*:\s*[^;]+/g) || [];
                
                if (flexBasisRules.length > 0 || flexGrowRules.length > 0 || flexShrinkRules.length > 0) {
                    flexIssues.push({
                        file: cssFile,
                        flexBasis: flexBasisRules,
                        flexGrow: flexGrowRules,
                        flexShrink: flexShrinkRules
                    });
                }
            }
        });
        
        if (flexIssues.length > 0) {
            console.log('⚠️  Flex property issues found:');
            flexIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                if (issue.flexBasis.length > 0) {
                    console.log(`     Flex-basis: ${issue.flexBasis.join(', ')}`);
                }
                if (issue.flexGrow.length > 0) {
                    console.log(`     Flex-grow: ${issue.flexGrow.join(', ')}`);
                }
                if (issue.flexShrink.length > 0) {
                    console.log(`     Flex-shrink: ${issue.flexShrink.join(', ')}`);
                }
            });
        } else {
            console.log('✅ No flex property issues found');
        }
        
        // Summary and recommendations
        console.log('\n📋 EXHAUSTIVE DIAGNOSIS SUMMARY:');
        console.log('=====================================');
        
        const totalIssues = inheritanceIssues.length + customPropertyIssues.length + 
                           calcIssues.length + layoutSystemIssues.length + 
                           transformIssues.length + positioningIssues.length + 
                           overflowIssues.length + zIndexIssues.length + 
                           widthConstraintIssues.length + flexIssues.length;
        
        if (totalIssues === 0) {
            console.log('✅ No obvious CSS issues found in exhaustive analysis');
            console.log('');
            console.log('💡 The issue might be:');
            console.log('   1. Browser-specific CSS behavior');
            console.log('   2. CSS loading order or timing');
            console.log('   3. JavaScript execution timing');
            console.log('   4. Tailwind build process issue');
            console.log('   5. CSS specificity cascade we missed');
        } else {
            console.log(`⚠️  Found ${totalIssues} potential issues:`);
            if (inheritanceIssues.length > 0) console.log(`   - ${inheritanceIssues.length} parent container constraints`);
            if (customPropertyIssues.length > 0) console.log(`   - ${customPropertyIssues.length} custom property issues`);
            if (calcIssues.length > 0) console.log(`   - ${calcIssues.length} calc() function issues`);
            if (layoutSystemIssues.length > 0) console.log(`   - ${layoutSystemIssues.length} layout system conflicts`);
            if (transformIssues.length > 0) console.log(`   - ${transformIssues.length} transform issues`);
            if (positioningIssues.length > 0) console.log(`   - ${positioningIssues.length} positioning issues`);
            if (overflowIssues.length > 0) console.log(`   - ${overflowIssues.length} overflow issues`);
            if (zIndexIssues.length > 0) console.log(`   - ${zIndexIssues.length} z-index issues`);
            if (widthConstraintIssues.length > 0) console.log(`   - ${widthConstraintIssues.length} width constraint issues`);
            if (flexIssues.length > 0) console.log(`   - ${flexIssues.length} flex property issues`);
        }
        
        console.log('\n🎯 NEXT INVESTIGATION STEPS:');
        console.log('1. Check browser DevTools for computed styles');
        console.log('2. Verify CSS loading order in Network tab');
        console.log('3. Check for any JavaScript errors in Console');
        console.log('4. Test with a minimal HTML file to isolate the issue');
        console.log('5. Check if the issue is browser-specific');
        
    } catch (error) {
        console.error('❌ Exhaustive test failed:', error.message);
    }
}

// Run the test
testLayoutExhaustive(); 
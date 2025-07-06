import fs from 'fs';
import path from 'path';

function deepLayoutInvestigation() {
    console.log('🔍 DEEP Layout Investigation');
    console.log('=============================');
    
    try {
        // Test 1: Check for CSS specificity conflicts
        console.log('\n🔍 Test 1: Checking CSS specificity conflicts...');
        
        const cssFiles = [
            'src/styles/style.css',
            'src/styles/components/layout.css',
            'src/styles/design-system.css'
        ];
        
        const specificityIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                // Look for high-specificity selectors that might override Tailwind
                const highSpecificitySelectors = [
                    /#[a-zA-Z-]+\s*{[^}]*}/g,  // ID selectors
                    /\.quiz-section\s+[^{]*\s*{[^}]*}/g,  // Compound selectors with quiz-section
                    /form\s*{[^}]*}/g,  // Element selectors
                    /input\s*{[^}]*}/g,
                    /button\s*{[^}]*}/g,
                    /#answer-form\s*{[^}]*}/g,
                    /#answer-input\s*{[^}]*}/g,
                    /#submit-btn\s*{[^}]*}/g
                ];
                
                highSpecificitySelectors.forEach((pattern, index) => {
                    const matches = content.match(pattern) || [];
                    matches.forEach(match => {
                        // Check if these selectors have width-related properties
                        if (match.includes('width') || match.includes('display') || 
                            match.includes('flex') || match.includes('max-width') || 
                            match.includes('min-width')) {
                            specificityIssues.push({
                                file: cssFile,
                                selector: pattern.toString(),
                                content: match.substring(0, 150) + '...',
                                hasWidth: match.includes('width'),
                                hasDisplay: match.includes('display'),
                                hasFlex: match.includes('flex'),
                                hasMaxWidth: match.includes('max-width'),
                                hasMinWidth: match.includes('min-width')
                            });
                        }
                    });
                });
            }
        });
        
        if (specificityIssues.length > 0) {
            console.log('⚠️  High-specificity selectors found that might override Tailwind:');
            specificityIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                console.log(`     Selector: ${issue.selector}`);
                console.log(`     Has width: ${issue.hasWidth}`);
                console.log(`     Has display: ${issue.hasDisplay}`);
                console.log(`     Has flex: ${issue.hasFlex}`);
                console.log(`     Has max-width: ${issue.hasMaxWidth}`);
                console.log(`     Has min-width: ${issue.hasMinWidth}`);
                console.log(`     Content: ${issue.content}`);
            });
        } else {
            console.log('✅ No high-specificity conflicts found');
        }
        
        // Test 2: Check for CSS loading order issues
        console.log('\n🔍 Test 2: Checking CSS loading order...');
        
        const htmlFiles = ['src/practice.html', 'src/index.html'];
        let cssLinks = [];
        
        htmlFiles.forEach(htmlFile => {
            if (fs.existsSync(htmlFile)) {
                const content = fs.readFileSync(htmlFile, 'utf8');
                const linkMatches = content.match(/<link[^>]*rel="stylesheet"[^>]*>/g) || [];
                linkMatches.forEach(link => {
                    const href = link.match(/href="([^"]*)"/);
                    if (href) {
                        cssLinks.push({
                            file: htmlFile,
                            href: href[1],
                            isTailwind: href[1].includes('tailwind') || href[1].includes('style'),
                            order: cssLinks.length
                        });
                    }
                });
            }
        });
        
        if (cssLinks.length > 0) {
            console.log('📋 CSS loading order:');
            cssLinks.forEach(link => {
                console.log(`   ${link.order + 1}. ${link.href} (${link.file})`);
            });
            
            // Check if Tailwind comes after other CSS
            const tailwindIndex = cssLinks.findIndex(link => link.isTailwind);
            const nonTailwindAfter = cssLinks.slice(tailwindIndex + 1).filter(link => !link.isTailwind);
            
            if (nonTailwindAfter.length > 0) {
                console.log('⚠️  Non-Tailwind CSS loaded after Tailwind:');
                nonTailwindAfter.forEach(link => {
                    console.log(`     ${link.href} (${link.file})`);
                });
            } else {
                console.log('✅ CSS loading order appears correct');
            }
        } else {
            console.log('⚠️  No CSS links found in HTML files');
        }
        
        // Test 3: Check for JavaScript timing issues
        console.log('\n🔍 Test 3: Checking JavaScript timing issues...');
        
        const jsFiles = [
            'src/modules/ui/controllers/AppController.js',
            'src/components/main-app.js',
            'src/main-backup.js'
        ];
        
        const timingIssues = [];
        
        jsFiles.forEach(jsFile => {
            if (fs.existsSync(jsFile)) {
                const content = fs.readFileSync(jsFile, 'utf8');
                
                // Look for DOMContentLoaded, load, or other timing events
                const timingEvents = [
                    'DOMContentLoaded',
                    'load',
                    'readystatechange',
                    'setTimeout',
                    'setInterval',
                    'requestAnimationFrame'
                ];
                
                timingEvents.forEach(event => {
                    const matches = content.match(new RegExp(event, 'g')) || [];
                    if (matches.length > 0) {
                        timingIssues.push({
                            file: jsFile,
                            event: event,
                            count: matches.length
                        });
                    }
                });
                
                // Look for class manipulation that might happen after initial render
                const classManipulation = [
                    'classList.add',
                    'classList.remove',
                    'classList.toggle',
                    'className =',
                    'setAttribute.*class'
                ];
                
                classManipulation.forEach(manipulation => {
                    const matches = content.match(new RegExp(manipulation, 'g')) || [];
                    if (matches.length > 0) {
                        timingIssues.push({
                            file: jsFile,
                            event: manipulation,
                            count: matches.length
                        });
                    }
                });
            }
        });
        
        if (timingIssues.length > 0) {
            console.log('⚠️  Potential timing issues found:');
            timingIssues.forEach(issue => {
                console.log(`   ${issue.file}: ${issue.event} (${issue.count} occurrences)`);
            });
        } else {
            console.log('✅ No obvious timing issues found');
        }
        
        // Test 4: Check for browser-specific CSS behavior
        console.log('\n🔍 Test 4: Checking for browser-specific CSS...');
        
        const browserSpecificIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                // Look for vendor prefixes
                const vendorPrefixes = [
                    '-webkit-',
                    '-moz-',
                    '-ms-',
                    '-o-'
                ];
                
                vendorPrefixes.forEach(prefix => {
                    const matches = content.match(new RegExp(prefix + '[a-zA-Z-]+', 'g')) || [];
                    if (matches.length > 0) {
                        browserSpecificIssues.push({
                            file: cssFile,
                            prefix: prefix,
                            properties: matches.slice(0, 5) // Show first 5
                        });
                    }
                });
                
                // Look for browser-specific media queries
                const browserQueries = content.match(/@media[^{]*\{[^}]*\}/g) || [];
                const suspiciousQueries = browserQueries.filter(query => 
                    query.includes('webkit') || query.includes('moz') || 
                    query.includes('ms') || query.includes('o')
                );
                
                if (suspiciousQueries.length > 0) {
                    browserSpecificIssues.push({
                        file: cssFile,
                        type: 'media-query',
                        queries: suspiciousQueries
                    });
                }
            }
        });
        
        if (browserSpecificIssues.length > 0) {
            console.log('⚠️  Browser-specific CSS found:');
            browserSpecificIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                if (issue.prefix) {
                    console.log(`     ${issue.prefix} properties: ${issue.properties.join(', ')}`);
                }
                if (issue.type === 'media-query') {
                    console.log(`     Browser-specific media queries: ${issue.queries.length}`);
                }
            });
        } else {
            console.log('✅ No browser-specific CSS found');
        }
        
        // Test 5: Check for remaining width constraints in parent containers
        console.log('\n🔍 Test 5: Checking for parent container width constraints...');
        
        const parentConstraints = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                // Look for container selectors that might constrain children
                const containerSelectors = [
                    /\.main-content\s*{[^}]*}/g,
                    /#app-container\s*{[^}]*}/g,
                    /section\s*{[^}]*}/g,
                    /main\s*{[^}]*}/g,
                    /div\s*{[^}]*}/g,
                    /\.container\s*{[^}]*}/g,
                    /\.wrapper\s*{[^}]*}/g
                ];
                
                containerSelectors.forEach(pattern => {
                    const matches = content.match(pattern) || [];
                    matches.forEach(match => {
                        // Check for width constraints that might affect children
                        if (match.includes('width') || match.includes('max-width') || 
                            match.includes('overflow') || match.includes('position')) {
                            parentConstraints.push({
                                file: cssFile,
                                selector: pattern.toString(),
                                content: match.substring(0, 150) + '...',
                                hasWidth: match.includes('width'),
                                hasMaxWidth: match.includes('max-width'),
                                hasOverflow: match.includes('overflow'),
                                hasPosition: match.includes('position')
                            });
                        }
                    });
                });
            }
        });
        
        if (parentConstraints.length > 0) {
            console.log('⚠️  Parent container constraints found:');
            parentConstraints.forEach(constraint => {
                console.log(`   ${constraint.file}:`);
                console.log(`     Selector: ${constraint.selector}`);
                console.log(`     Has width: ${constraint.hasWidth}`);
                console.log(`     Has max-width: ${constraint.hasMaxWidth}`);
                console.log(`     Has overflow: ${constraint.hasOverflow}`);
                console.log(`     Has position: ${constraint.hasPosition}`);
                console.log(`     Content: ${constraint.content}`);
            });
        } else {
            console.log('✅ No parent container constraints found');
        }
        
        // Test 6: Check for CSS custom properties that might override Tailwind
        console.log('\n🔍 Test 6: Checking CSS custom properties...');
        
        const customPropertyIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                // Find all CSS custom properties
                const customProps = content.match(/--[a-zA-Z-]+/g) || [];
                const uniqueProps = [...new Set(customProps)];
                
                // Check if any are used in width contexts
                const widthProps = uniqueProps.filter(prop => {
                    const propName = prop.substring(2); // Remove --
                    const usagePattern = new RegExp(`${propName}\\s*:\\s*var\\(${prop}\\)`, 'g');
                    return content.match(usagePattern) && 
                           (content.includes('width') || content.includes('max-width') || content.includes('min-width'));
                });
                
                if (widthProps.length > 0) {
                    customPropertyIssues.push({
                        file: cssFile,
                        props: widthProps,
                        allProps: uniqueProps.slice(0, 10) // Show first 10
                    });
                }
            }
        });
        
        if (customPropertyIssues.length > 0) {
            console.log('⚠️  CSS custom properties that might affect width:');
            customPropertyIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                console.log(`     Width-affecting props: ${issue.props.join(', ')}`);
                console.log(`     All props: ${issue.allProps.join(', ')}...`);
            });
        } else {
            console.log('✅ No width-affecting custom properties found');
        }
        
        // Test 7: Check for media queries that might affect layout
        console.log('\n🔍 Test 7: Checking media queries...');
        
        const mediaQueryIssues = [];
        
        cssFiles.forEach(cssFile => {
            if (fs.existsSync(cssFile)) {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                // Find all media queries
                const mediaQueries = content.match(/@media[^{]*\{[^}]*\}/g) || [];
                
                mediaQueries.forEach(query => {
                    // Check if media query affects form elements
                    if (query.includes('form') || query.includes('input') || query.includes('button') ||
                        query.includes('answer-form') || query.includes('answer-input') || query.includes('submit-btn')) {
                        
                        // Check for width-related properties in media query
                        if (query.includes('width') || query.includes('flex') || query.includes('display')) {
                            mediaQueryIssues.push({
                                file: cssFile,
                                query: query.substring(0, 200) + '...',
                                hasWidth: query.includes('width'),
                                hasFlex: query.includes('flex'),
                                hasDisplay: query.includes('display')
                            });
                        }
                    }
                });
            }
        });
        
        if (mediaQueryIssues.length > 0) {
            console.log('⚠️  Media queries affecting form layout:');
            mediaQueryIssues.forEach(issue => {
                console.log(`   ${issue.file}:`);
                console.log(`     Has width: ${issue.hasWidth}`);
                console.log(`     Has flex: ${issue.hasFlex}`);
                console.log(`     Has display: ${issue.hasDisplay}`);
                console.log(`     Query: ${issue.query}`);
            });
        } else {
            console.log('✅ No form-affecting media queries found');
        }
        
        // Summary
        console.log('\n📋 DEEP INVESTIGATION SUMMARY:');
        console.log('=====================================');
        
        const totalIssues = specificityIssues.length + (cssLinks.length > 0 ? 1 : 0) + 
                           timingIssues.length + browserSpecificIssues.length + 
                           parentConstraints.length + customPropertyIssues.length + 
                           mediaQueryIssues.length;
        
        if (totalIssues === 0) {
            console.log('✅ No obvious issues found in deep investigation');
            console.log('');
            console.log('💡 The issue might be:');
            console.log('   1. Browser-specific rendering differences');
            console.log('   2. CSS cascade order not captured in static analysis');
            console.log('   3. JavaScript execution timing not captured');
            console.log('   4. Tailwind build process issue not visible in source');
            console.log('   5. Browser cache or dev tools showing stale data');
        } else {
            console.log(`⚠️  Found ${totalIssues} potential issues:`);
            if (specificityIssues.length > 0) console.log(`   - ${specificityIssues.length} specificity conflicts`);
            if (cssLinks.length > 0) console.log(`   - CSS loading order issues`);
            if (timingIssues.length > 0) console.log(`   - ${timingIssues.length} timing issues`);
            if (browserSpecificIssues.length > 0) console.log(`   - ${browserSpecificIssues.length} browser-specific issues`);
            if (parentConstraints.length > 0) console.log(`   - ${parentConstraints.length} parent container constraints`);
            if (customPropertyIssues.length > 0) console.log(`   - ${customPropertyIssues.length} custom property issues`);
            if (mediaQueryIssues.length > 0) console.log(`   - ${mediaQueryIssues.length} media query issues`);
        }
        
        console.log('\n🎯 NEXT STEPS:');
        console.log('1. Check browser DevTools for computed styles');
        console.log('2. Compare different browsers (Chrome, Firefox, Safari)');
        console.log('3. Check if issue is screen-size specific');
        console.log('4. Verify Tailwind is actually loaded in browser');
        console.log('5. Check for any JavaScript errors in console');
        
    } catch (error) {
        console.error('❌ Deep investigation failed:', error.message);
    }
}

// Run the investigation
deepLayoutInvestigation(); 
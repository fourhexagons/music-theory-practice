const puppeteer = require('puppeteer');
const path = require('path');

async function testLayoutHeadless() {
    console.log('🚀 Starting headless layout tests...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Set viewport to desktop size
        await page.setViewport({ width: 1200, height: 800 });
        
        // Navigate to your app
        const appUrl = 'http://localhost:5173/src/practice.html';
        console.log(`📱 Loading app at: ${appUrl}`);
        
        await page.goto(appUrl, { waitUntil: 'networkidle0', timeout: 10000 });
        
        // Wait for the app to load
        await page.waitForSelector('#answer-form', { timeout: 5000 });
        
        console.log('✅ App loaded successfully');
        
        // Test 1: Check current layout structure
        console.log('\n🔍 Test 1: Analyzing current layout...');
        
        const layoutData = await page.evaluate(() => {
            const form = document.getElementById('answer-form');
            const input = document.getElementById('answer-input');
            const button = document.getElementById('submit-btn');
            const container = form?.parentElement;
            
            if (!form || !input || !button) {
                return { error: 'Form elements not found' };
            }
            
            const formStyle = window.getComputedStyle(form);
            const inputStyle = window.getComputedStyle(input);
            const buttonStyle = window.getComputedStyle(button);
            const containerStyle = container ? window.getComputedStyle(container) : null;
            
            return {
                form: {
                    classes: form.className,
                    width: formStyle.width,
                    display: formStyle.display,
                    flexDirection: formStyle.flexDirection,
                    flexGrow: formStyle.flexGrow,
                    flexShrink: formStyle.flexShrink,
                    flexBasis: formStyle.flexBasis,
                    minWidth: formStyle.minWidth,
                    maxWidth: formStyle.maxWidth,
                    boxSizing: formStyle.boxSizing
                },
                input: {
                    classes: input.className,
                    width: inputStyle.width,
                    display: inputStyle.display,
                    flexGrow: inputStyle.flexGrow,
                    flexShrink: inputStyle.flexShrink,
                    flexBasis: inputStyle.flexBasis,
                    minWidth: inputStyle.minWidth,
                    maxWidth: inputStyle.maxWidth,
                    boxSizing: inputStyle.boxSizing
                },
                button: {
                    classes: button.className,
                    width: buttonStyle.width,
                    display: buttonStyle.display,
                    flexGrow: buttonStyle.flexGrow,
                    flexShrink: buttonStyle.flexShrink,
                    flexBasis: buttonStyle.flexBasis,
                    minWidth: buttonStyle.minWidth,
                    maxWidth: buttonStyle.maxWidth,
                    boxSizing: buttonStyle.boxSizing
                },
                container: container ? {
                    classes: container.className,
                    width: containerStyle.width,
                    display: containerStyle.display,
                    flexDirection: containerStyle.flexDirection,
                    maxWidth: containerStyle.maxWidth
                } : null
            };
        });
        
        if (layoutData.error) {
            console.error('❌ Error:', layoutData.error);
            return;
        }
        
        console.log('📊 Layout Analysis Results:');
        console.log('\n📋 Form:');
        console.log(`   Classes: "${layoutData.form.classes}"`);
        console.log(`   Width: ${layoutData.form.width}`);
        console.log(`   Display: ${layoutData.form.display}`);
        console.log(`   Flex Direction: ${layoutData.form.flexDirection}`);
        console.log(`   Flex Grow: ${layoutData.form.flexGrow}`);
        console.log(`   Flex Shrink: ${layoutData.form.flexShrink}`);
        console.log(`   Flex Basis: ${layoutData.form.flexBasis}`);
        console.log(`   Min Width: ${layoutData.form.minWidth}`);
        console.log(`   Max Width: ${layoutData.form.maxWidth}`);
        
        console.log('\n📝 Input:');
        console.log(`   Classes: "${layoutData.input.classes}"`);
        console.log(`   Width: ${layoutData.input.width}`);
        console.log(`   Display: ${layoutData.input.display}`);
        console.log(`   Flex Grow: ${layoutData.input.flexGrow}`);
        console.log(`   Flex Shrink: ${layoutData.input.flexShrink}`);
        console.log(`   Flex Basis: ${layoutData.input.flexBasis}`);
        console.log(`   Min Width: ${layoutData.input.minWidth}`);
        console.log(`   Max Width: ${layoutData.input.maxWidth}`);
        
        console.log('\n🔘 Button:');
        console.log(`   Classes: "${layoutData.button.classes}"`);
        console.log(`   Width: ${layoutData.button.width}`);
        console.log(`   Display: ${layoutData.button.display}`);
        console.log(`   Flex Grow: ${layoutData.button.flexGrow}`);
        console.log(`   Flex Shrink: ${layoutData.button.flexShrink}`);
        console.log(`   Flex Basis: ${layoutData.button.flexBasis}`);
        console.log(`   Min Width: ${layoutData.button.minWidth}`);
        console.log(`   Max Width: ${layoutData.button.maxWidth}`);
        
        if (layoutData.container) {
            console.log('\n📦 Container:');
            console.log(`   Classes: "${layoutData.container.classes}"`);
            console.log(`   Width: ${layoutData.container.width}`);
            console.log(`   Display: ${layoutData.container.display}`);
            console.log(`   Flex Direction: ${layoutData.container.flexDirection}`);
            console.log(`   Max Width: ${layoutData.container.maxWidth}`);
        }
        
        // Test 2: Check if Tailwind classes are being applied
        console.log('\n🔍 Test 2: Checking Tailwind class application...');
        
        const tailwindCheck = await page.evaluate(() => {
            const form = document.getElementById('answer-form');
            const input = document.getElementById('answer-input');
            const button = document.getElementById('submit-btn');
            
            const formClasses = form.className.split(' ');
            const inputClasses = input.className.split(' ');
            const buttonClasses = button.className.split(' ');
            
            const expectedFormClasses = ['w-full', 'block', 'flex', 'flex-col', 'md:flex-row', 'gap-2', 'mb-6'];
            const expectedInputClasses = ['flex-1', 'min-w-0', 'w-full', 'md:w-auto'];
            const expectedButtonClasses = ['w-full', 'md:w-40', 'shrink-0'];
            
            return {
                form: {
                    expected: expectedFormClasses,
                    actual: formClasses,
                    missing: expectedFormClasses.filter(c => !formClasses.includes(c)),
                    extra: formClasses.filter(c => !expectedFormClasses.includes(c) && c !== 'debug-border')
                },
                input: {
                    expected: expectedInputClasses,
                    actual: inputClasses,
                    missing: expectedInputClasses.filter(c => !inputClasses.includes(c)),
                    extra: inputClasses.filter(c => !expectedInputClasses.includes(c) && !c.includes('bg-') && !c.includes('text-') && !c.includes('border-') && !c.includes('px-') && !c.includes('py-') && !c.includes('rounded-') && !c.includes('font-') && !c.includes('outline-') && !c.includes('placeholder-') && !c.includes('focus-') && c !== 'debug-bg')
                },
                button: {
                    expected: expectedButtonClasses,
                    actual: buttonClasses,
                    missing: expectedButtonClasses.filter(c => !buttonClasses.includes(c)),
                    extra: buttonClasses.filter(c => !expectedButtonClasses.includes(c) && !c.includes('bg-') && !c.includes('text-') && !c.includes('border-') && !c.includes('px-') && !c.includes('py-') && !c.includes('rounded-') && !c.includes('font-') && !c.includes('cursor-') && !c.includes('transition-') && !c.includes('text-center') && !c.includes('outline-') && !c.includes('hover-') && !c.includes('active-') && !c.includes('disabled-') && c !== 'debug-bg')
                }
            };
        });
        
        console.log('\n🎨 Tailwind Class Analysis:');
        console.log('\n📋 Form Classes:');
        console.log(`   Expected: ${tailwindCheck.form.expected.join(', ')}`);
        console.log(`   Actual: ${tailwindCheck.form.actual.join(', ')}`);
        if (tailwindCheck.form.missing.length > 0) {
            console.log(`   ❌ Missing: ${tailwindCheck.form.missing.join(', ')}`);
        }
        if (tailwindCheck.form.extra.length > 0) {
            console.log(`   ⚠️  Extra: ${tailwindCheck.form.extra.join(', ')}`);
        }
        
        console.log('\n📝 Input Classes:');
        console.log(`   Expected: ${tailwindCheck.input.expected.join(', ')}`);
        console.log(`   Actual: ${tailwindCheck.input.actual.join(', ')}`);
        if (tailwindCheck.input.missing.length > 0) {
            console.log(`   ❌ Missing: ${tailwindCheck.input.missing.join(', ')}`);
        }
        if (tailwindCheck.input.extra.length > 0) {
            console.log(`   ⚠️  Extra: ${tailwindCheck.input.extra.join(', ')}`);
        }
        
        console.log('\n🔘 Button Classes:');
        console.log(`   Expected: ${tailwindCheck.button.expected.join(', ')}`);
        console.log(`   Actual: ${tailwindCheck.button.actual.join(', ')}`);
        if (tailwindCheck.button.missing.length > 0) {
            console.log(`   ❌ Missing: ${tailwindCheck.button.missing.join(', ')}`);
        }
        if (tailwindCheck.button.extra.length > 0) {
            console.log(`   ⚠️  Extra: ${tailwindCheck.button.extra.join(', ')}`);
        }
        
        // Test 3: Check for CSS conflicts
        console.log('\n🔍 Test 3: Checking for CSS conflicts...');
        
        const cssConflicts = await page.evaluate(() => {
            const form = document.getElementById('answer-form');
            const input = document.getElementById('answer-input');
            const button = document.getElementById('submit-btn');
            
            // Get all stylesheets
            const stylesheets = Array.from(document.styleSheets);
            const conflictingRules = [];
            
            stylesheets.forEach((sheet, sheetIndex) => {
                try {
                    const rules = Array.from(sheet.cssRules || sheet.rules || []);
                    rules.forEach((rule, ruleIndex) => {
                        if (rule.selectorText) {
                            const selectors = rule.selectorText.split(',').map(s => s.trim());
                            selectors.forEach(selector => {
                                // Check if this rule could affect our elements
                                if (selector.includes('form') || 
                                    selector.includes('input') || 
                                    selector.includes('button') ||
                                    selector.includes('#answer-form') ||
                                    selector.includes('#answer-input') ||
                                    selector.includes('#submit-btn') ||
                                    selector.includes('.btn') ||
                                    selector.includes('*')) {
                                    
                                    // Check if it has width, flex, or display properties
                                    const cssText = rule.cssText || rule.style.cssText;
                                    if (cssText.includes('width') || 
                                        cssText.includes('flex') || 
                                        cssText.includes('display') ||
                                        cssText.includes('min-width') ||
                                        cssText.includes('max-width')) {
                                        
                                        conflictingRules.push({
                                            sheetIndex,
                                            ruleIndex,
                                            selector,
                                            cssText: cssText.substring(0, 200) + '...'
                                        });
                                    }
                                }
                            });
                        }
                    });
                } catch (e) {
                    // Cross-origin stylesheets will throw errors
                }
            });
            
            return conflictingRules;
        });
        
        if (cssConflicts.length > 0) {
            console.log('\n⚠️  Potential CSS Conflicts Found:');
            cssConflicts.forEach((conflict, index) => {
                console.log(`\n   ${index + 1}. Sheet ${conflict.sheetIndex}, Rule ${conflict.ruleIndex}`);
                console.log(`      Selector: ${conflict.selector}`);
                console.log(`      CSS: ${conflict.cssText}`);
            });
        } else {
            console.log('\n✅ No obvious CSS conflicts found');
        }
        
        // Test 4: Check responsive behavior
        console.log('\n🔍 Test 4: Testing responsive behavior...');
        
        // Test mobile viewport
        await page.setViewport({ width: 375, height: 667 });
        await page.waitForTimeout(500);
        
        const mobileLayout = await page.evaluate(() => {
            const form = document.getElementById('answer-form');
            const input = document.getElementById('answer-input');
            const button = document.getElementById('submit-btn');
            
            return {
                formWidth: window.getComputedStyle(form).width,
                inputWidth: window.getComputedStyle(input).width,
                buttonWidth: window.getComputedStyle(button).width,
                formDisplay: window.getComputedStyle(form).display,
                formFlexDirection: window.getComputedStyle(form).flexDirection
            };
        });
        
        console.log('\n📱 Mobile Layout (375px):');
        console.log(`   Form Width: ${mobileLayout.formWidth}`);
        console.log(`   Input Width: ${mobileLayout.inputWidth}`);
        console.log(`   Button Width: ${mobileLayout.buttonWidth}`);
        console.log(`   Form Display: ${mobileLayout.formDisplay}`);
        console.log(`   Form Flex Direction: ${mobileLayout.formFlexDirection}`);
        
        // Test desktop viewport
        await page.setViewport({ width: 1200, height: 800 });
        await page.waitForTimeout(500);
        
        const desktopLayout = await page.evaluate(() => {
            const form = document.getElementById('answer-form');
            const input = document.getElementById('answer-input');
            const button = document.getElementById('submit-btn');
            
            return {
                formWidth: window.getComputedStyle(form).width,
                inputWidth: window.getComputedStyle(input).width,
                buttonWidth: window.getComputedStyle(button).width,
                formDisplay: window.getComputedStyle(form).display,
                formFlexDirection: window.getComputedStyle(form).flexDirection
            };
        });
        
        console.log('\n🖥️  Desktop Layout (1200px):');
        console.log(`   Form Width: ${desktopLayout.formWidth}`);
        console.log(`   Input Width: ${desktopLayout.inputWidth}`);
        console.log(`   Button Width: ${desktopLayout.buttonWidth}`);
        console.log(`   Form Display: ${desktopLayout.formDisplay}`);
        console.log(`   Form Flex Direction: ${desktopLayout.formFlexDirection}`);
        
        // Summary and diagnosis
        console.log('\n📋 DIAGNOSIS SUMMARY:');
        
        const isShrinking = layoutData.form.width !== '100%' || 
                           layoutData.input.width !== '100%' || 
                           layoutData.button.width !== '100%';
        
        if (isShrinking) {
            console.log('❌ ISSUE CONFIRMED: Elements are shrinking to fit content');
            console.log('   - Form width:', layoutData.form.width);
            console.log('   - Input width:', layoutData.input.width);
            console.log('   - Button width:', layoutData.button.width);
        } else {
            console.log('✅ Layout appears correct - elements are full width');
        }
        
        // Check if Tailwind is working
        const tailwindWorking = tailwindCheck.form.missing.length === 0 && 
                               tailwindCheck.input.missing.length === 0 && 
                               tailwindCheck.button.missing.length === 0;
        
        if (!tailwindWorking) {
            console.log('❌ TAILWIND ISSUE: Some expected classes are missing');
        } else {
            console.log('✅ Tailwind classes are properly applied');
        }
        
        if (cssConflicts.length > 0) {
            console.log('⚠️  CSS CONFLICTS: Found potential conflicting CSS rules');
        } else {
            console.log('✅ No obvious CSS conflicts detected');
        }
        
        console.log('\n🎯 RECOMMENDED NEXT STEPS:');
        if (isShrinking && tailwindWorking) {
            console.log('1. Check if parent containers are constraining width');
            console.log('2. Verify Tailwind config includes all necessary files');
            console.log('3. Check for any global CSS that might override flex behavior');
        } else if (!tailwindWorking) {
            console.log('1. Fix missing Tailwind classes in AppLayout.js');
            console.log('2. Check Tailwind build configuration');
            console.log('3. Verify Vite is properly processing Tailwind');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
        console.log('\n🏁 Headless tests completed');
    }
}

// Run the test
testLayoutHeadless().catch(console.error); 
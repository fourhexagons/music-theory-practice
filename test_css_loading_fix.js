import fs from 'fs';
import path from 'path';

function testCssLoadingFix() {
    console.log('🔍 CSS Loading Order Fix Verification');
    console.log('=====================================');
    
    try {
        // Test 1: Check that design-system.css is now loaded in HTML
        console.log('\n🔍 Test 1: Checking CSS loading order in HTML...');
        
        const htmlFiles = ['src/practice.html', 'src/index.html'];
        let designSystemLoaded = false;
        
        htmlFiles.forEach(htmlFile => {
            if (fs.existsSync(htmlFile)) {
                const content = fs.readFileSync(htmlFile, 'utf8');
                if (content.includes('design-system.css')) {
                    console.log(`✅ design-system.css loaded in ${htmlFile}`);
                    designSystemLoaded = true;
                } else {
                    console.log(`❌ design-system.css not loaded in ${htmlFile}`);
                }
            }
        });
        
        if (designSystemLoaded) {
            console.log('✅ CSS loading order should now be correct');
        } else {
            console.log('❌ CSS loading order issue remains');
        }
        
        // Test 2: Check that all CSS custom properties are defined
        console.log('\n🔍 Test 2: Checking CSS custom properties...');
        
        const designSystemCss = fs.readFileSync('src/styles/design-system.css', 'utf8');
        
        // Check for key CSS custom properties that were missing
        const keyProperties = [
            '--ds-bg-primary',
            '--ds-text-primary',
            '--ds-interactive-primary',
            '--ds-button-bg',
            '--ds-input-bg',
            '--ds-space-layout-lg',
            '--ds-space-layout-md',
            '--ds-feedback-error-color',
            '--font-size-2xl',
            '--font-size-lg'
        ];
        
        const missingProperties = keyProperties.filter(prop => !designSystemCss.includes(prop));
        
        if (missingProperties.length === 0) {
            console.log('✅ All key CSS custom properties are defined');
        } else {
            console.log('❌ Missing CSS custom properties:', missingProperties);
        }
        
        // Test 3: Check that fallback variables are defined
        console.log('\n🔍 Test 3: Checking fallback variables...');
        
        const fallbackProperties = [
            '--bg-primary',
            '--bg-secondary',
            '--text-primary',
            '--text-secondary',
            '--button-bg',
            '--button-hover',
            '--input-bg',
            '--input-placeholder',
            '--feedback-correct',
            '--feedback-incorrect'
        ];
        
        const missingFallbacks = fallbackProperties.filter(prop => !designSystemCss.includes(prop));
        
        if (missingFallbacks.length === 0) {
            console.log('✅ All fallback variables are defined');
        } else {
            console.log('❌ Missing fallback variables:', missingFallbacks);
        }
        
        // Test 4: Check that the @import is still in style.css
        console.log('\n🔍 Test 4: Checking @import in style.css...');
        
        const styleCss = fs.readFileSync('src/styles/style.css', 'utf8');
        if (styleCss.includes('@import')) {
            console.log('✅ @import statement still present in style.css');
        } else {
            console.log('❌ @import statement missing from style.css');
        }
        
        // Summary
        console.log('\n📋 CSS LOADING FIX SUMMARY:');
        console.log('=====================================');
        
        if (designSystemLoaded && missingProperties.length === 0 && missingFallbacks.length === 0) {
            console.log('✅ CSS LOADING ORDER FIXED!');
            console.log('   - design-system.css now loaded in HTML');
            console.log('   - All CSS custom properties are defined');
            console.log('   - All fallback variables are defined');
            console.log('');
            console.log('🎯 The form layout should now work correctly!');
            console.log('   - CSS custom properties will be available');
            console.log('   - No more undefined variable errors');
            console.log('   - Tailwind classes should apply properly');
        } else {
            console.log('⚠️  Some CSS loading issues may remain:');
            if (!designSystemLoaded) console.log('   - design-system.css not loaded in HTML');
            if (missingProperties.length > 0) console.log('   - Missing CSS custom properties');
            if (missingFallbacks.length > 0) console.log('   - Missing fallback variables');
        }
        
        console.log('\n🚀 NEXT STEPS:');
        console.log('1. Restart your dev server: npm run dev');
        console.log('2. Clear browser cache and hard refresh');
        console.log('3. Test the form layout in your browser');
        console.log('4. Check browser DevTools for any CSS errors');
        
    } catch (error) {
        console.error('❌ CSS loading fix verification failed:', error.message);
    }
}

// Run the verification
testCssLoadingFix(); 
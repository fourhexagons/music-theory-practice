import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

function analyzeRenderedForm() {
  console.log('🔍 Rendered Form Analysis');
  console.log('========================');

  // Try both src/practice.html and src/index.html
  const htmlFiles = [
    'src/practice.html',
    'src/index.html',
    'practice.html',
    'index.html'
  ];
  let html = null;
  let htmlFile = null;
  for (const file of htmlFiles) {
    if (fs.existsSync(file)) {
      html = fs.readFileSync(file, 'utf8');
      htmlFile = file;
      break;
    }
  }
  if (!html) {
    console.log('❌ No HTML file found to analyze.');
    return;
  }
  console.log(`Analyzing: ${htmlFile}`);

  const dom = new JSDOM(html);
  const document = dom.window.document;

  // 1. Find the answer form
  const form = document.querySelector('#answer-form');
  if (!form) {
    console.log('❌ No #answer-form found in HTML.');
  } else {
    console.log('✅ #answer-form found.');
    // Check for expected Tailwind classes
    const formClass = form.getAttribute('class') || '';
    const input = form.querySelector('input#answer-input');
    const button = form.querySelector('button#submit-btn');
    const inputClass = input ? input.getAttribute('class') || '' : '';
    const buttonClass = button ? button.getAttribute('class') || '' : '';

    // Expected classes
    const expectedFormClasses = ['w-full', 'flex', 'gap-2'];
    const expectedInputClasses = ['flex-1', 'w-full', 'min-w-0'];
    const expectedButtonClasses = ['w-full', 'md:w-40', 'shrink-0'];

    const missingForm = expectedFormClasses.filter(cls => !formClass.includes(cls));
    const missingInput = expectedInputClasses.filter(cls => !inputClass.includes(cls));
    const missingButton = expectedButtonClasses.filter(cls => !buttonClass.includes(cls));

    if (missingForm.length === 0) {
      console.log('   ✅ All expected Tailwind classes present on <form>');
    } else {
      console.log('   ❌ Missing Tailwind classes on <form>:', missingForm);
    }
    if (missingInput.length === 0) {
      console.log('   ✅ All expected Tailwind classes present on <input>');
    } else {
      console.log('   ❌ Missing Tailwind classes on <input>:', missingInput);
    }
    if (missingButton.length === 0) {
      console.log('   ✅ All expected Tailwind classes present on <button>');
    } else {
      console.log('   ❌ Missing Tailwind classes on <button>:', missingButton);
    }
  }

  // 2. Check for custom elements or shadow roots
  const allElements = Array.from(document.querySelectorAll('*'));
  const customElements = allElements.filter(el => el.tagName.includes('-'));
  if (customElements.length > 0) {
    console.log('⚠️  Custom elements found:', customElements.map(el => el.tagName));
  } else {
    console.log('✅ No custom elements found.');
  }

  // 3. Check for <style> or <link> tags that might override Tailwind
  const styleTags = Array.from(document.querySelectorAll('style'));
  const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  let tailwindFound = false;
  const suspiciousStyles = [];
  linkTags.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.includes('tailwind')) tailwindFound = true;
    if (!href.includes('tailwind') && !href.includes('fonts')) suspiciousStyles.push(href);
  });
  if (tailwindFound) {
    console.log('✅ Tailwind CSS is linked.');
  } else {
    console.log('❌ Tailwind CSS not found in <link> tags.');
  }
  if (suspiciousStyles.length > 0) {
    console.log('⚠️  Other CSS files linked:', suspiciousStyles);
  } else {
    console.log('✅ No suspicious CSS files linked.');
  }
  if (styleTags.length > 0) {
    console.log(`⚠️  ${styleTags.length} <style> tags found.`);
  } else {
    console.log('✅ No <style> tags found.');
  }

  // 4. Check for malformed HTML (unclosed tags, etc.)
  // jsdom is forgiving, but we can check for some common issues
  const htmlLower = html.toLowerCase();
  if (htmlLower.includes('<form') && !htmlLower.includes('</form>')) {
    console.log('❌ Malformed HTML: <form> tag not closed.');
  } else {
    console.log('✅ No obvious malformed HTML.');
  }

  console.log('\n🎯 Rendered form analysis complete.');
}

analyzeRenderedForm(); 
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function checkFormLayout() {
  const LOCAL_URL = 'http://localhost:5173/practice';
  const FILE_URL = 'file://' + path.resolve(__dirname, 'dist/practice.html');
  let url = LOCAL_URL;
  let browser, page;
  let usedFallback = false;

  async function printComputedStyles(page, handle, label) {
    const styles = await page.evaluate(el => {
      const s = window.getComputedStyle(el);
      return {
        display: s.display,
        width: s.width,
        minWidth: s.minWidth,
        maxWidth: s.maxWidth,
        flex: s.flex,
        flexGrow: s.flexGrow,
        flexShrink: s.flexShrink,
        flexBasis: s.flexBasis,
        margin: s.margin,
        padding: s.padding,
        boxSizing: s.boxSizing,
      };
    }, handle);
    console.log(`\n--- Computed styles for ${label} ---`);
    Object.entries(styles).forEach(([k, v]) => {
      console.log(`${k}: ${v}`);
    });
  }

  try {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    // Try local dev server first
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 5000 });
    } catch (e) {
      // Fallback to file
      url = FILE_URL;
      usedFallback = true;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
    }
    console.log(`Analyzing: ${url}`);

    // Wait for the form to appear
    await page.waitForSelector('#answer-form', { timeout: 10000 });
    const formHandle = await page.$('#answer-form');
    const inputHandle = await page.$('#answer-input');
    const buttonHandle = await page.$('#submit-btn');

    // Get class lists
    const formClass = await page.evaluate(el => el.className, formHandle);
    const inputClass = await page.evaluate(el => el.className, inputHandle);
    const buttonClass = await page.evaluate(el => el.className, buttonHandle);

    // Expected classes
    const expectedFormClasses = ['w-full', 'flex', 'gap-2'];
    const expectedInputClasses = ['flex-1', 'w-full', 'min-w-0'];
    const expectedButtonClasses = ['w-full', 'md:w-40', 'shrink-0'];

    const missingForm = expectedFormClasses.filter(cls => !formClass.includes(cls));
    const missingInput = expectedInputClasses.filter(cls => !inputClass.includes(cls));
    const missingButton = expectedButtonClasses.filter(cls => !buttonClass.includes(cls));

    // Print class results
    console.log('\n--- Tailwind Class Presence ---');
    if (missingForm.length === 0) {
      console.log('✅ All expected Tailwind classes present on <form>');
    } else {
      console.log('❌ Missing Tailwind classes on <form>:', missingForm);
    }
    if (missingInput.length === 0) {
      console.log('✅ All expected Tailwind classes present on <input>');
    } else {
      console.log('❌ Missing Tailwind classes on <input>:', missingInput);
    }
    if (missingButton.length === 0) {
      console.log('✅ All expected Tailwind classes present on <button>');
    } else {
      console.log('❌ Missing Tailwind classes on <button>:', missingButton);
    }

    // Print computed styles
    await printComputedStyles(page, formHandle, 'form');
    await printComputedStyles(page, inputHandle, 'input');
    await printComputedStyles(page, buttonHandle, 'button');

    // Check for layout issues
    const inputRect = await page.evaluate(el => {
      const r = el.getBoundingClientRect();
      return { width: r.width, left: r.left, right: r.right };
    }, inputHandle);
    const buttonRect = await page.evaluate(el => {
      const r = el.getBoundingClientRect();
      return { width: r.width, left: r.left, right: r.right };
    }, buttonHandle);
    console.log(`\n--- Element widths (px) ---`);
    console.log(`Input:  ${inputRect.width}`);
    console.log(`Button: ${buttonRect.width}`);

    // Final verdict
    if (missingForm.length === 0 && missingInput.length === 0 && missingButton.length === 0) {
      console.log('\n✅ PASS: All expected Tailwind classes present.');
    } else {
      console.log('\n❌ FAIL: Some expected Tailwind classes are missing.');
    }
    if (inputRect.width < 100) {
      console.log('❌ Input is too narrow.');
    }
    if (buttonRect.width < 80) {
      console.log('❌ Button is too narrow.');
    }
    if (inputRect.width > 200 && buttonRect.width > 80) {
      console.log('✅ Layout appears correct.');
    }

    await browser.close();
  } catch (err) {
    if (browser) await browser.close();
    console.error('❌ Puppeteer test failed:', err.message);
    if (usedFallback) {
      console.error('Tried both dev server and static file.');
    }
  }
}

checkFormLayout(); 
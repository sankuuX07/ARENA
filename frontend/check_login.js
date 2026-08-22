const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => {
    console.error('REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  console.log('Navigating to login page...');
  try {
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2', timeout: 10000 });
    console.log('Page loaded. Checking for errors...');
    
    // Check if the React error overlay is present (Vite's overlay)
    const errorOverlay = await page.$('vite-error-overlay');
    if (errorOverlay) {
      console.error('Vite Error Overlay found!');
    } else {
      console.log('No Vite error overlay.');
    }

  } catch (e) {
    console.error('Navigation error:', e);
  } finally {
    await browser.close();
  }
})();

const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  console.log('Navigating to signup page...');
  try {
    await page.goto('http://localhost:5173/signup', { waitUntil: 'networkidle2', timeout: 10000 });
    
    console.log('Filling form...');
    // The exact selectors depend on the app, I will try standard ones.
    await page.type('input[type="text"]', 'Test User');
    await page.type('input[type="email"]', 'test@example.com');
    await page.type('input[type="password"]', 'password123');
    
    // Check if there's a confirm password
    const confirmPass = await page.$('input[name="confirmPassword"]');
    if (confirmPass) {
        await page.type('input[name="confirmPassword"]', 'password123');
    }
    
    console.log('Submitting...');
    await page.click('button[type="submit"]');
    
    // Wait a bit for the error to appear
    await new Promise(r => setTimeout(r, 3000));
    
    // Scrape the whole page text to see if the error is there
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('Page contains api-key-not-valid:', pageText.includes('api-key-not-valid'));
    if (pageText.includes('api-key-not-valid')) {
        console.error('ERROR: API Key is invalid during Auth request!');
    } else {
        console.log('SUCCESS: No API key error found in the page text.');
    }
  } catch (e) {
    console.error('Navigation error:', e);
  } finally {
    await browser.close();
  }
})();

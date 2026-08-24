const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('request', request => {
    if (request.url().includes('identitytoolkit.googleapis.com')) {
      console.log('AUTH REQUEST URL:', request.url());
    }
  });
  
  console.log('Navigating to register page...');
  try {
    await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle2', timeout: 10000 });
    
    console.log('Filling form...');
    await page.type('#register-fullname', 'Test User');
    await page.type('#register-email', 'test999@example.com');
    await page.type('#register-password', 'password123');
    await page.type('#register-confirm-password', 'password123');
    
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

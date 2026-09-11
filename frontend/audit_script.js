import puppeteer from 'puppeteer';

(async () => {
  console.log('Starting audit...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const requests = [];
  
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      startTime: Date.now(),
      status: null,
      duration: null,
    });
  });

  page.on('response', response => {
    const req = requests.find(r => r.url === response.request().url() && r.status === null);
    if (req) {
      req.status = response.status();
      req.duration = Date.now() - req.startTime;
    }
  });

  page.on('requestfailed', request => {
    const req = requests.find(r => r.url === request.url() && r.status === null);
    if (req) {
      req.status = 'failed';
      req.duration = Date.now() - req.startTime;
    }
  });

  // Handle console messages
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`[BROWSER ERROR] ${err.toString()}`);
  });

  console.log('Navigating to app...');
  await page.goto('http://localhost:5173/register');
  
  // Register a user
  await page.type('input[type="text"]', 'Test User'); // Name
  await page.type('input[type="email"]', 'test@example.com');
  await page.type('input[type="password"]', 'password123'); // Password
  // confirm password if exists
  const confirmInputs = await page.$$('input[type="password"]');
  if(confirmInputs.length > 1) {
      await confirmInputs[1].type('password123');
  }
  
  // Click submit (find button)
  console.log('Registering/Logging in...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const submitBtn = btns.find(b => b.textContent.toLowerCase().includes('create') || b.textContent.toLowerCase().includes('sign up'));
    if(submitBtn) submitBtn.click();
  });

  await new Promise(r => setTimeout(r, 2000));
  
  // Now we should be on dashboard. Wait for network idle or just 10 seconds.
  console.log('Waiting for Dashboard to load and stabilize (10s)...');
  await new Promise(r => setTimeout(r, 10000));

  console.log('--- Network Audit ---');
  requests.forEach(r => {
    if(r.url.startsWith('http://localhost:8000') || r.url.includes('api')) {
      console.log(`[API] ${r.method} ${r.url} - Status: ${r.status} - Time: ${r.duration}ms`);
    }
  });
  
  await browser.close();
  console.log('Audit finished.');
})();

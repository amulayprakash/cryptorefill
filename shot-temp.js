const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/ASUS/AppData/Local/Temp/claude/c--Users-ASUS-Desktop-QUAGNITIA-offer-website/2b2b7f1b-b35f-424d-a0c6-b0a29792be6f/scratchpad/full.png', fullPage: false });

  const header = await page.$('header');
  if (header) await header.screenshot({ path: 'C:/Users/ASUS/AppData/Local/Temp/claude/c--Users-ASUS-Desktop-QUAGNITIA-offer-website/2b2b7f1b-b35f-424d-a0c6-b0a29792be6f/scratchpad/header.png' });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  const footer = await page.$('footer');
  if (footer) await footer.screenshot({ path: 'C:/Users/ASUS/AppData/Local/Temp/claude/c--Users-ASUS-Desktop-QUAGNITIA-offer-website/2b2b7f1b-b35f-424d-a0c6-b0a29792be6f/scratchpad/footer.png' });

  // Check favicon link
  const faviconHref = await page.evaluate(() => document.querySelector("link[rel~='icon']")?.href);
  console.log('favicon href:', faviconHref);

  await browser.close();
})();

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const screenshotsDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

// Find next available N
let n = 1;
while (fs.existsSync(path.join(screenshotsDir, `screenshot-${n}${label ? '-' + label : ''}.png`))) n++;
const filename = `screenshot-${n}${label ? '-' + label : ''}.png`;
const filepath = path.join(screenshotsDir, filename);

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
// Scroll through the page to trigger IntersectionObserver for all elements
await page.evaluate(async () => {
  await new Promise(resolve => {
    let total = document.body.scrollHeight;
    let step = 400;
    let pos = 0;
    const id = setInterval(() => {
      window.scrollBy(0, step);
      pos += step;
      if (pos >= total) { clearInterval(id); window.scrollTo(0, 0); setTimeout(resolve, 400); }
    }, 80);
  });
});
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: filepath, fullPage: true });
await browser.close();
console.log(`Screenshot saved: temporary screenshots/${filename}`);

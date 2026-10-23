// Production-build smoke test: opens the page, clicks a project's "Open demo"
// button (which triggers the lazy DemoDialog chunk), and verifies the modal.
//   node scripts/smoke.mjs [url] (default http://localhost:4173)
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:4173/";
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-proxy-server", "--disable-gpu"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
const errors = [];
page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
page.on("requestfailed", (req) => errors.push(`requestfailed: ${req.url()}`));

await page.goto(url, { waitUntil: "networkidle0" });

const title = await page.title();
const h1 = await page.$eval("h1", (el) => el.textContent.trim());

// Click the first "Open demo" button.
await page.evaluate(() => {
  const buttons = [...document.querySelectorAll("button")];
  const btn = buttons.find((b) => b.textContent.includes("Open demo"));
  btn?.scrollIntoView({ block: "center" });
  btn?.click();
});
await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
const dialogText = await page.$eval('[role="dialog"]', (el) => el.textContent.trim().slice(0, 120));

// Close it with Escape.
await page.keyboard.press("Escape");
await new Promise((r) => setTimeout(r, 300));
const dialogGone = (await page.$('[role="dialog"]')) === null;

console.log(JSON.stringify({ title, h1, dialogText, dialogGone, errors }, null, 2));
await browser.close();

const failed = errors.length || !dialogText || !dialogGone;
process.exit(failed ? 1 : 0);

// Measures document scrollWidth vs innerWidth at common viewports and reports
// which elements extend past the viewport edge. Run with:
//   node scripts/audit-overflow.mjs [url] (default http://localhost:4173)
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:4173/";
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const viewports = [
  { name: "mobile-sm", width: 360, height: 780 },
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "desktop", width: 1440, height: 900 },
];

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: "new",
  args: ["--no-proxy-server", "--disable-gpu"],
});

let foundOverflow = false;

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height });
  await page.goto(url, { waitUntil: "networkidle0" });
  // Let lazy reveal animations settle.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 700));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 400));

  const report = await page.evaluate((vw) => {
    const doc = document.documentElement;
    const overflowX = doc.scrollWidth - vw;
    // Find elements whose right edge exceeds the viewport (allow 1px tolerance).
    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      const rect = el.getBoundingClientRect();
      if (rect.right > vw + 1 && rect.width > 0 && getComputedStyle(el).position !== "fixed") {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: String(el.className?.baseVal ?? el.className).slice(0, 90),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        });
        if (offenders.length >= 8) break;
      }
    }
    return { scrollWidth: doc.scrollWidth, bodyScrollWidth: document.body.scrollWidth, overflowX, offenders };
  }, vp.width);

  if (report.overflowX > 1) foundOverflow = true;
  console.log(`\n=== ${vp.name} (${vp.width}px) ===`);
  console.log(`scrollWidth=${report.scrollWidth} overflowX=${report.overflowX}`);
  if (report.offenders.length) {
    for (const o of report.offenders) {
      console.log(`  <- <${o.tag}> right=${o.right} width=${o.width} class="${o.cls}"`);
    }
  } else {
    console.log("  no viewport offenders");
  }
  await page.close();
}

await browser.close();
process.exit(foundOverflow ? 1 : 0);

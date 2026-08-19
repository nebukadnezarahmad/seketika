/* Alat bantu pengembangan: memotret layar aplikasi pada ukuran ponsel
   yang sama dengan papan Figma, lalu menyusunnya berdampingan supaya
   mudah dibandingkan dengan rancangannya. */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const jalur = process.argv.slice(2);
if (!jalur.length) {
  console.error("pakai: node .bidik/bidik.mjs /mulai /beranda ...");
  process.exit(1);
}

mkdirSync(".bidik/keluaran", { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();

const galat = [];
page.on("console", (m) => m.type() === "error" && galat.push(m.text()));
page.on("pageerror", (e) => galat.push(String(e)));

for (const j of jalur) {
  const r = await page.goto(`http://localhost:3000${j}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(450);
  const nama = j.replace(/\//g, "_") || "_akar";
  await page.screenshot({ path: `.bidik/keluaran/${nama}.png` });
  console.log(`${String(r?.status()).padEnd(4)} ${j}`);
}

if (galat.length) {
  console.log("\n--- galat konsol ---");
  for (const g of [...new Set(galat)]) console.log("  " + g.slice(0, 200));
} else {
  console.log("\ntanpa galat konsol");
}

await browser.close();

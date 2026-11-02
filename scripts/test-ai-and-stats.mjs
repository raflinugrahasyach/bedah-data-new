import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const SCREENSHOTS_DIR = path.resolve("context/screenshots/prod_audit");

async function testAiAndStats() {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    console.log("Authenticating as Peneliti...");
    await page.goto("https://bedah-data-new.vercel.app/login", { waitUntil: "networkidle2" });
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', "peneliti@bedahdata.id");
    await page.type('input[type="password"]', "BedahDataPeneliti2026!");
    await page.click('button[type="submit"]');

    await new Promise((r) => setTimeout(r, 2000));
    await page.goto("https://bedah-data-new.vercel.app/advisor", { waitUntil: "networkidle2" });

    console.log("On Bedah AI Advisor page. Clicking prompt chip...");
    const chipSelector = 'button:has-text("Metode apa yang tepat"), button';
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const chip = buttons.find((b) => b.innerText.includes("Metode apa yang tepat"));
      if (chip) chip.click();
    });

    console.log("Clicked chip! Waiting for AI stream...");
    await new Promise((r) => setTimeout(r, 6000));

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "04_bedah_ai_streamed.png"),
      fullPage: true,
    });

    const messages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div")).map((d) => d.innerText).filter((t) => t.includes("Metode") && t.length > 50);
    });

    console.log("AI Response snippet:", messages[0]?.slice(0, 300));
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await browser.close();
  }
}

testAiAndStats();


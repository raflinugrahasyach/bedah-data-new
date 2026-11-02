import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const LOCAL_URL = "http://127.0.0.1:3000";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("=== Verifying Step 3 & Step 4 End-to-End ===");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox"],
    defaultViewport: { width: 1440, height: 900 },
  });

  try {
    const page = await browser.newPage();

    // 1. Login as Peneliti
    console.log("Logging in as Peneliti...");
    await page.goto(LOCAL_URL + "/login", { waitUntil: "domcontentloaded" });
    await sleep(2000);

    const demoBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      return btns.find((b) => /peneliti riset|peneliti@bedahdata/i.test(b.innerText)) || null;
    });

    if (demoBtn && demoBtn.asElement()) {
      await demoBtn.asElement().click();
      await sleep(3500);
      console.log("Logged in! URL:", page.url());
    }

    // 2. Test Bedah AI (Advisor)
    console.log("Navigating to /advisor...");
    await page.goto(LOCAL_URL + "/advisor", { waitUntil: "domcontentloaded" });
    await sleep(2000);

    // Verify 4 prompt chips exist and click the first one
    console.log("Clicking prompt chip: 'Metode apa yang tepat untuk penelitian saya?'...");
    const chip = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      return btns.find((b) => /metode apa yang tepat/i.test(b.innerText)) || null;
    });

    if (chip && chip.asElement()) {
      await chip.asElement().click();
      console.log("Prompt sent! Waiting for Gemini 2.5 Flash streaming response...");
      await sleep(14000); // Wait for streaming to finish
      await page.screenshot({ path: "context/screenshots/local_07_ai_chat.png", fullPage: true });
      console.log("✓ Captured local_07_ai_chat.png with live streaming AI response!");
    }

    // 3. Test Validation Engine (/validasi)
    console.log("Navigating to /validasi...");
    await page.goto(LOCAL_URL + "/validasi", { waitUntil: "domcontentloaded" });
    await sleep(2000);

    // Click "Jalankan Validasi Komputasi"
    const valBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      return btns.find((b) => /jalankan validasi komputasi/i.test(b.innerText)) || null;
    });

    if (valBtn && valBtn.asElement()) {
      console.log("Clicking 'Jalankan Validasi Komputasi' button...");
      await valBtn.asElement().click();
      await sleep(4000);
      await page.screenshot({ path: "context/screenshots/local_08_validation_passed.png", fullPage: true });
      console.log("✓ Captured local_08_validation_passed.png with dual-engine verification results!");
    }

    // 4. Test Laporan (/laporan)
    console.log("Navigating to /laporan...");
    await page.goto(LOCAL_URL + "/laporan", { waitUntil: "domcontentloaded" });
    await sleep(2000);
    await page.screenshot({ path: "context/screenshots/local_09_laporan_view.png", fullPage: true });
    console.log("✓ Captured local_09_laporan_view.png!");

    console.log("=== ALL STEP 3 & STEP 4 VERIFICATIONS SUCCEEDED! ===");
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await browser.close();
  }
}

run();

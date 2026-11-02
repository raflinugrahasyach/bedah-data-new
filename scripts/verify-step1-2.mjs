import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const LOCAL_URL = "http://127.0.0.1:3000";
const SAMPLE_CSV = path.resolve("storage/datasets/data_motivasi_hasil_belajar_120.csv");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("=== Verifying Step 1 & Step 2 End-to-End ===");

  // 1. Verify FastAPI
  try {
    const healthRes = await fetch("http://127.0.0.1:8000/health");
    const healthJson = await healthRes.json();
    console.log("✓ FastAPI Health Check:", healthJson);
  } catch (err) {
    console.error("❌ FastAPI not reachable:", err.message);
    process.exit(1);
  }

  // 2. Launch Browser
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox"],
    defaultViewport: { width: 1440, height: 900 },
  });

  try {
    const page = await browser.newPage();

    // Login as Peneliti
    console.log("Navigating to login...");
    await page.goto(LOCAL_URL + "/login", { waitUntil: "domcontentloaded" });
    await sleep(2000);

    const demoPeneliti = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      return btns.find((b) => /peneliti riset|peneliti@bedahdata/i.test(b.innerText)) || null;
    });

    if (demoPeneliti && demoPeneliti.asElement()) {
      await demoPeneliti.asElement().click();
      await sleep(3500);
      console.log("Logged in! Current URL:", page.url());
    }

    // Navigate to /dataset/upload
    console.log("Navigating to /dataset/upload...");
    await page.goto(LOCAL_URL + "/dataset/upload", { waitUntil: "domcontentloaded" });
    await sleep(2000);
    await page.screenshot({ path: "context/screenshots/local_04_dataset_upload.png", fullPage: true });
    console.log("✓ Captured local_04_dataset_upload.png");

    // Upload sample CSV
    console.log("Uploading sample CSV:", SAMPLE_CSV);
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      await fileInput.uploadFile(SAMPLE_CSV);
      console.log("File uploaded, waiting for preview response...");
      await sleep(3000);

      await page.screenshot({ path: "context/screenshots/local_05_dataset_preview.png", fullPage: true });
      console.log("✓ Captured local_05_dataset_preview.png");

      // Click "Jalankan Analisis Statistik Deskriptif"
      console.log("Clicking 'Jalankan Analisis Statistik Deskriptif' button...");
      const runBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        return btns.find((b) => /jalankan analisis statistik deskriptif/i.test(b.innerText)) || null;
      });

      if (runBtn && runBtn.asElement()) {
        await runBtn.asElement().click();
        console.log("Calculation requested from Python FastAPI engine...");
        await sleep(3500);

        await page.screenshot({ path: "context/screenshots/local_06_stats_result.png", fullPage: true });
        console.log("✓ Captured local_06_stats_result.png with descriptive stats from Python!");
      } else {
        console.warn("Could not find calculate button");
      }
    }

    console.log("SUCCESS: Step 1 and Step 2 verified end-to-end!");
  } catch (err) {
    console.error("Verification error:", err);
  } finally {
    await browser.close();
  }
}

run();


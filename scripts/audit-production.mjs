import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const SCREENSHOTS_DIR = path.resolve("context/screenshots/prod_audit");
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const auditReport = {
  url: "https://bedah-data-new.vercel.app",
  timestamp: new Date().toISOString(),
  checks: {},
  consoleErrors: [],
  networkFailures: [],
};

async function runAudit() {
  console.log("=== STARTING PRODUCTION AUDIT: https://bedah-data-new.vercel.app ===");

  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      auditReport.consoleErrors.push(msg.text());
      console.log("[Prod Console Error]", msg.text());
    }
  });

  page.on("pageerror", (err) => {
    auditReport.consoleErrors.push(err.message);
    console.log("[Prod Page Error]", err.message);
  });

  page.on("response", (res) => {
    if (res.status() >= 400) {
      auditReport.networkFailures.push({
        url: res.url(),
        status: res.status(),
        statusText: res.statusText(),
      });
      console.log(`[Prod Network ${res.status()}]`, res.url());
    }
  });

  try {
    // -------------------------------------------------------------------------
    // 1. Audit Landing & Login Page
    // -------------------------------------------------------------------------
    console.log("\n[1] Auditing Landing & Login Page...");
    const loginRes = await page.goto("https://bedah-data-new.vercel.app/login", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    auditReport.checks.landingStatus = loginRes?.status();
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "01_prod_login.png"), fullPage: true });

    // Check title and UI elements
    const pageTitle = await page.title();
    console.log("Page Title:", pageTitle);
    auditReport.checks.pageTitle = pageTitle;

    // -------------------------------------------------------------------------
    // 2. Audit Peneliti Authentication
    // -------------------------------------------------------------------------
    console.log("\n[2] Testing Peneliti Authentication on Vercel...");
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', "peneliti@bedahdata.id");
    await page.type('input[type="password"]', "BedahDataPeneliti2026!");
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard or error message
    await sleep(4000);
    const afterLoginUrl = page.url();
    console.log("URL after login submit:", afterLoginUrl);
    auditReport.checks.penelitiLoginUrl = afterLoginUrl;
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "02_prod_after_login.png"), fullPage: true });

    const loginErrorText = await page.evaluate(() => {
      const el = document.querySelector(".text-red-700, .bg-red-50");
      return el ? el.textContent : null;
    });
    if (loginErrorText) {
      console.log("Login Error Displayed:", loginErrorText);
      auditReport.checks.penelitiLoginError = loginErrorText;
    }

    // -------------------------------------------------------------------------
    // 3. Audit Dashboard & Database Connectivity (Supabase)
    // -------------------------------------------------------------------------
    if (afterLoginUrl.includes("/dashboard")) {
      console.log("\n[3] Auditing Peneliti Dashboard & Supabase Data...");
      const projectCount = await page.evaluate(() => {
        return document.querySelectorAll("tbody tr").length;
      });
      console.log("Dashboard Loaded Projects Count:", projectCount);
      auditReport.checks.dashboardProjectsCount = projectCount;

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "03_prod_dashboard.png"), fullPage: true });

      // -----------------------------------------------------------------------
      // 4. Audit AI Methodology Advisor
      // -----------------------------------------------------------------------
      console.log("\n[4] Auditing Gemini AI Chat on Vercel...");
      await page.goto("https://bedah-data-new.vercel.app/advisor", { waitUntil: "networkidle2" });
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "04_prod_advisor.png"), fullPage: true });

      // Click first prompt chip
      const chipClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const chip = buttons.find((b) => b.innerText.includes("Metode apa yang tepat"));
        if (chip) {
          chip.click();
          return true;
        }
        return false;
      });

      if (chipClicked) {
        console.log("Clicked prompt chip, waiting for streaming response...");
        await sleep(5000);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "05_prod_ai_response.png"), fullPage: true });

        const aiResponseText = await page.evaluate(() => {
          const msgs = document.querySelectorAll(".leading-relaxed");
          return msgs.length > 0 ? msgs[msgs.length - 1].textContent : null;
        });
        console.log("AI Response snippet:", aiResponseText ? aiResponseText.slice(0, 150) + "..." : "No response");
        auditReport.checks.aiResponseSnippet = aiResponseText ? aiResponseText.slice(0, 200) : null;
      }

      // -----------------------------------------------------------------------
      // 5. Audit Statistical Workbench & Python Engine
      // -----------------------------------------------------------------------
      console.log("\n[5] Auditing Analisis Statistik & Render.com Engine...");
      await page.goto("https://bedah-data-new.vercel.app/analisis", { waitUntil: "networkidle2" });
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "06_prod_analisis.png"), fullPage: true });

      // Click 'Jalankan Analisis Sekarang'
      console.log("Attempting to run analysis...");
      const runClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const btn = buttons.find((b) => b.innerText.includes("Jalankan Analisis Sekarang"));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      });

      if (runClicked) {
        await sleep(5000);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "07_prod_analisis_result.png"), fullPage: true });
      }

      // -----------------------------------------------------------------------
      // 6. Audit Dataset Upload & Storage
      // -----------------------------------------------------------------------
      console.log("\n[6] Auditing Dataset Upload...");
      await page.goto("https://bedah-data-new.vercel.app/dataset/upload", { waitUntil: "networkidle2" });
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "08_prod_dataset_upload.png"), fullPage: true });

      // Try uploading sample file
      const sampleCsvPath = path.resolve("storage/datasets/data_motivasi_hasil_belajar_120.csv");
      if (fs.existsSync(sampleCsvPath)) {
        const fileInput = await page.$('input[type="file"]');
        if (fileInput) {
          console.log("Uploading sample CSV to production...");
          await fileInput.uploadFile(sampleCsvPath);
          await sleep(4000);
          await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "09_prod_upload_preview.png"), fullPage: true });
        }
      }
    }

    // -------------------------------------------------------------------------
    // 7. Audit Super Admin
    // -------------------------------------------------------------------------
    console.log("\n[7] Auditing Super Admin Access...");
    const client = await page.target().createCDPSession();
    await client.send("Network.clearBrowserCookies");

    await page.goto("https://bedah-data-new.vercel.app/login", { waitUntil: "networkidle2" });
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', "admin@bedahdata.id");
    await page.type('input[type="password"]', "BedahDataAdmin2026!");
    await page.click('button[type="submit"]');

    await sleep(4000);
    const adminUrl = page.url();
    console.log("Admin URL after login:", adminUrl);
    auditReport.checks.adminUrl = adminUrl;
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "10_prod_admin.png"), fullPage: true });

    if (adminUrl.includes("/admin")) {
      await page.goto("https://bedah-data-new.vercel.app/admin/traction", { waitUntil: "networkidle2" });
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "11_prod_admin_traction.png"), fullPage: true });

      await page.goto("https://bedah-data-new.vercel.app/admin/users", { waitUntil: "networkidle2" });
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "12_prod_admin_users.png"), fullPage: true });
    }

    // -------------------------------------------------------------------------
    // 8. Audit Public Plans Page
    // -------------------------------------------------------------------------
    console.log("\n[8] Auditing Public Plans Page...");
    await page.goto("https://bedah-data-new.vercel.app/plans", { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "13_prod_plans.png"), fullPage: true });

    console.log("\n=== AUDIT FINISHED ===");
  } catch (err) {
    console.error("Audit encountered error:", err);
    auditReport.error = err.message;
  } finally {
    await browser.close();
    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, "audit_summary.json"),
      JSON.stringify(auditReport, null, 2)
    );
  }
}

runAudit();


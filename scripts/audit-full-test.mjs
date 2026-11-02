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
  checklist: {},
  consoleErrors: [],
  networkErrors: [],
};

async function runFullAudit() {
  console.log("=== FULL PRODUCTION AUDIT STARTING ===");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      auditReport.consoleErrors.push({ text: msg.text(), location: msg.location() });
      console.log("[Console Error]", msg.text());
    }
  });

  page.on("response", (res) => {
    if (res.status() >= 400) {
      auditReport.networkErrors.push({ url: res.url(), status: res.status() });
      console.log(`[Network ${res.status()}]`, res.url());
    }
  });

  try {
    // -------------------------------------------------------------
    // CHECK 1: Login UI & Demo Cards
    // -------------------------------------------------------------
    console.log("\n[CHECK 1] Inspecting /login page...");
    await page.goto("https://bedah-data-new.vercel.app/login", { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "01_login_page.png"), fullPage: true });

    const pageTitle = await page.title();
    console.log("Page title:", pageTitle);
    auditReport.checklist.loginPageTitle = pageTitle;

    // Check demo card texts
    const demoCardText = await page.evaluate(() => document.body.innerText);
    const hasPenelitiDemo = demoCardText.includes("peneliti@bedahdata.id");
    const hasAdminDemo = demoCardText.includes("admin@bedahdata.id");
    console.log("Demo cards present:", { hasPenelitiDemo, hasAdminDemo });
    auditReport.checklist.demoCardsPresent = { hasPenelitiDemo, hasAdminDemo };

    // -------------------------------------------------------------
    // CHECK 2: Peneliti Authentication & Session Persistence
    // -------------------------------------------------------------
    console.log("\n[CHECK 2] Authenticating as Peneliti...");
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', "peneliti@bedahdata.id");
    await page.type('input[type="password"]', "BedahDataPeneliti2026!");
    
    // Intercept potential localhost redirect
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForResponse((res) => res.url().includes("/api/auth/callback/credentials"), { timeout: 15000 }).catch(() => null),
    ]);

    await sleep(2500);

    // If redirected to localhost or stayed, explicitly navigate to /dashboard with session cookie
    console.log("Navigating to /dashboard...");
    await page.goto("https://bedah-data-new.vercel.app/dashboard", { waitUntil: "networkidle2" });
    await sleep(2000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "02_peneliti_dashboard.png"), fullPage: true });

    const currentUrl = page.url();
    const isDashboard = currentUrl.includes("/dashboard");
    console.log("Dashboard URL:", currentUrl, "Authenticated:", isDashboard);
    auditReport.checklist.penelitiAuthSuccess = isDashboard;

    // -------------------------------------------------------------
    // CHECK 3: Database Connectivity (Supabase Project Data)
    // -------------------------------------------------------------
    console.log("\n[CHECK 3] Verifying Supabase Projects on Dashboard...");
    const dashboardData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("tbody tr"));
      const projectTitles = rows.map((r) => r.querySelector("td")?.textContent?.trim() || "");
      const badges = Array.from(document.querySelectorAll("span")).map((s) => s.textContent?.trim());
      const hasValidatedBadge = badges.some((b) => b?.toLowerCase().includes("tervalidasi") || b?.toLowerCase().includes("validated"));
      return {
        rowCount: rows.length,
        projectTitles: projectTitles.filter(Boolean),
        hasValidatedBadge,
      };
    });

    console.log("Dashboard Data:", dashboardData);
    auditReport.checklist.supabaseProjectsLoaded = dashboardData.rowCount > 0;
    auditReport.checklist.projectTitles = dashboardData.projectTitles;
    auditReport.checklist.hasValidatedBadge = dashboardData.hasValidatedBadge;

    // -------------------------------------------------------------
    // CHECK 4: Bedah AI Methodology Advisor Chat
    // -------------------------------------------------------------
    console.log("\n[CHECK 4] Testing Bedah AI Methodology Advisor (/advisor)...");
    await page.goto("https://bedah-data-new.vercel.app/advisor", { waitUntil: "networkidle2" });
    await sleep(1500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "03_bedah_ai_chat.png"), fullPage: true });

    // Send a methodology question
    const textarea = await page.$('textarea, input[placeholder*="Tanyakan"]');
    if (textarea) {
      await textarea.type("Metode apa yang tepat untuk menguji pengaruh variabel X terhadap Y dengan skala Likert?");
      const sendButton = await page.$('button[type="submit"], form button:not([disabled])');
      if (sendButton) {
        await sendButton.click();
        console.log("Question sent to Bedah AI, waiting for streaming response...");
        await sleep(7000);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "04_bedah_ai_streamed.png"), fullPage: true });

        const aiResponse = await page.evaluate(() => {
          const bubbles = document.querySelectorAll(".prose, .leading-relaxed, [class*='chat']");
          return bubbles.length > 0 ? bubbles[bubbles.length - 1].textContent?.trim() : null;
        });
        console.log("AI Response received snippet:", aiResponse ? aiResponse.slice(0, 160) + "..." : "No response text");
        auditReport.checklist.bedahAiStreamingWorks = Boolean(aiResponse && aiResponse.length > 30);
      }
    }

    // -------------------------------------------------------------
    // CHECK 5: Dataset Upload & Quality Engine
    // -------------------------------------------------------------
    console.log("\n[CHECK 5] Testing Dataset Upload (/dataset/upload)...");
    await page.goto("https://bedah-data-new.vercel.app/dataset/upload", { waitUntil: "networkidle2" });
    await sleep(1500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "05_dataset_upload_page.png"), fullPage: true });

    const sampleCsv = path.resolve("storage/datasets/data_motivasi_hasil_belajar_120.csv");
    if (fs.existsSync(sampleCsv)) {
      const fileInput = await page.$('input[type="file"]');
      if (fileInput) {
        console.log("Uploading sample dataset...");
        await fileInput.uploadFile(sampleCsv);
        await sleep(5000);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "06_dataset_uploaded_preview.png"), fullPage: true });
        
        const previewLoaded = await page.evaluate(() => {
          return Boolean(document.querySelector("table") || document.body.innerText.includes("120 baris") || document.body.innerText.includes("Motivasi"));
        });
        console.log("Dataset preview loaded:", previewLoaded);
        auditReport.checklist.datasetUploadSuccess = previewLoaded;
      }
    }

    // -------------------------------------------------------------
    // CHECK 6: Statistical Analysis Workbench
    // -------------------------------------------------------------
    console.log("\n[CHECK 6] Testing Statistical Analysis Workbench (/analisis)...");
    await page.goto("https://bedah-data-new.vercel.app/analisis", { waitUntil: "networkidle2" });
    await sleep(2000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "07_stats_workbench.png"), fullPage: true });

    // Try executing analysis
    const runBtn = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const target = buttons.find((b) => b.textContent?.includes("Jalankan Analisis"));
      if (target && !target.disabled) {
        target.click();
        return true;
      }
      return false;
    });

    if (runBtn) {
      console.log("Clicked 'Jalankan Analisis', waiting for stats response...");
      await sleep(6000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "08_stats_result.png"), fullPage: true });
    }

    // -------------------------------------------------------------
    // CHECK 7: Super Admin Panel Access
    // -------------------------------------------------------------
    console.log("\n[CHECK 7] Auditing Super Admin Access...");
    const client = await page.target().createCDPSession();
    await client.send("Network.clearBrowserCookies");

    await page.goto("https://bedah-data-new.vercel.app/login", { waitUntil: "networkidle2" });
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', "admin@bedahdata.id");
    await page.type('input[type="password"]', "BedahDataAdmin2026!");

    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForResponse((res) => res.url().includes("/api/auth/callback/credentials"), { timeout: 15000 }).catch(() => null),
    ]);

    await sleep(2500);
    await page.goto("https://bedah-data-new.vercel.app/admin", { waitUntil: "networkidle2" });
    await sleep(2000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "09_admin_dashboard.png"), fullPage: true });

    const adminPageUrl = page.url();
    const isAdmin = adminPageUrl.includes("/admin");
    console.log("Admin Dashboard URL:", adminPageUrl, "Access Granted:", isAdmin);
    auditReport.checklist.adminAccessGranted = isAdmin;

    if (isAdmin) {
      // Traction Metrics
      await page.goto("https://bedah-data-new.vercel.app/admin/traction", { waitUntil: "networkidle2" });
      await sleep(1500);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "10_admin_traction.png"), fullPage: true });

      // Users List
      await page.goto("https://bedah-data-new.vercel.app/admin/users", { waitUntil: "networkidle2" });
      await sleep(1500);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "11_admin_users.png"), fullPage: true });
    }

    // -------------------------------------------------------------
    // CHECK 8: Mobile Responsiveness
    // -------------------------------------------------------------
    console.log("\n[CHECK 8] Testing Mobile Responsiveness (iPhone 13 - 390x844)...");
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto("https://bedah-data-new.vercel.app/login", { waitUntil: "networkidle2" });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "12_mobile_login.png"), fullPage: true });

    await page.goto("https://bedah-data-new.vercel.app/plans", { waitUntil: "networkidle2" });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "13_mobile_plans.png"), fullPage: true });

    console.log("\n=== FULL PRODUCTION AUDIT COMPLETE ===");
  } catch (error) {
    console.error("Audit error:", error);
    auditReport.fatalError = error.message;
  } finally {
    await browser.close();
    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, "production_audit_results.json"),
      JSON.stringify(auditReport, null, 2)
    );
  }
}

runFullAudit();


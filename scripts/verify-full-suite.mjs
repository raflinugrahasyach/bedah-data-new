import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const SCREENSHOTS_DIR = path.resolve("context/screenshots");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function run() {
  console.log("Starting comprehensive verification with local Chrome...");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // 1. Test Public Plans Page
    console.log("1. Visiting /plans (Public Pricing)...");
    await page.goto("http://localhost:3000/plans", { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "local_10_plans.png"), fullPage: true });

    // 2. Login as Demo Peneliti
    console.log("2. Logging in as Peneliti...");
    await page.goto("http://localhost:3000/login", { waitUntil: "networkidle2" });
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', "peneliti@bedahdata.id");
    await page.type('input[type="password"]', "BedahDataPeneliti2026!");
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    console.log("Logged in! URL:", page.url());

    // 3. Test Analisis Statistik Workbench
    console.log("3. Visiting /analisis (Statistical Workbench)...");
    await page.goto("http://localhost:3000/analisis", { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "local_11_analisis_workbench.png"), fullPage: true });

    // Trigger AI Method Recommendation button via evaluate
    console.log("Triggering AI recommendation...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) => b.innerText.includes("Rekomendasikan Metode"));
      if (btn) btn.click();
    });
    await sleep(3500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "local_12_analisis_ai_rec.png"), fullPage: true });

    // Trigger Run Analysis
    console.log("Triggering analysis calculation...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) => b.innerText.includes("Jalankan Analisis Sekarang"));
      if (btn) btn.click();
    });
    await sleep(3500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "local_13_analisis_result.png"), fullPage: true });

    // 4. Test Proyek Baru & Proyek Detail
    console.log("4. Visiting /proyek/baru...");
    await page.goto("http://localhost:3000/proyek/baru", { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "local_14_proyek_baru.png"), fullPage: true });

    console.log("Visiting /proyek...");
    await page.goto("http://localhost:3000/proyek", { waitUntil: "networkidle2" });
    const projectLink = await page.$('tbody tr a[href^="/proyek/"]');
    if (projectLink) {
      await projectLink.click();
      await page.waitForNavigation({ waitUntil: "networkidle2" });
      console.log("Project detail URL:", page.url());
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "local_15_proyek_detail.png"), fullPage: true });
    }

    // 5. Test Pusat Bantuan & Pengaturan
    console.log("5. Visiting /bantuan...");
    await page.goto("http://localhost:3000/bantuan", { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "local_16_bantuan.png"), fullPage: true });

    console.log("Visiting /pengaturan...");
    await page.goto("http://localhost:3000/pengaturan", { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "local_17_pengaturan.png"), fullPage: true });

    // 6. Test Super Admin Suite
    console.log("6. Testing Super Admin Suite...");
    const client = await page.target().createCDPSession();
    await client.send("Network.clearBrowserCookies");

    await page.goto("http://localhost:3000/login", { waitUntil: "networkidle2" });
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', "admin@bedahdata.id");
    await page.type('input[type="password"]', "BedahDataAdmin2026!");
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    console.log("Admin logged in! URL:", page.url());

    console.log("Visiting /admin/traction...");
    await page.goto("http://localhost:3000/admin/traction", { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "local_18_admin_traction.png"), fullPage: true });

    console.log("Visiting /admin/users...");
    await page.goto("http://localhost:3000/admin/users", { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "local_19_admin_users.png"), fullPage: true });

    console.log("Visiting /admin/data...");
    await page.goto("http://localhost:3000/admin/data", { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "local_20_admin_data.png"), fullPage: true });

    console.log("Visiting /admin/pendapatan...");
    await page.goto("http://localhost:3000/admin/pendapatan", { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "local_21_admin_pendapatan.png"), fullPage: true });

    console.log("Visiting /admin/permintaan...");
    await page.goto("http://localhost:3000/admin/permintaan", { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "local_22_admin_permintaan.png"), fullPage: true });

    console.log("ALL VERIFICATIONS COMPLETED SUCCESSFULLY!");
  } catch (err) {
    console.error("Verification failed:", err);
  } finally {
    await browser.close();
  }
}

run();

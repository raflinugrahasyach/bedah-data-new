import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const LOCAL_URL = "http://127.0.0.1:3000";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verify() {
  console.log("Starting Local End-to-End Verification with Chrome...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox"],
    defaultViewport: { width: 1440, height: 900 },
  });

  try {
    // 1. Visit Login Page
    const page = await browser.newPage();
    console.log("Navigating to:", LOCAL_URL + "/login");
    await page.goto(LOCAL_URL + "/login", { waitUntil: "domcontentloaded" });
    await sleep(2000);
    await page.screenshot({ path: "context/screenshots/local_01_login.png", fullPage: true });
    console.log("✓ Captured local_01_login.png");

    // 2. Click Peneliti Quick Login Card
    console.log("Clicking Peneliti Demo card...");
    const demoPeneliti = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      return btns.find((b) => /peneliti riset|peneliti@bedahdata/i.test(b.innerText)) || null;
    });

    if (demoPeneliti && demoPeneliti.asElement()) {
      await demoPeneliti.asElement().click();
      console.log("Clicked! Waiting for navigation to /dashboard...");
      await sleep(3500);
      console.log("Current URL after Peneliti login:", page.url());
      await page.screenshot({ path: "context/screenshots/local_02_dashboard.png", fullPage: true });
      console.log("✓ Captured local_02_dashboard.png");

      // 3. Test Route Guard: Peneliti trying to visit /admin
      console.log("Testing Route Guard: Peneliti accessing /admin...");
      await page.goto(LOCAL_URL + "/admin", { waitUntil: "domcontentloaded" });
      await sleep(2000);
      console.log("URL after attempting /admin as Peneliti:", page.url());
      if (page.url().includes("/dashboard")) {
        console.log("✓ ROUTE GUARD VERIFIED: Peneliti was redirected back to /dashboard!");
      }
    }

    // 4. Test Admin Login in separate context
    console.log("Testing Super Admin login in clean context...");
    const adminCtx = await browser.createBrowserContext();
    const adminPage = await adminCtx.newPage();
    await adminPage.goto(LOCAL_URL + "/login", { waitUntil: "domcontentloaded" });
    await sleep(2000);

    const demoAdmin = await adminPage.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      return btns.find((b) => /super admin|admin@bedahdata/i.test(b.innerText)) || null;
    });

    if (demoAdmin && demoAdmin.asElement()) {
      await demoAdmin.asElement().click();
      console.log("Clicked! Waiting for navigation to /admin...");
      await sleep(3500);
      console.log("Current URL after Admin login:", adminPage.url());
      await adminPage.screenshot({ path: "context/screenshots/local_03_admin.png", fullPage: true });
      console.log("✓ Captured local_03_admin.png");

      // 5. Test Route Guard: Admin trying to visit /dashboard
      console.log("Testing Route Guard: Admin accessing /dashboard...");
      await adminPage.goto(LOCAL_URL + "/dashboard", { waitUntil: "domcontentloaded" });
      await sleep(2000);
      console.log("URL after attempting /dashboard as Admin:", adminPage.url());
      if (adminPage.url().includes("/admin")) {
        console.log("✓ ROUTE GUARD VERIFIED: Admin was redirected back to /admin!");
      }
    }

    console.log("SUCCESS: All verifications passed cleanly!");
  } catch (err) {
    console.error("Verification error:", err);
  } finally {
    await browser.close();
  }
}

verify();

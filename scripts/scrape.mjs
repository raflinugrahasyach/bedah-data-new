import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "https://beda-data-dashboard-255993.hostingersite.com";
const SCREENSHOTS_DIR = path.resolve("context/screenshots");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("Launching Chrome at:", CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
    defaultViewport: { width: 1440, height: 900 },
  });

  try {
    const page = await browser.newPage();

    console.log("Navigating to:", BASE_URL + "/dashboard");
    await page.goto(BASE_URL + "/dashboard", { waitUntil: "networkidle2", timeout: 45000 });
    await sleep(2000);

    // Screenshot initial view
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "01_initial.png"), fullPage: true });
    console.log("Captured 01_initial.png");

    // Check if auth dialog or login button exists
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log("Initial page title:", await page.title());
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, "01_initial_dom.html"), await page.content());

    // Look for login / demo buttons or inputs
    const inputs = await page.$$("input");
    console.log("Number of inputs found:", inputs.length);

    // Let's see if there is a login modal or quick login
    const buttons = await page.evaluate(() =>
      Array.from(document.querySelectorAll("button, a")).map((el) => ({
        tag: el.tagName,
        text: el.innerText.trim(),
        href: el.getAttribute("href"),
        class: el.className,
      }))
    );
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, "buttons.json"), JSON.stringify(buttons, null, 2));

    // Try finding email input
    let emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="email" i], input[placeholder*="Email" i]');
    let passInput = await page.$('input[type="password"], input[name="password"]');

    if (!emailInput) {
      // Check if there is a button that opens login modal (e.g., "Masuk" or "Login")
      const masukBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll("button, a"));
        return btns.find((b) => /masuk|login/i.test(b.innerText)) || null;
      });
      if (masukBtn && masukBtn.asElement()) {
        console.log("Clicking Masuk button to open modal...");
        await masukBtn.asElement().click();
        await sleep(1500);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "02_login_modal.png") });
        emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="email" i]');
        passInput = await page.$('input[type="password"]');
      }
    }

    // Check demo accounts cards on page
    const demoPenelitiCard = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll("button, div, a"));
      return cards.find((el) => /peneliti riset|peneliti@/i.test(el.innerText)) || null;
    });

    if (demoPenelitiCard && demoPenelitiCard.asElement()) {
      console.log("Found demo peneliti element, clicking it...");
      await demoPenelitiCard.asElement().click();
      await sleep(3000);
    } else if (emailInput && passInput) {
      console.log("Typing peneliti credentials...");
      await emailInput.type("peneliti@bedadata.id", { delay: 50 });
      await passInput.type("BedaData2026!", { delay: 50 });

      // Click submit
      const submitBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button[type="submit"], button'));
        return btns.find((b) => /masuk|login|submit/i.test(b.innerText)) || null;
      });
      if (submitBtn && submitBtn.asElement()) {
        await submitBtn.asElement().click();
        await sleep(4000);
      }
    }

    // Wait and screenshot Dashboard Peneliti
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "03_dashboard_peneliti.png"), fullPage: true });
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, "03_dashboard_dom.html"), await page.content());
    console.log("Captured 03_dashboard_peneliti.png");

    // Try navigating to /proyek
    try {
      console.log("Navigating to /proyek...");
      await page.goto(BASE_URL + "/proyek", { waitUntil: "networkidle2", timeout: 20000 });
      await sleep(2000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "04_proyek_peneliti.png"), fullPage: true });
      fs.writeFileSync(path.join(SCREENSHOTS_DIR, "04_proyek_dom.html"), await page.content());
    } catch (e) {
      console.log("Could not navigate to /proyek directly:", e.message);
    }

    // Try navigating to /dataset
    try {
      console.log("Navigating to /dataset...");
      await page.goto(BASE_URL + "/dataset", { waitUntil: "networkidle2", timeout: 20000 });
      await sleep(2000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "05_dataset_peneliti.png"), fullPage: true });
      fs.writeFileSync(path.join(SCREENSHOTS_DIR, "05_dataset_dom.html"), await page.content());
    } catch (e) {
      console.log("Could not navigate to /dataset directly:", e.message);
    }

    // Now try admin login in a new incognito context
    console.log("Opening new context for Admin login...");
    const adminContext = await browser.createBrowserContext();
    const adminPage = await adminContext.newPage();
    await adminPage.goto(BASE_URL + "/dashboard", { waitUntil: "networkidle2", timeout: 45000 });
    await sleep(2000);

    // Look for demo admin card or login input
    const demoAdminCard = await adminPage.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll("button, div, a"));
      return cards.find((el) => /super admin|admin@/i.test(el.innerText)) || null;
    });

    if (demoAdminCard && demoAdminCard.asElement()) {
      console.log("Clicking Demo Admin card...");
      await demoAdminCard.asElement().click();
      await sleep(3000);
    } else {
      let aEmail = await adminPage.$('input[type="email"], input[name="email"], input[placeholder*="email" i]');
      let aPass = await adminPage.$('input[type="password"]');
      if (!aEmail) {
        const masukBtn = await adminPage.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll("button, a"));
          return btns.find((b) => /masuk|login/i.test(b.innerText)) || null;
        });
        if (masukBtn && masukBtn.asElement()) {
          await masukBtn.asElement().click();
          await sleep(1500);
          aEmail = await adminPage.$('input[type="email"], input[name="email"], input[placeholder*="email" i]');
          aPass = await adminPage.$('input[type="password"]');
        }
      }
      if (aEmail && aPass) {
        await aEmail.type("admin@bedadata.id", { delay: 50 });
        await aPass.type("BedaData2026!", { delay: 50 });
        const submitBtn = await adminPage.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button[type="submit"], button'));
          return btns.find((b) => /masuk|login|submit/i.test(b.innerText)) || null;
        });
        if (submitBtn && submitBtn.asElement()) {
          await submitBtn.asElement().click();
          await sleep(4000);
        }
      }
    }

    await adminPage.screenshot({ path: path.join(SCREENSHOTS_DIR, "06_admin_panel.png"), fullPage: true });
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, "06_admin_dom.html"), await adminPage.content());
    console.log("Captured 06_admin_panel.png");

  } catch (err) {
    console.error("Scraper error:", err);
  } finally {
    await browser.close();
    console.log("Scraping completed.");
  }
}

run();


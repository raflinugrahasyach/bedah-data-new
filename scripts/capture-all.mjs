import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  page.on("console", (msg) => console.log("BROWSER LOG:", msg.type(), msg.text()));
  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));

  console.log("Navigating to live MVP...");
  await page.goto("https://beda-data-dashboard-255993.hostingersite.com/dashboard", { waitUntil: "networkidle2" });
  await page.waitForSelector("button.demo-account");

  console.log("Clicking Demo Peneliti card...");
  const demoBtns = await page.$$("button.demo-account");
  await demoBtns[0].click();
  await new Promise((r) => setTimeout(r, 500));

  console.log("Clicking Masuk button...");
  const submitBtn = await page.$("button.button.primary");
  await submitBtn.click();

  console.log("Waiting for navigation to /dashboard...");
  await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 }).catch(() => console.log("Timeout waiting navigation"));
  await new Promise((r) => setTimeout(r, 3000));

  console.log("Current page URL:", page.url());
  await page.screenshot({ path: "context/screenshots/03_dashboard_peneliti_real.png", fullPage: true });

  // Now inspect the dashboard elements
  const pageTitle = await page.title();
  console.log("Dashboard Page Title:", pageTitle);

  // Navigate to /proyek
  console.log("Clicking or navigating to /proyek...");
  await page.goto("https://beda-data-dashboard-255993.hostingersite.com/proyek", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: "context/screenshots/04_proyek_real.png", fullPage: true });

  // Navigate to /dataset
  console.log("Navigating to /dataset...");
  await page.goto("https://beda-data-dashboard-255993.hostingersite.com/dataset", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: "context/screenshots/05_dataset_real.png", fullPage: true });

  // Now test Admin login
  console.log("Logging in as Admin...");
  const adminPage = await browser.newPage();
  await adminPage.goto("https://beda-data-dashboard-255993.hostingersite.com/dashboard", { waitUntil: "networkidle2" });
  await adminPage.waitForSelector("button.demo-account");
  const adminDemoBtns = await adminPage.$$("button.demo-account");
  await adminDemoBtns[1].click(); // Click second button (Super Admin)
  await new Promise((r) => setTimeout(r, 500));
  const adminSubmit = await adminPage.$("button.button.primary");
  await adminSubmit.click();
  await adminPage.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 }).catch(() => console.log("Timeout admin navigation"));
  await new Promise((r) => setTimeout(r, 3000));
  console.log("Admin URL:", adminPage.url());
  await adminPage.screenshot({ path: "context/screenshots/06_admin_panel_real.png", fullPage: true });

  await browser.close();
  console.log("All screenshots captured successfully!");
}

run();


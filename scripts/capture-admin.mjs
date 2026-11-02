import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox"],
    defaultViewport: { width: 1440, height: 900 },
  });

  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  console.log("Navigating to login...");
  await page.goto("https://beda-data-dashboard-255993.hostingersite.com/", { waitUntil: "networkidle2" });
  await page.waitForSelector("button.demo-account");

  console.log("Clicking Demo Admin button (index 1)...");
  const demoBtns = await page.$$("button.demo-account");
  await demoBtns[1].click();
  await new Promise((r) => setTimeout(r, 600));

  console.log("Clicking Masuk...");
  const submitBtn = await page.$("button.button.primary");
  await submitBtn.click();

  console.log("Waiting for admin dashboard to load...");
  await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 4000));

  console.log("Admin URL:", page.url());
  await page.screenshot({ path: "context/screenshots/06_admin_panel_real.png", fullPage: true });

  await browser.close();
  console.log("Admin screenshot captured!");
}

run();


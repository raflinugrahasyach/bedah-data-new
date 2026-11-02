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
  page.on("response", (res) => {
    console.log("RESPONSE:", res.status(), res.url());
  });

  await page.goto("https://beda-data-dashboard-255993.hostingersite.com/dashboard", { waitUntil: "networkidle2" });
  console.log("Current page URL:", page.url());

  const demoBtns = await page.$$("button.demo-account");
  console.log("Found demo buttons:", demoBtns.length);
  if (demoBtns.length > 0) {
    console.log("Clicking first demo button (Peneliti)...");
    await demoBtns[0].click();
    await new Promise((r) => setTimeout(r, 4000));
    console.log("URL after click:", page.url());
  }

  // Also check if submitting the form directly works
  const inputs = await page.$$("input");
  if (inputs.length >= 2) {
    console.log("Testing direct form fill...");
    await inputs[0].click({ clickCount: 3 });
    await inputs[0].type("peneliti@bedadata.id");
    await inputs[1].click({ clickCount: 3 });
    await inputs[1].type("BedaData2026!");
    const submitBtn = await page.$("button.button.primary");
    if (submitBtn) {
      console.log("Clicking submit button...");
      await submitBtn.click();
      await new Promise((r) => setTimeout(r, 5000));
      console.log("URL after submit:", page.url());
    }
  }

  await page.screenshot({ path: "context/screenshots/after_submit.png", fullPage: true });
  await browser.close();
}

run();


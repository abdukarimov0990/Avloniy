import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = "http://localhost:3100";

const log = (...a) => console.log("•", ...a);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 420, height: 880 });

function fail(msg) {
  console.error("✗ FAIL:", msg);
  process.exitCode = 1;
}

try {
  // 1) Login sahifasi
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle0" });
  await page.waitForSelector("input#email", { timeout: 10000 });
  log("login sahifasi yuklandi");

  // 2) Xaridor sifatida kirish (RoleSelector default BUYER)
  await page.type("input#email", "ali@misol.uz");
  await page.type("input#password", "parol123");
  await page.click('button[type="submit"]');

  // Feed'ga o'tishini kutamiz
  await page.waitForFunction(() => location.pathname === "/feed", { timeout: 10000 });
  await page.waitForSelector("[data-reel-id]", { timeout: 10000 });
  const reelCount = await page.$$eval("[data-reel-id]", (els) => els.length);
  log("feed ochildi, reels:", reelCount);
  if (reelCount < 1) fail("feed'da reel yo'q");

  // localStorage'да saqlanganini tekshiramiz
  const stored = await page.evaluate(() => localStorage.getItem("avloniy-demo"));
  if (!stored || !stored.includes("currentUserId")) fail("localStorage'да holat yo'q");
  else log("localStorage'да holat saqlandi (uzunlik:", stored.length, ")");

  // 3) Like bosamiz (birinchi reeldagi yurakcha)
  const likeBefore = await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem("avloniy-demo")).state;
    return s.likes.length;
  });
  // Like tugmasi: o'ng paneldagi birinchi tugma
  await page.click('[data-reel-id] button');
  await new Promise((r) => setTimeout(r, 400));
  const likeAfter = await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem("avloniy-demo")).state;
    return s.likes.length;
  });
  log("like: oldin", likeBefore, "keyin", likeAfter);
  if (likeAfter <= likeBefore) fail("like localStorage'да saqlanmadi");

  // 4) Sahifani qayta yuklash → hali ham login + like saqlanган
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForFunction(() => location.pathname === "/feed", { timeout: 10000 });
  await page.waitForSelector("[data-reel-id]", { timeout: 10000 });
  const stillLoggedIn = await page.evaluate(() => location.pathname === "/feed");
  const likesPersisted = await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem("avloniy-demo")).state;
    return s.likes.length;
  });
  log("reload keyin: feed'да", stillLoggedIn, "| likes", likesPersisted);
  if (!stillLoggedIn) fail("reload keyin login yo'qoldi");
  if (likesPersisted !== likeAfter) fail("reload keyin like yo'qoldi");

  // 5) Profilga o'tish — streak/sertifikat ko'rinadimi
  await page.goto(`${BASE}/profile`, { waitUntil: "networkidle0" });
  await page.waitForSelector("h1", { timeout: 10000 });
  const profileText = await page.evaluate(() => document.body.innerText);
  if (!profileText.includes("Kunlik streak")) fail("profilда streak yo'q");
  else log("profil: streak ko'rindi");

  // 6) Seller dashboard (boshqa akkaunt) — logout qilib aziz bilan kiramiz
  await page.goto(`${BASE}/profile`, { waitUntil: "networkidle0" });
  // Chiqish tugmasini bosamiz
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const out = btns.find((b) => b.textContent.includes("Chiqish"));
    out?.click();
  });
  await page.waitForFunction(() => location.pathname === "/login", { timeout: 10000 });
  log("logout ishladi");

  await page.type("input#email", "aziz@misol.uz");
  await page.type("input#password", "parol123");
  // Sotuvchi rolini tanlash
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const seller = btns.find((b) => b.textContent.includes("Sotuvchi"));
    seller?.click();
  });
  await page.click('button[type="submit"]');
  await page.waitForFunction(() => location.pathname === "/dashboard", { timeout: 10000 });
  await page.waitForSelector("h1", { timeout: 10000 });
  const dash = await page.evaluate(() => document.body.innerText);
  if (!dash.includes("Jami daromad")) fail("dashboard'да statistika yo'q");
  else log("seller dashboard: daromad ko'rindi");

  console.log(process.exitCode ? "\n❌ Ba'zi testlar muvaffaqiyatsiz" : "\n✅ Barcha brauzer testlari o'tdi");
} catch (e) {
  fail("xato: " + e.message);
} finally {
  await browser.close();
}

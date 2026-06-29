import puppeteer from "puppeteer-core";
const CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const B="http://localhost:3100";
const b=await puppeteer.launch({executablePath:CH,headless:true,args:["--no-sandbox"]});
const p=await b.newPage(); await p.setViewport({width:430,height:920,deviceScaleFactor:2});
const sleep=m=>new Promise(r=>setTimeout(r,m)); let f=0; const ok=(c,m)=>{console.log((c?"✓":"✗ FAIL")+" "+m); if(!c)f++;};
async function ct(t){await p.evaluate(x=>{[...document.querySelectorAll("button,a")].find(e=>e.textContent.includes(x))?.click();},t);}
await p.goto(`${B}/login`,{waitUntil:"domcontentloaded"}); await p.waitForSelector("input#email");
await p.type("input#email","ali@misol.uz"); await p.type("input#password","parol123");
await p.click('button[type="submit"]'); await p.waitForFunction(()=>location.pathname==="/feed",{timeout:10000});
await sleep(500);
// nav: Xabarlar tab bormi + badge
const navText=await p.evaluate(()=>document.querySelector("nav")?.innerText||"");
ok(navText.includes("Xabarlar"),"pastki nav'da Xabarlar bor");
ok(navText.includes("Lenta")&&navText.includes("Kanallar")&&navText.includes("Profil"),"nav 5 ta bo'lim");
// unread badge (aziz seed dm-3 g1 → emas; ali↔aziz dm-2 aziz->ali read true). ali uchun unread bo'lmasligi mumkin. Skip badge assert.
await p.screenshot({path:"/tmp/shots/ux-01-nav.png"});

// toast: kanal sahifasida wishlist? wishlist kurs sahifasida. Kursga o'tamiz
await p.goto(`${B}/courses/c-web`,{waitUntil:"domcontentloaded"}); await p.waitForSelector("h1"); await sleep(400);
await p.evaluate(()=>{document.querySelector('button[aria-label="Istaklar ro\\'yxati"]')?.click();});
await sleep(300);
const toast1=await p.evaluate(()=>document.body.innerText);
ok(toast1.includes("Istaklarga qo'shildi")||toast1.includes("Istaklardan"),"wishlist toast chiqdi");
await p.screenshot({path:"/tmp/shots/ux-02-toast.png"});

// back button: kursdan ortga → feed (kelgan joy)
await ct("Lentaga"); // notFound emas; agar yo'q bo'lsa back tugma
await sleep(300);

// profil → logout confirm
await p.goto(`${B}/profile`,{waitUntil:"domcontentloaded"}); await p.waitForSelector("h1"); await sleep(300);
await ct("Chiqish"); await sleep(300);
const conf=await p.evaluate(()=>document.body.innerText);
ok(conf.includes("Chiqishni tasdiqlang"),"logout tasdiq oynasi chiqdi");
await p.screenshot({path:"/tmp/shots/ux-03-logout.png"});
await ct("Bekor"); await sleep(200);

// onboarding skip: yangi seller
await p.evaluate(()=>localStorage.clear());
await p.goto(`${B}/register`,{waitUntil:"domcontentloaded"}); await p.waitForSelector("input#email");
await ct("Sotuvchi");
await p.type("input#name","Test Seller"); await p.type("input#email","newseller@x.uz"); await p.type("input#password","parol123");
await p.click('button[type="submit"]');
await p.waitForFunction(()=>location.pathname==="/onboarding",{timeout:10000});
await p.waitForSelector("button"); await sleep(300);
const onb=await p.evaluate(()=>document.body.innerText);
ok(onb.includes("Keyinroq")&&onb.includes("1/2"),"onboarding: Keyinroq + qadam ko'rsatkichi");
await p.screenshot({path:"/tmp/shots/ux-04-onboarding.png"});
await ct("Keyinroq"); await sleep(400);
ok(await p.evaluate(()=>location.pathname==="/dashboard"),"Keyinroq → dashboard");

await b.close();
console.log(f===0?"\n✅ UX TESTLAR O'TDI":`\n❌ ${f} muvaffaqiyatsiz`);
process.exit(f?1:0);

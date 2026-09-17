const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {pathToFileURL} = require('node:url');
const { chromium } = require('C:/Users/ertstyuqk/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const root = 'E:/zzzz/mini';
  const out = __dirname;
  const originals = fs.readdirSync(root).filter(n => /\.(md|html)$/i.test(n)).map(name => {
    const bytes = fs.readFileSync(path.join(root, name));
    return {name, bytes: bytes.length, lines: bytes.toString('utf8').split('\n').length,
      sha256: crypto.createHash('sha256').update(bytes).digest('hex')};
  });
  fs.writeFileSync(path.join(out, 'source-manifest.json'), JSON.stringify(originals, null, 2));
  const browser = await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless:true});
  try {
    const context = await browser.newContext({viewport:{width:1200,height:1000}, deviceScaleFactor:1, javaScriptEnabled:false});
    await context.route(/^https?:/, route => route.abort());
    const page = await context.newPage();
    await page.goto(pathToFileURL(path.join(root, '简历-AI应用开发.html')).href);
    await page.screenshot({path:path.join(out,'original-desktop.png'),fullPage:true});
    const metrics = await page.evaluate(() => ({
      title:document.title,
      viewport:{width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight},
      links:Array.from(document.querySelectorAll('a')).map(a=>({text:a.textContent,href:a.getAttribute('href')})),
      typography:Array.from(document.querySelectorAll('h1,h2,h3,p,li')).map(el=>({tag:el.tagName,fontSize:getComputedStyle(el).fontSize,lineHeight:getComputedStyle(el).lineHeight,chars:el.textContent.length,top:Math.round(el.getBoundingClientRect().top),height:Math.round(el.getBoundingClientRect().height)})),
      scripts:document.querySelectorAll('script').length
    }));
    await page.emulateMedia({media:'print'});
    await page.pdf({path:path.join(out,'original-print-proof.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true});
    metrics.print = await page.evaluate(() => ({styles:Array.from(document.styleSheets).flatMap(s=>Array.from(s.cssRules).map(r=>r.cssText)).filter(t=>/@page|@media print/.test(t))}));
    await page.emulateMedia({media:'screen'});
    await page.setViewportSize({width:390,height:844});
    await page.screenshot({path:path.join(out,'original-mobile.png'),fullPage:true});
    metrics.mobile=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}));
    fs.writeFileSync(path.join(out,'layout-metrics.json'),JSON.stringify(metrics,null,2));
    console.log(JSON.stringify({output:out,...metrics},null,2));
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

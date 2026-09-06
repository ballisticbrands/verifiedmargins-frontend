import puppeteer from "puppeteer-core";
import { writeFileSync } from "node:fs";
const [url, out] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless:"new", args:["--no-sandbox"] });
const p = await b.newPage();
await p.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36");
await p.setViewport({width:1400,height:2000});
await p.goto(url, {waitUntil:"networkidle2", timeout:60000});
for(let i=0;i<12;i++){ await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await new Promise(r=>setTimeout(r,1000)); }
const res = await p.evaluate(()=>{
  const html = document.documentElement.innerHTML;
  const uniq = a=>[...new Set(a)];
  return {
    title: document.title,
    asins: uniq([...html.matchAll(/\b(B0[A-Z0-9]{8})\b/g)].map(m=>m[1])),
    sellerIds: uniq([...html.matchAll(/(?:sellerId|merchantId|me)=([A-Z0-9]{12,14})/g)].map(m=>m[1])),
    brandCandidates: uniq([...html.matchAll(/"brand"\s*:\s*"([^"]{2,40})"/g)].map(m=>m[1])).slice(0,10),
  };
});
writeFileSync(out, JSON.stringify(res, null, 1));
console.log("asins:", res.asins.length, "| sellerIds:", res.sellerIds.join(",") || "none", "| brands:", res.brandCandidates.join(" / ") || "none");
await b.close();

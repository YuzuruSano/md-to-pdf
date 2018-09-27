const fs = require('fs'),assert = require('assert'),puppeteer = require('puppeteer'),markdownIt = require('markdown-it'),mi = new markdownIt();

const target = fs.readFileSync(`${__dirname}/${process.argv[2]}`, 'utf8', function (err, data) {
    if (err) {
        throw err;
    }
    return data;
  });
const css = fs.readFileSync(`${__dirname}/css/style.css`, 'utf8', function (err, data) {
    if (err) {
        throw err;
    }
    return data;
  });
const html = `<html><head><title>Document</title><style>${css}</style></head><body class="markdown-body">${mi.render(target)}</body></html>`;


(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 1600, height: 1200, deviceScaleFactor: 2});
  await page.setContent(html, { waitUntil: 'networkidle0' })
  await page.pdf({
    path: `${process.argv[2]}.pdf`,
    format:'A4',
    printBackground: true,
    margin:{
      top:'60px',
      right:'60px',
      bottom:'60px',
      left:'60px'
    }
  });

  browser.close();
  console.log('PDF出力完了');
})();
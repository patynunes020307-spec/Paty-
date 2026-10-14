const { chromium } = require('/opt/node-tools/node_modules/playwright');
const [,, out, fps, only] = process.argv;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 2560 } });
  await p.goto('file://' + __dirname + '/reel.html');
  await p.evaluate(() => document.fonts.ready);
  const times = only ? only.split(',').map(Number) : [...Array(30 * +fps).keys()].map(i => i / +fps);
  for (let i = 0; i < times.length; i++) {
    await p.evaluate(t => setT(t), times[i]);
    await p.screenshot({ path: `${out}/${only ? 'still_' + times[i] : String(i).padStart(4, '0')}.png` });
  }
  await b.close();
})();

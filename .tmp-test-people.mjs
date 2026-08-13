import { chromium } from 'playwright';

const BASE = 'http://localhost:3002';
const shotDir = 'C:/Users/Ricardo/AppData/Local/Temp/claude/c--Users-Ricardo-Desktop-Inventario-Ferramentas---GVEL/0ffa7920-8ce1-4ed8-951e-080a760cf0c3/scratchpad';
const testName = `Teste Playwright ${Date.now()}`;
const testEmail = `teste.playwright.${Date.now()}@gvel.com`;

const browser = await chromium.launch();
const page = await browser.newPage();
const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push('PAGEERROR: ' + String(err)));

await page.goto(BASE, { waitUntil: 'networkidle' });

const emailInput = page.locator('input[type="email"]').first();
await emailInput.waitFor({ timeout: 15000 });
await emailInput.fill('ricardo_h.16@hotmail.com');
await page.locator('input[type="password"]').first().fill('15975321');
await page.getByRole('button', { name: /entrar/i }).click();
await page.waitForTimeout(1500);

await page.getByText('Configurações', { exact: true }).click();
await page.waitForTimeout(1000);

await page.getByRole('button', { name: /Nova pessoa/i }).click();
await page.waitForTimeout(500);

await page.locator('input[placeholder="ex: J. Miller"]').fill(testName);
await page.locator('input[type="email"]').last().fill(testEmail);

console.log('--- clicking Cadastrar pessoa ---');
await page.getByRole('button', { name: /Cadastrar pessoa/i }).click();

await page.waitForTimeout(300);
console.log('Console errors right after click:', consoleErrors);
await page.screenshot({ path: `${shotDir}/07a-immediate.png`, fullPage: true });

await page.waitForTimeout(1500);
console.log('Console errors after 1.5s:', consoleErrors);
console.log('Current URL:', page.url());
const bodyNow = await page.locator('body').innerText().catch((e) => 'ERROR READING BODY: ' + e);
console.log('Body text now:\n', bodyNow.slice(0, 800));
await page.screenshot({ path: `${shotDir}/07b-after-1500ms.png`, fullPage: true });

await browser.close();
import { expect, test } from '@playwright/test';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test('homepage has Playwright in title and get started link linking to the intro page', async ({
  page,
}) => {
  // Go to http://localhost:3000/
  await page.goto('http://localhost:3000/');
  // Click img[alt="register button"]
  await page.locator('img[alt="register button"]').click();
  await expect(page).toHaveURL('http://localhost:3000/register');

  // Click input >> nth=0
  await page.locator('input').first().click();

  // Fill input >> nth=0
  await page.locator('input').first().fill('talalon22');

  // Click input[type="password"]
  await page.locator('input[type="password"]').click();
  // Fill input[type="password"]
  await page.locator('input[type="password"]').fill('talalon22');
  // Click img[alt="register button"]
  await page.locator('img[alt="register button"]').click();
  await delay(3000);
  await expect(page).toHaveURL('http://localhost:3000/');
});

test('test', async ({ page }) => {
  // Go to http://localhost:3000/
  await page.goto('http://localhost:3000/');
  // Click img[alt="login button"]
  await page.locator('img[alt="login button"]').click();
  await expect(page).toHaveURL('http://localhost:3000/login');
  // Click input >> nth=0
  await page.locator('input').first().click();
  // Fill input >> nth=0
  await page.locator('input').first().fill('alon');
  // Click input[type="password"]
  await page.locator('input[type="password"]').click();
  // Fill input[type="password"]
  await page.locator('input[type="password"]').fill('alon');
  // Click img[alt="login button"]
  await page.locator('img[alt="login button"]').click();
  await delay(3000);

  await expect(page).toHaveURL('http://localhost:3000/game');
  // Click img[alt="logout"]

  await page.locator('img[alt="logout"]').click();
  await delay(3000);

  await expect(page).toHaveURL('http://localhost:3000/');
});

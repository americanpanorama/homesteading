import { expect, test } from '@playwright/test';

const BEAVER_PATH = '/year/1877/stateTerr/UT/office/Beaver';
const SALT_LAKE_CITY_PATH = '/year/1877/stateTerr/UT/office/SaltLakeCity';

test('the home page opens the map experience', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: 'Land Acquisition & Dispossession' })).toBeVisible();

  const exploreLink = page.getByRole('link', { name: 'Explore the Map' });
  await expect(exploreLink).toBeVisible();
  await exploreLink.click();
  await expect(page).toHaveURL(/\/year\/1863/);
  await expect(page.getByRole('main', { name: 'Interactive homesteading map' })).toBeVisible();
});

test('a single-year district uses concise copy and omits comparative charts', async ({ page }) => {
  await page.goto(BEAVER_PATH);

  await expect(page.getByRole('heading', { level: 2, name: 'Beaver, Utah Territory' })).toBeVisible();
  await expect(page.getByText('The Beaver district land office operated only in 1877. The area of the district was 24,797,832 acres (38,747 square miles).')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Claims', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Patents', exact: true })).toHaveCount(0);
});

test('district boundary mini maps do not accumulate when switching offices', async ({ page }) => {
  await page.goto(BEAVER_PATH);

  const miniMaps = page.getByTestId('district-boundary-mini-map');
  await expect(miniMaps).toHaveCount(1);

  await page.getByRole('link', { name: 'View Salt Lake City land office district details' }).click({ force: true });
  await expect(page.getByRole('heading', { level: 2, name: 'Salt Lake City, Utah Territory' })).toBeVisible();
  await expect(miniMaps).toHaveCount(5);

  await page.getByRole('link', { name: 'View Beaver land office district details' }).click({ force: true });
  await expect(page.getByRole('heading', { level: 2, name: 'Beaver, Utah Territory' })).toBeVisible();
  await expect(miniMaps).toHaveCount(1);

  await page.getByRole('link', { name: 'View Salt Lake City land office district details' }).click({ force: true });
  await expect(page.getByRole('heading', { level: 2, name: 'Salt Lake City, Utah Territory' })).toBeVisible();
  await expect(miniMaps).toHaveCount(5);
});

test('a multi-year district keeps its charts and interactive measure controls', async ({ page }) => {
  await page.goto(SALT_LAKE_CITY_PATH);

  await expect(page.getByRole('heading', { name: 'Claims', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Patents', exact: true })).toBeVisible();

  const measureSelect = page.getByLabel('Select chart measure');
  const stackedButton = page.getByRole('button', { name: 'Stacked', exact: true });
  const groupedButton = page.getByRole('button', { name: 'Grouped', exact: true });

  await expect(measureSelect).toHaveValue('number');
  await groupedButton.click();
  await measureSelect.selectOption('average_size');
  await expect(measureSelect).toHaveValue('average_size');
  await expect(stackedButton).toBeDisabled();

  await measureSelect.selectOption('number');
  await expect(stackedButton).toBeEnabled();
});

test('year navigation retains the selected district', async ({ page }) => {
  await page.goto(SALT_LAKE_CITY_PATH);

  await page.getByRole('link', { name: 'Go to previous fiscal year' }).click();
  await expect(page).toHaveURL(/\/year\/1876\/stateTerr\/UT\/office\/SaltLakeCity/);
  await expect(page.getByRole('heading', { level: 2, name: 'Salt Lake City, Utah Territory' })).toBeVisible();
});

test('chart controls preserve a gap at the narrow desktop breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(SALT_LAKE_CITY_PATH);

  const groupedButton = page.getByRole('button', { name: 'Grouped', exact: true });
  const measureSelect = page.getByLabel('Select chart measure');
  await expect(groupedButton).toBeVisible();
  await expect(measureSelect).toBeVisible();

  const groupedBox = await groupedButton.boundingBox();
  const selectBox = await measureSelect.boundingBox();
  expect(groupedBox).not.toBeNull();
  expect(selectBox).not.toBeNull();

  const gap = selectBox!.x - (groupedBox!.x + groupedBox!.width);
  expect(gap).toBeGreaterThanOrEqual(10);
});

test('the accessible timeline table loads state data', async ({ page }) => {
  await page.goto('/table/year/1877/stateTerr/UT');

  await expect(page.getByRole('heading', { level: 2, name: 'Homesteading Activity Data' })).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to the map visualization.' })).toBeVisible();
});

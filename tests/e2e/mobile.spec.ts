import { expect, test } from '@playwright/test';

test('a selected district can open and close its data drawer on a phone', async ({ page }) => {
  await page.goto('/year/1877/stateTerr/UT/office/Beaver');

  await expect(page.getByRole('heading', { level: 2, name: 'Beaver, Utah Territory' })).toBeVisible();
  await expect(page.getByText('In 1877, 27 claims covered 4,006 acres, 0.02% of the district.')).toBeVisible();

  const drawer = page.locator('#mobile-map-details');
  const openButton = page.getByRole('button', { name: 'Open Data' });
  await expect(drawer).toHaveAttribute('aria-hidden', 'true');
  await openButton.click();

  await expect(drawer).toHaveAttribute('aria-hidden', 'false');
  await expect(page.getByRole('button', { name: 'Close Data' })).toBeVisible();
  await expect(page.getByText('The Beaver district land office operated only in 1877. The area of the district was 24,797,832 acres (38,747 square miles).')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Claims', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Patents', exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'Close Data' }).click();
  await expect(drawer).toHaveAttribute('aria-hidden', 'true');
});

test('the national timeline drawer opens on a phone', async ({ page }) => {
  await page.goto('/year/1877');

  const drawer = page.locator('#mobile-map-details');
  await page.getByRole('button', { name: 'Open Timeline' }).click();

  await expect(drawer).toHaveAttribute('aria-hidden', 'false');
  await expect(page.getByRole('button', { name: 'Close Timeline' })).toBeVisible();
  await expect(page.getByText('This timeline visualization is also available as a data table with rows for places and columns for each year.')).toBeVisible();
});

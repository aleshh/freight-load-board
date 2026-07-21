import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('grid', { name: /Freight loads data grid/i })).toBeVisible();
});

test('searches, filters, sorts, and clears the load board', async ({ page }) => {
  const search = page.getByRole('searchbox', { name: 'Search loads' });
  await search.fill('Northstar');
  await expect(page.getByText('7 freight loads found.')).toBeVisible();

  await page.getByRole('button', { name: /Filters/ }).click();
  await page.getByRole('combobox', { name: 'Status' }).click();
  await page.getByRole('option', { name: 'Available' }).click();
  await expect(page.getByRole('button', { name: 'Remove Status filter: Available' })).toBeVisible();

  await page.getByRole('columnheader', { name: /Price/ }).click();
  await expect(page).toHaveURL(/sort=price%3Aasc/);

  await page.getByRole('button', { name: 'Clear all' }).click();
  await expect(page.getByText('48 freight loads found.')).toBeVisible();
});

test('supports pagination, keyboard focus, and persisted themes', async ({ page }) => {
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(page.getByText('Page 2 of 2')).toBeVisible();

  await page.keyboard.press('Control+k');
  await expect(page.getByRole('searchbox', { name: 'Search loads' })).toBeFocused();

  const themeButton = page.getByRole('button', { name: /Theme: system/ });
  await themeButton.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('has no detectable WCAG A or AA violations in the default view', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('grid', { name: /Freight loads data grid/i })).toBeVisible();
});

test('searches, filters, sorts, and clears the load board', async ({ page }) => {
  const search = page.getByRole('searchbox', { name: 'Search loads' });
  await search.fill('Northstar');
  await expect(page.getByText('7 freight loads found · Showing 1–7')).toBeVisible();

  await page.getByRole('button', { name: /Filters/ }).click();
  await page.getByRole('button', { name: 'Status' }).click();
  await page.getByRole('checkbox', { name: 'Available' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Remove Status filter: Available' })).toBeVisible();

  await page.getByRole('columnheader', { name: /Price/ }).click();
  await expect(page).toHaveURL(/sort=price%3Aasc/);

  await page.getByRole('button', { name: 'Clear all' }).click();
  await expect(page.getByText('48 freight loads found · Showing 1–25')).toBeVisible();
});

test('supports pagination, keyboard focus, and persisted settings', async ({ page }) => {
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(page.getByRole('textbox', { name: 'Page' })).toHaveValue('2');
  await expect(page.getByText('of 2')).toBeVisible();

  await page.keyboard.press('Control+k');
  await expect(page.getByRole('searchbox', { name: 'Search loads' })).toBeFocused();

  await page.getByRole('button', { name: 'Open settings' }).click();
  await page.getByRole('button', { name: 'Light' }).click();
  await page.getByRole('switch', { name: 'Load large dataset' }).click();
  await page.getByRole('button', { name: 'Close settings' }).click();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByText('10,000 freight loads found · Showing 1–25')).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByText('10,000 freight loads found · Showing 1–25')).toBeVisible();
});

test('has no detectable WCAG A or AA violations in the default view', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});

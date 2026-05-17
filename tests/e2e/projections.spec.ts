import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Projections page (/)', () => {
  test('loads the page and renders at least one chart svg', async ({ page }) => {
    await page.goto('/');
    const firstSvg = page.locator('svg').first();
    await expect(firstSvg).toBeVisible({ timeout: 30_000 });
  });

  test('passes axe-core accessibility checks (no critical/serious violations)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();

    const critical = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );
    if (critical.length > 0) {
      console.error(JSON.stringify(critical, null, 2));
    }
    expect(critical).toEqual([]);
  });

  test('title is non-empty', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
  });
});

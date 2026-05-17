import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Simulator page (/Simulador)', () => {
  test('loads and renders the simulator UI', async ({ page }) => {
    await page.goto('/Simulador');
    const svgOrInput = page.locator('svg, input').first();
    await expect(svgOrInput).toBeVisible({ timeout: 30_000 });
  });

  test('changing a numeric input triggers a re-render', async ({ page }) => {
    await page.goto('/Simulador');
    const numericInputs = page.locator('input[type="number"], input[type="range"]');
    const count = await numericInputs.count();
    test.skip(count === 0, 'no numeric/range input found on /Simulador');

    const first = numericInputs.first();
    await first.fill('100');
    await page.waitForTimeout(500);
    await expect(page.locator('svg').first()).toBeVisible();
  });

  test('passes axe-core checks (no critical/serious violations)', async ({ page }) => {
    await page.goto('/Simulador');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();

    const blocking = results.violations.filter((v) =>
      ['critical', 'serious'].includes(v.impact ?? ''),
    );
    if (blocking.length > 0) {
      console.error(JSON.stringify(blocking, null, 2));
    }
    expect(blocking).toEqual([]);
  });
});

import { type Page, type Download } from '@playwright/test';

const SAMPLE_JSON = '{"a":1,"b":[1,2,3]}';

/** Wait until the island has hydrated and is ready to accept input. */
export async function waitReady(page: Page) {
  await page.waitForFunction(() => (window as Record<string, unknown>).__toolReady === true);
}

/**
 * Type a small valid JSON document into the input and download the formatted
 * result (the default mode). Used by generic (engine-independent)
 * covenant/i18n/a11y checks; conversion.spec.ts drives format/minify/validate
 * and the error-reporting path in more detail.
 */
export async function convert(page: Page): Promise<Download> {
  await page.locator('#json-input').waitFor({ state: 'visible' });
  await page.fill('#json-input', SAMPLE_JSON);
  await page.locator('#download-action').waitFor({ state: 'visible' });
  const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
  await page.locator('#download-action').click();
  return downloadPromise;
}

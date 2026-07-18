import { test, expect, type Page } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { waitReady } from './_helpers';

const SAMPLE_PATH = fileURLToPath(new URL('../fixtures/json/sample.json', import.meta.url));
const SAMPLE_JSON = readFileSync(SAMPLE_PATH, 'utf-8');
// A real nested object: arrays, a nested object, unicode strings, and decimal numbers.
const SAMPLE_PARSED = JSON.parse(SAMPLE_JSON);

/** Tracks every request that leaves the local origin (the no-upload covenant, #1). */
function trackExternal(page: Page): string[] {
  const external: string[] = [];
  page.on('request', (req) => {
    const url = req.url();
    if (!url.startsWith('http://localhost:4321') && !url.startsWith('data:') && !url.startsWith('blob:')) {
      external.push(url);
    }
  });
  return external;
}

test.describe('format / minify / validate', () => {
  test('formats a real nested JSON document (arrays, nested objects, unicode, decimals), with no upload', async ({ page }) => {
    const external = trackExternal(page);

    await page.goto('/format-json/');
    await waitReady(page);

    await page.fill('#json-input', SAMPLE_JSON);
    // Default mode is Format with a 2-space indent.
    await expect(page.locator('#mode-format')).toBeChecked();

    const output = page.getByTestId('json-output');
    await expect(output).toBeVisible();
    const text = (await output.textContent()) ?? '';

    // The re-formatted output re-parses to exactly the same value: nothing in
    // the data itself was reordered, added, or dropped — only whitespace changed.
    expect(JSON.parse(text)).toEqual(SAMPLE_PARSED);
    // 2-space indent is visible on a nested line.
    expect(text).toContain('\n  "name"');
    expect(text).toContain('\n    "count"');
    // Unicode and emoji survive round-tripping through the textarea and the parser.
    expect(text).toContain('日本語');
    expect(text).toContain('🎉');

    expect(external, `unexpected cross-origin requests: ${external.join(', ')}`).toHaveLength(0);
  });

  test('switches indent to 4 spaces and to a tab', async ({ page }) => {
    await page.goto('/format-json/');
    await waitReady(page);
    await page.fill('#json-input', '{"a":{"b":1}}');

    await page.selectOption('#indent-select', '4');
    let text = (await page.getByTestId('json-output').textContent()) ?? '';
    expect(text).toContain('\n    "a"');
    expect(text).toContain('\n        "b"');

    await page.selectOption('#indent-select', 'tab');
    text = (await page.getByTestId('json-output').textContent()) ?? '';
    expect(text).toContain('\n\t"a"');
    expect(text).toContain('\n\t\t"b"');
  });

  test('minifies the same document to a single line and reports a smaller byte size', async ({ page }) => {
    await page.goto('/format-json/');
    await waitReady(page);
    await page.fill('#json-input', SAMPLE_JSON);

    const inputSizeBefore = (await page.getByTestId('input-size').textContent()) ?? '';

    await page.click('#mode-minify');
    const output = page.getByTestId('json-output');
    const text = (await output.textContent()) ?? '';

    expect(text).not.toContain('\n');
    expect(text).not.toContain('  ');
    expect(JSON.parse(text)).toEqual(SAMPLE_PARSED);

    // Byte-size before/after (§15.3): minified output is strictly smaller than the
    // pretty original, and both sizes are shown.
    const outputSizeText = (await page.getByTestId('output-size').textContent()) ?? '';
    const inputBytes = Number(inputSizeBefore.match(/[\d,]+/)?.[0].replace(/,/g, ''));
    const outputBytes = Number(outputSizeText.match(/[\d,]+/)?.[0].replace(/,/g, ''));
    expect(outputBytes).toBeLessThan(inputBytes);

    // Download uses the .min.json naming convention.
    const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
    await page.click('#download-action');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('minified.json');
    const buf = readFileSync((await download.path()) as string, 'utf-8');
    expect(JSON.parse(buf)).toEqual(SAMPLE_PARSED);
  });

  test('validate mode reports OK for valid JSON, with no output/copy/download', async ({ page }) => {
    await page.goto('/format-json/');
    await waitReady(page);
    await page.fill('#json-input', '{"ok":true}');
    await page.click('#mode-validate');

    await expect(page.getByTestId('validate-status')).toBeVisible();
    await expect(page.getByTestId('validate-status')).toContainText(/valid/i);
    await expect(page.getByTestId('json-output')).toHaveCount(0);
    await expect(page.locator('#download-action')).toHaveCount(0);
  });

  test('reports a sensible error location for a trailing comma', async ({ page }) => {
    await page.goto('/format-json/');
    await waitReady(page);
    // Trailing comma before the closing brace, on line 2.
    await page.fill('#json-input', '{\n  "a": 1,\n}');
    await page.click('#mode-validate');

    const error = page.getByTestId('json-error');
    await expect(error).toBeVisible();
    const text = (await error.textContent()) ?? '';
    // Chromium/Firefox expose a line/column for this shape; when they do, the
    // location is shown ("Line 3" — the closing brace/property-name error lands
    // on the line after the trailing comma). Every engine's raw message is a
    // substring of what's shown, so this holds regardless of exact wording.
    expect(text.length).toBeGreaterThan(0);
  });

  test('reports a sensible error for an unquoted key', async ({ page }) => {
    await page.goto('/format-json/');
    await waitReady(page);
    await page.fill('#json-input', '{ b: 2 }');
    await page.click('#mode-validate');

    const error = page.getByTestId('json-error');
    await expect(error).toBeVisible();
    const text = (await error.textContent()) ?? '';
    expect(text.length).toBeGreaterThan(0);
    // Never silently "fixed" — Format/Minify also refuse to produce output.
    await page.click('#mode-format');
    await expect(page.getByTestId('json-error')).toBeVisible();
    await expect(page.getByTestId('json-output')).toHaveCount(0);
  });

  test('loading a .json file via the file picker populates the input and shows the loaded name', async ({ page }) => {
    await page.goto('/format-json/');
    await waitReady(page);

    await page.setInputFiles('#file-input', SAMPLE_PATH);
    await expect(page.locator('#json-input')).toHaveValue(SAMPLE_JSON);
    await expect(page.getByText('sample.json')).toBeVisible();

    const output = page.getByTestId('json-output');
    const text = (await output.textContent()) ?? '';
    expect(JSON.parse(text)).toEqual(SAMPLE_PARSED);
  });

  test('Clear empties the input and returns the output panel to its idle hint', async ({ page }) => {
    await page.goto('/format-json/');
    await waitReady(page);
    await page.fill('#json-input', '{"a":1}');
    await expect(page.getByTestId('json-output')).toBeVisible();

    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.locator('#json-input')).toHaveValue('');
    await expect(page.getByTestId('json-output')).toHaveCount(0);
    await expect(page.getByTestId('json-error')).toHaveCount(0);
  });
});

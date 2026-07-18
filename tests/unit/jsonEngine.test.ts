import { describe, it, expect } from 'vitest';
import {
  parseJson,
  formatJson,
  minifyJson,
  validateJson,
  lineColumnAt,
  locateParseError,
  byteSize,
  pointerSnippet,
  deriveOutputName,
} from '@/utils/jsonEngine';

describe('lineColumnAt', () => {
  it('is 1-based and starts a fresh input at line 1 column 1', () => {
    expect(lineColumnAt('abc', 0)).toEqual({ line: 1, column: 1 });
  });

  it('advances the column across a single line', () => {
    expect(lineColumnAt('abcdef', 3)).toEqual({ line: 1, column: 4 });
  });

  it('moves to the next line and resets the column after a newline', () => {
    // "abc\ndef", offset 5 -> chars 0..4 consumed (a,b,c,\n,d) -> points at "e".
    expect(lineColumnAt('abc\ndef', 5)).toEqual({ line: 2, column: 2 });
  });

  it('counts multiple newlines correctly', () => {
    expect(lineColumnAt('a\nb\nc\nd', 6)).toEqual({ line: 4, column: 1 });
  });

  it('clamps an offset beyond the input length to the end', () => {
    expect(lineColumnAt('abc', 999)).toEqual({ line: 1, column: 4 });
  });

  it('clamps a negative offset to the start', () => {
    expect(lineColumnAt('abc', -5)).toEqual({ line: 1, column: 1 });
  });
});

describe('locateParseError', () => {
  // These message strings are not invented — they were captured with Playwright
  // from real Chromium, Firefox, and WebKit evaluating JSON.parse on malformed
  // input (see the module doc comment in jsonEngine.ts). Testing against them
  // directly means this logic is verified against actual per-engine phrasing,
  // not just whatever JSON.parse happens to say in the Node runtime executing
  // this test file.

  it('Chromium/V8: extracts the embedded "line L column C" directly, not recomputed', () => {
    const message = 'Expected double-quoted property name in JSON at position 7 (line 1 column 8)';
    // Deliberately pass an unrelated `input` — proves the line/column comes
    // straight from the message, not from re-scanning the input.
    expect(locateParseError(message, 'unrelated')).toEqual({ line: 1, column: 8 });
  });

  it('Firefox: extracts "at line L column C of the JSON data"', () => {
    const message = 'JSON.parse: expected double-quoted property name at line 1 column 8 of the JSON data';
    expect(locateParseError(message, 'unrelated')).toEqual({ line: 1, column: 8 });
  });

  it('WebKit/Safari: exposes no position at all — returns no location', () => {
    const message = 'JSON Parse error: Property name must be a string literal';
    expect(locateParseError(message, '{"a":1,}')).toEqual({});
  });

  it("Chromium's snippet-only shape (no position, no line/column): returns no location", () => {
    const message = `Unexpected token 'o', "not json" is not valid JSON`;
    expect(locateParseError(message, 'not json')).toEqual({});
  });

  it('falls back to counting from a bare "position N" when no line/column is embedded', () => {
    const message = 'Unexpected token ) in JSON at position 5';
    // "abc\ndef", position 5 -> line 2, column 2 (see lineColumnAt test above).
    expect(locateParseError(message, 'abc\ndef')).toEqual({ line: 2, column: 2 });
  });
});

describe('parseJson', () => {
  it('parses a nested object with arrays, unicode, and decimals', () => {
    const input = '{"a":[1,2.5,-3],"b":{"c":"café 🎉"},"d":null,"e":true}';
    const result = parseJson(input);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ a: [1, 2.5, -3], b: { c: 'café 🎉' }, d: null, e: true });
    }
  });

  it('returns ok:false with a non-empty message for malformed input, never throwing', () => {
    const result = parseJson('{"a":1,}');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message.length).toBeGreaterThan(0);
      // Whenever a line is reported, a column is too (never one without the other).
      if (result.error.line !== undefined) {
        expect(result.error.column).toBeGreaterThan(0);
        expect(result.error.line).toBeGreaterThan(0);
      }
    }
  });

  it('handles an empty/whitespace-only input as an error, not a crash', () => {
    expect(parseJson('').ok).toBe(false);
    expect(parseJson('   ').ok).toBe(false);
  });
});

describe('formatJson', () => {
  const input = '{"b":2,"a":{"c":1}}';

  it('pretty-prints with a 2-space indent by default option', () => {
    const result = formatJson(input, '2');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe('{\n  "b": 2,\n  "a": {\n    "c": 1\n  }\n}');
    }
  });

  it('pretty-prints with a 4-space indent', () => {
    const result = formatJson(input, '4');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toContain('\n    "b"');
  });

  it('pretty-prints with a tab indent', () => {
    const result = formatJson(input, 'tab');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toContain('\n\t"b"');
  });

  it('never reorders keys or changes values — only whitespace changes', () => {
    const result = formatJson(input, '2');
    expect(result.ok).toBe(true);
    if (result.ok) expect(JSON.parse(result.value)).toEqual(JSON.parse(input));
  });

  it('propagates a parse error instead of producing partial output', () => {
    const result = formatJson('{bad', '2');
    expect(result.ok).toBe(false);
  });
});

describe('minifyJson', () => {
  it('strips all insignificant whitespace', () => {
    const result = minifyJson('{\n  "a" : 1,\n  "b" : [1, 2, 3]\n}');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe('{"a":1,"b":[1,2,3]}');
  });

  it('round-trips to the same data as the input', () => {
    const input = '{"nested":{"unicode":"日本語","n":0.333}}';
    const result = minifyJson(input);
    expect(result.ok).toBe(true);
    if (result.ok) expect(JSON.parse(result.value)).toEqual(JSON.parse(input));
  });

  it('propagates a parse error instead of producing partial output', () => {
    expect(minifyJson('{bad').ok).toBe(false);
  });
});

describe('validateJson', () => {
  it('is ok for valid JSON, with no transformed output value', () => {
    const result = validateJson('{"a":1}');
    expect(result).toEqual({ ok: true, value: true });
  });

  it('is not ok for invalid JSON, exposing the same error shape as parseJson', () => {
    const result = validateJson('{"a":1,}');
    expect(result.ok).toBe(false);
  });
});

describe('byteSize', () => {
  it('counts plain ASCII as one byte per character', () => {
    expect(byteSize('abc')).toBe(3);
  });

  it('counts a 2-byte UTF-8 character correctly (not string .length)', () => {
    // "café" is 4 UTF-16 code units but 5 UTF-8 bytes (é is 2 bytes).
    expect('café'.length).toBe(4);
    expect(byteSize('café')).toBe(5);
  });

  it('counts an astral (surrogate-pair) emoji as 4 UTF-8 bytes', () => {
    // U+1F389 is 2 UTF-16 code units but a single 4-byte UTF-8 sequence.
    expect('🎉'.length).toBe(2);
    expect(byteSize('🎉')).toBe(4);
  });

  it('counts an empty string as zero bytes', () => {
    expect(byteSize('')).toBe(0);
  });
});

describe('pointerSnippet', () => {
  it('shows the offending line with a caret under the reported column', () => {
    expect(pointerSnippet('abc\ndefg\nhij', 2, 3)).toBe('defg\n  ^');
  });

  it('points at the first column', () => {
    expect(pointerSnippet('abc', 1, 1)).toBe('abc\n^');
  });

  it('clamps a column past the end of the line', () => {
    expect(pointerSnippet('ab', 1, 99)).toBe('ab\n  ^');
  });
});

describe('deriveOutputName', () => {
  it('uses a generic name when no source file was loaded', () => {
    expect(deriveOutputName('format')).toBe('formatted.json');
    expect(deriveOutputName('minify')).toBe('minified.json');
  });

  it('derives from the loaded file\'s base name, stripping only the last extension', () => {
    expect(deriveOutputName('format', 'data.json')).toBe('data.formatted.json');
    expect(deriveOutputName('minify', 'data.json')).toBe('data.min.json');
    expect(deriveOutputName('format', 'archive.tar.json')).toBe('archive.tar.formatted.json');
  });

  it('handles a source name with no extension', () => {
    expect(deriveOutputName('format', 'noext')).toBe('noext.formatted.json');
  });
});

/**
 * JSON format / minify / validate engine. Pure functions, no I/O — native
 * `JSON.parse` / `JSON.stringify` only (confirmed scope, issue #69: no
 * external library — JSON is simple enough that the browser's built-in
 * parser is both the fastest and the most correct implementation available).
 *
 * Error reporting: `JSON.parse`'s thrown message differs by browser engine.
 * This was verified with Playwright against real Chromium/Firefox/WebKit
 * (not assumed from docs) for a battery of malformed inputs:
 *
 *   - Chromium/V8: often embeds "at position N (line L column C)", but for
 *     some error shapes (e.g. a token that starts an unparseable value, or
 *     a trailing comma before `]`) gives only a quoted source snippet with
 *     NO position at all — e.g. `Unexpected token ']', "[1,2,]" is not
 *     valid JSON`.
 *   - Firefox: always embeds "at line L column C of the JSON data".
 *   - WebKit/Safari: never exposes a position — a bare message only, e.g.
 *     `Expected '}'` or `Unexpected identifier "foo"`.
 *
 * So the parser must not assume a position is always present. When the
 * engine's message exposes an explicit "line L column C", that is used
 * directly. When it only exposes a raw character offset ("position N"),
 * line/column is derived by counting characters (and newlines) up to that
 * offset in the original input — the same way a human reading the textarea
 * would count them. When neither is present (WebKit, or V8's snippet-only
 * shape), no line/column is fabricated — the raw engine message is shown by
 * itself, per the confirmed scope.
 */

export type IndentOption = '2' | '4' | 'tab';
export type OutputMode = 'format' | 'minify';

export interface JsonParseError {
  /** The engine's own message, always shown verbatim (never rewritten). */
  message: string;
  /** 1-based line/column, only present when derivable from the message. */
  line?: number;
  column?: number;
}

export type JsonResult<T> = { ok: true; value: T } | { ok: false; error: JsonParseError };

/** 1-based line/column of `offset` within `input`, counting chars and newlines. */
export function lineColumnAt(input: string, offset: number): { line: number; column: number } {
  const end = Math.max(0, Math.min(offset, input.length));
  let line = 1;
  let column = 1;
  for (let i = 0; i < end; i++) {
    if (input[i] === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
}

/**
 * Best-effort location extraction from a `JSON.parse` error message.
 * See the module doc comment for the per-engine shapes this handles.
 * Exported (in addition to being used by `parseJson`) so it can be unit-tested
 * directly against the exact message shapes verified per-engine, independent
 * of whatever `JSON.parse` phrasing the test runner's own JS engine happens
 * to produce.
 */
export function locateParseError(message: string, input: string): { line?: number; column?: number } {
  const lineCol = message.match(/line (\d+) column (\d+)/i);
  if (lineCol) return { line: Number(lineCol[1]), column: Number(lineCol[2]) };

  const pos = message.match(/position (\d+)/i);
  if (pos) return lineColumnAt(input, Number(pos[1]));

  return {};
}

/** Parse `input` as JSON, returning either the value or a located parse error. */
export function parseJson(input: string): JsonResult<unknown> {
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: { message, ...locateParseError(message, input) } };
  }
}

function indentArg(indent: IndentOption): string | number {
  return indent === 'tab' ? '\t' : Number(indent);
}

/** Pretty-print `input` with the given indent (2 spaces / 4 spaces / tab). */
export function formatJson(input: string, indent: IndentOption): JsonResult<string> {
  const parsed = parseJson(input);
  if (!parsed.ok) return parsed;
  return { ok: true, value: JSON.stringify(parsed.value, null, indentArg(indent)) };
}

/** Strip all insignificant whitespace from `input`. */
export function minifyJson(input: string): JsonResult<string> {
  const parsed = parseJson(input);
  if (!parsed.ok) return parsed;
  return { ok: true, value: JSON.stringify(parsed.value) };
}

/** Validate-only: no transformed output, just ok/error. */
export function validateJson(input: string): JsonResult<true> {
  const parsed = parseJson(input);
  if (!parsed.ok) return parsed;
  return { ok: true, value: true };
}

/** UTF-8 byte length — not `.length`, which counts UTF-16 code units and
 * under-counts anything outside the Basic Multilingual Plane / most non-ASCII text. */
export function byteSize(text: string): number {
  return new TextEncoder().encode(text).length;
}

/**
 * A small two-line "pointer" snippet around a 1-based line/column, similar to
 * what compilers show: the offending source line, then a caret under the
 * column. A practical, lightweight stand-in for a full syntax-highlighting
 * overlay in the textarea.
 */
export function pointerSnippet(input: string, line: number, column: number): string {
  const lines = input.split('\n');
  const source = lines[line - 1] ?? '';
  const caretPos = Math.max(0, Math.min(column - 1, source.length));
  return `${source}\n${' '.repeat(caretPos)}^`;
}

function baseNameOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(0, dot) : name;
}

/** Download filename for the transformed output, derived from the loaded file's name (if any). */
export function deriveOutputName(mode: OutputMode, sourceName?: string): string {
  if (sourceName) {
    const base = baseNameOf(sourceName);
    return mode === 'format' ? `${base}.formatted.json` : `${base}.min.json`;
  }
  return mode === 'format' ? 'formatted.json' : 'minified.json';
}

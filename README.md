# format-json

Format (pretty-print), minify, or validate JSON, entirely in your browser. JSON is
processed on your device and never uploaded. Open source, works offline (PWA).

Part of [runlocally](https://runlocally.app) — small tools that run locally on your device.

## How it works

Parsing uses the browser's native `JSON.parse`; formatting and minifying use
`JSON.stringify` with (or without) an indent argument. No external JSON library —
the built-in parser is both the fastest and the most correct implementation available,
and it's the same parser your own code runs on. When `JSON.parse` throws, the engine's
own error message is shown, with a line/column derived from wherever in the input it
points to (see `src/utils/jsonEngine.ts` for exactly how each browser engine's message
shape is handled — Chromium, Firefox and WebKit all phrase it differently, and WebKit
never exposes a numeric position at all).

## Features

- Format (pretty-print) with a 2-space, 4-space, or tab indent
- Minify: strip all insignificant whitespace
- Validate: parse-only, with a precise error location when available
- Paste/type into a textarea, or choose a `.json` file
- Copy to clipboard or download the result as `.json`; input/output byte sizes shown
- Works offline (PWA), installable

## Develop

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build to dist/
```

Stack: Astro + Preact + TypeScript. No Web Worker and no third-party runtime
dependency — JSON parsing/serialization is fast enough to run directly on the main
thread with the browser's built-in `JSON` object.

## Browser support

Works in any browser with `JSON.parse`/`JSON.stringify` (i.e. all current browsers).
Error locations are most precise in Chromium and Firefox, which expose a line/column
in the parse error; WebKit/Safari does not expose one, so on WebKit only the raw
error message is shown, with no fabricated line/column.

## License

[MIT](./LICENSE). Built and maintained by Geppetto. Some code is written with AI
assistance; all review and decisions are the maintainer's.

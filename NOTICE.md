# Third-party notices

The source code in this repository is licensed under the [MIT License](./LICENSE).

This application has **no third-party runtime dependency** beyond its framework:
Astro, Preact, and `@astrojs/preact` are all distributed under the MIT License. JSON
parsing, formatting, minifying, and error-location handling are done with the
browser's native `JSON.parse`/`JSON.stringify` (`src/utils/jsonEngine.ts`) — no
external JSON library is used.

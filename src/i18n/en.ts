import type { ToolContent } from './types';

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'Format JSON — Pretty-Print, Minify & Validate, No Upload | runlocally',
    description:
      'Format (pretty-print), minify, or validate JSON directly in your browser. Invalid JSON shows the line and column where parsing failed. Nothing is uploaded — open source, works offline.',
    ogTitle: 'Format JSON — Pretty-Print, Minify & Validate',
    ogDescription:
      'Format, minify, or validate JSON in your browser. Errors show the exact line and column. Nothing is uploaded.',
  },

  hero: {
    h1: 'Format JSON',
    tagline:
      'Pretty-print, minify, or validate JSON — in your browser. Invalid JSON shows exactly where it breaks. Nothing is uploaded.',
  },

  intro: {
    h2: 'Format, minify, or validate JSON without leaving your browser',
    paras: [
      'Paste JSON, type it directly, or choose a .json file. Pick Format to pretty-print it with 2 spaces, 4 spaces, or a tab; Minify to strip every insignificant space and newline; or Validate to just check whether it parses, with nothing rewritten.',
      "Parsing uses the browser's own built-in JSON.parse — the same parser your code runs on — so a file that's valid here is valid everywhere. When it isn't, the error your browser actually threw is shown next to the line and column it points to, not a guess.",
    ],
  },

  privacy: {
    h2: 'Why your JSON stays on your device',
    lead: 'Privacy here is structural, not a promise. There is no upload step because there is no server to upload to — this matters more than usual here, since JSON pasted into a formatter is often a real API response, a config file, or a payload with tokens and other data you would not want to send anywhere:',
    points: [
      'Parsing, formatting, minifying and validation all happen entirely in your browser.',
      'The page is served as static files and makes no request with your JSON.',
      'The source is open and anyone can read it (MIT).',
      'It works offline, which is only possible because nothing leaves the device.',
    ],
    note: "If you want to check for yourself, open your browser's Network panel while formatting — no request carries your data.",
    sourceLinkText: 'Read the source.',
  },

  howto: {
    h2: 'How to use it',
    steps: [
      {
        h3: 'Add your JSON',
        p: 'Paste it into the text box, type it directly, or click to choose a .json file. Dropping a file anywhere on the page works too.',
      },
      {
        h3: 'Pick a mode',
        p: 'Format pretty-prints with your chosen indent (2 spaces, 4 spaces, or a tab). Minify removes all insignificant whitespace. Validate only checks whether it parses.',
      },
      {
        h3: 'Fix errors if there are any',
        p: 'Invalid JSON shows the exact line and column your browser reported, next to the offending line, so you can find and fix the problem quickly.',
      },
      {
        h3: 'Copy or download the result',
        p: 'Copy the formatted or minified output to the clipboard, or download it as a .json file. Byte sizes for the input and output are shown, so you can see exactly how much minifying saved.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Is my JSON uploaded anywhere?',
      a: "No. Parsing, formatting, minifying and validating all happen entirely in your browser. There is no server component, so your data has no path off your device. The source is open and you can confirm this in your browser's Network panel.",
    },
    {
      q: "What's the difference between Format, Minify, and Validate?",
      a: 'Format pretty-prints your JSON with a consistent indent (2 spaces, 4 spaces, or a tab). Minify does the opposite: it strips every space, tab, and newline that JSON does not require, producing the smallest valid output. Validate does neither — it just parses the input and reports whether it is valid JSON, and where it fails if not.',
    },
    {
      q: 'How is the error location worked out?',
      a: "It comes directly from your browser's own JSON parser, JSON.parse — the exact message it throws is shown, with the line and column derived from wherever in your text it points to. Different browsers phrase these messages differently, and some do not expose a precise position at all; when that happens, the tool shows the raw message rather than guessing a location.",
    },
    {
      q: 'Does formatting or minifying change the data itself?',
      a: 'No. Only whitespace changes. Object key order and every value are preserved exactly as your browser\'s JSON parser reads them — the tool never reorders, adds, or removes anything.',
    },
    {
      q: 'Is there a file size limit?',
      a: "There is no fixed limit. Because everything runs in your browser, the practical ceiling depends on your device's memory — very large files may simply take longer to parse or format.",
    },
    {
      q: 'Does it work offline?',
      a: 'Yes. It is a PWA. After the first visit it is cached, so formatting and validating work without a network connection. You can also install it to your home screen.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      "Built and maintained by Geppetto. Some code is written with AI assistance; all review and decisions are the maintainer's.",
    securityText: 'Security',
  },

  related: {
    h2: 'Related tools',
    blogLinkText: 'Read the technical notes',
  },
};

# Yawar Hayyat — Portfolio

A static, dependency-free recreation of the portfolio page. Plain HTML, CSS, and one small
ES module. No build step, no framework, no package install.

## Folder structure

```
portfolio/
├── index.html        Page markup (nav, intro, work, capabilities, process, tools, footer)
├── styles.css        All styling. Design tokens live in :root at the top.
├── main.js           Renders the Selected Work list from projects.json
├── projects.json     Your project data — edit this to change the work list
└── assets/
    └── portrait.png  Your cut-out portrait (see "Assets" below)
```

## Running it

Because `main.js` fetches `projects.json`, open it through a local server rather than
double-clicking the file:

```bash
# any one of these
npx serve .
python3 -m http.server 8000
```

Then visit the printed URL.

## Assets

Save your portrait as `assets/portrait.png`. The original is here:

https://framerusercontent.com/images/9Nm7zYldv7KktcGaEQA6luCkAw.png

Project thumbnails are currently hot-linked from Unsplash inside `projects.json`.
For production, download them into `assets/` and point the `image` fields at local paths.

## Editing guide

**Colours, spacing, fonts** — every value is a CSS custom property at the top of
`styles.css`. Change `--wine` and the accent updates everywhere.

| Token | Value | Used for |
| --- | --- | --- |
| `--paper` | `#ffffff` | Page background |
| `--surface` | `#f5f3f3` | Alternating section background |
| `--ink` | `#111111` | Primary text |
| `--muted` | `#6b6462` | Body and secondary text |
| `--hairline` | `#e6e1e1` | 1px dividers and grid cell borders |
| `--wine` | `#7b1e2b` | Accent: eyebrows, numerals, underlines |
| `--wine-deep` | `#4e1219` | Footer block |
| `--rail` | `1080px` | Shared content width for every section |

**Type scale** — utility classes: `.display`, `.heading`, `.title`, `.body`, `.small`,
`.eyebrow`. Reuse these instead of adding new font sizes.

**Adding a project** — append an object to `projects.json`. Index numbers are generated
automatically from array order.

**Adding a capability** — copy an `<article class="cap">` block in `index.html`. The grid
reflows on its own; icons are inline SVG paths from the Lucide set.

**Sections** — every section follows the same shape:

```html
<section class="section" id="anchor">
  <div class="rail">…</div>
</section>
```

Add `section--surface` for the tinted background. Keeping content inside `.rail` is what
holds every section on the same left and right edges.

## Responsive behaviour

Two breakpoints in `styles.css`:

- **≤ 900px** — portrait shrinks, capability grid drops to two columns
- **≤ 640px** — intro stacks, thumbnails go full width above the text, grid becomes one
  column, process numerals move above their titles

## Notes

Fonts load from Google Fonts (Instrument Sans, weights 400–700). To self-host, drop the
woff2 files into `assets/fonts/`, replace the `<link>` in `index.html` with `@font-face`
rules, and leave `--font` as it is.

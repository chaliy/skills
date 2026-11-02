---
name: sharp-screenshots
description: Produce crisp, retina-sharp screenshots for docs, sites, blogs, changelogs and PRs. Use whenever you capture, rebuild, composite or publish a screenshot, or when an image looks blurry.
---

# Sharp Screenshots

A screenshot is sharp when the image has at least **2 image pixels for every CSS pixel it is
shown at**, was rendered at that density rather than scaled up to it, and is stored without
lossy compression. Everything below serves those three rules.

Helper: `sharp-screenshot.mjs` next to this file (Node 18+, Playwright for `shot`).

```bash
# Render a URL, or a local HTML file, or one element of it, at 2x
node sharp-screenshot.mjs shot http://localhost:3000/page out.png \
  --selector "main" --viewport 1280x800 --display-width 720

# Check images you already have against the width the page shows them at
node sharp-screenshot.mjs check docs/images/*.png --display-width 720
```

`check` exits non-zero when an image is below 2x, and warns on JPEG or lossy WebP. Find the
display width from the page's content column (an article column is often 650 to 800 CSS px).

## Pick the capture route

Work down this list and stop at the first route that applies.

1. **Anything that renders in a browser** (your app, a site, docs, a component): render it
   in Playwright at `deviceScaleFactor: 2` with `shot`, cropped to the element that matters
   (`--selector`). When the backend is heavy, run the frontend alone and answer its API
   calls with Playwright `page.route()` fixtures.
2. **Anything that does not** (a terminal session, a desktop or mobile app, a dialog, a
   notification, a conversation in another app): rebuild it in HTML from the real content
   and render that at 2x. Start from `templates/window.html` (browser, terminal, title-bar
   or bare chrome; set the width and paste the content), or from `templates/chat.html` for
   a message thread. A rebuild renders at any density and can be redone when the content
   changes.
3. **Only a person's own machine can capture it** (a native UI too complex to rebuild):
   ask for a native screenshot (`Cmd+Shift+4` on a Retina Mac is 2x). Name exactly what to
   capture, because the person will skim the request.

Never generate a screenshot with an image model. It garbles text and invents UI, and the
result is a fake record of the product.

## Gotchas

- **Remote and computer-use captures are not 2x.** Screen-sharing and desktop-control
  tools cap out below the display's native density (about 1.7x on a Retina Mac in
  practice), and their zoom tools only crop: they do not add pixels. Use them to read
  the content, not as the final image.
- **Never upscale.** Resizing a 600 px capture to 1200 px doubles the pixels and keeps the
  blur. Re-render at the target size instead.
- **No JPEG for UI.** Tool results and screen captures often arrive as JPEG. Text edges
  smear under lossy compression. Keep PNG, or convert to lossless WebP (`cwebp
  -lossless`). Lossy JPEG or WebP is for photographs.
- **Wait for fonts.** A capture taken before web fonts load uses fallback fonts and looks
  subtly wrong. The helper waits for `document.fonts.ready`. Check that every script you
  show (Cyrillic, CJK, Arabic) is covered by a loaded font, or it falls back.
- **Emoji and system fonts differ by platform.** Linux renders Noto Color Emoji, macOS
  Apple Color Emoji. Say which in the PR when it matters.
- **Text size after scaling.** An image wider than the column is scaled down on the page,
  and so is its text. Keep body text at 13 CSS px or more after scaling: a 1000 px wide
  image in a 720 px column shrinks 15 px text to 11 px. Stack panels vertically before
  letting the canvas grow wide.
- **Layout can blur images too.** An `img` without `max-width: 100%` overflows on mobile,
  and a grid column of `1fr` grows to fit a wide child. Use `minmax(0, 1fr)`.
- **Crop to the change.** A full-window capture spends most of its pixels on chrome.
  Screenshot one element, not the page.
- **Real content only.** A rebuild uses the exact text, names, times and output of
  something that took place. Do not edit what a program printed or a person said. Rerun it
  instead.
- **Icons, avatars and logos.** Take them from their source files at full size (SVG when
  available), not cropped from a low-density capture.
- **Look at it.** Open the final image at 100% and zoom into body text before publishing.
  A build that passes says nothing about blur.

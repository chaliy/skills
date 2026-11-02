---
name: sharp-screenshots
description: Produce crisp, retina-sharp screenshots and chat images for docs, sites, blogs, changelogs and PRs. Use whenever you capture, composite or publish a screenshot, or when an image looks blurry.
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

1. **A web UI you can run**: render it in Playwright at `deviceScaleFactor: 2` with `shot`,
   cropped to the element that matters (`--selector`). When the full backend is heavy, run
   the frontend alone and answer its API calls with Playwright `page.route()` fixtures.
2. **A third-party app (a chat app, a terminal, a phone) whose conversation is real**:
   rebuild it in HTML from the verbatim text and render it at 2x. Start from
   `templates/chat.html`: put the real names, times and message text in `DATA`, use
   full-resolution avatars, then run `shot templates/chat.html out.png --selector .stage`.
   The result looks like the app, at any density.
3. **Only a person's own machine can capture it** (a native app you cannot rebuild): ask
   for a native screenshot (`Cmd+Shift+4` on a Retina Mac is 2x). Name exactly what to
   capture, because the person will skim the request.

Never generate a screenshot with an image model. It garbles text and invents UI, and the
result is a fake record of the product.

## Gotchas

- **Remote and computer-use captures are not 2x.** Screen-sharing and desktop-control
  tools cap out below the display's native density (about 1.7x on a Retina Mac in
  practice), and their zoom tools only crop: they do not add pixels. Use them to read
  text, not as the final image.
- **Never upscale.** Resizing a 600 px capture to 1200 px doubles the pixels and keeps the
  blur. Re-render at the target size instead.
- **No JPEG for UI.** Tool results and screen captures often arrive as JPEG. Text edges
  smear under lossy compression. Keep PNG, or convert to lossless WebP (`cwebp
  -lossless`). Lossy JPEG or WebP is for photographs.
- **Wait for fonts.** A capture taken before web fonts load uses fallback fonts and looks
  subtly wrong. The helper waits for `document.fonts.ready`. Lato has no Cyrillic, so the
  template falls back to Inter. Check any non-Latin text in the output.
- **Emoji differ by platform.** Linux renders Noto Color Emoji, macOS Apple Color Emoji.
  Say which in the PR when it matters.
- **Text size after scaling.** A composite wider than the column is scaled down on the
  page, and so is its text. Keep body text at 13 CSS px or more after scaling: a 1000 px
  wide composite in a 720 px column shrinks 15 px text to 11 px. Stack cards vertically
  before letting the canvas grow wide.
- **Layout can blur images too.** An `img` without `max-width: 100%` overflows on mobile,
  and a grid column of `1fr` grows to fit a wide child. Use `minmax(0, 1fr)`.
- **Crop to the change.** A full-window capture spends most of its pixels on chrome.
  Screenshot one element, not the page.
- **Real content only.** A rebuilt chat uses the exact text of a conversation that took
  place, with its real names and times. Do not edit what an agent or person said. Rerun
  the conversation instead.
- **Avatars and logos.** Take them from their source files at full size, not cropped from
  a low-density capture.
- **Look at it.** Open the final image at 100% and zoom into body text before publishing.
  A build that passes says nothing about blur.

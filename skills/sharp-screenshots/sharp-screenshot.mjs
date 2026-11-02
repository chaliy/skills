#!/usr/bin/env node
// Sharp screenshots: render a page, a local HTML file or one element of it at
// 2x device pixel ratio, and check that an existing image is dense enough for
// the width it is shown at. See SKILL.md next to this file for when and why.
//
//   node sharp-screenshot.mjs shot <url|file.html> <out.png> [--selector css]
//        [--scale 2] [--viewport 1280x800] [--display-width 720] [--wait-ms 0]
//   node sharp-screenshot.mjs check <image> --display-width <css px> [--scale 2]
//
// Playwright is imported lazily, so the script needs no install until `shot` runs.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

function parseArgs(argv) {
  const pos = [];
  const opt = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) opt[a.slice(2)] = argv[++i];
    else pos.push(a);
  }
  return { pos, opt };
}

// Width and height from the file header: PNG, JPEG and WebP, no image library.
export function imageSize(buf) {
  if (buf.readUInt32BE(0) === 0x89504e47)
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), type: 'png' };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let o = 2;
    while (o < buf.length) {
      if (buf[o] !== 0xff) {
        o++;
        continue;
      }
      const m = buf[o + 1];
      const len = buf.readUInt16BE(o + 2);
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m))
        return {
          w: buf.readUInt16BE(o + 7),
          h: buf.readUInt16BE(o + 5),
          type: 'jpeg',
        };
      o += 2 + len;
    }
  }
  if (
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP'
  ) {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8X')
      return {
        w: 1 + buf.readUIntLE(24, 3),
        h: 1 + buf.readUIntLE(27, 3),
        type: 'webp',
      };
    if (chunk === 'VP8L') {
      const b = buf.readUInt32LE(21);
      return {
        w: 1 + (b & 0x3fff),
        h: 1 + ((b >> 14) & 0x3fff),
        type: 'webp-lossless',
      };
    }
    if (chunk === 'VP8 ')
      return {
        w: buf.readUInt16LE(26) & 0x3fff,
        h: buf.readUInt16LE(28) & 0x3fff,
        type: 'webp-lossy',
      };
  }
  throw new Error('unsupported image format (PNG, JPEG or WebP)');
}

function check(file, displayWidth, scale) {
  const { w, h, type } = imageSize(readFileSync(file));
  const density = w / displayWidth;
  const ok = density >= scale;
  console.log(
    `${file}: ${w}x${h} ${type}, shown at ${displayWidth} CSS px = ${density.toFixed(2)}x (need ${scale}x)`
  );
  if (type === 'jpeg' || type === 'webp-lossy')
    console.log(
      '  warning: lossy format; UI text should be PNG or lossless WebP'
    );
  if (!ok)
    console.log(
      `  too soft: re-render at least ${Math.ceil(displayWidth * scale)} px wide; never upscale`
    );
  return ok;
}

async function shot(target, out, opt) {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    // ESM ignores NODE_PATH; a globally installed Playwright resolves through require.
    try {
      ({ chromium } = createRequire(import.meta.url)('playwright'));
    } catch {
      chromium = null;
    }
  }
  if (!chromium) {
    console.error(
      'playwright is not installed: npm i --no-save playwright && npx playwright install chromium'
    );
    process.exit(2);
  }
  const scale = Number(opt.scale ?? 2);
  const [vw, vh] = (opt.viewport ?? '1280x800').split('x').map(Number);
  const url = /^https?:|^file:/.test(target)
    ? target
    : pathToFileURL(resolve(target)).href;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: vw, height: vh },
      deviceScaleFactor: scale,
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    // Fallback fonts are the most common cause of a "wrong" looking capture.
    await page.evaluate(() => document.fonts.ready);
    if (opt['wait-ms']) await page.waitForTimeout(Number(opt['wait-ms']));
    const el = opt.selector ? page.locator(opt.selector).first() : null;
    if (el) await el.screenshot({ path: out, animations: 'disabled' });
    else
      await page.screenshot({
        path: out,
        fullPage: true,
        animations: 'disabled',
      });
  } finally {
    await browser.close();
  }
  const { w, h } = imageSize(readFileSync(out));
  console.log(`${out}: ${w}x${h} at ${scale}x`);
  if (opt['display-width'])
    return check(out, Number(opt['display-width']), scale);
  return true;
}

const isMain = import.meta.url === pathToFileURL(process.argv[1] ?? '').href;
if (isMain) {
  const [cmd, ...rest] = process.argv.slice(2);
  const { pos, opt } = parseArgs(rest);
  if (cmd === 'shot' && pos.length === 2) {
    process.exit((await shot(pos[0], pos[1], opt)) ? 0 : 1);
  } else if (cmd === 'check' && pos.length >= 1 && opt['display-width']) {
    const scale = Number(opt.scale ?? 2);
    const results = pos.map((f) =>
      check(f, Number(opt['display-width']), scale)
    );
    process.exit(results.every(Boolean) ? 0 : 1);
  } else {
    console.error(
      readFileSync(new URL(import.meta.url))
        .toString()
        .split('\n')
        .slice(1, 9)
        .join('\n')
    );
    process.exit(2);
  }
}

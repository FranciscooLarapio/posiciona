import { Jimp } from './node_modules/jimp/dist/commonjs/index.js';

const src = await Jimp.read('brand_assets/logo.png');
const w = src.width, h = src.height;
const img = src.clone();

// Magnifying glass circle center and outer ring radius (measured from pixel scans)
const CX = 404, CY = 414, OUTER_R = 78;
const OUTER_R2 = OUTER_R * OUTER_R;

// Fill every blue pixel inside the outer ring boundary with white.
// White ring pixels are not blue, so they won't be changed.
// Outer background pixels are outside OUTER_R, so they won't be changed.
img.scan(0, 0, w, h, function(x, y, idx) {
  const dx = x - CX, dy = y - CY;
  if (dx*dx + dy*dy > OUTER_R2) return; // outside outer ring

  const r = this.bitmap.data[idx];
  const g = this.bitmap.data[idx + 1];
  const b = this.bitmap.data[idx + 2];

  // Blue pixel (interior or antialiased edge)
  if (b > 140 && b > r * 1.4 && b > g * 1.4) {
    this.bitmap.data[idx]     = 255;
    this.bitmap.data[idx + 1] = 255;
    this.bitmap.data[idx + 2] = 255;
  }
});

// Crop whitespace (measured bounds: x=122-682, y=215-778)
const PAD = 10;
const cx1 = Math.max(0, 122 - PAD), cy1 = Math.max(0, 215 - PAD);
const cw = Math.min(w, 682 + PAD) - cx1;
const ch = Math.min(h, 778 + PAD) - cy1;

const out = new Jimp({ width: cw, height: ch });
for (let y2 = 0; y2 < ch; y2++)
  for (let x2 = 0; x2 < cw; x2++)
    out.setPixelColor(img.getPixelColor(cx1 + x2, cy1 + y2), x2, y2);

await out.write('brand_assets/favicon.png');
console.log(`Done: ${cw}x${ch}`);

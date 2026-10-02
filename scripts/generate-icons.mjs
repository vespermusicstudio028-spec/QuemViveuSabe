import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create high-quality SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
    <linearGradient id="tvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="40%" stop-color="#ec4899" />
      <stop offset="80%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="100" fill="url(#bgGrad)" />

  <!-- TV Antennas -->
  <path d="M 210 130 L 150 60" stroke="#f59e0b" stroke-width="12" stroke-linecap="round" />
  <circle cx="145" cy="55" r="10" fill="#f59e0b" />
  <path d="M 302 130 L 362 60" stroke="#f59e0b" stroke-width="12" stroke-linecap="round" />
  <circle cx="367" cy="55" r="10" fill="#f59e0b" />

  <!-- Vintage TV Body -->
  <rect x="76" y="115" width="360" height="295" rx="36" fill="url(#tvGrad)" stroke="#38bdf8" stroke-width="6" />

  <!-- TV Screen Outer -->
  <rect x="100" y="140" width="250" height="235" rx="28" fill="#030712" stroke="#60a5fa" stroke-width="4" />

  <!-- TV Screen Inner Retro Gradient -->
  <rect x="110" y="150" width="230" height="215" rx="20" fill="url(#screenGrad)" />

  <!-- Scanlines effect -->
  <line x1="110" y1="180" x2="340" y2="180" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
  <line x1="110" y1="210" x2="340" y2="210" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
  <line x1="110" y1="240" x2="340" y2="240" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
  <line x1="110" y1="270" x2="340" y2="270" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
  <line x1="110" y1="300" x2="340" y2="300" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
  <line x1="110" y1="330" x2="340" y2="330" stroke="rgba(255,255,255,0.2)" stroke-width="2" />

  <!-- VHS / CRT Icon & Text -->
  <text x="225" y="245" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" fill="#ffffff" text-anchor="middle" filter="url(#glow)">QUEM</text>
  <text x="225" y="295" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" fill="#fef08a" text-anchor="middle" filter="url(#glow)">VIVEU,</text>
  <text x="225" y="342" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="38" fill="#ffffff" text-anchor="middle" filter="url(#glow)">SABE!</text>

  <!-- TV Knobs Panel on right side -->
  <rect x="365" y="145" width="55" height="235" rx="14" fill="#1e293b" />
  <!-- Dials -->
  <circle cx="392" cy="180" r="16" fill="#475569" stroke="#94a3b8" stroke-width="3" />
  <line x1="392" y1="180" x2="400" y2="172" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" />
  
  <circle cx="392" cy="235" r="16" fill="#475569" stroke="#94a3b8" stroke-width="3" />
  <line x1="392" y1="235" x2="384" y2="242" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />

  <!-- Speaker Grilles -->
  <line x1="375" y1="290" x2="410" y2="290" stroke="#64748b" stroke-width="3" stroke-linecap="round" />
  <line x1="375" y1="310" x2="410" y2="310" stroke="#64748b" stroke-width="3" stroke-linecap="round" />
  <line x1="375" y1="330" x2="410" y2="330" stroke="#64748b" stroke-width="3" stroke-linecap="round" />
  <line x1="375" y1="350" x2="410" y2="350" stroke="#64748b" stroke-width="3" stroke-linecap="round" />

  <!-- TV Legs -->
  <path d="M 130 410 L 110 445" stroke="#f59e0b" stroke-width="12" stroke-linecap="round" />
  <path d="M 382 410 L 402 445" stroke="#f59e0b" stroke-width="12" stroke-linecap="round" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');

// Function to generate raw PNG buffer without any native dependencies
function createPng(width, height, isMaskable = false) {
  // Simple uncompressed/deflated RGBA PNG builder
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA (6)
  ihdr[10] = 0; // Compression: 0 (deflate)
  ihdr[11] = 0; // Filter: 0
  ihdr[12] = 0; // Interlace: 0

  function crc32(buf) {
    let table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    let c = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ (-1)) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(4 + 4 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Generate image raw scanlines
  // Filter byte 0 at start of each scanline
  const rowStride = 1 + width * 4;
  const rawData = Buffer.alloc(rowStride * height);

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = width * 0.45;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background color: Dark Blue / Retro Navy
      let r = 15, g = 23, b = 42, a = 255; // #0f172a

      if (isMaskable) {
        // full bleed for maskable
        r = 24; g = 119; b = 242; // Facebook brand blue base
      } else {
        // Rounded corner
        const cornerDist = Math.max(Math.abs(dx), Math.abs(dy));
        if (cornerDist > centerX) {
          a = 0;
        }
      }

      // TV Screen area inside
      const safeRadius = width * (isMaskable ? 0.30 : 0.38);
      if (Math.abs(dx) < safeRadius && Math.abs(dy) < safeRadius * 0.75) {
        // Retro Gold / Pink / Blue gradient
        const t = y / height;
        if (t < 0.4) {
          r = 245; g = 158; b = 11; // Amber #f59e0b
        } else if (t < 0.7) {
          r = 236; g = 72; b = 153; // Pink #ec4899
        } else {
          r = 37; g = 99; b = 235; // Blue #2563eb
        }
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(64, 64, false));

console.log('PWA icons successfully generated in /public!');

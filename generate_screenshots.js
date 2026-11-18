const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'D:\\New folder\\Projects\\danny\\tmp_chrome';
const outDir = 'D:\\New folder\\Projects\\danny\\screenshots';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// 1. Opening Animation Timeline Frame Sequence
const animFrames = [0.0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2, 3.6];

// 2. All 9 Sections in Final Order
const sections = [
  { id: '1_closed_envelope', state: '', name: 'Closed Envelope' },
  { id: '2_hero', state: 'hero', name: 'Hero Section' },
  { id: '3_countdown', state: 'countdown', name: 'Countdown Section' },
  { id: '4_story', state: 'story', name: 'Our Story Section' },
  { id: '5_reception', state: 'reception', name: 'Reception Section' },
  { id: '6_timeline', state: 'timeline', name: 'Evening Timeline' },
  { id: '7_families', state: 'families', name: 'Our Families Section' },
  { id: '8_venue', state: 'venue', name: 'Venue & Directions' },
  { id: '9_footer', state: 'footer', name: 'Footer Section' }
];

const viewports = [
  { label: '360x800', w: 360, h: 800, winW: 540, winH: 880 },
  { label: '390x844', w: 390, h: 844, winW: 570, winH: 930 }
];

console.log('=== STARTING SCREENSHOT GENERATION ===\n');

// Capture Animation Frame Sequence (360x800)
console.log('--- Capturing Opening Animation Frame Sequence (360x800) ---');
for (const time of animFrames) {
  const filename = `anim_frame_${time.toFixed(1)}s_360x800.png`;
  const outPath = path.join(outDir, filename);
  const targetUrl = `file:///D:/New%20folder/Projects/danny/mobile_test.html?w=360&h=800&time=${time}&guest=Srabon%20Friend`;

  const args = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`,
    '--window-size=540,880',
    '--virtual-time-budget=1000',
    `--screenshot=${outPath}`,
    targetUrl
  ];

  try {
    execFileSync(chromePath, args, { stdio: 'pipe' });
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
      console.log(`  [OK] ${filename} (${fs.statSync(outPath).size} bytes)`);
    } else {
      console.error(`  [FAIL] ${filename}`);
    }
  } catch (e) {
    console.error(`  [ERROR] ${filename}:`, e.message);
  }
}

// Capture All 9 Sections for Both Viewports
for (const vp of viewports) {
  console.log(`\n--- Capturing 9 Sections for Viewport ${vp.label} ---`);
  for (const sec of sections) {
    const filename = `screenshot_${sec.id}_${vp.label}.png`;
    const outPath = path.join(outDir, filename);
    const query = `w=${vp.w}&h=${vp.h}` + (sec.state ? `&state=${sec.state}` : '') + '&guest=Esteemed%20Guest';
    const targetUrl = `file:///D:/New%20folder/Projects/danny/mobile_test.html?${query}`;

    const args = [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      `--user-data-dir=${userDataDir}`,
      `--window-size=${vp.winW},${vp.winH}`,
      '--virtual-time-budget=1200',
      `--screenshot=${outPath}`,
      targetUrl
    ];

    try {
      execFileSync(chromePath, args, { stdio: 'pipe' });
      if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
        console.log(`  [OK] ${filename} (${fs.statSync(outPath).size} bytes)`);
      } else {
        console.error(`  [FAIL] ${filename}`);
      }
    } catch (e) {
      console.error(`  [ERROR] ${filename}:`, e.message);
    }
  }
}

console.log('\n=== FINISHED SCREENSHOT GENERATION ===');

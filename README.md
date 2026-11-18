# Romantic Mediterranean Wedding Reception Invitation

An enchanting, zero-dependency, pure static wedding reception invitation website crafted entirely in code (HTML5, CSS3, and Vanilla JavaScript) for **Srabon** and **Reyana** (**Taif Tanjil Srabon** & **Sabrina Akter Reyana**).

Everything visual is generated in code: inline SVGs, CSS 3D transforms, and algorithmic styling. **Zero external image files (no PNG/JPG/WebP)** and **zero libraries or build tools**.

---

## Key Features & Highlights

- **Luxury Painted Envelope with Continuous Buttery FLIP Opening**:
  - **Visuals**: Soft pastel backdrop with drifting petals, realistic multi-layered CSS drop shadows, rich coastal SVG scene (water wash, wave strokes, cliffs, cypress trees, paper-grain texture), lush painterly floral clusters spilling over envelope seams, wide silk sheen ribbon belly band with gold foil lettering (`SRABON & REYANA`), and a detailed 3D satin bow.
  - **One Continuous Sequence (No Pauses, No Jumps)**:
    - Tap $\rightarrow$ Bow twists and fades (0.4s) $\rightarrow$ Belly band drops away (0.5s) $\rightarrow$ Flap rotates open (`rotateX(-180deg)`) $\rightarrow$ Invitation card slides up out of the pocket $\rightarrow$ Card smoothly zooms and translates via the **Web Animations API** (FLIP technique) to fill the viewport and seamlessly become the hero section.
    - The card face features a miniature 1:1 replica of the hero card (same ivory paper, corner frames, typography, date, and venue) for a seamless cross-fade with zero visual jump.
    - Total sequence duration: ~3.2 seconds with smooth cubic-bezier easing. Envelope layers are automatically removed from the layout after opening for peak scrolling performance.
    - Full `prefers-reduced-motion` support (bypasses transforms directly to hero).

- **Rich Painterly Floral Design System**:
  - Reusable inline SVG `<symbol>` library featuring lush multi-ringed peony blossoms (blush and ivory), lavender garden roses, dusty blue anemones, olive branches with fine leaf veining, eucalyptus sprays, and delicate lavender sprigs.
  - Symmetrical corner arrangements, circular wreaths, and top/bottom garland dividers.

- **Romantic Mediterranean Design System**:
  - **Color Palette**: Ivory (`#FAF6EF`), Lavender Mist (`#E9E3F3`), Blush (`#F4C9D3`), Dusty Blue (`#A9C4DE`), Sea Teal (`#8DC1BE`), Forest (`#1F3A2E`), Deep Green (`#162B22`), Antique Gold (`#C9A96A`), and Ink (`#2B2A33`).
  - **Typography**: *Cormorant Garamond* for headings, *Jost* for body text (Google Fonts with Georgia/system-ui fallbacks and `font-display: swap`).
  - **Textures & Transitions**: Single-pass SVG `feTurbulence` data-URI paper grain texture (never animated to keep GPU load minimal) and undulating SVG wave section dividers.

- **9 Complete Sections in Exact Final Order**:
  1. **3D Envelope Intro**: Interactive opening experience with gentle floating idle state and "Tap to open" prompt.
  2. **Hero Section**: Staggered couple name reveal ("Srabon & Reyana"), date, venue, self-drawing floral corner frames (`stroke-dashoffset`), and 12 floating SVG petals (auto-paused when off-screen).
  3. **Countdown Timer**: Real-time days, hours, minutes, seconds countdown to the reception date in Dhaka timezone (`GMT+6`). Only changed digits animate.
  4. **Our Story**: Lavender twilight wash with hardware-accelerated parallax cloud layers (`translate3d`, rAF-throttled).
  5. **The Reception (Formal Dark Section)**: Deep-green section with a self-drawing gold line-art frame, event details, Google Maps shortcut, instant `.ics` calendar generator, and phone contact link.
  6. **Evening Timeline**: Interactive vertical golden spine that scales with scroll progress (`scaleY`) dynamically rendering events defined in `config.js` with gold line-art SVG icons.
  7. **Our Families**: Formal cards honoring groom's and bride's parents ("Son of Mr. [Father's Name] & Mrs. [Mother's Name]" and "Daughter of...").
  8. **Venue & Directions**: "Wari Party Center" details with direct navigation button to the exact Google Maps location.
  9. **Footer**: Warm gratitude note, monogram ("S & R"), and floral ornament.

- **Display Names vs. Full Names Rule**:
  - Display names everywhere are everyday names: **Srabon** & **Reyana** (belly band, monogram "S & R", hero, countdown, story, timeline, footer, page `<title>`, meta tags, and calendar event).
  - Full formal names (**Taif Tanjil Srabon** & **Sabrina Akter Reyana**) appear **only** in the formal opening line and the Our Families section.

- **Background Music Integration**:
  - Pre-configured audio controller (`music/music.mp3`).
  - Automatically begins smooth volume fade-in (to ~0.6) upon envelope tap.
  - Floating music toggle with subtle vinyl spinning animation.
  - Automatically pauses on `visibilitychange` (when tab is minimized or backgrounded) and smoothly resumes when the tab returns to focus.

- **Personalized Guest Greetings**:
  - Append `?guest=GuestName` to the URL (e.g. `index.html?guest=Eleanor%20Vance`) to display a personalized `"Dear Eleanor Vance,"` greeting badge in the hero section (safely inserted using `textContent` only).

- **Hard Reliability & Offline Compatibility**:
  - Runs directly by double-clicking `index.html` (`file://`) AND through any web server.
  - Classic `<script defer>` execution with zero ES module restrictions and zero local fetch requests.
  - Startup DOM-ID self-check validates all 52 required elements with zero console errors.
  - Accessible fallback: all invitation content remains fully readable if JavaScript is unavailable.

---

## Project Structure

```text
├── index.html        # Semantic markup, SVG sprite library, envelope & 9 sections
├── style.css         # Mediterranean CSS variables, 3D envelope, animations & responsive rules
├── config.js         # Single configuration file for all editable text, dates, venue, and timeline
├── app.js            # Core vanilla JS: self-check, FLIP animation, countdown, timeline renderer, audio
├── music/
│   └── music.mp3     # Ambient background music
├── screenshots/      # 28 verification screenshots (animation frames & 9 sections across viewports)
└── README.md         # Documentation, configuration reference, and deployment guide
```

---

## Configuration Reference (`config.js`)

All editable details are centralized in `config.js` under the `window.INVITE` object:

| Field | Type | Description | Current Value |
|---|---|---|---|
| `groomNick` | `string` | Groom's everyday name (used across hero, countdown, band, etc.) | `"Srabon"` |
| `groomFull` | `string` | Groom's full formal name (used in formal opening & families only) | `"Taif Tanjil Srabon"` |
| `groomParents` | `string` | Names of groom's parents | `"Mr. [Father's Name] & Mrs. [Mother's Name]"` |
| `groomRelationText` | `string` | Relation prefix | `"Son of"` |
| `brideNick` | `string` | Bride's everyday name (used across hero, countdown, band, etc.) | `"Reyana"` |
| `brideFull` | `string` | Bride's full formal name (used in formal opening & families only) | `"Sabrina Akter Reyana"` |
| `brideParents` | `string` | Names of bride's parents | `"Mr. [Father's Name] & Mrs. [Mother's Name]"` |
| `brideRelationText` | `string` | Relation prefix | `"Daughter of"` |
| `openingLine` | `string` | Informal opening line | `"Together with their families"` |
| `formalOpeningLine` | `string` | Formal opening invitation sentence | `"Together with their families, Taif Tanjil Srabon & Sabrina Akter Reyana cordially invite you..."` |
| `eventTitle` | `string` | Event title | `"Wedding Reception"` |
| `welcomeQuote` | `string` | Tagline quote | `"Two hearts united, an enduring journey begins..."` |
| `receptionDateIso` | `string` | ISO 8601 date string in Dhaka GMT+6 (`YYYY-MM-DDTHH:mm:ss+06:00`) | `"2027-01-02T19:00:00+06:00"` |
| `receptionDateDisplay`| `string` | Display date string (weekday is computed dynamically in JS) | `"2 January 2027"` |
| `receptionTimeDisplay`| `string` | Display start time | `"7:00 PM onwards"` |
| `receptionEndTimeDisplay`| `string` | Display end time | `"11:00 PM"` |
| `venue.name` | `string` | Venue name | `"Wari Party Center"` |
| `venue.address` | `string` | Venue address | `"Wari, Dhaka"` |
| `venue.mapUrl` | `string` | Exact Google Maps URL | `https://maps.google.com/maps?mstk=...` |
| `venue.phone` | `string` | Phone number for `tel:` link | `"+880 1700-000000"` |
| `venue.phoneDisplay` | `string` | Formatted phone number display | `"+880 1700 000000"` |
| `venue.parkingNote` | `string` | Parking and transport information | `"Dedicated parking and valet assistance available near the venue entrance."` |
| `story.title` | `string` | Heading for the story section | `"Our Story"` |
| `story.tagline` | `string` | Story tagline | `"From quiet conversations to a lifetime of love"` |
| `story.paragraphs` | `array` | Story paragraphs | `["What began as a quiet conversation...", "..."]` |
| `timeline` | `array` | Dynamic schedule items: `[{ time, title, desc, icon }]` | 6 items (Arrival, Welcome, Dinner, Cake, Photos, Farewell) |
| `musicFile` | `string` | Relative path to background audio file | `"music/music.mp3"` |

---

## How to Customize

### 1. Changing Date & Time
In `config.js`, update `receptionDateIso`:
```javascript
receptionDateIso: "2027-01-02T19:00:00+06:00",
```
The weekday (e.g. *Saturday*) is calculated dynamically by JavaScript based on this ISO string. Also update `receptionTimeDisplay` as needed:
```javascript
receptionTimeDisplay: "7:00 PM onwards",
```

### 2. Modifying the Evening Timeline
The timeline is rendered dynamically from the `timeline` array in `config.js`. You can add, remove, or reorder events freely:
```javascript
timeline: [
  {
    time: "07:00 PM",
    title: "Guest Arrival",
    desc: "Welcome refreshments and warm mingling.",
    icon: "icon-champagne" // Available: icon-champagne, icon-bouquet, icon-cutlery, icon-cake, icon-camera, icon-heart
  },
  // ... add or edit items here
]
```

### 3. Updating the Music Track
Place your MP3 file into the `music/` folder and update `musicFile` in `config.js`:
```javascript
musicFile: "music/your-song.mp3"
```
If set to `""` or if the audio file fails to load, the floating music button will automatically hide with zero console errors.

---

## How to Preview

### Option 1: Direct File Double-Click (Offline / No Server)
Simply double-click `index.html` or drag it into Chrome, Edge, Safari, or Firefox. The entire invitation functions seamlessly under `file:///`.

### Option 2: Local HTTP Server
Run any local static server from the project directory:

**Using Python**:
```bash
python -m http.server 8080
```
Open `http://localhost:8080` in your browser.

**Using Node.js**:
```bash
npx serve .
```

---

## How to Deploy

Because this project is a purely static site with no build process, it deploys instantly to any modern hosting platform in seconds.

### 1. Netlify
- **Drag & Drop**: Go to [Netlify Drop](https://app.netlify.com/drop) and drag the `danny` folder into the browser window.
- **Git Repository**: Connect your repository. Leave the Build Command **blank** and Publish directory as `.` (root). Click **Deploy**.

### 2. Vercel
- Run `npx vercel` in the project root, or import the GitHub repository into [Vercel](https://vercel.com/new). Framework Preset: **Other**. Build settings: default.

### 3. Cloudflare Pages
- Go to Cloudflare Dashboard $\rightarrow$ **Workers & Pages** $\rightarrow$ **Create application** $\rightarrow$ **Pages**. Connect repository or direct upload. Build command: *(empty)*, output directory: `.`.

### 4. GitHub Pages
- Push the repository to GitHub. Go to **Settings** $\rightarrow$ **Pages** $\rightarrow$ Select `main` branch $\rightarrow$ `/(root)` $\rightarrow$ Save.

---

## Verification & Screenshots Index

All 28 verification screenshots are stored in the `screenshots/` directory:

### Opening Animation Frame Sequence (360x800)
- [0.0s — Idle Closed Envelope](file:///D:/New%20folder/Projects/danny/screenshots/anim_frame_0.0s_360x800.png)
- [0.4s — Bow Twist & Fade](file:///D:/New%20folder/Projects/danny/screenshots/anim_frame_0.4s_360x800.png)
- [0.8s — Belly Band Sliding Down](file:///D:/New%20folder/Projects/danny/screenshots/anim_frame_0.8s_360x800.png)
- [1.2s — Flap Opening (3D Perspective)](file:///D:/New%20folder/Projects/danny/screenshots/anim_frame_1.2s_360x800.png)
- [1.6s — Flap Fully Open & Card Rising](file:///D:/New%20folder/Projects/danny/screenshots/anim_frame_1.6s_360x800.png)
- [2.0s — Card Slide-Up](file:///D:/New%20folder/Projects/danny/screenshots/anim_frame_2.0s_360x800.png)
- [2.4s — FLIP Zoom Midpoint](file:///D:/New%20folder/Projects/danny/screenshots/anim_frame_2.4s_360x800.png)
- [2.8s — FLIP Zoom Card Expanding](file:///D:/New%20folder/Projects/danny/screenshots/anim_frame_2.8s_360x800.png)
- [3.2s — Cross-Fade into Hero Section](file:///D:/New%20folder/Projects/danny/screenshots/anim_frame_3.2s_360x800.png)
- [3.6s — Hero Section Fully Active](file:///D:/New%20folder/Projects/danny/screenshots/anim_frame_3.6s_360x800.png)

### All 9 Sections (Mobile Standards: 360x800 & 390x844)
1. **Section 1: Closed Envelope**
   - [360x800 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_1_closed_envelope_360x800.png) | [390x844 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_1_closed_envelope_390x844.png)
2. **Section 2: Hero**
   - [360x800 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_2_hero_360x800.png) | [390x844 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_2_hero_390x844.png)
3. **Section 3: Countdown Timer**
   - [360x800 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_3_countdown_360x800.png) | [390x844 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_3_countdown_390x844.png)
4. **Section 4: Our Story**
   - [360x800 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_4_story_360x800.png) | [390x844 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_4_story_390x844.png)
5. **Section 5: The Reception (Formal Dark Section)**
   - [360x800 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_5_reception_360x800.png) | [390x844 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_5_reception_390x844.png)
6. **Section 6: Evening Timeline**
   - [360x800 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_6_timeline_360x800.png) | [390x844 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_6_timeline_390x844.png)
7. **Section 7: Our Families**
   - [360x800 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_7_families_360x800.png) | [390x844 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_7_families_390x844.png)
8. **Section 8: Venue & Directions**
   - [360x800 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_8_venue_360x800.png) | [390x844 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_8_venue_390x844.png)
9. **Section 9: Footer**
   - [360x800 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_9_footer_360x800.png) | [390x844 Viewport](file:///D:/New%20folder/Projects/danny/screenshots/screenshot_9_footer_390x844.png)

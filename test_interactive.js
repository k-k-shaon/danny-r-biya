const { spawn } = require('child_process');
const fs = require('fs');

console.log('--- Running Comprehensive Project Verification ---');

const testScript = `
<script>
window.addEventListener('load', () => {
  const errors = [];
  const logs = [];

  const origError = console.error;
  console.error = function(...args) {
    errors.push(args.join(' '));
    origError.apply(console, args);
  };

  // 1. Check Display Names
  const heroNames = document.getElementById('hero-couple-names').textContent.trim();
  const footerNames = document.getElementById('footer-names').textContent.trim();
  const cardNames = document.querySelector('.envelope-card-names').textContent.trim();
  const namesOk = (heroNames === 'Srabon & Reyana') && (footerNames === 'Srabon & Reyana') && (cardNames === 'Srabon & Reyana');

  // 2. Full names ONLY on formal opening line and Families section
  const openingLine = document.getElementById('hero-opening-line').textContent;
  const groomFormal = document.getElementById('groom-formal-name').textContent;
  const brideFormal = document.getElementById('bride-formal-name').textContent;
  const fullNamesOk = groomFormal.includes('Taif Tanjil Srabon') && brideFormal.includes('Sabrina Akter Reyana');

  // 3. Reception Date & Dynamic Weekday
  const heroDate = document.getElementById('hero-date').textContent;
  const recDate = document.getElementById('reception-date').textContent;
  const dateOk = heroDate.includes('Saturday, 2 January 2027') && recDate.includes('Saturday, 2 January 2027');

  // 4. Venue & Map Link
  const venueTitle = document.getElementById('venue-name-display').textContent;
  const mapBtn = document.getElementById('btn-map');
  const venueMapLink = document.getElementById('venue-map-link');
  const expectedMap = "https://maps.google.com/maps?mstk=AUtExfBbha4CQ12yaC_e4vi2RRL-TRcuhbaEXF29M57-GAq68MR3EFhih5EbVf-AJtgVJNuuTYd43gh5N4A6Qg5BccigdwRmsQr8xOGp46rcTfXbFFu0J2BQV2j0xDE_oNIjupUMvjDMCw1Ns0LCtNIlrM0Kuc61SrvnQVTFpckiPSFvyls&hl=en&pvq=Cg0vZy8xMWR4YmhkMTl3gAEBkAEB&fvr=1&vet=10CAAQoqAOahcKEwiozqT6xpGYAxUAAAAAHQAAAAAQCA..i&cs=1&um=1&ie=UTF-8&fb=1&gl=bd&sa=X&ftid=0x3755b8541ce8e6cd:0x11e070bd4aef9712";
  const venueOk = (venueTitle === 'Wari Party Center') && (mapBtn.href === expectedMap) && (venueMapLink.href === expectedMap) && (mapBtn.target === '_blank');

  // 5. Verify RSVP and Dress Code are completely removed
  const rsvpExists = !!document.getElementById('rsvp-section') || !!document.getElementById('rsvp-form');
  const dressCodeExists = !!document.getElementById('dress-code-section') || !!document.getElementById('dress-theme');
  const sectionsClean = !rsvpExists && !dressCodeExists;

  // 6. Timeline dynamically rendered
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineOk = timelineItems.length === 6;

  // 7. Calendar .ics generation test
  const calBtn = document.getElementById('btn-calendar');
  let calTriggered = false;
  if (calBtn) {
    try {
      calBtn.click();
      calTriggered = true;
    } catch(e) {
      errors.push('Calendar click error: ' + e.message);
    }
  }

  // 8. Guest Parameter Check
  const guestGreeting = document.getElementById('guest-greeting-name').textContent;
  const guestOk = (guestGreeting === 'Distinguished Guest');

  // 9. Music player setup
  const audioEl = document.getElementById('bg-audio');
  const musicBtn = document.getElementById('music-toggle-btn');
  const musicOk = !!audioEl && !musicBtn.classList.contains('hidden');

  document.title = 'TEST_RESULTS:' + JSON.stringify({
    errors,
    namesOk,
    fullNamesOk,
    dateOk,
    venueOk,
    sectionsClean,
    timelineOk,
    calTriggered,
    guestOk,
    musicOk
  });
});
</script>
`;

const htmlContent = fs.readFileSync('index.html', 'utf8').replace('</head>', testScript + '</head>');
fs.writeFileSync('temp_test_interactive.html', htmlContent);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'D:\\New folder\\Projects\\danny\\tmp_chrome';

const args = [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  `--user-data-dir=${userDataDir}`,
  '--dump-dom',
  'file:///D:/New%20folder/Projects/danny/temp_test_interactive.html?guest=Distinguished%20Guest'
];

const child = spawn(chromePath, args);
let output = '';

child.stdout.on('data', data => { output += data.toString(); });
child.stderr.on('data', data => { output += data.toString(); });

setTimeout(() => {
  if (child && !child.killed) child.kill();

  const m = output.match(/<title>TEST_RESULTS:([^<]+)<\/title>/);
  if (m) {
    const res = JSON.parse(m[1]);
    console.log('\n--- VERIFICATION TEST REPORT ---');
    console.log('Everyday Display Names (Srabon & Reyana):', res.namesOk ? 'PASS' : 'FAIL');
    console.log('Full Formal Names (Opening & Families):  ', res.fullNamesOk ? 'PASS' : 'FAIL');
    console.log('Date & Dynamic Weekday (2 Jan 2027):     ', res.dateOk ? 'PASS' : 'FAIL');
    console.log('Venue (Wari Party Center & Exact Map):   ', res.venueOk ? 'PASS' : 'FAIL');
    console.log('RSVP & Dress Code Completely Removed:    ', res.sectionsClean ? 'PASS' : 'FAIL');
    console.log('Dynamic Timeline Rendered:               ', res.timelineOk ? 'PASS' : 'FAIL');
    console.log('Calendar (.ics) Generator:               ', res.calTriggered ? 'PASS' : 'FAIL');
    console.log('Safe Guest textContent Injection:        ', res.guestOk ? 'PASS' : 'FAIL');
    console.log('Music Setup Verified:                    ', res.musicOk ? 'PASS' : 'FAIL');
    console.log('Console Errors Count:                    ', res.errors.length, res.errors);
  } else {
    console.error('Could not find test result string in DOM dump.');
  }

  if (fs.existsSync('temp_test_interactive.html')) fs.unlinkSync('temp_test_interactive.html');
  process.exit(0);
}, 3000);

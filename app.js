/**
 * Wedding Reception Invitation Application Logic
 * Srabon & Reyana
 * 
 * Works identically on file:// and http://
 * Plain vanilla JS, zero libraries, zero external dependencies.
 */

(function () {
  "use strict";

  // =========================================================================
  // 1. STARTUP SELF-CHECK (Guarantee all referenced DOM IDs exist)
  // =========================================================================
  const REQUIRED_ELEMENT_IDS = [
    "envelope-overlay",
    "envelope-container",
    "envelope-flap",
    "envelope-bow",
    "envelope-bellyband",
    "envelope-card",
    "envelope-hint",
    "skip-envelope-btn",
    "main-wrapper",
    "guest-greeting-container",
    "guest-greeting-name",
    "hero-opening-line",
    "hero-couple-names",
    "hero-event-title",
    "hero-date",
    "hero-venue",
    "hero-frame-svg",
    "petals-container",
    "countdown-days",
    "countdown-hours",
    "countdown-minutes",
    "countdown-seconds",
    "countdown-message",
    "story-title",
    "story-tagline",
    "story-text-container",
    "parallax-cloud-1",
    "parallax-cloud-2",
    "parallax-cloud-3",
    "reception-frame-svg",
    "reception-date",
    "reception-time",
    "reception-venue-name",
    "reception-venue-address",
    "btn-map",
    "btn-calendar",
    "btn-call",
    "timeline-progress-line",
    "timeline-items-container",
    "groom-formal-name",
    "groom-parents-relation",
    "groom-parents-names",
    "bride-formal-name",
    "bride-parents-relation",
    "bride-parents-names",
    "venue-name-display",
    "venue-address-display",
    "venue-map-link",
    "venue-parking-note",
    "footer-names",
    "music-toggle-btn",
    "bg-audio"
  ];

  function runStartupIdCheck() {
    let missingCount = 0;
    for (let i = 0; i < REQUIRED_ELEMENT_IDS.length; i++) {
      const id = REQUIRED_ELEMENT_IDS[i];
      if (!document.getElementById(id)) {
        console.error(`[Startup Error] Missing expected DOM element ID: "${id}"`);
        missingCount++;
      }
    }
    if (missingCount === 0) {
      console.log(`[Startup Check Passed] All ${REQUIRED_ELEMENT_IDS.length} required element IDs present.`);
    }
  }

  // =========================================================================
  // 2. CONFIGURATION LOADER & DOM POPULATOR
  // =========================================================================
  const config = window.INVITE || {};

  // Compute Weekday dynamically from ISO date in Asia/Dhaka timezone
  function getComputedDateDisplay() {
    try {
      const targetIso = config.receptionDateIso || "2027-01-02T19:00:00+06:00";
      const d = new Date(targetIso);
      const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "Asia/Dhaka" }).format(d);
      const baseDate = config.receptionDateDisplay || "2 January 2027";
      return `${weekday}, ${baseDate}`;
    } catch (e) {
      return `Saturday, ${config.receptionDateDisplay || "2 January 2027"}`;
    }
  }

  function populateContent() {
    const coupleDisplay = `${config.groomNick || "Srabon"} & ${config.brideNick || "Reyana"}`;
    const computedDate = getComputedDateDisplay();

    // Update document title and meta tags
    document.title = `${coupleDisplay} — Wedding Reception`;

    // Guest greeting from URL param (?guest=Name)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const guestName = urlParams.get("guest");
      if (guestName && guestName.trim() !== "") {
        const guestNameEl = document.getElementById("guest-greeting-name");
        const guestContainerEl = document.getElementById("guest-greeting-container");
        if (guestNameEl && guestContainerEl) {
          // Strict textContent only (XSS prevention)
          guestNameEl.textContent = guestName.trim();
          guestContainerEl.classList.remove("hidden");
        }
      }
    } catch (e) {}

    // Hero Section Details
    setText("hero-opening-line", config.formalOpeningLine || "Together with their families");
    setText("hero-couple-names", coupleDisplay);
    setText("hero-event-title", config.eventTitle || "Wedding Reception");
    setText("hero-date", computedDate);
    setText("hero-venue", config.venue ? config.venue.name : "Wari Party Center");

    // Envelope Card Miniature Replica
    const cardNames = document.querySelector(".envelope-card-names");
    if (cardNames) cardNames.textContent = coupleDisplay;
    const cardDate = document.querySelector(".envelope-card-date");
    if (cardDate) cardDate.textContent = computedDate;
    const cardVenue = document.querySelector(".envelope-card-venue");
    if (cardVenue) cardVenue.textContent = config.venue ? config.venue.name : "Wari Party Center";

    // Story Section
    if (config.story) {
      setText("story-title", config.story.title || "Our Story");
      setText("story-tagline", config.story.tagline || "");
      const storyContainer = document.getElementById("story-text-container");
      if (storyContainer && Array.isArray(config.story.paragraphs)) {
        storyContainer.innerHTML = "";
        config.story.paragraphs.forEach(function (pText) {
          const p = document.createElement("p");
          p.className = "story-p reveal-on-scroll";
          p.textContent = pText;
          storyContainer.appendChild(p);
        });
      }
    }

    // Reception Section
    setText("reception-date", computedDate);
    setText("reception-time", config.receptionTimeDisplay || "7:00 PM onwards");
    if (config.venue) {
      setText("reception-venue-name", config.venue.name);
      setText("reception-venue-address", config.venue.address);
      setText("venue-name-display", config.venue.name);
      setText("venue-address-display", config.venue.address);
      setText("venue-parking-note", config.venue.parkingNote || "");

      const mapBtn = document.getElementById("btn-map");
      if (mapBtn && config.venue.mapUrl) {
        mapBtn.href = config.venue.mapUrl;
        mapBtn.target = "_blank";
        mapBtn.rel = "noopener noreferrer";
      }

      const venueMapLink = document.getElementById("venue-map-link");
      if (venueMapLink && config.venue.mapUrl) {
        venueMapLink.href = config.venue.mapUrl;
        venueMapLink.target = "_blank";
        venueMapLink.rel = "noopener noreferrer";
      }

      const callBtn = document.getElementById("btn-call");
      if (callBtn && config.venue.phone) {
        callBtn.href = "tel:" + config.venue.phone;
        const callSpan = callBtn.querySelector("span");
        if (callSpan && config.venue.phoneDisplay) {
          callSpan.textContent = `Call (${config.venue.phoneDisplay})`;
        }
      }
    }

    // Timeline Section (Rendered dynamically from config.timeline array)
    const timelineContainer = document.getElementById("timeline-items-container");
    if (timelineContainer && Array.isArray(config.timeline)) {
      timelineContainer.innerHTML = "";
      config.timeline.forEach(function (item) {
        const itemEl = document.createElement("div");
        itemEl.className = "timeline-item reveal-on-scroll";
        itemEl.innerHTML = `
          <div class="timeline-node-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 48 48">
              <use href="#${item.icon || 'icon-champagne'}"></use>
            </svg>
          </div>
          <div class="timeline-content-card">
            <span class="timeline-time-badge">${item.time}</span>
            <h3 class="timeline-item-title">${item.title}</h3>
            <p class="timeline-item-desc">${item.desc}</p>
          </div>
        `;
        timelineContainer.appendChild(itemEl);
      });
    }

    // Our Families Section (Full formal names appear here)
    setText("groom-formal-name", config.groomFull || "Taif Tanjil Srabon");
    setText("groom-parents-relation", config.groomRelationText || "Son of");
    setText("groom-parents-names", config.groomParents || "Mr. [Father's Name] & Mrs. [Mother's Name]");

    setText("bride-formal-name", config.brideFull || "Sabrina Akter Reyana");
    setText("bride-parents-relation", config.brideRelationText || "Daughter of");
    setText("bride-parents-names", config.brideParents || "Mr. [Father's Name] & Mrs. [Mother's Name]");

    // Footer
    setText("footer-names", coupleDisplay);

    // Setup Audio Player
    setupMusicPlayer();
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text !== undefined) {
      el.textContent = text;
    }
  }

  // =========================================================================
  // 3. CONTINUOUS BUTTERY FLIP OPENING ANIMATION (No Jump, No Freeze)
  // =========================================================================
  let isOpening = false;

  function initEnvelope() {
    const overlay = document.getElementById("envelope-overlay");
    const container = document.getElementById("envelope-container");
    const hintBtn = document.getElementById("envelope-hint");
    const skipBtn = document.getElementById("skip-envelope-btn");
    const bowEl = document.getElementById("envelope-bow");
    const bandEl = document.getElementById("envelope-bellyband");
    const flapEl = document.getElementById("envelope-flap");
    const cardEl = document.getElementById("envelope-card");
    const heroEl = document.getElementById("hero");

    function triggerOpenEnvelope(e) {
      if (e) e.preventDefault();
      if (isOpening) return;
      isOpening = true;

      // Start background music with volume fade-in
      playMusicWithFadeIn();

      // Respect prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        overlay.style.transition = "opacity 0.4s ease";
        overlay.style.opacity = "0";
        setTimeout(() => {
          overlay.style.display = "none";
          heroEl.classList.add("is-visible");
          triggerFrameDraw();
        }, 400);
        return;
      }

      // ---------------------------------------------------------------------
      // Continuous Web Animations API Sequence (~3.2s total)
      // ---------------------------------------------------------------------
      // Phase 1 (0.0s): Bow twists and fades out (0.45s)
      if (bowEl) {
        bowEl.animate([
          { transform: "translate(-50%, -50%) scale(1) rotate(0deg)", opacity: 1 },
          { transform: "translate(-50%, -50%) scale(1.25) rotate(18deg)", opacity: 0 }
        ], { duration: 450, easing: "cubic-bezier(0.2, 0, 0.2, 1)", fill: "forwards" });
      }

      if (hintBtn) {
        hintBtn.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" });
      }

      // Phase 2 (0.2s): Belly band slides downward and fades (0.55s)
      if (bandEl) {
        bandEl.animate([
          { transform: "translateY(0)", opacity: 1 },
          { transform: "translateY(85px)", opacity: 0 }
        ], { duration: 550, delay: 200, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" });
      }

      // Phase 3 (0.35s): Flap rotates open (0.9s)
      if (flapEl) {
        flapEl.animate([
          { transform: "rotateX(0deg)" },
          { transform: "rotateX(-180deg)" }
        ], { duration: 900, delay: 350, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" });
      }

      // Phase 4 (0.8s): Card slides straight up out of the pocket (0.85s)
      if (cardEl) {
        cardEl.animate([
          { transform: "translateY(0)", zIndex: 2 },
          { transform: "translateY(-55%)", zIndex: 10 }
        ], { duration: 850, delay: 800, easing: "cubic-bezier(0.25, 1, 0.5, 1)", fill: "forwards" });
      }

      // Phase 5 (1.65s): FLIP Zoom from peak of rise to fill entire viewport
      setTimeout(function () {
        if (!cardEl) return;

        const cardRect = cardEl.getBoundingClientRect();
        const heroRect = heroEl ? heroEl.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight, left: 0, top: 0 };
        
        const targetW = heroRect.width || window.innerWidth;
        const targetH = Math.min(heroRect.height || window.innerHeight, window.innerHeight);

        const scaleX = targetW / Math.max(cardRect.width, 1);
        const scaleY = targetH / Math.max(cardRect.height, 1);
        const scale = Math.max(scaleX, scaleY);

        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const targetCenterX = (heroRect.left || 0) + targetW / 2;
        const targetCenterY = targetH / 2;

        const deltaX = targetCenterX - cardCenterX;
        const deltaY = targetCenterY - cardCenterY;

        cardEl.style.zIndex = "100";

        // Card Zoom Animation (FLIP)
        cardEl.animate([
          { transform: "translateY(-55%) scale(1)", opacity: 1 },
          { transform: `translate(${deltaX}px, ${deltaY - (cardRect.height * 0.55)}px) scale(${scale})`, opacity: 1, offset: 0.75 },
          { transform: `translate(${deltaX}px, ${deltaY - (cardRect.height * 0.55)}px) scale(${scale * 1.05})`, opacity: 0, offset: 1.0 }
        ], {
          duration: 1450,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "forwards"
        });

        // Envelope Body drifts down and fades away
        if (container) {
          container.animate([
            { transform: "translateY(0) scale(1)", opacity: 1 },
            { transform: "translateY(100px) scale(0.92)", opacity: 0 }
          ], {
            duration: 1100,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            fill: "forwards"
          });
        }

        // Overlay fades out seamlessly
        overlay.animate([
          { opacity: 1 },
          { opacity: 0 }
        ], {
          duration: 1000,
          delay: 450,
          easing: "ease-out",
          fill: "forwards"
        });
      }, 1650);

      // Phase 6 (3.1s): Hero is revealed, draw floral frames
      setTimeout(function () {
        if (heroEl) heroEl.classList.add("is-visible");
        triggerFrameDraw();
      }, 3050);

      // Phase 7 (3.3s): Remove envelope from interaction & render tree
      setTimeout(function () {
        overlay.classList.add("envelope-opened");
        overlay.setAttribute("aria-hidden", "true");
        overlay.style.display = "none";
      }, 3300);
    }

    if (container) {
      container.addEventListener("click", triggerOpenEnvelope);
      container.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          triggerOpenEnvelope(e);
        }
      });
    }

    if (hintBtn) {
      hintBtn.addEventListener("click", triggerOpenEnvelope);
    }

    if (skipBtn) {
      skipBtn.addEventListener("click", function (e) {
        e.preventDefault();
        overlay.style.display = "none";
        overlay.classList.add("envelope-opened");
        if (heroEl) heroEl.classList.add("is-visible");
        triggerFrameDraw();
        playMusicWithFadeIn();
      });
    }
  }

  // =========================================================================
  // 4. FLOATING PETALS GENERATOR
  // =========================================================================
  function initPetals() {
    const container = document.getElementById("petals-container");
    if (!container) return;

    const petalCount = 12;
    const colors = ["#peony-blush", "#rose-lavender", "#peony-white", "#anemone-blue"];

    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement("div");
      petal.className = "falling-petal";

      const leftPercent = Math.random() * 94 + 3;
      const duration = (Math.random() * 6 + 7).toFixed(1);
      const delay = (Math.random() * 7).toFixed(1);
      const size = Math.floor(Math.random() * 12 + 16);
      const symbolId = colors[i % colors.length];

      petal.style.left = leftPercent + "%";
      petal.style.width = size + "px";
      petal.style.height = size + "px";
      petal.style.animationDuration = duration + "s";
      petal.style.animationDelay = delay + "s";

      petal.innerHTML = `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <use href="${symbolId}"></use>
        </svg>
      `;

      container.appendChild(petal);
    }

    // Pause petals when Hero is scrolled out of view for 60fps performance
    if ("IntersectionObserver" in window) {
      const heroEl = document.getElementById("hero");
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            container.classList.remove("petals-paused");
          } else {
            container.classList.add("petals-paused");
          }
        });
      }, { threshold: 0.1 });

      if (heroEl) observer.observe(heroEl);
    }
  }

  // =========================================================================
  // 5. COUNTDOWN TIMER (Dhaka Timezone GMT+6 with Single-Digit Flip)
  // =========================================================================
  let prevDigits = { days: "", hours: "", minutes: "", seconds: "" };

  function initCountdown() {
    const targetIso = config.receptionDateIso || "2027-01-02T19:00:00+06:00";
    const targetDate = new Date(targetIso).getTime();

    const daysEl = document.getElementById("countdown-days");
    const hoursEl = document.getElementById("countdown-hours");
    const minsEl = document.getElementById("countdown-minutes");
    const secsEl = document.getElementById("countdown-seconds");
    const msgEl = document.getElementById("countdown-message");

    function updateTimer() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = "00";
        if (hoursEl) hoursEl.textContent = "00";
        if (minsEl) minsEl.textContent = "00";
        if (secsEl) secsEl.textContent = "00";
        if (msgEl) {
          msgEl.textContent = "The Celebrations Have Begun!";
          msgEl.style.display = "block";
        }
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      const dStr = d < 10 ? "0" + d : String(d);
      const hStr = h < 10 ? "0" + h : String(h);
      const mStr = m < 10 ? "0" + m : String(m);
      const sStr = s < 10 ? "0" + s : String(s);

      animateDigitIfChanged(daysEl, dStr, "days");
      animateDigitIfChanged(hoursEl, hStr, "hours");
      animateDigitIfChanged(minsEl, mStr, "minutes");
      animateDigitIfChanged(secsEl, sStr, "seconds");
    }

    function animateDigitIfChanged(el, newVal, key) {
      if (!el) return;
      if (prevDigits[key] === newVal) return;

      if (prevDigits[key] === "") {
        el.textContent = newVal;
        prevDigits[key] = newVal;
        return;
      }

      prevDigits[key] = newVal;
      el.classList.add("flipping");
      setTimeout(function () {
        el.textContent = newVal;
        el.classList.remove("flipping");
      }, 150);
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // =========================================================================
  // 6. OUR STORY PARALLAX CLOUDS (rAF Throttled, Passive Scroll Listener)
  // =========================================================================
  function initParallax() {
    const cloud1 = document.getElementById("parallax-cloud-1");
    const cloud2 = document.getElementById("parallax-cloud-2");
    const cloud3 = document.getElementById("parallax-cloud-3");
    const storySection = document.getElementById("story-section");

    if (!cloud1 || !storySection) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          const rect = storySection.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          if (rect.top < windowHeight && rect.bottom > 0) {
            const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
            const offset1 = (progress - 0.5) * 45;
            const offset2 = (progress - 0.5) * -60;
            const offset3 = (progress - 0.5) * 30;

            cloud1.style.transform = `translate3d(${offset1}px, 0, 0)`;
            if (cloud2) cloud2.style.transform = `translate3d(${offset2}px, 0, 0)`;
            if (cloud3) cloud3.style.transform = `translate3d(${offset3}px, 0, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // =========================================================================
  // 7. TIMELINE SCROLL PROGRESS & ACTIVE HIGHLIGHTS
  // =========================================================================
  function initTimelineScroll() {
    const section = document.getElementById("timeline-section");
    const line = document.getElementById("timeline-progress-line");
    const items = document.querySelectorAll(".timeline-item");

    if (!section || !line) return;

    let ticking = false;

    function updateTimelineProgress() {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDist = rect.height - 100;
      const currentScroll = windowHeight * 0.7 - rect.top;

      let progress = 0;
      if (currentScroll > 0) {
        progress = Math.min(Math.max(currentScroll / totalDist, 0), 1);
      }

      line.style.transform = `scaleY(${progress})`;

      items.forEach(function (item) {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < windowHeight * 0.7) {
          item.classList.add("is-passed");
        } else {
          item.classList.remove("is-passed");
        }
      });

      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(updateTimelineProgress);
        ticking = true;
      }
    }, { passive: true });
  }

  // =========================================================================
  // 8. INTERSECTION OBSERVER REVEALS
  // =========================================================================
  function initIntersections() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal-on-scroll, .story-p").forEach(function (el) {
        el.classList.add("is-revealed");
      });
      return;
    }

    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll(".reveal-on-scroll, .story-p").forEach(function (el) {
      revealObserver.observe(el);
    });

    const receptionEl = document.getElementById("reception-section");
    if (receptionEl) {
      const receptionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            receptionEl.classList.add("is-visible");
          }
        });
      }, { threshold: 0.2 });
      receptionObserver.observe(receptionEl);
    }
  }

  function triggerFrameDraw() {
    const heroFrame = document.getElementById("hero-frame-svg");
    if (heroFrame) {
      heroFrame.classList.add("drawn");
    }
  }

  // =========================================================================
  // 9. ADD TO CALENDAR (.ICS FILE GENERATION IN JS)
  // =========================================================================
  function initCalendarDownload() {
    const calBtn = document.getElementById("btn-calendar");
    if (!calBtn) return;

    calBtn.addEventListener("click", function () {
      const title = `Wedding Reception — ${config.groomNick || "Srabon"} & ${config.brideNick || "Reyana"}`;
      const description = `Wedding Reception of ${config.groomFull || "Taif Tanjil Srabon"} and ${config.brideFull || "Sabrina Akter Reyana"}.`;
      const location = config.venue ? `${config.venue.name}, ${config.venue.address}` : "Wari Party Center, Wari, Dhaka";
      
      // 2 Jan 2027 19:00 Dhaka (+06:00) is 13:00 UTC
      // Ends at 23:00 Dhaka = 17:00 UTC
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Srabon and Reyana Wedding Reception//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `SUMMARY:${title}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        "DTSTART:20270102T130000Z",
        "DTEND:20270102T170000Z",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      try {
        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "srabon-reyana-wedding-reception.ics";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () {
          window.URL.revokeObjectURL(url);
        }, 1000);
      } catch (err) {
        const dataUri = "data:text/calendar;charset=utf8," + encodeURIComponent(icsContent);
        window.open(dataUri, "_blank");
      }
    });
  }

  // =========================================================================
  // 10. BACKGROUND MUSIC PLAYER
  // =========================================================================
  let audioEl = null;
  let musicBtn = null;
  let isMusicPlaying = false;
  let wasPlayingBeforeHidden = false;

  function setupMusicPlayer() {
    musicBtn = document.getElementById("music-toggle-btn");
    audioEl = document.getElementById("bg-audio");

    const musicPath = config.musicFile || config.musicUrl;

    if (!musicPath || musicPath.trim() === "") {
      if (musicBtn) musicBtn.classList.add("hidden");
      return;
    }

    if (audioEl) {
      audioEl.src = musicPath;
      audioEl.volume = 0; // Starts silent for fade in
      
      // Hide silently on error (e.g. file missing / 404)
      audioEl.addEventListener("error", function () {
        if (musicBtn) musicBtn.classList.add("hidden");
      });
    }

    if (musicBtn) {
      musicBtn.classList.remove("hidden");
      musicBtn.addEventListener("click", toggleMusic);
    }

    // Pause on visibilitychange (tab switch), resume only if playing before
    document.addEventListener("visibilitychange", function () {
      if (!audioEl) return;
      if (document.hidden) {
        if (isMusicPlaying) {
          wasPlayingBeforeHidden = true;
          audioEl.pause();
          isMusicPlaying = false;
          if (musicBtn) musicBtn.classList.remove("is-playing");
        }
      } else {
        if (wasPlayingBeforeHidden) {
          wasPlayingBeforeHidden = false;
          audioEl.play().then(function () {
            isMusicPlaying = true;
            if (musicBtn) musicBtn.classList.add("is-playing");
          }).catch(function () {});
        }
      }
    });
  }

  function playMusicWithFadeIn() {
    const musicPath = config.musicFile || config.musicUrl;
    if (!musicPath || musicPath.trim() === "" || !audioEl) return;

    if (!isMusicPlaying) {
      audioEl.volume = 0;
      audioEl.play().then(function () {
        isMusicPlaying = true;
        if (musicBtn) musicBtn.classList.add("is-playing");

        // Smooth volume fade-in to ~0.6 over 2s
        const targetVol = 0.6;
        const step = 0.03;
        const interval = setInterval(function () {
          if (!audioEl || !isMusicPlaying) {
            clearInterval(interval);
            return;
          }
          if (audioEl.volume < targetVol - step) {
            audioEl.volume = Math.min(audioEl.volume + step, targetVol);
          } else {
            audioEl.volume = targetVol;
            clearInterval(interval);
          }
        }, 100);
      }).catch(function () {});
    }
  }

  function toggleMusic() {
    if (!audioEl) return;
    if (isMusicPlaying) {
      audioEl.pause();
      isMusicPlaying = false;
      if (musicBtn) musicBtn.classList.remove("is-playing");
    } else {
      audioEl.play().then(function () {
        isMusicPlaying = true;
        if (audioEl.volume < 0.1) audioEl.volume = 0.6;
        if (musicBtn) musicBtn.classList.add("is-playing");
      }).catch(function () {});
    }
  }

  // =========================================================================
  // 11. TESTING & TIMELINE STATE PREVIEW HELPER
  // =========================================================================
  function handleStateParam() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const state = urlParams.get("state");
      const timeVal = parseFloat(urlParams.get("time"));
      if (!state && isNaN(timeVal)) return;

      const overlay = document.getElementById("envelope-overlay");
      const bow = document.getElementById("envelope-bow");
      const band = document.getElementById("envelope-bellyband");
      const flap = document.getElementById("envelope-flap");
      const card = document.getElementById("envelope-card");
      const hero = document.getElementById("hero");
      const reception = document.getElementById("reception-section");

      // Handle precise animation timeline frames for verification:
      // (at 0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2, 3.6s)
      if (!isNaN(timeVal)) {
        overlay.style.transition = "none";
        if (timeVal === 0) {
          // Closed state
        } else if (timeVal <= 0.4) {
          // Bow twisting and fading
          const p = timeVal / 0.4;
          if (bow) {
            bow.style.transform = `translate(-50%, -50%) scale(${1 + 0.25 * p}) rotate(${18 * p}deg)`;
            bow.style.opacity = String(1 - p);
          }
        } else if (timeVal <= 0.8) {
          // Bow gone, band sliding down
          if (bow) bow.style.opacity = "0";
          const p = (timeVal - 0.4) / 0.4;
          if (band) {
            band.style.transform = `translateY(${85 * p}px)`;
            band.style.opacity = String(1 - p);
          }
          if (flap) {
            const flapP = (timeVal - 0.35) / 0.9;
            flap.style.transform = `rotateX(${-180 * Math.max(flapP, 0)}deg)`;
          }
        } else if (timeVal <= 1.2) {
          // Flap opening
          if (bow) bow.style.opacity = "0";
          if (band) band.style.opacity = "0";
          const flapP = Math.min((timeVal - 0.35) / 0.9, 1);
          if (flap) flap.style.transform = `rotateX(${-180 * flapP}deg)`;
          if (timeVal >= 0.8 && card) {
            const cardP = (timeVal - 0.8) / 0.85;
            card.style.transform = `translateY(${-55 * cardP}%)`;
            card.style.zIndex = "10";
          }
        } else if (timeVal <= 1.6) {
          // Card rising to peak
          if (bow) bow.style.opacity = "0";
          if (band) band.style.opacity = "0";
          if (flap) flap.style.transform = "rotateX(-180deg)";
          const cardP = Math.min((timeVal - 0.8) / 0.85, 1);
          if (card) {
            card.style.transform = `translateY(${-55 * cardP}%)`;
            card.style.zIndex = "10";
          }
        } else if (timeVal <= 2.4) {
          // FLIP Zoom in progress
          if (bow) bow.style.opacity = "0";
          if (band) band.style.opacity = "0";
          if (flap) flap.style.transform = "rotateX(-180deg)";
          const zoomP = (timeVal - 1.6) / 1.4;
          const scale = 1 + (2.4 - 1) * zoomP;
          if (card) {
            card.style.zIndex = "100";
            card.style.transform = `translateY(${-55 - 40 * zoomP}%) scale(${scale})`;
          }
          if (overlay) overlay.style.opacity = String(Math.max(1 - zoomP * 0.9, 0.2));
        } else if (timeVal <= 3.2) {
          // Cross-fading into hero
          if (card) {
            card.style.zIndex = "100";
            card.style.transform = `translateY(-95%) scale(2.8)`;
            card.style.opacity = String(Math.max(1 - (timeVal - 2.4) / 0.6, 0));
          }
          if (overlay) overlay.style.opacity = String(Math.max(1 - (timeVal - 2.4) / 0.7, 0));
          if (hero) hero.classList.add("is-visible");
        } else {
          // 3.6s+: fully on hero
          if (overlay) overlay.style.display = "none";
          if (hero) {
            hero.classList.add("is-visible");
            triggerFrameDraw();
          }
        }
        return;
      }

      // Named Section Previews
      if (state === "hero" || state === "opened") {
        overlay.style.display = "none";
        overlay.classList.add("envelope-opened");
        hero.classList.add("is-visible");
        triggerFrameDraw();
        window.scrollTo({ top: 0, behavior: "instant" });
      } else if (state === "countdown" || state === "story" || state === "reception" || state === "timeline" || state === "families" || state === "venue" || state === "footer") {
        overlay.style.display = "none";
        overlay.classList.add("envelope-opened");
        hero.classList.add("is-visible");
        triggerFrameDraw();

        document.querySelectorAll(".reveal-on-scroll, .story-p").forEach(function (el) {
          el.classList.add("is-revealed");
        });

        let targetId = "hero";
        if (state === "countdown") targetId = "countdown-section";
        else if (state === "story") targetId = "story-section";
        else if (state === "reception") {
          targetId = "reception-section";
          if (reception) reception.classList.add("is-visible");
        } else if (state === "timeline") {
          targetId = "timeline-section";
          const line = document.getElementById("timeline-progress-line");
          if (line) line.style.transform = "scaleY(0.7)";
          document.querySelectorAll(".timeline-item").forEach((it, i) => { if (i < 3) it.classList.add("is-passed"); });
        } else if (state === "families") targetId = "families-section";
        else if (state === "venue") targetId = "venue-section";
        else if (state === "footer") targetId = "footer";

        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const topPos = targetEl.offsetTop;
          window.scrollTo({ top: topPos, behavior: "instant" });
          document.documentElement.scrollTop = topPos;
          document.body.scrollTop = topPos;
        }
      }
    } catch (e) {
      console.warn("State param parsing error:", e);
    }
  }

  // =========================================================================
  // 12. BOOTSTRAP APPLICATION
  // =========================================================================
  function initApp() {
    runStartupIdCheck();
    populateContent();
    initEnvelope();
    initPetals();
    initCountdown();
    initParallax();
    initTimelineScroll();
    initIntersections();
    initCalendarDownload();
    handleStateParam();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }

})();

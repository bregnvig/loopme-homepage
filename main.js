(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── scroll progress + stuck header ── */
  const bar = document.querySelector(".progress");
  const topbar = document.querySelector(".topbar");

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${p})`;
    topbar.classList.toggle("is-stuck", window.scrollY > 8);
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  /* ── reveal sections + active nav link ── */
  document.documentElement.classList.add("anim");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  const links = [...document.querySelectorAll(".nav a[href^='#']")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === `#${e.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => navObserver.observe(s));

  /* ── pointer-tracked glow on the teaser cards ── */
  document.querySelectorAll(".teaser").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ── ambient loop: two strands tracing a lemniscate behind the logo ── */
  const canvas = document.getElementById("loop-canvas");
  if (!canvas || reduced) return;

  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let raf = 0;

  // canvas kan ikke læse CSS-variabler selv — hent dem, og igen når temaet skifter
  let strandRGB = "69, 227, 210";
  let glowRGB = "120, 245, 232";
  const readTheme = () => {
    const cs = getComputedStyle(document.documentElement);
    strandRGB = cs.getPropertyValue("--canvas-rgb").trim() || strandRGB;
    glowRGB = cs.getPropertyValue("--canvas-glow-rgb").trim() || glowRGB;
  };
  readTheme();
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", readTheme);

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener("resize", resize);

  // lemniscate of Gerono — a loop that closes on itself, like the mark
  const point = (t, scale) => {
    const a = Math.min(w, h * 1.6) * scale;
    return {
      x: w * 0.5 + a * Math.cos(t),
      y: h * 0.46 + a * 0.42 * Math.sin(2 * t),
    };
  };

  const strands = [
    { scale: 0.44, speed: 0.00022, tail: 2.6, width: 1.4, alpha: 0.42 },
    { scale: 0.33, speed: -0.00031, tail: 2.0, width: 1.0, alpha: 0.26 },
  ];

  const draw = (now) => {
    ctx.clearRect(0, 0, w, h);

    strands.forEach((s) => {
      const head = now * s.speed;
      const steps = 130;
      for (let i = 0; i < steps; i++) {
        const f = i / steps;
        const p0 = point(head - f * s.tail, s.scale);
        const p1 = point(head - ((i + 1) / steps) * s.tail, s.scale);
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = `rgba(${strandRGB}, ${s.alpha * (1 - f) ** 2})`;
        ctx.lineWidth = s.width * (1 - f * 0.6);
        ctx.lineCap = "round";
        ctx.stroke();
      }

      const head0 = point(head, s.scale);
      const glow = ctx.createRadialGradient(head0.x, head0.y, 0, head0.x, head0.y, 46);
      glow.addColorStop(0, `rgba(${glowRGB}, 0.5)`);
      glow.addColorStop(1, `rgba(${glowRGB}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(head0.x, head0.y, 46, 0, Math.PI * 2);
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);

  // stop burning frames when the hero is off screen
  new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !raf) raf = requestAnimationFrame(draw);
      if (!e.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
  }).observe(canvas);
})();

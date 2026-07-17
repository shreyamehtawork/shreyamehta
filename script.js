// ============================================================
// SHREYA MEHTA — PORTFOLIO v2 — interactions
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- theme toggle (dark / light) ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const rootEl = document.documentElement;

  function getStoredTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (e) {
      return null;
    }
  }
  function storeTheme(theme) {
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }
  function currentTheme() {
    return rootEl.getAttribute("data-theme") === "light" ? "light" : "dark";
  }
  function setTheme(theme) {
    rootEl.setAttribute("data-theme", theme);
    storeTheme(theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "light" ? "Switch to dark theme" : "Switch to light theme",
      );
    }
  }

  // Sync the toggle's aria-label with whatever the inline
  // pre-paint script in <head> already applied.
  setTheme(currentTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      setTheme(currentTheme() === "light" ? "dark" : "light");
    });
  }

  /* ---------- nav scroll state + active link ---------- */
  const nav = document.getElementById("nav");
  const sections = ["about", "stack", "log", "work", "certs", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll(".nav-pill a, .nav-drawer a");
  const toTop = document.getElementById("toTop");

  const dotSections = [
    "top",
    "about",
    "stack",
    "log",
    "work",
    "certs",
    "contact",
  ]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const dotLinks = document.querySelectorAll(".dot-nav-btn");

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
    toTop.classList.toggle("is-visible", window.scrollY > 600);

    let current = null;
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) current = sec.id;
    }
    navLinks.forEach((a) =>
      a.classList.toggle("is-active", a.dataset.idx === current),
    );

    let dotCurrent = null;
    for (const sec of dotSections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) dotCurrent = sec.id;
    }
    if (!dotCurrent) dotCurrent = window.scrollY < 80 ? "top" : current;
    dotLinks.forEach((a) =>
      a.classList.toggle("is-active", a.dataset.idx === dotCurrent),
    );
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  /* ---------- mobile drawer ---------- */
  const navToggle = document.getElementById("navToggle");
  const navDrawer = document.getElementById("navDrawer");
  navToggle.addEventListener("click", () => {
    const open = navDrawer.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navDrawer.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navDrawer.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }),
  );

  /* ---------- cursor spotlight ---------- */
  const spotlight = document.getElementById("spotlight");
  if (spotlight && window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("mousemove", (e) => {
      spotlight.style.setProperty("--mx", e.clientX + "px");
      spotlight.style.setProperty("--my", e.clientY + "px");
    });
  }

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  revealEls.forEach((el) => io.observe(el));

  /* ---------- stat counters ---------- */
  const stats = document.querySelectorAll(".stat-num");
  const statIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        const duration = 1100;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        statIO.unobserve(el);
      });
    },
    { threshold: 0.6 },
  );
  stats.forEach((el) => statIO.observe(el));

  /* ---------- hero role typewriter ---------- */
  const roleEl = document.getElementById("roleText");
  const roles = [
    "Software Developer",
    "Full Stack Developer",
    "MERN Stack Developer",
  ];
  if (roleEl) {
    let roleIdx = 0;
    let charIdx = roles[0].length;
    let deleting = false;

    function tickRole() {
      const current = roles[roleIdx];
      if (!deleting) {
        charIdx++;
        if (charIdx > current.length) {
          charIdx = current.length;
          deleting = false;
          setTimeout(() => {
            deleting = true;
            tickRole();
          }, 1500);
          return;
        }
      } else {
        charIdx--;
        if (charIdx < 0) {
          charIdx = 0;
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(tickRole, 250);
          return;
        }
      }
      roleEl.textContent = current.slice(0, charIdx);
      setTimeout(tickRole, deleting ? 35 : 65);
    }
    setTimeout(() => {
      deleting = true;
      tickRole();
    }, 1800);
  }

  /* ---------- signature: interactive company / role console ---------- */
  const providers = {
    nexora: {
      method: "ACTIVE",
      path: "/career/the-nexora-group",
      lines: [
        ["company", '"The Nexora Group"'],
        ["role", '"Software Developer"'],
        ["type", '"Software startup"'],
        ["dates", '"Jul 2026 — Present"'],
        ["focus", '"Web & mobile app engineering"'],
        ["status", '"employed"'],
      ],
    },
    tommyandfurry: {
      method: "INTERN",
      path: "/career/tommyandfurry",
      lines: [
        ["company", '"Novacred Insurance — TommyandFurry"'],
        ["role", '"Software Developer Intern"'],
        ["type", '"InsurTech startup"'],
        ["dates", '"Dec 2025 — Jul 2026"'],
        ["stack", '"Laravel PHP, underwriter APIs"'],
        ["status", '"completed"'],
      ],
    },
    rd: {
      method: "INTERN",
      path: "/career/the-rd-group",
      lines: [
        ["company", '"The R.D. Group of Industries"'],
        ["role", '"MERN Stack Developer Intern"'],
        ["type", '"Client services"'],
        ["dates", '"Jul 2025 — Oct 2025"'],
        ["projects", '"7+ client builds"'],
        ["status", '"completed"'],
      ],
    },
  };

  const consolePath = document.getElementById("consolePath");
  const consoleBody = document.getElementById("consoleBody");
  const consoleMethod = document.getElementById("consoleMethod");
  const consoleStatus = document.getElementById("consoleStatus");
  const tabs = document.querySelectorAll(".ctab");
  let typingToken = 0;

  function typeResponse(providerKey) {
    const data = providers[providerKey];
    if (!data || !consoleBody) return;
    typingToken += 1;
    const myToken = typingToken;

    if (consoleMethod) consoleMethod.textContent = data.method;
    consolePath.textContent = data.path;
    consoleStatus.textContent = "loading…";
    consoleBody.innerHTML = "";

    const full =
      "{\n" +
      data.lines
        .map(
          ([k, v]) =>
            `  <span class="k">"${k}"</span>: <span class="v">${v}</span>`,
        )
        .join(",\n") +
      "\n}";
    // build a plain-text version for the typewriter, then swap in HTML at the end
    const plain =
      "{\n" + data.lines.map(([k, v]) => `  "${k}": ${v}`).join(",\n") + "\n}";

    let i = 0;
    function step() {
      if (myToken !== typingToken) return;
      i += 3;
      consoleBody.textContent = plain.slice(0, i);
      if (i < plain.length) {
        requestAnimationFrame(step);
      } else {
        consoleBody.innerHTML = full;
        consoleStatus.textContent = "200 · record loaded";
      }
    }
    requestAnimationFrame(step);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      typeResponse(tab.dataset.provider);
    });
  });
  typeResponse("nexora");

  /* ---------- project card tilt ---------- */
  const tiltCards = document.querySelectorAll(".tilt");
  if (window.matchMedia("(hover: hover)").matches) {
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
      });
    });
  }

  /* ---------- project demo links (placeholder — no external repos wired yet) ---------- */
  document.querySelectorAll("[data-demo]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const name = el.dataset.demo === "papertrade" ? "PaperTrade" : "Cakeify";
      alert(
        `${name} demo link goes here — drop in your live URL or repo link.`,
      );
    });
  });

  /* ---------- resume button (placeholder) ---------- */
  const resumeBtn = document.getElementById("resumeBtn");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", (e) => {
      if (
        !resumeBtn.getAttribute("href") ||
        resumeBtn.getAttribute("href") === "#contact"
      ) {
        // no resume file wired yet — scroll to contact instead of a dead download
      }
    });
  }

  /* ---------- contact form — sends to /api/contact ---------- */
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formNote = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const payload = {
        name: String(fd.get("name") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        subject: String(fd.get("subject") || "").trim(),
        message: String(fd.get("message") || "").trim(),
      };

      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
      formNote.style.color = "";
      formNote.textContent = "Sending…";

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        let data = {};
        try {
          data = await res.json();
        } catch (parseErr) {
          // non-JSON response, fall through to generic error below
        }

        if (res.ok && data.ok) {
          formNote.style.color = "var(--lime)";
          formNote.textContent = "Message sent — I'll get back to you soon.";
          form.reset();
        } else {
          formNote.style.color = "var(--amber)";
          formNote.textContent =
            data.error || "Something went wrong. Please try again.";
        }
      } catch (err) {
        formNote.style.color = "var(--amber)";
        formNote.textContent =
          "Couldn't reach the server. Please try again or email directly.";
      } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
      }
    });
  }
});

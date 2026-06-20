"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Sends a conversion event to GA4 (gtag) and Meta Pixel (fbq) if present.
// No-ops safely until the tags load (NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_FB_PIXEL_ID).
function track(event, params) {
  try {
    if (typeof window.gtag === "function") window.gtag("event", event, params || {});
    if (typeof window.fbq === "function") {
      const map = {
        call_click: "Contact",
        whatsapp_click: "Contact",
        email_click: "Contact",
        generate_lead: "Lead",
        estimator_quote_click: "Lead",
      };
      if (map[event]) window.fbq("track", map[event], params || {});
    }
  } catch {}
}

// Indicative price ranges (USD + BDT). Source: cost page Quick Answer.
const PRICE = {
  charter: { usd: "28,000 - 35,000", bdt: "34,00,000 - 42,00,000", label: "ICU Air Ambulance (charter jet)" },
  escort: { usd: "6,000 - 14,000", bdt: "7,00,000 - 17,00,000", label: "Commercial Medical Escort" },
};

export default function ClientScripts() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups = [];

    // ---- FAQ accordion (+ faq_open event) ----
    document.querySelectorAll(".faq-item").forEach((item) => {
      const q = item.querySelector(".faq-q");
      const a = item.querySelector(".faq-a");
      if (!q || !a) return;
      const handler = () => {
        const isOpen = item.classList.contains("open");
        item.parentElement.querySelectorAll(".faq-item.open").forEach((other) => {
          if (other !== item) {
            other.classList.remove("open");
            other.querySelector(".faq-a").style.maxHeight = null;
            other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          }
        });
        if (isOpen) {
          item.classList.remove("open");
          a.style.maxHeight = null;
          q.setAttribute("aria-expanded", "false");
        } else {
          item.classList.add("open");
          a.style.maxHeight = a.scrollHeight + "px";
          q.setAttribute("aria-expanded", "true");
          track("faq_open", { question: (q.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100) });
        }
      };
      q.addEventListener("click", handler);
      cleanups.push(() => q.removeEventListener("click", handler));
    });

    // ---- Scroll reveal ----
    const revealEls = document.querySelectorAll(".reveal");
    let io;
    if ("IntersectionObserver" in window && revealEls.length) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealEls.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    } else {
      revealEls.forEach((el) => el.classList.add("in"));
    }

    // ---- Inquiry form: form_start + capture lead (backend) THEN open WhatsApp ----
    document.querySelectorAll("form[data-inquiry]").forEach((form) => {
      const formName = form.closest(".hero-card") ? "hero" : "contact";

      let started = false;
      const onStart = () => {
        if (started) return;
        started = true;
        track("form_start", { form: formName });
      };
      form.addEventListener("focusin", onStart);
      form.addEventListener("input", onStart);
      cleanups.push(() => {
        form.removeEventListener("focusin", onStart);
        form.removeEventListener("input", onStart);
      });

      const handler = (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = (data.get("name") || "").toString().trim();
        const phone = (data.get("phone") || "").toString().trim();
        const from = (data.get("from") || "Dhaka").toString().trim();
        const to = (data.get("to") || "Bangkok").toString().trim();
        const msg = (data.get("message") || "").toString().trim();

        // 1) Backend capture so the lead is never lost (fire-and-forget).
        try {
          fetch("/api/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            keepalive: true,
            body: JSON.stringify({ name, phone, condition: msg, from, to, page: location.pathname }),
          }).catch(() => {});
        } catch {}

        // 2) Conversion event.
        track("generate_lead", { method: "whatsapp_form", form: formName, page: location.pathname });

        // 3) Open prefilled WhatsApp (primary UX).
        const text =
          "EMERGENCY - Air Ambulance Inquiry%0A" +
          "Name: " + encodeURIComponent(name) + "%0A" +
          "Phone: " + encodeURIComponent(phone) + "%0A" +
          "From: " + encodeURIComponent(from) + "%0A" +
          "To: " + encodeURIComponent(to) + "%0A" +
          "Details: " + encodeURIComponent(msg);
        window.open("https://wa.me/8801716960770?text=" + text, "_blank");

        const ok = form.querySelector(".form-ok");
        if (ok) ok.style.display = "block";
        form.reset();
        started = false;
      };
      form.addEventListener("submit", handler);
      cleanups.push(() => form.removeEventListener("submit", handler));
    });

    // ---- Lightbox: click a gallery image to view it enlarged ----
    const galleryImgs = document.querySelectorAll(".gallery-item img");
    if (galleryImgs.length) {
      const lb = document.createElement("div");
      lb.className = "lightbox";
      lb.setAttribute("role", "dialog");
      lb.setAttribute("aria-modal", "true");
      lb.setAttribute("aria-label", "Enlarged image");
      lb.innerHTML =
        '<button class="lightbox-close" aria-label="Close">&times;</button>' +
        '<img alt="" /><p class="lightbox-cap"></p>';
      document.body.appendChild(lb);
      const lbImg = lb.querySelector("img");
      const lbCap = lb.querySelector(".lightbox-cap");
      let lastFocus = null;

      const open = (src, alt) => {
        lbImg.src = src;
        lbImg.alt = alt || "";
        lbCap.textContent = alt || "";
        lb.classList.add("open");
        document.body.style.overflow = "hidden";
        lb.querySelector(".lightbox-close").focus();
      };
      const close = () => {
        lb.classList.remove("open");
        document.body.style.overflow = "";
        lbImg.src = "";
        if (lastFocus) lastFocus.focus();
      };

      galleryImgs.forEach((img) => {
        img.setAttribute("tabindex", "0");
        img.setAttribute("role", "button");
        const trigger = () => {
          lastFocus = img;
          // Prefer the 1600w "full" variant (gallery-NN.webp -> gallery-NN-1600.webp)
          const full = img.getAttribute("src").replace(/\.webp$/, "-1600.webp");
          open(full, img.getAttribute("alt"));
        };
        const onKey = (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            trigger();
          }
        };
        img.addEventListener("click", trigger);
        img.addEventListener("keydown", onKey);
        cleanups.push(() => {
          img.removeEventListener("click", trigger);
          img.removeEventListener("keydown", onKey);
        });
      });

      const onLbClick = (e) => {
        if (e.target === lb || e.target.classList.contains("lightbox-close")) close();
      };
      const onEsc = (e) => {
        if (e.key === "Escape" && lb.classList.contains("open")) close();
      };
      // If the 1600w variant 404s, fall back to the thumbnail's own src.
      lbImg.addEventListener("error", () => {
        const t = lastFocus && lastFocus.getAttribute("src");
        if (t && lbImg.src.indexOf("-1600.webp") !== -1) lbImg.src = t;
      });
      lb.addEventListener("click", onLbClick);
      document.addEventListener("keydown", onEsc);
      cleanups.push(() => {
        lb.removeEventListener("click", onLbClick);
        document.removeEventListener("keydown", onEsc);
        lb.remove();
        document.body.style.overflow = "";
      });
    }

    // ---- Global click tracking: call / whatsapp / email / estimator / outbound ----
    const onDocClick = (e) => {
      const a = e.target.closest && e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const loc = a.dataset.loc || "link";

      if (href.startsWith("tel:")) {
        track("call_click", { loc });
        if (loc === "estimator") track("estimator_quote_click", { loc });
      } else if (href.includes("wa.me") || href.includes("api.whatsapp") || href.includes("web.whatsapp")) {
        track("whatsapp_click", { loc });
      } else if (href.startsWith("mailto:")) {
        track("email_click", { loc });
      } else if (/^https?:\/\//i.test(href) && !href.includes(location.hostname)) {
        track("outbound_click", { url: href.slice(0, 200) });
      }
    };
    document.addEventListener("click", onDocClick);
    cleanups.push(() => document.removeEventListener("click", onDocClick));

    // ---- Cost estimator (+ estimator_use event) ----
    document.querySelectorAll("[data-estimator]").forEach((est) => {
      const sel = est.querySelector("[data-est=type]");
      const out = est.querySelector("[data-est-result]");
      if (!sel || !out) return;
      const render = (fireEvent) => {
        const p = PRICE[sel.value] || PRICE.charter;
        out.innerHTML =
          '<div class="est-amount">USD ' + p.usd + "</div>" +
          '<div class="est-sub">approx. BDT ' + p.bdt + " &middot; " + p.label + "</div>" +
          '<div class="est-note">Indicative only - your exact, all-inclusive quote is free and depends on the patient’s condition. Call <a href="tel:+8801716960770" data-loc="estimator">01716-960770</a>.</div>';
        if (fireEvent) track("estimator_use", { transfer_type: sel.value });
      };
      const onChange = () => render(true);
      sel.addEventListener("change", onChange);
      cleanups.push(() => sel.removeEventListener("change", onChange));
      render(false);
    });

    // ---- Scroll depth (25/50/75/90%) ----
    const marks = [25, 50, 75, 90];
    const hit = new Set();
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (max <= 0) return;
      const pct = ((h.scrollTop || window.scrollY) / max) * 100;
      marks.forEach((m) => {
        if (pct >= m && !hit.has(m)) {
          hit.add(m);
          track("scroll_depth", { percent: m });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}

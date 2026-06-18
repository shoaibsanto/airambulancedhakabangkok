"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Fires a conversion event to GA4 (gtag) and Meta Pixel (fbq) if present.
function track(event, params) {
  try {
    if (typeof window.gtag === "function") window.gtag("event", event, params || {});
    if (typeof window.fbq === "function") {
      const map = { call_click: "Contact", whatsapp_click: "Contact", generate_lead: "Lead" };
      window.fbq("track", map[event] || "Lead", params || {});
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

    // ---- FAQ accordion ----
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

    // ---- Inquiry form -> capture lead (backend) THEN open WhatsApp ----
    document.querySelectorAll("form[data-inquiry]").forEach((form) => {
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
        track("generate_lead", { method: "whatsapp_form", page: location.pathname });

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
      };
      form.addEventListener("submit", handler);
      cleanups.push(() => form.removeEventListener("submit", handler));
    });

    // ---- Click tracking on call + WhatsApp links ----
    const onDocClick = (e) => {
      const a = e.target.closest && e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (href.startsWith("tel:")) track("call_click", { loc: a.dataset.loc || "link" });
      else if (href.includes("wa.me") || href.includes("api.whatsapp"))
        track("whatsapp_click", { loc: a.dataset.loc || "link" });
    };
    document.addEventListener("click", onDocClick);
    cleanups.push(() => document.removeEventListener("click", onDocClick));

    // ---- Cost estimator ----
    document.querySelectorAll("[data-estimator]").forEach((est) => {
      const sel = est.querySelector("[data-est=type]");
      const out = est.querySelector("[data-est-result]");
      if (!sel || !out) return;
      const render = () => {
        const p = PRICE[sel.value] || PRICE.charter;
        out.innerHTML =
          '<div class="est-amount">USD ' + p.usd + "</div>" +
          '<div class="est-sub">approx. BDT ' + p.bdt + " &middot; " + p.label + "</div>" +
          '<div class="est-note">Indicative only - your exact, all-inclusive quote is free and depends on the patient’s condition. Call <a href="tel:+8801716960770" data-loc="estimator">01716-960770</a>.</div>';
      };
      sel.addEventListener("change", render);
      cleanups.push(() => sel.removeEventListener("change", render));
      render();
    });

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}

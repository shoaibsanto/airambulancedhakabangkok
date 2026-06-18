"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Reproduces the original assets/js/main.js DOM behaviors for content that is
// server-rendered via dangerouslySetInnerHTML: FAQ accordion, scroll-reveal,
// and the inquiry form -> prefilled WhatsApp. Re-runs on every route change.
export default function ClientScripts() {
  const pathname = usePathname();

  useEffect(() => {
    // ---- FAQ accordion ----
    const faqHandlers = [];
    document.querySelectorAll(".faq-item").forEach((item) => {
      const q = item.querySelector(".faq-q");
      const a = item.querySelector(".faq-a");
      if (!q || !a) return;
      const handler = () => {
        const isOpen = item.classList.contains("open");
        const parent = item.parentElement;
        parent.querySelectorAll(".faq-item.open").forEach((other) => {
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
      faqHandlers.push([q, handler]);
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
    } else {
      revealEls.forEach((el) => el.classList.add("in"));
    }

    // ---- Inquiry form -> prefilled WhatsApp ----
    const formHandlers = [];
    document.querySelectorAll("form[data-inquiry]").forEach((form) => {
      const handler = (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = (data.get("name") || "").toString().trim();
        const phone = (data.get("phone") || "").toString().trim();
        const from = (data.get("from") || "Dhaka").toString().trim();
        const to = (data.get("to") || "Bangkok").toString().trim();
        const msg = (data.get("message") || "").toString().trim();
        const text =
          "Air Ambulance Inquiry%0A" +
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
      formHandlers.push([form, handler]);
    });

    return () => {
      faqHandlers.forEach(([el, h]) => el.removeEventListener("click", h));
      formHandlers.forEach(([el, h]) => el.removeEventListener("submit", h));
      if (io) io.disconnect();
    };
  }, [pathname]);

  return null;
}

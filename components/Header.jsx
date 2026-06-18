"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE, NAV } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="header" style={scrolled ? { boxShadow: "0 6px 20px rgba(10,61,98,.08)" } : undefined}>
      <div className="container">
        <nav className="nav" aria-label="Primary">
          <Link href="/" className="brand">
            <span className="logo" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M2 12h20" strokeWidth="2.5" />
              </svg>
            </span>
            <span>
              Air Ambulance Dhaka–Bangkok<small>ICU Medical Flights · 24/7</small>
            </span>
          </Link>

          <ul className={`nav-links${open ? " open" : ""}`} id="navLinks">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={isActive(item.href) ? "active" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="nav-mobile-cta">
              <a href={`tel:${SITE.phoneIntl}`} className="btn btn--ghost">
                Call Now
              </a>
              <Link href="/contact" className="btn btn--primary">
                Get Quote
              </Link>
            </li>
          </ul>

          <div className="nav-cta">
            <a href={`tel:${SITE.phoneIntl}`} className="btn btn--ghost">
              Call Now
            </a>
            <Link href="/contact" className="btn btn--primary">
              Get Quote
            </Link>
          </div>

          <button
            className="nav-toggle"
            id="navToggle"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="navLinks"
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </div>
    </header>
  );
}

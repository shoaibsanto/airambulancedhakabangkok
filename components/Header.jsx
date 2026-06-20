"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE, NAV } from "@/lib/site";

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu (and any open submenu) on navigation
  useEffect(() => {
    setOpen(false);
    setOpenSub(null);
  }, [pathname]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const isParentActive = (item) =>
    isActive(item.href) || (item.children || []).some((c) => isActive(c.href));

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
            {NAV.map((item) =>
              item.children ? (
                <li
                  key={item.label}
                  className={`has-dropdown${openSub === item.label ? " open" : ""}`}
                >
                  <div className="nav-parent">
                    <Link href={item.href} className={isParentActive(item) ? "active" : undefined}>
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      className="nav-caret"
                      aria-expanded={openSub === item.label}
                      aria-label={`Toggle ${item.label} menu`}
                      onClick={() => setOpenSub((s) => (s === item.label ? null : item.label))}
                    >
                      <Chevron />
                    </button>
                  </div>
                  <ul className="dropdown" aria-label={`${item.label} pages`}>
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className={isActive(c.href) ? "active" : undefined}>
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} className={isActive(item.href) ? "active" : undefined}>
                    {item.label}
                  </Link>
                </li>
              )
            )}
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

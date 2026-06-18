import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="brand">
              <span className="logo" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </span>
              <span>
                Air Ambulance Dhaka–Bangkok<small>ICU Medical Flights · 24/7</small>
              </span>
            </Link>
            <p style={{ marginTop: "1rem", maxWidth: "34ch" }}>
              Dedicated air ambulance and medical escort service for safe, monitored patient
              transfers from Dhaka, Bangladesh to Bangkok, Thailand and beyond.
            </p>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              <li><Link href="/services">ICU Air Ambulance</Link></li>
              <li><Link href="/air-ambulance-cost">Cost &amp; Pricing</Link></li>
              <li><Link href="/icu-vs-medical-escort">ICU vs Medical Escort</Link></li>
              <li><Link href="/bangkok-hospitals">Bangkok Hospitals</Link></li>
              <li><Link href="/services">Repatriation</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/process">Our Process</Link></li>
              <li><Link href="/routes">Routes &amp; Coverage</Link></li>
              <li><Link href="/blog">Guides &amp; Resources</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>24/7 Contact</h4>
            <ul className="foot-contact">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
                <a href={`tel:${SITE.phoneIntl}`}>{SITE.phoneDisplay}</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 6L2 7" />
                </svg>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{SITE.address}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} Air Ambulance Dhaka to Bangkok. All rights reserved.</span>
          <span>Emergency Medical Flight Coordination · Dhaka, Bangladesh</span>
          <span>
            SEO &amp; Designed by{" "}
            <a href="https://www.khanit.com.bd/" target="_blank" rel="noopener">
              Khan IT
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

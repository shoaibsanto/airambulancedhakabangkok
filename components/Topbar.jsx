import { SITE } from "@/lib/site";

export default function Topbar() {
  return (
    <div className="topbar" role="region" aria-label="Emergency contact bar">
      <div className="container">
        <div className="tb-left">
          <a href={`tel:${SITE.phoneIntl}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
            </svg>
            {SITE.phoneDisplay}
          </a>
          <a href={`mailto:${SITE.email}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 6L2 7" />
            </svg>
            {SITE.email}
          </a>
        </div>
        <div className="tb-right">
          <span>24/7 Emergency Medical Flight Desk</span>
        </div>
      </div>
    </div>
  );
}

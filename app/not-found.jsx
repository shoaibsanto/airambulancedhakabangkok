import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Page Not Found | Air Ambulance Dhaka to Bangkok",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section
      className="hero"
      style={{ minHeight: "100vh", display: "grid", placeItems: "center", textAlign: "center" }}
    >
      <div className="container" style={{ display: "block", maxWidth: "680px" }}>
        <span className="eyebrow" style={{ justifyContent: "center" }}>
          Error 404
        </span>
        <h1 style={{ color: "#fff" }}>This page could not be found</h1>
        <p className="lead" style={{ margin: "1.2rem auto 2rem", color: "#c8dbea" }}>
          The page you are looking for may have moved. For an urgent air ambulance transfer from
          Dhaka to Bangkok, call us any time — our desk is open 24/7.
        </p>
        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <Link href="/" className="btn btn--light btn--lg">
            Back to Home
          </Link>
          <a href={`tel:${SITE.phoneIntl}`} className="btn btn--primary btn--lg">
            Call {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}

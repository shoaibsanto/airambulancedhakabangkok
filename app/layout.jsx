import "./globals.css";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SITE } from "@/lib/site";
import Script from "next/script";
import Topbar from "@/components/Topbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Fab from "@/components/Fab";
import MobileCallBar from "@/components/MobileCallBar";
import Analytics from "@/components/Analytics";
import ClientScripts from "@/components/ClientScripts";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default: "Emergency Air Ambulance Bangladesh → Bangkok | 24/7 ICU Medical Flights",
    template: "%s | Air Ambulance Dhaka",
  },
  description:
    "24/7 emergency air ambulance from Dhaka to Bangkok. ICU-equipped medical flights with doctor escort & bed-to-bed transfer to Bumrungrad Hospital. Call 01716-960770 now.",
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  publisher: SITE.name,
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/assets/img/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  // Geo-targeting signals for local SEO (business located in Dhaka, Bangladesh).
  other: {
    "geo.region": "BD-C",
    "geo.placename": "Dhaka, Bangladesh",
    "geo.position": "23.7961;90.4125",
    ICBM: "23.7961, 90.4125",
  },
};

export const viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  // Minimal canonical Organization schema for site-wide identity.
  // Individual pages supply richer @graph blocks via parsePage().jsonLd.
  // @id values let Google's entity linker connect pages back to this org.
  const orgSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "MedicalOrganization"],
        "@id": "https://airambulancedhakabangkok.com/#organization",
        "name": SITE.name,
        "alternateName": "AirAmbulanceDhakaBangkok",
        "url": SITE.baseUrl + "/",
        "logo": SITE.baseUrl + "/assets/img/apple-touch-icon.png",
        "image": SITE.baseUrl + "/assets/img/og-image.jpg",
        "description": "24/7 air ambulance service providing ICU-equipped medical flights from Dhaka, Bangladesh to Bangkok, Thailand with doctor and paramedic escort and bed-to-bed patient transfer.",
        "telephone": SITE.phoneIntl,
        "email": SITE.email,
        "areaServed": [
          { "@type": "Country", "name": "Bangladesh" },
          { "@type": "Country", "name": "Thailand" }
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": SITE.phoneIntl,
          "contactType": "emergency",
          "availableLanguage": ["English", "Bengali"],
          "areaServed": ["BD", "TH"],
          "hoursAvailable": "Mo,Tu,We,Th,Fr,Sa,Su 00:00-23:59"
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Ground Floor, Surecell Medical BD Ltd, Plot 2 Rd 21",
          "addressLocality": "Dhaka",
          "addressRegion": "Dhaka Division",
          "postalCode": "1212",
          "addressCountry": "BD"
        },
        "sameAs": [
          "https://www.facebook.com/airambulancedhakabangkok",
          "https://www.linkedin.com/company/airambulancedhakabangkok",
          "https://www.youtube.com/@airambulancedhakabangkok",
          "https://maps.app.goo.gl/WnxW1HXMyFkzBGuA6"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "137",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": ["MedicalBusiness", "EmergencyService"],
        "@id": "https://airambulancedhakabangkok.com/#business",
        "name": SITE.name,
        "url": SITE.baseUrl + "/",
        "telephone": SITE.phoneIntl,
        "email": SITE.email,
        "priceRange": "$$$",
        "image": SITE.baseUrl + "/assets/img/og-image.jpg",
        "logo": SITE.baseUrl + "/assets/img/apple-touch-icon.png",
        "medicalSpecialty": ["Emergency", "CriticalCare", "AeromedicalTransport"],
        "parentOrganization": { "@id": "https://airambulancedhakabangkok.com/#organization" },
        "geo": { "@type": "GeoCoordinates", "latitude": 23.7815254, "longitude": 90.4160505 },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "00:00",
          "closes": "23:59"
        }
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body>
        <Script id="schema-org" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(orgSchema)}
        </Script>
        <Topbar />
        <Header />
        {children}
        <Footer />
        <Fab />
        <MobileCallBar />
        <Analytics />
        <ClientScripts />
      </body>
    </html>
  );
}

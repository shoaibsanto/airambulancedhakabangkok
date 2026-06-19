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
    default: "Air Ambulance Dhaka to Bangkok | 24/7 ICU Flights",
    template: "%s",
  },
  description:
    "24/7 ICU air ambulance Dhaka to Bangkok with doctor escort & bed-to-bed transfer. Fast evacuation — call 01716-960770 now.",
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
};

export const viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "EmergencyService"],
    "name": SITE.name,
    "url": SITE.baseUrl,
    "telephone": "+880****0770",
    "email": SITE.email,
    "description": "24/7 air ambulance service providing ICU-equipped medical flights from Dhaka, Bangladesh to Bangkok, Thailand with doctor and paramedic escort and bed-to-bed patient transfer.",
    "image": SITE.baseUrl + "/assets/img/og-image.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ground Floor, Surecell Medical BD Ltd, Plot 2 Rd 21",
      "addressLocality": "Dhaka",
      "postalCode": "1212",
      "addressCountry": "BD"
    },
    "areaServed": [
      { "@type": "City", "name": "Dhaka" },
      { "@type": "City", "name": "Bangkok" },
      { "@type": "Country", "name": "Bangladesh" },
      { "@type": "Country", "name": "Thailand" }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
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

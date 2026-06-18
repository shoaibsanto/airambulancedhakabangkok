import "./globals.css";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SITE } from "@/lib/site";
import Topbar from "@/components/Topbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Fab from "@/components/Fab";
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
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body>
        <Topbar />
        <Header />
        {children}
        <Footer />
        <Fab />
        <ClientScripts />
      </body>
    </html>
  );
}

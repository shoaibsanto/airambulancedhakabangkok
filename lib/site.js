// Central site constants — single source of truth for SEO/contact data.
export const SITE = {
  name: "Air Ambulance Dhaka to Bangkok",
  shortName: "Air Ambulance",
  baseUrl: "https://airambulancedhakabangkok.com",
  phoneDisplay: "01716-960770",
  phoneIntl: "+880-1716-960770",
  phoneTel: "+8801716960770",
  whatsapp: "https://wa.me/8801716960770",
  email: "info@airambulancedhakabangkok.com",
  address: "Ground Floor, Surecell Medical BD Ltd, Plot 2 Rd 21, Dhaka 1212",
  ogImage: "/assets/img/og-image.jpg",
  themeColor: "#0a3d62",
};

// Primary navigation. Grouped into dropdowns to keep the top bar uncluttered
// while still surfacing the cost, condition and hospital pages.
export const NAV = [
  { href: "/", label: "Home" },
  {
    href: "/services",
    label: "Services",
    children: [
      { href: "/services", label: "ICU Air Ambulance" },
      { href: "/air-ambulance-cost", label: "Cost & Pricing" },
      { href: "/icu-vs-medical-escort", label: "ICU vs Medical Escort" },
      { href: "/cardiac-emergency-transfer", label: "Cardiac Emergency Transfer" },
      { href: "/stroke-neurology-evacuation", label: "Stroke & Neurology Evacuation" },
      { href: "/trauma-accident-evacuation", label: "Trauma & Accident Evacuation" },
      { href: "/cancer-treatment-bangkok", label: "Cancer Treatment in Bangkok" },
    ],
  },
  {
    href: "/routes",
    label: "Coverage",
    children: [
      { href: "/routes", label: "Routes & Coverage" },
      { href: "/bangkok-hospitals", label: "Bangkok Hospitals" },
      { href: "/insurance-coverage", label: "Insurance Coverage" },
    ],
  },
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about", label: "About Us" },
      { href: "/process", label: "Our Process" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  { href: "/blog", label: "Guides" },
  { href: "/contact", label: "Contact" },
];

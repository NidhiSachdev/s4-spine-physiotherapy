import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.s4spine.com"),
  title: {
    default: "S4 Spine Physiotherapy Clinic | Ghatkopar East, Mumbai",
    template: "%s | S4 Spine Physiotherapy Clinic",
  },
  description:
    "Best physiotherapy clinic in Ghatkopar East, Mumbai. Expert treatment for back pain, spine problems, sports injuries & rehabilitation. 40+ treatments. Book today at S4 Spine.",
  keywords: [
    "physiotherapy clinic Ghatkopar",
    "physiotherapy clinic Mumbai",
    "physiotherapy near me",
    "spine clinic Ghatkopar East",
    "back pain treatment Mumbai",
    "physiotherapist near me",
    "sports injury physiotherapy",
    "pain relief clinic Mumbai",
    "rehabilitation center Ghatkopar",
    "best physiotherapy clinic Mumbai",
    "S4 Spine",
    "physiotherapy",
    "spine clinic",
    "pain relief",
    "rehabilitation",
    "sports rehab",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.s4spine.com",
    siteName: "S4 Spine Physiotherapy Clinic",
    title: "S4 Spine Physiotherapy Clinic | Ghatkopar East, Mumbai",
    description:
      "Best physiotherapy clinic in Ghatkopar East, Mumbai. Expert treatment for back pain, spine problems, sports injuries & rehabilitation. 40+ treatments.",
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: "S4 Spine Physiotherapy Clinic Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "S4 Spine Physiotherapy Clinic | Ghatkopar East, Mumbai",
    description:
      "Best physiotherapy clinic in Ghatkopar East, Mumbai. 40+ treatments for pain relief & rehabilitation.",
    images: ["/images/logo.png"],
  },
  alternates: {
    canonical: "https://www.s4spine.com",
  },
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Ghatkopar East, Mumbai",
    "geo.position": "19.0860;72.9080",
    ICBM: "19.0860, 72.9080",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "@id": "https://www.s4spine.com/#clinic",
              name: "S4 Spine Physiotherapy Clinic",
              alternateName: "S4 Spine",
              description:
                "Best physiotherapy clinic in Ghatkopar East, Mumbai. Expert treatment for back pain, spine problems, sports injuries, and rehabilitation with 40+ specialized treatments.",
              url: "https://www.s4spine.com",
              telephone: "+917900177857",
              email: "s4spineclinic@gmail.com",
              image: "https://www.s4spine.com/images/logo.png",
              logo: "https://www.s4spine.com/images/logo.png",
              priceRange: "$$",
              currenciesAccepted: "INR",
              paymentAccepted: "Cash, Credit Card, Debit Card, UPI",
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "Shop No 8, Vishwas CHS, Patel Chowk, RB Mehta Marg, Shival Nagar, Saibaba Nagar, Pant Nagar",
                addressLocality: "Ghatkopar East",
                addressRegion: "Maharashtra",
                postalCode: "400077",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 19.086,
                longitude: 72.908,
              },
              hasMap:
                "https://www.google.com/maps/place/S4+Spine+Physiotherapy+Clinic/@19.086,72.908,17z",
              areaServed: [
                {
                  "@type": "City",
                  name: "Mumbai",
                },
                {
                  "@type": "Place",
                  name: "Ghatkopar East",
                },
                {
                  "@type": "Place",
                  name: "Ghatkopar West",
                },
                {
                  "@type": "Place",
                  name: "Vikhroli",
                },
                {
                  "@type": "Place",
                  name: "Kanjurmarg",
                },
                {
                  "@type": "Place",
                  name: "Bhandup",
                },
              ],
              sameAs: [
                "https://www.instagram.com/s4.spine",
                "https://wa.me/917900177857",
              ],
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ],
                  opens: "08:00",
                  closes: "20:00",
                },
              ],
              medicalSpecialty: "Physiotherapy",
              availableService: [
                {
                  "@type": "MedicalTherapy",
                  name: "Spine Physiotherapy",
                },
                {
                  "@type": "MedicalTherapy",
                  name: "Sports Injury Rehabilitation",
                },
                {
                  "@type": "MedicalTherapy",
                  name: "Back Pain Treatment",
                },
                {
                  "@type": "MedicalTherapy",
                  name: "Manual Therapy",
                },
                {
                  "@type": "MedicalTherapy",
                  name: "Electrotherapy",
                },
                {
                  "@type": "MedicalTherapy",
                  name: "Post-Surgical Rehabilitation",
                },
              ],
            }),
          }}
        />
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}

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
  title: {
    default: "S4 Spine Physiotherapy Clinic",
    template: "%s | S4 Spine Physiotherapy Clinic",
  },
  description:
    "Expert physiotherapy treatments for pain relief, rehabilitation, and recovery. Explore 40+ treatments across 8 specialties. Book your appointment today.",
  keywords: [
    "physiotherapy",
    "spine clinic",
    "pain relief",
    "rehabilitation",
    "sports rehab",
    "physiotherapy near me",
  ],
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
              name: "S4 Spine Physiotherapy Clinic",
              description:
                "Expert physiotherapy treatments for pain relief, rehabilitation, and recovery.",
              url: "https://s4spine.com",
              telephone: "+917900177857",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Shop No 8, Vishwas CHS, Patel Chowk, RB Mehta Marg, Shival Nagar, Saibaba Nagar, Pant Nagar",
                addressLocality: "Ghatkopar East, Mumbai",
                addressRegion: "Maharashtra",
                postalCode: "400077",
                addressCountry: "IN",
              },
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

import { Metadata } from "next";
import { breadcrumbSchema } from "@/lib/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Treatment Library",
  description:
    "Explore 40+ physiotherapy treatments across 5 specialties at S4 Spine Clinic, Ghatkopar East, Mumbai. Back pain, sports rehab, spine care & more.",
  openGraph: {
    title: "Treatment Library | S4 Spine Physiotherapy Clinic",
    description:
      "Explore 40+ physiotherapy treatments across 5 specialties.",
  },
  alternates: {
    canonical: "/treatments",
  },
};

const schema = breadcrumbSchema([{ name: "Treatments", path: "/treatments" }]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}

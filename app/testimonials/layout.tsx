import { Metadata } from "next";
import { breadcrumbSchema } from "@/lib/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Patient Testimonials",
  description:
    "Read real patient stories and success experiences from S4 Spine Physiotherapy Clinic, Ghatkopar East, Mumbai. See how our treatments have helped others recover.",
  openGraph: {
    title: "Patient Testimonials | S4 Spine Physiotherapy Clinic",
    description:
      "Real patient stories and success experiences from S4 Spine Physiotherapy Clinic.",
  },
  alternates: {
    canonical: "/testimonials",
  },
};

const schema = breadcrumbSchema([{ name: "Testimonials", path: "/testimonials" }]);

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

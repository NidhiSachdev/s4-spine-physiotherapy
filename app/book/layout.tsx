import { Metadata } from "next";
import { breadcrumbSchema } from "@/lib/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Book a physiotherapy appointment at S4 Spine Clinic, Ghatkopar East, Mumbai. Choose your treatment and preferred time slot. Online booking available.",
  openGraph: {
    title: "Book Appointment | S4 Spine Physiotherapy Clinic",
    description:
      "Schedule your physiotherapy appointment at S4 Spine. Book online today.",
  },
  alternates: {
    canonical: "/book",
  },
};

const schema = breadcrumbSchema([{ name: "Book Appointment", path: "/book" }]);

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

import { Metadata } from "next";
import { breadcrumbSchema } from "@/lib/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact S4 Spine Physiotherapy Clinic in Ghatkopar East, Mumbai. Visit us at Shop No 8, Vishwas CHS, Pant Nagar. Call +91 79001 77857. Mon-Sat 8AM-8PM.",
  openGraph: {
    title: "Contact S4 Spine Physiotherapy Clinic | Ghatkopar East, Mumbai",
    description:
      "Visit S4 Spine Physiotherapy Clinic in Ghatkopar East, Mumbai. Get directions, call us, or send a message.",
  },
  alternates: {
    canonical: "/contact",
  },
};

const schema = breadcrumbSchema([{ name: "Contact Us", path: "/contact" }]);

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

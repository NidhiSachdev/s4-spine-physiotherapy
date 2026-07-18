import { Metadata } from "next";
import { breadcrumbSchema } from "@/lib/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Exercise Video Library",
  description:
    "Watch guided exercise demonstrations from S4 Spine Physiotherapy Clinic. Follow along at home to support your recovery and rehabilitation.",
  openGraph: {
    title: "Exercise Video Library | S4 Spine Physiotherapy Clinic",
    description:
      "Watch guided exercise demonstrations from our physiotherapy experts.",
  },
  alternates: {
    canonical: "/videos",
  },
};

const schema = breadcrumbSchema([{ name: "Exercise Videos", path: "/videos" }]);

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

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with S4 Spine Physiotherapy Clinic. Find our location, phone number, and contact form. We're here to help with your recovery.",
  openGraph: {
    title: "Contact Us | S4 Spine",
    description:
      "Contact S4 Spine Physiotherapy Clinic. Location, phone, and contact form.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

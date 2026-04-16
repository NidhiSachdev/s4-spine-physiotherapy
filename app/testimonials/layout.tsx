import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patient Testimonials",
  description:
    "Read real patient stories and success experiences from S4 Spine Physiotherapy Clinic. Discover how our treatments have helped others recover.",
  openGraph: {
    title: "Patient Testimonials | S4 Spine",
    description:
      "Real patient stories and success experiences from S4 Spine Physiotherapy Clinic.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

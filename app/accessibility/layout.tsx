import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "S4 Spine Physiotherapy Clinic's commitment to accessibility. We strive to make our services and website accessible to everyone.",
  openGraph: {
    title: "Accessibility | S4 Spine",
    description:
      "S4 Spine's commitment to accessibility for all patients and visitors.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Diagnostic Test",
  description:
    "Schedule your blood test or health screening appointment at S4 Spine. Choose your test type and preferred time slot. Book online today.",
  openGraph: {
    title: "Book Diagnostic Test | S4 Spine",
    description:
      "Schedule your blood test or health screening at S4 Spine. Book online today.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

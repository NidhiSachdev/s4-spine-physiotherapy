import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs & Myth Busters",
  description:
    "Get answers to common physiotherapy questions and discover the truth behind popular myths. Expert insights from S4 Spine.",
  openGraph: {
    title: "FAQs & Myth Busters | S4 Spine",
    description:
      "Common physiotherapy questions answered and myths busted by S4 Spine experts.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Treatment Library",
  description:
    "Explore 40+ physiotherapy treatments across 5 specialties. Find the right treatment for your condition at S4 Spine.",
  openGraph: {
    title: "Treatment Library | S4 Spine",
    description:
      "Explore 40+ physiotherapy treatments across 5 specialties.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

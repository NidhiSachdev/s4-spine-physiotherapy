import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exercise Video Library",
  description: "Watch guided exercise demonstrations from our physiotherapy experts. Follow along at home to support your recovery.",
  openGraph: {
    title: "Exercise Video Library | S4 Spine",
    description: "Watch guided exercise demonstrations from our physiotherapy experts.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

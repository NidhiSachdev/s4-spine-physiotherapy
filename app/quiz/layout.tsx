import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Self-Assessment Quiz",
  description:
    "Take our self-assessment quiz to find the right physiotherapy treatment for your condition. Get personalized recommendations from S4 Spine.",
  openGraph: {
    title: "Self-Assessment Quiz | S4 Spine",
    description:
      "Find the right physiotherapy treatment with our self-assessment quiz.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

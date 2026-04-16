import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Schedule your physiotherapy appointment at S4 Spine. Choose your treatment and preferred time slot. Book online today.",
  openGraph: {
    title: "Book Appointment | S4 Spine",
    description:
      "Schedule your physiotherapy appointment at S4 Spine. Book online today.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import { Metadata } from "next";
import faqsData from "@/data/faqs.json";
import { breadcrumbSchema } from "@/lib/breadcrumb-schema";

export const metadata: Metadata = {
  title: "FAQs & Myth Busters",
  description:
    "Get answers to common physiotherapy questions and discover the truth behind popular myths. Expert insights from S4 Spine Clinic, Ghatkopar East.",
  openGraph: {
    title: "FAQs & Myth Busters | S4 Spine Physiotherapy Clinic",
    description:
      "Common physiotherapy questions answered and myths busted by S4 Spine experts.",
  },
  alternates: {
    canonical: "/faq",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: (faqsData as { topic: string; questions: { question: string; answer: string }[] }[])
    .flatMap((topic) => topic.questions)
    .map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
};

const bcSchema = breadcrumbSchema([{ name: "FAQs", path: "/faq" }]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bcSchema) }}
      />
      {children}
    </>
  );
}

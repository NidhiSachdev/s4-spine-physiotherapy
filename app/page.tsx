import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import AnimatedCounters from "@/components/home/AnimatedCounters";
import CategoryCards from "@/components/home/CategoryCards";
import DiagnosticTests from "@/components/home/DiagnosticTests";
import HowItWorks from "@/components/home/HowItWorks";
import QuizCTA from "@/components/home/QuizCTA";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import HomeFAQ from "@/components/home/HomeFAQ";
import ContactCTA from "@/components/home/ContactCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <WhyChooseUs />
      <AnimatedCounters />
      <CategoryCards />
      <DiagnosticTests />
      <HowItWorks />
      <QuizCTA />
      <TestimonialsCarousel />
      <HomeFAQ />
      <ContactCTA />
    </>
  );
}

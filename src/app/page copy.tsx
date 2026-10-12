import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import QuestionSection from "@/components/QuestionSection";
import JourneySection from "@/components/JourneySection";
import TransformationSection from "@/components/TransformationSection";
import NeedsSection from "@/components/NeedsSection";
import HowSection from "@/components/HowSection";
import ModelSection from "@/components/ModelSection";
import CaseSection from "@/components/CaseSection";
import WhySection from "@/components/WhySection";
import FinalCtaSection from "@/components/FinalCtaSection";
import SiteFooter from "@/components/SiteFooter";
import PackagesSection from "@/components/PackagesSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ProblemSection />
      <QuestionSection />
      <JourneySection />
      <TransformationSection />
      <NeedsSection />
      <HowSection />
      <ModelSection />
      <CaseSection />
      <WhySection />
      <PackagesSection />
      <FinalCtaSection />
      <SiteFooter />
    </main>
  );
}
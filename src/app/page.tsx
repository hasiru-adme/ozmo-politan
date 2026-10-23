import SmoothScroll from "@/components/SmoothScroll";
import SiteLoader from "@/components/SiteLoader";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import QuestionSection from "@/components/QuestionSection";
import JourneySection from "@/components/JourneySection";
import NeedsSection from "@/components/NeedsSection";
import CaseSection from "@/components/CaseSection";
import HowSection from "@/components/HowSection";
// import WhoWeHelpSection from "@/components/WhoWeHelpSection";
import WhySection from "@/components/WhySection";
import FaqSection from "@/components/FaqSection";
import PackagesWithModal from "@/components/PackagesSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import SiteFooter from "@/components/SiteFooter";
import ScrollVideoBackground from "@/components/ScrollVideoBackground";
import WhoWeHelpSection from "@/components/WhoWeHelpSection";

export default function Home() {
  return (
    <>
       <ScrollVideoBackground />
      <main className="relative z-10">
      <SmoothScroll />
      <SiteLoader />

      {/* 1 */}
      <HeroSection />

      {/* 2 */}
      <div id="problems">
        <ProblemSection />
        <QuestionSection />
      </div>

      {/* 3 */}
      <div id="solutions">
        <JourneySection />
        <NeedsSection />
      </div>

      {/* 4 */}
      <div id="action">
        <CaseSection />
      </div>

      {/* 5 */}
      <HowSection />

      {/* 6 */}
      <WhoWeHelpSection /> 

      {/* 7 */}
      <WhySection />

      {/* 8 */}
      <FaqSection />

      {/* 9 */}
      <div id="start">
        <PackagesWithModal />
        <FinalCtaSection />
      </div>

      <SiteFooter />
      </main>
    </>
  );
}
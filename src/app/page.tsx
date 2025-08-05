import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { LearningOutcomes } from "@/components/learning-outcomes"
import { CourseStats } from "@/components/course-stats"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <LearningOutcomes />
      <CourseStats />
    </div>
  );
}

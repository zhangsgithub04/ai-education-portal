import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Artificial Intelligence
          <span className="text-blue-600 block">in Education</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Explore how AI is transforming learning, teaching methodologies, and 
          educational outcomes. From personalized learning to automated assessment 
          systems.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
            Start Learning
          </Button>
          <Button variant="outline" className="px-8 py-3 text-lg">
            View Syllabus
          </Button>
        </div>
      </div>
    </div>
  )
}
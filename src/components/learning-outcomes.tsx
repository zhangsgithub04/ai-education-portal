import { Card, CardContent } from "@/components/ui/card"

const outcomes = [
  {
    id: 1,
    title: "Understanding AI Fundamentals",
    description: "Master core AI concepts including machine learning, neural networks, and natural language processing."
  },
  {
    id: 2,
    title: "Educational Applications",
    description: "Explore AI-powered learning platforms, adaptive learning systems, and intelligent tutoring systems."
  },
  {
    id: 3,
    title: "Assessment & Analytics",
    description: "Learn about automated grading, learning analytics, and performance prediction models."
  },
  {
    id: 4,
    title: "Ethical Considerations",
    description: "Address bias, privacy, and fairness in AI educational systems."
  },
  {
    id: 5,
    title: "Implementation Strategies",
    description: "Design and deploy AI solutions in educational environments effectively."
  },
  {
    id: 6,
    title: "Future Trends",
    description: "Anticipate emerging technologies and their potential impact on education."
  }
]

export function LearningOutcomes() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">Learning Outcomes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {outcomes.map((outcome) => (
            <Card key={outcome.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {outcome.id}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {outcome.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {outcome.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
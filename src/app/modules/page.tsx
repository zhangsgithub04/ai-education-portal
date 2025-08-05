import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const modules = [
  {
    id: 1,
    title: "Introduction to AI in Education",
    duration: "2 weeks",
    topics: ["AI fundamentals", "Educational context", "Historical overview"],
    status: "available"
  },
  {
    id: 2,
    title: "Machine Learning for Educators",
    duration: "2 weeks",
    topics: ["Supervised learning", "Unsupervised learning", "Deep learning basics"],
    status: "available"
  },
  {
    id: 3,
    title: "Natural Language Processing",
    duration: "1.5 weeks",
    topics: ["Text analysis", "Language models", "Educational applications"],
    status: "coming-soon"
  },
  {
    id: 4,
    title: "Personalized Learning Systems",
    duration: "1.5 weeks",
    topics: ["Adaptive algorithms", "Student modeling", "Content recommendation"],
    status: "coming-soon"
  },
  {
    id: 5,
    title: "Automated Assessment",
    duration: "2 weeks",
    topics: ["Grading systems", "Plagiarism detection", "Performance analytics"],
    status: "coming-soon"
  },
  {
    id: 6,
    title: "Intelligent Tutoring Systems",
    duration: "1.5 weeks",
    topics: ["Conversational AI", "Tutoring strategies", "Feedback mechanisms"],
    status: "coming-soon"
  },
  {
    id: 7,
    title: "Ethics and AI in Education",
    duration: "1 week",
    topics: ["Bias detection", "Privacy concerns", "Fairness in AI"],
    status: "coming-soon"
  },
  {
    id: 8,
    title: "Future of Educational Technology",
    duration: "1.5 weeks",
    topics: ["Emerging trends", "Implementation strategies", "Case studies"],
    status: "coming-soon"
  }
]

export default function Modules() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Modules</h1>
          <p className="text-xl text-gray-600">
            Comprehensive curriculum covering AI applications in educational settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Module {module.id}: {module.title}
                    </h3>
                    <p className="text-sm text-gray-500">Duration: {module.duration}</p>
                  </div>
                  <Badge 
                    variant={module.status === "available" ? "default" : "secondary"}
                    className={module.status === "available" ? "bg-green-100 text-green-800" : ""}
                  >
                    {module.status === "available" ? "Available" : "Coming Soon"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Topics covered:</h4>
                  <ul className="space-y-1">
                    {module.topics.map((topic, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
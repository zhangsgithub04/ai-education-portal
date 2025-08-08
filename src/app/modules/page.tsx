import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const modules = [
  {
    id: 1,
    title: "Introduction to AI in Education",
    duration: "Week 1",
    topics: ["AI fundamentals", "Educational context", "Historical overview", "Benefits and challenges"],
    status: "available"
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals I",
    duration: "Week 2",
    topics: ["Supervised learning", "Unsupervised learning", "Linear regression", "Model evaluation"],
    status: "available"
  },
  {
    id: 3,
    title: "Machine Learning Fundamentals II",
    duration: "Week 3",
    topics: ["Neural networks", "Deep learning", "Training validation", "Regularization"],
    status: "available"
  },
  {
    id: 4,
    title: "Natural Language Processing",
    duration: "Week 4",
    topics: ["Text analysis", "Sentiment analysis", "Essay scoring", "Language learning apps"],
    status: "coming-soon"
  },
  {
    id: 5,
    title: "Computer Vision for Education",
    duration: "Week 5",
    topics: ["Image recognition", "Document analysis", "Visual materials", "Accessibility"],
    status: "coming-soon"
  },
  {
    id: 6,
    title: "Personalized Learning Systems",
    duration: "Week 6",
    topics: ["Adaptive algorithms", "Student modeling", "Recommendation systems", "Learning paths"],
    status: "coming-soon"
  },
  {
    id: 7,
    title: "Intelligent Tutoring Systems",
    duration: "Week 7",
    topics: ["ITS architecture", "Knowledge representation", "Assessment methods", "Feedback"],
    status: "coming-soon"
  },
  {
    id: 8,
    title: "Learning Analytics & Data Mining",
    duration: "Week 8",
    topics: ["Data mining", "Analytics frameworks", "Predictive modeling", "Dashboards"],
    status: "coming-soon"
  },
  {
    id: 9,
    title: "Assessment and Evaluation",
    duration: "Week 9",
    topics: ["Automated assessment", "Computer testing", "Performance prediction", "Bias detection"],
    status: "coming-soon"
  },
  {
    id: 10,
    title: "Ethical AI in Education",
    duration: "Week 10",
    topics: ["Privacy protection", "Algorithmic fairness", "Transparency", "Ethical frameworks"],
    status: "coming-soon"
  },
  {
    id: 11,
    title: "Implementation and Integration",
    duration: "Week 11",
    topics: ["System architecture", "Technology stacks", "Platform integration", "Scalability"],
    status: "coming-soon"
  },
  {
    id: 12,
    title: "AI-Powered Learning Platforms",
    duration: "Week 12",
    topics: ["LMS integration", "Chatbots", "Gamification", "Mobile learning"],
    status: "coming-soon"
  },
  {
    id: 13,
    title: "Future Trends & Emerging Tech",
    duration: "Week 13",
    topics: ["VR/AR in education", "Conversational AI", "Blockchain credentials", "Research opportunities"],
    status: "coming-soon"
  },
  {
    id: 14,
    title: "Capstone Project Presentations",
    duration: "Week 14",
    topics: ["Project presentations", "Peer evaluations", "Case studies", "Course synthesis"],
    status: "coming-soon"
  },
  {
    id: 15,
    title: "Final Exam & Course Wrap-up",
    duration: "Week 15",
    topics: ["Comprehensive exam", "Course evaluation", "Professional development", "Certification"],
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
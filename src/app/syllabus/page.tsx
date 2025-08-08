import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const courseModules = [
  {
    week: 1,
    title: "Introduction to AI in Education",
    topics: [
      "Overview of artificial intelligence",
      "Historical context of AI in education",
      "Current applications and trends",
      "Benefits and challenges"
    ],
    deliverables: ["Reading assignment", "Discussion post"],
    duration: "3 hours"
  },
  {
    week: 2,
    title: "Machine Learning Fundamentals I",
    topics: [
      "Types of machine learning",
      "Supervised vs unsupervised learning",
      "Linear regression and classification",
      "Model evaluation metrics"
    ],
    deliverables: ["Lab exercise", "Quiz 1"],
    duration: "4 hours"
  },
  {
    week: 3,
    title: "Machine Learning Fundamentals II",
    topics: [
      "Neural networks basics",
      "Deep learning concepts",
      "Training and validation",
      "Overfitting and regularization"
    ],
    deliverables: ["ML project", "Technical report"],
    duration: "4 hours"
  },
  {
    week: 4,
    title: "Natural Language Processing in Education",
    topics: [
      "Text analysis and processing",
      "Sentiment analysis for student feedback",
      "Automated essay scoring",
      "Language learning applications"
    ],
    deliverables: ["NLP project", "Case study analysis"],
    duration: "5 hours"
  },
  {
    week: 5,
    title: "Computer Vision for Educational Content",
    topics: [
      "Image recognition and classification",
      "Document analysis and OCR",
      "Visual learning materials",
      "Accessibility applications"
    ],
    deliverables: ["Vision project", "Accessibility assessment"],
    duration: "4 hours"
  },
  {
    week: 6,
    title: "Personalized Learning Systems",
    topics: [
      "Adaptive learning algorithms",
      "Student modeling",
      "Recommendation systems",
      "Learning path optimization"
    ],
    deliverables: ["Design proposal", "Prototype demo"],
    duration: "4 hours"
  },
  {
    week: 7,
    title: "Intelligent Tutoring Systems",
    topics: [
      "ITS architecture and components",
      "Knowledge representation",
      "Student assessment methods",
      "Feedback generation"
    ],
    deliverables: ["ITS evaluation", "Research paper"],
    duration: "4 hours"
  },
  {
    week: 8,
    title: "Learning Analytics & Data Mining",
    topics: [
      "Educational data mining techniques",
      "Learning analytics frameworks",
      "Predictive modeling",
      "Dashboard design and visualization"
    ],
    deliverables: ["Analytics dashboard", "Data analysis report"],
    duration: "5 hours"
  },
  {
    week: 9,
    title: "Assessment and Evaluation",
    topics: [
      "Automated assessment systems",
      "Computer-based testing",
      "Performance prediction",
      "Bias detection and mitigation"
    ],
    deliverables: ["Assessment tool", "Bias analysis"],
    duration: "4 hours"
  },
  {
    week: 10,
    title: "Ethical AI in Education",
    topics: [
      "Privacy and data protection",
      "Algorithmic bias and fairness",
      "Transparency and explainability",
      "Ethical frameworks and guidelines"
    ],
    deliverables: ["Ethics case study", "Policy recommendation"],
    duration: "3 hours"
  },
  {
    week: 11,
    title: "Implementation and Integration",
    topics: [
      "System architecture design",
      "Technology stack selection",
      "Integration with existing platforms",
      "Scalability considerations"
    ],
    deliverables: ["Technical specification", "Implementation plan"],
    duration: "4 hours"
  },
  {
    week: 12,
    title: "AI-Powered Learning Platforms",
    topics: [
      "Modern LMS integration",
      "Chatbots and virtual assistants",
      "Gamification with AI",
      "Mobile learning applications"
    ],
    deliverables: ["Platform prototype", "User experience study"],
    duration: "4 hours"
  },
  {
    week: 13,
    title: "Future Trends and Emerging Technologies",
    topics: [
      "Virtual and augmented reality in education",
      "Conversational AI and chatbots",
      "Blockchain for education credentials",
      "Research opportunities and challenges"
    ],
    deliverables: ["Technology roadmap", "Innovation proposal"],
    duration: "4 hours"
  },
  {
    week: 14,
    title: "Capstone Project Presentations",
    topics: [
      "Final project presentations",
      "Peer evaluations",
      "Industry case studies",
      "Course reflection and synthesis"
    ],
    deliverables: ["Final project", "Peer reviews", "Portfolio"],
    duration: "4 hours"
  },
  {
    week: 15,
    title: "Final Exam and Course Wrap-up",
    topics: [
      "Comprehensive final examination",
      "Course evaluation and feedback",
      "Professional development planning",
      "Certification and next steps"
    ],
    deliverables: ["Final exam", "Course evaluation", "Development plan"],
    duration: "3 hours"
  }
]

const gradingBreakdown = [
  { component: "Assignments", percentage: 25, description: "Weekly assignments and lab exercises" },
  { component: "Quizzes", percentage: 15, description: "Short assessments on key concepts" },
  { component: "Projects", percentage: 20, description: "Hands-on implementation projects" },
  { component: "Final Project", percentage: 20, description: "Comprehensive capstone project" },
  { component: "Final Exam", percentage: 15, description: "Comprehensive final examination" },
  { component: "Participation", percentage: 5, description: "Discussion posts and class engagement" }
]

export default function Syllabus() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Syllabus</h1>
          <p className="text-xl text-gray-600">
            AI in Education - 15-week comprehensive curriculum
          </p>
        </div>

        {/* Course Overview */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-900">Course Overview</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                This course explores the intersection of artificial intelligence and education, 
                covering theoretical foundations, practical applications, and ethical considerations. 
                Students will gain hands-on experience with AI tools and techniques used in educational settings.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">15</div>
                  <div className="text-sm text-gray-600">Weeks</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">58</div>
                  <div className="text-sm text-gray-600">Total Hours</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">20</div>
                  <div className="text-sm text-gray-600">Assignments</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <div className="text-sm text-gray-600">Final Exam</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Schedule */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-900">Weekly Schedule</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {courseModules.map((module) => (
                <div key={module.week} className="border-l-4 border-blue-600 pl-6 pb-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Week {module.week}: {module.title}
                      </h3>
                      <Badge variant="outline" className="mt-1">
                        {module.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Topics Covered</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {module.topics.map((topic, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Deliverables</h4>
                      <div className="flex flex-wrap gap-2">
                        {module.deliverables.map((deliverable, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {deliverable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grading */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-900">Grading Breakdown</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gradingBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.component}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {item.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
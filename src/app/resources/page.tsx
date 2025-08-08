"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const resourceCategories = [
  {
    title: "Research Papers",
    description: "Curated collection of academic papers on AI in education",
    resources: [
      {
        title: "Artificial Intelligence in Education: A Review",
        type: "Academic Paper",
        author: "Baker & Smith (2024)",
        link: "#"
      },
      {
        title: "Machine Learning Applications in Educational Assessment",
        type: "Research Study",
        author: "Johnson et al. (2023)",
        link: "#"
      },
      {
        title: "Ethical Considerations in Educational AI Systems",
        type: "Position Paper",
        author: "Chen & Williams (2024)",
        link: "#"
      }
    ]
  },
  {
    title: "Tools & Platforms",
    description: "Software tools and platforms for implementing AI in education",
    resources: [
      {
        title: "TensorFlow for Educators",
        type: "Framework",
        author: "Google",
        link: "https://www.tensorflow.org/resources/learn-ml"
      },
      {
        title: "Hugging Face Transformers",
        type: "Library",
        author: "Hugging Face",
        link: "https://huggingface.co/docs/transformers"
      },
      {
        title: "OpenAI GPT API for Education",
        type: "API Service",
        author: "OpenAI",
        link: "https://platform.openai.com/docs"
      }
    ]
  },
  {
    title: "Datasets",
    description: "Educational datasets for AI research and development",
    resources: [
      {
        title: "Student Performance Dataset",
        type: "Dataset",
        author: "UCI ML Repository",
        link: "https://archive.ics.uci.edu/ml/datasets/student+performance"
      },
      {
        title: "Educational Text Corpus",
        type: "Text Dataset",
        author: "Stanford NLP",
        link: "#"
      },
      {
        title: "Learning Analytics Dataset",
        type: "Behavioral Data",
        author: "EdTech Research Lab",
        link: "#"
      }
    ]
  },
  {
    title: "Case Studies",
    description: "Real-world implementations of AI in educational settings",
    resources: [
      {
        title: "AI-Powered Tutoring at MIT",
        type: "Case Study",
        author: "MIT Education Lab",
        link: "#"
      },
      {
        title: "Personalized Learning with Adaptive Algorithms",
        type: "Implementation Guide",
        author: "Carnegie Learning",
        link: "#"
      },
      {
        title: "Automated Essay Scoring Systems",
        type: "Technical Report",
        author: "Educational Testing Service",
        link: "#"
      }
    ]
  }
]

export default function Resources() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Learning Resources</h1>
          <p className="text-xl text-gray-600">
            Comprehensive collection of materials to support your AI in education journey
          </p>
        </div>

        <div className="space-y-8">
          {resourceCategories.map((category, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-blue-50 border-b">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.resources.map((resource, resourceIndex) => (
                    <div 
                      key={resourceIndex}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                            {resource.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">{resource.author}</p>
                        </div>
                        
                        <Badge variant="secondary" className="text-xs">
                          {resource.type}
                        </Badge>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs"
                          onClick={() => window.open(resource.link, '_blank')}
                          disabled={resource.link === '#'}
                        >
                          {resource.link === '#' ? 'Coming Soon' : 'Access Resource'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
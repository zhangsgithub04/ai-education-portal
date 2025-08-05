const stats = [
  {
    number: "12",
    label: "Weeks",
    color: "text-blue-600"
  },
  {
    number: "8",
    label: "Modules",
    color: "text-blue-600"
  },
  {
    number: "4",
    label: "Projects",
    color: "text-blue-600"
  },
  {
    number: "24",
    label: "Lectures",
    color: "text-blue-600"
  }
]

export function CourseStats() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className={`text-5xl font-bold ${stat.color}`}>
                {stat.number}
              </div>
              <div className="text-lg text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
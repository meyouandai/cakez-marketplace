'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  price: number
  enrolled: number
  rating: number
  modules: number
  image: string
  featured: boolean
}

interface LearningPath {
  id: string
  title: string
  description: string
  courses: number
  duration: string
  icon: string
  color: string
}

export default function BakerAcademyPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const courses: Course[] = [
    {
      id: 'course-1',
      title: 'Mastering Buttercream Techniques',
      description: 'Learn professional buttercream piping, roses, and advanced decoration techniques',
      instructor: 'Chef Sarah Williams',
      duration: '6 hours',
      level: 'intermediate',
      category: 'decoration',
      price: 89,
      enrolled: 342,
      rating: 4.8,
      modules: 12,
      image: '/api/placeholder/400/300',
      featured: true
    },
    {
      id: 'course-2',
      title: 'Starting Your Cake Business',
      description: 'Complete guide to launching and growing a successful home bakery business',
      instructor: 'Business Expert James Chen',
      duration: '8 hours',
      level: 'beginner',
      category: 'business',
      price: 129,
      enrolled: 567,
      rating: 4.9,
      modules: 15,
      image: '/api/placeholder/400/300',
      featured: true
    },
    {
      id: 'course-3',
      title: 'Wedding Cake Fundamentals',
      description: 'Master the art of creating stunning multi-tier wedding cakes',
      instructor: 'Master Baker Emma Thompson',
      duration: '10 hours',
      level: 'advanced',
      category: 'specialty',
      price: 149,
      enrolled: 189,
      rating: 4.9,
      modules: 18,
      image: '/api/placeholder/400/300',
      featured: false
    },
    {
      id: 'course-4',
      title: 'Food Photography for Bakers',
      description: 'Capture stunning photos of your cakes for social media and marketing',
      instructor: 'Photographer Lisa Park',
      duration: '4 hours',
      level: 'beginner',
      category: 'marketing',
      price: 59,
      enrolled: 423,
      rating: 4.7,
      modules: 8,
      image: '/api/placeholder/400/300',
      featured: false
    },
    {
      id: 'course-5',
      title: 'Vegan & Allergy-Free Baking',
      description: 'Create delicious cakes for customers with dietary restrictions',
      instructor: 'Chef Maria Garcia',
      duration: '5 hours',
      level: 'intermediate',
      category: 'specialty',
      price: 79,
      enrolled: 298,
      rating: 4.8,
      modules: 10,
      image: '/api/placeholder/400/300',
      featured: true
    },
    {
      id: 'course-6',
      title: 'Pricing & Profit Strategies',
      description: 'Learn how to price your cakes profitably and manage finances',
      instructor: 'Finance Expert David Lee',
      duration: '3 hours',
      level: 'beginner',
      category: 'business',
      price: 49,
      enrolled: 512,
      rating: 4.6,
      modules: 6,
      image: '/api/placeholder/400/300',
      featured: false
    }
  ]

  const learningPaths: LearningPath[] = [
    {
      id: 'path-1',
      title: 'Beginner Baker Journey',
      description: 'Start from scratch and build your baking foundation',
      courses: 8,
      duration: '24 hours',
      icon: '🌱',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'path-2',
      title: 'Business Mastery',
      description: 'Transform your passion into a profitable business',
      courses: 6,
      duration: '18 hours',
      icon: '💼',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'path-3',
      title: 'Decoration Expert',
      description: 'Master advanced cake decoration techniques',
      courses: 10,
      duration: '30 hours',
      icon: '🎨',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'path-4',
      title: 'Marketing Pro',
      description: 'Build your brand and attract more customers',
      courses: 5,
      duration: '15 hours',
      icon: '📱',
      color: 'from-pink-400 to-pink-600'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Courses', icon: '📚' },
    { id: 'decoration', name: 'Decoration', icon: '🎨' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'specialty', name: 'Specialty', icon: '⭐' },
    { id: 'marketing', name: 'Marketing', icon: '📱' }
  ]

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner', color: 'text-green-600' },
    { id: 'intermediate', name: 'Intermediate', color: 'text-yellow-600' },
    { id: 'advanced', name: 'Advanced', color: 'text-red-600' }
  ]

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesLevel && matchesSearch
  })

  const handleEnroll = (courseId: string) => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/academy/courses/${courseId}`))
    } else {
      router.push(`/academy/courses/${courseId}/enroll`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-cake-purple to-cake-pink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Baker Academy
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Level up your baking skills with expert-led courses and grow your business
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-12 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
                  🔍
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Paths */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Learning Paths</h2>
          <p className="text-gray-600">Structured journeys to achieve your goals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {learningPaths.map(path => (
            <Link key={path.id} href={`/academy/paths/${path.id}`}>
              <div className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-hover transition-all hover:-translate-y-1 cursor-pointer">
                <div className={`w-16 h-16 bg-gradient-to-br ${path.color} rounded-xl flex items-center justify-center mb-4`}>
                  <span className="text-3xl">{path.icon}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{path.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{path.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{path.courses} courses</span>
                  <span className="text-gray-500">{path.duration}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-cake-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <div className="flex flex-wrap gap-2">
              {levels.map(level => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedLevel === level.id
                      ? 'bg-cake-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Courses */}
        {filteredCourses.filter(c => c.featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.filter(c => c.featured).map(course => (
                <div key={course.id} className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-hover transition-shadow">
                  {/* Course Image */}
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">📚</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ⭐ Featured
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900 flex-1">
                        {course.title}
                      </h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        course.level === 'beginner' ? 'bg-green-100 text-green-700' :
                        course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {course.level}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span>👨‍🏫</span> {course.instructor}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <span>⏱️</span> {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📚</span> {course.modules} modules
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{course.rating}</span>
                        <span className="text-gray-500">({course.enrolled} students)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold gradient-text">
                        £{course.price}
                      </div>
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className="btn-primary text-sm"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Courses */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory === 'all' && selectedLevel === 'all'
              ? 'All Courses'
              : 'Filtered Courses'}
            <span className="text-base font-normal text-gray-500 ml-2">
              ({filteredCourses.length} results)
            </span>
          </h2>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.filter(c => !c.featured).map(course => (
                <div key={course.id} className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-hover transition-shadow">
                  {/* Course Image */}
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">📚</span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900 flex-1">
                        {course.title}
                      </h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        course.level === 'beginner' ? 'bg-green-100 text-green-700' :
                        course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {course.level}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span>👨‍🏫</span> {course.instructor}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <span>⏱️</span> {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📚</span> {course.modules} modules
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{course.rating}</span>
                        <span className="text-gray-500">({course.enrolled} students)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold gradient-text">
                        £{course.price}
                      </div>
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className="btn-primary text-sm"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-cake-pink to-cake-purple rounded-2xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-3">Ready to become a master baker?</h3>
            <p className="mb-6 opacity-90">
              Join thousands of bakers who have transformed their skills and businesses
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/academy/membership" className="bg-white text-cake-purple px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                🎓 Get All-Access Pass
              </Link>
              <Link href="/academy/free-resources" className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors">
                📖 Free Resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

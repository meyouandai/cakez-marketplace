'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Module {
  id: string
  title: string
  duration: string
  type: 'video' | 'reading' | 'quiz' | 'assignment'
  completed: boolean
}

interface CourseDetails {
  id: string
  title: string
  description: string
  instructor: {
    name: string
    bio: string
    avatar: string
    expertise: string[]
  }
  modules: Module[]
  duration: string
  level: string
  price: number
  enrolled: number
  rating: number
  reviews: number
  skills: string[]
  requirements: string[]
  certificate: boolean
}

export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [isEnrolled, setIsEnrolled] = useState(false)

  // Demo course data
  const course: CourseDetails = {
    id: params.id,
    title: 'Mastering Buttercream Techniques',
    description: 'Take your cake decorating skills to the next level with this comprehensive course on buttercream techniques. Learn everything from basic piping to creating stunning roses and intricate designs.',
    instructor: {
      name: 'Chef Sarah Williams',
      bio: 'Award-winning pastry chef with 15+ years of experience. Specializes in wedding cakes and advanced decoration techniques.',
      avatar: '/api/placeholder/100/100',
      expertise: ['Buttercream', 'Fondant', 'Sugar Flowers', 'Wedding Cakes']
    },
    modules: [
      { id: 'm1', title: 'Introduction to Buttercream', duration: '15 min', type: 'video', completed: false },
      { id: 'm2', title: 'Essential Tools & Equipment', duration: '20 min', type: 'video', completed: false },
      { id: 'm3', title: 'Buttercream Recipes & Consistency', duration: '30 min', type: 'video', completed: false },
      { id: 'm4', title: 'Color Theory for Cakes', duration: '25 min', type: 'reading', completed: false },
      { id: 'm5', title: 'Basic Piping Techniques', duration: '45 min', type: 'video', completed: false },
      { id: 'm6', title: 'Practice Exercise: Borders', duration: '30 min', type: 'assignment', completed: false },
      { id: 'm7', title: 'Creating Buttercream Roses', duration: '40 min', type: 'video', completed: false },
      { id: 'm8', title: 'Advanced Flowers & Leaves', duration: '35 min', type: 'video', completed: false },
      { id: 'm9', title: 'Knowledge Check', duration: '15 min', type: 'quiz', completed: false },
      { id: 'm10', title: 'Textured Buttercream Techniques', duration: '30 min', type: 'video', completed: false },
      { id: 'm11', title: 'Troubleshooting Common Issues', duration: '20 min', type: 'reading', completed: false },
      { id: 'm12', title: 'Final Project: Complete Cake', duration: '60 min', type: 'assignment', completed: false }
    ],
    duration: '6 hours',
    level: 'intermediate',
    price: 89,
    enrolled: 342,
    rating: 4.8,
    reviews: 127,
    skills: [
      'Professional buttercream piping',
      'Color mixing and theory',
      'Rose and flower creation',
      'Texture techniques',
      'Troubleshooting',
      'Business presentation'
    ],
    requirements: [
      'Basic baking knowledge',
      'Access to piping bags and tips',
      'Stand mixer or hand mixer',
      'Basic cake decorating tools'
    ],
    certificate: true
  }

  const handleEnroll = () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/academy/courses/${params.id}`))
      return
    }

    // In real app, process payment
    setIsEnrolled(true)
  }

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥'
      case 'reading': return '📖'
      case 'quiz': return '✅'
      case 'assignment': return '📝'
      default: return '📚'
    }
  }

  const completedModules = course.modules.filter(m => m.completed).length
  const progressPercentage = (completedModules / course.modules.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-gradient-to-br from-cake-purple to-cake-pink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/academy" className="inline-flex items-center text-white/80 hover:text-white mb-6">
            ← Back to Academy
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.level === 'beginner' ? 'bg-green-500/20 text-green-100' :
                  course.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-100' :
                  'bg-red-500/20 text-red-100'
                }`}>
                  {course.level}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-yellow-300">★</span>
                  <span>{course.rating}</span>
                  <span className="opacity-80">({course.reviews} reviews)</span>
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl opacity-90 mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span>👨‍🏫</span>
                  <span>Taught by {course.instructor.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span>{course.duration} total</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📚</span>
                  <span>{course.modules.length} modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span>{course.enrolled} students</span>
                </div>
                {course.certificate && (
                  <div className="flex items-center gap-2">
                    <span>🎓</span>
                    <span>Certificate included</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                {isEnrolled ? (
                  <>
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{completedModules}/{course.modules.length} modules</span>
                      </div>
                      <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-white h-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      href={`/academy/courses/${params.id}/learn`}
                      className="w-full bg-white text-cake-purple py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-center block"
                    >
                      Continue Learning →
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold mb-6">£{course.price}</div>
                    <button
                      onClick={handleEnroll}
                      className="w-full bg-white text-cake-purple py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors mb-4"
                    >
                      Enroll Now
                    </button>
                    <p className="text-sm text-center opacity-80">
                      30-day money-back guarantee
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
          {['overview', 'curriculum', 'instructor', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white text-cake-purple shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* What you'll learn */}
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.skills.map((skill, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                <ul className="space-y-3">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              {/* Course includes */}
              <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-6">
                <h3 className="font-bold text-lg mb-4">This course includes:</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🎥</span>
                    <span>{course.duration} of video content</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">📱</span>
                    <span>Access on mobile and desktop</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">♾️</span>
                    <span>Lifetime access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">📝</span>
                    <span>Assignments and exercises</span>
                  </li>
                  {course.certificate && (
                    <li className="flex items-center gap-3">
                      <span className="text-xl">🎓</span>
                      <span>Certificate of completion</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
            <div className="space-y-3">
              {course.modules.map((module, index) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{getModuleIcon(module.type)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {index + 1}. {module.title}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span>{module.type}</span>
                        <span>•</span>
                        <span>{module.duration}</span>
                      </div>
                    </div>
                  </div>
                  {isEnrolled && (
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      module.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300'
                    }`}>
                      {module.completed && (
                        <span className="text-white text-xs flex items-center justify-center h-full">✓</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'instructor' && (
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-2xl font-bold mb-6">About the Instructor</h2>
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <span className="text-4xl">👨‍🍳</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{course.instructor.name}</h3>
                <p className="text-gray-700 mb-4">{course.instructor.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {course.instructor.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
            <div className="flex items-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900">{course.rating}</div>
                <div className="flex items-center gap-1 my-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className="text-yellow-500">
                      {star <= Math.round(course.rating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">{course.reviews} reviews</div>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map(rating => {
                  const percentage = rating === 5 ? 65 : rating === 4 ? 25 : rating === 3 ? 7 : rating === 2 ? 2 : 1
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm w-4">{rating}</span>
                      <span className="text-yellow-500">★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-yellow-500 h-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-10 text-right">{percentage}%</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sample Reviews */}
            <div className="space-y-6">
              {[
                {
                  name: 'Emma Thompson',
                  date: '2 weeks ago',
                  rating: 5,
                  comment: 'Absolutely fantastic course! Sarah explains everything so clearly and the techniques I learned have transformed my cake decorating.'
                },
                {
                  name: 'Michael Chen',
                  date: '1 month ago',
                  rating: 5,
                  comment: 'Worth every penny. The buttercream rose tutorial alone was worth the price of admission. My cakes look professional now!'
                },
                {
                  name: 'Sophie Williams',
                  date: '2 months ago',
                  rating: 4,
                  comment: 'Great course overall. Would have liked more troubleshooting tips, but the content is solid and well-presented.'
                }
              ].map((review, index) => (
                <div key={index} className="border-b pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{review.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className="text-yellow-500">
                              {star <= review.rating ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span>•</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

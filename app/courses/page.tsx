import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)

  const courses = await prisma.course.findMany({
    include: {
      _count: {
        select: {
          enrollments: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Group courses by type
  const safeBakeCourses = courses.filter(c => c.courseType === 'SAFEBAKE_HYGIENE')
  const academyCourses = courses.filter(c => c.courseType === 'CAKEZ_ACADEMY')
  const masterclassCourses = courses.filter(c => c.courseType === 'EXPERT_MASTERCLASS')

  const CourseCard = ({ course }: { course: any }) => (
    <Link href={`/courses/${course.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 h-full">
        <div className="flex items-start justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            course.courseType === 'SAFEBAKE_HYGIENE' ? 'bg-green-100 text-green-800' :
            course.courseType === 'CAKEZ_ACADEMY' ? 'bg-purple-100 text-purple-800' :
            'bg-gold-100 text-gold-800'
          }`}>
            {course.courseType === 'SAFEBAKE_HYGIENE' ? '🎓 SafeBake' :
             course.courseType === 'CAKEZ_ACADEMY' ? '📚 Academy' :
             '⭐ Masterclass'}
          </span>
          <span className="text-2xl font-bold text-cake-purple">£{course.price}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>📖 {course.duration || 'Self-paced'}</span>
          <span>{course._count.enrollments} enrolled</span>
        </div>

        {course.certificationLevel && (
          <div className="mt-3 pt-3 border-t">
            <span className="text-sm font-medium text-green-600">
              ✓ Certificate: {course.certificationLevel}
            </span>
          </div>
        )}
      </div>
    </Link>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cake-pink to-cake-purple text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cakez Training Academy</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Professional courses for home bakers. Learn food safety, master the platform, and level up your skills.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* SafeBake Hygiene Courses */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              🎓
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">SafeBake Hygiene Certification</h2>
              <p className="text-gray-600">Essential food safety training for all bakers</p>
            </div>
          </div>

          {safeBakeCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No SafeBake courses available yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeBakeCourses.map(course => <CourseCard key={course.id} course={course} />)}
            </div>
          )}
        </div>

        {/* Cakez Academy */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
              📚
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cakez Academy</h2>
              <p className="text-gray-600">Master the platform and grow your cake business</p>
            </div>
          </div>

          {academyCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No Academy courses available yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {academyCourses.map(course => <CourseCard key={course.id} course={course} />)}
            </div>
          )}
        </div>

        {/* Expert Masterclasses */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center text-2xl">
              ⭐
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Expert Masterclasses</h2>
              <p className="text-gray-600">Advanced techniques from top bakers</p>
            </div>
          </div>

          {masterclassCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No Masterclass courses available yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {masterclassCourses.map(course => <CourseCard key={course.id} course={course} />)}
            </div>
          )}
        </div>

        {/* CTA for logged-in users */}
        {session && (
          <div className="bg-gradient-to-r from-cake-pink to-cake-purple text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to start learning?</h3>
            <p className="mb-6">Enroll in courses and earn certificates to build trust with customers</p>
            <Link
              href="/dashboard/courses"
              className="inline-block bg-white text-cake-purple px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              View My Courses
            </Link>
          </div>
        )}

        {!session && (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Sign in to enroll</h3>
            <p className="text-gray-600 mb-6">Create an account to access our training courses</p>
            <Link
              href="/auth/signin"
              className="inline-block bg-gradient-to-r from-cake-pink to-cake-purple text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

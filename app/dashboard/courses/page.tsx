import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const enrollments = await prisma.courseEnrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: true
    },
    orderBy: { enrolledAt: 'desc' }
  })

  const inProgressCourses = enrollments.filter(e => !e.completedAt)
  const completedCourses = enrollments.filter(e => e.completedAt)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">Track your learning progress and certifications</p>
        </div>
        <Link
          href="/courses"
          className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
        >
          Browse Courses
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Enrolled</h3>
          <p className="text-3xl font-bold text-cake-purple mt-2">{enrollments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">In Progress</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{inProgressCourses.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Completed</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{completedCourses.length}</p>
        </div>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600 mb-6">Enroll in courses to build your skills and earn certifications</p>
          <Link
            href="/courses"
            className="inline-block bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <>
          {/* In Progress Courses */}
          {inProgressCourses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressCourses.map((enrollment) => (
                  <Link
                    key={enrollment.id}
                    href={`/dashboard/courses/${enrollment.course.id}`}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        enrollment.course.courseType === 'SAFEBAKE_HYGIENE' ? 'bg-green-100 text-green-800' :
                        enrollment.course.courseType === 'CAKEZ_ACADEMY' ? 'bg-purple-100 text-purple-800' :
                        'bg-gold-100 text-gold-800'
                      }`}>
                        {enrollment.course.courseType === 'SAFEBAKE_HYGIENE' ? '🎓 SafeBake' :
                         enrollment.course.courseType === 'CAKEZ_ACADEMY' ? '📚 Academy' :
                         '⭐ Masterclass'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{enrollment.course.title}</h3>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">{enrollment.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cake-pink to-cake-purple"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-sm text-gray-600">
                      Started {new Date(enrollment.enrolledAt).toLocaleDateString('en-GB')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Completed Courses */}
          {completedCourses.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Completed Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((enrollment) => (
                  <Link
                    key={enrollment.id}
                    href={`/dashboard/courses/${enrollment.course.id}`}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                        ✓ Completed
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{enrollment.course.title}</h3>

                    {enrollment.course.certificationLevel && (
                      <div className="bg-gold-50 border border-gold-200 rounded-lg p-3 mb-3">
                        <p className="text-sm font-medium text-gold-800">
                          🏆 Certificate: {enrollment.course.certificationLevel}
                        </p>
                      </div>
                    )}

                    <p className="text-sm text-gray-600">
                      Completed {new Date(enrollment.completedAt!).toLocaleDateString('en-GB')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

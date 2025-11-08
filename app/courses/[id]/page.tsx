import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import Link from 'next/link'
import EnrollButton from '@/app/components/EnrollButton'

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: {
          enrollments: true
        }
      }
    }
  })

  if (!course) {
    notFound()
  }

  // Check if user is already enrolled
  let enrollment = null
  if (session) {
    enrollment = await prisma.courseEnrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: course.id
      }
    })
  }

  const courseTypeInfo = {
    SAFEBAKE_HYGIENE: {
      icon: '🎓',
      name: 'SafeBake Hygiene',
      color: 'bg-green-100 text-green-800',
      description: 'Essential food safety certification for all home bakers'
    },
    CAKEZ_ACADEMY: {
      icon: '📚',
      name: 'Cakez Academy',
      color: 'bg-purple-100 text-purple-800',
      description: 'Learn to make the most of the Cakez platform'
    },
    EXPERT_MASTERCLASS: {
      icon: '⭐',
      name: 'Expert Masterclass',
      color: 'bg-gold-100 text-gold-800',
      description: 'Advanced baking techniques from industry experts'
    }
  }

  const typeInfo = courseTypeInfo[course.courseType as keyof typeof courseTypeInfo]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-cake-pink to-cake-purple text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`inline-flex items-center gap-2 ${typeInfo.color} px-4 py-2 rounded-full text-sm font-semibold mb-4`}>
            <span>{typeInfo.icon}</span>
            <span>{typeInfo.name}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl text-white/90 mb-6">{typeInfo.description}</p>

          <div className="flex items-center gap-6 text-white/90">
            <span>📖 {course.duration || 'Self-paced'}</span>
            <span>👥 {course._count.enrollments} enrolled</span>
            {course.certificationLevel && (
              <span>🏆 Certificate included</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{course.description}</p>
              </div>
            </div>

            {course.syllabus && (
              <div className="bg-white rounded-lg shadow p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Course Syllabus</h2>
                <div className="prose max-w-none">
                  <div className="text-gray-700 whitespace-pre-wrap">{course.syllabus}</div>
                </div>
              </div>
            )}

            {course.prerequisites && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-blue-900 mb-2">Prerequisites</h3>
                <p className="text-blue-800">{course.prerequisites}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-cake-purple mb-2">
                  £{course.price}
                </div>
                {course.price === 0 && (
                  <span className="text-green-600 font-semibold">Free Course</span>
                )}
              </div>

              {!session && (
                <div className="space-y-3">
                  <Link
                    href="/auth/signin"
                    className="block w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white text-center px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Sign In to Enroll
                  </Link>
                  <p className="text-sm text-gray-600 text-center">
                    Create an account to access this course
                  </p>
                </div>
              )}

              {session && enrollment && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-green-600 font-semibold mb-2">
                      ✓ You're enrolled!
                    </div>
                    <p className="text-sm text-green-700">
                      Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString('en-GB')}
                    </p>
                    {enrollment.completedAt && (
                      <p className="text-sm text-green-700 mt-2">
                        ✓ Completed on {new Date(enrollment.completedAt).toLocaleDateString('en-GB')}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    className="block w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white text-center px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    {enrollment.completedAt ? 'Review Course' : 'Continue Learning'}
                  </Link>
                </div>
              )}

              {session && !enrollment && (
                <EnrollButton courseId={course.id} price={course.price} />
              )}

              <div className="mt-6 pt-6 border-t space-y-4 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📖</span>
                  <div>
                    <div className="font-semibold text-gray-900">Duration</div>
                    <div>{course.duration || 'Self-paced learning'}</div>
                  </div>
                </div>

                {course.certificationLevel && (
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🏆</span>
                    <div>
                      <div className="font-semibold text-gray-900">Certificate</div>
                      <div>{course.certificationLevel}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <span className="text-xl">♾️</span>
                  <div>
                    <div className="font-semibold text-gray-900">Access</div>
                    <div>Lifetime access</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

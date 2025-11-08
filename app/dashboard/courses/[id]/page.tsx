import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import CourseProgressUpdater from '@/app/components/CourseProgressUpdater'

export default async function CourseViewerPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id }
  })

  if (!course) {
    notFound()
  }

  const enrollment = await prisma.courseEnrollment.findFirst({
    where: {
      userId: session.user.id,
      courseId: params.id
    }
  })

  if (!enrollment) {
    redirect(`/courses/${params.id}`)
  }

  const isCompleted = !!enrollment.completedAt

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/courses"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to My Courses
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
            </div>
            {isCompleted && (
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                ✓ Completed
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        {!isCompleted && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-gray-900">Your Progress</h2>
              <span className="text-sm font-semibold text-gray-900">{enrollment.progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-cake-pink to-cake-purple transition-all"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
            <CourseProgressUpdater
              enrollmentId={enrollment.id}
              currentProgress={enrollment.progress}
            />
          </div>
        )}

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8 mb-6">
              <h2 className="text-2xl font-bold mb-4">Course Overview</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{course.description}</p>
              </div>
            </div>

            {course.syllabus && (
              <div className="bg-white rounded-lg shadow p-8 mb-6">
                <h2 className="text-2xl font-bold mb-4">Syllabus</h2>
                <div className="prose max-w-none">
                  <div className="text-gray-700 whitespace-pre-wrap">{course.syllabus}</div>
                </div>
              </div>
            )}

            {course.videoUrl && (
              <div className="bg-white rounded-lg shadow p-8 mb-6">
                <h2 className="text-2xl font-bold mb-4">Course Video</h2>
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <p className="text-white">Video player would go here</p>
                  <p className="text-sm text-gray-400 mt-2">{course.videoUrl}</p>
                </div>
              </div>
            )}

            {course.materialUrl && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-4">Course Materials</h2>
                <a
                  href={course.materialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
                >
                  📄 Download Materials
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="font-semibold mb-4">Course Details</h3>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Duration</div>
                  <div className="font-medium">{course.duration || 'Self-paced'}</div>
                </div>

                <div>
                  <div className="text-gray-600 mb-1">Enrolled</div>
                  <div className="font-medium">
                    {new Date(enrollment.enrolledAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                {isCompleted && enrollment.completedAt && (
                  <div>
                    <div className="text-gray-600 mb-1">Completed</div>
                    <div className="font-medium">
                      {new Date(enrollment.completedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                )}

                {course.certificationLevel && isCompleted && (
                  <div className="pt-4 border-t">
                    <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
                      <div className="text-gold-800 font-semibold mb-2">
                        🏆 Certificate Earned
                      </div>
                      <div className="text-sm text-gold-700 mb-3">
                        {course.certificationLevel}
                      </div>
                      <button className="w-full bg-gold-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-700 transition">
                        Download Certificate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

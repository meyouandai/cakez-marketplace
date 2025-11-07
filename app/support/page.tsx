import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import ContactSupportForm from '@/app/components/ContactSupportForm'

export default async function ContactSupportPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin?callbackUrl=/support')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Contact Support
        </h1>
        <p className="text-lg text-gray-600">
          Need help? Our support team is here to assist you.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How can we help you?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📧 Response Time</h3>
              <p className="text-sm text-blue-800">We typically respond within 24 hours</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">💬 Live Support</h3>
              <p className="text-sm text-green-800">Monday - Friday, 9am - 5pm GMT</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-900 mb-2">💡 Before You Contact Us</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Check if your baker has replied via the Messages page</li>
              <li>• Review your order status in your dashboard</li>
              <li>• Make sure your email is verified</li>
            </ul>
          </div>
        </div>

        <ContactSupportForm />
      </div>
    </div>
  )
}

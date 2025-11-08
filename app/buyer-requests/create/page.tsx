import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import BuyerRequestForm from '@/app/components/BuyerRequestForm'

export default async function CreateBuyerRequestPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Buyer Request</h1>
          <p className="text-gray-600">
            Describe what you're looking for and receive proposals from bakers
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <BuyerRequestForm />
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Tips for a great request:</strong>
          </p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
            <li>Be specific about what you want (flavors, size, design)</li>
            <li>Include your deadline and location</li>
            <li>Mention your budget range if you have one</li>
            <li>Add any dietary requirements or special requests</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

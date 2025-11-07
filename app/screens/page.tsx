import Link from 'next/link'

export default function ScreensPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">All Designed Screens</h1>
        <p className="text-gray-600 mb-8">Click any link below to view the screens you designed</p>

        {/* Public Pages */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-cake-purple mb-4">🌐 Public Pages</h2>
          <div className="space-y-3">
            <Link href="/" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Homepage (Hero, How It Works, Features)
            </Link>
            <Link href="/browse" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Browse Cakes (Grid with filters)
            </Link>
            <Link href="/bakers" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Browse Bakers (Directory with reviews & ratings)
            </Link>
            <Link href="/courses" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Browse Courses (SafeBake, Academy, Masterclass)
            </Link>
            <Link href="/buyer-requests" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Buyer Requests / RFQ Marketplace
            </Link>
          </div>
        </div>

        {/* Auth Pages */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-cake-purple mb-4">🔐 Authentication</h2>
          <div className="space-y-3">
            <Link href="/auth/signin" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Sign In
            </Link>
            <Link href="/auth/signup" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Sign Up
            </Link>
          </div>
        </div>

        {/* Customer Pages */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-cake-purple mb-4">🛒 Customer Pages (Requires Login)</h2>
          <div className="space-y-3">
            <Link href="/dashboard/customer" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Customer Dashboard (View Your Orders with Reviews)
            </Link>
            <Link href="/dashboard/customer/buyer-requests" className="block text-cake-pink hover:text-cake-purple font-medium">
              → My Buyer Requests (Track Requests & Baker Responses)
            </Link>
            <Link href="/buyer-requests/create" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Post a Buyer Request
            </Link>
            <Link href="/dashboard/courses" className="block text-cake-pink hover:text-cake-purple font-medium">
              → My Courses (Enrolled & Completed)
            </Link>
            <Link href="/payment/success?session_id=demo" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Payment Success Page
            </Link>
          </div>
        </div>

        {/* Baker Pages */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-cake-purple mb-4">👨‍🍳 Baker Pages (Requires Baker Account)</h2>
          <div className="space-y-3">
            <Link href="/dashboard/baker" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Baker Dashboard (Stats, Revenue, Recent Orders)
            </Link>
            <Link href="/dashboard/baker/profile" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Baker Profile Setup/Edit
            </Link>
            <Link href="/dashboard/baker/cakes" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Manage Cakes (Your Listings)
            </Link>
            <Link href="/dashboard/baker/cakes/new" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Create New Cake Listing
            </Link>
            <Link href="/dashboard/baker/orders" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Manage Orders (Accept, Track Status, Complete)
            </Link>
            <Link href="/dashboard/baker/inquiries" className="block text-cake-pink hover:text-cake-purple font-medium">
              → View Customer Inquiries
            </Link>
            <Link href="/dashboard/courses" className="block text-cake-pink hover:text-cake-purple font-medium">
              → My Courses (Same as customer - earn certifications)
            </Link>
          </div>
        </div>

        {/* Admin Pages */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-cake-purple mb-4">⚙️ Admin Pages (Requires Admin Role)</h2>
          <div className="space-y-3">
            <Link href="/dashboard/admin" className="block text-cake-pink hover:text-cake-purple font-medium">
              → Admin Dashboard (Platform Stats & Management)
            </Link>
            <p className="text-sm text-gray-500">
              Note: You need an admin account to access this section. Admin links include:
              Courses, Content, Verifications, Users, Newsletters, Shipping Kits, Insurance, Analytics
            </p>
          </div>
        </div>

        {/* Dynamic Pages */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-cake-purple mb-4">📄 Dynamic Pages (Browse to see with real data)</h2>
          <div className="space-y-3">
            <p className="text-gray-600 text-sm mb-2">
              These pages show when you click on a specific item:
            </p>
            <div className="text-gray-700">
              → /cakes/[id] - Cake Detail Page with Reviews, Rating Breakdown & Buy Button
            </div>
            <div className="text-gray-700">
              → /bakers/[id] - Baker Profile with Portfolio, Reviews & Customer Ratings
            </div>
            <div className="text-gray-700">
              → /courses/[id] - Course Detail Page with Enrollment & Syllabus
            </div>
            <div className="text-gray-700">
              → /buyer-requests/[id] - Request Detail with Baker Responses & Proposals
            </div>
            <div className="text-gray-700">
              → /orders/[orderId]/review - Leave a Review for Completed Order (stars, photos)
            </div>
            <div className="text-gray-700">
              → /dashboard/courses/[id] - Course Viewer with Progress Tracking
            </div>
            <p className="text-sm text-gray-500 mt-3">
              To see these, browse the marketplace and click on any item
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-cake-pink to-cake-purple text-white rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-2">💡 How to View Everything</h3>
          <ol className="space-y-2 text-sm">
            <li>1. Start with the <Link href="/" className="underline font-medium">Homepage</Link></li>
            <li>2. Create a customer account to see customer features</li>
            <li>3. Create a baker account (sign up and select "Baker") to see baker features</li>
            <li>4. Browse cakes/bakers to see individual detail pages with reviews</li>
            <li>5. Make a test payment to see the full order flow (use test card: 4242 4242 4242 4242)</li>
            <li>6. Complete an order and leave a review with photos</li>
            <li>7. Enroll in courses and track your learning progress</li>
            <li>8. Post a buyer request and receive baker proposals</li>
          </ol>
        </div>

        {/* Feature Summary */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-3">✨ What's Built</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
            <div>✅ Complete Order Management System</div>
            <div>✅ Reviews & Ratings with Photos</div>
            <div>✅ Courses Platform (SafeBake, Academy, Masterclass)</div>
            <div>✅ Buyer Requests / RFQ System</div>
            <div>✅ Baker Order Status Workflow</div>
            <div>✅ Course Certifications</div>
            <div>✅ Admin Dashboard</div>
            <div>✅ Stripe Payment Integration</div>
            <div>✅ Image Upload System</div>
            <div>✅ Email Verification</div>
          </div>
        </div>
      </div>
    </div>
  )
}

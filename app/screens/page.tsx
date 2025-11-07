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
              → Browse Bakers (Directory)
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
              → Customer Dashboard (View Your Orders)
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
              → Baker Dashboard (Main Overview with Stats)
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
            <Link href="/dashboard/baker/inquiries" className="block text-cake-pink hover:text-cake-purple font-medium">
              → View Customer Inquiries/Orders
            </Link>
          </div>
        </div>

        {/* Dynamic Pages */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-cake-purple mb-4">📄 Dynamic Pages (Need to browse first to see real data)</h2>
          <div className="space-y-3">
            <p className="text-gray-600 text-sm mb-2">
              These pages show when you click on a specific cake or baker:
            </p>
            <div className="text-gray-700">
              → /cakes/[id] - Individual Cake Detail Page with Gallery & Buy Button
            </div>
            <div className="text-gray-700">
              → /bakers/[id] - Individual Baker Profile with Portfolio
            </div>
            <p className="text-sm text-gray-500 mt-3">
              To see these, go to <Link href="/browse" className="text-cake-pink font-medium">Browse Cakes</Link> or <Link href="/bakers" className="text-cake-pink font-medium">Browse Bakers</Link> and click on any item
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-cake-pink to-cake-purple text-white rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">💡 How to View Everything</h3>
          <ol className="space-y-2 text-sm">
            <li>1. Start with the <Link href="/" className="underline font-medium">Homepage</Link></li>
            <li>2. Create a customer account to see customer features</li>
            <li>3. Create a baker account (sign up and select "Baker") to see baker features</li>
            <li>4. Browse cakes/bakers to see individual detail pages</li>
            <li>5. Make a test payment to see the full flow (use test card: 4242 4242 4242 4242)</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

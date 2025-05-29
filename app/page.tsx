import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cake-pink via-cake-purple to-cake-blue min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Find Your Perfect<br />Birthday Cake
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect with talented local bakers for custom cakes that make every celebration special
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="bg-white text-cake-purple px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition"
            >
              Browse Cakes
            </Link>
            <Link
              href="/auth/signup"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white hover:text-cake-purple transition"
            >
              Join as Baker
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-cake-pink rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">Find talented bakers in your area with beautiful cake portfolios</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-cake-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">Message bakers directly to discuss your custom cake requirements</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-cake-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎂</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Celebrate</h3>
              <p className="text-gray-600">Enjoy your perfect custom cake delivered fresh for your special day</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features for Bakers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Grow Your Baking Business</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-cake-purple text-xl mr-3">✓</span>
                  <div>
                    <h4 className="font-semibold">Reach More Customers</h4>
                    <p className="text-gray-600">Get discovered by customers actively looking for custom cakes in your area</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-cake-purple text-xl mr-3">✓</span>
                  <div>
                    <h4 className="font-semibold">Professional Profile</h4>
                    <p className="text-gray-600">Showcase your best work with a beautiful portfolio and verified badge</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-cake-purple text-xl mr-3">✓</span>
                  <div>
                    <h4 className="font-semibold">Easy Management</h4>
                    <p className="text-gray-600">Manage orders, track earnings, and communicate with customers in one place</p>
                  </div>
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="inline-block mt-6 bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Start Selling Today
              </Link>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cake-pink to-cake-purple flex items-center justify-center">
                <span className="text-white text-9xl">🧁</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cake-purple">500+</div>
              <div className="text-gray-600">Verified Bakers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cake-purple">2,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cake-purple">100%</div>
              <div className="text-gray-600">Secure Payments</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cake-purple">4.9★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-cake-pink to-cake-purple">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Perfect Cake?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of happy customers who found their dream cakes on Cakez
          </p>
          <Link
            href="/browse"
            className="inline-block bg-white text-cake-purple px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition"
          >
            Start Browsing
          </Link>
        </div>
      </section>
    </>
  )
}
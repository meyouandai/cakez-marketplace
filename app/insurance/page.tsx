import Link from 'next/link'

export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Baker Insurance & Protection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Protect your baking business with comprehensive insurance coverage. Get peace of mind while you create delicious cakes.
          </p>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-cake-pink to-cake-purple rounded-lg p-8 text-white mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">🛡️ Why Bakers Need Insurance</h2>
            <p className="text-lg text-white/90 mb-6">
              Operating a home-based or commercial bakery comes with risks. Insurance protects you from liability, property damage, and business interruptions.
            </p>
            <Link
              href="/support"
              className="inline-block bg-white text-cake-purple px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get a Quote
            </Link>
          </div>
        </div>

        {/* Types of Insurance */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Types of Insurance for Bakers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Public Liability */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Public Liability Insurance</h3>
              <p className="text-gray-600 mb-4">
                Protects you if someone gets ill from your cakes or has an allergic reaction. Essential for all food businesses.
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-semibold mb-2">What's Covered:</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Customer illness or injury claims</li>
                  <li>• Allergic reactions</li>
                  <li>• Food poisoning incidents</li>
                  <li>• Legal defense costs</li>
                </ul>
              </div>
            </div>

            {/* Product Liability */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl mb-4">🎂</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Product Liability Insurance</h3>
              <p className="text-gray-600 mb-4">
                Covers claims related to defects in your products that cause harm or damage to customers.
              </p>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-900 font-semibold mb-2">What's Covered:</p>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Defective products</li>
                  <li>• Contamination issues</li>
                  <li>• Incorrect ingredient labels</li>
                  <li>• Product recall costs</li>
                </ul>
              </div>
            </div>

            {/* Equipment Insurance */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Equipment Insurance</h3>
              <p className="text-gray-600 mb-4">
                Protects your valuable baking equipment like ovens, mixers, refrigerators, and decorating tools.
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-900 font-semibold mb-2">What's Covered:</p>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Theft or burglary</li>
                  <li>• Fire or water damage</li>
                  <li>• Equipment breakdown</li>
                  <li>• Replacement costs</li>
                </ul>
              </div>
            </div>

            {/* Business Interruption */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Business Interruption Insurance</h3>
              <p className="text-gray-600 mb-4">
                Covers lost income if your business must temporarily close due to covered events like fire or equipment failure.
              </p>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-900 font-semibold mb-2">What's Covered:</p>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Lost revenue during closure</li>
                  <li>• Fixed costs and expenses</li>
                  <li>• Temporary relocation costs</li>
                  <li>• Lost contracts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Providers */}
        <div className="bg-white rounded-lg shadow p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recommended Insurance Providers
          </h2>
          <p className="text-gray-600 mb-6">
            While we don't directly sell insurance, we've partnered with trusted providers who specialize in small food businesses and home bakers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-cake-purple transition">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Simply Business</h3>
              <p className="text-sm text-gray-600 mb-4">
                Specialist small business insurance with flexible coverage options for home bakers.
              </p>
              <a
                href="https://www.simplybusiness.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cake-purple font-semibold hover:text-cake-pink"
              >
                Learn More →
              </a>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-cake-purple transition">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Hiscox</h3>
              <p className="text-sm text-gray-600 mb-4">
                Comprehensive business insurance tailored for food businesses and caterers.
              </p>
              <a
                href="https://www.hiscox.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cake-purple font-semibold hover:text-cake-pink"
              >
                Learn More →
              </a>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-cake-purple transition">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Qdos Contractor</h3>
              <p className="text-sm text-gray-600 mb-4">
                Affordable professional indemnity and public liability for sole traders.
              </p>
              <a
                href="https://www.qdoscontractor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cake-purple font-semibold hover:text-cake-pink"
              >
                Learn More →
              </a>
            </div>
          </div>
        </div>

        {/* Cost Guide */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            💷 How Much Does Insurance Cost?
          </h2>
          <div className="space-y-4 text-blue-800">
            <div className="flex items-start gap-3">
              <span className="font-bold">£15-50/month</span>
              <span>Basic public liability coverage for home bakers</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold">£50-150/month</span>
              <span>Comprehensive coverage including equipment and product liability</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold">£150+/month</span>
              <span>Full commercial coverage for established bakeries with employees</span>
            </div>
          </div>
          <p className="text-sm text-blue-700 mt-4">
            *Prices vary based on coverage level, business size, and claims history
          </p>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cake-purple to-cake-blue rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Business?</h2>
          <p className="text-lg text-white/90 mb-6">
            Contact our support team for personalized insurance recommendations
          </p>
          <Link
            href="/support"
            className="inline-block bg-white text-cake-purple px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Help with Insurance
          </Link>
        </div>
      </div>
    </div>
  )
}

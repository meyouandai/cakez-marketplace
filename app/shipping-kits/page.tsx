import Link from 'next/link'

export default function ShippingKitsPage() {
  const kits = [
    {
      id: '1',
      name: 'Single Tier Cake Kit',
      description: 'Perfect for 6-8 inch single tier cakes. Includes sturdy box, cake board, and protective inserts.',
      price: 4.99,
      sizes: '6", 8", 10"',
      features: ['Food-safe materials', 'Recyclable packaging', 'Window display option', 'Branded stickers included']
    },
    {
      id: '2',
      name: 'Two Tier Cake Kit',
      description: 'Designed for stable transport of two-tier cakes. Extra reinforcement and separators included.',
      price: 7.99,
      sizes: '6+8", 8+10"',
      features: ['Double-wall construction', 'Tier separators', 'Heavy-duty base', 'Assembly instructions']
    },
    {
      id: '3',
      name: 'Cupcake Transport Box',
      description: 'Individual compartments keep cupcakes safe and prevent frosting damage during delivery.',
      price: 3.49,
      sizes: '6, 12, 24 cupcakes',
      features: ['Individual inserts', 'Clear viewing window', 'Stackable design', 'Grip handles']
    },
    {
      id: '4',
      name: 'Macaron & Small Treats Box',
      description: 'Elegant boxes for macarons, cookies, and small pastries with custom insert options.',
      price: 2.99,
      sizes: '12, 24, 36 pieces',
      features: ['Customizable inserts', 'Premium finish', 'Ribbon-ready design', 'Food-safe lining']
    },
    {
      id: '5',
      name: 'Wedding Cake Transport System',
      description: 'Professional-grade kit for safely transporting multi-tier wedding cakes. Includes all accessories.',
      price: 24.99,
      sizes: 'Up to 4 tiers',
      features: ['Non-slip base', 'Tier supports', 'Professional straps', 'Assembly guide & video']
    },
    {
      id: '6',
      name: 'Seasonal/Themed Boxes',
      description: 'Special occasion boxes with seasonal designs for Christmas, birthdays, weddings, and more.',
      price: 5.49,
      sizes: 'Various',
      features: ['Festive designs', 'Premium cardstock', 'Easy assembly', 'Matching ribbon included']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cake Shipping Kits & Supplies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional packaging solutions to ensure your cakes arrive perfect every time. Food-safe, eco-friendly, and bakery-approved.
          </p>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-cake-pink to-cake-purple rounded-lg p-8 text-white mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">📦 Delivery Made Easy</h2>
            <p className="text-lg text-white/90 mb-6">
              Get bulk discounts on shipping supplies. Free delivery on orders over £50!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/support"
                className="bg-white text-cake-purple px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Request Bulk Quote
              </Link>
              <Link
                href="/auth/signup"
                className="bg-cake-purple/20 backdrop-blur text-white border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-cake-purple/30 transition"
              >
                Join as Baker
              </Link>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Kits</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kits.map((kit) => (
              <div key={kit.id} className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-cake-mint to-cake-yellow flex items-center justify-center">
                  <span className="text-6xl">📦</span>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{kit.name}</h3>
                    <span className="text-2xl font-bold text-cake-purple">£{kit.price}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{kit.description}</p>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Sizes Available:</p>
                    <p className="text-sm text-gray-600">{kit.sizes}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Features:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {kit.features.map((feature, idx) => (
                        <li key={idx}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/support"
                    className="block w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white text-center px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-lg shadow p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Cakez Shipping Kits?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="font-bold text-gray-900 mb-2">Eco-Friendly</h3>
              <p className="text-sm text-gray-600">100% recyclable and biodegradable materials</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-gray-900 mb-2">Food-Safe</h3>
              <p className="text-sm text-gray-600">Certified food-grade packaging materials</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">💪</div>
              <h3 className="font-bold text-gray-900 mb-2">Durable</h3>
              <p className="text-sm text-gray-600">Tested to withstand delivery conditions</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">💷</div>
              <h3 className="font-bold text-gray-900 mb-2">Bulk Pricing</h3>
              <p className="text-sm text-gray-600">Save more when you order in bulk</p>
            </div>
          </div>
        </div>

        {/* Bulk Pricing */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            💰 Bulk Order Discounts
          </h2>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-center justify-between">
              <span>10-49 units</span>
              <span className="font-bold">10% off</span>
            </div>
            <div className="flex items-center justify-between">
              <span>50-99 units</span>
              <span className="font-bold">15% off</span>
            </div>
            <div className="flex items-center justify-between">
              <span>100+ units</span>
              <span className="font-bold">20% off</span>
            </div>
          </div>
          <p className="text-sm text-blue-700 mt-4">
            Plus free delivery on orders over £50!
          </p>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cake-purple to-cake-blue rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Upgrade Your Packaging?</h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Contact us for custom branding options, bulk quotes, or to request samples
          </p>
          <Link
            href="/support"
            className="inline-block bg-white text-cake-purple px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Contact Sales Team
          </Link>
        </div>
      </div>
    </div>
  )
}

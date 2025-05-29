import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/bakers - Search and filter bakers
export async function GET(request: NextRequest) {
  try {
    // Return demo baker data
    const demoBakers = [
      {
        id: 'demo-baker-1',
        businessName: 'Sweet Sarah\'s Bakery',
        description: 'Specializing in custom birthday cakes and wedding desserts. 15 years of experience creating memorable celebrations.',
        location: 'London',
        deliveryRadius: 15,
        featured: true,
        quickResponderBadge: true,
        user: {
          email: 'sarah@sweetbakery.com',
          verificationStatus: 'VERIFIED',
          trustBadges: []
        },
        _count: {
          orders: 25,
          cakeListings: 8
        }
      },
      {
        id: 'demo-baker-2',
        businessName: 'Chocolate Dreams',
        description: 'Premium chocolate cakes and artisan desserts. Using only the finest Belgian chocolate and organic ingredients.',
        location: 'Manchester',
        deliveryRadius: 20,
        featured: false,
        quickResponderBadge: true,
        user: {
          email: 'info@chocolatedreams.com',
          verificationStatus: 'VERIFIED',
          trustBadges: []
        },
        _count: {
          orders: 18,
          cakeListings: 12
        }
      },
      {
        id: 'demo-baker-3',
        businessName: 'The Cake Artist',
        description: 'Custom designed cakes for every occasion. From whimsical kids\' parties to elegant corporate events.',
        location: 'Birmingham',
        deliveryRadius: 12,
        featured: false,
        quickResponderBadge: false,
        user: {
          email: 'hello@cakeartist.co.uk',
          verificationStatus: 'VERIFIED',
          trustBadges: []
        },
        _count: {
          orders: 15,
          cakeListings: 6
        }
      }
    ]

    return NextResponse.json({
      bakers: demoBakers,
      pagination: {
        page: 1,
        limit: 12,
        total: 3,
        totalPages: 1
      }
    })
  } catch (error) {
    console.error('Error fetching bakers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bakers' },
      { status: 500 }
    )
  }
}
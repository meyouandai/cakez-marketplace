import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    // Return demo categories
    const demoCategories = [
      { id: 'cat-1', name: 'Birthday Cakes', description: 'Traditional birthday celebration cakes' },
      { id: 'cat-2', name: 'Wedding Cakes', description: 'Elegant multi-tier wedding cakes' },
      { id: 'cat-3', name: 'Cupcakes', description: 'Individual portion cupcakes' },
      { id: 'cat-4', name: 'Cheesecakes', description: 'Creamy and delicious cheesecakes' },
      { id: 'cat-5', name: 'Chocolate Cakes', description: 'Rich chocolate cakes and desserts' },
      { id: 'cat-6', name: 'Fruit Cakes', description: 'Fresh fruit-based cakes' },
      { id: 'cat-7', name: 'Vegan Cakes', description: 'Plant-based and vegan-friendly cakes' },
      { id: 'cat-8', name: 'Gluten-Free', description: 'Gluten-free cake options' },
      { id: 'cat-9', name: 'Custom Designs', description: 'Fully customized cake designs' },
      { id: 'cat-10', name: 'Kids Cakes', description: 'Fun themed cakes for children' }
    ]

    return NextResponse.json(demoCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
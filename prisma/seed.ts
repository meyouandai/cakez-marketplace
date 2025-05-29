import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const categories = [
    { name: 'Birthday Cakes', description: 'Traditional birthday celebration cakes' },
    { name: 'Wedding Cakes', description: 'Elegant multi-tier wedding cakes' },
    { name: 'Cupcakes', description: 'Individual portion cupcakes' },
    { name: 'Cheesecakes', description: 'Creamy and delicious cheesecakes' },
    { name: 'Chocolate Cakes', description: 'Rich chocolate cakes and desserts' },
    { name: 'Fruit Cakes', description: 'Fresh fruit-based cakes' },
    { name: 'Vegan Cakes', description: 'Plant-based and vegan-friendly cakes' },
    { name: 'Gluten-Free', description: 'Gluten-free cake options' },
    { name: 'Custom Designs', description: 'Fully customized cake designs' },
    { name: 'Kids Cakes', description: 'Fun themed cakes for children' }
  ]

  const createdCategories = []
  for (const category of categories) {
    const cat = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    })
    createdCategories.push(cat)
  }

  console.log('✅ Categories seeded successfully')

  // Create sample baker users and profiles
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const bakers = [
    {
      email: 'sweet.sarah@example.com',
      businessName: 'Sweet Sarah\'s Bakery',
      description: 'Specializing in custom birthday cakes and wedding desserts. 15 years of experience creating memorable celebrations.',
      location: 'London',
      deliveryRadius: 15
    },
    {
      email: 'chocolate.dreams@example.com',
      businessName: 'Chocolate Dreams',
      description: 'Premium chocolate cakes and artisan desserts. Using only the finest Belgian chocolate and organic ingredients.',
      location: 'Manchester',
      deliveryRadius: 20
    },
    {
      email: 'cake.artist@example.com',
      businessName: 'The Cake Artist',
      description: 'Custom designed cakes for every occasion. From whimsical kids\' parties to elegant corporate events.',
      location: 'Birmingham',
      deliveryRadius: 12
    }
  ]

  for (const bakerData of bakers) {
    // Create user
    const user = await prisma.user.upsert({
      where: { email: bakerData.email },
      update: {},
      create: {
        email: bakerData.email,
        password: hashedPassword,
        role: 'BAKER',
        verificationStatus: 'VERIFIED'
      }
    })

    // Create baker profile
    const baker = await prisma.bakerProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        businessName: bakerData.businessName,
        description: bakerData.description,
        location: bakerData.location,
        deliveryRadius: bakerData.deliveryRadius,
        quickResponderBadge: true
      }
    })

    // Create sample cakes for each baker
    const sampleCakes = [
      {
        title: 'Classic Chocolate Birthday Cake',
        description: 'Rich chocolate sponge with chocolate buttercream frosting. Perfect for birthday celebrations. Can be customized with personalized message.',
        price: 25.99,
        images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'],
        category: createdCategories.find(c => c.name === 'Birthday Cakes')?.id
      },
      {
        title: 'Vanilla Cupcakes (Box of 12)',
        description: 'Fluffy vanilla cupcakes topped with smooth vanilla buttercream. Perfect for parties and sharing.',
        price: 18.50,
        images: ['https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500'],
        category: createdCategories.find(c => c.name === 'Cupcakes')?.id
      }
    ]

    for (const cakeData of sampleCakes) {
      if (cakeData.category) {
        await prisma.cakeListing.create({
          data: {
            bakerId: baker.id,
            title: cakeData.title,
            description: cakeData.description,
            price: cakeData.price,
            category: cakeData.category,
            images: cakeData.images,
            active: true
          }
        })
      }
    }
  }

  console.log('✅ Sample bakers and cakes seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
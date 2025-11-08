import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Load environment variables from .env.local
config({ path: '.env.local' })

const prisma = new PrismaClient()

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        bakerProfile: {
          select: {
            businessName: true,
            location: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('\n=== ALL USERS IN DATABASE ===\n')
    console.log(`Total Users: ${users.length}\n`)

    const admins = users.filter(u => u.role === 'ADMIN')
    const bakers = users.filter(u => u.role === 'BAKER')
    const customers = users.filter(u => u.role === 'CUSTOMER')

    console.log(`Admins: ${admins.length}`)
    console.log(`Bakers: ${bakers.length}`)
    console.log(`Customers: ${customers.length}\n`)

    if (admins.length > 0) {
      console.log('--- ADMINS ---')
      admins.forEach(user => {
        console.log(`✓ ${user.name || 'No name'}`)
        console.log(`  Email: ${user.email}`)
        console.log(`  ID: ${user.id}`)
        console.log(`  Verified: ${user.emailVerified ? 'Yes' : 'No'}`)
        console.log(`  Created: ${user.createdAt.toLocaleDateString()}\n`)
      })
    }

    if (bakers.length > 0) {
      console.log('--- BAKERS ---')
      bakers.forEach(user => {
        console.log(`✓ ${user.name || 'No name'}`)
        console.log(`  Email: ${user.email}`)
        console.log(`  Business: ${user.bakerProfile?.businessName || 'Not set'}`)
        console.log(`  Location: ${user.bakerProfile?.location || 'Not set'}`)
        console.log(`  ID: ${user.id}`)
        console.log(`  Verified: ${user.emailVerified ? 'Yes' : 'No'}`)
        console.log(`  Created: ${user.createdAt.toLocaleDateString()}\n`)
      })
    }

    if (customers.length > 0) {
      console.log('--- CUSTOMERS ---')
      customers.forEach(user => {
        console.log(`✓ ${user.name || 'No name'}`)
        console.log(`  Email: ${user.email}`)
        console.log(`  ID: ${user.id}`)
        console.log(`  Verified: ${user.emailVerified ? 'Yes' : 'No'}`)
        console.log(`  Created: ${user.createdAt.toLocaleDateString()}\n`)
      })
    }

  } catch (error) {
    console.error('Error querying database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()

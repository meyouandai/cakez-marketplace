import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './components/Providers'
import Navigation from './components/Navigation'

export const metadata: Metadata = {
  title: 'Cakez - Find Your Perfect Birthday Cake',
  description: 'Connect with talented local bakers for custom birthday cakes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          <Navigation />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ForumCategory {
  id: string
  name: string
  description: string
  icon: string
  topics: number
  posts: number
  lastPost?: {
    title: string
    author: string
    timestamp: Date
  }
}

interface Topic {
  id: string
  title: string
  author: {
    name: string
    role: 'BAKER' | 'CUSTOMER'
    verified: boolean
  }
  category: string
  replies: number
  views: number
  lastReply: Date
  pinned: boolean
  tags: string[]
}

export default function CommunityPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('discussions')
  const [searchQuery, setSearchQuery] = useState('')

  const categories: ForumCategory[] = [
    {
      id: 'general',
      name: 'General Discussion',
      description: 'Chat about anything cake-related',
      icon: '💬',
      topics: 1342,
      posts: 8921,
      lastPost: {
        title: 'Best flour brands for cakes?',
        author: 'Emma B.',
        timestamp: new Date(Date.now() - 3600000)
      }
    },
    {
      id: 'techniques',
      name: 'Baking Techniques',
      description: 'Share tips, tricks, and methods',
      icon: '🎂',
      topics: 892,
      posts: 6234,
      lastPost: {
        title: 'Achieving perfect buttercream consistency',
        author: 'Chef Sarah',
        timestamp: new Date(Date.now() - 7200000)
      }
    },
    {
      id: 'business',
      name: 'Business & Marketing',
      description: 'Grow your cake business',
      icon: '💼',
      topics: 567,
      posts: 3456,
      lastPost: {
        title: 'Instagram marketing strategies that work',
        author: 'Michael C.',
        timestamp: new Date(Date.now() - 10800000)
      }
    },
    {
      id: 'showcase',
      name: 'Cake Showcase',
      description: 'Show off your creations',
      icon: '🌟',
      topics: 2103,
      posts: 12567,
      lastPost: {
        title: 'My first wedding cake - feedback welcome!',
        author: 'Sophie W.',
        timestamp: new Date(Date.now() - 1800000)
      }
    },
    {
      id: 'troubleshooting',
      name: 'Help & Troubleshooting',
      description: 'Get help with baking problems',
      icon: '🆘',
      topics: 432,
      posts: 2876,
      lastPost: {
        title: 'Why did my cake sink in the middle?',
        author: 'Alex J.',
        timestamp: new Date(Date.now() - 5400000)
      }
    },
    {
      id: 'marketplace',
      name: 'Marketplace Talk',
      description: 'Discuss the Cakez platform',
      icon: '🛍️',
      topics: 234,
      posts: 1567,
      lastPost: {
        title: 'New feature suggestions',
        author: 'David L.',
        timestamp: new Date(Date.now() - 14400000)
      }
    }
  ]

  const recentTopics: Topic[] = [
    {
      id: 't1',
      title: '📌 Welcome to the Cakez Community!',
      author: { name: 'Admin', role: 'BAKER', verified: true },
      category: 'general',
      replies: 234,
      views: 5678,
      lastReply: new Date(Date.now() - 3600000),
      pinned: true,
      tags: ['announcement', 'rules']
    },
    {
      id: 't2',
      title: 'Share your buttercream flower techniques',
      author: { name: 'Sarah Williams', role: 'BAKER', verified: true },
      category: 'techniques',
      replies: 89,
      views: 1234,
      lastReply: new Date(Date.now() - 1800000),
      pinned: false,
      tags: ['buttercream', 'flowers', 'tutorial']
    },
    {
      id: 't3',
      title: 'How do you price custom wedding cakes?',
      author: { name: 'Emma Thompson', role: 'BAKER', verified: false },
      category: 'business',
      replies: 45,
      views: 892,
      lastReply: new Date(Date.now() - 7200000),
      pinned: false,
      tags: ['pricing', 'wedding', 'business']
    },
    {
      id: 't4',
      title: 'My chocolate cake keeps coming out dry - help!',
      author: { name: 'John Customer', role: 'CUSTOMER', verified: false },
      category: 'troubleshooting',
      replies: 23,
      views: 456,
      lastReply: new Date(Date.now() - 5400000),
      pinned: false,
      tags: ['help', 'chocolate', 'moisture']
    },
    {
      id: 't5',
      title: 'Check out my rainbow layer cake! 🌈',
      author: { name: 'Sophie Baker', role: 'BAKER', verified: true },
      category: 'showcase',
      replies: 67,
      views: 2345,
      lastReply: new Date(Date.now() - 900000),
      pinned: false,
      tags: ['showcase', 'rainbow', 'layers']
    }
  ]

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  const handleNewTopic = () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent('/community/new'))
    } else {
      router.push('/community/new')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Community</h1>
              <p className="text-gray-600 mt-1">Connect, share, and learn with fellow bakers</p>
            </div>
            <button
              onClick={handleNewTopic}
              className="btn-primary"
            >
              ✏️ New Topic
            </button>
          </div>

          {/* Search */}
          <div className="mt-6 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cake-purple focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8">
          {['discussions', 'categories', 'members', 'events'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-cake-purple shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'discussions' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-soft">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">Recent Discussions</h2>
                </div>
                <div className="divide-y">
                  {recentTopics.map(topic => (
                    <Link key={topic.id} href={`/community/topics/${topic.id}`}>
                      <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {topic.pinned && (
                                <span className="text-red-500" title="Pinned">📌</span>
                              )}
                              <h3 className="font-semibold text-gray-900 hover:text-cake-purple transition-colors">
                                {topic.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <span>👤</span>
                                {topic.author.name}
                                {topic.author.verified && (
                                  <span className="text-blue-500" title="Verified">✓</span>
                                )}
                              </span>
                              <span>•</span>
                              <span>in {categories.find(c => c.id === topic.category)?.name}</span>
                              <span>•</span>
                              <span>{formatTimeAgo(topic.lastReply)}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {topic.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-center ml-6">
                            <div className="text-2xl font-bold text-gray-900">{topic.replies}</div>
                            <div className="text-xs text-gray-600">replies</div>
                            <div className="text-sm text-gray-500 mt-1">{topic.views} views</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="p-6 text-center">
                  <Link href="/community/topics" className="text-cake-purple hover:underline">
                    View all topics →
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Community Stats */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h3 className="font-bold text-lg mb-4">Community Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cake-purple">5,467</div>
                    <div className="text-sm text-gray-600">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cake-purple">23,456</div>
                    <div className="text-sm text-gray-600">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cake-purple">892</div>
                    <div className="text-sm text-gray-600">Bakers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cake-purple">156</div>
                    <div className="text-sm text-gray-600">Online Now</div>
                  </div>
                </div>
              </div>

              {/* Top Contributors */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h3 className="font-bold text-lg mb-4">Top Contributors</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Chef Sarah', posts: 567, badge: '👑' },
                    { name: 'Emma Thompson', posts: 432, badge: '🥈' },
                    { name: 'Michael Chen', posts: 389, badge: '🥉' },
                    { name: 'Sophie Williams', posts: 234, badge: '⭐' },
                    { name: 'David Lee', posts: 198, badge: '⭐' }
                  ].map((contributor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{contributor.badge}</span>
                        <span className="font-medium">{contributor.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{contributor.posts} posts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-gradient-to-br from-cake-pink to-cake-purple text-white rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Virtual Cake Decorating Workshop</h4>
                    <p className="text-sm opacity-90">Saturday, 2:00 PM GMT</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Business Q&A Session</h4>
                    <p className="text-sm opacity-90">Tuesday, 6:00 PM GMT</p>
                  </div>
                  <Link href="/community/events" className="block text-center mt-4 bg-white/20 backdrop-blur py-2 rounded-lg hover:bg-white/30 transition-colors">
                    View All Events →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map(category => (
              <Link key={category.id} href={`/community/categories/${category.id}`}>
                <div className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-hover transition-shadow cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h3>
                      <p className="text-gray-600 mb-3">{category.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{category.topics} topics</span>
                        <span>•</span>
                        <span>{category.posts} posts</span>
                      </div>
                      {category.lastPost && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600">
                            Latest: <span className="font-medium text-gray-900">{category.lastPost.title}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            by {category.lastPost.author} • {formatTimeAgo(category.lastPost.timestamp)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-2xl font-bold mb-6">Community Members</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                  <h4 className="font-medium">Member {index + 1}</h4>
                  <p className="text-sm text-gray-600">
                    {index % 3 === 0 ? 'Baker' : 'Customer'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-2xl font-bold mb-6">Community Events</h2>
            <div className="space-y-6">
              {[
                {
                  title: 'Virtual Cake Decorating Workshop',
                  date: 'Saturday, March 23',
                  time: '2:00 PM - 4:00 PM GMT',
                  host: 'Chef Sarah Williams',
                  description: 'Learn advanced buttercream techniques in this hands-on virtual workshop',
                  attendees: 45
                },
                {
                  title: 'Business Growth Masterclass',
                  date: 'Tuesday, March 26',
                  time: '6:00 PM - 7:30 PM GMT',
                  host: 'Business Expert James Chen',
                  description: 'Strategies for scaling your home bakery business',
                  attendees: 78
                },
                {
                  title: 'Monthly Cake Challenge',
                  date: 'April 1-30',
                  time: 'All month',
                  host: 'Cakez Community',
                  description: 'Theme: Spring Garden Cakes - prizes for top 3 entries!',
                  attendees: 234
                }
              ].map((event, index) => (
                <div key={index} className="border-b pb-6 last:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p className="flex items-center gap-2">
                          <span>📅</span> {event.date}
                        </p>
                        <p className="flex items-center gap-2">
                          <span>⏰</span> {event.time}
                        </p>
                        <p className="flex items-center gap-2">
                          <span>👤</span> Hosted by {event.host}
                        </p>
                      </div>
                      <p className="text-gray-700 mb-4">{event.description}</p>
                      <div className="flex items-center gap-4">
                        <button className="btn-primary text-sm">
                          Register Now
                        </button>
                        <span className="text-sm text-gray-600">
                          {event.attendees} attending
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

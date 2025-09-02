'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

interface FellowshipEvent {
  id: string
  title: string
  description: string | null
  event_type: string
  start_time: string
  end_time: string
  max_participants: number | null
  is_public: boolean
  created_by: string
}

interface PrayerRequest {
  id: string
  title: string
  description: string | null
  is_anonymous: boolean
  created_by: string
  created_at: string
}

export default function FellowshipDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [events, setEvents] = useState<FellowshipEvent[]>([])
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const supabase = createClient()

  const fetchEvents = useCallback(async () => {
    const { data } = await supabase
      .from('fellowship_events')
      .select('*')
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(5)

    if (data) setEvents(data)
  }, [supabase])

  const fetchPrayerRequests = useCallback(async () => {
    const { data } = await supabase
      .from('prayer_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (data) setPrayerRequests(data)
  }, [supabase])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        await Promise.all([
          fetchEvents(),
          fetchPrayerRequests()
        ])
      }
      setLoading(false)
    }

    getUser()
  }, [fetchEvents, fetchPrayerRequests, supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading fellowship...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Fellowship Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'events', name: 'Fellowship Events' },
              { id: 'bible', name: 'Bible Study' },
              { id: 'prayer', name: 'Prayer Requests' },
              { id: 'community', name: 'Community' },
              { id: 'profile', name: 'Profile' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upcoming Fellowship Events
              </h2>
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {new Date(event.start_time).toLocaleDateString()} at{' '}
                        {new Date(event.start_time).toLocaleTimeString()}
                      </p>
                      {event.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{event.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No upcoming events</p>
              )}
              <Link
                href="/fellowship/events"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                View All Events
              </Link>
            </div>

            {/* Recent Prayer Requests */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Prayer Requests
              </h2>
              {prayerRequests.length > 0 ? (
                <div className="space-y-4">
                  {prayerRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">{request.title}</h3>
                      {request.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{request.description}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No recent prayer requests</p>
              )}
              <Link
                href="/fellowship/prayer"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                View All Requests
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href="/fellowship/events/create"
                  className="block w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Create Fellowship Event
                </Link>
                <Link
                  href="/fellowship/prayer/create"
                  className="block w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Submit Prayer Request
                </Link>
                <Link
                  href="/bible/study"
                  className="block w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Start Bible Study
                </Link>
                <Link
                  href="/community/chat"
                  className="block w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Join Live Chat
                </Link>
              </div>
            </div>

            {/* Fellowship Stats */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Fellowship Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {events.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Upcoming Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {prayerRequests.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Prayer Requests</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Fellowship Events
              </h2>
              <Link
                href="/fellowship/events/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Event
              </Link>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Event management features coming soon...
            </p>
          </div>
        )}

        {activeTab === 'bible' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Bible Study Tools
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Bible study features coming soon...
            </p>
          </div>
        )}

        {activeTab === 'prayer' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Prayer Requests
              </h2>
              <Link
                href="/fellowship/prayer/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit Request
              </Link>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Prayer request features coming soon...
            </p>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Community Discussion
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Community features coming soon...
            </p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Settings
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Profile management features coming soon...
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

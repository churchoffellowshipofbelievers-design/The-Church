'use client'

import { useState } from 'react'

export default function CommunitySection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "House Fellowship Leader",
      text: "Discovering New Testament fellowship principles transformed how we gather. Now everyone participates, everyone serves, and we experience authentic community.",
      location: "Austin, TX"
    },
    {
      name: "David Chen",
      role: "Small Group Facilitator", 
      text: "The priesthood of all believers concept opened my eyes. We don&apos;t need human mediators - Christ is our only mediator. This has revolutionized our worship.",
      location: "Seattle, WA"
    },
    {
      name: "Maria Rodriguez",
      role: "New Believer",
      text: "As a new Christian, I was confused by different church models. Learning about early church practices gave me clarity on what biblical fellowship should look like.",
      location: "Miami, FL"
    },
    {
      name: "Michael Thompson",
      role: "Bible Study Leader",
      text: "Participatory worship has brought such life to our gatherings. When everyone contributes according to their gifts, the Spirit moves in powerful ways.",
      location: "Nashville, TN"
    }
  ]

  const stats = [
    { number: "500+", label: "Active Members" },
    { number: "25", label: "House Fellowships" },
    { number: "12", label: "Cities" },
    { number: "100%", label: "Biblical Focus" }
  ]

  const findLocalFellowship = () => {
    alert('Find Local Fellowship feature coming soon! We&apos;re working on connecting believers in your area.')
  }

  const startOnlineDiscussion = () => {
    alert('Online Discussion feature coming soon! Join our forum at forum.thechurch.com')
  }

  return (
    <section id="community" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect with believers who are committed to living out New Testament fellowship principles in authentic community.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">
            What Our Community Says
          </h3>
          
          <div className="relative">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <blockquote className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 italic mb-6">
                  &ldquo;{testimonials[activeTestimonial].text}&rdquo;
                </blockquote>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-lg">
                    {testimonials[activeTestimonial].name.charAt(0)}
                  </div>
                  <div className="ml-4 text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {testimonials[activeTestimonial].role}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {testimonials[activeTestimonial].location}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === activeTestimonial
                      ? 'bg-blue-600 dark:bg-blue-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Community Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Local Fellowships
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with believers in your area for regular fellowship and mutual encouragement.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Study Resources
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access comprehensive materials on New Testament fellowship principles and practices.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Online Discussion
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Join thoughtful conversations about biblical fellowship and community building.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-semibold mb-4">
              Ready to Join Our Community?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Take the first step toward authentic New Testament fellowship. Connect with believers who share your passion for biblical community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={findLocalFellowship}
                className="inline-flex items-center px-6 py-3 text-base font-medium rounded-full bg-white text-blue-600 hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Find Local Fellowship
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button 
                onClick={startOnlineDiscussion}
                className="inline-flex items-center px-6 py-3 text-base font-medium rounded-full border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Start Online Discussion
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

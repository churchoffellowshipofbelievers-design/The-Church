'use client'

import Link from 'next/link'

export default function Hero() {
  const scrollToPrinciples = () => {
    const element = document.querySelector('#principles')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight mb-6">
            Fellowship of the{' '}
            <span className="text-blue-600 dark:text-blue-400">Believers</span>
          </h1>
          
          <div className="mb-8">
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 italic mb-2 max-w-4xl mx-auto leading-relaxed">
              &ldquo;For where two or three gather in my name, there am I with them.&rdquo;
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              — Matthew 18:20
            </p>
          </div>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Discover authentic New Testament fellowship principles. Learn about the priesthood of all believers, 
            participatory worship, and biblical community as practiced in the early church.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={scrollToPrinciples}
              className="inline-flex items-center px-8 py-4 text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Explore Fellowship Principles
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <Link 
              href="/register"
              className="inline-flex items-center px-8 py-4 text-base font-medium rounded-full text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Join Our Community
            </Link>
          </div>

          {/* Authentication buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/login"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-full text-white bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign In
            </Link>
            <Link 
              href="/register"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-full text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Create Account
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Biblical</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Founded on New Testament principles</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Community</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Authentic fellowship and connection</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Equality</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Priesthood of all believers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-64 right-1/4 w-80 h-80 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-20"></div>
      </div>
    </section>
  )
}

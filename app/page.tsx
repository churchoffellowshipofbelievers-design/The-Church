export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-apple-dark font-sf">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 bg-white/80 dark:bg-apple-dark/80 border-b border-gray-200 dark:border-apple-dark-tertiary flex justify-between items-center">
        <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
          The Church
        </div>
        <div className="space-x-6 text-sm">
          <a
            href="#home"
            className="text-gray-700 dark:text-gray-300 hover:text-primary-600"
          >
            Home
          </a>
          <a
            href="#fellowship"
            className="text-gray-700 dark:text-gray-300 hover:text-primary-600"
          >
            Fellowship
          </a>
          <a
            href="#principles"
            className="text-gray-700 dark:text-gray-300 hover:text-primary-600"
          >
            Principles
          </a>
          <a
            href="#community"
            className="text-gray-700 dark:text-gray-300 hover:text-primary-600"
          >
            Community
          </a>
          <a
            href="#contact"
            className="text-gray-700 dark:text-gray-300 hover:text-primary-600"
          >
            Contact
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-center"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Fellowship of the{" "}
          <span className="block text-primary-600 dark:text-primary-400">
            Believers
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 italic mb-2">
          &quot;For where two or three gather in my name, there am I with
          them.&quot;
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          — Matthew 18:20
        </p>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-12">
          Discover authentic New Testament fellowship principles. Learn about
          the priesthood of all believers, participatory worship, and biblical
          community as practiced in the early church.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="inline-flex items-center px-8 py-4 text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            Explore Fellowship Principles
          </button>
          <button className="inline-flex items-center px-8 py-4 text-base font-medium rounded-full text-primary-600 dark:text-primary-400 bg-white dark:bg-apple-dark-secondary border border-primary-200 dark:border-primary-800 hover:bg-gray-50 dark:hover:bg-apple-dark-tertiary">
            Join Our Community
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="principles"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-apple-dark-secondary"
      >
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Biblical Fellowship Principles
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the foundational principles that guided the early church
            and continue to shape authentic Christian community today.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-apple-dark rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-apple-dark-tertiary">
            <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
              New Testament Fellowship
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Experience authentic koinonia as practiced in the early church,
              based on Acts 2:42-47 principles of community life.
            </p>
          </div>
          <div className="bg-white dark:bg-apple-dark rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-apple-dark-tertiary">
            <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
              Priesthood of All Believers
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Every Christian has direct access to God through Christ, serving
              as part of the royal priesthood without human mediators.
            </p>
          </div>
          <div className="bg-white dark:bg-apple-dark rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-apple-dark-tertiary">
            <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
              Participatory Worship
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Spirit-led gatherings where everyone contributes to mutual
              edification, following the pattern of 1 Corinthians 14:26.
            </p>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section
        id="community"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-apple-dark-secondary"
      >
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Join Our Global Community
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect with believers worldwide who are passionate about authentic
            New Testament fellowship. Experience the joy of true Christian
            community.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-apple-dark rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-apple-dark-tertiary">
            <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
              Live Fellowship Gatherings
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Join scheduled online fellowship meetings where believers gather
              to pray, share, and encourage one another in real-time.
            </p>
          </div>
          <div className="bg-white dark:bg-apple-dark rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-apple-dark-tertiary">
            <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
              Prayer Request Network
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Share prayer needs and pray for others in our community.
              Experience the power of united prayer and mutual support.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-apple-dark border-t border-gray-100 dark:border-apple-dark-tertiary py-12 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            The Church
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Fellowship of the Believers
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
            Rediscovering authentic New Testament fellowship principles for
            genuine Christian community.
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400 italic mb-4">
            &quot;For where two or three gather in my name, there am I with
            them.&quot; - Matthew 18:20
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            © 2025 The Church - Fellowship of the Believers.
          </div>
        </div>
      </footer>
    </div>
  );
}

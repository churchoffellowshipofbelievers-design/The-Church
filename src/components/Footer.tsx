'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const handleLinkClick = (linkName: string) => {
    switch (linkName) {
      case 'Contact Us':
        alert('Contact us at fellowship@thechurch.com or call (555) 123-4567')
        break
      case 'Privacy Policy':
        alert('Privacy Policy: We respect your privacy and never share your information with third parties.')
        break
      case 'Study Materials':
        alert('Study Materials: Access our comprehensive library at resources.thechurch.com')
        break
      case 'Discussion Forums':
        alert('Discussion Forums: Join our online community at forum.thechurch.com')
        break
      case 'Prayer Requests':
        alert('Prayer Requests: Submit your prayer requests at prayers.thechurch.com')
        break
      default:
        alert(`${linkName} feature coming soon!`)
    }
  }

  const handleSocialClick = (platform: string) => {
    switch (platform) {
      case 'email':
        window.open('mailto:fellowship@thechurch.com', '_blank')
        break
      case 'twitter':
        window.open('https://twitter.com/thechurchfellowship', '_blank')
        break
      case 'facebook':
        window.open('https://facebook.com/thechurchfellowship', '_blank')
        break
      default:
        alert(`${platform} link coming soon!`)
    }
  }

  const footerLinks = {
    fellowship: [
      { name: 'House Fellowship', href: '#' },
      { name: 'Participatory Worship', href: '#' },
      { name: 'Biblical Leadership', href: '#' },
      { name: 'Community Guidelines', href: '#' }
    ],
    resources: [
      { name: 'Study Materials', href: '#' },
      { name: 'Scripture References', href: '#' },
      { name: 'Discussion Forums', href: '#' },
      { name: 'Prayer Requests', href: '#' }
    ],
    about: [
      { name: 'Our Mission', href: '#' },
      { name: 'Biblical Foundation', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Privacy Policy', href: '#' }
    ]
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="text-2xl font-bold text-white">
                The Church
              </div>
              <div className="text-sm text-gray-400">
                Fellowship of the Believers
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Dedicated to restoring biblical understanding of Christian fellowship as demonstrated in the New Testament.
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
              &ldquo;For where two or three gather in my name, there am I with them.&rdquo; - Matthew 18:20
            </div>
          </div>

          {/* Fellowship Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Fellowship
            </h3>
            <ul className="space-y-2">
              {footerLinks.fellowship.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.name)}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.name)}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              About
            </h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.name)}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © {currentYear} The Church - Fellowship of the Believers. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <button
                onClick={() => handleSocialClick('email')}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Email"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </button>
              <button
                onClick={() => handleSocialClick('twitter')}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button
                onClick={() => handleSocialClick('facebook')}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scripture Reference */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 italic">
            &ldquo;All glory and honor to Jesus Christ, our Lord and Savior&rdquo;
          </p>
        </div>
      </div>
    </footer>
  )
}

import React from 'react'

const FooterBottom = () => {
  return (
    <div>
        {/* Bottom Bar: Copyright and Policy Links */}
      <div className="bg-gray-800 py-4 px-4 text-sm text-gray-400">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            Copyright © 2023 E-Shop. All Rights Reserved.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <span className="text-gray-600">|</span>
            <a href="#" className="hover:text-white transition-colors duration-200">Terms & Condition</a>
            <span className="text-gray-600">|</span>
            <a href="#" className="hover:text-white transition-colors duration-200">Sitemap</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterBottom
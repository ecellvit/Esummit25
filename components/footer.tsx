'use client';
import React from 'react';

import PhoneIcon from '../assets/phoneicon';
import MailIcon from '../assets/mailicon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-600 to-purple-800 text-white pt-12 pb-6" id="footer">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-start px-4 sm:px-8">
        {/* Left Section - Contact Info */}
        <div className="w-full md:w-[45%] text-center md:text-left mb-8 md:mb-0">
          <h1
            className="text-4xl font-bold leading-tight mb-4"
            style={{ fontFamily: "'Almarai', sans-serif" }}
          >
            E-CELL
          </h1>
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5 text-white" />
              <a href="tel:+91 87777 93331" className="text-lg hover:text-gray-300 transition-colors">+91 87777 93331</a>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon className="h-5 w-5 text-white" />
              <a href="mailto:helloecellvit@gmail.com" className="text-lg hover:text-gray-300 transition-colors">helloecellvit@gmail.com</a>
            </div>
          </div>
        </div>

        {/* Right Section - About E-Cell */}
        <div className="w-full md:w-[45%] text-center md:text-left mb-8 md:mb-0">
          <p className="text-lg text-gray-300 leading-relaxed">
            The Entrepreneurship Cell, VIT Vellore.
          </p>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="flex flex-wrap justify-center gap-10 mb-6">
        {[
          { platform: 'Instagram', url: 'https://www.instagram.com/ecell_vit/', description: 'Stay up to Date' },
          { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/ecellvitvellore', description: 'Let’s connect' },
          { platform: 'YouTube', url: 'https://www.youtube.com/@e-cellvit7216', description: 'Learn with us' },
          { platform: 'Twitter', url: 'https://twitter.com/ecell_vit', description: 'Ideas in real time' },
        ].map(({ platform, url, description }) => (
          <div key={platform} className="w-[18vw] max-w-[250px] flex flex-col items-center">
            <div
              className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500"
              style={{ fontFamily: "'Freeman', sans-serif" }}
            >
              {platform}
            </div>
            <div className="flex flex-col items-center border-2 border-white rounded-xl w-full p-4">
              <a
                href={url}
                className="text-white text-sm text-center hover:text-gray-400 mb-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {description}
              </a>
              <a
                href={url}
                className="p-2 border-2 border-white rounded-xl text-white hover:bg-white hover:text-purple-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">{platform} link</span>
                {/* Add an appropriate icon here (optional) */}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-sm text-gray-300 py-4">
        <p>&copy; {new Date().getFullYear()} E-Cell VIT. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

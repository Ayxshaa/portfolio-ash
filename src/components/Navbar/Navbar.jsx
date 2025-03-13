import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black bg-opacity-80 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Now using the jazz font class */}
          <div className="flex-shrink-0">
            <span className=" font-[JazzFont] tracking-widest text-white text-2xl animate-float">AYESHA</span>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8 ">
              {['Home', 'Gallery', 'Experience', 'About'].map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className={`text-sm font-[JazzFont] tracking-wider transition-colors duration-300 ${
                    index === 0 
                      ? 'text-white border-b border-purple-500 pb-1' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
          
          {/* Action Button */}
          <div className="hidden md:block">
            <Button variant="primary" size="medium">
              EXPLORE
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              <svg 
                className="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-95 backdrop-blur-md border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['Home', 'Gallery', 'Experience', 'About'].map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase()}`}
                className={`font-[JazzFont] block px-3 py-2 rounded-md text-base tracking-wider ${
                  index === 0 
                    ? 'text-white bg-gray-900 bg-opacity-40' 
                    : 'text-gray-300 hover:bg-gray-700 hover:bg-opacity-40 hover:text-white'
                }`}
              >
                {item.toUpperCase()}
              </a>
            ))}
            <div className="mt-4 px-3">
              <Button variant="primary" size="medium" className="w-full">
                EXPLORE
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
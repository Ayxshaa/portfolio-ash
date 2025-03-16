import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hideNavbar, setHideNavbar] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > prevScrollY && currentScrollY > 50) {
        setHideNavbar(true);
      } else {
        setHideNavbar(false);
      }

      setPrevScrollY(currentScrollY);

      setScrolled(currentScrollY > 10);
      const sections = ["home", "projects", "about"];
      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    scroller.scrollTo(id, {
      duration: 800,
      smooth: "easeInOutQuad",
    });
    setActiveSection(id);
  };

  const goToGallery = () => {
    setMobileMenuOpen(false);
    navigate("/gallery");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent ${
        hideNavbar ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Name */}
          <div className="flex items-center space-x-3">
            <img src="./Gallery/myself.jpg" alt="Logo" className="h-12 w-12 mt-0.5 rounded-full" />
            <Link to="/" className="font-[JazzFont] tracking-widest text-white text-3xl animate-float">
              AYESHA
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex ml-auto">
            <div className="flex items-center space-x-8">
              {[{ name: "Home", id: "home" }, { name: "Projects", id: "projects" }, { name: "About", id: "about" }].map(
                (item, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-sm font-[JazzFont] tracking-wider transition-colors duration-300 ${
                      activeSection === item.id
                        ? "text-white border-b border-purple-500 pb-1"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.name.toUpperCase()}
                  </button>
                )
              )}
              <button
                onClick={goToGallery}
                className="text-sm font-[JazzFont] tracking-wider text-gray-300 hover:text-white transition-colors duration-300"
              >
                GALLERY
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            {[{ name: "Home", id: "home" }, { name: "Projects", id: "projects" }, { name: "About", id: "about" }].map(
              (item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-[JazzFont] tracking-wider text-gray-300 hover:bg-gray-700 hover:bg-opacity-40 hover:text-white"
                >
                  {item.name.toUpperCase()}
                </button>
              )
            )}
            <button
              onClick={goToGallery}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-[JazzFont] tracking-wider text-gray-300 hover:bg-gray-700 hover:bg-opacity-40 hover:text-white"
            >
              GALLERY
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

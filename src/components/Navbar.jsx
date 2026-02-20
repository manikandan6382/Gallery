import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function Navbar({ currentPage, onNavigate, userEmail, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Initial animation
    gsap.fromTo(navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const handleLogout = () => {
    gsap.to(navRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onLogout
    });
  };

  return (
    <nav
      ref={navRef}
      className={`github-navbar transition-all duration-300 ${
        isScrolled ? 'bg-github-secondary/95 shadow-lg' : 'bg-github-secondary/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Premium Logo */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 rounded-xl mr-3 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-purple-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-md -z-10 scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h1 className="text-xl font-bold text-github-primary bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Gallery
              </h1>
            </div>

            {/* Modern Navigation */}
            <div className="hidden md:flex space-x-2">
              <button
                onClick={() => onNavigate('gallery')}
                className={`group relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  currentPage === 'gallery'
                    ? 'text-white'
                    : 'text-github-secondary hover:text-github-primary'
                }`}
              >
                {/* Active background */}
                {currentPage === 'gallery' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg shadow-purple-500/30"></div>
                )}
                
                {/* Content */}
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Gallery
                </span>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-github-tertiary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </button>

              <button
                onClick={() => onNavigate('wishlist')}
                className={`group relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  currentPage === 'wishlist'
                    ? 'text-white'
                    : 'text-github-secondary hover:text-github-primary'
                }`}
              >
                {/* Active background */}
                {currentPage === 'wishlist' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl shadow-lg shadow-pink-500/30"></div>
                )}
                
                {/* Content */}
                <span className="relative z-10 flex items-center gap-2">
                  <div className="relative">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {/* Wishlist count badge */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                  </div>
                  Wishlist
                </span>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-github-tertiary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </button>
            </div>
          </div>

          {/* Premium User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <span className="text-sm text-github-secondary">{userEmail}</span>
                <div className="text-xs text-github-muted">Premium User</div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="github-btn secondary px-4 py-2 text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="github-btn secondary p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-github mt-2 pt-2">
          <div className="flex space-x-2">
            <button
              onClick={() => onNavigate('gallery')}
              className={`flex-1 px-3 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                currentPage === 'gallery'
                  ? 'text-white'
                  : 'text-github-secondary hover:text-github-primary'
              }`}
            >
              {currentPage === 'gallery' && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl"></div>
              )}
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Gallery
              </span>
            </button>
            
            <button
              onClick={() => onNavigate('wishlist')}
              className={`flex-1 px-3 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                currentPage === 'wishlist'
                  ? 'text-white'
                  : 'text-github-secondary hover:text-github-primary'
              }`}
            >
              {currentPage === 'wishlist' && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl"></div>
              )}
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                Wishlist
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

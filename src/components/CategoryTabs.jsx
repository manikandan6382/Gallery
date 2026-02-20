import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function CategoryTabs({ categories, activeCategory, onCategoryChange }) {
  const tabsRef = useRef(null);

  useEffect(() => {
    // Animate tabs on mount
    if (tabsRef.current) {
      gsap.fromTo(tabsRef.current.children,
        { opacity: 0, y: 10 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out"
        }
      );
    }
  }, []);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'anime':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10 5z" fill="url(#anime-gradient)" opacity="0.8"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="url(#anime-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="anime-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6"/>
                <stop offset="100%" stopColor="#ec4899"/>
              </linearGradient>
            </defs>
          </svg>
        );
      case 'music':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M9 18V5l12-2v13" stroke="url(#music-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6" cy="18" r="3" fill="url(#music-gradient)"/>
            <circle cx="18" cy="16" r="3" fill="url(#music-gradient)"/>
            <defs>
              <linearGradient id="music-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6"/>
                <stop offset="100%" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
        );
      case 'city':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M3 12l2-2m0 0l7-7 7 7m5-5v6m0 0l-2-2m2 2l-2-2m-2 12h14M5 10h14a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v3a1 1 0 001 1z" stroke="url(#city-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 21v-4m0 0l2-2m-2 2l2-2m4 4v-4m0 0l2-2m-2 2l2-2" stroke="url(#city-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="city-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981"/>
                <stop offset="100%" stopColor="#3b82f6"/>
              </linearGradient>
            </defs>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <div 
        ref={tabsRef}
        className="inline-flex items-center p-1 bg-github-tertiary rounded-xl border border-github"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`relative px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeCategory === category
                ? 'text-white'
                : 'text-github-secondary hover:text-github-primary'
            }`}
          >
            {/* Active indicator */}
            {activeCategory === category && (
              <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-blue rounded-lg shadow-lg shadow-purple-500/25"></div>
            )}
            
            {/* Content */}
            <span className="relative z-10 capitalize flex items-center gap-2">
              {getCategoryIcon(category)}
              {category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryTabs;
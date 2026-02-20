import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    // Load wishlist from localStorage
    const loadWishlist = () => {
      try {
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlist(savedWishlist);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadWishlist();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('wishlistUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlistUpdated', handleStorageChange);
    };
  }, []);

  // Hero section animation
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(heroRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  // Grid items animation
  useEffect(() => {
    if (wishlist.length > 0 && gridRef.current) {
      gsap.fromTo(gridRef.current.children,
        { opacity: 0, y: 30, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      );
    }
  }, [wishlist]);

  const removeFromWishlist = (imageId) => {
    const updatedWishlist = wishlist.filter(item => item.id !== imageId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    // Animate removal
    gsap.to(`[data-wishlist-id="${imageId}"]`, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      }
    });
  };

  const clearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      setWishlist([]);
      localStorage.removeItem('wishlist');
      
      // Animate all items disappearing
      gsap.to(gridRef.current?.children || [], {
        opacity: 0,
        y: -50,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.in",
        onComplete: () => {
          window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen github-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Skeleton */}
          <div className="text-center mb-12">
            <div className="h-12 bg-github-tertiary rounded-lg w-64 mx-auto mb-4 shimmer"></div>
            <div className="h-6 bg-github-tertiary rounded-lg w-96 mx-auto shimmer"></div>
          </div>
          
          {/* Loading skeleton */}
          <div className="github-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="github-card">
                <div className="w-full aspect-video bg-github-tertiary rounded-lg border border-github mb-4 shimmer"></div>
                <div className="h-5 bg-github-tertiary rounded-md mb-2 shimmer"></div>
                <div className="h-3 bg-github-tertiary rounded w-3/4 shimmer"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen github-scrollbar">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-github-primary mb-4">
              <span className="gradient-text">My Wishlist</span>
            </h1>
            <p className="text-lg text-github-secondary max-w-2xl mx-auto mb-8">
              {wishlist.length} {wishlist.length === 1 ? 'image' : 'images'} saved to your collection
            </p>
            
            {wishlist.length > 0 && (
              <button
                onClick={clearWishlist}
                className="github-btn text-red-400 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-github-tertiary rounded-full mb-6">
              <span className="text-2xl">💔</span>
            </div>
            <h3 className="text-2xl font-semibold text-github-primary mb-4">Your wishlist is empty</h3>
            <p className="text-github-secondary text-center mb-8 max-w-md">
              Start adding images to your wishlist by clicking the heart icon on any gallery image.
            </p>
            <div className="github-card p-6 max-w-md mx-auto">
              <h4 className="text-accent-purple font-semibold mb-3">How to add to wishlist:</h4>
              <ul className="text-github-secondary space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-accent-purple mt-1">•</span>
                  <span>Browse the gallery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-purple mt-1">•</span>
                  <span>Click the heart icon (🤍) on any image</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-purple mt-1">•</span>
                  <span>The heart will turn red (❤️) when added</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-purple mt-1">•</span>
                  <span>View all saved images here</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div ref={gridRef} className="github-grid">
            {wishlist.map((image) => (
              <div
                key={image.id}
                data-wishlist-id={image.id}
                className="github-card relative group"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeFromWishlist(image.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-github-secondary border border-github flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-red-500/10 hover:border-red-500/50 group"
                >
                  <span className="text-red-400 text-sm">❌</span>
                </button>

                {/* Image */}
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-github-tertiary border border-github mb-4">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%2321262d"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23c9d1d9" font-family="Arial" font-size="20"%3EImage not available%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-github-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-github-primary text-base font-semibold group-hover:text-accent-purple transition-colors duration-200 line-clamp-1">
                    {image.title}
                  </h3>
                  {image.description && (
                    <p className="text-github-secondary text-sm line-clamp-2">{image.description}</p>
                  )}
                </div>

                {/* View in gallery button */}
                <button className="github-btn primary w-full py-2 text-sm font-medium mt-4">
                  View in Gallery
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default WishlistPage;

import { useState, memo, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import PropTypes from 'prop-types';

const GalleryCard = memo(function GalleryCard({ image, onEdit, onDelete, isDeleting }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef(null);
  const heartRef = useRef(null);
  const imgRef = useRef(null);

  // Check if image is in wishlist on mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(wishlist.some(item => item.id === image.id));
  }, [image.id]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Smooth hover animations with GSAP
  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { 
      scale: 1.02, 
      duration: 0.25, 
      ease: "power2.out",
      boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { 
      scale: 1, 
      duration: 0.25, 
      ease: "power2.out",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)"
    });
  };

  // Toggle wishlist with heart animation
  const toggleWishlist = (e) => {
    e.stopPropagation();
    setHeartAnimating(true);
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isWishlisted) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter(item => item.id !== image.id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsWishlisted(false);
    } else {
      // Add to wishlist
      const updatedWishlist = [...wishlist, image];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsWishlisted(true);
    }
    
    // Reset heart animation
    setTimeout(() => setHeartAnimating(false), 800);
  };

  return (
    <div 
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="github-card relative group cursor-pointer"
      style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)' }}
    >
      {/* Wishlist Heart Button */}
      <button
        ref={heartRef}
        onClick={toggleWishlist}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-github-secondary border border-github flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-github-tertiary ${
          isWishlisted ? 'text-red-500' : 'text-github-muted'
        }`}
      >
        <span className={`text-sm ${heartAnimating ? 'heart-animate' : ''}`}>
          {isWishlisted ? '❤️' : '🤍'}
        </span>
      </button>

      {/* Image Container with 16:9 aspect ratio */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-github-tertiary border border-github mb-4">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-github-muted border-t-accent-purple rounded-full loading-spin"></div>
          </div>
        )}
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-github-muted">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Image failed to load</p>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={isInView ? image.url : undefined}
            alt={image.title}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoading ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
            }`}
          />
        )}
        
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

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(image)}
          disabled={isDeleting}
          className="github-btn primary flex-1 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(image.id)}
          disabled={isDeleting}
          className="github-btn flex-1 py-2 text-sm font-medium text-red-400 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isDeleting ? (
            <>
              <div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full loading-spin mr-2"></div>
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  )
});

GalleryCard.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
};

export default GalleryCard;
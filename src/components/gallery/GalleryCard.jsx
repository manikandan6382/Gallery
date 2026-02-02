import { useState, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';

const GalleryCard = memo(function GalleryCard({ image, onEdit, onDelete, isDeleting }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef(null);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Hover animations (lighter)
  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { scale: 1.02, duration: 0.2, ease: "power1.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { scale: 1, duration: 0.2, ease: "power1.out" });
  };

  return (
    <div 
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700 rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 relative"
    >
      <div className="relative w-full h-48 rounded-lg border border-gray-700 overflow-hidden bg-gray-800">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          </div>
        )}
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <div className="text-4xl mb-2">🖼️</div>
            <p className="text-sm">Image failed to load</p>
          </div>
        ) : (
          <img
            src={image.url}
            alt={image.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}
      </div>
      <h3 className="text-white text-lg font-semibold mt-2">{image.title}</h3>
      <p className="text-gray-300 text-sm mt-1">{image.description}</p>
      <div className="flex gap-3 mt-3">
        <button
          onClick={() => onEdit(image)}
          disabled={isDeleting}
          className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-3 rounded-lg transition"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(image.id)}
          disabled={isDeleting}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center"
        >
          {isDeleting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
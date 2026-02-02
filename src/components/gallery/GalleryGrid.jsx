import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import GalleryCard from "./GalleryCard";
import SkeletonCard from '../SkeletonCard';

function GalleryGrid({ images, onEdit, onDelete, deletingId, onAddClick, onLoadMore, hasMore, loading }) {
  const gridRef = useRef(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  // Staggered animation for new cards (optimized)
  useEffect(() => {
    if (images && images.length > 0) {
      const cards = gridRef.current?.querySelectorAll('.gallery-card');
      if (cards) {
        // Only animate the last batch of cards (much faster)
        const lastBatch = Array.from(cards).slice(-9);
        if (lastBatch.length > 0) {
          gsap.fromTo(lastBatch, 
            { opacity: 0, y: 20 }, // Reduced animation distance
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.3, // Faster animation
              stagger: 0.02, // Less stagger delay
              ease: "power1.out" // Lighter easing
            }
          );
        }
      }
    }
  }, [images?.length]);

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">🖼️</div>
        <h3 className="text-2xl font-semibold text-white mb-2">No Images Yet</h3>
        <p className="text-gray-400 text-center mb-6 max-w-md">
          Your gallery is empty. Start by adding your first image to create your collection.
        </p>
        <button
          onClick={onAddClick}
          className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Add Your First Image
        </button>
      </div>
    )
  }

  return (
    <div>
      <div ref={gridRef} className="grid lg:grid-cols-3 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-6">
        {
          images.map((image) => (
            <div key={image.id} className="gallery-card">
              <GalleryCard
                image={image}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={deletingId === image.id}
              />
            </div>
          ))
        }
      </div>

      {/* Loading indicator with skeleton cards */}
      {hasMore && (
        <div className="col-span-full">
          <div 
            ref={loadingRef}
            className="flex justify-center items-center py-4"
          >
            {loading ? (
              <div className="flex items-center gap-3 text-gray-400">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-500"></div>
                <span>Loading more...</span>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Scroll for more</div>
            )}
          </div>
          
          {/* Skeleton cards while loading */}
          {loading && (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 mt-6">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={`skeleton-${i}`} />
              ))}
            </div>
          )}
        </div>
      )}

      {!hasMore && images.length > 9 && (
        <div className="text-center py-8 text-gray-400">
          You've reached the end! 🎉
        </div>
      )}
    </div>
  );
}

export default GalleryGrid;
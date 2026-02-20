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

  // Smooth staggered animation for new cards
  useEffect(() => {
    if (images && images.length > 0) {
      const cards = gridRef.current?.querySelectorAll('.gallery-card');
      if (cards) {
        // Only animate the last batch of cards
        const lastBatch = Array.from(cards).slice(-9);
        if (lastBatch.length > 0) {
          gsap.fromTo(lastBatch, 
            { opacity: 0, y: 12 }, // Reduced distance
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.4, // Smooth duration
              stagger: 0.06, // Gentle stagger
              ease: "power2.out" // Professional easing
            }
          );
        }
      }
    }
  }, [images?.length]);

  // Show skeletons only during initial load
  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        {/* Beautiful Icon Container */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
            <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full opacity-60"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full opacity-40"></div>
        </div>

        {/* Beautiful Typography */}
        <h3 className="text-3xl font-bold text-github-primary mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          No Images Yet
        </h3>
        <p className="text-github-secondary text-center mb-8 max-w-lg text-lg leading-relaxed">
          Your beautiful gallery is waiting for its first image. Start building your collection by adding your favorite moments.
        </p>

        {/* Informative Card */}
        <div className="github-card p-6 max-w-md mx-auto mb-8 border-purple-500/30">
          <h4 className="text-purple-400 font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Quick Start Guide
          </h4>
          <ul className="text-github-secondary space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-0.5">1.</span>
              <span>Click the button below to add your first image</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-0.5">2.</span>
              <span>Enter a title and image URL</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-0.5">3.</span>
              <span>Save and watch your gallery come to life</span>
            </li>
          </ul>
        </div>

        {/* Beautiful Gradient CTA Button */}
        <button
          onClick={onAddClick}
          className="github-btn px-8 py-4 font-semibold text-lg flex items-center gap-3 shadow-lg shadow-purple-500/25"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Your First Image
        </button>

        {/* Subtle hint */}
        <p className="text-github-muted text-sm mt-4">
          Pro tip: You can also add images to your wishlist with the ❤️ icon
        </p>
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

      {/* Loading indicator with skeletons - only show when loading more */}
      {hasMore && (
        <div className="col-span-full">
          <div 
            ref={loadingRef}
            className="flex justify-center items-center py-8"
          >
            {loading ? (
              <div className="flex items-center gap-3 text-github-muted">
                <div className="w-4 h-4 border-2 border-github-muted border-t-accent-purple rounded-full loading-spin"></div>
                <span className="text-sm">Loading more...</span>
              </div>
            ) : (
              <div className="text-github-muted text-sm">Scroll for more</div>
            )}
          </div>
          
          {/* Skeleton cards while loading more - user-friendly placement */}
          {loading && (
            <div className="grid lg:grid-cols-3 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-6 mt-6">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={`skeleton-${i}`} />
              ))}
            </div>
          )}
        </div>
      )}

      {!hasMore && images.length > 9 && (
        <div className="text-center py-8 text-github-muted">
          <div className="flex items-center justify-center gap-2">
            <span>You've reached the end!</span>
            <span className="text-lg">🎉</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryGrid;
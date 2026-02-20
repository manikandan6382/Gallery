import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

function SkeletonCard() {
  const cardRef = useRef(null);

  useEffect(() => {
    // Subtle entrance animation for skeleton
    gsap.fromTo(cardRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
    );
  }, []);

  return (
    <div 
      ref={cardRef}
      className="github-card relative overflow-hidden"
    >
      {/* Skeleton Image */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-github-tertiary border border-github mb-4">
        <div className="absolute inset-0 shimmer"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-github-muted border-t-accent-purple rounded-full loading-spin"></div>
        </div>
      </div>

      {/* Skeleton Content */}
      <div className="space-y-3">
        {/* Title */}
        <div className="h-5 bg-github-tertiary rounded-md shimmer"></div>
        
        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-3 bg-github-tertiary rounded w-3/4 shimmer"></div>
          <div className="h-3 bg-github-tertiary rounded w-1/2 shimmer"></div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-github-tertiary rounded flex-1 shimmer"></div>
          <div className="h-8 bg-github-tertiary rounded w-8 shimmer"></div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-accent-purple rounded-full opacity-30"></div>
    </div>
  );
}

export default SkeletonCard;
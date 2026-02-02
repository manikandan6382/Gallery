import { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import GalleryCard from './GalleryCard';

function VirtualGalleryGrid({ images, onEdit, onDelete, deletingId, onAddClick }) {
  const containerRef = useRef(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 12 });
  const [containerHeight, setContainerHeight] = useState(600);

  const ITEM_HEIGHT = 420; // Card height + gap
  const ITEMS_PER_ROW = 3;
  const BUFFER_SIZE = 6; // Extra items to render

  // Calculate total height and visible items
  const totalRows = Math.ceil(images.length / ITEMS_PER_ROW);
  const totalHeight = totalRows * ITEM_HEIGHT;

  // Handle scroll to update visible range
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const containerHeight = e.target.clientHeight;
    
    const startRow = Math.floor(scrollTop / ITEM_HEIGHT);
    const endRow = Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT);
    
    const start = Math.max(0, (startRow - BUFFER_SIZE) * ITEMS_PER_ROW);
    const end = Math.min(images.length, (endRow + BUFFER_SIZE) * ITEMS_PER_ROW);
    
    setVisibleRange({ start, end });
  };

  // Get visible items
  const visibleItems = useMemo(() => {
    return images.slice(visibleRange.start, visibleRange.end);
  }, [images, visibleRange]);

  // Animation for visible items
  useEffect(() => {
    if (visibleItems.length > 0) {
      const cards = containerRef.current?.querySelectorAll('.gallery-card');
      if (cards) {
        gsap.fromTo(cards, 
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.4, 
            stagger: 0.05, 
            ease: "power2.out" 
          }
        );
      }
    }
  }, [visibleItems]);

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
    );
  }

  return (
    <div className="mb-4">
      <p className="text-gray-400 mb-4">
        Showing {visibleRange.end - visibleRange.start} of {images.length} images
      </p>
      
      <div 
        ref={containerRef}
        className="h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div 
            className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 absolute w-full"
            style={{ 
              transform: `translateY(${Math.floor(visibleRange.start / ITEMS_PER_ROW) * ITEM_HEIGHT}px)` 
            }}
          >
            {visibleItems.map((image, index) => (
              <div key={image.id} className="gallery-card">
                <GalleryCard
                  image={image}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isDeleting={deletingId === image.id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VirtualGalleryGrid;
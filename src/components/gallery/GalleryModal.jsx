import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function GalleryModal({ open, mode, formData, onChange, onSubmit, onClose, submitting }) {
    const modalRef = useRef(null);
    const backdropRef = useRef(null);
    
  // Modal animations
  useEffect(() => {
    if (open) {
      gsap.set(modalRef.current, { scale: 0.8, opacity: 0 });
      gsap.set(backdropRef.current, { opacity: 0 });
      
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.3 });
      gsap.to(modalRef.current, { 
        scale: 1, 
        opacity: 1, 
        duration: 0.4, 
        ease: "back.out(1.7)" 
      });
    }
  }, [open]);

  const handleClose = () => {
    gsap.to(modalRef.current, { 
      scale: 0.8, 
      opacity: 0, 
      duration: 0.3,
      ease: "power2.in"
    });
    gsap.to(backdropRef.current, { 
      opacity: 0, 
      duration: 0.3,
      onComplete: onClose
    });
  };
    
  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);
  
  if (!open) return null;

  return (
    <div ref={backdropRef} className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={handleClose}
      />

      <div ref={modalRef} className="relative bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">
          {mode === "add" ? "Add Image" : "Edit Image"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="Title"
            disabled={submitting}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
          />

          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={onChange}
            placeholder="Image URL"
            disabled={submitting}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Description"
            disabled={submitting}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
          />

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-400 disabled:cursor-not-allowed text-white py-2 rounded flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {mode === "add" ? "Adding..." : "Updating..."}
                </>
              ) : (
                mode === "add" ? "ADD" : "UPDATE"
              )}
            </button>

            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GalleryModal;

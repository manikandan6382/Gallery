import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function GalleryModal({ open, mode, formData, onChange, onSubmit, onClose, submitting }) {
    const modalRef = useRef(null);
    const backdropRef = useRef(null);
    const contentRef = useRef(null);
    
  // Smooth modal animations
  useEffect(() => {
    if (open) {
      gsap.set(modalRef.current, { scale: 0.95, opacity: 0, y: 10 });
      gsap.set(backdropRef.current, { opacity: 0 });
      
      gsap.to(backdropRef.current, { 
        opacity: 1, 
        duration: 0.25,
        ease: "power2.out"
      });
      
      gsap.to(modalRef.current, { 
        scale: 1, 
        opacity: 1, 
        y: 0,
        duration: 0.35, 
        ease: "power2.out",
        onComplete: () => {
          // Animate content after modal is in place
          if (contentRef.current) {
            gsap.fromTo(contentRef.current.children,
              { opacity: 0, y: 8 },
              { 
                opacity: 1, 
                y: 0, 
                duration: 0.25,
                stagger: 0.04,
                ease: "power2.out"
              }
            );
          }
        }
      });
    }
  }, [open]);

  const handleClose = () => {
    gsap.to(modalRef.current, { 
      scale: 0.95, 
      opacity: 0, 
      y: 10,
      duration: 0.25,
      ease: "power2.in"
    });
    gsap.to(backdropRef.current, { 
      opacity: 0, 
      duration: 0.2,
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
    <div ref={backdropRef} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="github-modal-backdrop absolute inset-0"
        onClick={handleClose}
      />

      <div 
        ref={modalRef}
        className="github-modal relative p-6 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-6" ref={contentRef}>
          <h2 className="text-xl font-semibold text-github-primary mb-2">
            {mode === "add" ? "Add New Image" : "Edit Image"}
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-purple to-accent-blue mx-auto rounded-full"></div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5" ref={contentRef}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-github-primary">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder="Enter image title"
              disabled={submitting}
              className="github-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-github-primary">
              Image URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={onChange}
              placeholder="https://example.com/image.jpg"
              disabled={submitting}
              className="github-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-github-primary">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Enter image description (optional)"
              disabled={submitting}
              className="github-input resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4" ref={contentRef}>
            <button
              type="submit"
              disabled={submitting}
              className="github-btn flex-1 py-2.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full loading-spin"></div>
                  <span>{mode === "add" ? "Adding..." : "Updating..."}</span>
                </div>
              ) : (
                mode === "add" ? "Add Image" : "Update Image"
              )}
            </button>

            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="github-btn secondary flex-1 py-2.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Decorative elements */}
        <div className="absolute top-3 right-3 w-2 h-2 bg-accent-purple rounded-full opacity-50"></div>
        <div className="absolute bottom-3 left-3 w-2 h-2 bg-accent-blue rounded-full opacity-50"></div>
      </div>
    </div>
  );
}

export default GalleryModal;

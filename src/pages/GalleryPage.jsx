
import { useState, useReducer, useEffect, useCallback, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CategoryTabs from '../components/CategoryTabs';
import GalleryGrid from '../components/gallery/GalleryGrid';
import GalleryModal from '../components/gallery/GalleryModal';
import SkeletonCard from '../components/SkeletonCard';
import galleryReducer, { ACTIONS, initialState } from '../reducers/galleryReducer';
import { fetchImages, uploadImage, deleteImage } from '../api/fakeGalleryApi';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function GalleryPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [activeCategory, setActiveCategory] = useState('anime');
    const [categories] = useState(['anime', 'music', 'city']);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        description: '',
    });
    const [state, dispatch] = useReducer(galleryReducer, initialState);
    const { images, selectedImage, mode } = state;

    // Refs for GSAP animations
    const heroRef = useRef(null);
    const heroTitleRef = useRef(null);
    const heroSubtitleRef = useRef(null);
    const statsRef = useRef(null);
    const containerRef = useRef(null);

    // Hero section animations - smooth and subtle
    useEffect(() => {
        if (!heroRef.current) return;

        // Hero title animation
        gsap.fromTo(heroTitleRef.current,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
        );

        // Hero subtitle animation
        gsap.fromTo(heroSubtitleRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power2.out" }
        );

        // Stats animation - very subtle
        gsap.fromTo(statsRef.current?.children,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, delay: 0.3, stagger: 0.05, ease: "power2.out" }
        );

        // Cleanup ScrollTrigger on unmount
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    // Show message helper with cleanup
    const showMessage = useCallback((text, type = 'success') => {
        setMessage({ text, type });
        const timeoutId = setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, 3000);
        
        return () => clearTimeout(timeoutId);
    }, []);

    // Form validation
    const validateForm = () => {
        if (!formData.title.trim()) {
            showMessage('Title is required', 'error');
            return false;
        }
        if (!formData.url.trim()) {
            showMessage('Image URL is required', 'error');
            return false;
        }
        try {
            new URL(formData.url);
        } catch {
            showMessage('Please enter a valid URL', 'error');
            return false;
        }
        return true;
    };

    // Load initial images
    useEffect(() => {
        async function loadInitialImages() {
            try {
                console.log('🚀 Loading initial 9 images for:', activeCategory);
                const data = await fetchImages(activeCategory, 1, 9);
                console.log('✅ Received data:', data.length, 'images');
                console.log('📷 Images:', data);
                dispatch({ type: ACTIONS.INIT, payload: data });
                setHasMore(data.length === 9);
                setCurrentPage(1);
            } catch (err) {
                console.error('❌ Failed to load images:', err);
                showMessage('Failed to load images. Please refresh the page.', 'error');
            } finally {
                setLoading(false);
            }
        }
        loadInitialImages();
    }, [showMessage, activeCategory]);

    // Load images when category changes
    useEffect(() => {
        if (loading) return;
        
        async function loadCategoryImages() {
            try {
                setLoading(true);
                console.log('🔄 Loading 9 images for category:', activeCategory);
                const data = await fetchImages(activeCategory, 1, 9);
                console.log('✅ Received data:', data.length, 'images');
                dispatch({ type: ACTIONS.INIT, payload: data });
                setHasMore(data.length === 9);
                setCurrentPage(1);
            } catch (err) {
                console.error('❌ Failed to load category images:', err);
                showMessage(`Failed to load ${activeCategory} images.`, 'error');
            } finally {
                setLoading(false);
            }
        }
        loadCategoryImages();
    }, [activeCategory, showMessage]);

    // Load more images for infinite scroll
    const handleLoadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        
        try {
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            console.log(`Loading more images: page ${nextPage} for ${activeCategory}`);
            const newImages = await fetchImages(activeCategory, nextPage, 9);
            console.log('Received new images:', newImages.length);
            
            if (newImages.length > 0) {
                dispatch({ type: ACTIONS.INIT, payload: [...images, ...newImages] });
                setCurrentPage(nextPage);
                setHasMore(newImages.length === 9);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            showMessage('Failed to load more images.', 'error');
        } finally {
            setLoadingMore(false);
        }
    }, [activeCategory, currentPage, images, loadingMore, hasMore]);

    // Category change handler
    const handleCategoryChange = useCallback((category) => {
        setActiveCategory(category);
    }, []);

    // Memoized handlers to prevent unnecessary re-renders
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const openAddModal = useCallback(() => {
        dispatch({ type: ACTIONS.SET_MODE, payload: 'add' });
        dispatch({ type: ACTIONS.SET_SELECTED_IMAGE, payload: null });
        setFormData({ title: '', url: '', description: '' });
        setIsModalOpen(true);
    }, []);

    const openEditModal = useCallback((image) => {
        dispatch({ type: ACTIONS.SET_MODE, payload: 'edit' });
        dispatch({ type: ACTIONS.SET_SELECTED_IMAGE, payload: image });
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    // Sync form data with selected image
    useEffect(() => {
        if (mode === 'edit' && selectedImage) {
            setFormData({
                title: selectedImage.title,
                url: selectedImage.url,
                description: selectedImage.description || '',
            });
        }
    }, [mode, selectedImage]);

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setSubmitting(true);
        try {
            if (mode === 'add') {
                const newImage = await uploadImage(activeCategory, formData);
                dispatch({ type: ACTIONS.ADD, payload: newImage });
                showMessage('Image added successfully!', 'success');
            } else {
                dispatch({
                    type: ACTIONS.UPDATE,
                    payload: { id: selectedImage.id, ...formData }
                });
                showMessage('Image updated successfully!', 'success');
            }
            setFormData({ title: '', url: '', description: '' });
            setIsModalOpen(false);
        } catch (err) {
            const action = mode === 'add' ? 'add' : 'update';
            showMessage(`Failed to ${action} image. Please try again.`, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Delete handler
    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteImage(id);
            dispatch({ type: ACTIONS.DELETE, payload: id });
            showMessage('Image deleted successfully!', 'success');
        } catch (err) {
            showMessage('Failed to delete image. Please try again.', 'error');
        } finally {
            setDeletingId(null);
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
                    
                    {/* Category Tabs Skeleton */}
                    <div className="flex gap-2 mb-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-10 w-24 bg-github-tertiary rounded-lg shimmer"></div>
                        ))}
                    </div>
                    
                    {/* Skeleton Grid */}
                    <div className="github-grid">
                        {[...Array(9)].map((_, i) => (
                            <SkeletonCard key={`initial-skeleton-${i}`} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div ref={containerRef} className="min-h-screen github-scrollbar">
            {/* Hero Section */}
            <section ref={heroRef} className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 ref={heroTitleRef} className="text-5xl md:text-6xl font-bold text-github-primary mb-6">
                            <span className="gradient-text">Modern Gallery</span>
                        </h1>
                        <p ref={heroSubtitleRef} className="text-xl text-github-secondary max-w-2xl mx-auto mb-8">
                            Discover and manage your image collection with GitHub-inspired design and smooth animations.
                        </p>
                        
                        {/* Stats */}
                        <div ref={statsRef} className="flex items-center justify-center gap-8 text-center">
                            <div className="github-card p-4 min-w-[120px]">
                                <div className="text-2xl font-bold gradient-text">{images.length}</div>
                                <div className="text-sm text-github-secondary">Images</div>
                            </div>
                            <div className="github-card p-4 min-w-[120px]">
                                <div className="text-2xl font-bold gradient-text">{categories.length}</div>
                                <div className="text-sm text-github-secondary">Categories</div>
                            </div>
                            <div className="github-card p-4 min-w-[120px]">
                                <div className="text-2xl font-bold gradient-text">
                                    {JSON.parse(localStorage.getItem('wishlist') || '[]').length}
                                </div>
                                <div className="text-sm text-github-secondary">Saved</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {/* Category Tabs */}
                <CategoryTabs 
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />
                
                {/* Gallery Grid */}
                <GalleryGrid 
                    images={images}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    deletingId={deletingId}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    loading={loadingMore}
                    onAddClick={openAddModal}
                />
                
                <div className="flex justify-center mt-12">
                    <button
                        onClick={openAddModal}
                        className="github-btn px-8 py-3 font-semibold"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Image
                        </span>
                    </button>
                </div>
                
                <GalleryModal
                    open={isModalOpen}
                    mode={mode}
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onClose={handleCloseModal}
                    submitting={submitting}
                />
            </section>
        </div>
    );
}

export default GalleryPage;
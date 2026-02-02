
import { useState, useReducer, useEffect, useCallback } from "react";
import CategoryTabs from '../components/CategoryTabs';
import GalleryGrid from '../components/gallery/GalleryGrid';
import GalleryModal from '../components/gallery/GalleryModal';
import SkeletonCard from '../components/SkeletonCard';
import galleryReducer, { ACTIONS, initialState } from '../reducers/galleryReducer';
import { fetchImages, uploadImage, deleteImage } from '../api/fakeGalleryApi';
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

    // Show message helper with cleanup
    const showMessage = useCallback((text, type = 'success') => {
        setMessage({ text, type });
        const timeoutId = setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, 3000);
        
        // Store timeout ID for cleanup
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
        // Basic URL validation
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
                console.log('Loading initial 9 images for:', activeCategory);
                const data = await fetchImages(activeCategory, 1, 9);
                console.log('Received data:', data.length, 'images');
                dispatch({ type: ACTIONS.INIT, payload: data });
                setHasMore(data.length === 9); // Has more if we got exactly 9
                setCurrentPage(1);
            } catch (err) {
                showMessage('Failed to load images. Please refresh the page.', 'error');
            } finally {
                setLoading(false);
            }
        }
        loadInitialImages();
    }, [showMessage]);

    // Load images when category changes
    useEffect(() => {
        if (loading) return; // Skip during initial load
        
        async function loadCategoryImages() {
            try {
                setLoading(true);
                console.log('Loading 9 images for category:', activeCategory);
                const data = await fetchImages(activeCategory, 1, 9);
                console.log('Received data:', data.length, 'images');
                dispatch({ type: ACTIONS.INIT, payload: data });
                setHasMore(data.length === 9);
                setCurrentPage(1);
            } catch (err) {
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
                setHasMore(newImages.length === 9); // Has more if we got exactly 9
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
            <div className="max-h-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 overflow-auto">
                <div className="max-w-7xl 2xl:max-w-8/10 mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-6">Gallery</h1>
                    
                    {/* Category Tabs Skeleton */}
                    <div className="flex gap-2 mb-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-12 w-20 bg-gray-700 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                    
                    {/* Skeleton Grid */}
                    <div className="grid lg:grid-cols-3 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-6">
                        {[...Array(9)].map((_, i) => (
                            <SkeletonCard key={`initial-skeleton-${i}`} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className="max-h-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 overflow-auto">
            <div className="max-w-7xl 2xl:max-w-8/10 mx-auto">
                <h1 className="text-4xl font-bold text-white mb-6">Gallery</h1>
                
                {/* Category Tabs */}
                {!loading && (
                    <CategoryTabs 
                        categories={categories}
                        activeCategory={activeCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                )}
                
                {/* Message Display */}
                {message.text && (
                    <div className={`mb-4 p-4 rounded-lg text-white font-semibold ${
                        message.type === 'error' 
                            ? 'bg-red-600' 
                            : 'bg-green-600'
                    }`}>
                        {message.text}
                    </div>
                )}
                
                <GalleryGrid
                    images={images}
                    onDelete={handleDelete}
                    onEdit={openEditModal}
                    onAddClick={openAddModal}
                    deletingId={deletingId}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    loading={loadingMore}
                />
                
                <button
                    onClick={openAddModal}
                    className="mt-6 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
                >
                    Add Image
                </button>
                
                <GalleryModal
                    open={isModalOpen}
                    mode={mode}
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onClose={handleCloseModal}
                    submitting={submitting}
                />
            </div>
        </div>
    );
}
export default GalleryPage
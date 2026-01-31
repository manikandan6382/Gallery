
import { useState, useReducer, useEffect, useCallback, useMemo } from "react";
import GalleryGrid from '../components/gallery/GalleryGrid';
import GalleryModal from '../components/gallery/GalleryModal';
import galleryReducer, { ACTIONS, initialState } from '../reducers/galleryReducer';
import { fetchImages, uploadImage, deleteImage } from '../api/fakeGalleryApi';
function GalleryPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
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

    // initial state
    useEffect(() => {
        async function loadImages() {
            try {
                const data = await fetchImages();
                dispatch({ type: ACTIONS.INIT, payload: data });
            } catch (err) {
                showMessage('Failed to load images. Please refresh the page.', 'error');
            } finally {
                setLoading(false);
            }
        }
        loadImages();
    }, [])
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
    useEffect(() => {
        if (mode === 'edit') {
            setFormData({
                title: selectedImage.title,
                url: selectedImage.url,
                description: selectedImage.description || '',
            })
        }
    }, [mode, selectedImage]);

    // submit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form before submitting
        if (!validateForm()) {
            return;
        }
        
        setSubmitting(true);
        try {
            if (mode === 'add') {
                const newImage = await uploadImage('anime', formData);
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
    }

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
    }
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
                <p className="text-center text-gray-100 text-2xl mt-10 font-bold">
                    Loading gallery...
                </p>
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-6">Gallery</h1>
                
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
                    onEdit={openEditModal}error
                    onAddClick={openAddModal}
                    deletingId={deletingId}
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
    )
}
export default GalleryPage
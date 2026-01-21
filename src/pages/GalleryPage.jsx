
import { useState, useReducer, useEffect } from "react";
import GalleryGrid from '../components/gallery/GalleryGrid';
import GalleryModal from '../components/gallery/GalleryModal';
import galleryReducer, { ACTIONS, initialState } from '../reducers/galleryReducer';
import { fetchImages, uploadImage, deleteImage } from '../api/fakeGalleryApi';
function GalleryPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        description: '',
    });
    const [state, dispatch] = useReducer(galleryReducer, initialState);
    const { images, selectedImage, mode } = state;

    // initial state
    useEffect(() => {
        async function loadImages() {
            try {
                const data = await fetchImages();
                dispatch({ type: ACTIONS.INIT, payload: data });
            } catch (err) {
                console.error('Failed to get Images:', err)
            } finally {
                setLoading(false)
            }
        }
        loadImages()
    }, [])
    // control input values
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }
    //add
    const openAddModal = () => {
        dispatch({ type: ACTIONS.SET_MODE, payload: 'add' })
        dispatch({ type: ACTIONS.SET_SELECTED_IMAGE, payload: null })
        setFormData({ title: '', url: '', description: '' });
        setIsModalOpen(true);
    }
    // edit 
    const openEditModal = (image) => {
        dispatch({ type: ACTIONS.SET_MODE, payload: 'edit' })
        dispatch({ type: ACTIONS.SET_SELECTED_IMAGE, payload: image });
        setIsModalOpen(true);
    }
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
        try {
            if (mode === 'add') {
                const newImage = await uploadImage('anime', formData);
                dispatch({ type: ACTIONS.ADD, payload: newImage });
            } else {
                dispatch({
                    type: ACTIONS.UPDATE,
                    payload: { id: selectedImage.id, ...formData }
                });
            }
            setFormData({ title: '', url: '', description: '' });
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to submit', err);
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteImage(id);
            dispatch({ type: ACTIONS.DELETE, payload: id })
        } catch (err) {
            console.error('Failed to delete', err);
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
                <GalleryGrid
                    images={images}
                    onDelete={handleDelete}
                    onEdit={openEditModal}
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
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </div>
    )
}
export default GalleryPage
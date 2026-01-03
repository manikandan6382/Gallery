import { useEffect, useReducer, useState } from "react";
import galleryReducer, { ACTIONS, initialState } from "../reducers/galleryReducer";
import seedImages from "../data/seed";
import GalleryGrid from "../components/gallery/GalleryGrid";
import GalleryModal from "../components/gallery/GalleryModal";


function GalleryPage() {

    const [state, dispatch] = useReducer(galleryReducer, initialState);
    const { images, selectedImage, mode } = state;
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    const [formData, setFormData ] = useState({
        title: '',
        url: '',
        description: '',
    })


    useEffect(() => {
        dispatch({ type: ACTIONS.INIT, payload: seedImages });
    }, []);

    // edit
    const openEditModal = (image) => {
        dispatch({ type: ACTIONS.SET_MODE, payload: 'edit' });
        dispatch({ type: ACTIONS.SET_SELECTED_IMAGE, payload: image });
        setIsModalOpen(true);
    }
    useEffect(() => {
        if (mode === 'edit' && selectedImage) {
            setFormData({
                title: selectedImage.title,
                url: selectedImage.url,
                description: selectedImage.description || '',
            })
        }
    }, [mode, selectedImage]);

    // add
    const openAddModal = () => {

        dispatch({ type: ACTIONS.SET_MODE, payload: 'add' });
        dispatch({ type: ACTIONS.SET_SELECTED_IMAGE, payload: null });
        setFormData({
            title: '',
            url: '',
            description: '',
        })

        setIsModalOpen(true);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.url) return;

        if (mode === 'add') {
            dispatch({
                type: ACTIONS.ADD,
                payload: formData,
            })
        } else {
            dispatch({
                type: ACTIONS.UPDATE,
                payload: {
                    id: selectedImage.id,
                    ...formData,
                }
            })
        }
        setIsModalOpen(false);
        setFormData({ title: '', url: '', description: '' })
    }

    const handleDelete = (id) => {
        dispatch({ type: ACTIONS.DELETE, payload: id })
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-white mb-6">
                    Gallery
                </h2>
                <GalleryGrid
                    images={images}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
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
                    onClose={()=> setIsModalOpen(false)}
                />
            </div>
        </div>
    )
}

export default GalleryPage;
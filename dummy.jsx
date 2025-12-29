import { useReducer, useState } from "react";
import galleryReducer, { ACTIONS ,initialState} from "../reducers/galleryReducer";
import seedImages from "../data/seed";
import GalleryGrid from "../components/gallery/GalleryGrid";
import GalleryModal from "../components/gallery/GalleryModal";

function GalleryPage() {
    const [images, dispatch] = useReducer(galleryReducer, seedImages)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        url: "",
        description: "",
    });

    const handleDelete = (id) => { console.log('Delete Image', id) }
    const handleEdit = (img) => { console.log('Image ID', img.id, 'Image URL', img.url) }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    };

    const handleAddImage = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.url) return;
        dispatch({
            type: ACTIONS.ADD,
            payload: {
                id: Date.now(),
                createdAt: Date.now(),
                ...formData,
            }
        })

        setFormData({ title: '', url: '', description: '' });
        setIsModalOpen(false)
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-6">Gallery</h1>

                <GalleryGrid
                    images={images}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mb-6 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded mt-4 cursor-pointer"
                >
                    Add Image
                </button>

                <GalleryModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onChange={handleChange}
                    onSubmit={handleAddImage}
                    formData={formData}
                />
            </div>
        </div>
    )
}
// export default GalleryPage;


export const ACTIONS = {
  INIT: 'init',
  ADD: 'add',
  UPDATE: 'update',
  DELETE: 'delete ',
}

export default function galleryReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT:
      return action.payload || [];

    case ACTIONS.ADD:
      return [ action.payload ,...state];
      
    case ACTIONS.UPDATE:
      return state.map(item => item.id === action.payload.id
        ? { ...item, ...action.payload }
        : item
      );
    case ACTIONS.DELETE:
      return state.filter(item => item.id !== action.payload);
    default:
      state;  
  }
}

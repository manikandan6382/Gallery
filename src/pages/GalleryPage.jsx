import { useState, useEffect, useReducer } from "react";
import galleryReducer, { ACTIONS, initialState } from "../reducers/galleryReducer";
import fetchGalleryImages from "../api/fakeGalleryApi";
import GalleryGrid from "../components/gallery/GalleryGrid";
import GalleryModal from "../components/gallery/GalleryModal"

function GalleryPage() {
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [state, dispatch] = useReducer(galleryReducer, initialState)
    const { images, selectedImage, mode } = state;
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        description: '',
    });

    useEffect(() => {
        async function loadImages() {
            const data = await fetchGalleryImages();
            dispatch({ type: ACTIONS.INIT, payload: data })
            setLoading(false)
        }
        loadImages()
    }, [])

    // control input values
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // add
    const openAddModal = () => {
        dispatch({ type: ACTIONS.SET_MODE, payload: 'add' });
        dispatch({ type: ACTIONS.SET_SELECTED_IMAGE, payload: null, })
        setFormData({type:'',url:'',description:''});
        setIsModalOpen(true)
    }

   // edit 
   const openEditModal = (image)=>{
    dispatch({type:ACTIONS.SET_MODE, payload:'edit'})
    dispatch({type:ACTIONS.SET_SELECTED_IMAGE, payload:image});
    setIsModalOpen(true);
   } 
 
      useEffect(()=>{
    if(mode === 'edit'){
        setFormData({
            title:selectedImage.title,
            url:selectedImage.url,
            description:selectedImage.description || '',
        })
    }
   },[mode,selectedImage])

//  submit
const handleSubmit = (e)=>{
    e.preventDefault();
    if(mode==='add'){
        dispatch({type:ACTIONS.ADD , payload:formData});
    }else{
        dispatch({type:ACTIONS.UPDATE,
            payload:{id:selectedImage.id ,...formData}
        })
    }
    setIsModalOpen(false);
    setFormData({type:'',url:'',description:''});
}

// delete
const handleDelete = (id)=>{
    dispatch({type:ACTIONS.DELETE,payload:id});
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
                    onChange={handleChange}
                    mode={mode}
                    onSubmit={handleSubmit}
                    onClose={() => setIsModalOpen(false)}
                    formData={formData}
                    open={isModalOpen}
                />
            </div>

        </div>
    );
}
export default GalleryPage
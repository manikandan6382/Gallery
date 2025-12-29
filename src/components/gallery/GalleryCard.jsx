function GalleryCard({ image, onEdit, onDelete }) {

  return (
    <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700 rounded-lg p-4 hover:shadow-xl transition relative">
      <img
        src={image.url}
        alt={image.title}
        className="w-full h-48 object-cover rounded-lg border border-gray-700"
      />
      <h3 className="text-white text-lg font-semibold mt-2">{image.title}</h3>
      <p className="text-gray-300 text-sm mt-1">{image.description}</p>
      <div className="flex gap-3 mt-3">
        <button
          onClick={() => onEdit(image)}
          className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-3 rounded-lg transition cursor-pointer"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(image.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
export default GalleryCard
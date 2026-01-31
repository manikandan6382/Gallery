import GalleryCard from "./GalleryCard";

function GalleryGrid({ images, onEdit, onDelete, deletingId, onAddClick }) {

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">🖼️</div>
        <h3 className="text-2xl font-semibold text-white mb-2">No Images Yet</h3>
        <p className="text-gray-400 text-center mb-6 max-w-md">
          Your gallery is empty. Start by adding your first image to create your collection.
        </p>
        <button
          onClick={onAddClick}
          className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Add Your First Image
        </button>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
      {
        images.map((image) => (
          <GalleryCard
            key={image.id}
            image={image}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={deletingId === image.id}
          />
        ))
      }
    </div>

  )
}

export default GalleryGrid;
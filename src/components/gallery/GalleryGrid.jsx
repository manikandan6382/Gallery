import GalleryCard from "./GalleryCard";

function GalleryGrid({ images, onEdit, onDelete }) {

  if (!images || images.length === 0) {
    return (
      <div className="">
        <p className="py-10 text-center text-gray-400 text-xl">
          No images found
        </p>
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
          />
        ))
      }
    </div>

  )
}

export default GalleryGrid;
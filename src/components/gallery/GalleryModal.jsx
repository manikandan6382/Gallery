function GalleryModal({open,mode,formData,onChange,onSubmit,onClose,}) {
    
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">
          {mode === "add" ? "Add Image" : "Edit Image"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="Title"
            className="w-full bg-gray-700 text-white px-4 py-2 rounded"
          />

          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={onChange}
            placeholder="Image URL"
            className="w-full bg-gray-700 text-white px-4 py-2 rounded"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Description"
            className="w-full bg-gray-700 text-white px-4 py-2 rounded"
          />

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded"
            >
              {mode === "add" ? "ADD" : "UPDATE"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GalleryModal;

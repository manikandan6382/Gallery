// ============================================
// OPTION 1: FAKE API (No backend needed)
// ============================================
// Simulates backend API calls
// In real production, this would call actual backend

// let mockDatabase = [
//   {
//     id: "1",
//     title: "Mountain",
//     url: "https://picsum.photos/id/1018/400/300",
//     description: "Nature mountain",
//   },
//   {
//     id: "2",
//     title: "Beach",
//     url: "https://picsum.photos/id/1015/400/300",
//     description: "Sunny beach",
//   },
// ];

// // GET - Fetch all images
// export const fetchImages = async () => {
//   // Simulate network delay
//   await new Promise(resolve => setTimeout(resolve, 1000));
//   return [...mockDatabase];
// };

// // POST - Upload new image
// export const uploadImage = async (folder, imageData) => {
//   // Simulate upload delay
//   await new Promise(resolve => setTimeout(resolve, 800));

//   const newImage = {
//     id: Date.now().toString(),
//     ...imageData,
//   };
//   mockDatabase = [newImage, ...mockDatabase];
//   return newImage;
// };

// // DELETE - Remove image
// export const deleteImage = async (id) => {
//   // Simulate delete delay
//   await new Promise(resolve => setTimeout(resolve, 500));

//   mockDatabase = mockDatabase.filter(img => img.id !== id);
//   return { success: true };
// };


// ============================================
// OPTION 2: REAL API (Needs backend running)
// ============================================
// Uncomment below and comment above to use real Cloudinary

const API_URL = 'http://localhost:5000/api/gallery'

// Cache for storing all images by category
const imageCache = {};

// GET - Fetch all images for a category (with caching)
const fetchAllImages = async (folder) => {
  if (imageCache[folder]) {
    return imageCache[folder];
  }
  
  const res = await fetch(`${API_URL}/${folder}`);
  if (!res.ok) throw new Error('Failed to fetch images');
  const data = await res.json();
  
  imageCache[folder] = data;
  console.log(`Cached ${data.length} images for ${folder}`);
  return data;
};

// GET - Fetch images with pagination (from cache)
export const fetchImages = async (folder = 'anime', page = 1, limit = 9) => {
  const allImages = await fetchAllImages(folder);
  
  // Add small delay for smooth loading experience
  if (page === 1) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Longer for initial load
  } else {
    await new Promise(resolve => setTimeout(resolve, 300)); // Shorter for infinite scroll
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedImages = allImages.slice(startIndex, endIndex);
  
  console.log(`Page ${page}: Returning ${paginatedImages.length} images (${startIndex}-${endIndex} of ${allImages.length})`);
  return paginatedImages;
}

// GET - Fetch available categories
export const fetchCategories = async () => {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

// POST - Upload new image
export const uploadImage = async (folder = 'anime', imageData) => {
  const res = await fetch(`${API_URL}/${folder}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(imageData),
  });
  if (!res.ok) throw new Error('Failed to upload image');
  return res.json();
}

// DELETE - Remove image by public_id
export const deleteImage = async (publicId) => {
  const encodedId = encodeURIComponent(publicId);
  const res = await fetch(`${API_URL}/${encodedId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete image');
  return res.json();
}
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

// Fallback mock data for when backend is not available
const fallbackData = {
  anime: [
    { id: "1", title: "Anime Scene 1", url: "https://picsum.photos/seed/anime1/400/300", description: "Beautiful anime landscape" },
    { id: "2", title: "Anime Scene 2", url: "https://picsum.photos/seed/anime2/400/300", description: "Anime character art" },
    { id: "3", title: "Anime Scene 3", url: "https://picsum.photos/seed/anime3/400/300", description: "Anime city view" },
    { id: "4", title: "Anime Scene 4", url: "https://picsum.photos/seed/anime4/400/300", description: "Anime sunset" },
    { id: "5", title: "Anime Scene 5", url: "https://picsum.photos/seed/anime5/400/300", description: "Anime nature" },
    { id: "6", title: "Anime Scene 6", url: "https://picsum.photos/seed/anime6/400/300", description: "Anime ocean" },
    { id: "7", title: "Anime Scene 7", url: "https://picsum.photos/seed/anime7/400/300", description: "Anime forest" },
    { id: "8", title: "Anime Scene 8", url: "https://picsum.photos/seed/anime8/400/300", description: "Anime mountain" },
    { id: "9", title: "Anime Scene 9", url: "https://picsum.photos/seed/anime9/400/300", description: "Anime sky" },
  ],
  music: [
    { id: "10", title: "Music 1", url: "https://picsum.photos/seed/music1/400/300", description: "Music notes" },
    { id: "11", title: "Music 2", url: "https://picsum.photos/seed/music2/400/300", description: "Guitar closeup" },
    { id: "12", title: "Music 3", url: "https://picsum.photos/seed/music3/400/300", description: "Piano keys" },
    { id: "13", title: "Music 4", url: "https://picsum.photos/seed/music4/400/300", description: "Drum set" },
    { id: "15", title: "Music 5", url: "https://picsum.photos/seed/music5/400/300", description: "Vinyl record" },
    { id: "16", title: "Music 6", url: "https://picsum.photos/seed/music6/400/300", description: "Studio setup" },
    { id: "17", title: "Music 7", url: "https://picsum.photos/seed/music7/400/300", description: "Concert stage" },
    { id: "18", title: "Music 8", url: "https://picsum.photos/seed/music8/400/300", description: "Microphone" },
    { id: "19", title: "Music 9", url: "https://picsum.photos/seed/music9/400/300", description: "Sound waves" },
  ],
  city: [
    { id: "20", title: "City 1", url: "https://picsum.photos/seed/city1/400/300", description: "City skyline" },
    { id: "21", title: "City 2", url: "https://picsum.photos/seed/city2/400/300", description: "Night city" },
    { id: "22", title: "City 3", url: "https://picsum.photos/seed/city3/400/300", description: "Urban street" },
    { id: "23", title: "City 4", url: "https://picsum.photos/seed/city4/400/300", description: "City lights" },
    { id: "24", title: "City 5", url: "https://picsum.photos/seed/city5/400/300", description: "Modern architecture" },
    { id: "25", title: "City 6", url: "https://picsum.photos/seed/city6/400/300", description: "City park" },
    { id: "26", title: "City 7", url: "https://picsum.photos/seed/city7/400/300", description: "City bridge" },
    { id: "27", title: "City 8", url: "https://picsum.photos/seed/city8/400/300", description: "City traffic" },
    { id: "28", title: "City 9", url: "https://picsum.photos/seed/city9/400/300", description: "City skyline at sunset" },
  ]
};

// GET - Fetch all images for a category (with caching and fallback)
const fetchAllImages = async (folder) => {
  if (imageCache[folder]) {
    return imageCache[folder];
  }
  
  try {
    const res = await fetch(`${API_URL}/${folder}`);
    if (!res.ok) throw new Error('Failed to fetch images');
    const data = await res.json();
    
    imageCache[folder] = data;
    console.log(`✅ Cached ${data.length} images for ${folder}`);
    return data;
  } catch (error) {
    console.warn(`⚠️ Backend not available for ${folder}, using fallback data`);
    // Use fallback data when backend is not available
    const fallback = fallbackData[folder] || [];
    imageCache[folder] = fallback;
    return fallback;
  }
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
  
  console.log(`📄 Page ${page}: Returning ${paginatedImages.length} images (${startIndex}-${endIndex} of ${allImages.length})`);
  return paginatedImages;
}

// GET - Fetch available categories
export const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  } catch (error) {
    console.warn('⚠️ Backend not available for categories, using fallback');
    return ['anime', 'music', 'city'];
  }
}

// POST - Upload new image
export const uploadImage = async (folder = 'anime', imageData) => {
  try {
    const res = await fetch(`${API_URL}/${folder}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(imageData),
    });
    if (!res.ok) throw new Error('Failed to upload image');
    const result = await res.json();
    
    // Clear cache for this category
    delete imageCache[folder];
    
    return result;
  } catch (error) {
    console.warn('⚠️ Backend not available for upload, simulating upload');
    // Simulate upload for demo
    const newImage = {
      id: Date.now().toString(),
      ...imageData,
      folder
    };
    
    // Add to cache
    if (!imageCache[folder]) {
      imageCache[folder] = fallbackData[folder] || [];
    }
    imageCache[folder].unshift(newImage);
    
    return newImage;
  }
}

// DELETE - Remove image by public_id
export const deleteImage = async (publicId) => {
  try {
    const encodedId = encodeURIComponent(publicId);
    const res = await fetch(`${API_URL}/${encodedId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete image');
    const result = await res.json();
    
    // Clear cache to force refresh
    Object.keys(imageCache).forEach(key => delete imageCache[key]);
    
    return result;
  } catch (error) {
    console.warn('⚠️ Backend not available for delete, simulating delete');
    // Simulate delete for demo
    return { success: true };
  }
}
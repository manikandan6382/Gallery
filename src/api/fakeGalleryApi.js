// ============================================
// OPTION 1: FAKE API (No backend needed)
// ============================================
// Simulates backend API calls
// In real production, this would call actual backend

let mockDatabase = [
  {
    id: "1",
    title: "Mountain",
    url: "https://picsum.photos/id/1018/400/300",
    description: "Nature mountain",
  },
  {
    id: "2",
    title: "Beach",
    url: "https://picsum.photos/id/1015/400/300",
    description: "Sunny beach",
  },
];

// GET - Fetch all images
export const fetchImages = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [...mockDatabase];
};

// POST - Upload new image
export const uploadImage = async (folder, imageData) => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const newImage = {
    id: Date.now().toString(),
    ...imageData,
  };
  mockDatabase = [newImage, ...mockDatabase];
  return newImage;
};

// DELETE - Remove image
export const deleteImage = async (id) => {
  // Simulate delete delay
  await new Promise(resolve => setTimeout(resolve, 500));

  mockDatabase = mockDatabase.filter(img => img.id !== id);
  return { success: true };
};


// ============================================
// OPTION 2: REAL API (Needs backend running)
// ============================================
// Uncomment below and comment above to use real Cloudinary

// const API_URL = 'http://localhost:5000/api/gallery'

// // GET - Fetch all images from folder
// export const fetchImages = async (folder = 'anime') => {
//   const res = await fetch(`${API_URL}/${folder}`);
//   if (!res.ok) throw new Error('Failed to fetch images');
//   console.log(res)
//   // console.log(res.json())
//   return res.json();
// }

// // POST - Upload new image
// export const uploadImage = async (folder = 'anime', imageData) => {
//   const res = await fetch(`${API_URL}/${folder}`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(imageData),
//   });
//   if (!res.ok) throw new Error('Failed to upload image');
//   return res.json();
// }

// // DELETE - Remove image by public_id
// export const deleteImage = async (publicId) => {
//   const encodedId = encodeURIComponent(publicId);
//   const res = await fetch(`${API_URL}/${encodedId}`, {
//     method: 'DELETE',
//   });
//   if (!res.ok) throw new Error('Failed to delete image');
//   return res.json();
// }
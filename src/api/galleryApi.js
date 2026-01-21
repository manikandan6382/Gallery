const API_URL = 'http://localhost:5000/api/gallery'

// GET - Fetch all images from folder
export const fetchImages = async (folder = 'anime') => {
  const res = await fetch(`${API_URL}/${folder}`);
  if (!res.ok) throw new Error('Failed to fetch images');
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
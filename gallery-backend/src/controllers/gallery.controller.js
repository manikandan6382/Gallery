import { v2 as cloudinary } from "cloudinary";

export const getImages = async (req, res) => {
  const { folder } = req.params;

  try {
    const result = await cloudinary.search
      .expression(`folder:gallery/${folder}`)
      .sort_by("created_at", "desc")
      .execute();

    const images = result.resources.map(img => ({
      id: img.public_id,
      title: img.display_name || "Untitled",
      url: img.secure_url,
      description: "",
    }));

    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch images" });
  }
};


export const uploadImage = async (req, res) => {
  try {
    const { title, url } = req.body;
    const { folder } = req.params;

    const uploaded = await cloudinary.uploader.upload(url, {
      folder: `gallery/${folder}`,
    });

    res.json({
      id: uploaded.public_id,
      title,
      url: uploaded.secure_url,
      description: "",
    });

  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
};

export const deleteImage = async (req, res) => {
  try {
    // Decode the public_id to handle encoded forward slashes
    const publicId = decodeURIComponent(req.params.public_id);
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

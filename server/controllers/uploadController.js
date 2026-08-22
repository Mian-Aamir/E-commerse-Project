// @route POST /api/upload
// Seller only - uploads up to 5 images and returns their Cloudinary URLs
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const urls = req.files.map((file) => file.path);
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadImages };
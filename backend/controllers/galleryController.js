const { Gallery } = require('../models');
const fs = require('fs');
const path = require('path');

const formatGallery = (item) => {
  if (!item) return null;
  return {
    _id: item.id,
    id: item.id,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl,
    category: item.category,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
};

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    const items = await Gallery.findAll({
      where: query,
      order: [['createdAt', 'DESC']]
    });
    const data = items.map(item => formatGallery(item));
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new gallery item (upload)
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryItem = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    if (!category) {
      return res.status(400).json({ success: false, message: 'Please specify a category' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const item = await Gallery.create({
      title: title || '',
      description: description || '',
      category,
      imageUrl
    });

    res.status(201).json({ success: true, data: formatGallery(item) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    if (item.imageUrl) {
      const filePath = path.join(__dirname, '..', item.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await item.destroy();
    res.status(200).json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem
};

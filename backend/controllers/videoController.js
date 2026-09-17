const { Video } = require('../models');
const fs = require('fs');
const path = require('path');

const formatVideo = (item) => {
  if (!item) return null;
  return {
    _id: item.id,
    id: item.id,
    title: item.title,
    description: item.description,
    type: item.type,
    url: item.url,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
};

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
const getVideos = async (req, res) => {
  try {
    const videos = await Video.findAll({ order: [['createdAt', 'DESC']] });
    const data = videos.map(item => formatVideo(item));
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new video (upload file or add link)
// @route   POST /api/videos
// @access  Private/Admin
const createVideo = async (req, res) => {
  try {
    const { title, description, type, url } = req.body;

    let finalUrl = url;

    if (type === 'upload') {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a video file for custom upload' });
      }
      finalUrl = `/uploads/${req.file.filename}`;
    } else {
      if (!url) {
        return res.status(400).json({ success: false, message: 'Please provide a video link' });
      }
    }

    const video = await Video.create({
      title,
      description: description || '',
      type,
      url: finalUrl
    });

    res.status(201).json({ success: true, data: formatVideo(video) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private/Admin
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    if (video.type === 'upload' && video.url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', video.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await video.destroy();
    res.status(200).json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVideos,
  createVideo,
  deleteVideo
};

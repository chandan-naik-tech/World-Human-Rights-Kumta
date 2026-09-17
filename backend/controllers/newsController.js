const { News } = require('../models');
const fs = require('fs');
const path = require('path');

const formatNews = (item) => {
  if (!item) return null;
  return {
    _id: item.id,
    id: item.id,
    title: item.title,
    content: item.content,
    imageUrl: item.imageUrl,
    date: item.date,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
};

// @desc    Get all news
// @route   GET /api/news
// @access  Public
const getNews = async (req, res) => {
  try {
    const newsList = await News.findAll({ order: [['date', 'DESC']] });
    const data = newsList.map(item => formatNews(item));
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single news article
// @route   GET /api/news/:id
// @access  Public
const getNewsById = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }
    res.status(200).json({ success: true, data: formatNews(news) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new news article
// @route   POST /api/news
// @access  Private/Admin
const createNews = async (req, res) => {
  try {
    const { title, content, date } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const news = await News.create({
      title,
      content,
      date: date || new Date(),
      imageUrl
    });

    res.status(201).json({ success: true, data: formatNews(news) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update news article
// @route   PUT /api/news/:id
// @access  Private/Admin
const updateNews = async (req, res) => {
  try {
    let news = await News.findByPk(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    const { title, content, date } = req.body;

    let imageUrl = news.imageUrl;
    if (req.file) {
      if (news.imageUrl && news.imageUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', news.imageUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    await news.update({
      title: title !== undefined ? title : news.title,
      content: content !== undefined ? content : news.content,
      date: date !== undefined ? date : news.date,
      imageUrl
    });

    res.status(200).json({ success: true, data: formatNews(news) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
const deleteNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    if (news.imageUrl && news.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', news.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await news.destroy();
    res.status(200).json({ success: true, message: 'News article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
};

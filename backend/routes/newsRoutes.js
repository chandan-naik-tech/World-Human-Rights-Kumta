const express = require('express');
const router = express.Router();
const {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/newsController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getNews)
  .post(protect, upload.single('image'), createNews);

router.route('/:id')
  .get(getNewsById)
  .put(protect, upload.single('image'), updateNews)
  .delete(protect, deleteNews);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getVideos,
  createVideo,
  deleteVideo
} = require('../controllers/videoController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getVideos)
  .post(protect, upload.single('video'), createVideo);

router.route('/:id')
  .delete(protect, deleteVideo);

module.exports = router;

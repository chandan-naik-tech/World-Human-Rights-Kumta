const express = require('express');
const router = express.Router();
const {
  getLeaders,
  getLeaderById,
  createLeader,
  updateLeader,
  deleteLeader
} = require('../controllers/leaderController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getLeaders)
  .post(protect, upload.single('photo'), createLeader);

router.route('/:id')
  .get(getLeaderById)
  .put(protect, upload.single('photo'), updateLeader)
  .delete(protect, deleteLeader);

module.exports = router;

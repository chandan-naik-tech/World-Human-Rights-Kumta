const express = require('express');
const router = express.Router();
const {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getActivities)
  .post(protect, upload.single('image'), createActivity);

router.route('/:id')
  .get(getActivityById)
  .put(protect, upload.single('image'), updateActivity)
  .delete(protect, deleteActivity);

module.exports = router;

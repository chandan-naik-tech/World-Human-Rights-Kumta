const express = require('express');
const router = express.Router();
const {
  submitInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(submitInquiry)
  .get(protect, getInquiries);

router.route('/:id')
  .put(protect, updateInquiryStatus)
  .delete(protect, deleteInquiry);

module.exports = router;

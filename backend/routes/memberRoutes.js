const express = require('express');
const router = express.Router();
const {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
} = require('../controllers/memberController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getMembers)
  .post(protect, upload.single('photo'), createMember);

router.route('/:id')
  .get(getMemberById)
  .put(protect, upload.single('photo'), updateMember)
  .delete(protect, deleteMember);

module.exports = router;

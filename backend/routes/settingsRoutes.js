const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings
} = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getSettings)
  .put(
    protect,
    upload.fields([
      { name: 'heroBanners', maxCount: 5 },
      { name: 'presidentPhoto', maxCount: 1 },
      { name: 'directorPhoto', maxCount: 1 },
      { name: 'developerPhoto', maxCount: 1 }
    ]),
    updateSettings
  );

module.exports = router;

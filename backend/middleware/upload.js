const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${path.basename(file.originalname).replace(/\s+/g, '-')}`);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|avif|heic|heif|gif|mp4|mkv|webm/i;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype.toLowerCase()) || 
                   file.mimetype.toLowerCase().startsWith('image/') || 
                   file.mimetype.toLowerCase().startsWith('video/');

  console.log('--- FILE UPLOAD VALIDATION ---');
  console.log('Original Name:', file.originalname);
  console.log('Mime Type:', file.mimetype);
  console.log('Extension Matches:', extname);
  console.log('Mime Matches:', mimetype);
  console.log('------------------------------');

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit (for video uploads)
  fileFilter: fileFilter
});

module.exports = upload;

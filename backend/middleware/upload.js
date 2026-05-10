const multer = require('multer');
const path = require('path');

// Store in memory (not disk) - Cloudinary will handle upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /glb|gltf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype === 'model/gltf-binary' || file.mimetype === 'application/octet-stream';
  
  if (extname || mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only .glb files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

module.exports = upload;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  uploadModel,
  getUserObjects,
  saveCameraState,
  deleteObject
} = require('../controllers/objectController');

router.post('/upload', auth, upload.single('model'), uploadModel);
router.get('/my-objects', auth, getUserObjects);
router.put('/:objectId/camera-state', auth, saveCameraState);
router.delete('/:objectId', auth, deleteObject);

module.exports = router;
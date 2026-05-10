const mongoose = require('mongoose');

const userObjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  cloudinaryPublicId: {
    type: String,  // Store Cloudinary ID for deletion
  },
  cameraState: {
    position: { x: Number, y: Number, z: Number },
    target: { x: Number, y: Number, z: Number },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserObject', userObjectSchema);
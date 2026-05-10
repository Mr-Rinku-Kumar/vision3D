const UserObject = require('../models/UserObject');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Upload GLB to Cloudinary
exports.uploadModel = async (req, res) => {
  try {
    // Check file
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
      });
    }

    // Upload stream function
    const streamUpload = () => {
      return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            folder: '3d-models',
            public_id: `${Date.now()}_${
              req.file.originalname.split('.')[0]
            }`,
          },

          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);
      });
    };

    // Upload to Cloudinary
    const result = await streamUpload();

    // Save in MongoDB
    const userObject = new UserObject({
      userId: req.userId,
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
    });

    await userObject.save();

    res.status(200).json({
      message: 'File uploaded successfully',
      object: userObject,
    });

  } catch (error) {
    console.log('UPLOAD ERROR:', error);

    res.status(500).json({
      error: error.message,
    });
  }
};

// Get user's objects
exports.getUserObjects = async (req, res) => {
  try {
    const objects = await UserObject
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(objects);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Save camera state
exports.saveCameraState = async (req, res) => {
  try {
    const { position, target } = req.body;

    const object = await UserObject.findOneAndUpdate(
      {
        _id: req.params.objectId,
        userId: req.userId,
      },
      {
        cameraState: {
          position,
          target,
        },
      },
      {
        new: true,
      }
    );

    if (!object) {
      return res.status(404).json({
        error: 'Object not found',
      });
    }

    res.json(object);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Delete object
exports.deleteObject = async (req, res) => {
  try {
    const object = await UserObject.findOne({
      _id: req.params.objectId,
      userId: req.userId,
    });

    if (!object) {
      return res.status(404).json({
        error: 'Object not found',
      });
    }

    // Delete from Cloudinary
    if (object.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(
        object.cloudinaryPublicId,
        {
          resource_type: 'raw',
        }
      );
    }

    // Delete from MongoDB
    await object.deleteOne();

    res.json({
      message: 'Object deleted successfully',
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
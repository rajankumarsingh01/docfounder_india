// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// /**
//  * Uploads Folder Create
//  * Agar folder nahi hai to create karo
//  */
// if (!fs.existsSync("uploads")) {
//   fs.mkdirSync("uploads");
// }

// /**
//  * Storage Config
//  */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },

//   filename: (req, file, cb) => {
//     const uniqueName =
//       Date.now() +
//       path.extname(file.originalname);

//     cb(null, uniqueName);
//   }
// });

// /**
//  * File Type Validation
//  */
// const fileFilter = (
//   req,
//   file,
//   cb
// ) => {

//   const allowedTypes = [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/webp"
//   ];

//   if (
//     allowedTypes.includes(file.mimetype)
//   ) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error(
//         "Only image files are allowed"
//       )
//     );
//   }
// };

// /**
//  * Multer Instance
//  */
// const upload = multer({
//   storage,

//   fileFilter,

//   limits: {
//     fileSize: 5 * 1024 * 1024
//   }
// });

// module.exports = upload;




const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

/**
 * Cloudinary Config
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Cloudinary Storage
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:           "docfinder",
    allowed_formats:  ["jpg", "jpeg", "png", "webp"],
    transformation:   [{ width: 1000, crop: "limit" }], // optional: resize
  },
});

/**
 * File Type Validation
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

/**
 * Multer Instance
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = { upload, cloudinary };
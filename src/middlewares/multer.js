const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "public/uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, callback) => {
  const allowedTypes = /jpeg|jpg|png/;

  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimeType);

  if (extName && mimeType) {
    return callback(null, true);
  }
  callback("error: hanya diperbolehkan upload jpeg/jpg/png");
};

const upload = multer({
  storage,
});

module.exports = {
  upload,
};

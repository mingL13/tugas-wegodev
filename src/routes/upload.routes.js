const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload.controller");
const { upload } = require("../middlewares/multer");

router.post("/upload", upload.single("file"), uploadController.upload);

module.exports = router;

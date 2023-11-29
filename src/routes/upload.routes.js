const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload.controller");
const { upload } = require("../middlewares/multer");
const { Authentication } = require("../middlewares/authentication");

router.post("/upload", Authentication, upload.single("file"), uploadController.upload);

module.exports = router;

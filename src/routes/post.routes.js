const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const { Authentication } = require("../middlewares/Authentication");

router.post("/post", Authentication, postController.createAPost);
router.get("/post", postController.getAllPosts);
router.get("/post/:id", postController.getAPost);
router.get("/post/get-by-slug/:slug", postController.getBySlug);
router.put("/post/:id", Authentication, postController.updateAPost);
router.delete("/post/:id", Authentication, postController.deleteAPost);

module.exports = router;

const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");

router.post("/post", postController.createAPost);
router.get("/post", postController.getAllPosts);
router.get("/post/:id", postController.getAPost);
router.get("/post/get-by-slug/:slug", postController.getBySlug);
router.put("/post/:id", postController.updateAPost);
router.delete("/post/:id", postController.deleteAPost);

module.exports = router;

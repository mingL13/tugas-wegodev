const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { Authentication } = require("../middlewares/Authentication");

router.post("/category", Authentication, categoryController.createACategory);
router.get("/category", categoryController.getAllCategories);
router.get("/category/:id", categoryController.getACategory);
router.put("/category/:id", Authentication, categoryController.updateACategory);
router.delete("/category/:id", Authentication, categoryController.deleteACategory);

module.exports = router;

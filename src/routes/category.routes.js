const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

router.post("/category", categoryController.createACategory);
router.get("/category", categoryController.getAllCategories);
router.get("/category/:id", categoryController.getACategory);
router.put("/category/:id", categoryController.updateACategory);
router.delete("/category/:id", categoryController.deleteACategory);

module.exports = router;

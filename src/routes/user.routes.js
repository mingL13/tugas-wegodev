const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { Authentication } = require("../middlewares/Authentication");

router.post("/user", Authentication, userController.createAUser);
router.get("/user", Authentication, userController.getAllUser);
router.get("/user/:id", Authentication, userController.getAUser);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", Authentication, userController.deleteUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/user", userController.createAUser);
router.get("/user", userController.getAllUser);
router.get("/user/:id", userController.getAUser);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);

module.exports = router;

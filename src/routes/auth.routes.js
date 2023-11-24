const express = require("express");
const router = express.Router();
const { Authentication } = require("../middlewares/Authentication");

const authController = require("../controllers/auth.controller");

router.post("/auth/login", authController.login);
router.post("/auth/refresh-token", authController.refreshToken);
router.get("/profile", Authentication, authController.profileUser);

module.exports = router;

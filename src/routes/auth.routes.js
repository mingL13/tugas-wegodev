const express = require("express");
const router = express.Router();
const { Authentication } = require("../middlewares/Authentication");

const authController = require("../controllers/auth.controller");

router.post("/auth/login", Authentication, authController.login);

module.exports = router;

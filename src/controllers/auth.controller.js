const { User } = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({
      where: {
        email: email,
      },
      raw: true,
    });

    if (!userData) {
      throw new Error("User not found");
    }

    bcrypt.compare(password, userData.confirmNewPassword, (error, result) => {
      if (error) {
        res.status(201).json({
          message: error.message,
        });
      } else {
        const userPayload = {
          role: userData.role,
          userId: userData.userId,
        };

        const options = {
          expiresIn: "5m",
        };

        const SECRET_KEY = "ProjectBlogWegodev";

        const accessToken = jwt.sign(userPayload, SECRET_KEY, options);

        return res.status(201).json({
          code: 201,
          message: "Berhasil masuk",
          accessToken,
          expiressIn: 3600000,
          tokenType: "Bearer",
          user: {
            id: userData.userId,
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role,
            status: userData.status,
            avatar: userData.avatar,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            deletedAt: userData.deletedAt,
          },
        });
      }
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

module.exports = {
  login,
};

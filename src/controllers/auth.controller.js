const { User } = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const env = process.env;

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
          expiresIn: "15m",
        };

        const accessToken = jwt.sign(userPayload, env.SECRET_KEY, options);

        const refreshToken = jwt.sign(userPayload, env.SECRET_KEY, { expiresIn: "30m" });

        return res.status(201).json({
          code: 201,
          message: "Berhasil masuk",
          accessToken,
          refreshToken,
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

const refreshToken = (req, res) => {
  try {
    const { token } = req.body;
    jwt.verify(token, env.SECRET_KEY, (error, decoded) => {
      if (error) {
        throw new Error(error.name);
      }

      const userPayload = { id: decoded.id, role: decoded.role };

      const options = {
        expiresIn: "15m",
      };

      const accessToken = jwt.sign(userPayload, env.SECRET_KEY, options);

      const refreshToken = jwt.sign(userPayload, env.SECRET_KEY, { expiresIn: "30m" });

      return res.status(201).json({
        accessToken,
        refreshToken,
      });
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const profileUser = async (req, res) => {
  const idTarget = req.decoded.userId;

  await User.findByPk(idTarget)
    .then((result) => {
      const { userId, fullName, email, role, status, avatar, createdAt, updatedAt, deletedAt } = result.dataValues;

      res.status(200).json({
        code: 200,
        message: `Data sudah diterima`,
        data: {
          id: userId,
          fullName,
          email,
          role,
          status,
          avatar,
          createdAt,
          updatedAt,
          deletedAt,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

module.exports = {
  login,
  refreshToken,
  profileUser,
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

const env = process.env;

const Authentication = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Token not found",
    });
  }
  jwt.verify(token, env.SECRET_KEY, (error, decoded) => {
    if (error) {
      throw new Error(error.name);
    }

    req.decoded = decoded;
    next();
  });
};

module.exports = {
  Authentication,
};

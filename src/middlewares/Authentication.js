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
  console.log(token);

  jwt.verify(token.split(" ")[1], env.SECRET_KEY, (error, decoded) => {
    if (error) {
      console.log("error disini");
      throw new Error(error.name);
    }

    req.decoded = decoded;
    next();
  });
};

module.exports = {
  Authentication,
};

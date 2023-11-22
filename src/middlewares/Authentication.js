const Authentication = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Token not found",
    });
  }
  next();
};

module.exports = {
  Authentication,
};

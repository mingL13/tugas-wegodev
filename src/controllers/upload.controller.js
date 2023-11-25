const upload = (req, res) => {
  try {
    console.log(req.file);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  upload,
};

const { Upload } = require("../../models");

const upload = async (req, res) => {
  try {
    const { fieldname, originalname, encoding, mimetype, destination, filename, path, size } = req.file;

    console.log(req.file);

    await Upload.create({
      url: `http://localhost:3000/${path}`,
      fileName: filename,
      path: path,
    })
      .then((result) => {
        res.status(201).json({
          code: 201,
          message: "Berhasil menambahkan data",
          data: {
            url: result.url,
            id: result.uploadId,
            filename: result.fileName,
            type: result.type,
            path: result.path,
            updatedAt: result.updatedAt,
            createdAt: result.createdAt,
          },
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  upload,
};

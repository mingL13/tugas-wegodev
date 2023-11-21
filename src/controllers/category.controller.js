const { Category } = require("../../models");

const createACategory = async (req, res) => {
  const { title } = req.body;

  await Category.create({
    title,
  })
    .then((result) => {
      res.status(201).json({
        code: 201,
        message: `Data berhasil dibuat`,
        data: {
          id: result.categoryId,
          deletedAt: result.deletedAt || null,
          title: result.title,
          updatedAt: result.updatedAt,
          createdAt: result.createdAt,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

const getAllCategories = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  await Category.findAll()
    .then((result) => {
      const categoriesOnPage = result.slice(startIndex, endIndex);
      const displayCategories = categoriesOnPage.map((category) => {
        return {
          id: category.categoryId,
          title: category.title,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          deletedAt: category.deletedAt,
        };
      });
      res.status(200).json({
        code: 200,
        message: `${result.length} data sudah diterima`,
        count: displayCategory.length,
        data: displayCategories,
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

const getACategory = async (req, res) => {
  const idTarget = req.params.id;

  await Category.findByPk(idTarget)
    .then((result) => {
      const { categoryId, title, createdAt, updatedAt, deletedAt } = result.dataValues;

      res.status(200).json({
        code: 200,
        message: `Data sudah diterima`,
        data: {
          id: categoryId,
          title,
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

const updateACategory = async (req, res) => {
  const idTarget = req.params.id;
  let { title } = req.body;

  if (!title) {
    res.status(400).json({
      message: `Title tidak boleh kosong`,
    });
  }

  const dataIdTarget = await Category.findByPk(idTarget);

  if (!dataIdTarget) {
    throw new Error("User not found.");
  }

  await Category.update(
    {
      title,
    },
    {
      where: {
        categoryId: idTarget,
      },
    }
  )
    .then((result) => {
      res.status(200).json({
        code: 200,
        message: `Data berhasil diperbarui`,
        data: {
          id: dataIdTarget.categoryId,
          title: dataIdTarget,
          title,
          createdAt: dataIdTarget.createdAt,
          updatedAt: dataIdTarget.updatedAt,
          deletedAt: dataIdTarget.deletedAt,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

const deleteACategory = async (req, res) => {
  const idTarget = req.params.id;

  await Category.destroy({
    where: {
      categoryId: idTarget,
    },
  })
    .then((result) => {
      res.status(200).json({
        code: 200,
        message: `Data berhasil dihapus`,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
};

module.exports = {
  createACategory,
  getAllCategories,
  getACategory,
  updateACategory,
  deleteACategory,
};

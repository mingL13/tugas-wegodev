const { Post, Category, PostCategory } = require("../../models");

const createAPost = async (req, res) => {
  const { title, description, categoryId, status } = req.body;
  const slug = title.toLowerCase().replace(/\s+/g, "-");

  await Post.create({
    title,
    description,
    status,
    categoryId,
    slug,
  })
    .then(async (result) => {
      const { postId } = result.dataValues;
      await PostCategory.create({
        postId,
        categoryId,
      })
        .then((result) => {
          return;
        })
        .catch((error) => {
          res.status(400).json({
            message: error.message,
          });
        });

      res.status(201).json({
        code: 201,
        message: `Data berhasil dibuat`,
        data: {
          id: result.postId,
          thumbnail: result.thumbnail || null,
          deletedAt: result.deletedAt || null,
          status: result.status,
          description: result.description,
          title: result.title,
          slug: result.slug,
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

const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const postsData = await Post.findAll({
    include: [
      {
        model: Category,
        as: "categories",
      },
    ],
  })
    .then((result) => {
      const datas = result.map((data) => {
        const { postId, title, description, thumbnail, status, slug, createdAt, updatedAt, deletedAt, categories } = data.dataValues;

        return {
          id: postId,
          title,
          description,
          thumbnail,
          status,
          slug,
          createdAt,
          updatedAt,
          deletedAt,
          Categories: categories,
        };
      });
      return datas;
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
  // const displayPosts = await Promise.all(
  //   postsOnPage.map(async (post) => {
  //     let categoriesData;
  //     if (post.Category) {
  //       categoriesData = [
  //         {
  //           id: post.Category.categoryId,
  //           title: post.Category.title,
  //           createdAt: post.Category.createdAt,
  //           updatedAt: post.Category.updatedAt,
  //           deletedAt: post.Category.deletedAt,
  //         },
  //       ];
  //     } else {
  //       categoriesData = await Promise.all(
  //         post.categoryId.map(async (cat) => {
  //           const catData = await Category.findByPk(cat)
  //             .then((result) => {
  //               const { categoryId, title, createdAt, updatedAt, deletedAt } = result.dataValues;
  //               return {
  //                 id: categoryId,
  //                 title,
  //                 createdAt,
  //                 updatedAt,
  //                 deletedAt,
  //               };
  //             })
  //             .catch((error) => {
  //               return {
  //                 message: error.message,
  //               };
  //             });
  //           return catData;
  //         })
  //       );
  //     }
  //     return {
  //       id: post.postId,
  //       title: post.title,
  //       description: post.description,
  //       thumbnail: post.thumbnail,
  //       status: post.status,
  //       slug: post.slug,
  //       createdAt: post.createdAt,
  //       updatedAt: post.updatedAt,
  //       deletedAt: post.deletedAt,
  //       Categories: categoriesData,
  //     };
  //   })
  // );

  res.status(200).json({
    postsData,
  });
};

const getAPost = async (req, res) => {
  const idTarget = req.params.id;

  await Post.findByPk(idTarget)
    .then((result) => {
      const { postId, title, description, thumbnail, status, slug, createdAt, updatedAt, categoryId, deletedAt } = result.dataValues;

      const transformCategories = categoryId.split(",");

      res.status(200).json({
        code: 200,
        message: `Data sudah diterima`,
        data: {
          id: postId,
          title,
          description,
          thumbnail,
          status,
          slug,
          createdAt,
          updatedAt,
          deletedAt,
          Categories: transformCategories || [],
        },
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

const getBySlug = async (req, res) => {
  const slugTarget = req.params.slug;

  await Post.findAll({
    where: {
      slug: slugTarget,
    },
  })
    .then((result) => {
      const transformResult = result.map((data) => {
        const { postId, title, description, thumbnail, status, slug, createdAt, updatedAt, deletedAt, categoryId } = data.dataValues;

        const transformCategories = categoryId.split(",");

        return {
          id: postId,
          title,
          description,
          thumbnail,
          status,
          slug,
          createdAt,
          updatedAt,
          deletedAt,
          Categories: transformCategories,
        };
      });
      res.status(200).json({
        code: 200,
        message: `${result.length} data sudah diterima`,
        data: transformResult,
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

const updateAPost = async (req, res) => {
  const idTarget = req.params.id;
  const { title, description, categoryId, status, thumbnail, slug } = req.body;

  const dataIdTarget = await Post.findByPk(idTarget);

  if (!dataIdTarget) {
    throw new Error("Post not found.");
  }

  let transformCategories;
  if (!categoryId) {
    transformCategories = categoryId.split(",");
  } else {
    transformCategories = dataIdTarget.dataValues.categoryId.split(",");
  }

  await Post.update(
    {
      title,
      description,
      thumbnail,
      status,
      slug,
      categoryId,
    },
    {
      where: {
        postId: idTarget,
      },
    }
  )
    .then((result) => {
      res.status(200).json({
        code: 200,
        message: `Data berhasil diperbarui`,
        data: {
          id: dataIdTarget.postId,
          title: title || dataIdTarget.title,
          description: description || dataIdTarget.description,
          thumbnail: thumbnail || dataIdTarget.thumbnail,
          status: status || dataIdTarget.status,
          slug: slug || dataIdTarget.slug,
          createdAt: dataIdTarget.createdAt,
          updatedAt: dataIdTarget.updatedAt,
          deletedAt: dataIdTarget.deletedAt,
          Categories: transformCategories,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

const deleteAPost = async (req, res) => {
  const idTarget = req.params.id;

  await Post.destroy({
    where: {
      postId: idTarget,
    },
  })
    .then((result) => {
      res.status(200).json({
        code: 200,
        message: `Data berhasil dihapus`,
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

module.exports = {
  createAPost,
  getAllPosts,
  getAPost,
  getBySlug,
  updateAPost,
  deleteAPost,
};

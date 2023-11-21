// Gunakan "model name" dari folder model yang sudah dibuat
const { Users } = require("../../models");
const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const saltRounds = 10;

  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        reject(err);
      } else {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
};

const createAUser = async (req, res) => {
  const { fullName, email, confirmNewPassword, newPassword, role, status } = req.body;

  if (newPassword !== confirmNewPassword) {
    res.status(400).json({
      message: "Periksa konfirmasi password",
    });
  }

  const hashedPassword = await hashPassword(confirmNewPassword);

  await Users.create({ fullName, email, confirmNewPassword: hashedPassword, newPassword: hashedPassword, role, status })
    .then((result) => {
      res.status(201).json({
        code: 201,
        message: `Data berhasil dibuat`,
        data: {
          id: result.userId,
          avatar: result.avatar,
          deletedAt: null,
          fullName,
          email,
          role,
          status,
          password: result.confirmNewPassword,
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

const getAllUser = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  await Users.findAll()
    .then((result) => {
      const userOnPage = result.slice(startIndex, endIndex);
      const displayUser = userOnPage.map((user) => {
        return {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deletedAt: user.deletedAt,
        };
      });
      res.status(200).json({
        code: 200,
        message: `${result.length} data sudah diterima`,
        count: displayUser.length,
        data: displayUser,
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

const getAUser = async (req, res) => {
  const idTarget = req.params.id;

  await Users.findByPk(idTarget)
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

const updateUser = async (req, res) => {
  const idTarget = req.params.id;
  let { fullName, email, newPassword = "", confirmNewPassword = "", status, avatar, role, createdAt, updatedAt, deletedAt } = req.body;

  const dataIdTarget = await Users.findByPk(idTarget);

  if (!dataIdTarget) {
    throw new Error("User not found.");
  }

  if (newPassword == "" && confirmNewPassword == "") {
    newPassword = dataIdTarget.newPassword;
    confirmNewPassword = dataIdTarget.confirmNewPassword;
  } else if (newPassword !== "" && confirmNewPassword !== "") {
    if (newPassword !== confirmNewPassword) {
      res.status(400).json({
        message: `Periksa kembali password`,
      });
    }

    const hashedPassword = await hashPassword(confirmNewPassword);
    newPassword = hashedPassword;
    confirmNewPassword = hashedPassword;
  }

  await Users.update(
    {
      fullName,
      email,
      newPassword,
      confirmNewPassword,
      status,
      avatar,
      role,
    },
    {
      where: {
        userId: idTarget,
      },
    }
  )
    .then((result) => {
      res.status(200).json({
        code: 200,
        message: "Data berhasil diperbarui",
        data: {
          id: dataIdTarget.userId,
          fullName: fullName || dataIdTarget.fullName,
          email: email || dataIdTarget.email,
          role: role || dataIdTarget.role,
          status: status || dataIdTarget.status,
          avatar: avatar || dataIdTarget.avatar,
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

const deleteUser = async (req, res) => {
  const idTarget = req.params.id;

  await Users.destroy({
    where: {
      userId: idTarget,
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
  createAUser,
  getAllUser,
  getAUser,
  updateUser,
  deleteUser,
};

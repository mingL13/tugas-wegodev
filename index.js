const express = require("express");
const PORT = 3000;
const app = express();

const userRouter = require("./src/routes/user.routes");
const categoryRouter = require("./src/routes/category.routes");
const postRouter = require("./src/routes/post.routes");
const authRouter = require("./src/routes/auth.routes");

app.use(express.json());
app.use("/v1", userRouter);
app.use("/v1", categoryRouter);
app.use("/v1", postRouter);
app.use("/v1", authRouter);

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});

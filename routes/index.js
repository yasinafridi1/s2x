const router = require("express").Router();
const { existsSync } = require("fs");
const path = require("path");
const AuthRoutes = require("./AuthRoutes");
const PostsRoutes = require("./PostsRoutes");
const DashboardRoutes = require("./DashboardRoutes");
const AsyncWrapper = require("../utils/AsyncWrapper");
const ErrorHandler = require("../utils/ErrorHandler");
router.get("/health", (req, res) => {
  return res.status(200).json({ message: "Server is up and running" });
});

router.use("/auth", AuthRoutes);
router.use("/post", PostsRoutes);
router.use("/dashboard", DashboardRoutes);

router.get(
  "/file/:fileName",
  AsyncWrapper(async (req, res, next) => {
    const { fileName } = req.params;
    if (!fileName) {
      return next(new ErrorHandler("File name is required", 400));
    }
    const filePath = path.join(__dirname, `../uploads/${fileName}`);
    console.log(filePath);
    if (!existsSync(filePath)) {
      return next(
        new ErrorHandler("File not found or may have been deleted", 404)
      );
    }
    res.sendFile(filePath);
  })
);
module.exports = router;

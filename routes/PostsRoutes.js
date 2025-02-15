const { validate } = require("express-validation");
const {
  generatePostContent,
  addPost,
  getAllPosts,
} = require("../controllers/PostControler");
const auth = require("../middlewares/Auth");
const { createPostSchema } = require("../validations/PostValidation");
const { upload } = require("../utils/ImageUpload");

const router = require("express").Router();

router
  .route("/")
  .get(auth, getAllPosts)
  .post(auth, upload.single("file"), validate(createPostSchema), addPost);
router.route("/generate-post").post(auth, generatePostContent);

module.exports = router;

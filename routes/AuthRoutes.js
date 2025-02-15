const { validate } = require("express-validation");
const {
  login,
  registerUser,
  autoLogin,
  logout,
  profile,
  addUpdateUserToken,
  updateProfile,
} = require("../controllers/AuthController");
const AuthValidation = require("../validations/AuthValidation");
const auth = require("../middlewares/Auth");
const router = require("express").Router();
const {
  signupSchema,
  signInSchema,
  refreshTokenValidation,
  addUpdateTokenSchema,
} = AuthValidation;

router.post("/signin", validate(signInSchema), login);
router.post("/signup", validate(signupSchema), registerUser);
router.post("/auto-login", validate(refreshTokenValidation), autoLogin);
router.get("/logout", auth, logout);
router.get("/me", auth, profile);
router.patch("/me", auth, updateProfile);
router.patch(
  "/socialToken",
  auth,
  validate(addUpdateTokenSchema),
  addUpdateUserToken
);

module.exports = router;

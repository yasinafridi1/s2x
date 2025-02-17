const User = require("../models/UserModel");
const {
  generateTokens,
  storeTokens,
  verifyRefreshToken,
} = require("../services/JwtService");
const AsyncWrapper = require("../utils/AsyncWrapper");
const { userDto } = require("../utils/DTOs");
const ErrorHandler = require("../utils/ErrorHandler");
const SuccessMessage = require("../utils/SuccessMessage");
const bcrypt = require("bcrypt");

const login = AsyncWrapper(async (req, res, next) => {
  const { password, email } = req.body;

  let user = await User.findOne({ email: email });

  if (!user) {
    return next(new ErrorHandler(`Incorrect email or password`, 422));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler(`Incorrect email or password`, 422));
  }

  const { accessToken, refreshToken } = generateTokens({
    _id: user._id,
    role: user.role,
  });

  await storeTokens(accessToken, refreshToken, user._id);
  return SuccessMessage(res, "Logged in successfully", {
    userData: userDto(user),
    accessToken,
    refreshToken,
  });
});

const registerUser = AsyncWrapper(async (req, res, next) => {
  let { fullName, email, password } = req.body;

  const existingUser = await User.exists({ email });

  if (existingUser) {
    return next(new ErrorHandler("User already exists", 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Sequelize create a new user
  const user = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  const result = await user.save();

  if (!result) {
    return next(new ErrorHandler("Failed to register user", 500));
  }
  return SuccessMessage(
    res,
    "Account created successfully",
    await userDto(result)
  );
});

const autoLogin = AsyncWrapper(async (req, res, next) => {
  const { refreshToken: refreshTokenFromBody } = req.body;
  const user = await verifyRefreshToken(refreshTokenFromBody);
  const { accessToken, refreshToken } = generateTokens({
    _id: user._id,
    role: user.role,
  });

  await storeTokens(accessToken, refreshToken, user._id);
  return SuccessMessage(res, "Logged in successfully", {
    userData: userDto(user),
    accessToken,
    refreshToken,
  });
});

const logout = AsyncWrapper(async (req, res, next) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, {
    accessToken: null,
    refreshToken: null,
  });

  return SuccessMessage(res, "Logged out successfully");
});

const profile = AsyncWrapper(async (req, res, next) => {
  const { _id } = req.user;
  const userData = await User.findById(_id);
  if (!userData) {
    return next(new ErrorHandler("User not found", 404));
  }
  return SuccessMessage(
    res,
    "User data fetched successfully",
    userDto(userData)
  );
});

const updateProfile = AsyncWrapper(async (req, res, next) => {
  const { fullName, email, password } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
  }
  user.fullName = fullName;
  user.email = email;
  const result = await user.save();
  if (!result) {
    return next(new ErrorHandler("Failed to update user profile", 500));
  }
  return SuccessMessage(
    res,
    "User profile updated successfully",
    userDto(user)
  );
});

const addUpdateUserToken = AsyncWrapper(async (req, res, next) => {
  const { token, pageId, userId, type } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (type === "facebook") {
    user.facebook = {
      token,
      pageId,
    };
  } else if (type === "twitter") {
    user.twitter = token;
  } else if (type === "instagram" || type === "linkedin") {
    user[type] = {
      token,
      userId,
    };
  } else {
    return next(new ErrorHandler("Invalid type", 422));
  }

  const result = await user.save();
  console.log("USer ===>", result);

  return SuccessMessage(res, "Social keys updated successfully", {
    userData: userDto(result),
  });
});

module.exports = {
  registerUser,
  login,
  autoLogin,
  logout,
  profile,
  addUpdateUserToken,
  updateProfile,
};

const jwt = require("jsonwebtoken");
const { envVariables } = require("../config/Constants");
const User = require("../models/UserModel");
const { accessTokenSecret, refreshTokenSecret } = envVariables;

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(payload, refreshTokenSecret, {
    expiresIn: "1d",
  });

  return { accessToken, refreshToken };
};

const storeTokens = async (accessToken, refreshToken, userId) => {
  return await User.updateOne(
    { _id: userId },
    { activeAccessToken: accessToken, refreshToken: refreshToken }
  );
};

const verifyAccessToken = async (token) => {
  try {
    const userData = jwt.verify(token, accessTokenSecret);
    if (userData) {
      const dbUser = await User.findOne({ activeAccessToken: token });
      if (!dbUser) throw new Error("User not found");
      return userData;
    }
    throw error;
  } catch (error) {
    error.statusCode = 401; // Set custom status code for token verification errors
    error.message = "Token expired";
    throw error;
  }
};

const verifyRefreshToken = async (token) => {
  try {
    const userData = jwt.verify(token, refreshTokenSecret);
    if (userData) {
      const dbUser = await User.findOne({ refreshToken: token });
      if (!dbUser) throw new Error("User not found");
      return dbUser;
    }
    throw error;
  } catch (error) {
    error.statusCode = 401; // Set custom status code for token verification errors
    error.message = "Token expired";
    throw error;
  }
};

module.exports = {
  generateTokens,
  storeTokens,
  verifyAccessToken,
  verifyRefreshToken,
};

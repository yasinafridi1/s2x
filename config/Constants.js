require("dotenv").config();
const envVariables = {
  appPort: process.env.PORT,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  mongoDbURI: process.env.MONGODB_URI,
  openAiSecretKey: process.env.OPEN_AI_SECRET_KEYS,
};

module.exports = {
  envVariables,
};

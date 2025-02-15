const AsyncWrapper = require("../utils/AsyncWrapper");
const ErrorHandler = require("../utils/ErrorHandler");
const fileValidation = require("../validations/FileValidation");

const fileValidator = AsyncWrapper(async (req, res, next) => {
  const { error } = fileValidation.file.validate(req.file);

  if (error) {
    return next(new ErrorHandler("File is required", 422));
  }

  next();
});

module.exports = fileValidator;

const SuccessMessage = (res, message, data = null, status = 200) => {
  console.log(message);
  return res.status(status).json({
    success: true,
    message,
    ...(data && {
      data,
    }),
  });
};
module.exports = SuccessMessage;

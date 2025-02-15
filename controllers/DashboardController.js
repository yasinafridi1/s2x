const SuccessMessage = require("../utils/SuccessMessage");
const AsyncWrapper = require("../utils/AsyncWrapper");
const ErrorHandler = require("../utils/ErrorHandler");
const PostModel = require("../models/PostModel");

const getDashboardCardsData = AsyncWrapper(async (req, res, next) => {
  const result = await PostModel.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: "$socialApp",
        count: { $sum: 1 },
      },
    },
  ]);

  const counts = { facebook: 0, linkedin: 0, instagram: 0, twitter: 0 };
  result.forEach((item) => {
    counts[item._id] = item.count;
  });

  const totalPosts = await PostModel.countDocuments({ user: req.user._id });

  return SuccessMessage(res, "Data fetched successfully", {
    totalPosts,
    counts,
  });
});

const getChartsData = AsyncWrapper(async (req, res, next) => {});

module.exports = {
  getDashboardCardsData,
  getChartsData,
};

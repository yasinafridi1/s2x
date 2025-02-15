const SuccessMessage = require("../utils/SuccessMessage");
const AsyncWrapper = require("../utils/AsyncWrapper");
const { OpenAI } = require("openai");
const { envVariables } = require("../config/Constants");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../models/UserModel");
const { default: axios } = require("axios");
const PostModel = require("../models/PostModel");
const { openAiSecretKey } = envVariables;

const openai = new OpenAI({
  apiKey: openAiSecretKey,
});

const generatePostContent = AsyncWrapper(async (req, res, next) => {
  const { description, hashtags } = req.body;

  // const userPrompt = `
  //   Create 5 creative social media post samples based on the following description:
  //   "${description}" and also generate some hashtags related to these hashtags:"${hashtags}".
  //   Each post should be unique, engaging, and tailored for social media audiences.
  //   Provide each post as a numbered list in plain text format.
  // `;

  // const response = await openai.chat.completions.create({
  //   model: "gpt-4", // Adjust model if needed (e.g., "gpt-3.5-turbo")
  //   messages: [
  //     {
  //       role: "system",
  //       content: "You are an assistant that generates social media posts.",
  //     },
  //     {
  //       role: "user",
  //       content: userPrompt,
  //     },
  //   ],
  //   max_tokens: 500,
  //   temperature: 0.7,
  //   n: 1, // Single response for clarity
  // });

  // // Extract and process the response
  // const content = response.choices[0]?.message?.content || "";
  // const samples = content
  //   .split("\n")
  //   .filter((line) => line.trim()) // Remove empty lines
  //   .map((line, index) => ({
  //     no: index + 1,
  //     description: line.replace(/^\d+\.\s*/, "").trim(), // Remove numbering like "1. " or "2. "
  //   }));
  const samples = [
    {
      no: 1,
      description:
        '"🎓 I\'ve just taken a giant leap into the world of ones and zeros! 🖥️ Proud to announce my graduation in Software Engineering from City University Peshawar! Looking forward to code, innovate, and create! #graduation #cusitians #cs #programmer"',
    },
    {
      no: 2,
      description:
        '"Achievement Unlocked 🎮! Officially a graduate in Software Engineering from the esteemed City University, Peshawar. Can\'t wait to start this exciting new chapter in my life! #graduation #cusitians #cs #programmer"',
    },
    {
      no: 3,
      description:
        '"Just added a new title to my name - Software Engineer! 🎓 Thrilled to have graduated from City University, Peshawar. Ready to debug the world one line of code at a time! #graduation #cusitians #cs #programmer"',
    },
    {
      no: 4,
      description:
        '"From late-night coding sessions to finally donning the graduation cap! 🎓 Officially a Software Engineering graduate from City University, Peshawar! Here\'s to a future filled with innovation and creativity! #graduation #cusitians #cs #programmer"',
    },
  ];
  return SuccessMessage(
    res,
    "Post content samples generated successfully",
    samples
  );
});

const addPost = AsyncWrapper(async (req, res, next) => {
  const { description, type } = req.body;
  const newPost = new PostModel({
    text: description,
    socialApp: type,
    user: req.user._id,
    image: req.file ? req.file.filename : null,
  });

  const result = await newPost.save();
  if (!result) {
    return next(new ErrorHandler("Failed to add post", 500));
  }
  return SuccessMessage(res, "Post added successfully", result);
});

const getAllPosts = AsyncWrapper(async (req, res, next) => {
  const posts = await PostModel.find({ user: req.user._id });
  return SuccessMessage(res, "All posts fetched successfully", posts);
});

module.exports = {
  generatePostContent,
  addPost,
  getAllPosts,
};

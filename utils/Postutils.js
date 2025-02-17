const axios = require("axios");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");

const postToFacebook = async (accessToken, pageId, postText, postImage) => {
  try {
    if (postImage) {
      const imagePath = path.join(__dirname, "../uploads", postImage);
      const imageStream = fs.createReadStream(imagePath);
      const formData = new FormData();
      formData.append("source", imageStream);
      formData.append("caption", postText || "Uploaded via API");
      formData.append("access_token", accessToken);

      const response = await axios.post(
        `https://graph.facebook.com/v22.0/${pageId}/photos`,
        formData,
        { headers: { ...formData.getHeaders() } }
      );
      console.log("Facebook Response ===>", response.data);
    } else {
      const response = await axios.post(
        `https://graph.facebook.com/v22.0/${pageId}/feed`,
        { message: postText, access_token: accessToken }
      );
      console.log("Facebook Response ===>", response.data);
    }
  } catch (error) {
    console.error(
      "Error posting to Facebook:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const postToLinkedIn = async (accessToken, userId, postText, postImage) => {
  try {
    let mediaAsset = null;

    if (postImage) {
      // Step 1: Register the image upload
      const imageRegisterResponse = await axios.post(
        "https://api.linkedin.com/v2/assets?action=registerUpload",
        {
          registerUploadRequest: {
            recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
            owner: `urn:li:person:${userId}`,
            serviceRelationships: [
              {
                relationshipType: "OWNER",
                identifier: "urn:li:userGeneratedContent",
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
            "Content-Type": "application/json",
          },
        }
      );

      const uploadUrl =
        imageRegisterResponse.data.value.uploadMechanism[
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ].uploadUrl;

      mediaAsset = imageRegisterResponse.data.value.asset;

      // Step 2: Upload the image
      const imagePath = path.join(__dirname, "../uploads", postImage);
      const imageBuffer = fs.readFileSync(imagePath);

      await axios.put(uploadUrl, imageBuffer, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "image/jpeg",
        },
      });
    }

    // Step 3: Create the LinkedIn post with the image
    const postBody = {
      author: `urn:li:person:${userId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: postText },
          shareMediaCategory: postImage ? "IMAGE" : "NONE",
          media: postImage
            ? [
                {
                  status: "READY",
                  media: mediaAsset,
                },
              ]
            : [],
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const postResponse = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      postBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("LinkedIn Post Response ===>", postResponse.data);
  } catch (error) {
    console.error(
      "Error posting to LinkedIn:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const postToTwitter = async (accessToken, postText, postImage) => {
  try {
    let mediaId = null;

    if (postImage) {
      // Step 1: Upload the image
      const imagePath = path.join(__dirname, "../uploads", postImage);
      const imageData = fs.readFileSync(imagePath);

      const formData = new FormData();
      formData.append("media", imageData, {
        filename: postImage,
        contentType: "image/jpeg",
      });

      const uploadResponse = await axios.post(
        "https://upload.twitter.com/1.1/media/upload.json",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            ...formData.getHeaders(),
          },
        }
      );

      mediaId = uploadResponse.data.media_id_string;
    }

    // Step 2: Post the tweet with the image
    const postBody = {
      text: postText,
      media: mediaId ? { media_ids: [mediaId] } : undefined,
    };

    const response = await axios.post(
      "https://api.twitter.com/2/tweets",
      postBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Twitter Response ===>", response.data);
  } catch (error) {
    console.error(
      "Error posting to Twitter:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const postToInstagram = async (accessToken, userId, postText, postImage) => {
  try {
    const imagePath = path.join(__dirname, "../uploads", postImage);
    const imageStream = fs.createReadStream(imagePath);
    const formData = new FormData();
    formData.append("image_url", imageStream);
    formData.append("caption", postText);
    formData.append("access_token", accessToken);

    const response = await axios.post(
      `https://graph.facebook.com/v12.0/${userId}/media`,
      formData,
      { headers: { ...formData.getHeaders() } }
    );
    console.log("Instagram Response ===>", response.data);
  } catch (error) {
    console.error(
      "Error posting to Instagram:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

module.exports = {
  postToFacebook,
  postToLinkedIn,
  postToTwitter,
  postToInstagram,
};

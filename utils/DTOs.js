const userDto = (data) => {
  return {
    fullName: data?.fullName,
    email: data?.email,
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
    _id: data?._id,
    facebookToken: data?.facebook?.token ? true : false,
    facebookPageId: data?.facebook?.pageId,
    instagramToken: data?.instagram?.token ? true : false,
    instagramUserId: data?.instagram?.userId,
    linkedinToken: data?.linkedin?.token ? true : false,
    linkedinUserId: data?.linkedin?.userId,
    twitter: data?.twitter ? true : false,
  };
};

module.exports = {
  userDto,
};

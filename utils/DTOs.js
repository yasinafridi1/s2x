const userDto = (data) => {
  return {
    fullName: data?.fullName,
    email: data?.email,
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
    _id: data?._id,
    facebook: data?.facebook ? true : false,
    instagram: data?.instagram ? true : false,
    linkedin: data?.linkedin ? true : false,
    twitter: data?.twitter ? true : false,
  };
};

module.exports = {
  userDto,
};

module.exports = {
  generateUserSearchObj: (arr) => {
    const users = [];
    for (i = 0; i < arr.length; i++) {
      console.log(arr);
      const { userId, name, picture, id: friendshipId } = arr[i];
      const obj = {
        userId,
        name,
        picture,
        friendship: {
          id: friendshipId,
          status: "pending",
        },
      };
      users.push(obj);
    }
    return users;
  },
};

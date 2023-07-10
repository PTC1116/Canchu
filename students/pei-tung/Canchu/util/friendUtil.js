module.exports = {
  generateUserSearchObj: (arr) => {
    const users = [];
    for (i = 0; i < arr.length; i++) {
      const { id, name, picture, ID: friendshipId } = arr[i];
      const obj = {
        id,
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

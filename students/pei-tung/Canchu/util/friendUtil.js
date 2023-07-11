module.exports = {
  generateUserSearchObj: (arr, status) => {
    const users = [];
    for (i = 0; i < arr.length; i++) {
      const { userId, name, picture, id: friendshipId } = arr[i];
      const obj = {
        id: userId,
        name,
        picture,
        friendship: {
          id: friendshipId,
          status,
        },
      };
      users.push(obj);
    }
    return users;
  },
};

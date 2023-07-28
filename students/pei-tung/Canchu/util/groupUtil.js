module.exports = {
  generatePendingObj: (arr) => {
    const users = [];
    for (let i = 0; i < arr.length; i++) {
      const { id, name, picture, status } = arr[i];
      const obj = { id, name, picture, status };
      users.push(obj);
    }
    return users;
  },
};

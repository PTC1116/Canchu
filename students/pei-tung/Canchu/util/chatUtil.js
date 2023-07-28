module.exports = {
  generateAllMsgObj: (arr, itemsPerPage) => {
    const messages = [];
    for (let i = 0; i < itemsPerPage; i++) {
      if (arr[i] === undefined) {
        return messages;
      }
      const { id, message, created_at, userId, name, picture } = arr[i];
      const obj = {
        id,
        message,
        created_at,
        user: { id: userId, name, picture },
      };
      messages.push(obj);
    }
    return messages;
  },
};

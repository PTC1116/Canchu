module.exports = {
  generateEventObj: (arr) => {
    const events = [];
    arr.forEach((el) => {
      const { id, type, is_read, picture, created_at, summary } = el;
      const obj = { id, type, is_read, image: picture, created_at, summary };
      events.push(obj);
    });
    return events;
  },
};

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
  generatePostObj: (arr) => {
    const posts = [];
    for (let i = 0; i < arr.length; i++) {
      const { id, user_id, created_at, context, picture, name } = arr[i];
      const obj = {
        id,
        user_id,
        created_at,
        context,
        is_liked: false,
        like_count: 0,
        comment_count: 0,
        picture,
        name,
      };
      posts.push(obj);
    }
    return posts;
  },
};

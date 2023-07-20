module.exports = {
  generatePostSearchObj: (arr, itemsPerPage) => {
    let posts = [];
    for (let i = 0; i < itemsPerPage; i++) {
      if (arr[i] === undefined) {
        return posts;
      }
      const {
        id,
        user_id,
        created_at,
        context,
        is_liked,
        like_count,
        comment_count,
        picture,
        name,
      } = arr[i];
      const obj = {
        id,
        user_id,
        created_at,
        context,
        is_liked,
        like_count,
        comment_count,
        picture,
        name,
      };
      posts.push(obj);
    }
    return posts;
  },
};

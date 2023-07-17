module.exports = {
  generatePostSearchObj: (arr) => {
    let posts = [];
    for (let i = 0; i < arr.length; i++) {
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
      if (arr[i].is_liked == 0) {
        arr[i].is_liked = false;
      } else {
        arr[i].is_liked = true;
      }
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

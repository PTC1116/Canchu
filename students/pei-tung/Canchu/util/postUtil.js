module.exports = {
  generatePostSearchObj: (arr) => {
    let posts = [];
    console.log(arr);
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
    // console.log(posts);
    return posts;
  },
};

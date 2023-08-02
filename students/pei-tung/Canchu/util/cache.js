const redis = require('redis');
const errMsg = require('../util/errorMessage');

module.exports = {
  generateProfileKey(targetId) {
    const key = `profile_${targetId.toString()}:`;
    return key;
  },
  generateFriendshipKey(myId, targetId) {
    const key = `friendship_${myId.toString()}_${targetId.toString()}:`;
    return key;
  },
  getProfile: async (targetId) => {
    // const client = redis.createClient();
    const client = redis.createClient({ url: 'redis://redis:6379' });
    try {
      await client.connect();
      const key = module.exports.generateProfileKey(targetId);
      const profileData = await client.get(key);
      return JSON.parse(profileData);
    } catch (err) {
      throw errMsg.redisError;
    } finally {
      await client.disconnect();
    }
  },
  getFriendship: async (myId, targetId) => {
    // const client = redis.createClient();
    const client = redis.createClient({ url: 'redis://redis:6379' });
    try {
      await client.connect();
      const key = module.exports.generateFriendshipKey(myId, targetId);
      const friendshipData = await client.get(key);
      return JSON.parse(friendshipData);
    } catch (err) {
      throw errMsg.redisError;
    } finally {
      await client.disconnect();
    }
  },
  saveProfile: async (obj) => {
    // const client = redis.createClient();
    const client = redis.createClient({ url: 'redis://redis:6379' });
    try {
      const { id, name, picture, introduction, tags } = obj;
      const profileCache = {
        id,
        name,
        picture,
        introduction,
        tags,
      };
      await client.connect();
      const userId = obj.id;
      const key = module.exports.generateProfileKey(userId);
      await client.set(key, JSON.stringify(profileCache));
    } catch (err) {
      throw errMsg.redisError;
    } finally {
      await client.disconnect();
    }
  },
  saveFriendship: async (myId, targetId, obj) => {
    // const client = redis.createClient();
    const client = redis.createClient({ url: 'redis://redis:6379' });
    try {
      const { friend_count, friendship } = obj;
      const friendshipCache = { friend_count, friendship };
      await client.connect();
      const key = module.exports.generateFriendshipKey(myId, targetId);
      await client.set(key, JSON.stringify(friendshipCache));
    } catch (err) {
      throw errMsg.redisError;
    } finally {
      await client.disconnect();
    }
  },
  delete: async (cacheType, targetId, myId) => {
    // const client = redis.createClient();
    const client = redis.createClient({ url: 'redis://redis:6379' });
    try {
      await client.connect();
      let key;
      if (cacheType === 'profile') {
        key = module.exports.generateProfileKey(targetId);
      } else if (cacheType === 'friendship') {
        key = module.exports.generateFriendshipKey(myId, targetId);
      }
      await client.del(key);
    } catch (err) {
      throw errMsg.redisError;
    } finally {
      await client.disconnect();
    }
  },
};

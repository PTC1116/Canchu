const errMsg = require('../util/errorMessage');
const redis = require('redis');

module.exports = {
  tenReqPerSec: async (req, res, next) => {
    const client = redis.createClient();
    try {
      const clientIP =
        req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const maxRequestsPerSec = 10;
      const cacheTTL = 1;
      const blockListTTL = 300; //300;
      await client.connect();
      const key = clientIP;
      const userVisitCount = await client.get(key);
      if (userVisitCount > maxRequestsPerSec) {
        await client
          .multi()
          .sAdd('block_list:', clientIP)
          .expire('block_list:', blockListTTL)
          .exec();
        throw errMsg.generateMsg(429, 'Too Many Request');
      }
      if (!userVisitCount) {
        console.log('adding value');
        await client.set(key, 1, { EX: cacheTTL, NX: true });
      } else {
        await client.incr(key);
      }
    } catch (err) {
      if (err.status === 429) {
        return res.status(err.status).send({ err: err.error });
      } else {
        console.log(err);
        return res
          .status(errMsg.redisError.status)
          .send({ err: errMsg.redisError.error });
      }
    } finally {
      await client.disconnect();
    }
    next();
  },
  checkBlockList: async (req, res, next) => {
    const client = redis.createClient();
    try {
      const clientIP =
        req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await client.connect();
      const key = 'block_list:';
      const userStatus = await client.SISMEMBER(key, clientIP);
      if (userStatus === true) {
        throw errMsg.generateMsg(
          429,
          'Please wait for at least 5 minutes before making another request.',
        );
      }
    } catch (err) {
      if (err.status === 429) {
        return res.status(err.status).send({ err: err.error });
      } else {
        return res
          .status(errMsg.redisError.status)
          .send({ err: redisError.error });
      }
    } finally {
      await client.disconnect();
    }
    next();
  },
};

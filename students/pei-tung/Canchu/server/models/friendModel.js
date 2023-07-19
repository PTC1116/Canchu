const mysql = require('mysql2');
const errMsg = require('../../util/errorMessage');

const setPool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

const pool = setPool.promise();

module.exports = {
  showAllFriends: async (id) => {
    const conn = await pool.getConnection();
    try {
      const friendStatus = 'friend';
      /*const findFriends = `
      SELECT users.id AS userId, name, picture, friends.id AS friendId 
      FROM users 
      INNER JOIN friends ON (users.id = friends.receiver_id AND requester_id = ? AND status = ?) 
      UNION
      SELECT users.id AS userId, name, picture, friends.id AS friendId FROM users 
      INNER JOIN friends ON (users.id = friends.requester_id AND receiver_id = ? AND status = ?)
      ORDER BY userId`;*/
      const findFriends = `
      SELECT users.id AS userId, name, picture, friends.id AS friendId 
      FROM users 
      INNER JOIN friends ON users.id = friends.receiver_id
      WHERE requester_id = ? AND status = ?
      UNION
      SELECT users.id AS userId, name, picture, friends.id AS friendId 
      FROM users 
      INNER JOIN friends ON users.id = friends.requester_id
      WHERE receiver_id = ? AND status = ?`;
      const [result] = await conn.query(findFriends, [
        id,
        friendStatus,
        id,
        friendStatus,
      ]);
      console.log('result:', result);
      return result;
    } catch (err) {
      console.log(err);
      throw errMsg.dbError;
    } finally {
      await conn.release;
    }
  },
  pending: async (id) => {
    const conn = await pool.getConnection();
    try {
      // pending 的條件：status = "requested" && receiver_id = myId
      const status = 'requested';
      const findPendingList = `
        SELECT users.id AS userId, name, picture, friends.id AS friendId 
        FROM users INNER JOIN friends ON users.id = friends.requester_id 
        WHERE friends.receiver_id = ? AND status = ?;`;
      const [pendingList] = await conn.query(findPendingList, [id, status]);
      return pendingList;
    } catch (err) {
      console.log(err);
      throw errMsg.dbError;
    } finally {
      await conn.release();
    }
  },
  request: async (myId, receiverId) => {
    const conn = await pool.getConnection();
    try {
      const checkStatus = `
        SELECT * FROM friends 
        WHERE (requester_id = ? AND receiver_id = ?) 
        OR (requester_id = ? AND receiver_id = ?)`;
      const [[friendshipStatus]] = await conn.query(checkStatus, [
        myId,
        receiverId,
        receiverId,
        myId,
      ]);
      if (friendshipStatus) {
        if (friendshipStatus.status === 'friend') {
          throw errMsg.generateMsg(403, 'You Are Already Friends');
        } else if (
          friendshipStatus.status === 'requested' &&
          friendshipStatus.receiver_id === myId
        ) {
          throw errMsg.generateMsg(
            403,
            'The User Has Already Sent You A Friend Request',
          );
        } else if (
          friendshipStatus.status === 'requested' &&
          friendshipStatus.receiver_id === receiverId
        ) {
          throw errMsg.generateMsg(403, 'Your Friend Request Is Still Pending');
        }
      }
      const status = 'requested';
      const insert =
        'INSERT INTO friends (requester_id, receiver_id, status) VALUES(?,?,?)';
      await conn.query(insert, [myId, receiverId, status]);
      const findFriendshipId =
        'SELECT id FROM friends WHERE requester_id = ? AND receiver_id = ?';
      const [[result]] = await conn.query(findFriendshipId, [myId, receiverId]);
      return result.id;
    } catch (err) {
      if (err.status === 403) {
        throw err;
      } else {
        console.log(err);
        throw errMsg.dbError;
      }
    } finally {
      await conn.release();
    }
  },
  agree: async (uId, fId) => {
    const conn = await pool.getConnection();
    try {
      const newStatus = 'friend';
      const originalStatus = 'requested';
      const checkRequestExistenceById =
        'SELECT * FROM friends WHERE id = ? AND receiver_id = ? AND status = ?';
      const [requestExistence] = await conn.query(checkRequestExistenceById, [
        fId,
        uId,
        originalStatus,
      ]);
      if (requestExistence.length === 0) {
        throw errMsg.generateMsg(403, 'Friendship Not Found');
      }
      const updateFriendshipById =
        'UPDATE friends SET status = ? WHERE id = ? AND receiver_id = ?';
      await conn.query(updateFriendshipById, [
        newStatus,
        fId,
        uId,
        originalStatus,
      ]);
      return fId;
    } catch (err) {
      if (err.status === 403) {
        throw err;
      } else {
        throw errMes.dbError;
      }
    } finally {
      await conn.release();
    }
  },
  delete: async (uId, fId) => {
    const conn = await pool.getConnection();
    try {
      const checkFriendshipExistenceById = `
      SELECT * FROM friends 
      WHERE (id = ? AND requester_id = ?) 
      OR (id = ? AND receiver_id = ?)`;
      const [friendshipExistence] = await conn.query(
        checkFriendshipExistenceById,
        [fId, uId, fId, uId],
      );
      if (friendshipExistence.length === 0) {
        throw errMsg.generateMsg(403, 'Friendship Not Found');
      }
      const deleteFriendshipById = `
      DELETE from friends
      WHERE (id = ? AND requester_id = ?) 
      OR (id = ? AND receiver_id = ?)`;
      await conn.query(deleteFriendshipById, [fId, uId, fId, uId]);
      return fId;
      /*
      const invitationStatus = 'requested';
      const findInvitation =
        'SELECT * FROM friends WHERE id = ? AND requester_id = ? AND status = ?';
      const findResult = await conn.query(findInvitation, [
        fId,
        uId,
        invitationStatus,
      ]);
      // withdraw invitation
      if (findResult[0].length > 0) {
        const withdrawInvitation =
          'DELETE from friends WHERE id = ? AND requester_id = ? AND status = ?';
        const a = await conn.query(withdrawInvitation, [
          fId,
          uId,
          invitationStatus,
        ]);
        return fId;
      } else {
        const findFriendship =
          'SELECT * FROM friends WHERE (id = ? AND requester_id = ?) OR (id = ? AND receiver_id= ?)';
        const findFriendshipResult = await conn.query(findFriendship, [
          fId,
          uId,
          fId,
          uId,
        ]);
        if (findFriendshipResult[0].length === 0) {
          throw errMes.clientError;
        }
        const deleteFriend =
          'DELETE FROM friends WHERE (id = ? AND requester_id = ?) OR (id = ? AND receiver_id= ?)';
        await conn.query(deleteFriend, [fId, uId, fId, uId]);
        return fId;
      }*/
    } catch (err) {
      if (err.status === 403) {
        throw err;
      } else {
        console.log(err);
        throw errMsg.dbError;
      }
    } finally {
      await conn.release();
    }
  },
  findRequesterByFriendshipId: async (friendshipId) => {
    const conn = await pool.getConnection();
    try {
      const query = 'SELECT requester_id FROM friends WHERE id = ?';
      const [[result]] = await conn.query(query, [friendshipId]);
      return result.requester_id;
    } catch (err) {
      throw errMsg.dbError;
    } finally {
      await conn.release();
    }
  },
};

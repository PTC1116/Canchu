const eventModel = require('../models/eventModel');
const eventUtil = require('../../util/eventUtil');

module.exports = {
  getEvent: async (req, res) => {
    try {
      const recipientId = req.userData.id;
      const allNotif = await eventModel.getEvent(recipientId);
      const events = eventUtil.generateEventObj(allNotif);
      const successObj = { data: { events } };
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
  readEvent: async (req, res) => {
    try {
      const eventId = req.params.event_id * 1;
      const recipientId = req.userData.id;
      const id = await eventModel.readEvent(eventId, recipientId);
      const successObj = { data: { event: { id } } };
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
};

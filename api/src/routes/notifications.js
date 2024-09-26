const express = require('express');
const {
  getNotifications,
  getUnreadNotifications,
  viewNotification,
  sendNotificationReq,
  unviewNotification,
} = require('../handlers/notifications');

const router = express.Router();

router.get('/users/:userId', getNotifications);
router.get('/unread/users/:userId', getUnreadNotifications);
router.get('/view/:id', viewNotification);
router.post('/:userId', sendNotificationReq);
router.get('/unview/:id', unviewNotification);

module.exports = router;

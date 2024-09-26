const prisma = require('../services/database');
const { io } = require('../services/sockets');
const { sendNotification } = require('../services/sockets');

const getNotifications = async (req, res, next) => {
  const userId = Number(req.params.userId) || 0;
  const notifications = await prisma.notifications.findMany({
    where: {
      Users: {
        every: {
          id: {
            equals: userId,
          },
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
  });
  res.json({ notifications });
};

const getUnreadNotifications = async (req, res, next) => {
  const userId = Number(req.params.userId) || 0;
  const notifications = await prisma.notifications.findMany({
    where: {
      Users: {
        every: {
          id: {
            equals: userId,
          },
        },
      },
      viewed: {
        equals: false,
      },
    },
    orderBy: {
      id: 'desc',
    },
  });
  res.json({ notifications });
};

const createNotificationReq = async (req, res, next) => {
  const userId = Number(req.params.userId) || 0;
  const notif = await prisma.notifications.create({
    data: {
      content: 'test notif',
      title: 'this is a newest notification',
      Users: {
        connect: [{ id: userId }],
      },
    },
  });
  io.to(`for_lecturer`).emit('notification', notif);
  res.json({ notif });
};

const viewNotification = async (req, res, next) => {
  const id = Number(req.params.id) || 0;

  await prisma.notifications.update({
    where: {
      id,
    },
    data: {
      viewed: true,
      viewedAt: new Date(),
    },
  });
  res.json({ id });
};

const unviewNotification = async (req, res, next) => {
  const id = Number(req.params.id) || 0;

  await prisma.notifications.update({
    where: {
      id,
    },
    data: {
      viewed: false,
      viewedAt: null,
    },
  });
  res.json({ id });
};

const sendNotificationReq = (req, res, next) => {
  const notif = { title: 'test', content: 'kjo duhet te dali' };
  const userIds = [1];
  sendNotification('for_student', userIds, notif);
  res.json();
};

module.exports = {
  getNotifications,
  getUnreadNotifications,
  createNotificationReq,
  viewNotification,
  unviewNotification,
  sendNotificationReq,
};

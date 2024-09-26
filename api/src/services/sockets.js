const { Server } = require('socket.io');

const prisma = require('./database');

const io = new Server(3100, {
  cors: {
    origin: ['http://localhost:5173'],
  },
});

io.on('connection', (socket) => {
  socket.on('join_room', (room) => socket.join(room));

  socket.on('leave_room', (room) => socket.leave(room));
});

const notifyStudents = (notification) =>
  io.to('for_student').emit('notification', notification);

const notifyLecturers = (notification) =>
  io.to('for_lecturer').emit('notification', notification);

const notifySecretaries = (notification) =>
  io.to('for_secretary').emit('notification', notification);

const notifyUser = (userId) => (notification) =>
  io.to(`user${userId}`).emit('notification', notification);

const createNotification = (userIdArr, { content, title }) =>
  prisma.notifications.create({
    data: {
      content,
      title,
      Users: {
        connect: userIdArr.map((id) => ({ id })),
      },
    },
  });

const sendNotification = (room, userIds, notificationObj) =>
  createNotification(userIds, notificationObj).then((notif) =>
    io.to(room).emit('notification', notif)
  );

module.exports = {
  io,
  notifyStudents,
  notifySecretaries,
  notifyLecturers,
  notifyUser,
  sendNotification,
};

const prisma = require('../services/database');
const { io } = require('../services/sockets');

const createTimetable = async (req, res) => {
  const { program, semester, entries } = req.body;

  try {
    const newTimetable = await prisma.timetables.create({
      data: {
        program,
        semester,
        entries: {
          create: entries,
        },
      },
      include: {
        entries: true,
      },
    });
    res.json(newTimetable);
  } catch (error) {
    console.error('Error creating timetable:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const getTimetables = async (req, res) => {
  const { program, semester } = req.query;

  try {
    const timetables = await prisma.timetables.findMany({
      where: {
        program,
        semester,
      },
      include: {
        entries: true,
      },
    });
    res.json(timetables);
  } catch (error) {
    console.error('Error fetching timetables:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateTimetable = async (req, res) => {
  const { id } = req.params;
  const { program, semester, entries } = req.body;

  try {
    const updatedTimetable = await prisma.timetables.update({
      where: { id: parseInt(id) },
      data: {
        program,
        semester,
        entries: {
          // deleteMany: {},
          create: entries.map((entry) => ({
            day: entry.where.day,
            time: entry.where.time,
            subject: entry.data.subject,
          })),
        },
      },
      include: {
        entries: true,
      },
    });

    const users = await prisma.user.findMany({
      where: {
        OR: [{ role: 'Student' }],
      },
      select: {
        id: true,
      },
    });

    for (const user of users) {
      const notification = await prisma.notifications.create({
        data: {
          content: `The timetable for ${program}, semester ${semester} has been updated.`,
          title: 'Timetable Updated',
          Users: {
            connect: { id: user.id },
          },
        },
      });

      io.to(`user${user.id}`).emit('notification', notification);
    }

    res.json(updatedTimetable);
  } catch (error) {
    console.error('Error updating timetable:', error.message);
    res.status(500).json({ error: 'Error updating timetable' });
  }
};

const deleteTimetable = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.timetables.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    console.error('Error deleting timetable:', error.message);
    res.status(500).json({ error: 'Error deleting timetable' });
  }
};

module.exports = {
  createTimetable,
  getTimetables,
  updateTimetable,
  deleteTimetable,
};

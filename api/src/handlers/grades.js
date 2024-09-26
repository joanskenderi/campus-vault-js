const prisma = require('../services/database');
const { io } = require('../services/sockets');

const createGrade = async (req, res) => {
  const newGrade = req.body;

  try {
    const createdGrade = await prisma.grades.create({
      data: {
        userId: newGrade.userId,
        subjectId: newGrade.subjectId,
        midtermGrade: newGrade.midtermGrade,
        seminarGrade: newGrade.seminarGrade,
        finalGrade: newGrade.finalGrade,
      },
    });
    res.status(201).json(createdGrade);
  } catch (error) {
    console.error('Error creating grade:', error);
    res.status(500).json({ error: 'An error occurred while creating grade' });
  }
};

const getGrade = async (req, res) => {
  const { id } = req.params;

  try {
    const grade = await prisma.grades.findUnique({
      where: { id: parseInt(id) },
      include: {
        subject: true,
        user: true,
      },
    });

    if (!grade) {
      return res.status(404).json({ error: 'Grade not found' });
    }
    res.json(grade);
  } catch (error) {
    console.error('Error fetching grade:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching grade data' });
  }
};

const getGrades = async (req, res) => {
  const userId = req.user.id;

  try {
    const grades = await prisma.grades.findMany({
      where: { userId: userId },
      include: {
        subject: {
          select: {
            subject: true,
            credits: true,
            semester: true,
          },
        },
        user: true,
      },
    });
    res.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ error: 'An error occurred while fetching grades' });
  }
};

const updateGrade = async (req, res) => {
  const { id } = req.params;
  const { seminarGrade, midtermGrade, finalGrade } = req.body;

  try {
    const updatedGrade = await prisma.grades.update({
      where: { id: parseInt(id) },
      data: {
        midtermGrade,
        seminarGrade,
        finalGrade,
      },
      include: {
        subject: true,
        user: true,
      },
    });

    const notification = await prisma.notifications.create({
      data: {
        content: `You received an assessment in ${updatedGrade.subject.subject}.`,
        title: 'Grade Updated',
        Users: {
          connect: { id: updatedGrade.userId },
        },
      },
    });

    io.to(`user${updatedGrade.userId}`).emit('notification', notification);

    res.json(updatedGrade);
  } catch (error) {
    console.error('Failed to update grade:', error);
    res.status(500).json({ error: 'Failed to update grade' });
  }
};

module.exports = { createGrade, getGrade, getGrades, updateGrade };

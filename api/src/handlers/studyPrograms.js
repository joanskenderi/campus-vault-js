const prisma = require('../services/database');

const getStudyPrograms = async (req, res) => {
  try {
    const studyPrograms = await prisma.degree.findMany({
      include: {
        Subject: {
          include: {
            Grades: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    res.json(studyPrograms);
  } catch (error) {
    console.error('Error fetching study programs:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching study programs' });
  }
};

module.exports = { getStudyPrograms };

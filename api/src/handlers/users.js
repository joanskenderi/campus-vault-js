const bcrypt = require('bcrypt');
const prisma = require('../services/database');

const createUser = async (req, res) => {
  const newUser = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { personalId: newUser.personalId },
          { matriculationNumber: newUser.matriculationNumber },
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error:
          'A user with this personal ID or matriculation number already exists',
      });
    }

    const role = await prisma.roles.findUnique({
      where: { role: newUser.role },
    });

    if (!role) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    const createdUser = await prisma.user.create({
      data: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        personalId: newUser.personalId,
        dateOfBirth: new Date(newUser.dateOfBirth),
        gender: newUser.gender,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        city: newUser.city,
        address: newUser.address,
        matriculationNumber: newUser.matriculationNumber || null,
        enrolledDegree: newUser.enrolledDegree || null,
        currentSemester: newUser.currentSemester || null,
        academicYear: newUser.academicYear || null,
        password: hashedPassword,
        role: newUser.role,
        rolesId: role.id,
      },
    });

    res.status(201).json(createdUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating user' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(id),
        isDeleted: false,
      },
      include: {
        Roles: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userInfo = {
      firstName: user.firstName,
      lastName: user.lastName,
      personalId: user.personalId,
      dateOfBirth: user.dateOfBirth.toISOString().split('T')[0],
      gender: user.gender,
      emailAddress: user.email,
      phoneNumber: user.phoneNumber,
      city: user.city,
      address: user.address,
      matriculationNumber: user.matriculationNumber,
      enrolledDegree: user.enrolledDegree,
      currentSemester: user.currentSemester,
      academicYear: user.academicYear,
      role: user.Roles.role,
    };

    res.json(userInfo);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while fetching user data' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },

      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        personalId: userData.personalId,
        dateOfBirth: new Date(userData.dateOfBirth),
        gender: userData.gender,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        city: userData.city,
        address: userData.address,
        matriculationNumber: userData.matriculationNumber,
        enrolledDegree: userData.enrolledDegree,
        currentSemester: userData.currentSemester,
        academicYear: userData.academicYear,
      },
      include: {
        Roles: true,
        Subjects: true,
        Notifications: true,
      },
    });

    const updatedUserInfo = {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      personalId: updatedUser.personalId,
      dateOfBirth: updatedUser.dateOfBirth.toISOString().split('T')[0],
      gender: updatedUser.gender,
      emailAddress: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      city: updatedUser.city,
      address: updatedUser.address,
      matriculationNumber: updatedUser.matriculationNumber,
      enrolledDegree: updatedUser.enrolledDegree,
      currentSemester: updatedUser.currentSemester,
      academicYear: updatedUser.academicYear || null,
    };

    res.json(updatedUserInfo);
  } catch (error) {
    console.error('Error updating user data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating user data' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true },
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An error occurred while deleting user' });
  }
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};

const bcrypt = require('bcrypt');

const prisma = require('../src/services/database');

async function main() {
  try {
    // Seed roles
    const studentRole = await prisma.roles.upsert({
      where: { role: 'Student' },
      update: {},
      create: { role: 'Student' },
    });

    const lecturerRole = await prisma.roles.upsert({
      where: { role: 'Lecturer' },
      update: {},
      create: { role: 'Lecturer' },
    });

    const secretaryRole = await prisma.roles.upsert({
      where: { role: 'Secretary' },
      update: {},
      create: { role: 'Secretary' },
    });

    // Seed passwords
    const passwords = {
      student: 'newpassword',
      lecturer: 'newpassword',
      secretary: 'newpassword',
    };

    const hashedPasswords = {
      student: await bcrypt.hash(passwords.student, 10),
      lecturer: await bcrypt.hash(passwords.lecturer, 10),
      secretary: await bcrypt.hash(passwords.secretary, 10),
    };

    // Seed users
    const users = [
      {
        personalId: 'student001',
        matriculationNumber: '2021001',
        firstName: 'Leo',
        lastName: 'Nguyen',
        dateOfBirth: new Date('2000-01-01'),
        gender: 'Male',
        phoneNumber: '0123456789',
        email: 'example@student.com',
        city: 'London',
        address: '123 Main Street',
        role: 'Student',
        rolesId: studentRole.id,
        isDeleted: false,
        password: hashedPasswords.student,
        enrolledDegree: 'Bachelor in Computer Science',
        currentSemester: '1st',
        academicYear: '2021/2024',
      },
      {
        personalId: 'student002',
        matriculationNumber: '2021002',
        firstName: 'Alice',
        lastName: 'Johnson',
        dateOfBirth: new Date('2001-02-02'),
        gender: 'Female',
        phoneNumber: '0123456780',
        email: 'alice@student.com',
        city: 'Berlin',
        address: '234 Maple Street',
        role: 'Student',
        rolesId: studentRole.id,
        isDeleted: false,
        password: hashedPasswords.student,
        enrolledDegree: 'Bachelor in Software Engineering',
        currentSemester: '2nd',
        academicYear: '2021/2024',
      },
      {
        personalId: 'student003',
        matriculationNumber: '2021003',
        firstName: 'Bob',
        lastName: 'Smith',
        dateOfBirth: new Date('2002-03-03'),
        gender: 'Male',
        phoneNumber: '0123456779',
        email: 'bob@student.com',
        city: 'Paris',
        address: '345 Oak Street',
        role: 'Student',
        rolesId: studentRole.id,
        isDeleted: false,
        password: hashedPasswords.student,
        enrolledDegree: 'Bachelor in Information Technology',
        currentSemester: '3rd',
        academicYear: '2021/2024',
      },
      {
        personalId: 'lecturer001',
        firstName: 'Zara',
        lastName: 'Khan',
        dateOfBirth: new Date('1980-05-15'),
        gender: 'Female',
        phoneNumber: '9876543210',
        email: 'example@lecturer.com',
        city: 'New York',
        address: '456 Elm Street',
        role: 'Lecturer',
        rolesId: lecturerRole.id,
        isDeleted: false,
        password: hashedPasswords.lecturer,
      },
      {
        personalId: 'lecturer002',
        firstName: 'Tom',
        lastName: 'Brown',
        dateOfBirth: new Date('1979-08-20'),
        gender: 'Male',
        phoneNumber: '9876543220',
        email: 'tom@lecturer.com',
        city: 'San Francisco',
        address: '567 Pine Street',
        role: 'Lecturer',
        rolesId: lecturerRole.id,
        isDeleted: false,
        password: hashedPasswords.lecturer,
      },
      {
        personalId: 'lecturer003',
        firstName: 'Susan',
        lastName: 'Wilson',
        dateOfBirth: new Date('1985-07-25'),
        gender: 'Female',
        phoneNumber: '9876543230',
        email: 'susan@lecturer.com',
        city: 'Chicago',
        address: '678 Birch Street',
        role: 'Lecturer',
        rolesId: lecturerRole.id,
        isDeleted: false,
        password: hashedPasswords.lecturer,
      },
      {
        personalId: 'secretary001',
        firstName: 'Sofia',
        lastName: 'Costa',
        dateOfBirth: new Date('1975-10-20'),
        gender: 'Female',
        phoneNumber: '2468135790',
        email: 'example@secretary.com',
        city: 'Los Angeles',
        address: '789 Oak Street',
        role: 'Secretary',
        rolesId: secretaryRole.id,
        isDeleted: false,
        password: hashedPasswords.secretary,
      },
      {
        personalId: 'secretary002',
        firstName: 'Peter',
        lastName: 'White',
        dateOfBirth: new Date('1970-11-30'),
        gender: 'Male',
        phoneNumber: '2468135780',
        email: 'peter@secretary.com',
        city: 'Houston',
        address: '890 Pine Street',
        role: 'Secretary',
        rolesId: secretaryRole.id,
        isDeleted: false,
        password: hashedPasswords.secretary,
      },
      {
        personalId: 'secretary003',
        firstName: 'Nina',
        lastName: 'Green',
        dateOfBirth: new Date('1980-12-10'),
        gender: 'Female',
        phoneNumber: '2468135770',
        email: 'nina@secretary.com',
        city: 'Miami',
        address: '901 Cedar Street',
        role: 'Secretary',
        rolesId: secretaryRole.id,
        isDeleted: false,
        password: hashedPasswords.secretary,
      },
    ];

    for (const user of users) {
      await prisma.user.upsert({
        where: {
          personalId: user.personalId,
          matriculationNumber: user.matriculationNumber,
        },
        update: {},
        create: user,
      });
    }

    // Seed degree programs
    const degrees = [
      { id: 1, degree: 'Bachelor in Computer Science', lengthInYears: 3 },
      { id: 2, degree: 'Bachelor in Software Engineering', lengthInYears: 3 },
      { id: 3, degree: 'Bachelor in Information Technology', lengthInYears: 3 },
      { id: 4, degree: 'Master in Computer Science', lengthInYears: 2 },
      { id: 5, degree: 'Master in Software Engineering', lengthInYears: 2 },
    ];

    for (const degree of degrees) {
      await prisma.degree.upsert({
        where: { id: degree.id },
        update: {},
        create: degree,
      });
    }

    // Seed subjects
    const subjects = [
      // Semester 1
      {
        id: 1,
        subject: 'Introduction to Computer Science',
        credits: 3.0,
        degreeId: 1,
        semester: '1',
      },
      {
        id: 2,
        subject: 'Mathematics for Computer Science',
        credits: 4.0,
        degreeId: 1,
        semester: '1',
      },
      {
        id: 3,
        subject: 'Programming Fundamentals',
        credits: 4.0,
        degreeId: 1,
        semester: '1',
      },
      {
        id: 4,
        subject: 'Digital Logic Design',
        credits: 3.0,
        degreeId: 1,
        semester: '1',
      },

      // Semester 2
      {
        id: 5,
        subject: 'Data Structures and Algorithms',
        credits: 4.0,
        degreeId: 1,
        semester: '2',
      },
      {
        id: 6,
        subject: 'Database Systems',
        credits: 3.0,
        degreeId: 1,
        semester: '2',
      },
      {
        id: 7,
        subject: 'Computer Networks',
        credits: 4.0,
        degreeId: 1,
        semester: '2',
      },

      // Semester 3
      {
        id: 8,
        subject: 'Operating Systems',
        credits: 4.0,
        degreeId: 1,
        semester: '3',
      },
      {
        id: 9,
        subject: 'Software Engineering',
        credits: 3.0,
        degreeId: 1,
        semester: '3',
      },
      {
        id: 10,
        subject: 'Web Development',
        credits: 3.0,
        degreeId: 1,
        semester: '3',
      },

      // Semester 4
      {
        id: 11,
        subject: 'Artificial Intelligence',
        credits: 4.0,
        degreeId: 1,
        semester: '4',
      },
      {
        id: 12,
        subject: 'Machine Learning',
        credits: 4.0,
        degreeId: 1,
        semester: '4',
      },

      // Semester 5
      {
        id: 13,
        subject: 'Cybersecurity',
        credits: 3.0,
        degreeId: 1,
        semester: '5',
      },
      {
        id: 14,
        subject: 'Mobile Application Development',
        credits: 3.0,
        degreeId: 1,
        semester: '5',
      },
    ];

    for (const subject of subjects) {
      await prisma.subject.upsert({
        where: { id: subject.id },
        update: {},
        create: subject,
      });
    }

    // Seed grades
    const grades = [
      {
        id: 1,
        midtermGrade: 25,
        seminarGrade: 9,
        finalGrade: 54,
        subjectId: 1,
        userId: 1,
      },
      {
        id: 2,
        midtermGrade: 22,
        seminarGrade: 8,
        finalGrade: 48,
        subjectId: 2,
        userId: 1,
      },
      {
        id: 3,
        midtermGrade: 20,
        seminarGrade: 7,
        finalGrade: 41,
        subjectId: 3,
        userId: 1,
      },
      {
        id: 4,
        midtermGrade: 21,
        seminarGrade: 8,
        finalGrade: 43,
        subjectId: 4,
        userId: 1,
      },
      {
        id: 5,
        midtermGrade: 24,
        seminarGrade: 9,
        finalGrade: 49,
        subjectId: 5,
        userId: 1,
      },
      {
        id: 6,
        midtermGrade: 25,
        seminarGrade: 9,
        finalGrade: 54,
        subjectId: 6,
        userId: 1,
      },
      {
        id: 7,
        midtermGrade: 22,
        seminarGrade: 8,
        finalGrade: 48,
        subjectId: 7,
        userId: 1,
      },
      {
        id: 8,
        midtermGrade: 20,
        seminarGrade: 7,
        finalGrade: 41,
        subjectId: 8,
        userId: 1,
      },
      {
        id: 9,
        midtermGrade: 21,
        seminarGrade: 8,
        finalGrade: 43,
        subjectId: 9,
        userId: 1,
      },
      {
        id: 10,
        midtermGrade: 24,
        seminarGrade: 9,
        finalGrade: 49,
        subjectId: 10,
        userId: 1,
      },
      {
        id: 11,
        midtermGrade: 25,
        seminarGrade: 9,
        finalGrade: 54,
        subjectId: 11,
        userId: 1,
      },
      {
        id: 12,
        midtermGrade: 22,
        seminarGrade: 8,
        finalGrade: 48,
        subjectId: 12,
        userId: 1,
      },
      {
        id: 13,
        midtermGrade: 20,
        seminarGrade: 7,
        finalGrade: 41,
        subjectId: 13,
        userId: 1,
      },
      {
        id: 14,
        midtermGrade: 21,
        seminarGrade: 8,
        finalGrade: 43,
        subjectId: 14,
        userId: 1,
      },
    ];

    for (const grade of grades) {
      await prisma.grades.upsert({
        where: { id: grade.id },
        update: {},
        create: grade,
      });
    }

    // Seed notifications
    const notifications = [
      {
        id: 1,
        title: 'Welcome',
        content: 'Welcome to our platform!',
        viewed: false,
      },
    ];

    for (const notification of notifications) {
      await prisma.notifications.upsert({
        where: { id: notification.id },
        update: {},
        create: notification,
      });
    }

    const timetables = [
      {
        program: 'Bachelor in Computer Science',
        semester: '1st',
        degreeId: 1,
      },
      {
        program: 'Master in Computer Science',
        semester: '3rd',
        degreeId: 4,
      },
    ];

    for (const timetable of timetables) {
      await prisma.timetables.upsert({
        where: {
          program_semester_degreeId: {
            program: timetable.program,
            semester: timetable.semester,
            degreeId: timetable.degreeId,
          },
        },
        update: {},
        create: {
          program: timetable.program,
          semester: timetable.semester,
          degreeId: timetable.degreeId,
        },
      });
    }

    const timetableEntries = [
      // Monday
      {
        timetableId: 1,
        day: 'Monday',
        time: '8:30',
        subject: 'Introduction to Computer Science',
      },
      {
        timetableId: 1,
        day: 'Monday',
        time: '9:30',
        subject: 'Programming Fundamentals',
      },
      {
        timetableId: 1,
        day: 'Monday',
        time: '12:30',
        subject: 'Mathematics for Computer Science',
      },

      // Tuesday
      {
        timetableId: 1,
        day: 'Tuesday',
        time: '10:30',
        subject: 'Programming Fundamentals',
      },
      {
        timetableId: 1,
        day: 'Tuesday',
        time: '11:30',
        subject: 'Digital Logic Design',
      },

      // Thursday
      {
        timetableId: 1,
        day: 'Thursday',
        time: '11:30',
        subject: 'Mathematics for Computer Science',
      },
      {
        timetableId: 1,
        day: 'Thursday',
        time: '13:30',
        subject: 'Digital Logic Design',
      },

      // Friday
      {
        timetableId: 1,
        day: 'Friday',
        time: '12:30',
        subject: 'Introduction to Computer Science',
      },
    ];

    for (const entry of timetableEntries) {
      await prisma.timetableEntry.upsert({
        where: {
          timetableId_day_time: {
            timetableId: entry.timetableId,
            day: entry.day,
            time: entry.time,
          },
        },
        update: {},
        create: {
          timetableId: entry.timetableId,
          day: entry.day,
          time: entry.time,
          subject: entry.subject,
        },
      });
    }

    console.log('Data seeded successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

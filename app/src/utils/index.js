// Ordinal representation of semesters
export const getTitleOrdinal = (title) => {
  switch (title.toLowerCase()) {
    case 'semester 1':
      return 'First Semester';
    case 'semester 2':
      return 'Second Semester';
    case 'semester 3':
      return 'Third Semester';
    case 'semester 4':
      return 'Fourth Semester';
    case 'semester 5':
      return 'Fifth Semester';
    case 'semester 6':
      return 'Sixth Semester';
    default:
      return title;
  }
};

// Calculate grade based on total points
export const calculatePoints = (totalPoints) => {
  if (totalPoints >= 91) {
    return 10;
  } else if (totalPoints >= 81) {
    return 9;
  } else if (totalPoints >= 71) {
    return 8;
  } else if (totalPoints >= 61) {
    return 7;
  } else if (totalPoints >= 51) {
    return 6;
  } else if (totalPoints >= 41) {
    return 5;
  } else {
    return 4;
  }
};

// Calculate average grade
export const calculateWeightedAverage = (grades) => {
  const totalWeightedGrades = grades.reduce((acc, grade) => {
    const totalPoints =
      (grade.midtermGrade || 0) +
      (grade.seminarGrade || 0) +
      (grade.finalGrade || 0);

    return acc + calculatePoints(totalPoints) * (grade.subject.credits || 0);
  }, 0);

  const totalCredits = grades.reduce(
    (acc, grade) => acc + (grade.subject.credits || 0),
    0
  );

  const average = totalWeightedGrades / totalCredits;
  return average.toFixed(2);
};

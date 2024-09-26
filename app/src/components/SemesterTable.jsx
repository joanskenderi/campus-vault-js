import FloatingCard from '../ui/FloatingCard';
import {
  calculatePoints,
  calculateWeightedAverage,
  getTitleOrdinal,
} from '../utils';

const semesterTableColumns = [
  {
    header: 'Subject',
    key: 'subject',
    className: 'text-dark-primary dark:text-light-primary',
  },
  {
    header: 'Credits',
    key: 'credits',
    className: 'text-dark-primary dark:text-light-primary',
    textAlign: 'center',
  },
  {
    header: 'Midterm Exam',
    key: 'midterm',
    className: 'text-dark-primary dark:text-light-primary',
    textAlign: 'center',
  },
  {
    header: 'Seminars',
    key: 'seminars',
    className: 'text-dark-primary dark:text-light-primary',
    textAlign: 'center',
  },
  {
    header: 'Final Exam',
    key: 'final',
    className: 'text-dark-primary dark:text-light-primary',
    textAlign: 'center',
  },
  {
    header: 'Total Points',
    key: 'total',
    className: 'text-dark-primary dark:text-light-primary',
    textAlign: 'center',
  },
  {
    header: 'Final Grade',
    key: 'grade',
    className: 'text-dark-primary dark:text-light-primary',
    textAlign: 'center',
  },
];

const SemesterTable = ({ title, grades }) => {
  const semesterData = {};

  grades.forEach((grade) => {
    if (!semesterData[grade.subject.semester]) {
      semesterData[grade.subject.semester] = [];
    }
    semesterData[grade.subject.semester].push(grade);
  });

  return (
    <FloatingCard title={getTitleOrdinal(title)}>
      <div className="flex flex-col">
        <div className="grid grid-cols-7 rounded-sm bg-light-primary dark:bg-dark-secondary sm:grid-cols-7">
          {semesterTableColumns.map((column) => (
            <div
              key={column.key}
              className={`p-2.5 xl:p-5 ${
                column.textAlign === 'center' ? 'text-center' : ''
              }`}
            >
              <h5 className="text-sm font-medium uppercase text-dark-primary dark:text-light-primary">
                {column.header}
              </h5>
            </div>
          ))}
        </div>

        {Object.keys(semesterData).map((semester) => {
          const semesterGrades = semesterData[semester];
          const semesterGrade = calculateWeightedAverage(semesterGrades);

          return (
            <div key={semester}>
              {semesterGrades.map((grade) => (
                <div className="grid grid-cols-7" key={grade.id}>
                  {semesterTableColumns.map((column) => (
                    <div
                      key={column.key}
                      className={`p-2.5 xl:p-5 border-t border-light-tertiary dark:border-dark-quinary ${
                        column.textAlign === 'center'
                          ? 'flex items-center justify-center'
                          : 'flex items-center'
                      }`}
                    >
                      {column.key === 'subject' && (
                        <p className={column.className}>
                          {grade.subject.subject || '-'}
                        </p>
                      )}
                      {column.key === 'credits' && (
                        <p className={column.className}>
                          {grade.subject.credits || '-'}
                        </p>
                      )}
                      {column.key === 'midterm' && (
                        <p className={column.className}>
                          {grade.midtermGrade || '-'}
                        </p>
                      )}
                      {column.key === 'seminars' && (
                        <p className={column.className}>
                          {grade.seminarGrade || '-'}
                        </p>
                      )}
                      {column.key === 'final' && (
                        <p className={column.className}>
                          {grade.finalGrade || '-'}
                        </p>
                      )}
                      {column.key === 'total' && (
                        <p className={column.className}>
                          {(grade.midtermGrade || 0) +
                            (grade.seminarGrade || 0) +
                            (grade.finalGrade || 0)}
                        </p>
                      )}
                      {column.key === 'grade' && (
                        <p className={column.className}>
                          {calculatePoints(
                            (grade.midtermGrade || 0) +
                              (grade.seminarGrade || 0) +
                              (grade.finalGrade || 0)
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              <p className="flex justify-center mt-10 mb-5 text-dark-primary dark:text-light-primary">
                Average grade for {getTitleOrdinal(title).toLowerCase()} is{' '}
                {semesterGrade}
              </p>
            </div>
          );
        })}
      </div>
    </FloatingCard>
  );
};

export default SemesterTable;

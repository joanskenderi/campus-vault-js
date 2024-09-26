import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../ui/Breadcrumb';
import PrintPDFButton from '../ui/PrintPDFButton';
import SemesterTable from '../components/SemesterTable';
import { calculatePoints, calculateWeightedAverage } from '../utils';
import { jwtDecode } from 'jwt-decode';

const url = process.env.REACT_APP_BACKEND_URL;

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(`${url}/grades`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setGrades(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }

        console.error('Error fetching user data:', error);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = jwtDecode(token).id;

    axios
      .get(`${url}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setUserData(response.data))
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }

        console.error('Error fetching user data:', error);
      });
  }, []);

  const handlePrintGradesToPDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;
    doc.setFontSize(12);

    const fullName = userData.firstName + ' ' + userData.lastName;
    const matriculationNumber = userData.matriculationNumber;
    const avgGradeAllSubjects = calculateWeightedAverage(grades);
    const avgGradeText =
      typeof avgGradeAllSubjects === 'number'
        ? avgGradeAllSubjects.toFixed(2)
        : avgGradeAllSubjects;

    doc.text(`${fullName} - ${matriculationNumber}`, 10, yOffset + 5);
    yOffset += 10;
    doc.text(`Average grade: ${avgGradeText}`, 10, yOffset);

    const semesters = Array.from(
      new Set(grades.map((grade) => grade.subject.semester))
    );

    semesters.forEach((semester, index) => {
      const semesterGrades = grades.filter(
        (grade) => grade.subject.semester === semester
      );

      const columns = [
        'SUBJECT',
        'CREDITS',
        'MIDTERM EXAM',
        'FINAL EXAM',
        'SEMINARS',
        'TOTAL POINTS',
        'FINAL GRADE',
      ];

      const tableRows = semesterGrades.map((grade) => {
        const totalPoints =
          (grade.midtermGrade || 0) +
          (grade.finalGrade || 0) +
          (grade.seminarGrade || 0);

        const finalGrade = calculatePoints(totalPoints);

        return [
          grade.subject.subject,
          grade.subject.credits,
          grade.midtermGrade || '-',
          grade.finalGrade || '-',
          grade.seminarGrade || '-',
          totalPoints,
          finalGrade,
        ];
      });

      doc.text(`Semester ${semester}`, 14, yOffset + 20);

      doc.autoTable({
        head: [columns],
        body: tableRows,
        startY: yOffset + 30,
        theme: 'grid',
        headStyles: { fillColor: '#1e293b' },
        margin: { top: 5 },
      });

      yOffset =
        doc.autoTable.previous.finalY + (index < semesters.length - 1 ? 10 : 0);
    });

    doc.save(`${fullName} - Grades.pdf`);
    toast.success('PDF generated successfully!');
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Grades" />

      <div className="flex flex-col gap-5">
        {grades.length > 0 && (
          <div className="flex flex-col gap-5">
            {Array.from(
              new Set(grades.map((grade) => grade.subject.semester))
            ).map((semester) => (
              <SemesterTable
                key={semester}
                title={`Semester ${semester}`}
                semester={semester}
                grades={grades.filter(
                  (grade) => grade.subject.semester === semester
                )}
              />
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mb-5">
          <p className="text-dark-primary dark:text-light-primary">
            Overall average grade is {calculateWeightedAverage(grades)}
          </p>
          <PrintPDFButton handlePrintToPDF={handlePrintGradesToPDF} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Grades;

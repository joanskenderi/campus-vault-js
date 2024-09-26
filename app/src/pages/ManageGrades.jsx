import { useEffect, useState } from 'react';
import axios from 'axios';

import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../ui/Breadcrumb';
import StaticCard from '../ui/StaticCard';
import EditGrade from '../components/EditGrade';
import FormDropdown from '../components/FormDropdown';

const url = process.env.REACT_APP_BACKEND_URL;

const ManageGrades = () => {
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [studyPrograms, setStudyPrograms] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(`${url}/study-programs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setStudyPrograms(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }

        console.error('Error fetching user data:', error);
      });
  }, []);

  const handleProgramChange = (e) => {
    setSelectedProgram(e.target.value);
    setSelectedSubject('');
    setGrades([]);
  };

  const handleSubjectChange = (e) => {
    const subject = e.target.value;
    setSelectedSubject(subject);

    const selectedProgramData = studyPrograms.find(
      (program) => program.degree === selectedProgram
    );

    const selectedSubjectData = selectedProgramData.Subject.find(
      (s) => s.subject === subject
    );

    if (selectedSubjectData) {
      setGrades(selectedSubjectData.Grades);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Manage Grades" />

      <StaticCard title="Edit Grade">
        <FormDropdown
          name="studyProgram"
          value={selectedProgram}
          onChange={handleProgramChange}
          options={studyPrograms.map((program) => program.degree)}
        />

        {selectedProgram && (
          <FormDropdown
            name="subject"
            value={selectedSubject}
            onChange={handleSubjectChange}
            options={
              studyPrograms
                .find((program) => program.degree === selectedProgram)
                ?.Subject.map((subject) => subject.subject) || []
            }
          />
        )}

        {selectedSubject && <EditGrade grades={grades} />}
      </StaticCard>
    </DefaultLayout>
  );
};

export default ManageGrades;

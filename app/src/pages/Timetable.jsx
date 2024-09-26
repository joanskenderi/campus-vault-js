import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../ui/Breadcrumb';
import FloatingCard from '../ui/FloatingCard';
import Table from '../components/Table';
import Loader from '../components/Loader';

const url = process.env.REACT_APP_BACKEND_URL;

const Timetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [userProgram, setUserProgram] = useState('');
  const [userSemester, setUserSemester] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      const userId = jwtDecode(token).id;
      try {
        const response = await axios.get(`${url}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { enrolledDegree, currentSemester } = response.data;
        setUserProgram(enrolledDegree);
        setUserSemester(currentSemester);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const fetchTimetable = async (program, semester) => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${url}/timetables`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { program, semester },
        });
        setTimetable(response.data);
      } catch (error) {
        console.error('Error fetching timetable:', error);
      }
    };

    fetchUserDetails().then(() => {
      if (userProgram && userSemester) {
        fetchTimetable(userProgram, userSemester);
      }
    });
  }, [userProgram, userSemester]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Timetable" />
      {timetable ? (
        <FloatingCard title="Weekly Timetable">
          <Table
            degree={timetable.program}
            semester={timetable.semester}
            currentTimetableId={timetable.id}
          />
        </FloatingCard>
      ) : (
        <Loader />
      )}
    </DefaultLayout>
  );
};

export default Timetable;

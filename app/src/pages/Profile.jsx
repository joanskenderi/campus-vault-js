import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';

import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../ui/Breadcrumb';
import FloatingCard from '../ui/FloatingCard';
import DataField from '../components/DataField';
import Loader from '../components/Loader';

export const fields = [
  { label: 'First Name', name: 'firstName', type: 'text' },
  { label: 'Last Name', name: 'lastName', type: 'text' },
  { label: 'Personal ID', name: 'personalId', type: 'text' },
  { label: 'Date of Birth', name: 'dateOfBirth', type: 'date' },
  { label: 'Gender', name: 'gender', type: 'text' },
  { label: 'Email Address', name: 'emailAddress', type: 'email' },
  { label: 'Phone Number', name: 'phoneNumber', type: 'text' },
  { label: 'City', name: 'city', type: 'text' },
  { label: 'Address', name: 'address', type: 'text' },
  { label: 'Matriculation Number', name: 'matriculationNumber', type: 'text' },
  { label: 'Enrolled Degree', name: 'enrolledDegree', type: 'text' },
  { label: 'Current Semester', name: 'currentSemester', type: 'text' },
  { label: 'Academic Year', name: 'academicYear', type: 'text' },
];

const url = process.env.REACT_APP_BACKEND_URL;

const Profile = () => {
  const [formData, setFormData] = useState(null);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = jwtDecode(token).id;

    axios
      .get(`${url}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setFormData(response.data))
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }

        console.error('Error fetching user data:', error);
      });
  }, []);

  if (!formData) {
    return <Loader />;
  }

  const visibleFields =
    role === 'Student'
      ? fields
      : fields.filter(
          (field) =>
            ![
              'matriculationNumber',
              'enrolledDegree',
              'currentSemester',
              'academicYear',
            ].includes(field.name)
        );

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Profile" />

      <div className="w-full">
        <FloatingCard title="Personal Information">
          <div className="p-7">
            <form action="#">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visibleFields.map((field) => (
                  <div key={field.name}>
                    <DataField field={field} formData={formData} />
                  </div>
                ))}
              </div>
            </form>
          </div>
        </FloatingCard>
        {role !== 'Secretary' && (
          <p className="mt-5 text-dark-primary dark:text-light-primary">
            If any of your information is incorrect, please contact the
            secretary{' '}
            <a
              href="mailto:example@secretary.com"
              className="text-light-blue underline"
            >
              here
            </a>{' '}
            to correct it.
          </p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Profile;

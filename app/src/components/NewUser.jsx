import { useEffect, useState } from 'react';
import FormDropdown from './FormDropdown';
import FormField from './FormField';
import { FaSave } from 'react-icons/fa';
import StaticCard from '../ui/StaticCard';
import axios from 'axios';
import toast from 'react-hot-toast';

const roles = ['Student', 'Secretary', 'Lecturer'];
const genders = ['Male', 'Female'];
const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

const url = process.env.REACT_APP_BACKEND_URL;

const initialState = {
  firstName: '',
  lastName: '',
  personalId: '',
  dateOfBirth: '',
  gender: '',
  email: '',
  phoneNumber: '',
  city: '',
  address: '',
  matriculationNumber: '',
  enrolledDegree: '',
  currentSemester: '',
  academicYear: '',
  role: '',
  password: '',
};

const NewUser = ({ users, setUsers }) => {
  const [formData, setFormData] = useState(initialState);
  const [studyPrograms, setStudyPrograms] = useState([]);

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
        console.error('Error fetching study programs:', error);
      });
  }, []);

  const handleSaveClick = () => {
    const token = localStorage.getItem('token');

    axios
      .post(`${url}/users`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFormData(initialState);
        setUsers([...users, response.data]);
        toast.success('User created successfully');
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }
        console.error('Error creating user:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
        toast.error('Error creating user');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="w-full">
      <StaticCard
        title="Create New User"
        actionButton={
          <button
            className="flex items-center gap-2 text-light-blue"
            onClick={handleSaveClick}
          >
            <FaSave />
            Save
          </button>
        }
      >
        <div className="p-7">
          <form>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <FormDropdown
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                options={roles}
              />
              <FormField
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <FormField
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              <FormField
                label="Personal ID"
                type="text"
                name="personalId"
                value={formData.personalId}
                onChange={handleInputChange}
              />
              <FormField
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
              <FormDropdown
                label="Gender"
                name="gender"
                value={formData.gender}
                options={genders}
                onChange={handleInputChange}
              />
              <FormField
                label="Phone Number"
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              <FormField
                label="City"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
              <FormField
                label="Address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
              <FormField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <FormField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />

              {formData.role === 'Student' && (
                <>
                  <FormField
                    label="Matriculation Number"
                    type="text"
                    name="matriculationNumber"
                    value={formData.matriculationNumber}
                    onChange={handleInputChange}
                  />
                  <FormDropdown
                    label="Degree"
                    name="enrolledDegree"
                    value={formData.enrolledDegree}
                    onChange={handleInputChange}
                    options={studyPrograms.map((program) => program.degree)}
                  />
                  <FormDropdown
                    label="Current Semester"
                    name="currentSemester"
                    value={formData.currentSemester}
                    onChange={handleInputChange}
                    options={semesters}
                  />
                  <FormField
                    label="Academic Year"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                  />
                </>
              )}
            </div>
          </form>
        </div>
      </StaticCard>
    </div>
  );
};

export default NewUser;

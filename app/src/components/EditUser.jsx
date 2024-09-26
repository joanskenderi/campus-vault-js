import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaSave } from 'react-icons/fa';

import FormField from './FormField';
import FormDropdown from './FormDropdown';
import StaticCard from '../ui/StaticCard';

const initialvalues = {
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
  role: '',
};

const degrees = ['Bachelors', 'Masters'];
const roles = ['Student', 'Secretary', 'Administrator'];
const genders = ['Male', 'Female'];
const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

const url = process.env.REACT_APP_BACKEND_URL;

const EditUser = ({ users, setUsers }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [formData, setFormData] = useState(initialvalues);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserData(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchUserData = (userId) => {
    const token = localStorage.getItem('token');

    axios
      .get(`${url}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }

        toast.error('Error fetching user data');
      });
  };
  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  const handleSaveChanges = () => {
    const token = localStorage.getItem('token');

    axios
      .put(`${url}/users/${selectedUserId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const newUsers = users.map((user) =>
          user.personalId === response.data.personalId
            ? { ...response.data, email: response.data.emailAddress }
            : user
        );
        setUsers(newUsers);
        setFormData(initialvalues);
        toast.success('User updated successfully');
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }

        console.error('Error updating user:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
        toast.error('Error updating user');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <StaticCard
      title="Edit User"
      actionButton={
        <button
          className="flex items-center gap-2 text-light-blue"
          onClick={handleSaveChanges}
        >
          <FaSave />
          Save
        </button>
      }
    >
      <div className="p-7">
        <select
          id="userSelect"
          name="userSelect"
          className="w-full rounded border bg-light-primary py-3 pl-2 pr-4.5 text-dark-primary dark:bg-dark-secondary dark:text-light-primary focus:outline-none border-light-tertiary dark:border-dark-secondary mb-8"
          onChange={handleUserChange}
          value={selectedUserId}
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName} - {user.email}
            </option>
          ))}
        </select>

        {selectedUserId && (
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
                value={formData.emailAddress}
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
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    options={degrees}
                  />
                  <FormDropdown
                    label="Current Semester"
                    name="currentSemester"
                    value={formData.currentSemester}
                    onChange={handleInputChange}
                    options={semesters}
                  />
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </StaticCard>
  );
};

export default EditUser;

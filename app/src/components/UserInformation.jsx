import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import avatar from '../assets/avatar.jpg';

const url = process.env.REACT_APP_BACKEND_URL;

const UserInformation = () => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = jwtDecode(token).id;

    axios
      .get(`${url}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { firstName, lastName, role } = response.data;
        setUserInfo({ firstName, lastName, role });
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }

        console.error('Error fetching user data:', error);
      });
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-light-primary">
            {userInfo.firstName} {userInfo.lastName}
          </span>
          <div className="h-0.5 w-full bg-gradient-to-r from-light-red to-light-blue"></div>
          <span className="block text-xs text-light-primary">
            {userInfo.role}
          </span>
        </span>
        <span
          className="flex items-center justify-center border rounded-full bg-light-tertiary gap-2 border-none"
          style={{ width: '2.5rem', height: '2.5rem' }}
        >
          <img src={avatar} alt="Avatar" style={{ borderRadius: '50%' }} />
        </span>
      </div>
    </div>
  );
};

export default UserInformation;

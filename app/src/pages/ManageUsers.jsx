import { useEffect, useState } from 'react';
import DeleteUser from '../components/DeleteUser';
import EditUser from '../components/EditUser';
import NewUser from '../components/NewUser';
import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../ui/Breadcrumb';
import Loader from '../components/Loader';
import axios from 'axios';
import toast from 'react-hot-toast';

const url = process.env.REACT_APP_BACKEND_URL;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    axios
      .get(`${url}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }

        toast.error('Error fetching users');
        setIsLoading(false);
      });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Manage Users" />

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <NewUser users={users} setUsers={setUsers} />
          <EditUser users={users} setUsers={setUsers} />
          <DeleteUser
            users={users}
            setUsers={setUsers}
            fetchUsers={fetchUsers}
          />
        </>
      )}
    </DefaultLayout>
  );
};

export default ManageUsers;

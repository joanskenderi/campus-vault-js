import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

import StaticCard from '../ui/StaticCard';
import Modal from '../components/Modal';

const url = process.env.REACT_APP_BACKEND_URL;

const DeleteUser = ({ users, setUsers, fetchUsers }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const token = localStorage.getItem('token');

    axios
      .delete(`${url}/users/${selectedUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success('User deleted successfully');
        setSelectedUserId('');
        fetchUsers();
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }

        console.error('Error deleting user:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
        toast.error('Error deleting user');
      })
      .finally(() => {
        setIsDeleteModalOpen(false);
      });
  };

  const handleUserSelect = (e) => {
    setSelectedUserId(e.target.value);
  };

  return (
    <div>
      <StaticCard
        title="Delete User"
        actionButton={
          <button
            className="flex items-center gap-2 text-dark-red"
            onClick={handleDeleteClick}
            disabled={!selectedUserId}
          >
            <FaTrash />
            Delete
          </button>
        }
      >
        <div className="p-7">
          <select
            className="w-full rounded border bg-light-primary py-3 pl-2 pr-4.5 text-dark-primary dark:bg-dark-secondary dark:text-light-primary focus:outline-none border-light-tertiary dark:border-dark-secondary"
            onChange={handleUserSelect}
            value={selectedUserId}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} - {user.email}
              </option>
            ))}
          </select>
        </div>
      </StaticCard>

      {isDeleteModalOpen && (
        <Modal closeModal={() => setIsDeleteModalOpen(false)}>
          <div className="flex flex-col items-center justify-center">
            <p>Are you sure you want to delete this user?</p>
            <div className="flex mt-4">
              <button
                onClick={confirmDelete}
                className="bg-dark-red hover:bg-light-red text-light-primary font-semibold py-2 px-4 rounded-lg shadow-md mr-2"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-dark-blue hover:bg-light-blue text-light-primary font-semibold py-2 px-4 rounded-lg shadow-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DeleteUser;

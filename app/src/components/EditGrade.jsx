import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaPen, FaSave } from 'react-icons/fa';
import axios from 'axios';

import { calculatePoints } from '../utils';

const url = process.env.REACT_APP_BACKEND_URL;

const EditGrade = ({ grades }) => {
  const [editId, setEditId] = useState(null);
  const [editedGrades, setEditedGrades] = useState(grades);

  const handleEditClick = (id) => {
    setEditId(id);
  };

  const handleSaveClick = (grade) => {
    const token = localStorage.getItem('token');
    axios
      .put(
        `${url}/grades/${grade.id}`,
        {
          midtermGrade: grade.midtermGrade,
          seminarGrade: grade.seminarGrade,
          finalGrade: grade.finalGrade,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setEditId(null);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }

        console.error('Error updating grade:', error);
      });

    toast.success('Grade updated successfully');
  };

  const handleChange = (e, id, field) => {
    const value = parseInt(e.target.value) || 0;
    setEditedGrades((prev) =>
      prev.map((grade) =>
        grade.id === id ? { ...grade, [field]: value } : grade
      )
    );
  };

  return (
    <div className="relative overflow-x-auto mt-4 mb-4 shadow-md sm:rounded-lg">
      <table className="w-full text-left rtl:text-right text-dark-tertiary dark:text-light-tertiary">
        <thead className="text-dark-quinary bg-light-secondary dark:bg-dark-secondary dark:text-light-secondary">
          <tr>
            <th scope="col" className="px-4 py-2">
              Student
            </th>
            <th scope="col" className="px-4 py-2">
              Midterm Points
            </th>
            <th scope="col" className="px-4 py-2">
              Seminar Points
            </th>
            <th scope="col" className="px-4 py-2">
              Final Exam Points
            </th>
            <th scope="col" className="px-4 py-2">
              Total Points
            </th>
            <th scope="col" className="px-4 py-2">
              Grade
            </th>
            <th scope="col" className="px-2 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {editedGrades.map((grade) => (
            <tr
              key={grade.id}
              className="bg-light-primary dark:bg-dark-tertiary"
            >
              <th
                scope="row"
                className="px-6 py-3 font-medium text-dark-secondary dark:text-light-secondary"
              >
                {grade.user.firstName} {grade.user.lastName}
              </th>
              <td className="px-4 py-2 ">
                {editId === grade.id ? (
                  <input
                    className="dark:bg-dark-quinary"
                    type="number"
                    value={grade.midtermGrade}
                    onChange={(e) => handleChange(e, grade.id, 'midtermGrade')}
                  />
                ) : (
                  grade.midtermGrade
                )}
              </td>
              <td className="px-4 py-2 ">
                {editId === grade.id ? (
                  <input
                    className="dark:bg-dark-quinary"
                    type="number"
                    value={grade.seminarGrade}
                    onChange={(e) => handleChange(e, grade.id, 'seminarGrade')}
                  />
                ) : (
                  grade.seminarGrade
                )}
              </td>
              <td className="px-4 py-2 ">
                {editId === grade.id ? (
                  <input
                    className="dark:bg-dark-quinary"
                    type="number"
                    value={grade.finalGrade}
                    onChange={(e) => handleChange(e, grade.id, 'finalGrade')}
                  />
                ) : (
                  grade.finalGrade
                )}
              </td>
              <td className="px-4 py-2">
                {grade.seminarGrade + grade.midtermGrade + grade.finalGrade}
              </td>
              <td className="px-4 py-2">
                {calculatePoints(
                  grade.seminarGrade + grade.midtermGrade + grade.finalGrade
                )}
              </td>
              <td className="px-2 py-3">
                {editId === grade.id ? (
                  <FaSave
                    color="#2563eb"
                    onClick={() => handleSaveClick(grade)}
                  />
                ) : (
                  <FaPen
                    color="#2563eb"
                    onClick={() => handleEditClick(grade.id)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditGrade;

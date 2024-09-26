import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPen, FaTrash } from 'react-icons/fa';
import axios from 'axios';

import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../ui/Breadcrumb';
import FloatingCard from '../ui/FloatingCard';
import Modal from '../components/Modal';
import Table from '../components/Table';
import FormDropdown from '../components/FormDropdown';

const url = process.env.REACT_APP_BACKEND_URL;

const ManageTimetables = () => {
  const [timetables, setTimetables] = useState([]);
  const [studyPrograms, setStudyPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [program, setProgram] = useState('');
  const [semester, setSemester] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentTimetable, setCurrentTimetable] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${url}/timetables`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTimetables(response.data);
      } catch (error) {
        console.error('Error fetching timetables', error);
        toast.error('Error fetching timetables');
      }
    };
    fetchTimetables();
  }, []);

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
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsAddModalOpen(false);
    setIsViewMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${url}/timetables`,
        { program: selectedProgram, semester },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Timetable created successfully');
        setTimetables([...timetables, response.data]);
        closeModal();
      }
    } catch (error) {
      console.error('Error creating timetable:', error);
      toast.error('Error creating timetable');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${url}/timetables/${currentTimetable.id}`,
        { program, semester },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success('Timetable updated successfully');
        const updatedTimetables = timetables.map((tt) =>
          tt.id === currentTimetable.id ? { ...tt, program, semester } : tt
        );
        setTimetables(updatedTimetables);
        closeModal();
      }
    } catch (error) {
      console.error('Error updating timetable:', error);
      toast.error('Error updating timetable');
    }
  };

  const openViewModal = (timetable) => {
    setCurrentTimetable(timetable);
    setIsAddModalOpen(true);
  };

  const openEditTimetableModal = (timetable) => {
    setCurrentTimetable(timetable);
    setIsAddModalOpen(true);
  };

  const openDeleteModal = (timetable) => {
    setCurrentTimetable(timetable);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${url}/timetables/${currentTimetable.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimetables(timetables.filter((tt) => tt.id !== currentTimetable.id));
      toast.success('Timetable deleted successfully');
    } catch (error) {
      toast.error('Error deleting timetable');
    } finally {
      setIsDeleteModalOpen(false);
      setCurrentTimetable(null);
    }
  };

  const openViewTimetableModal = (timetable) => {
    setCurrentTimetable(timetable);
    setProgram(timetable.program);
    setSemester(timetable.semester);
    setIsViewMode(true);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Manage Timetables" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {timetables.map((timetable) => (
          <FloatingCard
            key={timetable.id}
            title={timetable.program}
            actionButton={
              <FaPen
                color="#3b82f6"
                onClick={() => openEditTimetableModal(timetable)}
              />
            }
            deleteButton={
              <FaTrash
                color="#dc2626"
                onClick={() => openDeleteModal(timetable)}
              />
            }
          >
            <p className="mb-1.5">Semester: {timetable.semester}</p>

            <button
              className="text-light-blue hover:text-dark-blue"
              onClick={() =>
                openViewTimetableModal(() => openViewModal(timetable))
              }
            >
              View Timetable
            </button>
          </FloatingCard>
        ))}
      </div>

      {isModalOpen && (
        <Modal closeModal={closeModal}>
          <div className="flex flex-col items-center justify-center">
            <label htmlFor="program">Program</label>
            <FormDropdown
              name="studyProgram"
              value={selectedProgram}
              onChange={handleProgramChange}
              options={studyPrograms.map((program) => program.degree)}
            />

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-center mt-4"
            >
              <label htmlFor="semester">Semester</label>
              <input
                type="text"
                id="semester"
                placeholder="Semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
                className="input-field"
              />

              <button
                type="submit"
                className="bg-light-blue hover:bg-dark-blue text-light-primary font-semibold py-2 px-4 rounded-lg shadow-md w-full mt-4"
              >
                Create New Timetable
              </button>
            </form>
          </div>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal closeModal={() => setIsDeleteModalOpen(false)}>
          <div className="flex flex-col items-center justify-center">
            <p>Are you sure you want to delete this timetable?</p>
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

      {isAddModalOpen && currentTimetable && (
        <Modal closeModal={closeModal}>
          <Table
            degree={currentTimetable.program}
            semester={currentTimetable.semester}
            currentTimetableId={currentTimetable.id}
            isEditable={true}
          />
        </Modal>
      )}

      {isViewMode && currentTimetable && (
        <Modal closeModal={closeModal}>
          <Table
            degree={currentTimetable.program}
            semester={currentTimetable.semester}
            currentTimetableId={currentTimetable.id}
            isEditable={false}
          />
        </Modal>
      )}

      <button
        onClick={openModal}
        className="bg-light-blue hover:bg-dark-blue text-light-primary font-semibold py-2 px-4 rounded-lg shadow-md w-1/4"
      >
        Create New
      </button>
    </DefaultLayout>
  );
};

export default ManageTimetables;

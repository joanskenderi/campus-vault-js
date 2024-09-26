import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const times = ['8:30', '9:30', '10:30', '11:30', '12:30', '13:30', '14:30'];

const isWeekend = (day) => day === 'Saturday' || day === 'Sunday';

const url = process.env.REACT_APP_BACKEND_URL;

const Table = ({ degree, semester, currentTimetableId, isEditable }) => {
  const [timetableEntries, setTimetableEntries] = useState([]);
  const [editedEntries, setEditedEntries] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(`${url}/timetables`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          degree,
          semester,
        },
      })
      .then((response) => {
        const entries = response.data.flatMap((timetable) => timetable.entries);
        setTimetableEntries(entries);
      })
      .catch((error) => {
        console.error('Error fetching timetable entries:', error);
      });
  }, [degree, semester]);

  const handleEditCell = (day, time, subject) => {
    setEditedEntries((prev) => ({
      ...prev,
      [`${day}-${time}`]: { day, time, subject },
    }));
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    const updates = Object.values(editedEntries);

    const payload = {
      program: degree,
      semester,
      entries: updates.map((entry) => ({
        where: { day: entry.day, time: entry.time },
        data: { subject: entry.subject },
      })),
    };

    try {
      const response = await axios.put(
        `${url}/timetables/${currentTimetableId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success('Changes saved successfully');
        setTimetableEntries(response.data.entries);
        setEditedEntries({});
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Error saving changes');
    }
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-8 rounded-sm bg-light-primary dark:bg-dark-secondary border border-light-secondary dark:border-light-quinary">
        <div className="p-2.5 xl:p-5 border-r border-b border-light-secondary dark:border-light-quinary">
          <h5 className="text-sm font-medium uppercase text-dark-primary dark:text-light-primary">
            Time / Day
          </h5>
        </div>
        {days.map((day) => (
          <div
            key={day}
            className={`p-2.5 xl:p-5 text-center border-r border-b border-light-secondary dark:border-light-quinary ${
              isWeekend(day) ? 'bg-light-red' : ''
            }`}
          >
            <h5
              className={`text-sm font-medium uppercase ${
                isWeekend(day)
                  ? 'text-dark-red'
                  : 'text-dark-primary dark:text-light-primary'
              }`}
            >
              {day}
            </h5>
          </div>
        ))}
        {times.map((time, timeIndex) => (
          <React.Fragment key={time}>
            <div
              className={`p-2.5 xl:p-5 border-r border-b border-light-secondary dark:border-light-quinary ${
                timeIndex === times.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <p className="text-sm text-dark-primary dark:text-light-primary">
                {time}
              </p>
            </div>
            {days.map((day, dayIndex) => (
              <div
                key={`${day}-${time}`}
                className={`p-2.5 xl:p-5 flex items-center justify-center border-r border-b border-light-secondary dark:border-light-quinary ${
                  isWeekend(day) ? 'bg-light-red' : ''
                } ${timeIndex === times.length - 1 ? 'border-b-0' : ''} ${
                  dayIndex === days.length - 1 ? 'border-r-0' : ''
                }`}
              >
                {!isWeekend(day) ? (
                  isEditable ? (
                    <input
                      className="bg-transparent border-b border-light-blue w-full h-full text-center"
                      value={
                        editedEntries[`${day}-${time}`]?.subject ||
                        timetableEntries.find(
                          (entry) => entry.day === day && entry.time === time
                        )?.subject ||
                        ''
                      }
                      onChange={(e) =>
                        handleEditCell(day, time, e.target.value)
                      }
                    />
                  ) : (
                    <span>
                      {editedEntries[`${day}-${time}`]?.subject ||
                        timetableEntries.find(
                          (entry) => entry.day === day && entry.time === time
                        )?.subject ||
                        ''}
                    </span>
                  )
                ) : null}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      {isEditable && (
        <button
          onClick={handleSaveChanges}
          className="bg-light-blue hover:bg-dark-blue text-light-primary font-semibold py-2 px-4 rounded-lg shadow-md mt-4"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default Table;

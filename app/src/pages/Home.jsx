import React, { useState, useEffect } from 'react';
import { FaChalkboardTeacher, FaPen, FaUserFriends } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import DefaultLayout from '../layout/DefaultLayout';
import FloatingCard from '../ui/FloatingCard';
import CommunicationButton from '../ui/CommunicationButton';
import studentImage from '../assets/student.png';

const times = ['8:30', '9:30', '10:30', '11:30', '12:30', '13:30', '14:30'];

export const quotes = [
  {
    saying:
      'Education is the most powerful weapon which you can use to change the world.',
    author: 'Nelson Mandela',
  },
  {
    saying: 'The roots of education are bitter, but the fruit is sweet.',
    author: 'Aristotle',
  },
  {
    saying:
      "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: 'Dr. Seuss',
  },
  {
    saying:
      'Education is not the filling of a pail, but the lighting of a fire.',
    author: 'William Butler Yeats',
  },
  {
    saying:
      'The beautiful thing about learning is that no one can take it away from you.',
    author: 'B.B. King',
  },
];

const communicationChannels = [
  {
    text: 'Go to Outlook',
    onClick: () => {
      window.open('https://outlook.office.com/', '_blank');
    },
  },
  {
    text: 'Go to Microsoft Teams',
    onClick: () => {
      window.open('https://teams.microsoft.com/', '_blank');
    },
  },
];

const getRandomQuote = () => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};
const randomQuote = getRandomQuote();

const url = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const [userInfo, setUserInfo] = useState({});
  const [users, setUsers] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [userId, setUserId] = useState(null);
  const role = useSelector((state) => state.auth.role);

  const lecturers = users.filter(
    (user) => user.role === 'Lecturer' && user.id !== userId
  );
  const secretaries = users.filter(
    (user) => user.role === 'Secretary' && user.id !== userId
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    setUserId(userId);

    axios
      .get(`${url}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { firstName, lastName } = response.data;
        setUserInfo({ firstName, lastName });
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }

        console.error('Error fetching user data:', error);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(`${url}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }

        console.error('Error fetching users:', error);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(`${url}/timetables`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTimetables(response.data);
      })
      .catch((error) => {
        console.error('Error fetching timetables:', error);
      });
  }, []);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const today = daysOfWeek[currentDate.getDay()];

  const currentDaySchedule = timetables.flatMap((timetable) =>
    timetable.entries.filter((entry) => entry.day === today)
  );

  const isWeekend = today === 'Saturday' || today === 'Sunday';

  return (
    <DefaultLayout>
      <div className="flex justify-between bg-gradient-to-br from-light-primary to-light-quinary dark:bg-dark-primary rounded-xl p-10 transition transform hover:scale-105">
        <div className="flex flex-col justify-start p-4">
          <div className="text-xs text-dark-tertiary pb-40">
            {formattedDate}
          </div>
          <div className="text-4xl text-dark-primary pb-10">
            Welcome {userInfo.firstName} {userInfo.lastName}!
          </div>
          <div className="text-sm text-dark-tertiary">
            {randomQuote.saying} - <b>{randomQuote.author}</b>
          </div>
        </div>

        <div className="w-1/3 max-h-[40vh] h-full items-center justify-center text-light-primary overflow-hidden mt-2 mb-2 hidden xl:flex">
          <img src={studentImage} alt="student" className="max-h-[33vh]" />
        </div>
      </div>

      <div className="mt-10 space-y-8 xl:space-y-0 xl:grid xl:grid-cols-2 xl:gap-8">
        {role === 'Student' && (
          <>
            <div className="w-full">
              <FloatingCard title={`Schedule for ${today}`}>
                {isWeekend ? (
                  <div className="p-5 text-center text-lg text-dark-primary dark:text-light-primary">
                    It's the weekend! No classes scheduled.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 rounded-sm bg-light-primary dark:bg-dark-secondary border border-light-secondary dark:border-light-quinary">
                    <div className="p-2 xl:p-4 border-r border-b border-light-secondary dark:border-light-quinary">
                      <h5 className="text-sm font-medium uppercase text-dark-primary dark:text-light-primary">
                        Time
                      </h5>
                    </div>
                    <div className="p-2 xl:p-4 border-b border-light-secondary dark:border-light-quinary">
                      <h5 className="text-sm font-medium uppercase text-dark-primary dark:text-light-primary">
                        Class
                      </h5>
                    </div>

                    {times.map((time, index) => (
                      <React.Fragment key={index}>
                        <div
                          className={`p-2 xl:p-4 border-r border-light-secondary dark:border-light-quinary ${
                            index === times.length - 1 ? '' : 'border-b'
                          }`}
                        >
                          <p className="text-sm text-dark-primary dark:text-light-primary">
                            {time}
                          </p>
                        </div>
                        <div
                          className={`p-2 xl:p-4 ${
                            index === times.length - 1 ? '' : 'border-b'
                          } border-light-secondary dark:border-light-quinary`}
                        >
                          <p className="text-sm text-dark-primary dark:text-light-primary">
                            {currentDaySchedule.find(
                              (entry) => entry.time === time
                            )?.subject || '-'}
                          </p>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </FloatingCard>
            </div>

            <div className="w-full">
              <FloatingCard title="Contact University's Lecturers">
                {lecturers.map((lecturer, index) => (
                  <div key={index} className="mb-6 flex items-center gap-5">
                    <div className="overflow-hidden h-12 w-12 mr-1">
                      <FaChalkboardTeacher
                        className="h-full w-full object-cover"
                        color="#2563eb"
                      />
                    </div>
                    <div className="flex flex-col text-dark-primary dark:text-light-primary">
                      <h4 className="text-md">
                        {lecturer.firstName} {lecturer.lastName}
                      </h4>
                      <div className="flex items-center">
                        <FaPen color="#2563eb" className="mr-1" />
                        <a
                          href={`mailto:${lecturer.email}`}
                          className="underline text-dark-blue"
                        >
                          {lecturer.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </FloatingCard>
              <FloatingCard
                title="Official Contact Channels"
                className="p-6 bg-light-primary rounded-lg shadow-md"
              >
                <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 pb-8">
                  {communicationChannels.map((channel, index) => (
                    <CommunicationButton key={index} onClick={channel.onClick}>
                      {channel.text}
                    </CommunicationButton>
                  ))}
                </div>
              </FloatingCard>
            </div>
          </>
        )}

        {role === 'Lecturer' && (
          <>
            <div className="w-full">
              <FloatingCard title="Your Colleagues">
                {lecturers.map((lecturer, index) => (
                  <div key={index} className="mb-6 flex items-center gap-5">
                    <div className="overflow-hidden h-12 w-12 mr-1">
                      <FaUserFriends
                        className="h-full w-full object-cover"
                        color="#2563eb"
                      />
                    </div>
                    <div className="flex flex-col text-dark-primary dark:text-light-primary">
                      <h4 className="text-md">
                        {lecturer.firstName} {lecturer.lastName}
                      </h4>
                      <div className="flex items-center">
                        <FaPen color="#2563eb" className="mr-1" />
                        <a
                          href={`mailto:${lecturer.email}`}
                          className="underline text-dark-blue"
                        >
                          {lecturer.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </FloatingCard>
            </div>

            <div className="w-full">
              <FloatingCard
                title="Official Contact Channels"
                className="p-6 bg-light-primary rounded-lg shadow-md"
              >
                <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 pb-8">
                  {communicationChannels.map((channel, index) => (
                    <CommunicationButton key={index} onClick={channel.onClick}>
                      {channel.text}
                    </CommunicationButton>
                  ))}
                </div>
              </FloatingCard>
            </div>
          </>
        )}

        {role === 'Secretary' && (
          <>
            <div className="w-full">
              <FloatingCard title="Your Colleagues">
                {secretaries.map((secretary, index) => (
                  <div key={index} className="mb-6 flex items-center gap-5">
                    <div className="overflow-hidden h-12 w-12 mr-1">
                      <FaUserFriends
                        className="h-full w-full object-cover"
                        color="#2563eb"
                      />
                    </div>
                    <div className="flex flex-col text-dark-primary dark:text-light-primary">
                      <h4 className="text-md">
                        {secretary.firstName} {secretary.lastName}
                      </h4>
                      <div className="flex items-center">
                        <FaPen color="#2563eb" className="mr-1" />
                        <a
                          href={`mailto:${secretary.email}`}
                          className="underline text-dark-blue"
                        >
                          {secretary.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </FloatingCard>
            </div>

            <div className="w-full">
              <FloatingCard
                title="Official Contact Channels"
                className="p-6 bg-light-primary rounded-lg shadow-md"
              >
                <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 pb-8">
                  {communicationChannels.map((channel, index) => (
                    <CommunicationButton key={index} onClick={channel.onClick}>
                      {channel.text}
                    </CommunicationButton>
                  ))}
                </div>
              </FloatingCard>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Home;

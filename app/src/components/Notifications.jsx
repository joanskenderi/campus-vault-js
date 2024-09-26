import { useEffect, useRef, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { __, concat, filter, not, path, pipe, propEq } from 'ramda';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { useSocket } from '../contexts/socket';
import Modal from './Modal';

const url = process.env.REACT_APP_BACKEND_URL;

const Notifications = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const socket = useSocket();
  const userId = useSelector(path(['auth', 'userId']));

  // useEffect(() => {
  //   axios
  //     .get(`${url}/notifications/unread/users/${userId}`)
  //     .then(path(['data', 'notifications']))
  //     .then(setNotifications);

  //   socket.on('notification', pipe(Array, concat, setNotifications));

  //   return () => socket.off('notification');
  // }, []);

  useEffect(() => {
    axios
      .get(`${url}/notifications/unread/users/${userId}`)
      .then((response) => response.data.notifications || [])
      .then(setNotifications);

    socket.on('notification', (notification) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    return () => socket.off('notification');
  }, [socket, userId]);

  // useEffect(() => {
  //   notifications.length === 0 && setShowDropdown(false);
  // }, [notifications]);

  useEffect(() => {
    if (Array.isArray(notifications) && notifications.length === 0) {
      setShowDropdown(false);
    }
  }, [notifications]);

  const handleNotificationClick = (notification) => {
    setModalContent(notification);
    axios.get(`${url}/notifications/view/${notification.id}`).then(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((n) => n.id !== notification.id)
      );
    });
  };

  // const handleNotificationClick = (notification) => {
  //   setModalContent(notification);
  //   axios
  //     .get(`${url}/notifications/view/${notification.id}`)
  //     .then(() =>
  //       setNotifications(filter(pipe(propEq(notification.id, 'id'), not)))
  //     );
  // };

  const closeModal = () => {
    setModalContent(null);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      <FaBell
        className="h-5 w-5 text-light-secondary cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      />

      {notifications?.length ? (
        <div className="absolute w-2 h-2 rounded-lg bg-dark-red top-[-2px] right-0"></div>
      ) : null}

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-light-primary border border-light-secondary shadow-lg rounded-md z-10">
          <div className="py-1">
            {notifications?.length ? (
              notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`px-4 py-2 cursor-pointer ${
                    index < notifications?.length - 1
                      ? 'border-b border-light-secondary'
                      : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <p className="text-md font-medium text-dark-primary">
                    {notification.title}
                  </p>
                  <p className="text-sm text-dark-quinary">
                    {notification.content}
                  </p>
                  <p className="text-xs text-light-quinary">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-4 py-2">
                <p className="text-sm text-dark-quinary">
                  No new notifications
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {modalContent && (
        <Modal closeModal={closeModal}>
          <div className="flex flex-col items-center justify-center h-52 text-center">
            <h2 className="text-3xl font-bold text-dark-primary mb-6">
              {modalContent.title}
            </h2>
            <p className="text-lg text-dark-tertiary mb-6">
              {modalContent.content}
            </p>
            <p className="text-md text-light-quinary absolute bottom-4 right-4">
              {new Date(modalContent.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Notifications;

import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../ui/Breadcrumb';
import StaticCard from '../ui/StaticCard';

const url = process.env.REACT_APP_BACKEND_URL;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = jwtDecode(token).id;

    axios
      .get(`${url}/notifications/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setNotifications(response.data.notifications);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }

        console.error('Error fetching notifications:', error);
      });
  }, []);

  const handleMarkAsRead = (id) => {
    axios
      .get(`${url}/notifications/view/${id}`)
      .then(() => {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, viewed: true } : notif
          )
        );
        window.location.reload();
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }

        console.error('Error updating notification:', error);
      });
  };

  const handleMarkAsUnread = (id) => {
    axios
      .get(`${url}/notifications/unview/${id}`)
      .then(() => {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id
              ? { ...notif, viewed: false, viewedAt: null }
              : notif
          )
        );
        window.location.reload();
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.href = '/login';
          window.localStorage.removeItem('token');
        }

        console.error('Error updating notification:', error);
      });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Notifications" />

      <div className="flex flex-col">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <StaticCard title={notification.title} key={notification.id}>
              <div className="flex flex-row items-center mb-2">
                <p className="text-gray-700">{notification.content}</p>
                <span className="mr-3 ml-3">-</span>
                <p className="text text-gray-500">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>

                <button
                  className={`mt-2 mb-2 ml-auto px-3 py-1 rounded ${
                    notification.viewed ? 'bg-dark-red' : 'bg-light-blue'
                  } text-light-primary`}
                  onClick={() =>
                    notification.viewed
                      ? handleMarkAsUnread(notification.id)
                      : handleMarkAsRead(notification.id)
                  }
                >
                  {notification.viewed ? 'Mark as Unread' : 'Mark as Read'}
                </button>
              </div>
            </StaticCard>
          ))
        ) : (
          <p>No notifications available</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Notifications;

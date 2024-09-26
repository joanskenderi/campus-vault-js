import { useDispatch, useSelector } from 'react-redux';
import {
  FaCalendar,
  FaDoorOpen,
  FaHistory,
  FaHome,
  FaPen,
  FaQuestion,
  FaTasks,
  FaUser,
} from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';

import PageTitle from '../components/PageTitle';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Timetable from '../pages/Timetable';
import Grades from '../pages/Grades';
import Faq from '../pages/Faq';
import Login from '../pages/Login';
import ManageUsers from '../pages/ManageUsers';
import Notifications from '../pages/Notifications';
import { login, logout, setRole, setUserId } from '../store/authSlice';
import { useSocket } from '../contexts/socket';
import { path, prop } from 'ramda';
import { jwtDecode } from 'jwt-decode';
import ManageTimetables from '../pages/ManageTimetables';
import ManageGrades from '../pages/ManageGrades';

const GuestRoute = ({ title, component: Component }) => {
  const socket = useSocket();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (isLoggedIn) return <Navigate to="/home" replace />;

  const token = localStorage.getItem('token');

  if (!token)
    return (
      <>
        <PageTitle title={title} />
        <Component />
      </>
    );

  const { id, role } = jwtDecode(token);

  socket.emit('join_room', `user${id}`);
  socket.emit('join_room', `for_${role}`);

  dispatch(setUserId(id));
  dispatch(setRole(role));
  dispatch(login());

  <Navigate to="/home" replace />;
};

const AuthenticatedRoute = ({ title, component: Component }) => {
  const socket = useSocket();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (isLoggedIn)
    return (
      <>
        <PageTitle title={title} />
        <Component />
      </>
    );

  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" replace />;

  const { id, role } = jwtDecode(token);

  if (!(id || role)) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  socket.emit('join_room', `user${id}`);
  socket.emit('join_room', `for_${role}`);

  dispatch(setUserId(id));
  dispatch(setRole(role));
  dispatch(login());

  return Component;
};

const LogoutButton = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userId, role } = useSelector(prop('auth'));

  const handleLogout = () => {
    socket.emit('leave_room', `user${userId}`);
    socket.emit('leave_room', `for_${role}`);
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div
      onClick={handleLogout}
      className="cursor-pointer flex items-center w-full h-full px-4 py-2"
    >
      <FaDoorOpen />
      <span className="ml-2">Log Out</span>
    </div>
  );
};

export const sidebarItems = [
  { path: '/', icon: FaHome, label: 'Dashboard' },
  { path: '/profile', icon: FaUser, label: 'Profile' },
  { path: '/timetable', icon: FaCalendar, label: 'Timetable' },
  { path: '/notifications', icon: FaHistory, label: 'Notifications' },
  { path: '/manage-users', icon: FaPen, label: 'Manage Users' },
  { path: '/manage-timetables', icon: FaCalendar, label: 'Manage Timetables' },
  { path: '/manage-grades', icon: FaTasks, label: 'Manage Grades' },
  { path: '/grades', icon: FaTasks, label: 'Grades' },
  { path: '/faq', icon: FaQuestion, label: 'FAQ' },
  { path: '/login', icon: LogoutButton, label: '' },
];

export const routes = [
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/home',
    element: (
      <AuthenticatedRoute title="Home | Campus Vault" component={Home} />
    ),
  },
  {
    path: '/profile',
    element: (
      <AuthenticatedRoute title="Profile | Campus Vault" component={Profile} />
    ),
  },
  {
    path: '/notifications',
    element: (
      <AuthenticatedRoute
        title="Notifications | Campus Vault"
        component={Notifications}
      />
    ),
  },
  {
    path: '/manage-users',
    element: (
      <AuthenticatedRoute
        title="Manage Users | Campus Vault"
        component={ManageUsers}
      />
    ),
  },
  {
    path: '/manage-timetables',
    element: (
      <AuthenticatedRoute
        title="Manage Timetables | Campus Vault"
        component={ManageTimetables}
      />
    ),
  },
  {
    path: '/manage-grades',
    element: (
      <AuthenticatedRoute
        title="Manage Grades | Campus Vault"
        component={ManageGrades}
      />
    ),
  },
  {
    path: '/timetable',
    element: (
      <AuthenticatedRoute
        title="Timetable | Campus Vault"
        component={Timetable}
      />
    ),
  },
  {
    path: '/grades',
    element: (
      <AuthenticatedRoute title="Grades | Campus Vault" component={Grades} />
    ),
  },
  {
    path: '/faq',
    element: <AuthenticatedRoute title="FAQ | Campus Vault" component={Faq} />,
  },
  {
    path: '/login',
    element: <GuestRoute title="Login | Campus Vault" component={Login} />,
  },
  { path: '*', element: <Navigate to="/home" replace /> },
];

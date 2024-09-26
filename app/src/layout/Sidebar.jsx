import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaBars } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import ColorThemeSwitch from '../ui/ColorThemeSwitch';
import { sidebarItems } from '../routes';
import book from '../assets/book.png';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;
  const role = useSelector((state) => state.auth.role);

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());

    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const filteredSidebarItems = sidebarItems.filter((item) => {
    if (item.path === '/grades' || item.path === '/timetable') {
      return role === 'Student';
    }

    if (item.path === '/manage-grades') {
      return role === 'Lecturer';
    }

    if (item.path === '/manage-users' || item.path === '/manage-timetables') {
      return role === 'Secretary';
    }

    return true;
  });

  return (
    <aside
      ref={sidebar}
      className={`absolute lg:relative left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-dark-primary transition-transform duration-300 ease-linear ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-6 lg:hidden">
        <NavLink to="/profile">
          <h1 className="text-3xl text-light-primary">Campus Vault</h1>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="lg:hidden"
        >
          {sidebarOpen ? (
            <FaArrowLeft className="fill-current" color="white" size={18} />
          ) : (
            <FaBars className="fill-current" color="white" size={18} />
          )}
        </button>
      </div>

      <div className="hidden lg:flex items-center justify-center gap-2 px-6 py-6">
        <NavLink to="/">
          <div className="flex items-center">
            <img src={book} alt="Book Icon" className="w-8 h-8 mr-2" />
            <h1 className="text-3xl text-light-primary">Campus Vault</h1>
          </div>
        </NavLink>
      </div>

      {/* Menu */}
      <div className="flex flex-col overflow-y-auto transition-all duration-300 ease-linear flex-grow">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {filteredSidebarItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={`group relative flex items-center gap-2.5 rounded-xl ${
                      item.label !== '' ? 'py-2 px-4' : ''
                    } font-medium text-light-primary transition-colors duration-300 ease-in-out hover:bg-dark-tertiary transform hover:scale-105 ${
                      (pathname === item.path ||
                        (pathname === '/' && item.path === '/')) &&
                      'bg-dark-secondary dark:bg-dark-tertiary'
                    }`}
                  >
                    <item.icon className="fill-current" size={18} />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="mt-auto px-4 py-4">
          <button className="flex items-center gap-3.5 font-medium transition-colors duration-300 ease-in-out">
            <ColorThemeSwitch />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

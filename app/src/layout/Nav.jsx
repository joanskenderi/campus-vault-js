import { Link } from 'react-router-dom';
import { FaBars, FaArrowLeft } from 'react-icons/fa';

import UserInformation from '../components/UserInformation';
import Notifications from '../components/Notifications';

const Nav = (props) => {
  return (
    <header className="sticky top-0 z-40 flex w-full shadow-sm bg-gradient-to-l from-dark-quinary to-dark-primary">
      <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger menu */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-50 block rounded border border-light-tertiary bg-light-primary p-1.5 shadow dark:border-dark-secondary dark:bg-dark-primary lg:hidden"
          >
            {props.sidebarOpen ? (
              <FaArrowLeft className="fill-current" color="white" size={18} />
            ) : (
              <FaBars
                className={`fill-current ${
                  props.isDarkMode ? 'text-light-primary' : 'text-dark-primary'
                }`}
                size={18}
              />
            )}
          </button>

          <Link className="block flex-shrink-0 lg:hidden" to="/">
            <h1 className="text-2xl text-light-primary">Campus Vault</h1>
          </Link>
        </div>

        <div className="hidden sm:block"></div>

        <div className="flex items-center gap-8">
          <Notifications />
          <UserInformation />
        </div>
      </div>
    </header>
  );
};

export default Nav;

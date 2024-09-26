import { useState } from 'react';

import Nav from './Nav';
import Sidebar from './Sidebar';

const DefaultLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="dark:bg-dark-secondary dark:text-light-primary">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isDarkMode={isDarkMode}
        />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Nav
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isDarkMode={isDarkMode}
          />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;

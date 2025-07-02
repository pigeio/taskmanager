import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom'; // 🟢 Import useLocation
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation(); // 🟢 Get the current route
  const activeMenu = location.pathname; // 🟢 Use pathname as active menu

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <div className="">
      <Navbar activeMenu={activeMenu} onMenuClick={toggleMenu} />

      {user && (
        <div className="flex">
          {/* Sidebar for large screens */}
          <div className="hidden max-[1080px]:hidden md:block">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Sidebar for mobile screens */}
          {isMenuOpen && (
            <div className="fixed inset-0 z-50 bg-white md:hidden max-[1080px]:block">
              <SideMenu activeMenu={activeMenu} />
              <button
                className="absolute top-4 right-4 text-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                ✕
              </button>
            </div>
          )}

          {/* Page content */}
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;






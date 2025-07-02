import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleClick = (path) => {
    if (path === "/logout") {
      handleLogout();
      return;
    }
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    }
  }, [user]);

  return (
    <div className="w-64 p-4 bg-white shadow-lg h-full">
      {/* User Info */}
      <div className="text-center mb-6">
        <img
          src={user?.profileImageUrl || "/default-avatar.png"}
          alt="Profile"
          className="w-16 h-16 mx-auto rounded-full object-cover"
        />
        {user?.role === "admin" && (
          <div className="text-xs text-gray-600 mt-1">Admin</div>
        )}
        <h5 className="font-semibold mt-2">{user?.name || "User"}</h5>
        {user?.email && (
           <p className="text-xs text-gray-600 mt-1">{user.email}</p>
        )}
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {sideMenuData.map((item, index) => {
          const isActive = activeMenu?.startsWith(item.path);
          return (
            <button
              key={`menu_${index}`}
              onClick={() => handleClick(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-left ${
                isActive ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'
              }`}
            >
              <item.icon className="text-lg" />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;


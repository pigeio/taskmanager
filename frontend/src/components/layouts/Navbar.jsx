import React, { useState } from "react";
import { HiOutlineX, HiOutlineMenu } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="navbar-container">
      <button
        className="menu-toggle-btn"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="icon" />
        ) : (
          <HiOutlineMenu className="icon" />
        )}
      </button>

      <h2 className="navbar-title">Task Manager</h2>

      {openSideMenu && (
        <div className="side-menu-container">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;


import React from "react";
import Logo from "../Animation/Logo";
import "./Navbar.css";
const Navbar = () => {
  return (
    <nav className="nav-container">
      <Logo height={50} width={50} /> <span>Covid-19 India</span>
    </nav>
  );
};

export default Navbar;

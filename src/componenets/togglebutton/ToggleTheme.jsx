import React, { useState } from "react";
import "./ToggleTheme.css"; 
import { useTheme } from "../../context/ThemeContext";

import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";


const ToggleSwitch = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} />
      <span className="slider">
      </span>
      {theme === "dark" && <div className="dark-mode"><MdDarkMode /></div>}
      {theme === "light" && <div className="light-mode"><MdOutlineLightMode /></div>}
      
      
    </label>
  );
};

export default ToggleSwitch;

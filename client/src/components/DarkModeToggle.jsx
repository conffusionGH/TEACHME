import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = React.useState()


  return (
    <motion.button 
      whileTap={{ scale: 0.9 }}
      onClick={() => setDarkMode(!darkMode)}
      className="text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark text-xl"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <FaSun /> : <FaMoon />}
    </motion.button>
  );
};

export default DarkModeToggle;